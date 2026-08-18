/* eslint-disable @next/next/no-html-link-for-pages */
import type { Metadata } from "next";
import Script from "next/script";
import { SiteFooter, SiteHeader } from "@/components/site-chrome";
import { ToolSeoContent } from "@/components/tool-seo-content";
import { siteUrl } from "@/lib/site-url";
import { getTool } from "@/lib/tools";

export const metadata: Metadata = {
  title: "Camera Shutter Count Checker",
  description:
    "Check a camera shutter count from an original photo. Read embedded camera and image-count metadata locally without uploading your file.",
  keywords: ["shutter count checker", "camera shutter count", "check shutter count", "camera actuation count"],
  alternates: { canonical: "/tools/camera-shutter-count-checker" },
  openGraph: {
    title: "Camera Shutter Count Checker — Normal Tools",
    description: "Read shutter-count metadata from an original camera photo, privately in your browser.",
    url: "/tools/camera-shutter-count-checker",
  },
};

export default function ShutterCountPage() {
  const tool = getTool("camera-shutter-count-checker")!;
  const schema = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: "Camera Shutter Count Checker",
    applicationCategory: "PhotographyApplication",
    operatingSystem: "Any modern web browser",
    url: `${siteUrl}/tools/camera-shutter-count-checker`,
    offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
    description: metadata.description,
  };

  return (
    <>
      <SiteHeader />
      <main id="main-content" className="site-width tool-main">
        <nav className="breadcrumbs" aria-label="Breadcrumb">
          <a href="/">All tools</a><span>/</span>Camera shutter count checker
        </nav>
        <header className="tool-hero">
          <p className="eyebrow category-label category-hardware">Photo metadata</p>
          <h1>Camera Shutter Count Checker</h1>
          <p>Choose an original photo straight from the camera. We will look for a shutter or image count inside its metadata.</p>
          <span className="local-badge">Your photo never leaves this browser</span>
        </header>

        <section className="tool-box" aria-labelledby="shutter-heading">
          <div className="tool-box-bar">
            <strong id="shutter-heading">Photo inspector</strong>
            <span id="shutter-status">Ready</span>
          </div>
          <div className="tool-box-body shutter-body">
            <label id="shutter-drop" className="file-drop" htmlFor="shutter-file">
              <span className="file-drop-title">Choose or drop an original camera photo</span>
              <span className="file-drop-detail">JPEG or TIFF · processed only on this device</span>
              <span className="plain-button file-button">Choose photo</span>
              <input id="shutter-file" type="file" accept="image/jpeg,image/tiff,.jpg,.jpeg,.tif,.tiff,.nef" />
            </label>

            <div id="shutter-result" className="shutter-result" hidden aria-live="polite">
              <div id="shutter-success" hidden>
                <p className="result-label">Reported shutter count</p>
                <strong id="shutter-value" className="result-number">—</strong>
                <p id="shutter-source" className="result-source" />
              </div>
              <div id="shutter-missing" hidden>
                <strong className="missing-title">No readable shutter count found.</strong>
                <p id="shutter-message">This file contains camera metadata, but its count is not stored in a format this browser tool can read.</p>
              </div>
              <dl className="metadata-list">
                <div><dt>File</dt><dd id="meta-file">—</dd></div>
                <div><dt>Camera</dt><dd id="meta-camera">—</dd></div>
                <div><dt>Captured</dt><dd id="meta-date">—</dd></div>
              </dl>
              <button id="shutter-another" className="plain-button" type="button">Check another photo</button>
            </div>
          </div>
        </section>

        <ToolSeoContent tool={tool} />
      </main>
      <SiteFooter />
      <Script src="/scripts/camera-shutter-count-checker.js" strategy="afterInteractive" />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
    </>
  );
}
