import React from 'react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { AlertCircle, RefreshCw, Home } from 'lucide-react';

interface ErrorBoundaryProps {
  children: React.ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
  errorInfo: React.ErrorInfo | null;
}

export class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { 
      hasError: false, 
      error: null,
      errorInfo: null
    };
  }

  static getDerivedStateFromError(error: Error): Partial<ErrorBoundaryState> {
    // Update state so the next render will show the fallback UI
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    // Log error details for debugging
    console.error('Error Boundary caught an error:', error, errorInfo);
    
    this.setState({
      error,
      errorInfo
    });

    // You can also log the error to an error reporting service here
    // Example: logErrorToService(error, errorInfo);
  }

  handleReset = () => {
    this.setState({ 
      hasError: false, 
      error: null,
      errorInfo: null
    });
  };

  handleReload = () => {
    window.location.reload();
  };

  handleGoHome = () => {
    window.location.href = '/';
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-blue-50 to-cyan-50">
          <Card className="p-8 max-w-2xl w-full text-center shadow-xl">
            {/* Error Icon */}
            <div className="flex justify-center mb-6">
              <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center">
                <AlertCircle className="w-12 h-12 text-red-500" />
              </div>
            </div>

            {/* Title */}
            <h1 className="text-3xl font-bold text-gray-900 mb-3">
              عذراً، حدث خطأ غير متوقع
            </h1>

            {/* Description */}
            <p className="text-gray-600 mb-6 text-lg">
              نعتذر عن الإزعاج. واجه التطبيق مشكلة غير متوقعة.
              <br />
              يرجى تحديث الصفحة أو العودة للصفحة الرئيسية.
            </p>

            {/* Error Details (Development mode) */}
            {process.env.NODE_ENV === 'development' && this.state.error && (
              <details className="mb-6 text-right">
                <summary className="cursor-pointer text-sm text-gray-500 hover:text-gray-700 mb-2">
                  عرض تفاصيل الخطأ (للمطورين)
                </summary>
                <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-sm text-right">
                  <p className="font-bold text-red-800 mb-2">
                    {this.state.error.toString()}
                  </p>
                  {this.state.errorInfo && (
                    <pre className="text-xs text-red-700 overflow-auto max-h-40 whitespace-pre-wrap text-left">
                      {this.state.errorInfo.componentStack}
                    </pre>
                  )}
                </div>
              </details>
            )}

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button 
                onClick={this.handleReload} 
                className="gap-2"
                size="lg"
              >
                <RefreshCw className="w-5 h-5" />
                تحديث الصفحة
              </Button>
              
              <Button 
                onClick={this.handleGoHome} 
                variant="outline"
                className="gap-2"
                size="lg"
              >
                <Home className="w-5 h-5" />
                العودة للرئيسية
              </Button>
            </div>

            {/* Help Text */}
            <p className="text-sm text-gray-500 mt-6">
              إذا استمرت المشكلة، يرجى التواصل مع الدعم الفني
            </p>
          </Card>
        </div>
      );
    }

    return this.props.children;
  }
}
