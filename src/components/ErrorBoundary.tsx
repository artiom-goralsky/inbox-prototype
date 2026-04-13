import React, { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('ErrorBoundary caught:', error, errorInfo);
    // #region agent log
    fetch('http://127.0.0.1:7657/ingest/fd01d022-d456-47e7-9ee3-eabbb6756821',{method:'POST',headers:{'Content-Type':'application/json','X-Debug-Session-Id':'adbd37'},body:JSON.stringify({sessionId:'adbd37',runId:'initial',hypothesisId:'H1',location:'src/components/ErrorBoundary.tsx:24',message:'ErrorBoundary captured runtime exception',data:{name:error?.name,message:error?.message,componentStack:errorInfo?.componentStack?.slice(0,500)},timestamp:Date.now()})}).catch(()=>{});
    // #endregion
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-secondary flex items-center justify-center p-4">
          <div className="bg-primary p-6 md:p-8 rounded-lg shadow-lg max-w-md w-full">
            <div className="text-center">
              <div className="text-4xl md:text-6xl mb-4">⚠️</div>
              <h1 className="text-xl md:text-2xl font-semibold text-primary mb-4">
                Something went wrong
              </h1>
              <p className="text-secondary mb-6 text-sm md:text-base">
                We&apos;re sorry, but something unexpected happened. Please try
                refreshing the page.
              </p>
              <button
                onClick={() => window.location.reload()}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm md:text-base"
              >
                Refresh Page
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
