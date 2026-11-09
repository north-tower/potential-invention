'use client'

import React, { Component, ErrorInfo, ReactNode } from 'react'

interface Props {
  children: ReactNode
}

interface State {
  hasError: boolean
  error?: Error
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
  }

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error }
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Weather App Error:', error, errorInfo)
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="rounded-atmos border border-line bg-snow px-5 py-6">
          <h3 className="font-serif-display text-2xl text-ink">Something went wrong.</h3>
          <p className="mt-2 text-sm text-ink-muted">
            {this.state.error?.message || 'The briefing could not be drawn.'}
          </p>
          <button
            type="button"
            onClick={() => this.setState({ hasError: false, error: undefined })}
            className="mt-4 rounded-full bg-ink px-4 py-2 text-sm text-snow"
          >
            Try again
          </button>
        </div>
      )
    }

    return this.props.children
  }
}
