export default function Footer() {
  return (
    <footer className="footer">
      <div className="container footer__inner">
        <p>
          DevPulse is a read-only GitHub dashboard built with React + Vite. Data comes
          from the{' '}
          <a href="https://docs.github.com/rest" target="_blank" rel="noreferrer">
            GitHub REST API
          </a>
          . Not affiliated with GitHub.
        </p>
        <p className="footer__meta">
          No login · No tokens · 60 requests/hour · 5-minute cache
        </p>
      </div>
    </footer>
  )
}
