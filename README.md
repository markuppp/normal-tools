# Normal Tools

A small, local-first utility site with many focused tools. Every tool has its own indexable route.

The live website is available at `normaltools.com`

## Edit the tool list

Tool names, descriptions, URLs, and homepage order live in `lib/tools.ts`.

## Tool pages and logic

- `app/tools/[slug]/page.tsx` renders the 190 config-driven tool pages with unique metadata.
- `app/tools/gamepad-tester/page.tsx`
- `app/tools/touchscreen-dead-zone-tester/page.tsx`
- `app/tools/camera-shutter-count-checker/page.tsx`

The expanded tool engine is split by job instead of one giant file:

- `components/tools/calculator-tools.tsx`
- `components/tools/expanded-calculator-tools.tsx`
- `components/tools/text-tools.tsx`
- `components/tools/expanded-text-tools.tsx`
- `components/tools/special-tools.tsx`
- `components/tools/expanded-special-tools.tsx`
- `components/tools/file-tools.tsx`
- `components/tools/essential-file-tools.tsx`
- `components/tools/second-calculator-tools.tsx`
- `components/tools/second-text-tools.tsx`
- `components/tools/second-special-tools.tsx`
- `components/tools/second-file-tools.tsx`
- `components/tools/shared.tsx`

## Original independent hardware scripts

- `public/scripts/gamepad-tester.js`
- `public/scripts/touchscreen-dead-zone-tester.js`
- `public/scripts/camera-shutter-count-checker.js`

The three original hardware testers keep independent JavaScript entry points. The 190 added routes use code-split React client modules organized by tool family.

## Shared presentation

The header and footer live in `components/site-chrome.tsx`. The searchable homepage directory is in `components/tool-index.tsx`. Site-wide styles are in `app/globals.css`.

## SEO

Each page has unique metadata and SoftwareApplication structured data. `app/sitemap.ts` creates the sitemap and `app/robots.ts` creates robots.txt.

Set the public site URL before building:

```bash
NEXT_PUBLIC_SITE_URL=https://your-domain.com npm run build
```

If the variable is omitted, metadata uses `https://example.com` as a safe placeholder.

## Run locally

```bash
npm install
npm run dev
```

Then open `http://localhost:3000`.

## Build

```bash
npm run build
npm start
```

## Test and lint

```bash
npm test
npm run lint
```