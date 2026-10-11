import React, { useState, useEffect } from 'react';
import { useRallyCut } from '../../context/RallyCutContext';
import { KeyRound, X, ExternalLink, Check, Eye, EyeOff, Sparkles } from 'lucide-react';

interface GeminiKeyModalProps {
  onSuccess?: () => void;
}

export const GeminiKeyModal: React.FC<GeminiKeyModalProps> = ({ onSuccess }) => {
  const { isKeyModalOpen, setIsKeyModalOpen, geminiApiKey, setGeminiApiKey } = useRallyCut();
  const [keyInput, setKeyInput] = useState('');
  const [showSecret, setShowSecret] = useState(false);

  useEffect(() => {
    if (isKeyModalOpen) {
      setKeyInput(geminiApiKey || '');
    }
  }, [isKeyModalOpen, geminiApiKey]);

  if (!isKeyModalOpen) return null;

  const handleSave = () => {
    const trimmed = keyInput.trim();
    setGeminiApiKey(trimmed);
    setIsKeyModalOpen(false);

    window.dispatchEvent(
      new CustomEvent('rallycut-toast', {
        detail: {
          type: 'success',
          message: trimmed
            ? 'Gemini API Key configured! Gemini 2.5 Flash Multimodal Vision active.'
            : 'Gemini API Key removed. Using offline optical engine.',
        },
      }),
    );

    if (onSuccess) {
      onSuccess();
    }
  };

  const handleClear = () => {
    setGeminiApiKey('');
    setKeyInput('');
    setIsKeyModalOpen(false);

    window.dispatchEvent(
      new CustomEvent('rallycut-toast', {
        detail: {
          type: 'info',
          message: 'Gemini API Key removed. Using offline local engine.',
        },
      }),
    );
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="gemini-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in"
      onClick={() => setIsKeyModalOpen(false)}
    >
      <div
        className="w-full max-w-md rounded-2xl bg-slate-900 border border-slate-800 p-6 shadow-2xl space-y-4"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-white font-bold text-sm">
            <div className="w-8 h-8 rounded-lg bg-[#00F5D4]/15 text-[#00F5D4] flex items-center justify-center">
              <Sparkles className="w-4 h-4" />
            </div>
            <span id="gemini-modal-title">Google Gemini 2.5 Flash Vision</span>
          </div>
          <button
            onClick={() => setIsKeyModalOpen(false)}
            className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition-colors"
            aria-label="Close dialog"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <p className="text-xs text-slate-300 leading-relaxed">
          Gemini 2.5 Flash analyzes your uploaded match footage frame-by-frame, tracking ball toss, table impacts, and player strokes according to official ITTF rules to cut out dead time.
        </p>

        <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 space-y-2">
          <label className="text-[11px] font-mono text-slate-400 block">
            Google AI Studio API Key:
          </label>
          <div className="relative">
            <input
              type={showSecret ? 'text' : 'password'}
              placeholder="AIzaSy..."
              value={keyInput}
              onChange={(e) => setKeyInput(e.target.value)}
              className="w-full px-3 py-2 pr-10 rounded-lg bg-slate-900 border border-slate-700 text-xs font-mono text-white placeholder:text-slate-600 focus:outline-none focus:border-[#00F5D4]"
              autoFocus
            />
            <button
              type="button"
              onClick={() => setShowSecret(!showSecret)}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
              title={showSecret ? 'Hide key' : 'Show key'}
            >
              {showSecret ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
            </button>
          </div>
          <div className="flex items-center justify-between text-[11px] font-mono text-slate-500 pt-1">
            <span>Stored locally in your browser.</span>
            <a
              href="https://aistudio.google.com/app/apikey"
              target="_blank"
              rel="noreferrer"
              className="text-[#00F5D4] hover:underline flex items-center gap-1"
            >
              <span>Get Free Key</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>

        <div className="flex items-center justify-between pt-1">
          {geminiApiKey ? (
            <button
              onClick={handleClear}
              className="text-xs text-red-400 hover:text-red-300 font-mono"
            >
              Remove Key
            </button>
          ) : (
            <button
              onClick={() => setIsKeyModalOpen(false)}
              className="text-xs text-slate-400 hover:text-slate-200"
            >
              Continue without Key
            </button>
          )}

          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsKeyModalOpen(false)}
              className="px-3 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-white"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="px-4 py-2 rounded-xl bg-[#00F5D4] text-slate-950 font-bold text-xs hover:bg-[#20f7dc] shadow-md shadow-[#00F5D4]/20 transition-all flex items-center gap-1.5"
            >
              <Check className="w-3.5 h-3.5" />
              <span>Save & Use Gemini</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
