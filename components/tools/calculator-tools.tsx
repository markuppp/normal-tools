"use client";

import { useMemo, useState } from "react";
import { ActionRow, money, NumberField, number, ResultGrid, ToolFrame } from "./shared";

type FieldSpec = { key: string; label: string; initial: number; suffix?: string; min?: number; step?: number; help?: string };
type CalcSpec = { fields: FieldSpec[]; calculate: (values: Record<string, number>) => Array<[string, string]>; note: string };

const specs: Record<string, CalcSpec> = {
  "etsy-fee-profit-calculator": {
    fields: [
      { key: "price", label: "Item price", initial: 35, suffix: "$", min: 0 },
      { key: "shipping", label: "Shipping charged", initial: 5, suffix: "$", min: 0 },
      { key: "cost", label: "Item cost", initial: 12, suffix: "$", min: 0 },
      { key: "shipCost", label: "Your shipping cost", initial: 5, suffix: "$", min: 0 },
      { key: "listing", label: "Listing fee", initial: 0.2, suffix: "$", min: 0, step: 0.01 },
      { key: "transaction", label: "Transaction fee", initial: 6.5, suffix: "%", min: 0, step: 0.1 },
      { key: "payment", label: "Payment processing", initial: 3, suffix: "%", min: 0, step: 0.1 },
      { key: "paymentFlat", label: "Payment flat fee", initial: 0.25, suffix: "$", min: 0, step: 0.01 },
      { key: "ads", label: "Offsite ads fee", initial: 0, suffix: "%", min: 0, step: 0.1 },
    ],
    calculate: (v) => {
      const revenue = v.price + v.shipping;
      const fees = v.listing + revenue * ((v.transaction + v.payment + v.ads) / 100) + v.paymentFlat;
      const profit = revenue - fees - v.cost - v.shipCost;
      return [["Customer pays", money(revenue)], ["Estimated fees", money(fees)], ["Net profit", money(profit)], ["Profit margin", `${number(profit / Math.max(revenue, 0.01) * 100, 1)}%`], ["Break-even price", money((v.cost + v.shipCost + v.listing + v.paymentFlat) / Math.max(1 - (v.transaction + v.payment + v.ads) / 100, 0.01) - v.shipping)]];
    },
    note: "Defaults are editable because payment and ad fees can vary by country and sale source.",
  },
  "roof-pitch-rafter-calculator": {
    fields: [
      { key: "run", label: "Horizontal run", initial: 12, suffix: "ft", min: 0.01 },
      { key: "rise", label: "Roof rise", initial: 6, suffix: "ft", min: 0 },
      { key: "length", label: "Building length", initial: 30, suffix: "ft", min: 0.01 },
      { key: "overhang", label: "Eave overhang", initial: 1, suffix: "ft", min: 0 },
    ],
    calculate: (v) => {
      const ratio = v.rise / Math.max(v.run, 0.01);
      const rafter = Math.hypot(v.run + v.overhang, v.rise * (v.run + v.overhang) / Math.max(v.run, 0.01));
      const area = rafter * v.length * 2;
      return [["Pitch", `${number(ratio * 12, 2)} in 12`], ["Roof angle", `${number(Math.atan(ratio) * 180 / Math.PI, 2)}°`], ["Common rafter", `${number(rafter, 2)} ft`], ["Both roof planes", `${number(area, 1)} sq ft`], ["With 10% waste", `${number(area * 1.1, 1)} sq ft`]];
    },
    note: "This gives geometric lengths only. Confirm birdsmouth, ridge, local code, and structural sizing with a qualified builder.",
  },
  "amazon-fba-profit-calculator": {
    fields: [
      { key: "price", label: "Sale price", initial: 29.99, suffix: "$", min: 0 },
      { key: "cost", label: "Product cost", initial: 7, suffix: "$", min: 0 },
      { key: "referral", label: "Referral fee", initial: 15, suffix: "%", min: 0 },
      { key: "fulfillment", label: "FBA fulfillment fee", initial: 4.25, suffix: "$", min: 0 },
      { key: "storage", label: "Storage per unit", initial: 0.35, suffix: "$", min: 0 },
      { key: "inbound", label: "Inbound shipping", initial: 0.8, suffix: "$", min: 0 },
      { key: "ads", label: "Advertising per sale", initial: 2.5, suffix: "$", min: 0 },
    ],
    calculate: (v) => {
      const amazon = v.price * v.referral / 100 + v.fulfillment + v.storage;
      const total = amazon + v.cost + v.inbound + v.ads;
      const profit = v.price - total;
      return [["Amazon fees", money(amazon)], ["All costs", money(total)], ["Net profit", money(profit)], ["Net margin", `${number(profit / Math.max(v.price, 0.01) * 100, 1)}%`], ["ROI on product cost", `${number(profit / Math.max(v.cost + v.inbound, 0.01) * 100, 1)}%`]];
    },
    note: "This is an estimate, not an Amazon quote. Enter the fees shown for your exact product size and marketplace.",
  },
  "deck-material-calculator": {
    fields: [
      { key: "length", label: "Deck length", initial: 16, suffix: "ft", min: 0.1 },
      { key: "width", label: "Deck width", initial: 12, suffix: "ft", min: 0.1 },
      { key: "board", label: "Board face width", initial: 5.5, suffix: "in", min: 0.1 },
      { key: "gap", label: "Gap between boards", initial: 0.125, suffix: "in", min: 0 },
      { key: "joists", label: "Joist spacing", initial: 16, suffix: "in", min: 1 },
      { key: "waste", label: "Waste allowance", initial: 10, suffix: "%", min: 0 },
    ],
    calculate: (v) => {
      const rows = Math.ceil(v.width * 12 / (v.board + v.gap));
      const linear = rows * v.length * (1 + v.waste / 100);
      const joists = Math.ceil(v.length * 12 / v.joists) + 1;
      return [["Deck area", `${number(v.length * v.width, 1)} sq ft`], ["Board rows", `${rows}`], ["Decking needed", `${number(linear, 1)} linear ft`], ["Joists", `${joists}`], ["Fasteners", `${Math.ceil(rows * joists * 2 * 1.1)}`]];
    },
    note: "Assumes straight boards across the deck width. Stairs, picture framing, beams, posts, and code requirements are separate.",
  },
  "px-to-rem-converter": {
    fields: [
      { key: "px", label: "Pixels", initial: 24, suffix: "px" },
      { key: "root", label: "Root font size", initial: 16, suffix: "px", min: 0.01 },
    ],
    calculate: (v) => [["REM value", `${number(v.px / v.root, 5)}rem`], ["CSS", `font-size: ${number(v.px / v.root, 5)}rem;`], ["Back to pixels", `${number((v.px / v.root) * v.root, 2)}px`]],
    note: "Most browsers use a 16px default root size, but your site may set a different value.",
  },
  "twitch-bits-to-usd-converter": {
    fields: [{ key: "bits", label: "Twitch Bits", initial: 1000, suffix: "Bits", min: 0, step: 1 }],
    calculate: (v) => [["Creator value", money(v.bits * 0.01)], ["Value per Bit", "$0.01"], ["Cheer amount", `${number(v.bits, 0)} Bits`]],
    note: "Uses the standard creator revenue of one US cent per Bit. Viewer purchase price varies by package, country, and platform.",
  },
};

export function CalculatorTool({ slug, name }: { slug: string; name: string }) {
  const spec = specs[slug];
  const [values, setValues] = useState<Record<string, string>>(() => Object.fromEntries(spec.fields.map((field) => [field.key, String(field.initial)])));
  const numeric = useMemo(() => Object.fromEntries(Object.entries(values).map(([key, value]) => [key, Number(value) || 0])), [values]);
  const results = spec.calculate(numeric);
  const report = results.map(([label, value]) => `${label}: ${value}`).join("\n");
  return (
    <ToolFrame title={name} status="updates live">
      <div className="calculator-layout">
        <div className="field-grid">
          {spec.fields.map((field) => <NumberField key={field.key} label={field.label} value={values[field.key]} min={field.min} step={field.step} suffix={field.suffix} help={field.help} onChange={(value) => setValues((current) => ({ ...current, [field.key]: value }))} />)}
        </div>
        <div className="result-panel">
          <span className="result-kicker">Estimate</span>
          <ResultGrid values={results} />
          <ActionRow output={report} filename={`${slug}-result.txt`} />
        </div>
      </div>
      <p className="tool-caution">{spec.note}</p>
    </ToolFrame>
  );
}

export const calculatorSlugs = new Set(Object.keys(specs));
