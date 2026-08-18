"use client";

import { useMemo, useState } from "react";
import { ActionRow, SelectField, TextField, ToolFrame } from "./shared";

const encoder = new TextEncoder();
const decoder = new TextDecoder();

function unicodeToBase64(value: string) {
  let binary = "";
  encoder.encode(value).forEach((byte) => { binary += String.fromCharCode(byte); });
  return btoa(binary);
}

function base64ToUnicode(value: string) {
  const binary = atob(value.replace(/\s/g, ""));
  return decoder.decode(Uint8Array.from(binary, (char) => char.charCodeAt(0)));
}

function escapeHtml(value: string) {
  return value.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#39;");
}

function decodeHtml(value: string) {
  if (typeof document === "undefined") return value;
  const element = document.createElement("textarea");
  element.innerHTML = value;
  return element.value;
}

function slugify(value: string) {
  return value.normalize("NFKD").replace(/[\u0300-\u036f]/g, "").toLowerCase().trim().replace(/&/g, " and ").replace(/[^a-z0-9\n]+/g, "-").replace(/^-+|-+$/gm, "").replace(/-{2,}/g, "-");
}

function titleCase(value: string) {
  const small = new Set(["a", "an", "and", "as", "at", "but", "by", "for", "in", "nor", "of", "on", "or", "the", "to", "up", "yet"]);
  return value.toLowerCase().replace(/\b[\w’'-]+\b/g, (word, offset) => offset && small.has(word) ? word : word.charAt(0).toUpperCase() + word.slice(1));
}

function words(value: string) { return value.trim().match(/[\p{L}\p{N}’'-]+/gu) || []; }
function sentences(value: string) { return value.trim() ? (value.match(/[^.!?]+[.!?]+|[^.!?]+$/g) || []).length : 0; }
function syllables(word: string) {
  const clean = word.toLowerCase().replace(/[^a-z]/g, "");
  if (clean.length <= 3) return clean ? 1 : 0;
  return Math.max(1, (clean.replace(/(?:[^laeiouy]es|ed|[^laeiouy]e)$/i, "").match(/[aeiouy]{1,2}/g) || []).length);
}

function readability(value: string) {
  const wordList = words(value);
  const sentenceCount = Math.max(sentences(value), 1);
  const syllableCount = wordList.reduce((sum, word) => sum + syllables(word), 0);
  const ease = 206.835 - 1.015 * (wordList.length / sentenceCount) - 84.6 * (syllableCount / Math.max(wordList.length, 1));
  const grade = 0.39 * (wordList.length / sentenceCount) + 11.8 * (syllableCount / Math.max(wordList.length, 1)) - 15.59;
  return `Reading ease: ${Math.max(0, Math.min(100, ease)).toFixed(1)} / 100\nUS grade level: ${Math.max(0, grade).toFixed(1)}\nWords: ${wordList.length}\nSentences: ${sentenceCount}\nAverage sentence: ${(wordList.length / sentenceCount).toFixed(1)} words`;
}

function formatSql(value: string) {
  const keywords = ["SELECT", "FROM", "WHERE", "GROUP BY", "ORDER BY", "HAVING", "LIMIT", "OFFSET", "LEFT JOIN", "RIGHT JOIN", "INNER JOIN", "OUTER JOIN", "JOIN", "ON", "UNION", "VALUES", "SET", "RETURNING"];
  let output = value.replace(/\s+/g, " ").trim();
  for (const keyword of keywords) output = output.replace(new RegExp(`\\s+${keyword.replace(" ", "\\s+")}\\s+`, "gi"), `\n${keyword} `);
  output = output.replace(/\b(select|from|where|as|and|or|insert|into|update|delete|create|table|distinct|null|is|not|in|like|case|when|then|else|end|asc|desc)\b/gi, (match) => match.toUpperCase());
  return output.replace(/,\s*/g, ",\n  ").replace(/^SELECT\s+/i, "SELECT\n  ");
}

function formatXml(value: string) {
  if (typeof DOMParser === "undefined") return value;
  const doc = new DOMParser().parseFromString(value, "application/xml");
  const error = doc.querySelector("parsererror");
  if (error) throw new Error(error.textContent?.split("\n")[0] || "Invalid XML");
  const compact = new XMLSerializer().serializeToString(doc).replace(/>\s*</g, "><");
  let pad = 0;
  return compact.replace(/(>)(<)(\/?)/g, "$1\n$2$3").split("\n").map((line) => {
    if (/^<\//.test(line)) pad--;
    const result = `${"  ".repeat(Math.max(pad, 0))}${line}`;
    if (/^<[^!?/][^>]*[^/]>/i.test(line) && !/<\/[^>]+>$/.test(line)) pad++;
    return result;
  }).join("\n");
}

function simpleYaml(value: string) {
  const trimmed = value.trim();
  if (!trimmed) return "";
  if (trimmed.startsWith("{") || trimmed.startsWith("[")) return JSON.stringify(JSON.parse(trimmed), null, 2);
  const root: Record<string, unknown> = {};
  const stack: Array<{ indent: number; value: Record<string, unknown> }> = [{ indent: -1, value: root }];
  for (const [index, original] of value.split(/\r?\n/).entries()) {
    if (!original.trim() || original.trimStart().startsWith("#")) continue;
    if (/\t/.test(original.match(/^\s*/)?.[0] || "")) throw new Error(`Tabs are not allowed for indentation (line ${index + 1})`);
    const indent = original.length - original.trimStart().length;
    const line = original.trim();
    const match = line.match(/^([^:#][^:]*):(?:\s*(.*))?$/);
    if (!match) throw new Error(`Expected “key: value” on line ${index + 1}`);
    while (stack.length > 1 && indent <= stack[stack.length - 1].indent) stack.pop();
    const parent = stack[stack.length - 1].value;
    const key = match[1].trim();
    const raw = (match[2] || "").trim();
    if (!raw) {
      const child: Record<string, unknown> = {};
      parent[key] = child;
      stack.push({ indent, value: child });
    } else if (/^(true|false)$/i.test(raw)) parent[key] = raw.toLowerCase() === "true";
    else if (/^(null|~)$/i.test(raw)) parent[key] = null;
    else if (/^-?\d+(\.\d+)?$/.test(raw)) parent[key] = Number(raw);
    else if (/^\[.*\]$/.test(raw)) parent[key] = raw.slice(1, -1).split(",").map((item) => item.trim().replace(/^['"]|['"]$/g, ""));
    else parent[key] = raw.replace(/^['"]|['"]$/g, "");
  }
  return JSON.stringify(root, null, 2);
}

function minify(value: string, kind: string) {
  if (kind === "html") return value.replace(/<!--(?!\[if)[\s\S]*?-->/g, "").replace(/>\s+</g, "><").replace(/\s{2,}/g, " ").trim();
  if (kind === "css") return value.replace(/\/\*[\s\S]*?\*\//g, "").replace(/\s*([{}:;,>])\s*/g, "$1").replace(/;}/g, "}").trim();
  return value.replace(/\/\*[\s\S]*?\*\//g, "").replace(/^\s*\/\/.*$/gm, "").replace(/[\t ]+/g, " ").replace(/\s*([{}();,:=+])\s*/g, "$1").replace(/\n+/g, "").trim();
}

function beautifyCode(value: string, mode: string) {
  if (mode === "json") return JSON.stringify(JSON.parse(value), null, 2);
  if (mode === "sql") return formatSql(value);
  if (mode === "xml" || mode === "html") return formatXml(value);
  let indent = 0;
  return value.replace(/\s+/g, " ").replace(/([{};])/g, "$1\n").split("\n").map((raw) => {
    const line = raw.trim();
    if (!line) return "";
    if (line.startsWith("}")) indent--;
    const output = `${"  ".repeat(Math.max(0, indent))}${line}`;
    if (line.endsWith("{")) indent++;
    return output;
  }).filter(Boolean).join("\n");
}

function convertBinary(value: string, mode: string) {
  if (mode === "text-binary") return [...encoder.encode(value)].map((byte) => byte.toString(2).padStart(8, "0")).join(" ");
  if (mode === "binary-text") return decoder.decode(Uint8Array.from(value.trim().split(/\s+/).map((byte) => parseInt(byte, 2))));
  if (mode === "decimal-binary") return value.trim().split(/[\s,]+/).map((n) => Number(n).toString(2)).join(" ");
  if (mode === "hex-binary") return value.trim().replace(/0x/gi, "").split(/\s+/).map((hex) => parseInt(hex, 16).toString(2).padStart(hex.length * 4, "0")).join(" ");
  return "";
}

type TextSpec = { label: string; placeholder: string; initial: string; modes?: Array<[string, string]>; defaultMode?: string; filename: string; transform: (value: string, mode: string) => string; caution?: string };

const specs: Record<string, TextSpec> = {
  "yaml-to-json-converter": { label: "YAML input", placeholder: "site:\n  title: Normal Tools\n  public: true", initial: "site:\n  title: Normal Tools\n  public: true\nversion: 1", filename: "converted.json", transform: simpleYaml, caution: "Supports common key/value YAML. Advanced anchors, tags, and multiline scalars need a full YAML parser." },
  "bulk-meta-description-generator": { label: "Pages — one per line: title | keyword | detail", placeholder: "Emergency Plumber Austin | emergency plumber | 24/7 local service", initial: "Roof Repair Guide | roof repair | costs, materials, and warning signs\nDeck Calculator | deck materials | boards, joists, fasteners, and waste", filename: "meta-descriptions.csv", transform: (value) => `Page,Meta description,Characters\n${value.split(/\r?\n/).filter(Boolean).map((line) => { const [title, keyword, detail] = line.split("|").map((part) => part.trim()); const meta = `${title}: Learn about ${detail || keyword || "the essentials"}. Get a clear, practical answer and next steps.`.slice(0, 158); return `"${title.replace(/"/g, '""')}","${meta.replace(/"/g, '""')}",${meta.length}`; }).join("\n")}` },
  "base64-encoder": { label: "Text or Base64", placeholder: "Paste text here", initial: "Normal tools for normal tasks.", modes: [["encode", "Encode to Base64"], ["decode", "Decode from Base64"]], defaultMode: "encode", filename: "base64.txt", transform: (value, mode) => mode === "decode" ? base64ToUnicode(value) : unicodeToBase64(value) },
  "sql-formatter": { label: "Unformatted SQL", placeholder: "select id,name from users where active=true order by name", initial: "select u.id,u.name,count(o.id) as orders from users u left join orders o on o.user_id=u.id where u.active=true group by u.id,u.name order by orders desc", filename: "formatted.sql", transform: formatSql },
  "yaml-validator": { label: "YAML to validate", placeholder: "name: Normal Tools", initial: "tool:\n  name: YAML Validator\n  enabled: true", filename: "validated-yaml.txt", transform: (value) => { const json = simpleYaml(value); return `✓ Valid common YAML\n\nParsed value:\n${json}`; }, caution: "Checks common mappings and indentation, not every advanced YAML 1.2 feature." },
  "readability-score-checker": { label: "Text to score", placeholder: "Paste an article, email, or page copy", initial: "Clear writing helps people find what they need. Short sentences and familiar words make instructions easier to follow.", filename: "readability-score.txt", transform: readability },
  "robots-txt-generator": { label: "Site hostname or URL", placeholder: "example.com", initial: "example.com", modes: [["open", "Allow normal crawling"], ["block", "Block all crawling"], ["ai", "Allow search, block common AI bots"]], defaultMode: "open", filename: "robots.txt", transform: (value, mode) => { const host = value.trim().replace(/^https?:\/\//, "").replace(/\/$/, ""); if (mode === "block") return `User-agent: *\nDisallow: /\n\nSitemap: https://${host}/sitemap.xml`; if (mode === "ai") return `User-agent: *\nAllow: /\n\nUser-agent: Google-Extended\nDisallow: /\n\nUser-agent: CCBot\nDisallow: /\n\nSitemap: https://${host}/sitemap.xml`; return `User-agent: *\nAllow: /\n\nSitemap: https://${host}/sitemap.xml`; } },
  "code-beautifier": { label: "Code", placeholder: "Paste compact code", initial: "{\"tool\":\"code beautifier\",\"ready\":true}", modes: [["json", "JSON"], ["javascript", "JavaScript / CSS"], ["xml", "XML"], ["html", "HTML"], ["sql", "SQL"]], defaultMode: "json", filename: "beautified-code.txt", transform: beautifyCode },
  "xml-formatter": { label: "XML", placeholder: "<root><item id=\"1\">Value</item></root>", initial: "<tools><tool id=\"1\"><name>Normal Tools</name><status>ready</status></tool></tools>", filename: "formatted.xml", transform: formatXml },
  "url-encoder": { label: "URL text", placeholder: "Paste a query value or encoded URL", initial: "Normal tools & converters", modes: [["encode", "Encode component"], ["decode", "Decode component"], ["full", "Encode full URL safely"]], defaultMode: "encode", filename: "url-result.txt", transform: (value, mode) => mode === "decode" ? decodeURIComponent(value) : mode === "full" ? encodeURI(value) : encodeURIComponent(value) },
  "html-encoder": { label: "HTML or text", placeholder: "<p>Normal & useful</p>", initial: "<p>Normal & useful</p>", modes: [["encode", "Encode entities"], ["decode", "Decode entities"]], defaultMode: "encode", filename: "html-entities.txt", transform: (value, mode) => mode === "decode" ? decodeHtml(value) : escapeHtml(value) },
  "html-minifier": { label: "HTML", placeholder: "Paste HTML", initial: "<!-- page -->\n<section class=\"tool\">\n  <h1>Normal Tools</h1>\n  <p>Useful and focused.</p>\n</section>", filename: "minified.html", transform: (value) => minify(value, "html") },
  "css-minifier": { label: "CSS", placeholder: "Paste CSS", initial: ".tool {\n  color: #171713;\n  padding: 16px;\n}\n\n.tool:hover { color: #174ea6; }", filename: "minified.css", transform: (value) => minify(value, "css") },
  "javascript-minifier": { label: "Simple JavaScript", placeholder: "Paste JavaScript", initial: "function greet(name) {\n  // Return a greeting\n  return `Hello, ${name}!`;\n}", filename: "minified.js", transform: (value) => minify(value, "javascript"), caution: "Conservative browser minification is best for simple scripts. Use a parser-based build minifier for production applications." },
  "slug-generator": { label: "Titles — one or many lines", placeholder: "A useful page title", initial: "A Simple & Useful Page Title\nPX to REM Converter", filename: "slugs.txt", transform: slugify },
  "case-converter": { label: "Text", placeholder: "Paste text to convert", initial: "Normal tools for normal tasks", modes: [["upper", "UPPER CASE"], ["lower", "lower case"], ["title", "Title Case"], ["sentence", "Sentence case"], ["camel", "camelCase"], ["snake", "snake_case"], ["kebab", "kebab-case"]], defaultMode: "title", filename: "converted-text.txt", transform: (value, mode) => { const units = value.toLowerCase().trim().split(/[^\p{L}\p{N}]+/u).filter(Boolean); if (mode === "upper") return value.toUpperCase(); if (mode === "lower") return value.toLowerCase(); if (mode === "title") return titleCase(value); if (mode === "sentence") return value.toLowerCase().replace(/(^\s*\p{L}|[.!?]\s+\p{L})/gu, (match) => match.toUpperCase()); if (mode === "camel") return units.map((part, index) => index ? part.charAt(0).toUpperCase() + part.slice(1) : part).join(""); return units.join(mode === "snake" ? "_" : "-"); } },
  "binary-converter": { label: "Input", placeholder: "Text, binary, decimal bytes, or hex", initial: "Normal", modes: [["text-binary", "Text → binary"], ["binary-text", "Binary → text"], ["decimal-binary", "Decimal → binary"], ["hex-binary", "Hex → binary"]], defaultMode: "text-binary", filename: "binary-result.txt", transform: convertBinary },
  "character-counter": { label: "Text to count", placeholder: "Start typing", initial: "Normal tools for normal tasks.", filename: "character-count.txt", transform: (value) => `Characters: ${[...value].length}\nWithout spaces: ${[...value.replace(/\s/g, "")].length}\nWords: ${words(value).length}\nLines: ${value ? value.split(/\r?\n/).length : 0}\nUTF-8 bytes: ${encoder.encode(value).length}\nRemaining for X (280): ${280 - [...value].length}\nRemaining for SMS (160): ${160 - [...value].length}` },
  "word-counter": { label: "Text to count", placeholder: "Start writing or paste a document", initial: "Normal Tools keeps each utility focused. You can finish the task and move on.", filename: "word-count.txt", transform: (value) => { const count = words(value).length; return `Words: ${count}\nCharacters: ${[...value].length}\nSentences: ${sentences(value)}\nParagraphs: ${value.trim() ? value.trim().split(/\n\s*\n/).length : 0}\nReading time: ${Math.max(1, Math.ceil(count / 225))} min\nSpeaking time: ${Math.max(1, Math.ceil(count / 130))} min`; } },
};

export function TextTool({ slug, name }: { slug: string; name: string }) {
  const spec = specs[slug];
  const [input, setInput] = useState(spec.initial);
  const [mode, setMode] = useState(spec.defaultMode || "");
  const result = useMemo(() => {
    try { return { output: spec.transform(input, mode), error: "" }; }
    catch (error) { return { output: "", error: error instanceof Error ? error.message : "Could not process this input." }; }
  }, [input, mode, spec]);
  const savings = /minifier/.test(slug) && input.length ? Math.max(0, Math.round((1 - result.output.length / input.length) * 100)) : null;
  return (
    <ToolFrame title={name} status="works locally">
      {spec.modes && <div className="inline-options"><SelectField label="Operation" value={mode} onChange={setMode} options={spec.modes} /></div>}
      <div className="editor-grid">
        <TextField label={spec.label} value={input} onChange={setInput} placeholder={spec.placeholder} />
        <div className="field field-wide">
          <span>Result {savings !== null ? `— ${savings}% smaller` : ""}</span>
          {result.error ? <div className="error-output" role="alert"><strong>Check the input</strong><p>{result.error}</p></div> : <textarea className="mono-input output-area" value={result.output} rows={12} readOnly aria-label="Result" />}
        </div>
      </div>
      {!result.error && <ActionRow output={result.output} filename={spec.filename} />}
      {spec.caution && <p className="tool-caution">{spec.caution}</p>}
    </ToolFrame>
  );
}

export const textSlugs = new Set(Object.keys(specs));
