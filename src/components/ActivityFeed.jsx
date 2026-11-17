import {
  ActivityIcon,
  AlertIcon,
  CodeIcon,
  ForkIcon,
  GitCommitIcon,
  GitPullRequestIcon,
  RepoIcon,
  StarIcon,
  TagIcon,
} from './Icons.jsx'
import { formatDateTime, repoShortName, timeAgo } from '../lib/format.js'

const EVENT_STYLES = {
  PushEvent: { icon: GitCommitIcon, tone: 'green' },
  CreateEvent: { icon: CodeIcon, tone: 'cyan' },
  WatchEvent: { icon: StarIcon, tone: 'amber' },
  ForkEvent: { icon: ForkIcon, tone: 'pink' },
  PullRequestEvent: { icon: GitPullRequestIcon, tone: 'cyan' },
  IssuesEvent: { icon: AlertIcon, tone: 'amber' },
  ReleaseEvent: { icon: TagIcon, tone: 'green' },
  PublicEvent: { icon: RepoIcon, tone: 'cyan' },
  DeleteEvent: { icon: AlertIcon, tone: 'pink' },
}

function capitalize(value = '') {
  return value.charAt(0).toUpperCase() + value.slice(1)
}

function describe(event) {
  const count = event.size || 1

  switch (event.type) {
    case 'PushEvent':
      return (
        <>
          Pushed <strong>{count}</strong> {count === 1 ? 'commit' : 'commits'} to
        </>
      )
    case 'CreateEvent': {
      const refName = event.ref ? repoShortName(event.ref) : ''
      return (
        <>
          Created {event.refType || 'repository'}
          {refName ? (
            <>
              {' '}
              <strong>{refName}</strong>
            </>
          ) : null}{' '}
          in
        </>
      )
    }
    case 'WatchEvent':
      return <>Starred</>
    case 'ForkEvent':
      return <>Forked</>
    case 'PullRequestEvent': {
      const pr = event.pullRequest
      const merged = event.action === 'closed' && pr?.merged
      return (
        <>
          {merged ? 'Merged' : capitalize(event.action || 'Updated')} pull request
          {pr?.number ? (
            <>
              {' '}
              <a href={pr.url} target="_blank" rel="noreferrer">
                #{pr.number}
              </a>
            </>
          ) : null}{' '}
          in
        </>
      )
    }
    case 'IssuesEvent':
      return (
        <>
          {capitalize(event.action || 'Updated')} issue
          {event.issue ? (
            <>
              {' '}
              <strong>#{event.issue}</strong>
            </>
          ) : null}{' '}
          in
        </>
      )
    case 'ReleaseEvent':
      return <>Published a release in</>
    case 'PublicEvent':
      return <>Made public</>
    case 'DeleteEvent':
      return (
        <>
          Deleted {event.refType || 'a ref'}
          {event.ref ? ` ${repoShortName(event.ref)}` : ''} in
        </>
      )
    default:
      return (
        <>{capitalize(event.type.replace(/Event$/, '').replace(/([A-Z])/g, ' $1'))} in</>
      )
  }
}

export default function ActivityFeed({ events }) {
  const recent = events.slice(0, 8)

  return (
    <section className="panel activity">
      <div className="panel__head">
        <div>
          <p className="kicker">Public events</p>
          <h2 className="panel__title">Recent activity</h2>
        </div>
        <span className="panel__tag live">
          <span className="live-dot" />
          live
        </span>
      </div>

      {recent.length === 0 ? (
        <p className="empty">No recent public activity found for this account.</p>
      ) : (
        <ol className="timeline">
          {recent.map((event) => {
            const style = EVENT_STYLES[event.type] || {
              icon: ActivityIcon,
              tone: 'cyan',
            }
            const Icon = style.icon
            return (
              <li className="event" key={event.id}>
                <span className={`event__icon event__icon--${style.tone}`}>
                  <Icon />
                </span>
                <div className="event__body">
                  <p className="event__text">
                    {describe(event)}{' '}
                    <a
                      className="event__repo"
                      href={`https://github.com/${event.repo}`}
                      target="_blank"
                      rel="noreferrer"
                    >
                      {repoShortName(event.repo)}
                    </a>
                  </p>
                  <p className="event__meta">
                    <span>{event.type.replace('Event', '')}</span>
                    <span>·</span>
                    <time
                      dateTime={event.createdAt}
                      title={formatDateTime(event.createdAt)}
                    >
                      {timeAgo(event.createdAt)}
                    </time>
                  </p>
                </div>
              </li>
            )
          })}
        </ol>
      )}

      <p className="panel__footnote">
        Showing the latest public events GitHub exposes for this account.
      </p>
    </section>
  )
}
