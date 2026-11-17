const API = 'https://api.github.com'
const CACHE_PREFIX = 'devpulse:v1:'
const CACHE_TTL = 5 * 60 * 1000
const USERNAME_RE = /^[a-z\d](?:[a-z\d]|-(?=[a-z\d])){0,38}$/i

export class GitHubError extends Error {
  constructor(message, code = 'api', meta = {}) {
    super(message)
    this.name = 'GitHubError'
    this.code = code
    Object.assign(this, meta)
  }
}

const HEADERS = {
  Accept: 'application/vnd.github+json',
  'X-GitHub-Api-Version': '2022-11-28',
}

async function request(path) {
  let response
  try {
    response = await fetch(`${API}${path}`, { headers: HEADERS })
  } catch {
    throw new GitHubError(
      'Network error. Check your connection and try again.',
      'network',
    )
  }

  const rate = {
    remaining: toNumber(response.headers.get('x-ratelimit-remaining')),
    limit: toNumber(response.headers.get('x-ratelimit-limit')),
    reset: toNumber(response.headers.get('x-ratelimit-reset')),
  }

  if (!response.ok) {
    if (response.status === 404) {
      throw new GitHubError(
        "We couldn't find that GitHub user. Check the spelling and try again.",
        'not-found',
        { rate },
      )
    }
    if (response.status === 403 || response.status === 429) {
      throw new GitHubError(
        'GitHub API rate limit reached. Wait a few minutes, then try again.',
        'rate-limit',
        { rate },
      )
    }
    throw new GitHubError(
      `GitHub returned an unexpected error (${response.status}). Try again shortly.`,
      'api',
      { rate },
    )
  }

  return { data: await response.json(), rate }
}

function toNumber(value) {
  const number = Number(value)
  return Number.isFinite(number) ? number : null
}

function trimEvent(event) {
  if (!event?.type) return null
  const payload = event.payload ?? {}
  return {
    id: event.id,
    type: event.type,
    createdAt: event.created_at,
    repo: event.repo?.name ?? '',
    action: payload.action ?? '',
    ref: payload.ref ?? '',
    refType: payload.ref_type ?? '',
    size: payload.size ?? 0,
    issue: payload.issue?.number ?? null,
    pullRequest: payload.pull_request
      ? {
          number: payload.pull_request.number,
          title: payload.pull_request.title ?? '',
          merged: Boolean(payload.pull_request.merged),
          url: payload.pull_request.html_url ?? '',
        }
      : null,
  }
}

function readCache(key) {
  try {
    const raw = sessionStorage.getItem(key)
    if (!raw) return null
    const cached = JSON.parse(raw)
    if (!cached?.fetchedAt || Date.now() - cached.fetchedAt > CACHE_TTL) {
      sessionStorage.removeItem(key)
      return null
    }
    return cached.data
  } catch {
    return null
  }
}

function writeCache(key, data) {
  try {
    sessionStorage.setItem(key, JSON.stringify({ fetchedAt: Date.now(), data }))
  } catch {
    // Session storage can be full or unavailable; caching is optional.
  }
}

export async function loadUser(rawUsername) {
  const username = rawUsername.trim().replace(/^@+/, '')
  if (!username) {
    throw new GitHubError('Enter a GitHub username to get started.', 'invalid')
  }
  if (!USERNAME_RE.test(username)) {
    throw new GitHubError('That does not look like a valid GitHub username.', 'invalid')
  }

  const cacheKey = `${CACHE_PREFIX}${username.toLowerCase()}`
  const cached = readCache(cacheKey)
  if (cached) return { ...cached, fromCache: true }

  const encoded = encodeURIComponent(username)
  const [userResult, reposResult] = await Promise.all([
    request(`/users/${encoded}`),
    request(`/users/${encoded}/repos?per_page=100&sort=updated`),
  ])

  // Public events are optional: some accounts have none, and a failure here
  // should not hide the rest of the dashboard.
  const eventsResult = await request(`/users/${encoded}/events/public?per_page=30`).catch(
    () => null,
  )

  const events = (eventsResult?.data ?? []).map(trimEvent).filter(Boolean)

  const rate = [userResult.rate, reposResult.rate, eventsResult?.rate]
    .filter((entry) => entry && Number.isFinite(entry.remaining))
    .reduce(
      (lowest, entry) => (!lowest || entry.remaining < lowest.remaining ? entry : lowest),
      null,
    )

  const data = {
    user: userResult.data,
    repos: reposResult.data,
    events,
    rate,
    fetchedAt: Date.now(),
  }

  writeCache(cacheKey, data)
  return { ...data, fromCache: false }
}
