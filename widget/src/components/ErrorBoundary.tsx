import React, { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
  errorInfo?: ErrorInfo;
}

class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Widget Error Boundary caught an error:', error, errorInfo);
    this.setState({
      error,
      errorInfo
    });
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          padding: '20px',
          border: '2px solid #dc3545',
          borderRadius: '8px',
          backgroundColor: '#f8d7da',
          color: '#721c24',
          fontFamily: 'Arial, sans-serif'
        }}>
          <h3 style={{ margin: '0 0 10px 0' }}>Widget Error</h3>
          <p style={{ margin: '0 0 10px 0' }}>
            Something went wrong while loading the widget. Please try refreshing the page.
          </p>
          {process.env.NODE_ENV === 'development' && (
            <details style={{ marginTop: '10px' }}>
              <summary style={{ cursor: 'pointer', fontWeight: 'bold' }}>
                Error Details (Development Mode)
              </summary>
              <pre style={{
                backgroundColor: '#f5f5f5',
                padding: '10px',
                marginTop: '10px',
                fontSize: '12px',
                overflow: 'auto',
                whiteSpace: 'pre-wrap'
              }}>
                {this.state.error && this.state.error.toString()}
                {this.state.errorInfo && this.state.errorInfo.componentStack}
              </pre>
            </details>
          )}
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
