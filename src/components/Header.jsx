import { GitHubIcon, PulseMark } from './Icons.jsx'

export default function Header({ onHome, rate, fromCache = false }) {
  return (
    <header className="topbar">
      <div className="container topbar__inner">
        <button
          className="brand"
          type="button"
          onClick={onHome}
          aria-label="DevPulse home"
        >
          <span className="brand__mark">
            <PulseMark />
          </span>
          <span className="brand__name">DevPulse</span>
          <span className="brand__version">v1.0</span>
        </button>

        <div className="topbar__right">
          {fromCache && <span className="pill pill--cache">Cached</span>}
          {rate && Number.isFinite(rate.remaining) && (
            <span
              className="pill pill--quota"
              title="GitHub API requests remaining this hour"
            >
              <span className="pill__dot" />
              API {rate.remaining}/{rate.limit}
            </span>
          )}
          <a
            className="topbar__link"
            href="https://docs.github.com/rest"
            target="_blank"
            rel="noreferrer"
          >
            <GitHubIcon />
            <span>REST API</span>
          </a>
        </div>
      </div>
    </header>
  )
}
