"use client";

import { Component } from "react";
import { AlertTriangle } from "lucide-react";

export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error, info) {
    // Centralized place to hook up real error reporting later (Sentry, etc.)
    console.error("ErrorBoundary caught:", error, info);
  }

  render() {
    if (this.state.hasError) {
      return (
        this.props.fallback || (
          <div className="min-h-[300px] flex flex-col items-center justify-center text-center p-8">
            <div className="w-14 h-14 rounded-2xl bg-red-50 text-red-400 flex items-center justify-center mb-3">
              <AlertTriangle size={26} />
            </div>
            <p className="font-semibold text-slate-700">Something went wrong</p>
            <p className="text-sm text-slate-400 mt-1">This section couldn't be displayed. Try refreshing the page.</p>
            <button
              onClick={() => this.setState({ hasError: false })}
              className="mt-4 text-sm text-indigo-600 font-medium"
            >
              Try again
            </button>
          </div>
        )
      );
    }
    return this.props.children;
  }
}
