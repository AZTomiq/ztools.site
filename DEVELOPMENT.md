# 🛠️ AZtomiq Development Guidelines

This document establishes the strict rules and workflows for developing features for AZtomiq. All future contributions must adhere to these standards to verify consistency, performance, and maintainability.

---

## 1. Project Architecture (SSG)

AZtomiq uses a custom Static Site Generator (`scripts/build.js`) based on Node.js and EJS.

- **Source**: `src/` (All editable code goes here).
- **Output**: `dist/` (Production) or `dist-dev/` (Development).
- **Core Principles**:
  - **Zero Client-Side Frameworks**: Use Vanilla JavaScript and CSS.
  - **No External Dependencies**: Avoid CDNs or npm packages for runtime logic unless absolutely necessary (e.g., specialized math/crypto).
  - **Offline First**: All assets must be cacheable via Service Worker.

---

## 2. AZtomiq CLI 🛠️

We use a central CLI located at `bin/aztomiq.js` to manage the framework tasks. Use it via `npm run aztomiq` or directly if installed.

| Command                            | Description                                                                                         |
| :--------------------------------- | :-------------------------------------------------------------------------------------------------- |
| `npm run dev`                      | Starts the build watcher and the local server. Alias for `aztomiq dev`.                             |
| `npm run aztomiq tool:create <id>` | **Scaffold a new tool.** Automatically creates directories, YAML, EJS, JS, CSS, and atomic locales. |
| `npm run build`                    | Production build with obfuscation and minification.                                                 |
| `npm run deploy`                   | Deploys the `dist` folder to the public repository.                                                 |
| `npm run aztomiq test ui`          | Runs automated Puppeteer UI tests.                                                                  |

---

## 3. File Structure for New Tools

Every tool must be self-contained within the `src/features/` directory.

```
src/features/new-tool/
├── tool.yaml           # Metadata (ID, Category, Icon, Version)
├── index.ejs           # Tool markup (EJS template)
├── style.css           # Tool-specific styles
├── script.js           # Tool-specific logic
├── CHANGELOG.md        # Update history (Markdown)
└── locales/            # Atomic translations
    ├── vi.yaml
    └── en.yaml
```

- **Avoid**: Putting tool-specific files in global `assets/` or `pages/` folders.
- **tool.yaml**: Must define `id`, `category`, `translationKey`, and `meta.version`.

---

## 3. Localization (i18n) Rules 🌍

We use an **Atomic YAML Localization System**.

1.  **Scope**: Translations are stored inside the feature folder: `src/features/{tool}/locales/{lang}.yaml`.
2.  **Namespace**: Use the `translationKey` defined in `tool.yaml` as the root key.
    ```yaml
    # src/features/new-tool/locales/en.yaml
    new_tool:
      title: "New Tool Title"
      desc: "Detailed description..."
    ```
3.  **Global Keys**: Global/shared text remains in `src/locales/{lang}.json` (legacy) or `src/locales/{lang}/`.
4.  **Strict Rule**: No hardcoded text. Use `<%= t('key') %>`.
5.  **Data Injections**: Tool-specific JS often needs locale data. Use high-performance JSON injection:
    ```ejs
    <script id="tool-locales" type="application/json">
      <%- JSON.stringify(t('new_tool.data')) %>
    </script>
    ```

---

## 4. Coding Standards

### HTML / EJS

- **Title Tag**: Must be dynamic: `<!-- title: <%= t('tool.title') %> - AZtomiq -->` at the top of the file.
- **Semantic HTML**: Use `<section>`, `<header>`, `<button>`, `<input>`.
- **Accessibility**: All inputs must have `<label>`, images must have `alt`.

### CSS

- **Theming**: Use CSS Variables from `global.css` for colors.
  - `var(--primary-color)`, `var(--bg-color)`, `var(--text-color)`.
- **Dark Mode**: Do not write specific Dark Mode overrides unless necessary. Variables handle 90% of cases.
- **Responsiveness**: Mobile-first. Use `minmax` grids and Flexbox.

### JavaScript

### JavaScript & APIs

- **Secure Mode**: `npm run build` minifies and obfuscates JS. `npm run dev` copies raw files for easier debugging.
- **CORS Mitigation**: When fetching from 3rd-party APIs (like SJC Gold), use a proxy like `api.allorigins.win` to bypass browser restrictions.
- **No innerHTML**: Use `textContent` or use `DOMParser` for XML/HTML parsing from trusted sources.

### Versioning & Changelog

- **Version**: Defined in `tool.yaml` -> `meta.version`.
- **Badge**: Every tool should display its version: `<span class="version-badge" id="open-changelog">v<%= toolConfig.meta.version %></span>`.
- **Changelog**: Place `CHANGELOG.md` in the feature folder. It is automatically parsed and displayed in a modal when the version badge is clicked.

---

## 5. Deployment & SEO

1.  **Homepage Integration**:
    - The homepage (`src/pages/index.ejs`) is dynamic. Simply set `status: active` in `tool.yaml` and the tool will automatically appear in its category.
2.  **Static Assets**:
    - `sw.js`, `manifest.json`, `sitemap.xml`, and `robots.txt` are **automatically generated**. Do not edit them in `dist/`.
3.  **Deployment**:
    - Run `npm run build` to generate the production `dist/` folder.
    - Run `npm run deploy` to push to the production repository.

---

---

## 7. Quality Assurance & Testing 🧪

We use a two-tier testing system to ensure stability and accuracy.

### 1. Integrity Tests (`npm run test:integrity`)

- Automatically verifies all `tool.yaml` files have required fields.
- Checks `dist-dev/` for unrendered EJS tags or missing assets.
- Use this to ensure the project structure is healthy.

### 2. Unit Tests (`npm run test:unit`)

- Uses **Vitest** with `jsdom` environment.
- **Requirement**: Any tool with complex logic (Math, Converters, Parsers) MUST have a corresponding test file in `tests/`.
- **Exporting Logic**: To make tool scripts testable, export the core logic at the bottom of `script.js`:
  ```javascript
  if (typeof module !== "undefined" && module.exports) {
    module.exports = { calculateSomething, CORE_CONFIG };
  }
  ```

### 3. Pre-Commit Checklist (Updated)

Before finishing a task, verify:

- [ ] Tool page renders correctly in both VI and EN.
- [ ] CSS is responsive on mobile (320px+).
- [ ] JS works without console errors.
- [ ] `npm test` passes (Integrity + Unit tests).
- [ ] Service Worker caches the new page.
