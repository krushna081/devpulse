import { useEffect, useRef } from 'react'
import { ArrowUpRightIcon, SearchIcon } from './Icons.jsx'

export default function SearchBar({
  value,
  onChange,
  onSubmit,
  loading = false,
  size = 'large',
  autoFocus = false,
  placeholder = 'Enter a GitHub username',
}) {
  const inputRef = useRef(null)
  const compact = size === 'compact'

  useEffect(() => {
    if (autoFocus) inputRef.current?.focus()
  }, [autoFocus])

  useEffect(() => {
    if (compact) return undefined
    function handleShortcut(event) {
      const tag = document.activeElement?.tagName
      if (event.key === '/' && !['INPUT', 'TEXTAREA', 'SELECT'].includes(tag)) {
        event.preventDefault()
        inputRef.current?.focus()
      }
    }
    window.addEventListener('keydown', handleShortcut)
    return () => window.removeEventListener('keydown', handleShortcut)
  }, [compact])

  function handleSubmit(event) {
    event.preventDefault()
    if (!loading) onSubmit(value)
  }

  return (
    <form
      className={`search search--${size}`}
      role="search"
      onSubmit={handleSubmit}
    >
      <SearchIcon className="search__icon" />
      <label className="sr-only" htmlFor={`github-user-${size}`}>
        GitHub username
      </label>
      <input
        ref={inputRef}
        id={`github-user-${size}`}
        className="search__input"
        type="text"
        name="username"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        autoComplete="off"
        autoCapitalize="off"
        spellCheck="false"
        enterKeyHint="search"
      />
      {!value && !compact && <kbd className="search__kbd">/</kbd>}
      <button
        className="btn btn--primary search__submit"
        type="submit"
        disabled={loading || !value.trim()}
      >
        {loading ? (
          <>
            <span className="spinner" />
            <span>{compact ? 'Loading' : 'Analyzing'}</span>
          </>
        ) : (
          <>
            <span>{compact ? 'Go' : 'Analyze'}</span>
            <ArrowUpRightIcon />
          </>
        )}
      </button>
    </form>
  )
}
