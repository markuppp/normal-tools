"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { generateNames, nameGeneratorControls, type NameKind } from "@/lib/name-generator";
import { ActionRow, copyText, money, NumberField, number, ResultGrid, SelectField, TextField, ToolFrame } from "./shared";

export function EstimateTool({ name }: { name: string }) {
  const [project, setProject] = useState("Kitchen refresh");
  const [tax, setTax] = useState("8.25");
  const [overhead, setOverhead] = useState("10");
  const [items, setItems] = useState([{ description: "Labor", quantity: 24, rate: 65 }, { description: "Materials", quantity: 1, rate: 1450 }]);
  const subtotal = items.reduce((sum, item) => sum + item.quantity * item.rate, 0);
  const overheadAmount = subtotal * (Number(overhead) || 0) / 100;
  const taxAmount = subtotal * (Number(tax) || 0) / 100;
  const total = subtotal + overheadAmount + taxAmount;
  const report = `${project}\n\n${items.map((item) => `${item.description}: ${item.quantity} × ${money(item.rate)} = ${money(item.quantity * item.rate)}`).join("\n")}\n\nSubtotal: ${money(subtotal)}\nOverhead: ${money(overheadAmount)}\nTax: ${money(taxAmount)}\nESTIMATE TOTAL: ${money(total)}`;
  return (
    <ToolFrame title={name} status="estimate draft">
      <div className="field-grid three-up">
        <label className="field"><span>Project name</span><input value={project} onChange={(event) => setProject(event.target.value)} /></label>
        <NumberField label="Tax" value={tax} onChange={setTax} suffix="%" min={0} />
        <NumberField label="Overhead / markup" value={overhead} onChange={setOverhead} suffix="%" min={0} />
      </div>
      <div className="estimate-table" role="table" aria-label="Estimate line items">
        <div className="estimate-row estimate-head" role="row"><span>Description</span><span>Qty</span><span>Rate</span><span>Total</span><span /></div>
        {items.map((item, index) => <div className="estimate-row" role="row" key={index}>
          <input aria-label={`Description ${index + 1}`} value={item.description} onChange={(event) => setItems((current) => current.map((row, rowIndex) => rowIndex === index ? { ...row, description: event.target.value } : row))} />
          <input aria-label={`Quantity ${index + 1}`} type="number" min="0" value={item.quantity} onChange={(event) => setItems((current) => current.map((row, rowIndex) => rowIndex === index ? { ...row, quantity: Number(event.target.value) } : row))} />
          <input aria-label={`Rate ${index + 1}`} type="number" min="0" step="0.01" value={item.rate} onChange={(event) => setItems((current) => current.map((row, rowIndex) => rowIndex === index ? { ...row, rate: Number(event.target.value) } : row))} />
          <strong>{money(item.quantity * item.rate)}</strong>
          <button type="button" aria-label={`Remove ${item.description}`} onClick={() => setItems((current) => current.filter((_, rowIndex) => rowIndex !== index))}>×</button>
        </div>)}
      </div>
      <button className="plain-button" type="button" onClick={() => setItems((current) => [...current, { description: "New item", quantity: 1, rate: 0 }])}>+ Add line item</button>
      <div className="result-panel estimate-total"><ResultGrid values={[["Subtotal", money(subtotal)], ["Tax", money(taxAmount)], ["Overhead", money(overheadAmount)], ["Estimate total", money(total)]]} /><ActionRow output={report} filename="construction-estimate.txt" /><button className="plain-button" type="button" onClick={() => window.print()}>Print / Save PDF</button></div>
      <p className="tool-caution">This is an estimate template, not legal, tax, code, or engineering advice.</p>
    </ToolFrame>
  );
}

