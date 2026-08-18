import type { Tool } from "@/lib/tools";
import { getToolSeoContent } from "@/lib/tool-seo";

export function ToolSeoContent({ tool }: { tool: Tool }) {
  const content = getToolSeoContent(tool);
  const name = tool.name.replace(/^Online /, "").toLowerCase()
    .replace(/\betsy\b/g, "Etsy").replace(/\bebay\b/g, "eBay").replace(/\bamazon\b/g, "Amazon")
    .replace(/\bpaypal\b/g, "PayPal").replace(/\bshopify\b/g, "Shopify").replace(/\btiktok\b/g, "TikTok")
    .replace(/\byoutube\b/g, "YouTube").replace(/\btwitch\b/g, "Twitch").replace(/\bjson\b/g, "JSON")
    .replace(/\byaml\b/g, "YAML").replace(/\bxml\b/g, "XML").replace(/\bsql\b/g, "SQL")
    .replace(/\bhtml\b/g, "HTML").replace(/\bcss\b/g, "CSS").replace(/\bpdf\b/g, "PDF")
    .replace(/\bpng\b/g, "PNG").replace(/\bjpg\b/g, "JPG").replace(/\bsvg\b/g, "SVG")
    .replace(/\burl\b/g, "URL").replace(/\butm\b/g, "UTM").replace(/\buuid\b/g, "UUID")
    .replace(/\bjwt\b/g, "JWT").replace(/\bqr\b/g, "QR").replace(/\bbmi\b/g, "BMI")
    .replace(/\bgpa\b/g, "GPA").replace(/\bd&d\b/g, "D&D").replace(/\broas\b/g, "ROAS")
    .replace(/\bfba\b/g, "FBA").replace(/\bhvac\b/g, "HVAC").replace(/\bac\b/g, "AC")
    .replace(/\bups\b/g, "UPS").replace(/\bppi\b/g, "PPI").replace(/\bcidr\b/g, "CIDR");
  const howToSchema = {
    "@context": "https://schema.org",
    "@type": "HowTo",
    name: `How to use the ${tool.name}`,
    description: tool.shortDescription,
    step: content.steps.map((text, index) => ({ "@type": "HowToStep", position: index + 1, text })),
  };
  return <>
    <section className="content-section how-to-section">
      <h2>How to use this {name}</h2>
      <ol>{content.steps.map((step) => <li key={step}>{step}</li>)}</ol>
    </section>
    <section className="content-section about-tool-section">
      <h2>About this {name}</h2>
      {content.about.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
      <div className="seo-detail-grid">
        <div>
          <h3>Example</h3>
          <p>{content.example}</p>
        </div>
        <div>
          <h3>Common uses</h3>
          <ul className="common-uses-list">{content.uses.map((use) => <li key={use}>→ {use}</li>)}</ul>
        </div>
      </div>
    </section>
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(howToSchema) }} />
  </>;
}
