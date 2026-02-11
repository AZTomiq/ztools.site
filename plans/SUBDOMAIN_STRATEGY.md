# Subdomain Strategy & Canonical URL Plan

## Overview

This document outlines the strategy for ensuring consistent subdomain usage across the iZTools ecosystem. The goal is to enforce canonical URLs for specific features (e.g., `laikep.iztools.xyz` for Compound Interest) and prevent duplicate content or navigation issues.

## Current Subdomain Mapping

Based on `src/data/subdomains.yaml`, the following mappings are enforced:

| Feature ID          | Canonical Domain         | Path Rewritten From   |
| ------------------- | ------------------------ | --------------------- |
| `blog`              | `blog.ph4n4n.xyz`        | `/blog/`              |
| `roadmap`           | `roadmap.ph4n4n.xyz`     | `/roadmap/`           |
| `compound-interest` | `laikep.iztools.xyz`     | `/compound-interest/` |
| `json-toolkit`      | `json.iztools.xyz`       | `/json-toolkit/`      |
| `tax`               | `tncn.iztools.xyz`       | `/tax/`               |
| `web-playground`    | `playground.iztools.xyz` | `/web-playground/`    |

## Implementation Details

### 1. Server-Side Redirects (`vercel.json`)

We have configured `redirects` in `vercel.json` to **force** traffic to the canonical subdomain.

- **Rule**: If a user visits `iztools.xyz/compound-interest/`, they are 301 Redirected to `https://laikep.iztools.xyz/`.
- **Why**: This prevents SEO penalty for duplicate content and ensures users always see the branded subdomain.
- **Config**:
  ```json
  {
    "source": "/compound-interest/:path*",
    "has": [{ "type": "host", "value": "iztools.xyz" }],
    "destination": "https://laikep.iztools.xyz/:path*",
    "permanent": true
  }
  ```

### 2. Client-Side Navigation (`mega-menu.ejs`)

To prevent broken links when navigating between subdomains (Cross-Origin Navigation), we updated the link generation logic.

- **Logic**:
  - If a feature has a mapped domain in `subdomains.yaml`, the link is generated as an **Absolute URL** (`https://sub.domain.com/...`).
  - If not, it remains a relative URL to support SPA-like behavior or standard navigation.
- **Code**: `src/includes/mega-menu.ejs` now checks `tool.domain` property injected during build.

### 3. Build Process (`scripts/builds/data.js`)

The build script now actively reads `subdomains.yaml` and injects the `domain` property into the `TOOLS` configuration list. This ensures that any template having access to `tools` can generate correct canonical links.

### 4. Shared Resources (`footer.ejs`)

Global links (About, Privacy, Terms) are now forced to use `global.site.url` (`https://iztools.xyz`) to ensure they always point to the main domain, even when viewed from a subdomain.

## Verification Checklist

1. **Direct Access**:
   - Visit `iztools.xyz/tax` -> Should redirect to `tncn.iztools.xyz`.
   - Visit `tncn.iztools.xyz` -> Should load Tax tool.

2. **Navigation**:
   - On `tncn.iztools.xyz`, click "Compound Interest" in Mega Menu.
   - It should navigate to `https://laikep.iztools.xyz/`.

3. **Footer Links**:
   - On `tncn.iztools.xyz`, click "Privacy Policy".
   - It should navigate to `https://iztools.xyz/privacy/`.

4. **Deep Linking**:
   - Visit `iztools.xyz/tax/en/` -> Should redirect to `tncn.iztools.xyz/en/`.

## Maintenance

- To add a new subdomain, update `src/data/subdomains.yaml`.
- Then update `vercel.json` to add the corresponding Redirect and Rewrite rules.
- Re-deploy.
