"use client";

import { useMemo, useState } from "react";
import { ActionRow, money, NumberField, number, ResultGrid, ToolFrame } from "./shared";

type Field = { key: string; label: string; initial: number; suffix?: string; min?: number; step?: number; help?: string };
type Spec = { fields: Field[]; calculate: (v: Record<string, number>) => Array<[string, string]>; note: string };

const feeSpec = (rate: number, fixed: number, note: string): Spec => ({
  fields: [
    { key: "sale", label: "Sale price", initial: 40, suffix: "$", min: 0 },
    { key: "shipping", label: "Shipping charged", initial: 5, suffix: "$", min: 0 },
    { key: "cost", label: "Product cost", initial: 12, suffix: "$", min: 0 },
    { key: "shippingCost", label: "Your shipping cost", initial: 5, suffix: "$", min: 0 },
    { key: "rate", label: "Percentage fee", initial: rate, suffix: "%", min: 0, step: .01 },
    { key: "fixed", label: "Fixed fee", initial: fixed, suffix: "$", min: 0, step: .01 },
    { key: "other", label: "Ads / other fees", initial: 0, suffix: "$", min: 0 },
  ],
  calculate: (v) => {
    const gross = v.sale + v.shipping;
    const fees = gross * v.rate / 100 + v.fixed + v.other;
    const profit = gross - fees - v.cost - v.shippingCost;
    return [["Buyer pays", money(gross)], ["Platform fees", money(fees)], ["Seller payout", money(gross - fees)], ["Net profit", money(profit)], ["Profit margin", `${number(profit / Math.max(gross, .01) * 100, 1)}%`], ["Break-even sale price", money((v.cost + v.shippingCost + v.fixed + v.other) / Math.max(1 - v.rate / 100, .01) - v.shipping)]];
  },
  note: `${note} Rates vary by country, category, plan, payment method, and promotions, so every fee assumption is editable.`,
});

