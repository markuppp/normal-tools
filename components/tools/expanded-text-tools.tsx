"use client";

import { useMemo, useState } from "react";
import { ActionRow, SelectField, TextField, ToolFrame } from "./shared";

type Spec = { label: string; placeholder: string; initial: string; modes?: Array<[string, string]>; defaultMode?: string; filename: string; transform: (value: string, mode: string) => string; caution?: string };

function parseCsv(text: string) {
  const rows: string[][] = []; let row: string[] = []; let field = ""; let quoted = false;
  for (let index = 0; index < text.length; index++) {
    const char = text[index];
    if (char === '"' && quoted && text[index + 1] === '"') { field += '"'; index++; }
    else if (char === '"') quoted = !quoted;
    else if (char === "," && !quoted) { row.push(field); field = ""; }
    else if ((char === "\n" || char === "\r") && !quoted) { if (char === "\r" && text[index + 1] === "\n") index++; row.push(field); if (row.some((cell) => cell.length)) rows.push(row); row = []; field = ""; }
    else field += char;
  }
  row.push(field); if (row.some((cell) => cell.length)) rows.push(row);
  return rows;
}

function csvCell(value: unknown) { const text = value == null ? "" : typeof value === "object" ? JSON.stringify(value) : String(value); return `"${text.replace(/"/g, '""')}"`; }
function sortObject(value: unknown): unknown { if (Array.isArray(value)) return value.map(sortObject); if (value && typeof value === "object") return Object.fromEntries(Object.entries(value as Record<string, unknown>).sort(([a], [b]) => a.localeCompare(b)).map(([key, item]) => [key, sortObject(item)])); return value; }

const lorem = "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.";

