# 🛠️ ZTools Development Guidelines

This document establishes the strict rules and workflows for developing features for ZTools. All future contributions must adhere to these standards to verify consistency, performance, and maintainability.

---

## 1. Project Architecture (SSG)

ZTools uses a custom Static Site Generator (`build.js`) based on Node.js and EJS.
- **Source**: `src/` (All editable code goes here).
- **Output**: `dist/` (Production) or `dist-dev/` (Development).
- **Core Principles**:
    - **Zero Client-Side Frameworks**: Use Vanilla JavaScript and CSS.
    - **No External Dependencies**: Avoid CDNs or npm packages for runtime logic unless absolutely necessary (e.g., specialized math/crypto).
    - **Offline First**: All assets must be cacheable via Service Worker.

---

## 2. File Structure for New Tools

Every new tool must follow this isolated structure. Example: `new-tool`

```
src/
├── pages/
│   └── new-tool/
│       └── index.ejs       # Tool markup (using EJS for i18n)
├── assets/
│   ├── css/
│   │   └── new-tool.css    # Tool-specific styles
│   └── js/
│       └── new-tool.js     # Tool specific logic
└── locales/
    ├── vi/
    │   └── new-tool.json   # VI Translations (Modular)
    └── en/
        └── new-tool.json   # EN Translations (Modular)
```

---

## 3. Localization (i18n) Rules 🌍

We use a **Modular Localization System**.
1.  **Do NOT** edit `common.json` for tool-specific keys.
2.  **Create a new file**: `src/locales/{lang}/{tool-name}.json`.
3.  **Namespace Keys**: Use the tool name as the root key.
    ```json
    // src/locales/en/new-tool.json
    {
      "new_tool": {
        "title": "New Tool Title",
        "desc": "Description..."
      }
    }
    ```
4.  **Usage in EJS**:
    ```ejs
    <h1><%= t('new_tool.title') %></h1>
    ```
5.  **Strict Rule**: No hardcoded text in `.ejs` files. All user-facing text must be Internationalized.

---

## 4. Coding Standards

### HTML / EJS
- **Title Tag**: Must be dynamic: `<!-- title: <%= t('tool.title') %> - ZTools -->` at the top of the file.
- **Semantic HTML**: Use `<section>`, `<header>`, `<button>`, `<input>`.
- **Accessibility**: All inputs must have `<label>`, images must have `alt`.

### CSS
- **Theming**: Use CSS Variables from `global.css` for colors.
    - `var(--primary-color)`, `var(--bg-color)`, `var(--text-color)`.
- **Dark Mode**: Do not write specific Dark Mode overrides unless necessary. Variables handle 90% of cases.
- **Responsiveness**: Mobile-first. Use `minmax` grids and Flexbox.

### JavaScript
- **Performance**: Minimize DOM access.
- **Security**: No `innerHTML` with user input. Use `textContent`.
- **Obfuscation**: The build script automatically obfuscates JS in production. Do not rely on variable names being preserved.

---

## 5. Deployment & SEO

1.  **Homepage Update**:
    -   Add the new tool card to `src/pages/index.ejs` in the appropriate category.
    -   Use the correct modular translation key for the card title/desc.
2.  **Service Worker**:
    -   Update `sw.js`: Add `'./vi/new-tool/'` to `STATIC_ASSETS`.
    -   Increment `CACHE_NAME`.
3.  **Documentation**:
    -   Update `plan.md`: Mark the tool as completed.
    -   Update `SEO.plan.md`: Add target keywords.

---

## 6. Pre-Commit Checklist

Before finishing a task, verify:
- [ ] Tool page renders correctly in both VI and EN.
- [ ] CSS is responsive on mobile (320px+).
- [ ] JS works without console errors.
- [ ] `npm run build` runs successfully.
- [ ] Service Worker caches the new page.
