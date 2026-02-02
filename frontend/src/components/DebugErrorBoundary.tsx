import { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
    children?: ReactNode;
}

interface State {
    hasError: boolean;
    error: Error | null;
}

export class DebugErrorBoundary extends Component<Props, State> {
    public state: State = {
        hasError: false,
        error: null
    };

    public static getDerivedStateFromError(error: Error): State {
        return { hasError: true, error };
    }

    public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
        console.error('Uncaught error:', error, errorInfo);
    }

    public render() {
        if (this.state.hasError) {
            return (
                <div className="min-h-screen bg-[#1d182e] text-white flex flex-col items-center justify-center p-8 text-center space-y-4">
                    <h1 className="text-3xl font-bold text-red-500">Something went wrong</h1>
                    <p className="text-white/60">An error occurred while rendering the application.</p>
                    <div className="bg-black/40 p-6 rounded-xl border border-white/10 text-left overflow-auto max-w-2xl w-full max-h-[50vh]">
                        <code className="text-red-400 text-sm font-mono block mb-4">
                            {this.state.error?.toString()}
                        </code>
                        <p className="text-xs text-white/40 font-mono">Check console for full stack trace.</p>
                    </div>
                    <button
                        onClick={() => window.location.reload()}
                        className="px-6 py-2 bg-purple-600 rounded-lg font-bold hover:bg-purple-700 transition-colors"
                    >
                        Reload Application
                    </button>
                </div>
            );
        }

        return this.props.children;
    }
}
