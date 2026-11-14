import LanguageChart from './LanguageChart.jsx'
import ProfileCard from './ProfileCard.jsx'
import RepoBrowser from './RepoBrowser.jsx'
import RepoCard from './RepoCard.jsx'
import SearchBar from './SearchBar.jsx'
import StatsGrid from './StatsGrid.jsx'
import ActivityFeed from './ActivityFeed.jsx'
import DataCard from './DataCard.jsx'

function TopRepos({ repos }) {
  const top = repos
    .filter((repo) => !repo.fork)
    .sort(
      (a, b) =>
        b.stargazers_count - a.stargazers_count ||
        new Date(b.pushed_at) - new Date(a.pushed_at),
    )
    .slice(0, 4)

  return (
    <section className="panel top-repos">
      <div className="panel__head">
        <div>
          <p className="kicker">Portfolio</p>
          <h2 className="panel__title">Top repositories</h2>
        </div>
        <a className="panel__link" href="#repos">
          Browse all
        </a>
      </div>

      {top.length === 0 ? (
        <p className="empty">No source repositories to rank yet.</p>
      ) : (
        <div className="top-repos__grid">
          {top.map((repo, index) => (
            <RepoCard repo={repo} rank={index + 1} key={repo.id} />
          ))}
        </div>
      )}
    </section>
  )
}

export default function Dashboard({
  data,
  query,
  onQueryChange,
  onSubmit,
  loading,
  resultsRef,
}) {
  const { user, repos, events, rate, fromCache } = data

  return (
    <div className="dashboard container" ref={resultsRef}>
      <div className="dashboard__toolbar">
        <div>
          <p className="kicker">Profile analysis</p>
          <h1 className="dashboard__title">{user.name || user.login}</h1>
        </div>
        <SearchBar
          size="compact"
          value={query}
          onChange={onQueryChange}
          onSubmit={onSubmit}
          loading={loading}
          placeholder="Scan another username"
        />
      </div>

      <ProfileCard user={user} />
      <StatsGrid user={user} repos={repos} />

      <div className="dashboard__split">
        <LanguageChart repos={repos} />
        <TopRepos repos={repos} />
      </div>

      <RepoBrowser repos={repos} publicRepoCount={user.public_repos} />

      <div className="dashboard__split dashboard__split--bottom">
        <ActivityFeed events={events} />
        <DataCard
          rate={rate}
          fromCache={fromCache}
          repos={repos}
          events={events}
          user={user}
        />
      </div>
    </div>
  )
}
