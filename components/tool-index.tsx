"use client";

import { useMemo, useState } from "react";
import type { Tool } from "@/lib/tools";

const categoryOrder: Tool["category"][] = [
  "Text", "Developer", "Design", "Money", "Files", "Building", "Hardware", "Planning", "Names",
];

const popularityOrder: Record<Tool["category"], string[]> = {
  Text: [
    "word-counter", "number-to-words-converter", "character-counter", "roman-numeral-converter",
    "markdown-preview", "case-converter", "readability-score-checker", "text-diff-checker",
    "lorem-ipsum-generator", "remove-duplicate-lines-online", "slug-generator",
    "markdown-table-generator", "bulk-meta-description-generator",
  ],
  Developer: [
    "json-formatter", "password-generator", "uuid-generator", "base64-encoder", "regex-tester",
    "binary-converter", "url-encoder", "sql-formatter", "timestamp-converter", "hash-generator",
    "jwt-decoder", "domain-age-checker", "json-validator", "xml-formatter",
    "cron-expression-generator", "html-encoder", "code-beautifier", "json-to-csv-converter",
    "csv-to-json-converter", "html-minifier", "css-minifier", "javascript-minifier",
    "yaml-validator", "yaml-to-json-converter", "robots-txt-generator", "chmod-calculator",
    "subnet-calculator", "cidr-calculator", "utm-link-builder", "csp-header-generator",
    "jsonpath-tester", "csv-delimiter-converter", "hreflang-tag-generator", "nginx-redirect-generator",
  ],
  Design: [
    "qr-code-generator", "color-picker", "favicon-generator", "hex-to-rgb-converter",
    "css-gradient-generator", "aspect-ratio-calculator", "color-palette-generator", "px-to-rem-converter",
  ],
  Money: [
    "mortgage-calculator", "loan-calculator", "compound-interest-calculator", "tip-calculator",
    "discount-calculator", "sales-tax-calculator", "amazon-fba-profit-calculator",
    "etsy-fee-profit-calculator", "ebay-fee-profit-calculator", "paypal-fee-calculator",
    "stripe-fee-calculator", "fuel-trip-cost-calculator", "airbnb-host-payout-calculator",
    "shopify-profit-margin-calculator", "ev-charging-cost-calculator", "youtube-rpm-calculator",
    "patreon-earnings-calculator", "fiverr-fee-calculator", "upwork-fee-calculator",
    "kdp-royalty-calculator", "tiktok-shop-fee-calculator", "square-fee-calculator",
    "poshmark-fee-calculator", "depop-fee-calculator", "mercari-profit-calculator",
    "stockx-seller-fee-calculator", "shopify-break-even-roas-calculator",
    "twitch-subscription-revenue-calculator", "twitch-bits-to-usd-converter",
    "gumroad-fee-calculator", "kickstarter-fee-calculator", "printify-profit-calculator",
    "redbubble-profit-calculator", "teespring-profit-calculator", "amazon-handmade-fee-calculator",
    "grailed-fee-calculator", "reverb-fee-calculator", "discogs-fee-calculator",
    "whatnot-seller-fee-calculator", "ko-fi-fee-calculator", "fourthwall-profit-calculator",
    "recipe-cost-calculator",
  ],
  Files: [
    "image-resizer", "image-compressor", "jpg-to-png-converter", "png-to-jpg-converter",
    "webp-to-jpg-converter", "pdf-merger", "pdf-splitter", "image-cropper",
    "svg-to-png-converter", "image-to-base64-converter", "csv-viewer", "psd-to-png-converter",
    "mp3-to-midi-converter", "dwg-to-pdf-converter", "bank-statement-pdf-to-csv-converter",
    "stl-to-g-code-converter",
  ],
  Building: [
    "paint-calculator", "concrete-bag-calculator", "gravel-calculator", "mulch-calculator",
    "roof-pitch-rafter-calculator", "tile-calculator-with-waste", "drywall-sheet-calculator",
    "fence-material-calculator", "deck-material-calculator", "paver-calculator", "topsoil-calculator",
    "sod-calculator", "hvac-btu-calculator", "insulation-calculator", "asphalt-driveway-calculator",
    "roofing-shingle-bundle-calculator", "retaining-wall-block-calculator", "pond-liner-calculator",
    "french-drain-gravel-calculator", "wallpaper-roll-calculator", "board-foot-calculator",
    "stair-stringer-calculator", "stud-wall-calculator", "pipe-volume-calculator",
    "ramp-slope-calculator", "gutter-size-calculator", "ac-tonnage-calculator",
    "construction-estimate-generator",
  ],
  Hardware: [
    "gamepad-tester", "screen-ppi-calculator", "touchscreen-dead-zone-tester",
    "camera-shutter-count-checker", "ohms-law-calculator", "voltage-drop-calculator",
    "wire-size-calculator", "battery-runtime-calculator", "tv-viewing-distance-calculator",
    "projector-throw-distance-calculator", "generator-wattage-calculator",
    "solar-panel-output-calculator", "led-resistor-calculator", "ups-runtime-calculator",
    "solar-battery-bank-calculator", "speaker-box-volume-calculator",
  ],
  Planning: [
    "percentage-calculator", "bmi-calculator", "age-calculator", "unit-converter",
    "random-number-generator", "time-zone-converter", "date-difference-calculator", "stopwatch",
    "countdown-timer", "calorie-calculator", "gpa-calculator", "grade-calculator", "dice-roller",
    "coin-flip", "pool-volume-calculator", "aquarium-volume-calculator", "coffee-ratio-calculator",
    "rice-water-ratio-calculator", "turkey-thaw-time-calculator", "meat-cooking-time-calculator",
    "pizza-dough-calculator", "sourdough-calculator", "bread-hydration-calculator",
    "cake-pan-size-converter", "yeast-converter", "sewing-fabric-yardage-calculator",
    "wedding-seating-chart-builder", "photography-contract-generator",
    "shipping-dimensional-weight-calculator", "pallet-loading-calculator",
    "propane-usage-calculator", "cocktail-dilution-calculator",
  ],
  Names: ["podcast-name-generator", "band-name-generator", "clan-name-generator", "dnd-name-generator"],
};

