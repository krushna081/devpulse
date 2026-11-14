export default function LoadingState() {
  return (
    <div className="dashboard container dashboard--loading" aria-busy="true">
      <div className="loading-head" role="status" aria-live="polite">
        <span className="spinner spinner--large" />
        <span>Scanning public GitHub data…</span>
      </div>

      <div className="skeleton skeleton--profile" />

      <div className="stats">
        {Array.from({ length: 4 }).map((_, index) => (
          <div className="skeleton skeleton--stat" key={index} />
        ))}
      </div>

      <div className="dashboard__split">
        <div className="skeleton skeleton--panel" />
        <div className="skeleton skeleton--panel" />
      </div>

      <div className="skeleton skeleton--panel skeleton--tall" />
    </div>
  )
}
