import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { GitHubError, loadUser } from './github.js'

const storage = new Map()

function response(data, { status = 200, rate = {} } = {}) {
  return {
    ok: status >= 200 && status < 300,
    status,
    headers: {
      get(name) {
        return rate[name] ?? null
      },
    },
    json: async () => data,
  }
}

const rateHeaders = {
  'x-ratelimit-remaining': '59',
  'x-ratelimit-limit': '60',
  'x-ratelimit-reset': '1767225600',
}

beforeEach(() => {
  storage.clear()
  vi.stubGlobal('sessionStorage', {
    getItem: (key) => storage.get(key) ?? null,
    setItem: (key, value) => storage.set(key, value),
    removeItem: (key) => storage.delete(key),
  })
})

afterEach(() => {
  vi.unstubAllGlobals()
  vi.restoreAllMocks()
})

function mockSuccessfulFetch() {
  const fetchMock = vi
    .fn()
    .mockResolvedValueOnce(response({ login: 'octocat' }, { rate: rateHeaders }))
    .mockResolvedValueOnce(
      response([{ id: 1, name: 'Hello-World' }], { rate: rateHeaders }),
    )
    .mockResolvedValueOnce(
      response(
        [
          {
            id: 'event-1',
            type: 'PushEvent',
            created_at: '2026-01-01T00:00:00Z',
            repo: { name: 'octocat/Hello-World' },
            payload: { ref: 'refs/heads/main', size: 1 },
          },
        ],
        { rate: rateHeaders },
      ),
    )
  vi.stubGlobal('fetch', fetchMock)
  return fetchMock
}

describe('loadUser', () => {
  it('normalizes the username, loads public data, and returns the lowest rate limit', async () => {
    const fetchMock = mockSuccessfulFetch()

    const result = await loadUser('  @OctoCat ')

    expect(result.user.login).toBe('octocat')
    expect(result.repos).toHaveLength(1)
    expect(result.events).toHaveLength(1)
    expect(result.events[0]).toMatchObject({
      repo: 'octocat/Hello-World',
      ref: 'refs/heads/main',
      size: 1,
    })
    expect(result.rate).toEqual({ remaining: 59, limit: 60, reset: 1767225600 })
    expect(result.fromCache).toBe(false)
    expect(fetchMock).toHaveBeenCalledWith(
      'https://api.github.com/users/OctoCat',
      expect.objectContaining({ headers: expect.any(Object) }),
    )
  })

  it('returns cached data on the second lookup', async () => {
    const fetchMock = mockSuccessfulFetch()

    await loadUser('octocat')
    fetchMock.mockClear()

    const cached = await loadUser('OCTOCAT')

    expect(cached.fromCache).toBe(true)
    expect(fetchMock).not.toHaveBeenCalled()
  })

  it('rejects empty and malformed usernames without calling the API', async () => {
    const fetchMock = vi.fn()
    vi.stubGlobal('fetch', fetchMock)

    await expect(loadUser('   ')).rejects.toMatchObject({ code: 'invalid' })
    await expect(loadUser('bad username')).rejects.toMatchObject({ code: 'invalid' })
    expect(fetchMock).not.toHaveBeenCalled()
  })

  it('maps a missing user to a not-found error', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(response({}, { status: 404 })))

    await expect(loadUser('missing-user')).rejects.toMatchObject({
      code: 'not-found',
    })
  })

  it('maps rate limiting to a rate-limit error', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(response({}, { status: 403 })))

    await expect(loadUser('octocat')).rejects.toMatchObject({
      code: 'rate-limit',
    })
  })

  it('maps network failures to a network error', async () => {
    vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new Error('offline')))

    await expect(loadUser('octocat')).rejects.toBeInstanceOf(GitHubError)
    await expect(loadUser('octocat')).rejects.toMatchObject({ code: 'network' })
  })

  it('keeps the dashboard usable when the optional events request fails', async () => {
    const fetchMock = vi
      .fn()
      .mockResolvedValueOnce(response({ login: 'octocat' }, { rate: rateHeaders }))
      .mockResolvedValueOnce(response([], { rate: rateHeaders }))
      .mockRejectedValueOnce(new Error('events unavailable'))
    vi.stubGlobal('fetch', fetchMock)

    const result = await loadUser('octocat')

    expect(result.user.login).toBe('octocat')
    expect(result.events).toEqual([])
  })
})