export function SeatingTool({ name }: { name: string }) {
  const [guests, setGuests] = useState("Alex Morgan\nJamie Lee\nTaylor Kim\nJordan Smith\nCasey Brown\nRiley Davis\nAvery Wilson\nCameron Clark\nParker Hall\nQuinn Young");
  const [size, setSize] = useState("8");
  const tables = useMemo(() => {
    const names = guests.split(/\r?\n/).map((guest) => guest.trim()).filter(Boolean);
    const seats = Math.max(1, Number(size) || 8);
    return Array.from({ length: Math.ceil(names.length / seats) }, (_, index) => names.slice(index * seats, (index + 1) * seats));
  }, [guests, size]);
  const output = tables.map((table, index) => `TABLE ${index + 1}\n${table.map((guest, seat) => `${seat + 1}. ${guest}`).join("\n")}`).join("\n\n");
  return <ToolFrame title={name} status={`${tables.reduce((sum, table) => sum + table.length, 0)} guests`}>
    <div className="planner-grid"><TextField label="Guest list — one per line" value={guests} onChange={setGuests} rows={14} mono={false} /><div><NumberField label="Seats per table" value={size} onChange={setSize} min={1} step={1} /><div className="table-cards">{tables.map((table, index) => <section key={index}><h3>Table {index + 1} <span>{table.length}/{size}</span></h3><ol>{table.map((guest) => <li key={guest}>{guest}</li>)}</ol></section>)}</div></div></div>
    <ActionRow output={output} filename="wedding-seating-chart.txt" /><button className="plain-button" type="button" onClick={() => window.print()}>Print chart</button>
  </ToolFrame>;
}

export function ContractTool({ name }: { name: string }) {
  const [details, setDetails] = useState({ photographer: "Your Studio LLC", client: "Client Name", event: "Wedding photography", date: "2026-10-10", location: "Event venue", fee: "2500", deposit: "500", delivery: "6" });
  const update = (key: string, value: string) => setDetails((current) => ({ ...current, [key]: value }));
  const contract = `PHOTOGRAPHY SERVICES AGREEMENT\n\nThis agreement is between ${details.photographer} (Photographer) and ${details.client} (Client).\n\n1. SERVICES. Photographer will provide ${details.event} on ${details.date} at ${details.location}.\n\n2. PAYMENT. The total fee is ${money(Number(details.fee))}. A non-refundable retainer of ${money(Number(details.deposit))} is due to reserve the date. The remaining balance is due before the event unless agreed otherwise in writing.\n\n3. DELIVERY. Photographer will deliver the edited photographs within approximately ${details.delivery} weeks. Photographer retains artistic discretion over selection and editing.\n\n4. COPYRIGHT AND USE. Photographer retains copyright. Client receives a personal-use license and may print and share delivered images for non-commercial purposes.\n\n5. CANCELLATION AND RESCHEDULING. The parties will document any cancellation, rescheduling, replacement, or refund terms in writing.\n\n6. LIABILITY. Any liability is limited to amounts paid under this agreement to the extent permitted by law.\n\n7. MODEL RELEASE. Client chooses whether a separate written model release permits promotional use.\n\nClient signature: __________________  Date: __________\nPhotographer signature: ___________  Date: __________`;
  return <ToolFrame title={name} status="editable draft"><div className="field-grid three-up">
    {[["photographer", "Photographer / studio"], ["client", "Client"], ["event", "Services"], ["date", "Event date"], ["location", "Location"], ["fee", "Total fee ($)"], ["deposit", "Retainer ($)"], ["delivery", "Delivery (weeks)"]].map(([key, label]) => <label className="field" key={key}><span>{label}</span><input type={key === "date" ? "date" : key === "fee" || key === "deposit" || key === "delivery" ? "number" : "text"} value={details[key as keyof typeof details]} onChange={(event) => update(key, event.target.value)} /></label>)}
  </div><div className="contract-preview"><pre>{contract}</pre></div><ActionRow output={contract} filename="photography-contract.txt" /><button className="plain-button" type="button" onClick={() => window.print()}>Print / Save PDF</button><p className="tool-caution">Template only. Contract requirements vary by location and job; have local counsel review important agreements.</p></ToolFrame>;
}

