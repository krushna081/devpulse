import { Component } from 'react'
import { AlertIcon, RefreshIcon } from './Icons.jsx'

export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError() {
    return { hasError: true }
  }

  componentDidCatch(error, info) {
    console.error('DevPulse render error:', error, info)
  }

  render() {
    if (!this.state.hasError) return this.props.children

    return (
      <section className="container error-wrap" role="alert">
        <div className="panel error">
          <span className="error__icon">
            <AlertIcon />
          </span>
          <div className="error__content">
            <p className="kicker">Unexpected error</p>
            <h1 className="error__title">DevPulse hit a snag</h1>
            <p className="error__text">
              The dashboard could not finish rendering. Reloading usually fixes this.
            </p>
            <div className="error__actions">
              <button
                className="btn btn--primary"
                type="button"
                onClick={() => window.location.reload()}
              >
                <RefreshIcon />
                Reload DevPulse
              </button>
            </div>
          </div>
        </div>
      </section>
    )
  }
}