const specs: Record<string, Spec> = {
  "csp-header-generator": {
    label: "Allowed origins — one per line", placeholder: "https://cdn.example.com\nhttps://api.example.com", initial: "'self'\nhttps://cdn.example.com\nhttps://fonts.googleapis.com", modes: [["balanced", "Balanced website policy"], ["strict", "Strict self-only policy"], ["api", "API / no page resources"]], defaultMode: "balanced", filename: "content-security-policy.txt",
    transform: (value, mode) => { const origins = value.split(/\r?\n/).map((line) => line.trim()).filter(Boolean).join(" "); if (mode === "strict") return "Content-Security-Policy: default-src 'self'; base-uri 'self'; object-src 'none'; frame-ancestors 'none'; form-action 'self'; upgrade-insecure-requests"; if (mode === "api") return "Content-Security-Policy: default-src 'none'; frame-ancestors 'none'; sandbox"; return `Content-Security-Policy: default-src 'self'; script-src 'self' ${origins}; style-src 'self' 'unsafe-inline' ${origins}; img-src 'self' data: blob: ${origins}; font-src 'self' ${origins}; connect-src 'self' ${origins}; object-src 'none'; base-uri 'self'; frame-ancestors 'none'; form-action 'self'; upgrade-insecure-requests`; },
    caution: "Test in Content-Security-Policy-Report-Only first. Frameworks, analytics, payments, embeds, workers, and inline scripts may require narrower additional sources or nonces.",
  },
  "nginx-redirect-generator": {
    label: "Redirects — one per line: old path | new URL", placeholder: "/old-page | https://example.com/new-page", initial: "/old-page | https://example.com/new-page\n/outdated/* | https://example.com/archive/$1", modes: [["301", "301 permanent"], ["302", "302 temporary"], ["308", "308 permanent, preserve method"]], defaultMode: "301", filename: "nginx-redirects.conf",
    transform: (value, mode) => value.split(/\r?\n/).filter(Boolean).map((line, index) => { const [from, to] = line.split("|").map((part) => part.trim()); if (!from || !to) throw new Error(`Line ${index + 1} needs an old path and destination separated by |.`); if (from.endsWith("/*")) return `rewrite ^${from.slice(0, -1)}(.*)$ ${to.replace("$1", "$1")} ${mode === "301" || mode === "308" ? "permanent" : "redirect"};`; return `location = ${from} { return ${mode} ${to}; }`; }).join("\n"),
    caution: "Review generated rules against the surrounding nginx configuration and test for loops before reloading production.",
  },
  "json-to-csv-converter": {
    label: "JSON array", placeholder: '[{"name":"Ada","score":10}]', initial: '[\n  {"name":"Ada","city":"London","score":10},\n  {"name":"Grace","city":"New York","score":12}\n]', filename: "converted.csv",
    transform: (value) => { const data = JSON.parse(value); if (!Array.isArray(data)) throw new Error("Top-level JSON must be an array of objects."); const headers = [...new Set(data.flatMap((item) => item && typeof item === "object" ? Object.keys(item) : []))]; if (!headers.length) throw new Error("No object fields were found."); return `${headers.map(csvCell).join(",")}\n${data.map((item) => headers.map((header) => csvCell(item?.[header])).join(",")).join("\n")}`; },
  },
  "csv-to-json-converter": {
    label: "CSV input", placeholder: "name,city\nAda,London", initial: "name,city,score\nAda,London,10\nGrace,New York,12", filename: "converted.json",
    transform: (value) => { const rows = parseCsv(value); if (rows.length < 2) throw new Error("Include a header row and at least one data row."); const headers = rows[0].map((header) => header.trim()); const objects = rows.slice(1).map((row) => Object.fromEntries(headers.map((header, index) => [header || `column_${index + 1}`, row[index] ?? ""]))); return JSON.stringify(objects, null, 2); },
  },
  "markdown-table-generator": {
    label: "Rows separated by commas, tabs, or pipes", placeholder: "Name | Status | Owner", initial: "Tool | Category | Status\nRoof calculator | Building | Ready\nJSON converter | Developer | Ready", modes: [["auto", "Detect separator"], ["comma", "Comma"], ["tab", "Tab"], ["pipe", "Pipe"]], defaultMode: "auto", filename: "table.md",
    transform: (value, mode) => { const first = value.split(/\r?\n/)[0] || ""; const delimiter = mode === "comma" ? "," : mode === "tab" ? "\t" : mode === "pipe" ? "|" : first.includes("\t") ? "\t" : first.includes("|") ? "|" : ","; const rows = value.split(/\r?\n/).filter(Boolean).map((line) => line.split(delimiter).map((cell) => cell.trim().replace(/\|/g, "\\|"))); const columns = Math.max(...rows.map((row) => row.length)); const padded = rows.map((row) => Array.from({ length: columns }, (_, index) => row[index] || "")); return [`| ${padded[0].join(" | ")} |`, `| ${Array(columns).fill("---").join(" | ")} |`, ...padded.slice(1).map((row) => `| ${row.join(" | ")} |`)].join("\n"); },
  },
  "remove-duplicate-lines-online": {
    label: "Lines to clean", placeholder: "Paste one item per line", initial: "apple\nBanana\napple\n banana \nOrange\nAPPLE", modes: [["exact", "Exact duplicates"], ["trim", "Trim before comparing"], ["case", "Ignore case"], ["trim-case", "Trim and ignore case"]], defaultMode: "trim-case", filename: "unique-lines.txt",
    transform: (value, mode) => { const seen = new Set<string>(); return value.split(/\r?\n/).filter((line) => { const normalized = mode.includes("trim") ? line.trim() : line; const key = mode.includes("case") ? normalized.toLowerCase() : normalized; if (seen.has(key)) return false; seen.add(key); return true; }).map((line) => mode.includes("trim") ? line.trim() : line).join("\n"); },
  },
  "json-formatter": {
    label: "JSON input", placeholder: '{"name":"Normal Tools"}', initial: '{"tools":[{"name":"Normal Tools","count":193}],"ready":true}', modes: [["format", "Format with 2 spaces"], ["four", "Format with 4 spaces"], ["minify", "Minify"], ["sort", "Sort keys"]], defaultMode: "format", filename: "formatted.json",
    transform: (value, mode) => { const data = JSON.parse(value); if (mode === "minify") return JSON.stringify(data); if (mode === "sort") return JSON.stringify(sortObject(data), null, 2); return JSON.stringify(data, null, mode === "four" ? 4 : 2); },
  },
  "json-validator": {
    label: "JSON to validate", placeholder: '{"valid":true}', initial: '{\n  "tool": "JSON Validator",\n  "valid": true\n}', filename: "json-validation.txt",
    transform: (value) => { const data = JSON.parse(value); const kind = Array.isArray(data) ? "array" : data === null ? "null" : typeof data; const size = Array.isArray(data) ? data.length : data && typeof data === "object" ? Object.keys(data).length : 1; return `✓ Valid JSON\n\nTop-level type: ${kind}\nTop-level items: ${size}\nUTF-8 bytes: ${new TextEncoder().encode(value).length}\n\nNormalized JSON:\n${JSON.stringify(data, null, 2)}`; },
  },
  "lorem-ipsum-generator": {
    label: "How many?", placeholder: "3", initial: "3", modes: [["paragraphs", "Paragraphs"], ["sentences", "Sentences"], ["words", "Words"]], defaultMode: "paragraphs", filename: "lorem-ipsum.txt",
    transform: (value, mode) => { const count = Math.min(100, Math.max(1, Number(value.trim()) || 1)); const sentenceList = lorem.match(/[^.!?]+[.!?]+/g) || [lorem]; const wordList = lorem.replace(/[.,]/g, "").split(/\s+/); if (mode === "sentences") return Array.from({ length: count }, (_, index) => sentenceList[index % sentenceList.length].trim()).join(" "); if (mode === "words") return Array.from({ length: count }, (_, index) => wordList[index % wordList.length]).join(" "); return Array.from({ length: count }, (_, index) => Array.from({ length: 4 }, (_, offset) => sentenceList[(index + offset) % sentenceList.length].trim()).join(" ")).join("\n\n"); },
  },
};

export function ExpandedTextTool({ slug, name }: { slug: string; name: string }) {
  const spec = specs[slug]; const [input, setInput] = useState(spec.initial); const [mode, setMode] = useState(spec.defaultMode || "");
  const result = useMemo(() => { try { return { output: spec.transform(input, mode), error: "" }; } catch (error) { return { output: "", error: error instanceof Error ? error.message : "Could not process this input." }; } }, [input, mode, spec]);
  return <ToolFrame title={name} status="works locally">{spec.modes && <div className="inline-options"><SelectField label="Operation" value={mode} onChange={setMode} options={spec.modes} /></div>}<div className="editor-grid"><TextField label={spec.label} value={input} onChange={setInput} placeholder={spec.placeholder} /><div className="field field-wide"><span>Result</span>{result.error ? <div className="error-output" role="alert"><strong>Check the input</strong><p>{result.error}</p></div> : <textarea className="mono-input output-area" value={result.output} rows={12} readOnly aria-label="Result" />}</div></div>{!result.error && <ActionRow output={result.output} filename={spec.filename} />}{spec.caution && <p className="tool-caution">{spec.caution}</p>}</ToolFrame>;
}

export const expandedTextSlugs = new Set(Object.keys(specs));
