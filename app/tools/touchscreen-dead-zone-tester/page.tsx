/* eslint-disable @next/next/no-html-link-for-pages */
import type { Metadata } from "next";
import Script from "next/script";
import { SiteFooter, SiteHeader } from "@/components/site-chrome";
import { ToolSeoContent } from "@/components/tool-seo-content";
import { siteUrl } from "@/lib/site-url";
import { getTool } from "@/lib/tools";

export const metadata: Metadata = {
  title: "Touchscreen Dead-Zone Tester",
  description:
    "Test your touchscreen for dead zones online. Draw over every part of the screen to reveal missed touch areas, gaps, and unresponsive spots.",
  keywords: ["touch screen test", "touchscreen dead zone test", "screen touch test", "touchscreen tester"],
  alternates: { canonical: "/tools/touchscreen-dead-zone-tester" },
  openGraph: {
    title: "Touchscreen Dead-Zone Tester — Normal Tools",
    description: "Draw across your display to find unresponsive touch areas.",
    url: "/tools/touchscreen-dead-zone-tester",
  },
};

export default function TouchscreenTesterPage() {
  const tool = getTool("touchscreen-dead-zone-tester")!;
  const schema = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: "Touchscreen Dead-Zone Tester",
    applicationCategory: "UtilitiesApplication",
    operatingSystem: "Any touch-enabled device with a modern web browser",
    url: `${siteUrl}/tools/touchscreen-dead-zone-tester`,
    offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
    description: metadata.description,
  };

  return (
    <>
      <SiteHeader />
      <main id="main-content" className="site-width tool-main">
        <nav className="breadcrumbs" aria-label="Breadcrumb">
          <a href="/">All tools</a><span>/</span>Touchscreen dead-zone tester
        </nav>
        <header className="tool-hero">
          <p className="eyebrow category-label category-hardware">Screen test</p>
          <h1>Touchscreen Dead-Zone Tester</h1>
          <p>Drag a finger across every part of the grid. Touched areas turn green, making skipped or unresponsive spots easy to see.</p>
          <span className="local-badge">Runs locally — touch data stays here</span>
        </header>

        <section id="touch-tool" className="tool-box" aria-labelledby="touch-heading">
          <div className="tool-box-bar touch-toolbar">
            <strong id="touch-heading">Touch coverage</strong>
            <span><span id="touch-count">0</span>% covered</span>
          </div>
          <div className="touch-controls">
            <p id="touch-instruction">Use one or more fingers. Try slow horizontal and vertical lines.</p>
            <div className="button-row">
              <button id="touch-fullscreen" className="plain-button" type="button">Full screen</button>
              <button id="touch-clear" className="plain-button" type="button">Clear grid</button>
            </div>
          </div>
          <div className="touch-grid-wrap">
            <div id="touch-grid" className="touch-grid" role="img" aria-label="Untested touchscreen grid" />
          </div>
          <div className="touch-legend" aria-hidden="true">
            <span><i className="legend-box untested" /> Untested</span>
            <span><i className="legend-box tested" /> Touch detected</span>
            <span id="touch-pointers">0 active touches</span>
          </div>
        </section>

        <ToolSeoContent tool={tool} />
      </main>
      <SiteFooter />
      <Script src="/scripts/touchscreen-dead-zone-tester.js" strategy="afterInteractive" />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
    </>
  );
}
