"use client";

import { Button, cn } from "@uberskillz/ui";
import { AlertTriangle } from "lucide-react";
import { Component } from "react";

interface ErrorBoundaryProps {
  children: React.ReactNode;
  /** Optional fallback to render instead of the default error UI. */
  fallback?: React.ReactNode;
  className?: string;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

/**
 * React Error Boundary that catches render errors in child components
 * and displays a user-friendly error message with a retry button.
 *
 * Must be a class component per React's Error Boundary API.
 */
export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  private handleRetry = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (!this.state.hasError) {
      return this.props.children;
    }

    if (this.props.fallback) {
      return this.props.fallback;
    }

    return (
      <div
        className={cn(
          "flex flex-col items-center justify-center py-12 text-center",
          this.props.className,
        )}
      >
        <AlertTriangle className="mb-3 size-10 text-destructive" />
        <h3 className="font-semibold">Something went wrong</h3>
        <p className="mt-1 max-w-sm text-sm text-muted-foreground">
          {this.state.error?.message || "An unexpected error occurred."}
        </p>
        <Button variant="outline" className="mt-4" onClick={this.handleRetry}>
          Try again
        </Button>
      </div>
    );
  }
}
