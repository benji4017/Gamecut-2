import React from 'react';

interface ErrorBoundaryProps {
  children: React.ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('RallyCut Error Boundary caught an error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[#0B0F17] flex items-center justify-center p-8">
          <div className="max-w-lg w-full p-8 rounded-2xl bg-slate-900/90 border border-red-500/40 shadow-2xl text-center space-y-5">
            <div className="w-16 h-16 mx-auto rounded-2xl bg-red-500/15 text-red-400 flex items-center justify-center text-3xl">
              ⚠️
            </div>
            <h2 className="text-xl font-bold text-white">Something went wrong</h2>
            <p className="text-sm text-slate-400 leading-relaxed">
              RallyCut encountered an unexpected error. This might be due to a corrupted video file or a network issue with the AI analysis engine.
            </p>
            <pre className="p-3 rounded-lg bg-slate-950 border border-slate-800 text-xs font-mono text-red-300 text-left overflow-x-auto max-h-32 overflow-y-auto">
              {this.state.error?.message || 'Unknown error'}
            </pre>
            <button
              onClick={() => {
                this.setState({ hasError: false, error: null });
                window.location.reload();
              }}
              className="px-6 py-2.5 rounded-xl bg-[#00F5D4] text-slate-950 font-bold text-sm hover:bg-[#20f7dc] transition-all active:scale-95"
            >
              Reload RallyCut
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
