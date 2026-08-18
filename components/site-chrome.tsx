/* eslint-disable @next/next/no-html-link-for-pages */
export function SiteHeader() {
  return (
    <header className="site-header">
      <div className="site-width header-inner">
        <a className="brand" href="/" aria-label="Normal Tools home">
          <span className="brand-mark" aria-hidden="true" />normal tools
        </a>
        <span className="header-note">no login · no install · no clutter</span>
      </div>
    </header>
  );
}

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="site-width footer-inner">
        <p>Normal Tools. Small utilities that do one job.</p>
        <nav className="footer-links" aria-label="Legal">
          <a href="/terms">Terms</a>
          <a href="/privacy">Privacy</a>
        </nav>
      </div>
    </footer>
  );
}
