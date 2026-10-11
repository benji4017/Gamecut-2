declare module '@ffmpeg-installer/ffmpeg' {
  interface FfmpegInstaller {
    path: string;
    version: string;
    url: string;
  }
  const ffmpeg: FfmpegInstaller;
  export default ffmpeg;
}

declare module '@ffprobe-installer/ffprobe' {
  interface FfprobeInstaller {
    path: string;
    version: string;
    url: string;
  }
  const ffprobe: FfprobeInstaller;
  export default ffprobe;
}
