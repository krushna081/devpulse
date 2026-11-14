const LANGUAGE_COLORS = {
  JavaScript: '#f1e05a',
  TypeScript: '#3178c6',
  Python: '#3572a5',
  HTML: '#e34c26',
  CSS: '#563d7c',
  SCSS: '#c6538c',
  Shell: '#89e051',
  Bash: '#89e051',
  Java: '#b07219',
  'C++': '#f34b7d',
  C: '#555555',
  'C#': '#178600',
  Go: '#00add8',
  Rust: '#dea584',
  Ruby: '#701516',
  PHP: '#4f5d95',
  Swift: '#f05138',
  Kotlin: '#a97bff',
  Dart: '#00b4ab',
  Vue: '#41b883',
  Svelte: '#ff3e00',
  Astro: '#ff5a03',
  'Jupyter Notebook': '#da5b0b',
  Dockerfile: '#384d54',
  Makefile: '#427819',
  Lua: '#000080',
  Elixir: '#6e4a7e',
  Haskell: '#5e5086',
  R: '#198ce7',
  Perl: '#0298c3',
  Clojure: '#db5855',
  Zig: '#ec915c',
  'Objective-C': '#438eff',
  Nix: '#7e7eff',
  Solidity: '#aa6746',
  PowerShell: '#012456',
  'Vim Script': '#199f4b',
  MDX: '#fcb32c',
}

const FALLBACK_COLORS = [
  '#39ff88',
  '#37c8ff',
  '#ff3d81',
  '#ffb020',
  '#a78bfa',
  '#2dd4bf',
]

export function languageColor(language, index = 0) {
  if (!language) return '#4b5a66'
  if (LANGUAGE_COLORS[language]) return LANGUAGE_COLORS[language]
  let hash = 0
  for (let i = 0; i < language.length; i += 1) {
    hash = (hash * 31 + language.charCodeAt(i)) >>> 0
  }
  return FALLBACK_COLORS[hash % FALLBACK_COLORS.length]
}

export function compactNumber(value = 0) {
  if (value < 1000) return String(value)
  return new Intl.NumberFormat('en', {
    notation: 'compact',
    maximumFractionDigits: 1,
  }).format(value)
}

export function formatNumber(value = 0) {
  return new Intl.NumberFormat('en').format(value)
}

export function timeAgo(input) {
  const date = input instanceof Date ? input : new Date(input)
  if (Number.isNaN(date.getTime())) return 'unknown'
  const seconds = Math.max(1, Math.floor((Date.now() - date.getTime()) / 1000))
  const units = [
    [31_536_000, 'y'],
    [2_592_000, 'mo'],
    [604_800, 'w'],
    [86_400, 'd'],
    [3_600, 'h'],
    [60, 'm'],
  ]
  for (const [unitSeconds, label] of units) {
    if (seconds >= unitSeconds) {
      return `${Math.floor(seconds / unitSeconds)}${label} ago`
    }
  }
  return 'just now'
}

export function formatMonthYear(input) {
  const date = input instanceof Date ? input : new Date(input)
  if (Number.isNaN(date.getTime())) return ''
  return new Intl.DateTimeFormat('en', {
    month: 'short',
    year: 'numeric',
  }).format(date)
}

export function formatDateTime(input) {
  const date = input instanceof Date ? input : new Date(input)
  if (Number.isNaN(date.getTime())) return ''
  return new Intl.DateTimeFormat('en', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  }).format(date)
}

export function repoShortName(fullName = '') {
  return fullName.split('/').pop() || fullName
}

export function pluralize(count, singular, plural = `${singular}s`) {
  return `${count} ${count === 1 ? singular : plural}`
}

export function prettyLanguage(language) {
  if (!language) return 'Unknown'
  return language === 'Jupyter Notebook' ? 'Jupyter' : language
}
