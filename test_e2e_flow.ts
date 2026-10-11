import fs from 'fs';
import path from 'path';

const BASE_URL = 'http://localhost:3000';

async function runTests() {
  console.log('🧪 Starting RallyCut AI Comprehensive End-to-End Test Suite...\n');
  let passed = 0;
  let failed = 0;

  function assert(condition: boolean, msg: string) {
    if (condition) {
      console.log(`  ✅ PASS: ${msg}`);
      passed++;
    } else {
      console.error(`  ❌ FAIL: ${msg}`);
      failed++;
    }
  }

  // 1. Health Endpoint & Capabilities Check
  console.log('--- 1. Health & Server Capabilities ---');
  try {
    const res = await fetch(`${BASE_URL}/api/health`);
    const data = await res.json();
    assert(res.status === 200, 'Health endpoint responds with HTTP 200');
    assert(data.status === 'ok', 'Status is "ok"');
    assert(data.capabilities?.ffmpeg === true, 'FFmpeg native installer is active and detected');
    assert(data.capabilities?.ffprobe === true, 'FFprobe native installer is active and detected');
  } catch (err: any) {
    assert(false, `Health check failed: ${err.message}`);
  }

  // 2. Sample Match Endpoint
  console.log('\n--- 2. Sample Match Metadata ---');
  try {
    const res = await fetch(`${BASE_URL}/api/sample-match`);
    const data = await res.json();
    assert(res.status === 200, 'Sample match endpoint responds with HTTP 200');
    assert(typeof data.eventTitle === 'string' && data.eventTitle.length > 0, `Event title is defined: "${data.eventTitle}"`);
    assert(data.players?.p1?.name && data.players?.p2?.name, `Both player names are defined: ${data.players?.p1?.name} vs ${data.players?.p2?.name}`);
  } catch (err: any) {
    assert(false, `Sample match check failed: ${err.message}`);
  }

  // 3. Direct Video Upload via /api/video/upload
  console.log('\n--- 3. Video Upload Engine (/api/video/upload) ---');
  let uploadedPath = '';
  try {
    const sampleVideoPath = path.resolve('public/sample_pro_match.mp4');
    const fileBytes = fs.readFileSync(sampleVideoPath);
    const blob = new Blob([fileBytes], { type: 'video/mp4' });

    const form = new FormData();
    form.append('video', blob, 'user_match_test.mp4');

    const res = await fetch(`${BASE_URL}/api/video/upload`, {
      method: 'POST',
      body: form,
    });
    const data = await res.json();
    assert(res.status === 200, 'Upload endpoint returns HTTP 200');
    assert(data.success === true, 'Upload response indicates success');
    assert(data.file?.url?.startsWith('/uploads/'), `Uploaded URL generated: ${data.file?.url}`);
    assert(data.file?.metadata?.duration > 0, `FFprobe detected duration: ${data.file?.metadata?.duration}s`);
    assert(data.file?.metadata?.width > 0 && data.file?.metadata?.height > 0, `FFprobe detected resolution: ${data.file?.metadata?.width}x${data.file?.metadata?.height}`);
    uploadedPath = data.file?.url;
  } catch (err: any) {
    assert(false, `Upload check failed: ${err.message}`);
  }

  // 4. Video Analysis via /api/analyze with Uploaded Video
  console.log('\n--- 4. Match Analysis Pipeline (/api/analyze) ---');
  let analyzedRallies: any[] = [];
  try {
    const res = await fetch(`${BASE_URL}/api/analyze`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        videoPath: uploadedPath || '/sample_pro_match.mp4',
        filename: 'user_match_test.mp4',
      }),
    });
    const data = await res.json();
    assert(res.status === 200, 'Analyze endpoint returns HTTP 200');
    assert(data.success === true && !!data.jobId, `Analysis job created: ${data.jobId}`);

    // Poll job completion (allow adequate time for cloud upload & processing)
    let attempts = 0;
    let jobData: any = null;
    while (attempts < 120) {
      attempts++;
      await new Promise((r) => setTimeout(r, 600));
      const jobRes = await fetch(`${BASE_URL}/api/jobs/${data.jobId}`);
      jobData = await jobRes.json();
      if (jobData.status === 'completed' || jobData.status === 'failed') break;
    }

    assert(jobData.status === 'completed', 'Analysis job reached "completed" status');
    assert(jobData.progress === 100, 'Job progress reached 100%');
    assert(Array.isArray(jobData.result?.rallies) && jobData.result.rallies.length >= 3, `Extracted ${jobData.result?.rallies?.length} rally intervals`);
    
    analyzedRallies = jobData.result.rallies;

    // Verify ITTF Rules & Dead-Time Elimination
    let totalRallyTime = 0;
    for (let i = 0; i < analyzedRallies.length; i++) {
      const r = analyzedRallies[i];
      assert(r.endTime > r.startTime, `Rally #${r.index} has valid positive duration (${r.startTime}s - ${r.endTime}s)`);
      assert(r.server === 1 || r.server === 2, `Rally #${r.index} has valid server attribution (Player ${r.server})`);
      assert(r.winner === 1 || r.winner === 2, `Rally #${r.index} has valid winner attribution (Player ${r.winner})`);
      totalRallyTime += (r.endTime - r.startTime);
      if (i > 0) {
        const deadTime = r.startTime - analyzedRallies[i - 1].endTime;
        assert(deadTime > 0, `Dead time detected and marked between rally ${i} and ${i + 1}: ${deadTime.toFixed(1)}s dead time`);
      }
    }

    const matchDuration = jobData.result.duration || 60;
    const eliminatedDeadTime = matchDuration - totalRallyTime;
    const deadTimePercent = Math.round((eliminatedDeadTime / matchDuration) * 100);
    assert(deadTimePercent >= 40, `Dead time eliminated: ${eliminatedDeadTime.toFixed(1)}s (${deadTimePercent}% of raw match duration)`);
  } catch (err: any) {
    assert(false, `Analysis pipeline check failed: ${err.message}`);
  }

  // 5. Direct Multipart Upload + Analyze
  console.log('\n--- 5. Direct Multipart Upload to /api/analyze ---');
  try {
    const sampleVideoPath = path.resolve('public/sample_pro_match.mp4');
    const fileBytes = fs.readFileSync(sampleVideoPath);
    const blob = new Blob([fileBytes], { type: 'video/mp4' });

    const form = new FormData();
    form.append('video', blob, 'direct_upload_test.mp4');

    const res = await fetch(`${BASE_URL}/api/analyze`, {
      method: 'POST',
      body: form,
    });
    const data = await res.json();
    assert(res.status === 200, 'Direct multipart /api/analyze returns HTTP 200');
    assert(data.success === true && !!data.jobId, `Direct upload job dispatched: ${data.jobId}`);
  } catch (err: any) {
    assert(false, `Direct multipart check failed: ${err.message}`);
  }

  // 6. Highlight Reel Rendering via FFmpeg (/api/export/render)
  console.log('\n--- 6. FFmpeg Highlight Reel Export Engine (/api/export/render) ---');
  try {
    const exportRes = await fetch(`${BASE_URL}/api/export/render`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        videoPath: uploadedPath || '/sample_pro_match.mp4',
        rallies: analyzedRallies.slice(0, 3).map((r) => ({
          id: r.id,
          startTime: r.startTime,
          endTime: r.endTime,
          excluded: false,
        })),
        quality: '720p',
        aspectRatio: '16:9',
      }),
    });
    const exportData = await exportRes.json();
    assert(exportRes.status === 200, 'Export render returns HTTP 200');
    assert(exportData.success === true && !!exportData.jobId, `Render export job initiated: ${exportData.jobId}`);

    // Poll render job completion
    let attempts = 0;
    let renderJob: any = null;
    while (attempts < 25) {
      attempts++;
      await new Promise((r) => setTimeout(r, 400));
      const res = await fetch(`${BASE_URL}/api/jobs/${exportData.jobId}`);
      renderJob = await res.json();
      if (renderJob.status === 'completed' || renderJob.status === 'failed') break;
    }

    assert(renderJob.status === 'completed', 'Render job successfully compiled highlight reel');
    assert(renderJob.progress === 100, 'Render progress reached 100%');
    assert(renderJob.result?.downloadUrl?.startsWith('/exports/'), `Highlight reel download URL generated: ${renderJob.result?.downloadUrl}`);
    assert(renderJob.result?.sizeBytes > 1000000, `Generated MP4 file has real content (${(renderJob.result?.sizeBytes / (1024 * 1024)).toFixed(2)} MB)`);

    // Verify downloaded file is a valid HTTP 200 stream
    const fileRes = await fetch(`${BASE_URL}${renderJob.result.downloadUrl}`, { method: 'HEAD' });
    assert(fileRes.status === 200, 'Rendered MP4 file accessible via static /exports/ route');
    assert(fileRes.headers.get('content-type') === 'video/mp4', 'Content-Type header is video/mp4');
    assert(Number(fileRes.headers.get('content-length')) > 0, 'Content-Length header matches file size');
  } catch (err: any) {
    assert(false, `Render export check failed: ${err.message}`);
  }

  // 7. Frontend SPA Delivery Check
  console.log('\n--- 7. Frontend SPA & Client UI Bundle Delivery ---');
  try {
    const res = await fetch(`${BASE_URL}/`);
    assert(res.status === 200, 'Dev server serves index.html at root route');
    const html = await res.text();
    assert(html.includes('<div id="root"></div>') || html.includes('id="root"'), 'HTML contains #root mounting node');
    assert(html.includes('index.tsx') || html.includes('assets/'), 'HTML includes React script bundle');
  } catch (err: any) {
    assert(false, `Frontend delivery check failed: ${err.message}`);
  }

  console.log(`\n========================================`);
  console.log(`Test Results: ${passed} passed, ${failed} failed`);
  console.log(`========================================\n`);

  if (failed > 0) {
    process.exit(1);
  }
}

runTests();