export function ToolIndex({ tools }: { tools: Tool[] }) {
  const [query, setQuery] = useState("");
  const normalized = query.trim().toLowerCase();
  const visible = useMemo(
    () => categoryOrder.flatMap((category) => {
      const rank = new Map(popularityOrder[category].map((slug, index) => [slug, index]));
      return tools
        .filter((tool) => tool.category === category)
        .sort((a, b) => (rank.get(a.slug) ?? Number.MAX_SAFE_INTEGER) - (rank.get(b.slug) ?? Number.MAX_SAFE_INTEGER))
        .filter((tool) => !normalized || `${tool.name} ${tool.shortDescription} ${tool.category}`.toLowerCase().includes(normalized));
    }),
    [normalized, tools],
  );
  const numberBySlug = useMemo(
    () => new Map(visible.map((tool, index) => [tool.slug, index + 1])),
    [visible],
  );

  return (
    <>
      <div className="tool-search">
        <label htmlFor="tool-search-input">Find a tool</label>
        <div className="search-field-wrap">
          <span aria-hidden="true">⌕</span>
          <input
            id="tool-search-input"
            type="search"
            placeholder="Try “converter”, “roof”, or “text”"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            autoComplete="off"
          />
          {query && <button type="button" onClick={() => setQuery("")}>clear</button>}
        </div>
        <p aria-live="polite">Showing {visible.length} of {tools.length} tools</p>
      </div>

      {visible.length ? (
        <div className="tool-directory">
          {categoryOrder.map((category) => {
            const categoryTools = visible.filter((tool) => tool.category === category);
            if (!categoryTools.length) return null;
            return (
              <section className={`tool-category category-${category.toLowerCase()}`} key={category} aria-labelledby={`category-${category.toLowerCase()}`}>
                <div className="category-heading">
                  <h3 id={`category-${category.toLowerCase()}`}>{category}</h3>
                  <span>{categoryTools.length}</span>
                </div>
                <div className="tool-rows">
                  {categoryTools.map((tool) => {
                    const number = numberBySlug.get(tool.slug) ?? 0;
                    return (
                      <article className="tool-row" key={tool.slug}>
                        <span className="tool-row-number">{String(number).padStart(2, "0")}</span>
                        <span className="tool-row-symbol" aria-hidden="true">{tool.symbol}</span>
                        <div>
                          <h4><a href={`/tools/${tool.slug}`}>{tool.name}</a></h4>
                          <p>{tool.shortDescription}</p>
                        </div>
                        <span className="tool-row-arrow" aria-hidden="true">→</span>
                      </article>
                    );
                  })}
                </div>
              </section>
            );
          })}
        </div>
      ) : (
        <div className="no-tools">
          <strong>No matching tool.</strong>
          <p>Try a shorter search, or <button type="button" onClick={() => setQuery("")}>show all tools</button>.</p>
        </div>
      )}
    </>
  );
}
