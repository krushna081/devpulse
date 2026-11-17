import { ArrowUpRightIcon, ForkIcon, StarIcon } from './Icons.jsx'
import { compactNumber, languageColor, prettyLanguage, timeAgo } from '../lib/format.js'

export default function RepoCard({ repo, rank }) {
  return (
    <article className="repo-card">
      <div className="repo-card__top">
        {rank && <span className="repo-card__rank">{String(rank).padStart(2, '0')}</span>}
        <span className={`repo-card__type ${repo.fork ? 'is-fork' : 'is-source'}`}>
          {repo.fork ? 'fork' : 'source'}
        </span>
        {repo.archived && <span className="repo-card__type is-archived">archived</span>}
        <a
          className="repo-card__open"
          href={repo.html_url}
          target="_blank"
          rel="noreferrer"
          aria-label={`Open ${repo.name} on GitHub`}
        >
          <ArrowUpRightIcon />
        </a>
      </div>

      <a
        className="repo-card__name"
        href={repo.html_url}
        target="_blank"
        rel="noreferrer"
      >
        {repo.name}
      </a>

      <p className="repo-card__desc">{repo.description || 'No description provided.'}</p>

      {repo.topics?.length > 0 && (
        <div className="repo-card__topics">
          {repo.topics.slice(0, 3).map((topic) => (
            <span key={topic}>#{topic}</span>
          ))}
        </div>
      )}

      <div className="repo-card__meta">
        {repo.language && (
          <span>
            <i
              className="lang-dot"
              style={{ background: languageColor(repo.language) }}
            />
            {prettyLanguage(repo.language)}
          </span>
        )}
        <span>
          <StarIcon />
          {compactNumber(repo.stargazers_count)}
        </span>
        <span>
          <ForkIcon />
          {compactNumber(repo.forks_count)}
        </span>
        <span className="repo-card__updated">
          {timeAgo(repo.pushed_at || repo.updated_at)}
        </span>
      </div>
    </article>
  )
}
