# Local fonts (Satoshi, Ivar Text)

`Work Sans` (body/UI) is loaded via `next/font/google` in `src/app/layout.tsx` — no files needed.

These two design faces are **not** on Google Fonts, so they're self-hosted via `next/font/local`.
Drop the font files here, then I'll wire them (uncommenting the loaders below) and point the tokens
`--font-display` (Satoshi) and `--font-serif` (Ivar Text) at them in `globals.css`.

## Satoshi (medium headers) — free, Fontshare
Download from https://www.fontshare.com/fonts/satoshi → put the `.woff2` files here:
```
src/fonts/satoshi/Satoshi-Medium.woff2
src/fonts/satoshi/Satoshi-Bold.woff2   (optional)
```

## Ivar Text (italic display) — COMMERCIAL, owner-licensed
Provide the licensed files (we only use the Italic in the design):
```
src/fonts/ivar/IvarText-Italic.woff2
```

## Wiring snippet (added to layout.tsx once files exist)
```ts
import localFont from "next/font/local";

const satoshi = localFont({
  variable: "--font-satoshi",
  src: [{ path: "../fonts/satoshi/Satoshi-Medium.woff2", weight: "500", style: "normal" }],
});
const ivar = localFont({
  variable: "--font-ivar",
  src: [{ path: "../fonts/ivar/IvarText-Italic.woff2", weight: "400", style: "italic" }],
});
// add `${satoshi.variable} ${ivar.variable}` to <html className=...>
```
Then in `globals.css`: `--font-display: var(--font-satoshi), …;` and `--font-serif: var(--font-ivar), Georgia, serif;`.