export function RegexTool({ name }: { name: string }) {
  const [pattern, setPattern] = useState("(normal)\\s+(tools)");
  const [flags, setFlags] = useState("gi");
  const [input, setInput] = useState("Normal Tools are useful. normal tools should be simple.");
  const [replacement, setReplacement] = useState("$2, $1");
  const result = useMemo(() => { try { const regex = new RegExp(pattern, flags); const matches = [...input.matchAll(new RegExp(pattern, flags.includes("g") ? flags : `${flags}g`))]; return { error: "", matches, replaced: input.replace(regex, replacement) }; } catch (error) { return { error: error instanceof Error ? error.message : "Invalid expression", matches: [], replaced: "" }; } }, [pattern, flags, input, replacement]);
  return <ToolFrame title={name} status={`${result.matches.length} matches`}><div className="regex-line"><label className="field"><span>Pattern</span><span className="regex-input"><b>/</b><input value={pattern} onChange={(event) => setPattern(event.target.value)} /><b>/</b><input aria-label="Flags" value={flags} onChange={(event) => setFlags(event.target.value.replace(/[^dgimsuvy]/g, ""))} /></span></label><label className="field"><span>Replacement</span><input value={replacement} onChange={(event) => setReplacement(event.target.value)} /></label></div><TextField label="Test text" value={input} onChange={setInput} rows={8} />{result.error ? <div className="error-output">{result.error}</div> : <><div className="match-list">{result.matches.slice(0, 100).map((match, index) => <div key={`${match.index}-${index}`}><b>#{index + 1}</b><code>{match[0]}</code><span>index {match.index}</span>{match.slice(1).map((capture, captureIndex) => <em key={captureIndex}>${captureIndex + 1}: {capture}</em>)}</div>)}</div><TextField label="Replacement preview" value={result.replaced} onChange={() => {}} rows={5} /><ActionRow output={result.replaced} filename="regex-result.txt" /></>}</ToolFrame>;
}

function decodePart(part: string) { return JSON.parse(new TextDecoder().decode(Uint8Array.from(atob(part.replace(/-/g, "+").replace(/_/g, "/").padEnd(Math.ceil(part.length / 4) * 4, "=")), (char) => char.charCodeAt(0)))); }

export function JwtTool({ name }: { name: string }) {
  const [token, setToken] = useState("");
  const result = useMemo(() => { try { const parts = token.trim().split("."); if (parts.length !== 3) throw new Error("A JWT has three dot-separated parts."); const header = decodePart(parts[0]); const payload = decodePart(parts[1]); const expiry = payload.exp ? new Date(payload.exp * 1000) : null; return { error: "", output: `HEADER\n${JSON.stringify(header, null, 2)}\n\nPAYLOAD\n${JSON.stringify(payload, null, 2)}\n\nSIGNATURE\n${parts[2]}\n\nSTATUS\n${expiry ? `${expiry > new Date() ? "Not expired" : "Expired"} — ${expiry.toISOString()}` : "No exp claim"}` }; } catch (error) { return { error: error instanceof Error ? error.message : "Could not decode token", output: "" }; } }, [token]);
  return <ToolFrame title={name} status="decode only"><TextField label="Encoded JWT" value={token} onChange={setToken} placeholder="eyJhbGciOi..." rows={6} />{token && (result.error ? <div className="error-output">{result.error}</div> : <><TextField label="Decoded token" value={result.output} onChange={() => {}} rows={16} /><ActionRow output={result.output} filename="decoded-jwt.txt" /></>)}<p className="tool-caution">Decoding does not verify the signature. Never treat an unverified payload as trusted. This tool does not send the token anywhere.</p></ToolFrame>;
}

export function CronTool({ name }: { name: string }) {
  const [minute, setMinute] = useState("0"); const [hour, setHour] = useState("9"); const [day, setDay] = useState("*"); const [month, setMonth] = useState("*"); const [weekday, setWeekday] = useState("1-5");
  const expression = `${minute} ${hour} ${day} ${month} ${weekday}`;
  const summary = `At ${hour.padStart(2, "0")}:${minute.padStart(2, "0")}${weekday === "1-5" ? ", Monday through Friday" : weekday === "*" ? ", every day" : `, on weekday field ${weekday}`}${day !== "*" ? `, day ${day} of the month` : ""}${month !== "*" ? `, month ${month}` : ""}.`;
  return <ToolFrame title={name} status="5-field cron"><div className="cron-grid"><NumberField label="Minute" value={minute} onChange={setMinute} min={0} max={59} step={1} /><NumberField label="Hour (0–23)" value={hour} onChange={setHour} min={0} max={23} step={1} /><label className="field"><span>Day of month</span><input value={day} onChange={(event) => setDay(event.target.value)} /></label><label className="field"><span>Month</span><input value={month} onChange={(event) => setMonth(event.target.value)} /></label><SelectField label="Weekday" value={weekday} onChange={setWeekday} options={[["*", "Every day"], ["1-5", "Monday–Friday"], ["0,6", "Weekend"], ["1", "Monday"], ["2", "Tuesday"], ["3", "Wednesday"], ["4", "Thursday"], ["5", "Friday"], ["6", "Saturday"], ["0", "Sunday"]]} /></div><div className="big-code"><code>{expression}</code><button type="button" onClick={() => copyText(expression)}>Copy</button></div><p>{summary}</p><p className="tool-caution">Cron weekday numbering and timezone behavior can vary by scheduler. Confirm both before deploying a job.</p></ToolFrame>;
}

export function DomainTool({ name }: { name: string }) {
  const [domain, setDomain] = useState("example.com"); const [loading, setLoading] = useState(false); const [result, setResult] = useState<Array<[string, string]> | null>(null); const [error, setError] = useState("");
  const lookup = async () => { setLoading(true); setError(""); setResult(null); try { const clean = domain.trim().toLowerCase().replace(/^https?:\/\//, "").split("/")[0]; const response = await fetch(`https://rdap.org/domain/${encodeURIComponent(clean)}`); if (!response.ok) throw new Error(`RDAP returned ${response.status}. The domain may be unregistered or the directory may be busy.`); const data = await response.json(); const registration = data.events?.find((event: { eventAction: string }) => event.eventAction === "registration")?.eventDate; if (!registration) throw new Error("The registry did not publish a registration date."); const created = new Date(registration); const days = Math.floor((Date.now() - created.getTime()) / 86400000); setResult([["Domain", data.ldhName || clean], ["Registered", created.toLocaleDateString()], ["Age", `${Math.floor(days / 365.2425)} years, ${Math.floor((days % 365.2425) / 30.44)} months`], ["Age in days", number(days, 0)], ["Registry status", (data.status || []).join(", ") || "Not supplied"]]); } catch (lookupError) { setError(lookupError instanceof Error ? lookupError.message : "Lookup failed."); } finally { setLoading(false); } };
  return <ToolFrame title={name} status="public RDAP lookup"><div className="domain-search"><label className="field"><span>Domain name</span><input value={domain} onChange={(event) => setDomain(event.target.value)} onKeyDown={(event) => { if (event.key === "Enter") lookup(); }} /></label><button className="plain-button primary-button" type="button" disabled={loading} onClick={lookup}>{loading ? "Looking up…" : "Check age"}</button></div>{error && <div className="error-output" role="alert">{error}</div>}{result && <div className="result-panel"><ResultGrid values={result} /></div>}<p className="tool-caution">Registration dates come from the domain registry’s public RDAP record. A transfer or registry history can make “age” differ from the first-ever use of the name.</p></ToolFrame>;
}

export function DiffTool({ name }: { name: string }) {
  const [before, setBefore] = useState("line one\nline two\nline three"); const [after, setAfter] = useState("line one\nline two updated\nline three\nline four");
  const rows = useMemo(() => { const a = before.split(/\r?\n/); const b = after.split(/\r?\n/); const max = Math.max(a.length, b.length); return Array.from({ length: max }, (_, index) => ({ old: a[index] ?? "", next: b[index] ?? "", state: a[index] === b[index] ? "same" : a[index] === undefined ? "add" : b[index] === undefined ? "remove" : "change" })); }, [before, after]);
  const output = rows.map((row) => row.state === "same" ? `  ${row.old}` : `${row.old ? `- ${row.old}\n` : ""}${row.next ? `+ ${row.next}` : ""}`).join("\n");
  return <ToolFrame title={name} status={`${rows.filter((row) => row.state !== "same").length} changed lines`}><div className="editor-grid"><TextField label="Original text" value={before} onChange={setBefore} /><TextField label="Changed text" value={after} onChange={setAfter} /></div><div className="diff-output">{rows.map((row, index) => <div className={`diff-${row.state}`} key={index}><span>{index + 1}</span><del>{row.old}</del><ins>{row.next}</ins></div>)}</div><ActionRow output={output} filename="text-diff.txt" /></ToolFrame>;
}

export function UuidTool({ name }: { name: string }) {
  const [count, setCount] = useState("10"); const [values, setValues] = useState(() => Array.from({ length: 10 }, () => crypto.randomUUID()));
  const generate = () => setValues(Array.from({ length: Math.min(500, Math.max(1, Math.floor(Number(count)) || 1)) }, () => crypto.randomUUID()));
  return <ToolFrame title={name} status={`${values.length} generated`}><div className="small-control"><NumberField label="How many (1–500)" value={count} onChange={setCount} min={1} step={1} /><button className="plain-button primary-button" type="button" onClick={generate}>Generate UUIDs</button></div><TextField label="UUID v4 values" value={values.join("\n")} onChange={() => {}} rows={14} /><ActionRow output={values.join("\n")} filename="uuids.txt" /></ToolFrame>;
}

export function HashTool({ name }: { name: string }) {
  const [input, setInput] = useState("Normal tools for normal tasks."); const [algorithm, setAlgorithm] = useState("SHA-256"); const [hash, setHash] = useState("");
  const run = async () => { const buffer = await crypto.subtle.digest(algorithm, new TextEncoder().encode(input)); setHash([...new Uint8Array(buffer)].map((byte) => byte.toString(16).padStart(2, "0")).join("")); };
  return <ToolFrame title={name} status="Web Crypto"><div className="inline-options"><SelectField label="Algorithm" value={algorithm} onChange={setAlgorithm} options={[["SHA-1", "SHA-1"], ["SHA-256", "SHA-256"], ["SHA-384", "SHA-384"], ["SHA-512", "SHA-512"]]} /></div><TextField label="Text to hash" value={input} onChange={setInput} rows={8} /><ActionRow output={hash} filename="hash.txt" onRun={run} runLabel="Generate hash" />{hash && <div className="big-code wrap-code"><code>{hash}</code></div>}<p className="tool-caution">A hash cannot be reversed. SHA-1 remains available for compatibility but should not be used for modern security.</p></ToolFrame>;
}

function hexToRgb(hex: string) { const value = hex.replace("#", "").trim(); const full = value.length === 3 ? value.split("").map((char) => char + char).join("") : value; if (!/^[0-9a-f]{6}$/i.test(full)) throw new Error("Enter a 3- or 6-digit HEX color."); return { r: parseInt(full.slice(0, 2), 16), g: parseInt(full.slice(2, 4), 16), b: parseInt(full.slice(4, 6), 16), hex: `#${full.toUpperCase()}` }; }
function rgbToHsl(r: number, g: number, b: number) { const values = [r / 255, g / 255, b / 255]; const max = Math.max(...values), min = Math.min(...values); let h = 0; const l = (max + min) / 2; const d = max - min; const s = d === 0 ? 0 : d / (1 - Math.abs(2 * l - 1)); if (d) { if (max === values[0]) h = 60 * (((values[1] - values[2]) / d) % 6); else if (max === values[1]) h = 60 * ((values[2] - values[0]) / d + 2); else h = 60 * ((values[0] - values[1]) / d + 4); } return { h: Math.round((h + 360) % 360), s: Math.round(s * 100), l: Math.round(l * 100) }; }

export function ColorTool({ name, hexOnly = false }: { name: string; hexOnly?: boolean }) {
  const [hex, setHex] = useState("#267047"); const [alpha, setAlpha] = useState("1");
  let color; let error = ""; try { color = hexToRgb(hex); } catch (caught) { error = caught instanceof Error ? caught.message : "Invalid color"; color = { r: 0, g: 0, b: 0, hex: "#000000" }; } const hsl = rgbToHsl(color.r, color.g, color.b);
  const output = `HEX: ${color.hex}\nRGB: rgb(${color.r}, ${color.g}, ${color.b})\nRGBA: rgba(${color.r}, ${color.g}, ${color.b}, ${alpha})\nHSL: hsl(${hsl.h}, ${hsl.s}%, ${hsl.l}%)`;
  return <ToolFrame title={name} status="updates live"><div className="color-layout"><div className="color-swatch" style={{ background: error ? "#eee" : color.hex }}><input aria-label="Choose color" type="color" value={color.hex} onChange={(event) => setHex(event.target.value)} /></div><div className="field-grid"><label className="field"><span>HEX</span><input value={hex} onChange={(event) => setHex(event.target.value)} /></label>{!hexOnly && <NumberField label="Alpha" value={alpha} onChange={setAlpha} min={0} max={1} step={0.01} />}</div></div>{error ? <div className="error-output">{error}</div> : <><ResultGrid values={[["HEX", color.hex], ["RGB", `rgb(${color.r}, ${color.g}, ${color.b})`], ["RGBA", `rgba(${color.r}, ${color.g}, ${color.b}, ${alpha})`], ["HSL", `hsl(${hsl.h}, ${hsl.s}%, ${hsl.l}%)`]]} /><ActionRow output={output} filename="color-values.txt" /></>}</ToolFrame>;
}

export function GradientTool({ name }: { name: string }) {
  const [first, setFirst] = useState("#174ea6"); const [second, setSecond] = useState("#e4c95a"); const [angle, setAngle] = useState("135"); const [type, setType] = useState("linear"); const css = type === "radial" ? `background: radial-gradient(circle, ${first}, ${second});` : `background: linear-gradient(${angle}deg, ${first}, ${second});`;
  return <ToolFrame title={name} status="CSS preview"><div className="gradient-preview" style={{ background: css.replace("background: ", "").replace(";", "") }} /><div className="field-grid"><label className="field"><span>First color</span><input type="color" value={first} onChange={(event) => setFirst(event.target.value)} /></label><label className="field"><span>Second color</span><input type="color" value={second} onChange={(event) => setSecond(event.target.value)} /></label><SelectField label="Gradient type" value={type} onChange={setType} options={[["linear", "Linear"], ["radial", "Radial"]]} />{type === "linear" && <NumberField label="Angle" value={angle} onChange={setAngle} suffix="°" step={1} />}</div><div className="big-code wrap-code"><code>{css}</code><button type="button" onClick={() => copyText(css)}>Copy</button></div></ToolFrame>;
}

export function FaviconTool({ name }: { name: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null); const [mark, setMark] = useState("N"); const [background, setBackground] = useState("#267047"); const [foreground, setForeground] = useState("#ffffff"); const [size, setSize] = useState("512");
  useEffect(() => { const canvas = canvasRef.current; if (!canvas) return; const pixels = Number(size); canvas.width = pixels; canvas.height = pixels; const context = canvas.getContext("2d"); if (!context) return; context.fillStyle = background; context.fillRect(0, 0, pixels, pixels); context.fillStyle = foreground; context.textAlign = "center"; context.textBaseline = "middle"; context.font = `bold ${pixels * 0.58}px Georgia, serif`; context.fillText(mark.slice(0, 2), pixels / 2, pixels * 0.53); }, [mark, background, foreground, size]);
  const download = () => canvasRef.current?.toBlob((blob) => { if (!blob) return; const url = URL.createObjectURL(blob); const link = document.createElement("a"); link.href = url; link.download = `favicon-${size}.png`; link.click(); setTimeout(() => URL.revokeObjectURL(url), 1000); });
  return <ToolFrame title={name} status="PNG output"><div className="favicon-layout"><canvas ref={canvasRef} className="favicon-preview" /><div className="field-grid"><label className="field"><span>Letter or emoji</span><input value={mark} maxLength={2} onChange={(event) => setMark(event.target.value)} /></label><label className="field"><span>Background</span><input type="color" value={background} onChange={(event) => setBackground(event.target.value)} /></label><label className="field"><span>Foreground</span><input type="color" value={foreground} onChange={(event) => setForeground(event.target.value)} /></label><SelectField label="PNG size" value={size} onChange={setSize} options={[["32", "32 × 32"], ["48", "48 × 48"], ["180", "180 × 180"], ["192", "192 × 192"], ["512", "512 × 512"]]} /><button className="plain-button primary-button" type="button" onClick={download}>Download PNG</button></div></div></ToolFrame>;
}

export function TimestampTool({ name }: { name: string }) {
  const [value, setValue] = useState(() => String(Math.floor(Date.now() / 1000))); const [mode, setMode] = useState("seconds");
  const date = useMemo(() => { if (mode === "seconds") return new Date(Number(value) * 1000); if (mode === "milliseconds") return new Date(Number(value)); return new Date(value); }, [value, mode]); const valid = !Number.isNaN(date.getTime()); const output = valid ? `Local: ${date.toString()}\nUTC: ${date.toUTCString()}\nISO 8601: ${date.toISOString()}\nUnix seconds: ${Math.floor(date.getTime() / 1000)}\nUnix milliseconds: ${date.getTime()}` : "Invalid date or timestamp";
  return <ToolFrame title={name} status="timezone aware"><div className="inline-options"><SelectField label="Input type" value={mode} onChange={setMode} options={[["seconds", "Unix seconds"], ["milliseconds", "Unix milliseconds"], ["date", "Date / ISO string"]]} /></div><label className="field field-wide"><span>Timestamp or date</span><input value={value} onChange={(event) => setValue(event.target.value)} /></label><TextField label="Converted values" value={output} onChange={() => {}} rows={8} /><ActionRow output={output} filename="timestamp.txt" /><button className="plain-button" type="button" onClick={() => { setValue(String(Math.floor(Date.now() / 1000))); setMode("seconds"); }}>Use current time</button></ToolFrame>;
}

function gcd(a: number, b: number): number { return b ? gcd(b, a % b) : Math.abs(a); }
export function AspectTool({ name }: { name: string }) {
  const [width, setWidth] = useState("1920"); const [height, setHeight] = useState("1080"); const [newWidth, setNewWidth] = useState("1280"); const divisor = gcd(Math.round(Number(width)), Math.round(Number(height))) || 1; const ratio = `${Math.round(Number(width)) / divisor}:${Math.round(Number(height)) / divisor}`; const newHeight = Number(newWidth) * Number(height) / Math.max(Number(width), 1);
  return <ToolFrame title={name} status="keeps proportions"><div className="field-grid three-up"><NumberField label="Original width" value={width} onChange={setWidth} min={1} suffix="px" /><NumberField label="Original height" value={height} onChange={setHeight} min={1} suffix="px" /><NumberField label="New width" value={newWidth} onChange={setNewWidth} min={1} suffix="px" /></div><ResultGrid values={[["Simplified ratio", ratio], ["Decimal ratio", number(Number(width) / Math.max(Number(height), 1), 4)], ["Matching new height", `${number(newHeight, 2)}px`], ["CSS aspect-ratio", `${Math.round(Number(width))} / ${Math.round(Number(height))}`]]} /></ToolFrame>;
}

export function NameTool({ name, kind }: { name: string; kind: NameKind }) {
  const controls = nameGeneratorControls[kind];
  const [cue, setCue] = useState("");
  const [style, setStyle] = useState(controls.styles[0][0]);
  const [format, setFormat] = useState(controls.formats[0][0]);
  const generation = useRef(1);
  const [results, setResults] = useState<string[]>(() => generateNames({ kind, cue: "", style: controls.styles[0][0], format: controls.formats[0][0], seed: 1 }));
  const generate = () => {
    generation.current += 1;
    setResults(generateNames({ kind, cue, style, format, seed: Date.now() ^ generation.current }));
  };
  const surprise = () => {
    const nextStyle = controls.styles[Math.floor(Math.random() * controls.styles.length)][0];
    const nextFormat = controls.formats[Math.floor(Math.random() * controls.formats.length)][0];
    setStyle(nextStyle);
    setFormat(nextFormat);
    generation.current += 1;
    setResults(generateNames({ kind, cue, style: nextStyle, format: nextFormat, seed: Date.now() ^ generation.current }));
  };
  return <ToolFrame title={name} status="curated local generator">
    <div className="name-controls">
      <label className="field name-cue"><span>{controls.cueLabel}</span><input value={cue} onChange={(event) => setCue(event.target.value)} onKeyDown={(event) => { if (event.key === "Enter") generate(); }} placeholder={controls.cuePlaceholder} /></label>
      <SelectField label={controls.styleLabel} value={style} onChange={setStyle} options={controls.styles} />
      <SelectField label={controls.formatLabel} value={format} onChange={setFormat} options={controls.formats} />
      <button className="plain-button primary-button" type="button" onClick={generate}>Generate 12 names</button>
      <button className="plain-button" type="button" onClick={surprise}>Surprise me</button>
    </div>
    <p className="name-note">Built from curated vocabularies, naming structures, and genre-specific sound rules. Your input stays in this browser.</p>
    <div className="name-results">{results.map((result) => <button key={result} type="button" onClick={() => copyText(result)} title="Copy this name"><strong>{result}</strong><span>copy</span></button>)}</div>
    <ActionRow output={results.join("\n")} filename={`${kind}-names.txt`} />
    <p className="tool-caution">Name availability is not checked. Search trademarks, domains, social handles, and existing projects before committing.</p>
  </ToolFrame>;
}
