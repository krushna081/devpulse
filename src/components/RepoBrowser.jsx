import { useEffect, useMemo, useState } from 'react'
import {
  ArrowUpRightIcon,
  ForkIcon,
  SearchIcon,
  StarIcon,
} from './Icons.jsx'
import {
  compactNumber,
  languageColor,
  prettyLanguage,
  timeAgo,
} from '../lib/format.js'

const PAGE_SIZE = 8

const SORTS = [
  { value: 'stars', label: 'Most stars' },
  { value: 'updated', label: 'Recently updated' },
  { value: 'name', label: 'Name A–Z' },
]

export default function RepoBrowser({ repos, publicRepoCount }) {
  const [search, setSearch] = useState('')
  const [sort, setSort] = useState('stars')
  const [language, setLanguage] = useState('all')
  const [sourcesOnly, setSourcesOnly] = useState(false)
  const [visible, setVisible] = useState(PAGE_SIZE)

  const languages = useMemo(() => {
    const counts = new Map()
    for (const repo of repos) {
      if (!repo.language) continue
      counts.set(repo.language, (counts.get(repo.language) || 0) + 1)
    }
    return [...counts.entries()]
      .sort((a, b) => b[1] - a[1])
      .slice(0, 9)
      .map(([name, count]) => ({ name, count }))
  }, [repos])

  const filtered = useMemo(() => {
    let list = repos

    if (sourcesOnly) list = list.filter((repo) => !repo.fork)
    if (language !== 'all') list = list.filter((repo) => repo.language === language)

    const query = search.trim().toLowerCase()
    if (query) {
      list = list.filter((repo) =>
        [repo.name, repo.description, repo.language, ...(repo.topics || [])]
          .filter(Boolean)
          .join(' ')
          .toLowerCase()
          .includes(query),
      )
    }

    const sorted = [...list]
    if (sort === 'stars') {
      sorted.sort(
        (a, b) =>
          b.stargazers_count - a.stargazers_count ||
          new Date(b.pushed_at) - new Date(a.pushed_at),
      )
    } else if (sort === 'updated') {
      sorted.sort(
        (a, b) =>
          new Date(b.pushed_at || b.updated_at) -
          new Date(a.pushed_at || a.updated_at),
      )
    } else {
      sorted.sort((a, b) => a.name.localeCompare(b.name))
    }
    return sorted
  }, [repos, search, sort, language, sourcesOnly])

  useEffect(() => {
    setVisible(PAGE_SIZE)
  }, [search, sort, language, sourcesOnly])

  const shown = filtered.slice(0, visible)
  const hasMore = visible < filtered.length

  return (
    <section className="panel repos" id="repos">
      <div className="panel__head">
        <div>
          <p className="kicker">Repository index</p>
          <h2 className="panel__title">All repositories</h2>
        </div>
        <span className="panel__tag">
          {filtered.length} / {repos.length} shown
        </span>
      </div>

      <div className="repos__controls">
        <label className="field repos__search">
          <SearchIcon />
          <span className="sr-only">Filter repositories</span>
          <input
            type="search"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Filter by name, topic, language…"
          />
        </label>

        <label className="field field--select">
          <span className="sr-only">Sort repositories</span>
          <select
            value={sort}
            onChange={(event) => setSort(event.target.value)}
          >
            {SORTS.map((option) => (
              <option value={option.value} key={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </label>

        <button
          type="button"
          className={`toggle ${sourcesOnly ? 'is-on' : ''}`}
          aria-pressed={sourcesOnly}
          onClick={() => setSourcesOnly((value) => !value)}
        >
          <span className="toggle__knob" />
          Sources only
        </button>
      </div>

      <div className="repos__chips" role="group" aria-label="Filter by language">
        <button
          type="button"
          className={`chip chip--filter ${language === 'all' ? 'is-active' : ''}`}
          onClick={() => setLanguage('all')}
        >
          All languages
        </button>
        {languages.map(({ name, count }) => (
          <button
            type="button"
            key={name}
            className={`chip chip--filter ${language === name ? 'is-active' : ''}`}
            onClick={() => setLanguage(name)}
          >
            <i
              className="lang-dot"
              style={{ background: languageColor(name) }}
            />
            {prettyLanguage(name)}
            <span className="chip__count">{count}</span>
          </button>
        ))}
      </div>

      {shown.length === 0 ? (
        <div className="empty empty--box">
          <p className="empty__title">No repositories match these filters.</p>
          <p>Try a different search, language, or turn off “Sources only”.</p>
        </div>
      ) : (
        <div className="repos__grid">
          {shown.map((repo) => (
            <article className="repo-row" key={repo.id}>
              <div className="repo-row__head">
                <a
                  className="repo-row__name"
                  href={repo.html_url}
                  target="_blank"
                  rel="noreferrer"
                >
                  {repo.name}
                </a>
                {repo.fork && <span className="repo-row__badge">fork</span>}
                {repo.archived && (
                  <span className="repo-row__badge repo-row__badge--archived">
                    archived
                  </span>
                )}
                <a
                  className="repo-row__open"
                  href={repo.html_url}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={`Open ${repo.name} on GitHub`}
                >
                  <ArrowUpRightIcon />
                </a>
              </div>

              <p className="repo-row__desc">
                {repo.description || 'No description provided.'}
              </p>

              {repo.topics?.length > 0 && (
                <div className="repo-row__topics">
                  {repo.topics.slice(0, 4).map((topic) => (
                    <span key={topic}>#{topic}</span>
                  ))}
                </div>
              )}

              <div className="repo-row__meta">
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
                  <StarIcon /> {compactNumber(repo.stargazers_count)}
                </span>
                <span>
                  <ForkIcon /> {compactNumber(repo.forks_count)}
                </span>
                <span className="repo-row__date">
                  {timeAgo(repo.pushed_at || repo.updated_at)}
                </span>
              </div>
            </article>
          ))}
        </div>
      )}

      <div className="repos__footer">
        <span>
          Showing {shown.length} of {filtered.length} matched repositories
          {publicRepoCount > repos.length
            ? ` · first ${repos.length} loaded from GitHub`
            : ''}
        </span>
        {hasMore && (
          <button
            type="button"
            className="btn btn--ghost"
            onClick={() => setVisible((value) => value + PAGE_SIZE)}
          >
            Load more
          </button>
        )}
      </div>
    </section>
  )
}
