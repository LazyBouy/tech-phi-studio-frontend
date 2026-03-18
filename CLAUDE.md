# CLAUDE.md — Frontend Instructions

> Place this file in the `/frontend` directory.
> Claude Code reads this alongside the root CLAUDE.md.

---

## 🧩 Frontend Stack

| Tool              | Version / Choice          | Notes                                  |
|-------------------|---------------------------|----------------------------------------|
| Framework         | Next.js 14+               | App Router; SSR for public pages, CSR for quiz/portal |
| Build Tool        | Next.js built-in (Turbopack) | Fast HMR for animation iteration    |
| Language          | TypeScript (strict)       | No `any` without justification         |
| Routing           | Next.js App Router        | File-based, `app/` directory           |
| State Management  | Zustand (confirmed)       | Client UI state only (modals, quiz progress) |
| Data Fetching     | TanStack Query / React Query (confirmed) | All server state — no raw useEffect |
| Styling           | Tailwind CSS (confirmed)  | Utility-first; no CSS Modules          |
| Animation         | GSAP free tier + split-type + Lenis (confirmed) | See Animation section below |
| Design Source     | Figma                     | Always the source of truth             |

---

## 🎨 Figma → React Workflow

Follow this strict sequence when implementing any UI component:

1. **Identify the Figma component** by name — use the exact Figma layer name as the React component name.
2. **Extract design tokens** before writing any JSX:
   - Colors → CSS variables or Tailwind config
   - Typography → font family, size, weight, line-height
   - Spacing → margin/padding values
   - Motion → duration, easing curves, delay from Figma prototype tab
3. **Build static layout first** — no animations, no data fetching, just HTML structure with correct styles.
4. **Add data binding** — connect to the API or CMS data.
5. **Add animations last** — always the final layer.

Never combine steps 3, 4, and 5 in a single pass.

---

## 🎬 Animation Guidelines

### Confirmed Animation Stack
Animation library decision is closed. The stack is:
- **GSAP free tier** — ScrollTrigger, timelines, MotionPath, stagger
- **split-type** — character/word/line splitting (replaces paid GSAP SplitText)
- **Lenis** — smooth scroll (replaces paid GSAP ScrollSmoother)

Do NOT add Framer Motion — the stack is closed. For any animation requirement not covered by these three, discuss before adding anything new.

When choosing which tool to use within the confirmed stack:
- Scroll-triggered animation → GSAP ScrollTrigger
- Text splitting (reveal by character/word/line) → split-type + GSAP
- Timeline/sequence animation → GSAP timeline
- SVG path animation → GSAP MotionPath
- Smooth scroll behaviour → Lenis
- CSS-only micro-interaction (hover, focus) → pure CSS transitions, no library

### Animation Implementation Rules
Every animation must follow this structure:

```tsx
// ANIMATION: [Figma component name] — [describe the visual effect]
// LIBRARY: [GSAP | split-type | Lenis | CSS]
// FIGMA REF: [Figma frame/prototype link or description]
// TIMING: duration=[value]ms, easing=[curve], delay=[value]ms

// Example with GSAP:
gsap.fromTo(
  element,
  { opacity: 0, y: 24 },                              // Start state (from Figma prototype)
  { opacity: 1, y: 0, duration: 0.4, ease: 'power2.out' } // End state + Figma easing
);
```

### Performance Rules
- **Never animate `width`, `height`, `top`, `left`, `margin`, or `padding`** — these cause layout reflow.
- Only animate `transform` (translateX, translateY, scale, rotate) and `opacity`.
- Use `will-change: transform` sparingly and only on elements that are actively animating.
- All animations must respect `prefers-reduced-motion`:

```ts
// Always check before running GSAP animations
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
if (!prefersReducedMotion) {
  gsap.fromTo(element, { opacity: 0, y: 24 }, { opacity: 1, y: 0, duration: 0.4 });
}
```

### Animation File Structure
```
/src
├── animations/
│   ├── gsap-configs.ts    ← GSAP timeline + ScrollTrigger configs
│   ├── lenis-config.ts    ← Lenis smooth scroll initialisation
│   └── tokens.ts          ← Duration, easing values from Figma
├── components/
│   └── [ComponentName]/
│       ├── index.tsx      ← Logic + structure
│       └── animations.ts  ← Component-specific GSAP logic
```

---

## 📁 Component Structure Rules

Every component must follow this folder structure:
```
/ComponentName
├── index.tsx               ← Main component export
├── ComponentName.tsx       ← Component implementation
├── types.ts                ← TypeScript interfaces for this component
├── animations.ts           ← Component-specific GSAP logic (if animated)
└── ComponentName.test.tsx  ← Tests (even placeholder ones)
```

### Component Rules
- One component per file — no multi-component files.
- All components must be typed: `const MyComponent: React.FC<Props> = ...`
- Extract any logic longer than 20 lines into a custom hook (`useMyLogic.ts`).
- No inline styles except for dynamic values that can't be done in CSS.

---

## 🔌 API Integration Rules

- All API calls must go through a typed service layer in `/src/services/`.
- Use TanStack Query for all server state — never raw `useEffect` + `fetch`.
- Define API base URL from environment variables only: `process.env.NEXT_PUBLIC_API_URL`
- All API response types must be defined in `/src/types/api.ts`.

```typescript
// /src/types/api.ts — define all shapes here
export interface PageContent {
  id: number;
  title: string;
  slug: string;
  body: ContentBlock[];
  seo_title: string;
}
```

---

## 🧪 Testing Expectations

- Write a basic smoke test for every new component (does it render without crashing).
- Snapshot tests are NOT sufficient for animation components — write interaction tests.
- Use Vitest + React Testing Library.

---

## 🚫 Frontend Anti-Patterns to Avoid

- No `useEffect` for data that should be fetched with React Query
- No global CSS (except for resets and design tokens) — always scoped
- No prop drilling beyond 2 levels — use context or Zustand
- No `setTimeout` hacks to wait for animations — use animation completion callbacks
- No `document.querySelector` inside React components — always use refs
