import type { Tool } from "@/lib/tools";

export function ToolCard({ tool, index }: { tool: Tool; index: number }) {
  return (
    <article className="tool-card">
      <span className="tool-number">{String(index).padStart(2, "0")}</span>
      <span className="tool-symbol" aria-hidden="true">{tool.symbol}</span>
      <h3>
        {tool.live ? <a href={`/tools/${tool.slug}`}>{tool.name}</a> : tool.name}
      </h3>
      <p>{tool.shortDescription}</p>
      <span className={`tool-state${tool.live ? "" : " pending"}`}>
        {tool.live ? "ready to use" : "being added"}
      </span>
    </article>
  );
}
