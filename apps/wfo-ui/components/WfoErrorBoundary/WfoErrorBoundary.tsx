import React, { ErrorInfo, ReactNode } from 'react';

type ErrorBoundaryProps = {
    fallback: ReactNode;
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

    static getDerivedStateFromError(error: Error) {
        // Todo this can be removed
        console.error(error);
        return { hasError: true };
    }

    componentDidCatch(error: Error, info: ErrorInfo) {
        console.error(error, info.componentStack);
    }

    render() {
        if (this.state.hasError) {
            return this.props.fallback;
        }

        return this.props.children;
    }
}
