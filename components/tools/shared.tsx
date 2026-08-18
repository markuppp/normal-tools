"use client";

import type { ReactNode } from "react";

export function ToolFrame({ title, status = "ready", children }: { title: string; status?: string; children: ReactNode }) {
  return (
    <section className="tool-box universal-box" aria-label={title}>
      <div className="tool-box-bar">
        <strong>{title}</strong>
        <span className="status-line"><span className="status-dot connected" aria-hidden="true" />{status}</span>
      </div>
      <div className="tool-box-body">{children}</div>
    </section>
  );
}

export function NumberField({ label, value, onChange, min, max, step = "any", suffix, help }: {
  label: string; value: string; onChange: (value: string) => void; min?: number; max?: number; step?: number | "any"; suffix?: string; help?: string;
}) {
  return (
    <label className="field">
      <span>{label}</span>
      <span className="input-with-suffix">
        <input type="number" value={value} min={min} max={max} step={step} onChange={(event) => onChange(event.target.value)} />
        {suffix && <b>{suffix}</b>}
      </span>
      {help && <small>{help}</small>}
    </label>
  );
}

export function TextField({ label, value, onChange, placeholder = "", rows = 12, mono = true }: {
  label: string; value: string; onChange: (value: string) => void; placeholder?: string; rows?: number; mono?: boolean;
}) {
  return (
    <label className="field field-wide">
      <span>{label}</span>
      <textarea className={mono ? "mono-input" : ""} value={value} rows={rows} placeholder={placeholder} onChange={(event) => onChange(event.target.value)} />
    </label>
  );
}

export function SelectField({ label, value, onChange, options }: {
  label: string; value: string; onChange: (value: string) => void; options: Array<[string, string]>;
}) {
  return (
    <label className="field">
      <span>{label}</span>
      <select value={value} onChange={(event) => onChange(event.target.value)}>
        {options.map(([optionValue, optionLabel]) => <option key={optionValue} value={optionValue}>{optionLabel}</option>)}
      </select>
    </label>
  );
}

export function ResultGrid({ values }: { values: Array<[string, string]> }) {
  return (
    <dl className="result-grid" aria-live="polite">
      {values.map(([label, value]) => <div key={label}><dt>{label}</dt><dd>{value}</dd></div>)}
    </dl>
  );
}

export async function copyText(value: string) {
  try {
    if (navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(value);
      return;
    }
  } catch {
    // Fall back for browsers that expose Clipboard API but deny the request.
  }
  const input = document.createElement("textarea");
  input.value = value;
  input.setAttribute("readonly", "");
  input.style.position = "fixed";
  input.style.opacity = "0";
  document.body.appendChild(input);
  input.select();
  document.execCommand("copy");
  input.remove();
}

export function secureRandomInt(maxExclusive: number) {
  if (!Number.isSafeInteger(maxExclusive) || maxExclusive < 1 || maxExclusive > 2 ** 53) {
    throw new RangeError("Random range must be a safe positive integer.");
  }
  const sampleSpace = 2 ** 53;
  const limit = Math.floor(sampleSpace / maxExclusive) * maxExclusive;
  let value = limit;
  while (value >= limit) {
    const words = crypto.getRandomValues(new Uint32Array(2));
    value = (words[0] & 0x1fffff) * 2 ** 32 + words[1];
  }
  return value % maxExclusive;
}

export function downloadText(filename: string, text: string, type = "text/plain") {
  const url = URL.createObjectURL(new Blob([text], { type }));
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  link.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

export function ActionRow({ output, filename = "normal-tools.txt", onRun, runLabel = "Run tool" }: {
  output?: string; filename?: string; onRun?: () => void; runLabel?: string;
}) {
  return (
    <div className="tool-actions">
      {onRun && <button className="plain-button primary-button" type="button" onClick={onRun}>{runLabel}</button>}
      {output !== undefined && <button className="plain-button" type="button" onClick={() => copyText(output)}>Copy result</button>}
      {output !== undefined && <button className="plain-button" type="button" onClick={() => downloadText(filename, output)}>Download</button>}
    </div>
  );
}

export const money = (value: number) => Number.isFinite(value) ? value.toLocaleString("en-US", { style: "currency", currency: "USD" }) : "$0.00";
export const number = (value: number, digits = 2) => Number.isFinite(value) ? value.toLocaleString("en-US", { maximumFractionDigits: digits }) : "0";
