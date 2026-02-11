# SEO & Language Strategy (Aztomiq Framework)

## 1. Problem Statement

The current implementation of multi-language support uses a "path segment" approach (e.g., `/vi/`, `/en/`) and a root redirect. This causes:

- **Page with redirect** issues in Google Search Console (GSC) because `iztools.xyz/` redirects to `iztools.xyz/vi/`.
- **Duplicate content** issues if canonicalization is inconsistent.
- **Suboptimal UX** for international users who expect English by default outside of Vietnam.

## 2. Strategic Objectives

- Eliminate root redirects to improve SEO indexing and Core Web Vitals.
- Transition from path segments to **URL parameters** (`?lang=`) for secondary languages, or high-performance server-side detection.
- Implement **Regional Auto-selection**: Default to English for users outside Vietnam.
- Maintain **Static Site Performance**: Ensure translations are served with minimal latency and are crawler-accessible.

## 3. The New Approach: Unified Path Strategy

### A. URL Mapping

| Audience                 | Current URL               | New URL (Target)                 |
| :----------------------- | :------------------------ | :------------------------------- |
| **Vietnamese (Default)** | `/vi/tool-name/`          | `/tool-name/`                    |
| **English**              | `/en/tool-name/`          | `/tool-name/?lang=en`            |
| **Root**                 | `/` (Redirects to `/vi/`) | `/` (Serves Vietnamese directly) |

### B. Canonical & Hreflang Configuration

Every page will include the following tags to guide search engines:

```html
<!-- Canonical defines the "Master" version of the content -->
<link rel="canonical" href="https://iztools.xyz/page-path/" />

<!-- Hreflang informs about language variations -->
<link rel="alternate" hreflang="vi" href="https://iztools.xyz/page-path/" />
<link
  rel="alternate"
  hreflang="en"
  href="https://iztools.xyz/page-path/?lang=en"
/>
<link
  rel="alternate"
  hreflang="x-default"
  href="https://iztools.xyz/page-path/?lang=en"
/>
```

_Note: `x-default` is set to English to capture all non-specified regions._

### C. Implementation Strategy (Build & Serve)

To maintain the "Static rendering" benefit while using query params:

1.  **Build Phase (SSG)**:
    - The build script generates two sets of files:
      - `/page/index.html` (Primary: Vietnamese).
      - `/page/index.en.html` (Secondary: English).
2.  **Server Phase (Edge Rewrites)**:
    - Configure the hosting platform (e.g., Vercel Middleware or `vercel.json` rewrites) to:
      - If `?lang=en` is present: Serve `index.en.html`.
      - If `Accept-Language` or Geo-IP indicates a non-VN region: Serve `index.en.html` (only if no explicit language preference exists).
3.  **Client Phase (Hydration)**:
    - A small inline script in `<head>` ensures the UI state (language toggle) matches the served content and persists the choice in `localStorage`.

## 4. Immediate Fixes for iZTools

1.  **Root Redirect Removal**: Update `scripts/builds/templates.js` to copy the default locale's index to the root instead of creating a redirect script.
2.  **Canonical Correction**: Update `src/includes/head.ejs` to use clean URLs for the default locale.
3.  **English /en Canonical**: Ensure `https://iztools.xyz/en/` has a canonical link pointing to `https://iztools.xyz/?lang=en`.

## 5. Synchronization with Aztomiq

This strategy will be codified into the Aztomiq core build scripts to ensure all child projects benefit from optimized SEO defaults.

## 6. Implementation Steps (Log)

1. **Refactored Build Output Logic**: Updated `scripts/builds/pages.js` to render the default locale (`vi`) directly at the root of the distribution folder (e.g., `/` instead of `/vi/`).
2. **Eliminated Root Redirect**: Modified `scripts/builds/templates.js` to skip creating a meta-refresh redirect if the root `index.html` is already provided by the default locale build.
3. **Canonical & Hreflang Overhaul**: Updated `src/includes/head.ejs` to:
   - Generate clean canonical URLs for the primary language.
   - Transition `hreflang` alternates for English to use `?lang=en`.
   - Set `x-default` to English to capture non-VN traffic effectively.
4. **Edge Routing Configuration**: Created `vercel.json` with rewrite rules to:
   - Serve English content for users outside Vietnam based on Geo-IP (`x-vercel-ip-country`).
   - Handle `?lang=en` query parameters via server-side rewrites for SEO compatibility.
5. **UI Integration**: Updated `src/includes/header.ejs` to ensure the language toggle aligns with the new URL parameter strategy.
