/* eslint-disable @next/next/no-html-link-for-pages */
import { SiteFooter, SiteHeader } from "@/components/site-chrome";

export default function NotFound() {
  return (
    <>
      <SiteHeader />
      <main id="main-content" className="site-width tool-main">
        <section className="tool-hero">
          <p className="eyebrow">404</p>
          <h1>Nothing here.</h1>
          <p>The tool or page you requested does not exist.</p>
          <p><a href="/">Return to all tools</a></p>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
