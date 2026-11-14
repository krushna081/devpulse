import { useState } from 'react'
import {
  ArrowUpRightIcon,
  BuildingIcon,
  CalendarIcon,
  CheckIcon,
  CopyIcon,
  LinkIcon,
  MapPinIcon,
} from './Icons.jsx'
import { formatMonthYear, pluralize } from '../lib/format.js'

function websiteUrl(blog) {
  if (!blog) return ''
  return /^https?:\/\//i.test(blog) ? blog : `https://${blog}`
}

function displayWebsite(blog) {
  return blog.replace(/^https?:\/\//i, '').replace(/\/$/, '')
}

export default function ProfileCard({ user }) {
  const [copied, setCopied] = useState(false)

  async function copyLink() {
    const url = `${window.location.origin}${window.location.pathname}?u=${encodeURIComponent(user.login)}`
    try {
      await navigator.clipboard.writeText(url)
    } catch {
      const field = document.createElement('textarea')
      field.value = url
      field.style.position = 'fixed'
      field.style.opacity = '0'
      document.body.appendChild(field)
      field.select()
      document.execCommand('copy')
      document.body.removeChild(field)
    }
    setCopied(true)
    window.setTimeout(() => setCopied(false), 1800)
  }

  const website = user.blog?.trim()

  return (
    <article className="panel profile">
      <div className="profile__avatar-wrap">
        <img
          className="profile__avatar"
          src={user.avatar_url}
          alt={`${user.login}'s avatar`}
          width="112"
          height="112"
          loading="eager"
        />
        <span className="profile__signal" title="Public profile" />
      </div>

      <div className="profile__main">
        <div className="profile__top">
          <div>
            <p className="kicker">
              GitHub profile <span className="kicker__divider">/</span> {user.type}
            </p>
            <h2 className="profile__name">{user.name || user.login}</h2>
            <a
              className="profile__login"
              href={user.html_url}
              target="_blank"
              rel="noreferrer"
            >
              @{user.login}
            </a>
          </div>

          <div className="profile__actions">
            <a
              className="btn btn--ghost"
              href={user.html_url}
              target="_blank"
              rel="noreferrer"
            >
              View profile
              <ArrowUpRightIcon />
            </a>
            <button className="btn btn--ghost" type="button" onClick={copyLink}>
              {copied ? <CheckIcon /> : <CopyIcon />}
              {copied ? 'Copied' : 'Copy link'}
            </button>
          </div>
        </div>

        {user.bio && <p className="profile__bio">{user.bio}</p>}

        <div className="profile__meta">
          {user.company && (
            <span>
              <BuildingIcon />
              {user.company}
            </span>
          )}
          {user.location && (
            <span>
              <MapPinIcon />
              {user.location}
            </span>
          )}
          {website && (
            <a href={websiteUrl(website)} target="_blank" rel="noreferrer">
              <LinkIcon />
              {displayWebsite(website)}
            </a>
          )}
          {user.twitter_username && (
            <a
              href={`https://x.com/${user.twitter_username}`}
              target="_blank"
              rel="noreferrer"
            >
              <LinkIcon />@{user.twitter_username}
            </a>
          )}
          <span>
            <CalendarIcon />
            Joined {formatMonthYear(user.created_at)}
          </span>
        </div>

        <div className="profile__badges">
          {user.hireable && <span className="badge badge--accent">Open to work</span>}
          <span className="badge">{pluralize(user.public_repos ?? 0, 'public repo')}</span>
          <span className="badge">{pluralize(user.public_gists ?? 0, 'gist')}</span>
          {user.site_admin && <span className="badge">GitHub staff</span>}
        </div>
      </div>
    </article>
  )
}
