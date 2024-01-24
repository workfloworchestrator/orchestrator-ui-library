import React, { ErrorInfo, ReactNode } from 'react';

type ErrorBoundaryProps = {
    fallback?: ReactNode;
    children: ReactNode;
};

type ErrorBoundaryState = {
    hasError: boolean;
};

export class WfoErrorBoundary extends React.Component<
    ErrorBoundaryProps,
    ErrorBoundaryState
> {
    constructor(props: ErrorBoundaryProps) {
        super(props);
        this.state = { hasError: false };
    }

    static getDerivedStateFromError() {
        return { hasError: true };
    }

    componentDidCatch(error: Error, info: ErrorInfo) {
        console.error(error, info.componentStack);
    }

    render() {
        if (this.state.hasError) {
            if (this.props.fallback) {
                return this.props.fallback;
            }

            return (
                <p>
                    An unexpected error occurred, try to go back to the{' '}
                    <a href="/">home page</a>
                </p>
            );
        }

        return this.props.children;
    }
}
