import { AlertIcon, RefreshIcon } from './Icons.jsx'

const COPY = {
  'not-found': {
    title: 'User not found',
    hint: 'Double-check the username. GitHub usernames can contain letters, numbers, and single hyphens.',
  },
  'rate-limit': {
    title: 'Rate limit reached',
    hint: 'The anonymous GitHub API allows 60 requests per hour. Wait a few minutes — or browse directly on GitHub.',
  },
  network: {
    title: 'Network unavailable',
    hint: 'DevPulse could not reach api.github.com. Check your connection and try again.',
  },
  invalid: {
    title: 'Invalid username',
    hint: 'Enter a valid GitHub username, without spaces or extra symbols.',
  },
  api: {
    title: 'Something went wrong',
    hint: 'GitHub returned an unexpected response. Try again in a moment.',
  },
}

export default function ErrorState({ error, onRetry, onHome }) {
  const copy = COPY[error?.code] || COPY.api

  return (
    <section className="container error-wrap" aria-live="assertive">
      <div className="panel error">
        <span className="error__icon">
          <AlertIcon />
        </span>
        <div className="error__content">
          <p className="kicker">Scan failed</p>
          <h2 className="error__title">{copy.title}</h2>
          <p className="error__text">{error?.message || copy.hint}</p>
          <p className="error__hint">{copy.hint}</p>
          <div className="error__actions">
            <button className="btn btn--primary" type="button" onClick={onRetry}>
              <RefreshIcon />
              Try again
            </button>
            <button className="btn btn--ghost" type="button" onClick={onHome}>
              New search
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}
