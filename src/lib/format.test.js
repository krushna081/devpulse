import { afterEach, describe, expect, it, vi } from 'vitest'
import {
  compactNumber,
  formatMonthYear,
  formatNumber,
  languageColor,
  pluralize,
  prettyLanguage,
  repoShortName,
  timeAgo,
} from './format.js'

afterEach(() => {
  vi.useRealTimers()
})

describe('format helpers', () => {
  it('formats numbers compactly and exactly', () => {
    expect(compactNumber(999)).toBe('999')
    expect(compactNumber(1000)).toBe('1K')
    expect(compactNumber(1_250_000)).toBe('1.3M')
    expect(formatNumber(1_234_567)).toBe('1,234,567')
  })

  it('returns stable language colors', () => {
    expect(languageColor('TypeScript')).toBe('#3178c6')
    expect(languageColor('CustomLang')).toBe(languageColor('CustomLang'))
    expect(languageColor(null)).toBe('#4b5a66')
  })

  it('formats relative and absolute dates', () => {
    vi.useFakeTimers()
    vi.setSystemTime(new Date('2026-01-01T00:00:00Z'))

    expect(timeAgo(new Date('2025-12-31T23:00:00Z'))).toBe('1h ago')
    expect(timeAgo(new Date('2025-12-31T23:59:40Z'))).toBe('just now')
    expect(timeAgo('not-a-date')).toBe('unknown')
    expect(formatMonthYear('2026-01-15T00:00:00Z')).toBe('Jan 2026')
  })

  it('formats repository and label helpers', () => {
    expect(repoShortName('octocat/Hello-World')).toBe('Hello-World')
    expect(repoShortName('')).toBe('')
    expect(pluralize(1, 'repo')).toBe('1 repo')
    expect(pluralize(2, 'repo')).toBe('2 repos')
    expect(prettyLanguage('Jupyter Notebook')).toBe('Jupyter')
    expect(prettyLanguage('')).toBe('Unknown')
  })
})
