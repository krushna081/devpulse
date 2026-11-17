import SearchBar from './SearchBar.jsx'
import { ActivityIcon, CodeIcon, StarIcon } from './Icons.jsx'

const EXAMPLES = ['torvalds', 'gaearon', 'sindresorhus', 'addyosmani']

const FEATURES = [
  {
    index: '01',
    icon: StarIcon,
    title: 'Reputation at a glance',
    text: 'Stars, followers, and repo counts pulled straight from the source.',
  },
  {
    index: '02',
    icon: CodeIcon,
    title: 'Language DNA',
    text: 'See which languages actually dominate a developer’s public work.',
  },
  {
    index: '03',
    icon: ActivityIcon,
    title: 'Live activity',
    text: 'Recent pushes, releases, and pull requests — no database required.',
  },
]

export default function Hero({
  query,
  onQueryChange,
  onSubmit,
  onPick,
  loading,
  recent,
}) {
  return (
    <section className="hero container">
      <div className="hero__copy">
        <p className="hero__eyebrow">
          <span className="live-dot" />
          GitHub intelligence
          <span className="hero__eyebrow-divider">/</span>
          no login required
        </p>

        <h1 className="hero__title">
          Decode any developer&rsquo;s <span className="text-glow">footprint.</span>
        </h1>

        <p className="hero__lede">
          DevPulse turns a GitHub username into a clean, live dashboard — reputation,
          language DNA, top repositories, and recent activity in one scan.
        </p>

        <SearchBar
          value={query}
          onChange={onQueryChange}
          onSubmit={onSubmit}
          loading={loading}
        />

        <div className="hero__examples">
          <span className="hero__examples-label">Try</span>
          {EXAMPLES.map((example) => (
            <button
              key={example}
              type="button"
              className="chip"
              onClick={() => onPick(example)}
            >
              @{example}
            </button>
          ))}
        </div>

        {recent.length > 0 && (
          <div className="hero__examples hero__examples--recent">
            <span className="hero__examples-label">Recent</span>
            {recent.map((login) => (
              <button
                key={login}
                type="button"
                className="chip chip--muted"
                onClick={() => onPick(login)}
              >
                {login}
              </button>
            ))}
          </div>
        )}

        <p className="hero__hint">
          Press <kbd>/</kbd> to focus · <kbd>Enter</kbd> to scan
        </p>
      </div>

      <aside className="hero__preview" aria-hidden="true">
        <div className="preview">
          <div className="preview__bar">
            <span className="preview__dots">
              <i />
              <i />
              <i />
            </span>
            <span className="preview__path">devpulse://scan</span>
            <span className="preview__live">
              <span className="live-dot" />
              live
            </span>
          </div>

          <div className="preview__profile">
            <span className="preview__avatar">DP</span>
            <span>
              <strong>@developer</strong>
              <small>full-stack · 42 public repos</small>
            </span>
            <span className="preview__score">98.4</span>
          </div>

          <div className="preview__section">
            <p className="preview__label">Language DNA</p>
            <div className="preview__bars">
              <span style={{ width: '42%', background: '#3178c6' }} />
              <span style={{ width: '27%', background: '#f1e05a' }} />
              <span style={{ width: '18%', background: '#3572a5' }} />
              <span style={{ width: '13%', background: '#39ff88' }} />
            </div>
            <div className="preview__legend">
              <span>TypeScript 42%</span>
              <span>JavaScript 27%</span>
              <span>Python 18%</span>
            </div>
          </div>

          <div className="preview__stats">
            <span>
              <strong>1.2k</strong>
              <small>stars</small>
            </span>
            <span>
              <strong>248</strong>
              <small>followers</small>
            </span>
            <span>
              <strong>42</strong>
              <small>repos</small>
            </span>
          </div>

          <div className="preview__feed">
            <p className="preview__label">Recent activity</p>
            <div className="preview__event">
              <span className="preview__event-dot" />
              Pushed 3 commits to <em>dashboard</em>
              <small>2h</small>
            </div>
            <div className="preview__event">
              <span className="preview__event-dot" />
              Merged pull request <em>#128</em>
              <small>6h</small>
            </div>
            <div className="preview__event">
              <span className="preview__event-dot" />
              Released <em>v2.0.0</em>
              <small>1d</small>
            </div>
          </div>

          <div className="preview__scanline" />
        </div>
      </aside>

      <div className="hero__features">
        {FEATURES.map(({ index, icon: Icon, title, text }) => (
          <article className="feature" key={index}>
            <span className="feature__index">{index}</span>
            <span className="feature__icon">
              <Icon />
            </span>
            <h2>{title}</h2>
            <p>{text}</p>
          </article>
        ))}
      </div>
    </section>
  )
}
