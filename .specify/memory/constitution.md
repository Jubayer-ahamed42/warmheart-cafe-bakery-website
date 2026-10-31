# 🏛️ Warm Heart Cafe and Bakery — Project Constitution

## 1. Core Principles & Philosophy
- **Lightweight & High Performance**: Clean vanilla web standards (HTML5 semantic markup, CSS3 custom properties & responsive grid/flexbox, Vanilla ES6+ JavaScript) without heavy framework bloat for maximum loading speed.
- **Accessibility & UX**: All pages adhere to WCAG AA guidelines with accessible color contrast, semantic landmarks (`<header>`, `<main>`, `<section>`, `<footer>`), aria attributes for toggles (`aria-expanded`, `aria-label`), and responsive layouts down to 320px mobile screens.
- **Clean Structure & Maintainability**: Modular separation of concerns. Shared stylesheet `style.css` drives global branding (colors, typography, grid helpers), `script.js` handles interactive DOM events, and standalone HTML files remain fully functional both statically and via server.

## 2. Technical Stack & Governance
- **Markup**: HTML5, semantic tags, schema-friendly metadata.
- **Styling**: Pure CSS3 (`style.css`), fluid typography, mobile-first media queries (`@media (max-width: 768px)`).
- **Client Logic**: ES6+ Vanilla JavaScript (`script.js`), event listeners attached on `DOMContentLoaded`.
- **Tooling & Dev Server**: Vite 6.x + TypeScript ready, compatible with `npm run dev` and standard Python HTTP servers.
- **AI Studio Integration**: Server-side Gemini API capability enabled via `@google/genai` dependency.

## 3. Quality Bars & Verification
- Zero broken local links across `index.html`, `about.html`, `menu.html`, `gallery.html`, `contact.html`.
- 100% responsive across mobile, tablet, and desktop breakpoints.
- Offline-ready: can be previewed directly via `index.html` or through `run_website.bat`.
