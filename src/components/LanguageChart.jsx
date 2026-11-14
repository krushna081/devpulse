import { useMemo } from 'react'
import { languageColor, prettyLanguage } from '../lib/format.js'

export default function LanguageChart({ repos }) {
  const { segments, entries, sourceCount, languageCount, withLanguage } =
    useMemo(() => {
      const source = repos.filter((repo) => !repo.fork)
      const counts = new Map()
      for (const repo of source) {
        if (!repo.language) continue
        counts.set(repo.language, (counts.get(repo.language) || 0) + 1)
      }

      const total = [...counts.values()].reduce((sum, count) => sum + count, 0)
      const sorted = [...counts.entries()]
        .map(([name, count]) => ({
          name,
          count,
          pct: total > 0 ? (count / total) * 100 : 0,
        }))
        .sort((a, b) => b.count - a.count)

      let chartEntries = sorted.slice(0, 5)
      if (sorted.length > 5) {
        const rest = sorted.slice(5)
        const restCount = rest.reduce((sum, entry) => sum + entry.count, 0)
        chartEntries = [
          ...chartEntries,
          {
            name: 'Other',
            count: restCount,
            pct: total > 0 ? (restCount / total) * 100 : 0,
            other: true,
          },
        ]
      }

      const radius = 46
      const circumference = 2 * Math.PI * radius
      let cursor = 0
      const chartSegments = chartEntries.map((entry, index) => {
        const arc = (entry.pct / 100) * circumference
        const gap = chartEntries.length > 1 ? 4 : 0
        const visibleArc = Math.max(arc - gap, 0)
        const segment = {
          ...entry,
          color: entry.other ? '#4b5a66' : languageColor(entry.name, index),
          dasharray: `${visibleArc} ${circumference - visibleArc}`,
          dashoffset: -cursor,
        }
        cursor += arc
        return segment
      })

      return {
        segments: chartSegments,
        entries: chartEntries,
        sourceCount: source.length,
        languageCount: counts.size,
        withLanguage: total,
      }
    }, [repos])

  return (
    <section className="panel languages">
      <div className="panel__head">
        <div>
          <p className="kicker">Stack mix</p>
          <h2 className="panel__title">Language DNA</h2>
        </div>
        <span className="panel__tag">{sourceCount} source repos</span>
      </div>

      {segments.length === 0 ? (
        <p className="empty">
          No language data yet — this account has no source repositories with a
          detected language.
        </p>
      ) : (
        <div className="languages__body">
          <div className="donut-wrap">
            <svg
              className="donut"
              viewBox="0 0 120 120"
              role="img"
              aria-label={`Language distribution across ${withLanguage} repositories`}
            >
              <circle
                className="donut__track"
                cx="60"
                cy="60"
                r="46"
                fill="none"
              />
              {segments.map((segment) => (
                <circle
                  key={segment.name}
                  cx="60"
                  cy="60"
                  r="46"
                  fill="none"
                  stroke={segment.color}
                  strokeWidth="13"
                  strokeDasharray={segment.dasharray}
                  strokeDashoffset={segment.dashoffset}
                  transform="rotate(-90 60 60)"
                />
              ))}
            </svg>
            <div className="donut__center">
              <strong>{languageCount}</strong>
              <span>languages</span>
            </div>
          </div>

          <ul className="legend">
            {entries.map((entry, index) => (
              <li className="legend__item" key={entry.name}>
                <span
                  className="legend__dot"
                  style={{
                    background: entry.other
                      ? '#4b5a66'
                      : languageColor(entry.name, index),
                  }}
                />
                <span className="legend__name">
                  {entry.other ? 'Other' : prettyLanguage(entry.name)}
                </span>
                <span className="legend__count">
                  {entry.count} {entry.count === 1 ? 'repo' : 'repos'}
                </span>
                <span className="legend__pct">{Math.round(entry.pct)}%</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      <p className="panel__footnote">
        Shares are based on source (non-fork) repositories, one language per
        repo.
      </p>
    </section>
  )
}
