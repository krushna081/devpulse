# DevPulse

**Decode any developer's GitHub footprint.**

DevPulse is a clean, no-login GitHub analytics dashboard. Enter a username and get reputation stats, language DNA, top repositories, a filterable repo index, and recent public activity — all from the public GitHub REST API.

## Features

- **Profile analysis** — avatar, bio, location, company, website, join date, and badges
- **Reputation stats** — public repos, stars earned, followers, and following
- **Language DNA** — interactive donut chart of languages across source repositories
- **Top repositories** — ranked by stars with topics, forks, and last push
- **Repository browser** — filter by name/topic/language, sort, and toggle source-only
- **Recent activity** — pushes, releases, pull requests, stars, and forks
- **Shareable links** — `?u=username` loads a dashboard directly
- **Smart caching** — 5-minute session cache with API quota display
- **Responsive, dependency-light UI** — custom CSS, no UI framework, no backend

## Stack

- [React 19](https://react.dev/)
- [Vite](https://vite.dev/)
- Plain CSS with custom design tokens
- [GitHub REST API](https://docs.github.com/rest) (unauthenticated)

## Getting started

```bash
npm install
npm run dev
```

Open the URL Vite prints (usually `http://localhost:5173`).

### Scripts

| Command                | Description                              |
| ---------------------- | ---------------------------------------- |
| `npm run dev`          | Start the Vite dev server                |
| `npm run build`        | Build for production into `dist/`        |
| `npm run preview`      | Preview the production build             |
| `npm run lint`         | Run ESLint                               |
| `npm run format`       | Format files with Prettier               |
| `npm run format:check` | Verify formatting without changing files |
| `npm test`             | Run the Vitest suite                     |
| `npm run check`        | Lint, format check, test, and build      |

## Verification

```bash
npm ci
npm run lint
npm run format:check
npm test
npm run build
npm audit --omit=dev --audit-level=high
```

CI runs the same checks on every push to `main` and every pull request.

## Deploying to Vercel

1. Push this repo to GitHub.
2. In Vercel, choose **Add New → Project** and import the repo.
3. Vercel detects Vite automatically. Confirm:
   - **Build command:** `npm run build`
   - **Output directory:** `dist`
4. Deploy. No environment variables are required.

`vercel.json` adds a Content Security Policy, HSTS, frame protection, MIME
sniffing protection, a strict referrer policy, and a restrictive permissions
policy. The CSP allows Google Fonts and GitHub avatar images only.

## How it works

DevPulse calls three public GitHub endpoints per profile:

- `GET /users/:username`
- `GET /users/:username/repos?per_page=100&sort=updated`
- `GET /users/:username/events/public?per_page=30` (optional)

Results are cached in `sessionStorage` for five minutes to reduce API usage. The remaining hourly quota is read from GitHub's rate-limit response headers and shown in the UI.

### Rate limits

Unauthenticated GitHub REST requests are limited to **60 per hour per IP address**. Each unique profile scan uses up to three requests, so DevPulse supports roughly 20 fresh scans per hour from one IP. Cached profiles do not consume quota.

No token is used on the client, intentionally — shipping a GitHub token in a frontend bundle would expose it. If you need higher limits, proxy requests through a serverless function and keep credentials server-side.

## Project structure

```text
.
├── public/
│   └── favicon.svg
├── src/
│   ├── components/
│   │   ├── ActivityFeed.jsx
│   │   ├── Dashboard.jsx
│   │   ├── DataCard.jsx
│   │   ├── ErrorBoundary.jsx
│   │   ├── ErrorState.jsx
│   │   ├── Footer.jsx
│   │   ├── Header.jsx
│   │   ├── Hero.jsx
│   │   ├── Icons.jsx
│   │   ├── LanguageChart.jsx
│   │   ├── LoadingState.jsx
│   │   ├── ProfileCard.jsx
│   │   ├── RepoBrowser.jsx
│   │   ├── RepoCard.jsx
│   │   ├── SearchBar.jsx
│   │   └── StatsGrid.jsx
│   ├── lib/
│   │   ├── format.js
│   │   ├── format.test.js
│   │   ├── github.js
│   │   └── github.test.js
│   ├── App.jsx
│   ├── main.jsx
│   └── styles.css
├── .github/workflows/ci.yml
├── index.html
├── package.json
├── vercel.json
├── eslint.config.js
└── vite.config.js
```

## Limitations

- Only the first 100 public repositories are loaded per profile.
- Language shares count repositories, not bytes.
- GitHub only exposes a limited window of public events.
- Private repositories and contribution graphs are not included.
- DevPulse is read-only and not affiliated with GitHub.

## License

MIT
