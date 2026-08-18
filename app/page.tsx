import type { Metadata } from "next";
import { SiteFooter, SiteHeader } from "@/components/site-chrome";
import { ToolIndex } from "@/components/tool-index";
import { siteUrl } from "@/lib/site-url";
import { tools } from "@/lib/tools";

export const metadata: Metadata = {
  title: { absolute: "Normal Tools — Useful online tools, no nonsense" },
  description:
    "193 focused calculators, converters, checkers, generators, and hardware tests. No account, no download, and no clutter.",
  alternates: { canonical: "/" },
};

export default function Home() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "Normal Tools",
    url: `${siteUrl}/`,
    description: metadata.description,
    potentialAction: {
      "@type": "SearchAction",
      target: `${siteUrl}/?q={search_term_string}`,
      "query-input": "required name=search_term_string",
    },
  };

  return (
    <>
      <SiteHeader />
      <main id="main-content" className="site-width home-main">
        <section className="intro" aria-labelledby="home-title">
          <p className="eyebrow">Free online utilities</p>
          <h1 id="home-title">Normal tools for normal tasks.</h1>
          <p className="intro-copy">
            Open a tool, do the thing, leave. No account, no download, and
            nothing between you and the answer.
          </p>
          <p className="privacy-first-note">
            <strong>Private by default.</strong> Most tools stay in your browser,
            and nothing you enter is saved.
          </p>
        </section>

        <section aria-labelledby="tool-list-title" className="tool-index">
          <div className="section-heading">
            <h2 id="tool-list-title">All tools</h2>
            <span>{tools.length} tools</span>
          </div>
          <ToolIndex tools={tools} />
        </section>

        <aside className="plain-note" aria-label="How Normal Tools works">
          <strong>Private by default.</strong> Calculators, converters,
          generators, checkers, file tools, and text tools run in your browser.
          Normal Tools does not save their inputs or outputs. The Domain Age
          Checker is the exception: it sends the domain you enter to the public
          RDAP service for the lookup, but Normal Tools does not save the query
          or response.
        </aside>
      </main>
      <SiteFooter />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />
    </>
  );
}
