/* eslint-disable @next/next/no-html-link-for-pages */
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { SiteFooter, SiteHeader } from "@/components/site-chrome";
import { ToolSeoContent } from "@/components/tool-seo-content";
import { ToolWorkbench } from "@/components/tool-workbench";
import { siteUrl } from "@/lib/site-url";
import { addedTools, getTool } from "@/lib/tools";
import { getToolSeoContent } from "@/lib/tool-seo";

type ToolPageProps = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return addedTools.map((tool) => ({ slug: tool.slug }));
}

export async function generateMetadata({ params }: ToolPageProps): Promise<Metadata> {
  const { slug } = await params;
  const tool = getTool(slug);
  if (!tool || !addedTools.includes(tool)) return {};
  const seo = getToolSeoContent(tool);
  return {
    title: tool.name,
    description: `${tool.shortDescription} Free to use in your browser on Normal Tools.`,
    keywords: seo.keywords,
    alternates: { canonical: `/tools/${tool.slug}` },
    openGraph: {
      title: `${tool.name} — Normal Tools`,
      description: tool.shortDescription,
      url: `/tools/${tool.slug}`,
    },
  };
}

export default async function ToolPage({ params }: ToolPageProps) {
  const { slug } = await params;
  const tool = getTool(slug);
  if (!tool || !addedTools.includes(tool)) notFound();

  const schema = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: tool.name,
    applicationCategory: "UtilitiesApplication",
    operatingSystem: "Any modern web browser",
    url: `${siteUrl}/tools/${tool.slug}`,
    offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
    description: tool.shortDescription,
  };

  return (
    <>
      <SiteHeader />
      <main id="main-content" className="site-width tool-main">
        <nav className="breadcrumbs" aria-label="Breadcrumb">
          <a href="/">All tools</a><span>/</span>{tool.name}
        </nav>
        <header className="tool-hero">
          <p className={`eyebrow category-label category-${tool.category.toLowerCase()}`}>
            {tool.category} tool
          </p>
          <h1>{tool.name}</h1>
          <p>{tool.shortDescription}</p>
          <span className="local-badge">
            {tool.slug === "domain-age-checker" ? "Uses public RDAP data" : "Runs in your browser"}
          </span>
        </header>

        <ToolWorkbench slug={tool.slug} name={tool.name} />

        <ToolSeoContent tool={tool} />
      </main>
      <SiteFooter />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
    </>
  );
}
