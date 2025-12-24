# 🛠️ AZtomiq.site

**AZtomiq** is a collection of free, fast, and secure online utility tools designed for Vietnamese users. Built with a focus on privacy, performance, and user experience.

## 🌟 Features

### Available Tools

- **💸 Tax Calculator (Tính Thuế TNCN)** - Calculate Vietnam personal income tax with 2025 vs 2026 comparison
- **📊 BMI Calculator** - Body Mass Index calculator with Asian standards
- **📄 JSON Formatter** - Beautify, validate, and format JSON data
- **💰 Loan Calculator** - Calculate loan interest with reducing balance and flat rate methods

### Core Features

- 🌐 **Multi-language Support** - Vietnamese (default) and English
- 🌓 **Dark Mode** - Automatic theme switching with user preference
- 📱 **Fully Responsive** - Optimized for mobile, tablet, and desktop
- 🔒 **Privacy First** - All calculations done client-side, no data sent to servers
- ⚡ **Fast & Lightweight** - Optimized build with minification and optional obfuscation
- 📦 **PWA Ready** - Installable as a Progressive Web App
- 🎨 **Modern UI** - Clean design with smooth animations and transitions

## 🚀 Tech Stack

- **Core Framework**: Built on [AZtomiq Core](https://github.com/ph4n4n/aztomiq)
- **Build System**: Custom Node.js build script with EJS templating
- **Styling**: Vanilla CSS with CSS variables for theming
- **JavaScript**: Vanilla JS (no frameworks)
- **PWA**: Service Worker with cache-first strategy
- **Optimization**:
  - CSS minification with `clean-css-cli`
  - JS minification with `terser`
  - JS obfuscation with `javascript-obfuscator` (production only)

## 📁 Project Structure

```
ztools.site/
├── src/                          # Source files
│   ├── assets/
│   │   ├── css/                  # Stylesheets
│   │   │   ├── global.css        # Global styles & theme
│   │   │   ├── tax.css           # Tax calculator styles
│   │   │   ├── bmi.css           # BMI calculator styles
│   │   │   ├── loan-calculator.css
│   │   │   └── json-toolkit.css
│   │   └── js/                   # JavaScript files
│   │       ├── global.js         # Theme toggle & global utilities
│   │       ├── tax.js
│   │       ├── bmi.js
│   │       ├── loan-calculator.js
│   │       └── json-toolkit.js
│   ├── includes/                 # EJS partials
│   │   ├── layout.ejs            # Main layout wrapper
│   │   ├── head.ejs              # <head> content
│   │   ├── header.ejs            # Site header
│   │   └── footer.ejs            # Site footer
│   ├── locales/                  # Translation files
│   │   ├── vi.json               # Vietnamese translations
│   │   └── en.json               # English translations
│   └── pages/                    # Page templates
│       ├── index.ejs             # Homepage
│       ├── tax/index.ejs
│       ├── bmi/index.ejs
│       ├── loan-calculator/index.ejs
│       ├── json-toolkit/index.ejs
│       ├── about/index.ejs
│       ├── privacy/index.ejs
│       ├── terms/index.ejs
│       └── 404.ejs
├── dist/                         # Production build output
├── dist-dev/                     # Development build output
├── scripts/                      # System scripts
│   ├── build.js                  # Custom Static Site Generator
│   ├── deploy.js                 # Deployment orchestrator
│   └── server.js                 # Dev server
├── plans/                        # Roadmap & planning documents
│   ├── in-progress/
│   ├── plan.md
│   ├── SEO.plan.md
│   └── roadmap-to-CMS.md
└── package.json

```

## 🛠️ Development Setup

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd ztools.site

# Install dependencies
npm install
```

### Development

```bash
# Build and serve with hot reload
npm run dev

# The site will be available at http://localhost:3000
```

The dev build:

- Outputs to `dist-dev/` folder
- Uses minification (no obfuscation)
- Faster build times

### Production Build

```bash
# Build for production
npm run build

# Preview production build
npx serve dist
```

The production build:

- Outputs to `dist/` folder
- Includes JS obfuscation for code protection
- Optimized for deployment

## 📦 Build Process

The custom build script (`scripts/build.js`) performs:

1. **Asset Processing**

   - Minifies all CSS files
   - Minifies/obfuscates JavaScript files
   - Copies to `dist/assets/`

2. **Page Generation**

   - Renders EJS templates for both `vi` and `en` locales
   - Injects translations using `t()` helper
   - Generates clean URLs (e.g., `/vi/tax/` instead of `/vi/tax.html`)

3. **Root Files**
   - Creates language redirect at `/index.html`
   - Copies PWA files (`manifest.json`, `sw.js`)
   - Copies SEO files (`robots.txt`)

## 🌐 Deployment

The site is designed to be deployed on static hosting platforms:

### Recommended Platforms

- **Vercel** (recommended) - Zero config deployment
- **Netlify** - Simple drag & drop
- **GitHub Pages** - Free hosting
- **Cloudflare Pages** - Fast global CDN

### Deployment Steps

1. Build the production version:

   ```bash
   npm run build
   ```

2. Deploy the `dist/` folder to your hosting platform

3. Configure redirects (if needed):
   - Ensure `/` redirects to `/vi/` (already handled by `index.html`)
   - Set up 404 page to `/404.html`

## 🎨 Customization

### Adding a New Tool

1. Create page template in `src/pages/your-tool/index.ejs`
2. Add tool-specific CSS in `src/assets/css/your-tool.css`
3. Add tool-specific JS in `src/assets/js/your-tool.js`
4. Add translations to `src/locales/vi.json` and `src/locales/en.json`
5. Update homepage to include the new tool
6. Run `npm run dev` to test

### Modifying Translations

Edit the JSON files in `src/locales/`:

- `vi.json` - Vietnamese translations
- `en.json` - English translations

Use the `t()` function in EJS templates:

```ejs
<h1><%= t('home.hero_title') %></h1>
```

### Theming

Modify CSS variables in `src/assets/css/global.css`:

```css
:root {
  --primary-color: #0891b2;
  --bg-color: #f8f9fa;
  --text-color: #0f172a;
  /* ... more variables */
}

[data-theme="dark"] {
  --bg-color: #0f172a;
  --text-color: #f1f5f9;
  /* ... dark mode overrides */
}
```

## 📱 PWA Features

- **Offline Support** - Service worker caches assets for offline use
- **Installable** - Can be installed as a standalone app
- **App Shortcuts** - Quick access to Tax Calculator and JSON Formatter
- **Theme Color** - Matches system dark/light mode

## 🔒 Privacy & Security

- **No Analytics Tracking** - Only Vercel Analytics (privacy-friendly)
- **Client-Side Only** - All calculations happen in the browser
- **No Data Collection** - User data never leaves their device
- **Local Storage Only** - History saved locally (can be disabled)

## 📄 License

© 2025 AZtomiq. Built with ❤️.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📞 Support

For issues or questions, please open an issue on GitHub.

---

**Made in Vietnam 🇻🇳 for Vietnamese users**
