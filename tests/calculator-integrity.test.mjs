import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";
import vm from "node:vm";
import ts from "typescript";

const calculatorFiles = [
  "../components/tools/calculator-tools.tsx",
  "../components/tools/expanded-calculator-tools.tsx",
  "../components/tools/second-calculator-tools.tsx",
];

const textFiles = [
  "../components/tools/text-tools.tsx",
  "../components/tools/expanded-text-tools.tsx",
];

const shared = {
  money: (value) => Number.isFinite(value) ? `$${value.toFixed(2)}` : "$0.00",
  number: (value, digits = 2) => Number.isFinite(value) ? value.toFixed(digits) : "0",
};

async function loadSpecs(relativePath, sharedImports = shared) {
  const filename = new URL(relativePath, import.meta.url);
  const source = `${await readFile(filename, "utf8")}\nexport { specs as __auditSpecs };`;
  const output = ts.transpileModule(source, {
    compilerOptions: {
      esModuleInterop: true,
      jsx: ts.JsxEmit.ReactJSX,
      module: ts.ModuleKind.CommonJS,
      target: ts.ScriptTarget.ES2022,
    },
    fileName: filename.pathname,
  }).outputText;
  const loadedModule = { exports: {} };
  const require = (id) => {
    if (id === "react") return {};
    if (id === "react/jsx-runtime") return { Fragment: Symbol("Fragment"), jsx() {}, jsxs() {} };
    if (id === "./shared") return { ...sharedImports };
    throw new Error(`Unexpected audit import: ${id}`);
  };
  vm.runInNewContext(output, {
    module: loadedModule,
    exports: loadedModule.exports,
    require,
    Set,
    Object,
    Math,
    Number,
    String,
    JSON,
    RegExp,
    TextEncoder,
    TextDecoder,
    URL,
    btoa,
    atob,
  });
  return loadedModule.exports.__auditSpecs;
}

function valuesFor(fields, boundary = false) {
  return Object.fromEntries(fields.map((field) => [
    field.key,
    field.type === "select" ? field.initial : boundary ? (field.min ?? 0) : field.initial,
  ]));
}

function assertValidResults(slug, results, scenario) {
  assert.ok(Array.isArray(results) && results.length > 0, `${slug} should return results for ${scenario}`);
  for (const result of results) {
    assert.ok(Array.isArray(result) && result.length === 2, `${slug} should return label/value pairs`);
    assert.equal(typeof result[0], "string", `${slug} result labels should be strings`);
    assert.equal(typeof result[1], "string", `${slug} result values should be strings`);
    assert.doesNotMatch(result[1], /NaN|Infinity|undefined|null/i, `${slug} should stay finite for ${scenario}`);
  }
}

test("every calculator returns finite results for defaults and field boundaries", async () => {
  const collections = await Promise.all(calculatorFiles.map((file) => loadSpecs(file)));
  const specs = Object.assign({}, ...collections);
  assert.equal(Object.keys(specs).length, 103);

  for (const [slug, spec] of Object.entries(specs)) {
    assertValidResults(slug, spec.calculate(valuesFor(spec.fields)), "default values");
    assertValidResults(slug, spec.calculate(valuesFor(spec.fields, true)), "minimum values");
  }
});

test("every registry-driven text tool processes its default input", async () => {
  const collections = await Promise.all(textFiles.map((file) => loadSpecs(file, {})));
  const specs = Object.assign({}, ...collections);
  assert.equal(Object.keys(specs).length, 28);

  for (const [slug, spec] of Object.entries(specs)) {
    const output = spec.transform(spec.initial, spec.defaultMode || "");
    assert.equal(typeof output, "string", `${slug} should return text`);
    assert.ok(output.length > 0, `${slug} should return a non-empty default result`);
    assert.doesNotMatch(output, /\b(?:NaN|Infinity|undefined)\b/, `${slug} should return a valid default result`);
  }
});

test("calendar math handles month ends and leap days without negative parts", async () => {
  const filename = new URL("../components/tools/date-math.ts", import.meta.url);
  const output = ts.transpileModule(await readFile(filename, "utf8"), {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 },
    fileName: filename.pathname,
  }).outputText;
  const loadedModule = { exports: {} };
  vm.runInNewContext(output, {
    module: loadedModule,
    exports: loadedModule.exports,
    require() { throw new Error("Unexpected date-math import"); },
    Date,
    Math,
    Number,
    RegExp,
  });
  const { calendarDifference, parseDateOnly } = loadedModule.exports;

  assert.deepEqual(
    { ...calendarDifference(parseDateOnly("2026-01-31"), parseDateOnly("2026-03-01")) },
    { years: 0, months: 1, days: 1 },
  );
  assert.deepEqual(
    { ...calendarDifference(parseDateOnly("2024-02-29"), parseDateOnly("2025-02-28")) },
    { years: 1, months: 0, days: 0 },
  );
  assert.equal(parseDateOnly("2026-02-30"), null);
});
