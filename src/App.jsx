import { useCallback, useEffect, useRef, useState } from 'react'
import Dashboard from './components/Dashboard.jsx'
import ErrorState from './components/ErrorState.jsx'
import Footer from './components/Footer.jsx'
import Header from './components/Header.jsx'
import Hero from './components/Hero.jsx'
import LoadingState from './components/LoadingState.jsx'
import { loadUser } from './lib/github.js'

const RECENT_KEY = 'devpulse:recent'

function readRecent() {
  try {
    const parsed = JSON.parse(localStorage.getItem(RECENT_KEY) || '[]')
    return Array.isArray(parsed)
      ? parsed.filter((item) => typeof item === 'string').slice(0, 5)
      : []
  } catch {
    return []
  }
}

function persistRecent(list) {
  try {
    localStorage.setItem(RECENT_KEY, JSON.stringify(list))
  } catch {
    // Recent searches are a convenience, not a requirement.
  }
}

export default function App() {
  const initialUser =
    typeof window === 'undefined'
      ? ''
      : new URLSearchParams(window.location.search).get('u') || ''

  const [query, setQuery] = useState(initialUser)
  const [status, setStatus] = useState(initialUser ? 'loading' : 'idle')
  const [data, setData] = useState(null)
  const [error, setError] = useState(null)
  const [recent, setRecent] = useState(readRecent)
  const requestId = useRef(0)
  const resultsRef = useRef(null)
  const booted = useRef(false)

  const runSearch = useCallback(async (raw) => {
    const username = (raw ?? '').trim().replace(/^@+/, '')
    if (!username) return

    const id = requestId.current + 1
    requestId.current = id
    setQuery(username)
    setStatus('loading')
    setError(null)

    try {
      const result = await loadUser(username)
      if (id !== requestId.current) return

      setData(result)
      setStatus('success')

      const url = new URL(window.location.href)
      url.searchParams.set('u', result.user.login)
      window.history.replaceState({}, '', url)
      document.title = `${result.user.name || result.user.login} — DevPulse`

      setRecent((previous) => {
        const next = [
          result.user.login,
          ...previous.filter(
            (name) => name.toLowerCase() !== result.user.login.toLowerCase(),
          ),
        ].slice(0, 5)
        persistRecent(next)
        return next
      })

      window.scrollTo({ top: 0, behavior: 'auto' })
    } catch (caught) {
      if (id !== requestId.current) return
      setError(caught)
      setStatus('error')
    }
  }, [])

  useEffect(() => {
    if (booted.current) return
    booted.current = true
    const initial = new URLSearchParams(window.location.search).get('u')
    if (initial) runSearch(initial)
  }, [runSearch])

  const handleHome = useCallback(() => {
    requestId.current += 1
    setStatus('idle')
    setData(null)
    setError(null)
    setQuery('')
    document.title = 'DevPulse — GitHub Developer Analytics'
    const url = new URL(window.location.href)
    url.searchParams.delete('u')
    window.history.replaceState({}, '', url)
    window.scrollTo({ top: 0, behavior: 'auto' })
  }, [])

  const handlePick = useCallback(
    (username) => runSearch(username),
    [runSearch],
  )

  const handleRetry = useCallback(() => runSearch(query), [query, runSearch])

  const showDashboard = status === 'success' && data

  return (
    <div className="app">
      <div className="bg-grid" aria-hidden="true" />

      <Header
        onHome={handleHome}
        rate={showDashboard ? data.rate : null}
        fromCache={Boolean(showDashboard && data.fromCache)}
      />

      <main>
        {showDashboard ? (
          <Dashboard
            data={data}
            query={query}
            onQueryChange={setQuery}
            onSubmit={runSearch}
            loading={status === 'loading'}
            resultsRef={resultsRef}
          />
        ) : (
          <>
            {status === 'loading' ? (
              <LoadingState />
            ) : (
              <Hero
                query={query}
                onQueryChange={setQuery}
                onSubmit={runSearch}
                onPick={handlePick}
                loading={status === 'loading'}
                recent={recent}
              />
            )}

            {status === 'error' && (
              <ErrorState
                error={error}
                onRetry={handleRetry}
                onHome={handleHome}
              />
            )}
          </>
        )}
      </main>

      <Footer />
    </div>
  )
}
