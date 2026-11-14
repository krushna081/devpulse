import {
  RepoIcon,
  StarIcon,
  UserPlusIcon,
  UsersIcon,
} from './Icons.jsx'
import { compactNumber, formatNumber } from '../lib/format.js'

export default function StatsGrid({ user, repos }) {
  const sourceRepos = repos.filter((repo) => !repo.fork)
  const totalStars = sourceRepos.reduce(
    (sum, repo) => sum + (repo.stargazers_count || 0),
    0,
  )
  const totalForks = sourceRepos.reduce(
    (sum, repo) => sum + (repo.forks_count || 0),
    0,
  )

  const stats = [
    {
      index: '01',
      label: 'Public repos',
      value: user.public_repos,
      display: formatNumber(user.public_repos),
      note: `${sourceRepos.length} source projects scanned`,
      icon: RepoIcon,
      tone: 'green',
    },
    {
      index: '02',
      label: 'Stars earned',
      value: totalStars,
      display: totalStars >= 10_000 ? compactNumber(totalStars) : formatNumber(totalStars),
      note: `${formatNumber(totalForks)} forks across sources`,
      icon: StarIcon,
      tone: 'amber',
    },
    {
      index: '03',
      label: 'Followers',
      value: user.followers,
      display: user.followers >= 10_000 ? compactNumber(user.followers) : formatNumber(user.followers),
      note: 'watching this profile',
      icon: UsersIcon,
      tone: 'cyan',
    },
    {
      index: '04',
      label: 'Following',
      value: user.following,
      display: formatNumber(user.following),
      note: 'developers tracked',
      icon: UserPlusIcon,
      tone: 'pink',
    },
  ]

  return (
    <section className="stats" aria-label="Profile statistics">
      {stats.map(({ index, label, display, note, icon: Icon, tone }) => (
        <article className={`stat stat--${tone}`} key={label}>
          <div className="stat__head">
            <span className="stat__icon">
              <Icon />
            </span>
            <span className="stat__index">{index}</span>
          </div>
          <p className="stat__label">{label}</p>
          <p className="stat__value">{display}</p>
          <p className="stat__note">{note}</p>
        </article>
      ))}
    </section>
  )
}
