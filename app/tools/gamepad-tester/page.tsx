/* eslint-disable @next/next/no-html-link-for-pages */
import type { Metadata } from "next";
import Script from "next/script";
import { SiteFooter, SiteHeader } from "@/components/site-chrome";
import { ToolSeoContent } from "@/components/tool-seo-content";
import { siteUrl } from "@/lib/site-url";
import { getTool } from "@/lib/tools";

export const metadata: Metadata = {
  title: "Online Gamepad Tester",
  description:
    "Test a game controller online. Check buttons, analog sticks, triggers, D-pad inputs, and axis values instantly in your browser.",
  keywords: ["gamepad tester", "controller tester", "game controller test", "online gamepad test"],
  alternates: { canonical: "/tools/gamepad-tester" },
  openGraph: {
    title: "Online Gamepad Tester — Normal Tools",
    description: "Check every controller button, trigger, and analog stick live.",
    url: "/tools/gamepad-tester",
  },
};

export default function GamepadTesterPage() {
  const tool = getTool("gamepad-tester")!;
  const schema = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: "Online Gamepad Tester",
    applicationCategory: "UtilitiesApplication",
    operatingSystem: "Any modern web browser",
    url: `${siteUrl}/tools/gamepad-tester`,
    offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
    description: metadata.description,
  };

  return (
    <>
      <SiteHeader />
      <main id="main-content" className="site-width tool-main">
        <nav className="breadcrumbs" aria-label="Breadcrumb">
          <a href="/">All tools</a><span>/</span>Gamepad tester
        </nav>
        <header className="tool-hero">
          <p className="eyebrow category-label category-hardware">Hardware test</p>
          <h1>Online Gamepad Tester</h1>
          <p>Connect a controller and press any button. You will see exactly what your browser receives, in real time.</p>
          <span className="local-badge">Runs locally — no input is recorded</span>
        </header>

        <section className="tool-box" aria-labelledby="tester-heading">
          <div className="tool-box-bar">
            <strong id="tester-heading">Controller input</strong>
            <span className="status-line"><span id="gamepad-status-dot" className="status-dot" /><span id="gamepad-status">Waiting</span></span>
          </div>
          <div className="tool-box-body">
            <div id="gamepad-empty" className="empty-state">
              <div>
                <strong>Connect a controller, then press a button.</strong>
                <p>USB and Bluetooth controllers are supported. Some browsers only reveal a controller after the first button press.</p>
              </div>
            </div>
            <div id="gamepad-active" className="active-state" hidden>
              <p id="gamepad-name" className="device-name">Connected controller</p>
              <div className="gamepad-columns">
                <div>
                  <h2 className="readout-title">Buttons</h2>
                  <div id="gamepad-buttons" className="button-grid" />
                </div>
                <div>
                  <h2 className="readout-title">Axes</h2>
                  <div id="gamepad-axes" className="axis-list" />
                </div>
              </div>
            </div>
          </div>
        </section>

        <ToolSeoContent tool={tool} />
      </main>
      <SiteFooter />
      <Script src="/scripts/gamepad-tester.js" strategy="afterInteractive" />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
    </>
  );
}
