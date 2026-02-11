# Context & Architecture

Rules for AI:

- Always read CONTEXT.md and PLAN.md first
- Do NOT write code unless explicitly asked
- Prefer small, reviewable changes
- Any architecture change must be written to DECISIONS.md
- End each session by updating MEMORY.md

## Project Overview

**Name**: iztools.xyz
**Description**: Multi-tool utility site with secure, fast, and modern UI.
**Tech Stack**:

- **Runtime**: Node.js
- **Framework**: Express (Server), EJS (Templating)
- **Styling**: Vanilla CSS (modern features)
- **Build System**: Custom `aztomiq.js` script
- **Deployment**: Vercel

## Codebase Structure

- `src/features`: Contains individual tools/features (each has `script.js`, `style.css`, `index.ejs`).
- `src/includes`: Shared EJS partials (header, footer, mega-menu).
- `src/data`: Global configurations (`global.yaml`, `subdomains.yaml`).
- `scripts`: Build and utility scripts.
