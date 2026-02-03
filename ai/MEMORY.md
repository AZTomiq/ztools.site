# Long-term Memory

## Key Learnings

- **Build System**: The project relies on `aztomiq` (bin/aztomiq.js) for all lifecycle events (build, dev, deploy).
- **Subdomain Handling**: Currently mixed between server-side (`vercel.json`) and client-side (`head.ejs` script). Subdomains are mapped in `src/data/subdomains.yaml`.
- **Navigation Issues**: Using `rootPath` (relative) in header/breadcrumbs causes confusion on subdomains (Home link stays on subdomain instead of returning to main hub).

## Subdomain Strategy

- **Canonical URLs**: Generated dynamically in `head.ejs` and `sitemap.xml.ejs`. Subdomains strip their prefix (e.g., `/web-playground/` becomes `/`).
- **Navigation Perfection**: Hub links (Logo, Home, Categories) are **forced to Absolute URLs** (`global.site.url`) to prevent 404s on subdomains.
- **Language Switcher**: Calculates absolute target URLs. If on a subdomain, it stays on that subdomain (e.g., `laikep.ztools.site/en/`).
- **Dev Safety**: All absolute URL overrides are wrapped in `isDev` checks or browser-side localhost checks to prevent production redirects during local development.

## Coding Conventions

- **CSS**: Vanilla CSS, variables for theming.
- **JS**: Vanilla JS, no heavy framework updates unless requested.
- **Templating**: EJS.