const specs: Record<string, Spec> = {
  "ebay-fee-profit-calculator": feeSpec(13.25, .30, "Uses a common eBay final-value fee as the starting point."),
  "depop-fee-calculator": feeSpec(3.3, .45, "Starts with a payment-processing estimate; seller fees vary by market."),
  "poshmark-fee-calculator": feeSpec(20, 0, "Starts with the common percentage fee for sales above the platform minimum."),
  "mercari-profit-calculator": feeSpec(10, 0, "Starts with an editable marketplace-fee estimate."),
  "whatnot-seller-fee-calculator": feeSpec(11.9, .30, "Combines an editable commission and payment-fee estimate."),
  "tiktok-shop-fee-calculator": feeSpec(6, 0, "Starts with an editable referral-fee estimate."),
  "gumroad-fee-calculator": feeSpec(10, .50, "Starts with a direct-sale fee estimate and does not include tax remittance."),
  "printify-profit-calculator": feeSpec(0, 0, "Enter the production cost under product cost and any storefront fee under percentage fee."),
  "shopify-profit-margin-calculator": feeSpec(2.9, .30, "Starts with a typical online card-processing fee; enter app and ad costs under other fees."),
  "stripe-fee-calculator": feeSpec(2.9, .30, "Starts with a common US online-card rate."),
  "paypal-fee-calculator": feeSpec(3.49, .49, "Starts with a common US commercial transaction rate."),
  "square-fee-calculator": feeSpec(2.6, .15, "Starts with a common in-person payment rate."),
  "patreon-earnings-calculator": {
    fields: [{ key: "gross", label: "Monthly member revenue", initial: 2500, suffix: "$", min: 0 }, { key: "members", label: "Paying members", initial: 100, min: 1, step: 1 }, { key: "platform", label: "Platform fee", initial: 8, suffix: "%", min: 0 }, { key: "processing", label: "Processing fee", initial: 2.9, suffix: "%", min: 0 }, { key: "fixed", label: "Fixed fee per member", initial: .30, suffix: "$", min: 0 }],
    calculate: (v) => { const fees = v.gross * (v.platform + v.processing) / 100 + v.members * v.fixed; const net = v.gross - fees; return [["Gross revenue", money(v.gross)], ["Estimated fees", money(fees)], ["Estimated payout", money(net)], ["Average per member", money(net / Math.max(v.members, 1))], ["Effective fee rate", `${number(fees / Math.max(v.gross, .01) * 100, 1)}%`]]; },
    note: "Taxes, currency conversion, refunds, and plan-specific features are not included. Enter the rates shown for your account.",
  },
  "kdp-royalty-calculator": {
    fields: [{ key: "price", label: "List price", initial: 14.99, suffix: "$", min: 0 }, { key: "royalty", label: "Royalty rate", initial: 60, suffix: "%", min: 0 }, { key: "print", label: "Printing cost", initial: 4.45, suffix: "$", min: 0 }, { key: "delivery", label: "Ebook delivery cost", initial: 0, suffix: "$", min: 0 }, { key: "sales", label: "Expected sales", initial: 100, min: 1, step: 1 }],
    calculate: (v) => { const perBook = v.price * v.royalty / 100 - v.print - v.delivery; return [["Royalty per sale", money(perBook)], ["Amazon share before costs", money(v.price * (1 - v.royalty / 100))], ["Author revenue", money(perBook * v.sales)], ["Break-even sales for $1,000", number(1000 / Math.max(perBook, .01), 0)], ["Royalty margin", `${number(perBook / Math.max(v.price, .01) * 100, 1)}%`]]; },
    note: "Enter the royalty rate and delivery or print cost shown by KDP for the exact marketplace, format, page count, and ink type.",
  },
  "airbnb-host-payout-calculator": {
    fields: [{ key: "nightly", label: "Nightly rate", initial: 180, suffix: "$", min: 0 }, { key: "nights", label: "Nights", initial: 4, min: 1, step: 1 }, { key: "cleaning", label: "Cleaning fee charged", initial: 80, suffix: "$", min: 0 }, { key: "hostFee", label: "Host service fee", initial: 3, suffix: "%", min: 0 }, { key: "cleaningCost", label: "Actual cleaning cost", initial: 80, suffix: "$", min: 0 }, { key: "other", label: "Other stay costs", initial: 40, suffix: "$", min: 0 }],
    calculate: (v) => { const booking = v.nightly * v.nights + v.cleaning; const fee = booking * v.hostFee / 100; const payout = booking - fee; const profit = payout - v.cleaningCost - v.other; return [["Guest subtotal", money(booking)], ["Host fee", money(fee)], ["Host payout", money(payout)], ["Profit after stay costs", money(profit)], ["Profit per night", money(profit / Math.max(v.nights, 1))]]; },
    note: "Taxes, discounts, co-host fees, split-fee pricing, and local rules vary. Use the exact fee shown for the listing.",
  },
  "fence-material-calculator": {
    fields: [{ key: "length", label: "Fence length", initial: 150, suffix: "ft", min: 1 }, { key: "panel", label: "Panel / post spacing", initial: 8, suffix: "ft", min: .1 }, { key: "rails", label: "Rails per section", initial: 3, min: 1, step: 1 }, { key: "picketsPerFoot", label: "Pickets per foot", initial: 2.2, min: 0 }, { key: "gates", label: "Gate posts to add", initial: 2, min: 0, step: 1 }, { key: "waste", label: "Waste", initial: 10, suffix: "%", min: 0 }],
    calculate: (v) => { const sections = Math.ceil(v.length / v.panel); const posts = sections + 1 + v.gates; return [["Fence sections", number(sections, 0)], ["Posts", number(posts, 0)], ["Rails", number(sections * v.rails, 0)], ["Pickets with waste", number(Math.ceil(v.length * v.picketsPerFoot * (1 + v.waste / 100)), 0)], ["Concrete bags (2/post)", number(posts * 2, 0)]]; },
    note: "Corners, slopes, gate widths, wind loads, frost depth, and local code can change material needs.",
  },
  "concrete-bag-calculator": {
    fields: [{ key: "length", label: "Length", initial: 12, suffix: "ft", min: 0 }, { key: "width", label: "Width", initial: 10, suffix: "ft", min: 0 }, { key: "depth", label: "Thickness", initial: 4, suffix: "in", min: 0 }, { key: "bagYield", label: "Yield per bag", initial: .6, suffix: "cu ft", min: .01 }, { key: "waste", label: "Waste", initial: 10, suffix: "%", min: 0 }],
    calculate: (v) => { const cubicFeet = v.length * v.width * v.depth / 12; const adjusted = cubicFeet * (1 + v.waste / 100); return [["Concrete volume", `${number(cubicFeet, 2)} cu ft`], ["Cubic yards", `${number(adjusted / 27, 3)} yd³`], ["Bags needed", number(Math.ceil(adjusted / v.bagYield), 0)], ["Wet weight estimate", `${number(adjusted * 145, 0)} lb`]]; },
    note: "Bag yield depends on bag size and product. Structural pours require proper reinforcement, subbase, mix, curing, and code review.",
  },
  "gravel-calculator": {
    fields: [{ key: "length", label: "Length", initial: 30, suffix: "ft", min: 0 }, { key: "width", label: "Width", initial: 10, suffix: "ft", min: 0 }, { key: "depth", label: "Depth", initial: 3, suffix: "in", min: 0 }, { key: "density", label: "Density", initial: 1.4, suffix: "tons/yd³", min: 0 }, { key: "waste", label: "Compaction / waste", initial: 10, suffix: "%", min: 0 }],
    calculate: (v) => { const yards = v.length * v.width * v.depth / 324 * (1 + v.waste / 100); return [["Area", `${number(v.length * v.width, 1)} sq ft`], ["Volume", `${number(yards, 2)} yd³`], ["Estimated weight", `${number(yards * v.density, 2)} tons`], ["50 lb bags", number(Math.ceil(yards * v.density * 2000 / 50), 0)]]; },
    note: "Density and compaction vary by stone type, moisture, and supplier. Confirm delivery units before ordering.",
  },
  "mulch-calculator": {
    fields: [{ key: "length", label: "Bed length", initial: 24, suffix: "ft", min: 0 }, { key: "width", label: "Bed width", initial: 8, suffix: "ft", min: 0 }, { key: "depth", label: "Mulch depth", initial: 3, suffix: "in", min: 0 }, { key: "bag", label: "Bag volume", initial: 2, suffix: "cu ft", min: .1 }, { key: "waste", label: "Waste", initial: 5, suffix: "%", min: 0 }],
    calculate: (v) => { const cubicFeet = v.length * v.width * v.depth / 12 * (1 + v.waste / 100); return [["Bed area", `${number(v.length * v.width, 1)} sq ft`], ["Cubic feet", number(cubicFeet, 2)], ["Cubic yards", number(cubicFeet / 27, 2)], ["Bags", number(Math.ceil(cubicFeet / v.bag), 0)]]; },
    note: "Irregular beds can be split into rectangles and added together.",
  },
  "wallpaper-roll-calculator": {
    fields: [{ key: "perimeter", label: "Room perimeter", initial: 48, suffix: "ft", min: 0 }, { key: "height", label: "Wall height", initial: 8, suffix: "ft", min: 0 }, { key: "rollWidth", label: "Roll width", initial: 20.5, suffix: "in", min: .1 }, { key: "rollLength", label: "Roll length", initial: 33, suffix: "ft", min: .1 }, { key: "repeat", label: "Pattern repeat", initial: 21, suffix: "in", min: 0 }, { key: "waste", label: "Extra waste", initial: 10, suffix: "%", min: 0 }],
    calculate: (v) => { const drop = Math.ceil(v.height * 12 / Math.max(v.repeat || 1, 1)) * Math.max(v.repeat || 1, 1) / 12; const strips = Math.ceil(v.perimeter * 12 / v.rollWidth); const stripsPerRoll = Math.max(1, Math.floor(v.rollLength / drop)); return [["Strips needed", number(strips, 0)], ["Adjusted drop", `${number(drop, 2)} ft`], ["Strips per roll", number(stripsPerRoll, 0)], ["Rolls before extra", number(Math.ceil(strips / stripsPerRoll), 0)], ["Rolls with waste", number(Math.ceil(strips / stripsPerRoll * (1 + v.waste / 100)), 0)]]; },
    note: "Check whether the product is sold as single or double rolls and confirm pattern-match instructions.",
  },
  "tile-calculator-with-waste": {
    fields: [{ key: "length", label: "Area length", initial: 12, suffix: "ft", min: 0 }, { key: "width", label: "Area width", initial: 10, suffix: "ft", min: 0 }, { key: "tileLength", label: "Tile length", initial: 12, suffix: "in", min: .1 }, { key: "tileWidth", label: "Tile width", initial: 24, suffix: "in", min: .1 }, { key: "boxCoverage", label: "Coverage per box", initial: 16, suffix: "sq ft", min: .1 }, { key: "waste", label: "Waste", initial: 12, suffix: "%", min: 0 }],
    calculate: (v) => { const area = v.length * v.width; const adjusted = area * (1 + v.waste / 100); const tileArea = v.tileLength * v.tileWidth / 144; return [["Area", `${number(area, 1)} sq ft`], ["Area with waste", `${number(adjusted, 1)} sq ft`], ["Individual tiles", number(Math.ceil(adjusted / tileArea), 0)], ["Boxes", number(Math.ceil(adjusted / v.boxCoverage), 0)]]; },
    note: "Diagonal layouts, complex cuts, breakage, and future repair stock may justify a larger waste allowance.",
  },
  "drywall-sheet-calculator": {
    fields: [{ key: "perimeter", label: "Room perimeter", initial: 48, suffix: "ft", min: 0 }, { key: "height", label: "Wall height", initial: 8, suffix: "ft", min: 0 }, { key: "ceilingArea", label: "Ceiling area", initial: 144, suffix: "sq ft", min: 0 }, { key: "sheetArea", label: "Sheet area", initial: 32, suffix: "sq ft", min: 1 }, { key: "openings", label: "Doors/windows", initial: 40, suffix: "sq ft", min: 0 }, { key: "waste", label: "Waste", initial: 10, suffix: "%", min: 0 }],
    calculate: (v) => { const area = Math.max(0, v.perimeter * v.height + v.ceilingArea - v.openings); const sheets = Math.ceil(area / v.sheetArea * (1 + v.waste / 100)); return [["Drywall area", `${number(area, 1)} sq ft`], ["Sheets", number(sheets, 0)], ["Screws", number(Math.ceil(sheets * 32), 0)], ["Joint compound", `${number(Math.ceil(area / 500), 0)} buckets`], ["Joint tape", `${number(Math.ceil(area / 100), 0)} rolls`]]; },
    note: "Sheet orientation, fire ratings, moisture areas, stud layout, and local code affect the final takeoff.",
  },
  "paint-calculator": {
    fields: [{ key: "perimeter", label: "Room perimeter", initial: 48, suffix: "ft", min: 0 }, { key: "height", label: "Wall height", initial: 8, suffix: "ft", min: 0 }, { key: "openings", label: "Doors/windows", initial: 40, suffix: "sq ft", min: 0 }, { key: "coats", label: "Paint coats", initial: 2, min: 1, step: 1 }, { key: "coverage", label: "Coverage per gallon", initial: 350, suffix: "sq ft", min: 1 }, { key: "waste", label: "Waste", initial: 10, suffix: "%", min: 0 }],
    calculate: (v) => { const wall = Math.max(0, v.perimeter * v.height - v.openings); const coverage = wall * v.coats * (1 + v.waste / 100); return [["Paintable wall area", `${number(wall, 1)} sq ft`], ["Coated area", `${number(coverage, 1)} sq ft`], ["Paint needed", `${number(coverage / v.coverage, 2)} gal`], ["Whole gallons to buy", number(Math.ceil(coverage / v.coverage), 0)], ["Primer gallons", number(Math.ceil(wall / v.coverage), 0)]]; },
    note: "Porous surfaces, dramatic color changes, sprayer loss, and product coverage can change the result.",
  },
  "sod-calculator": {
    fields: [{ key: "length", label: "Lawn length", initial: 60, suffix: "ft", min: 0 }, { key: "width", label: "Lawn width", initial: 30, suffix: "ft", min: 0 }, { key: "rollCoverage", label: "Coverage per roll", initial: 10, suffix: "sq ft", min: .1 }, { key: "palletCoverage", label: "Coverage per pallet", initial: 450, suffix: "sq ft", min: .1 }, { key: "waste", label: "Waste", initial: 8, suffix: "%", min: 0 }],
    calculate: (v) => { const area = v.length * v.width; const adjusted = area * (1 + v.waste / 100); return [["Lawn area", `${number(area, 1)} sq ft`], ["Order area", `${number(adjusted, 1)} sq ft`], ["Sod rolls", number(Math.ceil(adjusted / v.rollCoverage), 0)], ["Pallets", number(Math.ceil(adjusted / v.palletCoverage), 0)]]; },
    note: "Measure separate lawn sections individually and confirm the supplier’s roll or pallet coverage.",
  },
  "stair-stringer-calculator": {
    fields: [{ key: "rise", label: "Total rise", initial: 108, suffix: "in", min: 1 }, { key: "target", label: "Target riser", initial: 7.5, suffix: "in", min: 1 }, { key: "tread", label: "Tread depth", initial: 10, suffix: "in", min: 1 }, { key: "overhang", label: "Nosing overhang", initial: 1, suffix: "in", min: 0 }],
    calculate: (v) => { const risers = Math.ceil(v.rise / v.target); const exact = v.rise / risers; const treads = Math.max(1, risers - 1); const run = treads * v.tread; return [["Risers", number(risers, 0)], ["Exact riser height", `${number(exact, 3)} in`], ["Treads", number(treads, 0)], ["Total run", `${number(run, 2)} in`], ["Stringer length", `${number(Math.hypot(v.rise, run), 2)} in`], ["Stair angle", `${number(Math.atan(v.rise / run) * 180 / Math.PI, 1)}°`]]; },
    note: "Verify maximum rise, minimum tread, headroom, landings, handrails, and stringer rules under local code before cutting.",
  },
  "board-foot-calculator": {
    fields: [{ key: "thickness", label: "Thickness", initial: 2, suffix: "in", min: 0 }, { key: "width", label: "Width", initial: 8, suffix: "in", min: 0 }, { key: "length", label: "Length", initial: 10, suffix: "ft", min: 0 }, { key: "quantity", label: "Quantity", initial: 12, min: 1, step: 1 }, { key: "price", label: "Price per board foot", initial: 4.5, suffix: "$", min: 0 }],
    calculate: (v) => { const each = v.thickness * v.width * v.length / 12; const total = each * v.quantity; return [["Board feet each", number(each, 3)], ["Total board feet", number(total, 2)], ["Estimated cost", money(total * v.price)], ["Cubic feet", number(total / 12, 3)]]; },
    note: "Lumber sellers may price nominal and surfaced dimensions differently. Confirm the unit used on the quote.",
  },
  "pallet-loading-calculator": {
    fields: [{ key: "palletLength", label: "Pallet length", initial: 48, suffix: "in", min: 1 }, { key: "palletWidth", label: "Pallet width", initial: 40, suffix: "in", min: 1 }, { key: "boxLength", label: "Carton length", initial: 16, suffix: "in", min: 1 }, { key: "boxWidth", label: "Carton width", initial: 12, suffix: "in", min: 1 }, { key: "boxHeight", label: "Carton height", initial: 10, suffix: "in", min: 1 }, { key: "maxHeight", label: "Maximum loaded height", initial: 60, suffix: "in", min: 1 }, { key: "boxWeight", label: "Weight per carton", initial: 22, suffix: "lb", min: 0 }],
    calculate: (v) => { const a = Math.floor(v.palletLength / v.boxLength) * Math.floor(v.palletWidth / v.boxWidth); const b = Math.floor(v.palletLength / v.boxWidth) * Math.floor(v.palletWidth / v.boxLength); const layer = Math.max(a, b); const layers = Math.max(1, Math.floor(v.maxHeight / v.boxHeight)); return [["Cartons per layer", number(layer, 0)], ["Layers", number(layers, 0)], ["Total cartons", number(layer * layers, 0)], ["Loaded height", `${number(layers * v.boxHeight, 1)} in`], ["Product weight", `${number(layer * layers * v.boxWeight, 1)} lb`]]; },
    note: "This uses a simple unrotated grid. Interlocking, overhang, crush strength, pallet weight, and carrier limits need separate checks.",
  },
  "shipping-dimensional-weight-calculator": {
    fields: [{ key: "length", label: "Length", initial: 18, suffix: "in", min: 0 }, { key: "width", label: "Width", initial: 14, suffix: "in", min: 0 }, { key: "height", label: "Height", initial: 10, suffix: "in", min: 0 }, { key: "actual", label: "Actual weight", initial: 8, suffix: "lb", min: 0 }, { key: "divisor", label: "DIM divisor", initial: 139, min: 1 }],
    calculate: (v) => { const dim = v.length * v.width * v.height / v.divisor; return [["Package volume", `${number(v.length * v.width * v.height, 0)} in³`], ["Dimensional weight", `${number(dim, 2)} lb`], ["Rounded DIM weight", `${Math.ceil(dim)} lb`], ["Billable weight", `${Math.ceil(Math.max(dim, v.actual))} lb`], ["Billing basis", dim > v.actual ? "Dimensional weight" : "Actual weight"]]; },
    note: "Measure the carrier’s rounded outer dimensions and use the divisor from the exact service and account agreement.",
  },
  "aquarium-volume-calculator": {
    fields: [{ key: "length", label: "Inside length", initial: 36, suffix: "in", min: 0 }, { key: "width", label: "Inside width", initial: 18, suffix: "in", min: 0 }, { key: "height", label: "Water height", initial: 20, suffix: "in", min: 0 }, { key: "displacement", label: "Rock/substrate displacement", initial: 10, suffix: "%", min: 0 }, { key: "substrate", label: "Substrate depth", initial: 2, suffix: "in", min: 0 }],
    calculate: (v) => { const gallons = v.length * v.width * v.height / 231 * (1 - v.displacement / 100); const substrate = v.length * v.width * v.substrate / 1728; return [["Usable water", `${number(gallons, 2)} US gal`], ["Liters", `${number(gallons * 3.78541, 1)} L`], ["Water weight", `${number(gallons * 8.345, 0)} lb`], ["Substrate volume", `${number(substrate, 2)} cu ft`]]; },
    note: "Use inside dimensions. Glass, equipment, hardscape, and an unfilled rim reduce actual water volume.",
  },
  "generator-wattage-calculator": {
    fields: [{ key: "running", label: "Total running watts", initial: 3200, suffix: "W", min: 0 }, { key: "largestSurge", label: "Largest extra startup surge", initial: 1800, suffix: "W", min: 0 }, { key: "headroom", label: "Safety headroom", initial: 20, suffix: "%", min: 0 }, { key: "voltage", label: "Output voltage", initial: 120, suffix: "V", min: 1 }],
    calculate: (v) => { const peak = v.running + v.largestSurge; const recommended = peak * (1 + v.headroom / 100); return [["Continuous load", `${number(v.running, 0)} W`], ["Startup peak", `${number(peak, 0)} W`], ["Recommended generator", `${number(Math.ceil(recommended / 500) * 500, 0)} W`], ["Continuous current", `${number(v.running / v.voltage, 1)} A`]]; },
    note: "Add appliance nameplate watts separately. Motors and compressors can have large startup surges; consult an electrician for transfer equipment.",
  },
  "solar-panel-output-calculator": {
    fields: [{ key: "watts", label: "Array rating", initial: 6000, suffix: "W", min: 0 }, { key: "sun", label: "Peak sun hours / day", initial: 5.2, suffix: "h", min: 0 }, { key: "loss", label: "System losses", initial: 18, suffix: "%", min: 0 }, { key: "rate", label: "Electric rate", initial: .16, suffix: "$/kWh", min: 0 }],
    calculate: (v) => { const daily = v.watts / 1000 * v.sun * (1 - v.loss / 100); return [["Daily energy", `${number(daily, 2)} kWh`], ["Monthly energy", `${number(daily * 30.437, 0)} kWh`], ["Annual energy", `${number(daily * 365, 0)} kWh`], ["Annual retail value", money(daily * 365 * v.rate)]]; },
    note: "This is only a planning estimate. Shade, orientation, temperature, inverter clipping, weather, and utility compensation affect real production.",
  },
  "ev-charging-cost-calculator": {
    fields: [{ key: "battery", label: "Battery capacity", initial: 75, suffix: "kWh", min: 0 }, { key: "start", label: "Starting charge", initial: 20, suffix: "%", min: 0 }, { key: "end", label: "Ending charge", initial: 80, suffix: "%", min: 0 }, { key: "efficiency", label: "Charging efficiency", initial: 90, suffix: "%", min: 1 }, { key: "rate", label: "Electricity rate", initial: .16, suffix: "$/kWh", min: 0 }, { key: "miles", label: "Miles added", initial: 170, suffix: "mi", min: 1 }],
    calculate: (v) => { const stored = v.battery * Math.max(0, v.end - v.start) / 100; const grid = stored / (v.efficiency / 100); const cost = grid * v.rate; return [["Energy stored", `${number(stored, 2)} kWh`], ["Energy from grid", `${number(grid, 2)} kWh`], ["Charging cost", money(cost)], ["Cost per mile", money(cost / v.miles)], ["Equivalent per 100 miles", money(cost / v.miles * 100)]]; },
    note: "Utility time-of-use pricing, charging overhead, battery temperature, and vehicle efficiency can change the actual cost.",
  },
  "battery-runtime-calculator": {
    fields: [{ key: "voltage", label: "Battery voltage", initial: 12, suffix: "V", min: 0 }, { key: "ampHours", label: "Capacity", initial: 100, suffix: "Ah", min: 0 }, { key: "load", label: "Load", initial: 300, suffix: "W", min: .1 }, { key: "usable", label: "Usable capacity", initial: 80, suffix: "%", min: 0 }, { key: "efficiency", label: "System efficiency", initial: 90, suffix: "%", min: 1 }],
    calculate: (v) => { const nominal = v.voltage * v.ampHours; const usable = nominal * v.usable / 100 * v.efficiency / 100; return [["Nominal energy", `${number(nominal, 0)} Wh`], ["Usable energy", `${number(usable, 0)} Wh`], ["Estimated runtime", `${number(usable / v.load, 2)} h`], ["Runtime in minutes", `${number(usable / v.load * 60, 0)} min`]]; },
    note: "Actual runtime varies with discharge rate, battery chemistry, age, temperature, inverter idle draw, and cutoff voltage.",
  },
  "tv-viewing-distance-calculator": {
    fields: [{ key: "diagonal", label: "TV diagonal", initial: 65, suffix: "in", min: 1 }, { key: "resolution", label: "Resolution factor", initial: 1.3, help: "Use 1.0–1.5 for 4K; 1.5–2.5 for 1080p", min: .5 }, { key: "fov", label: "Target field of view", initial: 35, suffix: "°", min: 10 }],
    calculate: (v) => { const simple = v.diagonal * v.resolution; const width = v.diagonal * 16 / Math.hypot(16, 9); const fovDistance = width / (2 * Math.tan(v.fov * Math.PI / 360)); return [["Rule-of-thumb distance", `${number(simple / 12, 2)} ft`], ["Field-of-view distance", `${number(fovDistance / 12, 2)} ft`], ["Comfortable range", `${number(v.diagonal / 12, 2)}–${number(v.diagonal * 1.6 / 12, 2)} ft`], ["Approximate screen width", `${number(width, 1)} in`]]; },
    note: "Comfort depends on eyesight, content, room layout, and preference. The factor is editable for different resolutions.",
  },
  "screen-ppi-calculator": {
    fields: [{ key: "width", label: "Horizontal pixels", initial: 3840, suffix: "px", min: 1 }, { key: "height", label: "Vertical pixels", initial: 2160, suffix: "px", min: 1 }, { key: "diagonal", label: "Screen diagonal", initial: 27, suffix: "in", min: .1 }],
    calculate: (v) => { const ppi = Math.hypot(v.width, v.height) / v.diagonal; const ratio = v.width / v.height; const physicalHeight = v.diagonal / Math.sqrt(ratio * ratio + 1); return [["Pixel density", `${number(ppi, 2)} PPI`], ["Pixel pitch", `${number(25.4 / ppi, 4)} mm`], ["Screen width", `${number(physicalHeight * ratio, 2)} in`], ["Screen height", `${number(physicalHeight, 2)} in`], ["Megapixels", `${number(v.width * v.height / 1e6, 2)} MP`]]; },
    note: "Uses the active pixel resolution and viewable diagonal, not the outer product size.",
  },
  "sewing-fabric-yardage-calculator": {
    fields: [{ key: "pieceLength", label: "Piece length", initial: 24, suffix: "in", min: 0 }, { key: "pieceWidth", label: "Piece width", initial: 18, suffix: "in", min: 0 }, { key: "quantity", label: "Pieces", initial: 8, min: 1, step: 1 }, { key: "fabricWidth", label: "Fabric width", initial: 44, suffix: "in", min: 1 }, { key: "waste", label: "Pattern / waste", initial: 15, suffix: "%", min: 0 }],
    calculate: (v) => { const across = Math.max(1, Math.floor(v.fabricWidth / v.pieceWidth)); const rows = Math.ceil(v.quantity / across); const inches = rows * v.pieceLength * (1 + v.waste / 100); return [["Pieces across width", number(across, 0)], ["Cutting rows", number(rows, 0)], ["Fabric length", `${number(inches, 1)} in`], ["Fabric yards", `${number(inches / 36, 2)} yd`], ["Whole yards to buy", `${Math.ceil(inches / 36)} yd`]]; },
    note: "Nap, one-way prints, grain direction, seam allowances, matching, shrinkage, and irregular pieces can require more fabric.",
  },
  "coffee-ratio-calculator": {
    fields: [{ key: "water", label: "Brew water", initial: 500, suffix: "g", min: 0 }, { key: "ratio", label: "Water-to-coffee ratio", initial: 16, suffix: ":1", min: 1 }, { key: "cups", label: "Servings", initial: 2, min: 1, step: 1 }],
    calculate: (v) => { const coffee = v.water / v.ratio; return [["Coffee grounds", `${number(coffee, 1)} g`], ["Water", `${number(v.water, 0)} g / ml`], ["Coffee per serving", `${number(coffee / v.cups, 1)} g`], ["Water per serving", `${number(v.water / v.cups, 0)} ml`], ["Approximate brewed coffee", `${number(v.water * .86, 0)} ml`]]; },
    note: "This is only a starting ratio. Grind, roast, brewer, contact time, and taste affect the best recipe.",
  },
  "pizza-dough-calculator": {
    fields: [{ key: "balls", label: "Dough balls", initial: 4, min: 1, step: 1 }, { key: "ballWeight", label: "Weight per ball", initial: 260, suffix: "g", min: 1 }, { key: "hydration", label: "Hydration", initial: 65, suffix: "%", min: 1 }, { key: "salt", label: "Salt", initial: 2.8, suffix: "%", min: 0 }, { key: "yeast", label: "Yeast", initial: .2, suffix: "%", min: 0 }, { key: "oil", label: "Oil", initial: 2, suffix: "%", min: 0 }],
    calculate: (v) => { const total = v.balls * v.ballWeight; const flour = total / (1 + (v.hydration + v.salt + v.yeast + v.oil) / 100); return [["Total dough", `${number(total, 0)} g`], ["Flour", `${number(flour, 1)} g`], ["Water", `${number(flour * v.hydration / 100, 1)} g`], ["Salt", `${number(flour * v.salt / 100, 1)} g`], ["Yeast", `${number(flour * v.yeast / 100, 2)} g`], ["Oil", `${number(flour * v.oil / 100, 1)} g`]]; },
    note: "Yeast depends heavily on fermentation time, temperature, and yeast type. Treat the starting percentage as editable.",
  },
  "bread-hydration-calculator": {
    fields: [{ key: "flour", label: "Total flour", initial: 500, suffix: "g", min: 1 }, { key: "water", label: "Total water", initial: 350, suffix: "g", min: 0 }, { key: "starter", label: "100% hydration starter", initial: 100, suffix: "g", min: 0 }, { key: "salt", label: "Salt", initial: 10, suffix: "g", min: 0 }],
    calculate: (v) => { const flour = v.flour + v.starter / 2; const water = v.water + v.starter / 2; const total = flour + water + v.salt; return [["True flour", `${number(flour, 1)} g`], ["True water", `${number(water, 1)} g`], ["Hydration", `${number(water / flour * 100, 1)}%`], ["Salt percentage", `${number(v.salt / flour * 100, 2)}%`], ["Total dough", `${number(total, 1)} g`]]; },
    note: "Assumes the starter contains equal flour and water by weight. Adjust its contribution separately for another starter hydration.",
  },
  "recipe-cost-calculator": {
    fields: [{ key: "ingredients", label: "Total ingredient cost", initial: 28, suffix: "$", min: 0 }, { key: "packaging", label: "Packaging / batch", initial: 4, suffix: "$", min: 0 }, { key: "labor", label: "Labor / batch", initial: 22, suffix: "$", min: 0 }, { key: "overhead", label: "Overhead / batch", initial: 6, suffix: "$", min: 0 }, { key: "servings", label: "Servings / batch", initial: 12, min: 1, step: 1 }, { key: "targetFoodCost", label: "Target food cost", initial: 30, suffix: "%", min: 1 }],
    calculate: (v) => { const batch = v.ingredients + v.packaging + v.labor + v.overhead; const per = batch / v.servings; return [["Batch cost", money(batch)], ["Cost per serving", money(per)], ["Ingredient cost per serving", money(v.ingredients / v.servings)], ["Price at target food cost", money(v.ingredients / v.servings / (v.targetFoodCost / 100))], ["Price including all costs at 30%", money(per / .3)]]; },
    note: "Enter tax, spoilage, delivery commissions, and business overhead explicitly when they matter to the selling price.",
  },
  "bmi-calculator": {
    fields: [{ key: "weight", label: "Weight", initial: 180, suffix: "lb", min: 1 }, { key: "heightFeet", label: "Height feet", initial: 5, suffix: "ft", min: 0 }, { key: "heightInches", label: "Height inches", initial: 8, suffix: "in", min: 0 }],
    calculate: (v) => { const inches = v.heightFeet * 12 + v.heightInches; const bmi = v.weight / (inches * inches) * 703; const category = bmi < 18.5 ? "Underweight range" : bmi < 25 ? "Healthy range" : bmi < 30 ? "Overweight range" : "Obesity range"; return [["BMI", number(bmi, 1)], ["Standard category", category], ["Height", `${number(inches, 0)} in`], ["Weight", `${number(v.weight, 1)} lb`]]; },
    note: "BMI is a rough population screening measure, not a diagnosis. It does not account for muscle mass, body composition, pregnancy, or individual health.",
  },
  "percentage-calculator": {
    fields: [{ key: "part", label: "Value / part", initial: 25 }, { key: "whole", label: "Total / whole", initial: 200 }, { key: "percent", label: "Percentage", initial: 15, suffix: "%" }, { key: "old", label: "Old value", initial: 80 }, { key: "new", label: "New value", initial: 100 }],
    calculate: (v) => [["Part as percent of whole", `${number(v.part / Math.max(v.whole, .000001) * 100, 4)}%`], ["Percent of whole", number(v.whole * v.percent / 100, 4)], ["Whole after percent increase", number(v.whole * (1 + v.percent / 100), 4)], ["Whole after percent decrease", number(v.whole * (1 - v.percent / 100), 4)], ["Change from old to new", `${number((v.new - v.old) / Math.max(Math.abs(v.old), .000001) * 100, 4)}%`]],
    note: "The fields solve several common percentage questions at once; use only the pair relevant to your calculation.",
  },
  "loan-calculator": {
    fields: [{ key: "principal", label: "Loan amount", initial: 25000, suffix: "$", min: 0 }, { key: "rate", label: "Annual interest rate", initial: 7.5, suffix: "%", min: 0 }, { key: "years", label: "Term", initial: 5, suffix: "years", min: .1 }, { key: "extra", label: "Extra monthly payment", initial: 0, suffix: "$", min: 0 }],
    calculate: (v) => { const months = Math.round(v.years * 12); const r = v.rate / 1200; const base = r ? v.principal * r * (1 + r) ** months / ((1 + r) ** months - 1) : v.principal / months; const payment = base + v.extra; let balance = v.principal, paid = 0, count = 0; while (balance > .01 && count < 1200) { const interest = balance * r; balance = Math.max(0, balance + interest - payment); paid += payment; count++; } paid -= Math.max(0, -balance); return [["Minimum monthly payment", money(base)], ["Payment with extra", money(payment)], ["Payoff time", `${count} months`], ["Total paid", money(paid)], ["Total interest", money(paid - v.principal)]]; },
    note: "This is an amortization estimate. Lender fees, variable rates, daily interest, insurance, and payment timing are not included.",
  },
  "mortgage-calculator": {
    fields: [{ key: "price", label: "Home price", initial: 450000, suffix: "$", min: 0 }, { key: "down", label: "Down payment", initial: 90000, suffix: "$", min: 0 }, { key: "rate", label: "Interest rate", initial: 6.5, suffix: "%", min: 0 }, { key: "years", label: "Loan term", initial: 30, suffix: "years", min: 1 }, { key: "tax", label: "Annual property tax", initial: 5400, suffix: "$", min: 0 }, { key: "insurance", label: "Annual insurance", initial: 2400, suffix: "$", min: 0 }, { key: "hoa", label: "Monthly HOA", initial: 0, suffix: "$", min: 0 }],
    calculate: (v) => { const principal = Math.max(0, v.price - v.down); const months = v.years * 12; const r = v.rate / 1200; const pi = r ? principal * r * (1 + r) ** months / ((1 + r) ** months - 1) : principal / months; const monthly = pi + v.tax / 12 + v.insurance / 12 + v.hoa; return [["Loan amount", money(principal)], ["Principal + interest", money(pi)], ["Tax + insurance + HOA", money(monthly - pi)], ["Estimated monthly payment", money(monthly)], ["Total loan interest", money(pi * months - principal)]]; },
    note: "PMI, closing costs, flood or wind coverage, special assessments, rate changes, and tax changes are not included.",
  },
  "calorie-calculator": {
    fields: [{ key: "weight", label: "Weight", initial: 180, suffix: "lb", min: 1 }, { key: "height", label: "Height", initial: 68, suffix: "in", min: 1 }, { key: "age", label: "Age", initial: 30, suffix: "years", min: 1 }, { key: "sex", label: "Sex factor", initial: 5, help: "Use +5 for male or −161 for female" }, { key: "activity", label: "Activity multiplier", initial: 1.55, help: "1.2 sedentary; 1.375 light; 1.55 moderate; 1.725 high", min: 1 }],
    calculate: (v) => { const kg = v.weight * .453592; const cm = v.height * 2.54; const bmr = 10 * kg + 6.25 * cm - 5 * v.age + v.sex; const tdee = bmr * v.activity; return [["Estimated BMR", `${number(bmr, 0)} kcal/day`], ["Maintenance calories", `${number(tdee, 0)} kcal/day`], ["Gentle loss estimate", `${number(tdee - 300, 0)} kcal/day`], ["Gentle gain estimate", `${number(tdee + 300, 0)} kcal/day`]]; },
    note: "This is a rough Mifflin-St Jeor estimate, not medical advice. Needs vary with health, body composition, medication, pregnancy, training, and other factors.",
  },
};

export function ExpandedCalculatorTool({ slug, name }: { slug: string; name: string }) {
  const spec = specs[slug];
  const [values, setValues] = useState<Record<string, string>>(() => Object.fromEntries(spec.fields.map((field) => [field.key, String(field.initial)])));
  const numeric = useMemo(() => Object.fromEntries(Object.entries(values).map(([key, value]) => [key, Number(value) || 0])), [values]);
  const results = spec.calculate(numeric);
  const report = results.map(([label, value]) => `${label}: ${value}`).join("\n");
  return <ToolFrame title={name} status="updates live"><div className="calculator-layout"><div className="field-grid">{spec.fields.map((field) => <NumberField key={field.key} label={field.label} value={values[field.key]} onChange={(value) => setValues((current) => ({ ...current, [field.key]: value }))} min={field.min} step={field.step} suffix={field.suffix} help={field.help} />)}</div><div className="result-panel"><span className="result-kicker">Result</span><ResultGrid values={results} /><ActionRow output={report} filename={`${slug}-result.txt`} /></div></div><p className="tool-caution">{spec.note}</p></ToolFrame>;
}

export const expandedCalculatorSlugs = new Set(Object.keys(specs));
