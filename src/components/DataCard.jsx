import { ArrowUpRightIcon, GitHubIcon } from './Icons.jsx'

function resetLabel(timestamp) {
  if (!timestamp) return 'unknown reset'
  const minutes = Math.round((timestamp * 1000 - Date.now()) / 60_000)
  if (minutes <= 0) return 'resets soon'
  if (minutes < 60) return `resets in ~${minutes} min`
  return `resets in ~${Math.round(minutes / 60)} h`
}

export default function DataCard({ rate, fromCache, repos, events, user }) {
  const limit = rate?.limit || 60
  const remaining = Number.isFinite(rate?.remaining) ? rate.remaining : null
  const percent =
    remaining === null ? 0 : Math.max(0, Math.min(100, (remaining / limit) * 100))
  const low = remaining !== null && remaining <= 10

  return (
    <aside className="panel data-card">
      <div className="panel__head">
        <div>
          <p className="kicker">Session</p>
          <h2 className="panel__title">Data &amp; limits</h2>
        </div>
        <span className={`panel__tag ${fromCache ? 'is-cached' : ''}`}>
          {fromCache ? 'cache hit' : 'fresh fetch'}
        </span>
      </div>

      {remaining !== null && (
        <div className="quota">
          <div className="quota__top">
            <span>GitHub API quota</span>
            <strong className={low ? 'is-low' : ''}>
              {remaining}/{limit}
            </strong>
          </div>
          <div className="quota__track">
            <span
              className={`quota__fill ${low ? 'is-low' : ''}`}
              style={{ width: `${percent}%` }}
            />
          </div>
          <p className="quota__reset">{resetLabel(rate.reset)}</p>
        </div>
      )}

      <dl className="data-list">
        <div>
          <dt>Repositories loaded</dt>
          <dd>{repos.length}</dd>
        </div>
        <div>
          <dt>Public events</dt>
          <dd>{events.length}</dd>
        </div>
        <div>
          <dt>Cache window</dt>
          <dd>5 min</dd>
        </div>
        <div>
          <dt>Authentication</dt>
          <dd>None</dd>
        </div>
      </dl>

      <p className="panel__footnote">
        GitHub allows 60 unauthenticated API requests per hour per IP address. DevPulse
        reads public data only and caches profiles for five minutes.
      </p>

      <a
        className="btn btn--ghost data-card__link"
        href={`https://github.com/${user.login}`}
        target="_blank"
        rel="noreferrer"
      >
        <GitHubIcon />@{user.login}
        <ArrowUpRightIcon />
      </a>
    </aside>
  )
}
