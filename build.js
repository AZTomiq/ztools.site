const fs = require('fs-extra');
const path = require('path');
const ejs = require('ejs');
const { execSync } = require('child_process');

// Parse CLI args to check for --obfuscate
const isSecure = process.argv.includes('--obfuscate');

const SRC_DIR = path.join(__dirname, 'src');
const DIST_DIR = path.join(__dirname, 'dist');
const ASSETS_DIST = path.join(DIST_DIR, 'assets');

// Locales Configuration
const LOCALES = ['vi', 'en'];
const DEFAULT_LOCALE = 'vi';
const TRANSLATIONS = {
  vi: require('./src/locales/vi.json'),
  en: require('./src/locales/en.json')
};

async function build() {
  console.log(`🚀 Starting build (Secure Mode: ${isSecure ? 'ON' : 'OFF'})...`);

  // 1. Clean dist folder
  await fs.emptyDir(DIST_DIR);
  console.log('🧹 Cleaned dist folder');

  // 2. Build Assets (JS/CSS)
  await buildAssets();

  // 3. Build Pages (HTML) for all locales
  await buildPages();

  // 4. Create Root Redirect
  await createRootRedirect();

  // 5. Copy Root Files (PWA)
  await copyRootFiles();

  console.log('✅ Build complete!');
}

async function copyRootFiles() {
  const files = ['manifest.json', 'sw.js', 'robots.txt', 'sitemap.xml'];
  for (const file of files) {
    if (await fs.pathExists(file)) {
      await fs.copy(file, path.join(DIST_DIR, file));
      console.log(`📂 Copied root file: ${file}`);
    }
  }
}

async function buildAssets() {
  const cssSrc = path.join(SRC_DIR, 'assets', 'css');
  const jsSrc = path.join(SRC_DIR, 'assets', 'js');
  const cssDist = path.join(ASSETS_DIST, 'css');
  const jsDist = path.join(ASSETS_DIST, 'js');

  await fs.ensureDir(cssDist);
  await fs.ensureDir(jsDist);

  // --- Process CSS (Minify) ---
  if (await fs.pathExists(cssSrc)) {
    const files = await fs.readdir(cssSrc);
    for (const file of files) {
      if (!file.endsWith('.css')) continue;
      const srcPath = path.join(cssSrc, file);
      const destPath = path.join(cssDist, file);

      console.log(`🎨 Minifying CSS: ${file}`);
      try {
        execSync(`npx clean-css-cli -o "${destPath}" "${srcPath}"`);
      } catch (e) {
        console.error(`Failed to minify ${file}, copying raw.`);
        await fs.copy(srcPath, destPath);
      }
    }
  }

  // --- Process JS (Obfuscate or Minify) ---
  if (await fs.pathExists(jsSrc)) {
    const files = await fs.readdir(jsSrc);
    for (const file of files) {
      if (!file.endsWith('.js')) continue;
      const srcPath = path.join(jsSrc, file);
      const destPath = path.join(jsDist, file);

      console.log(`📦 Processing JS: ${file}`);

      if (isSecure) {
        try {
          const cmd = `npx javascript-obfuscator "${srcPath}" --output "${destPath}" \
            --compact true \
            --control-flow-flattening true \
            --control-flow-flattening-threshold 0.5 \
            --dead-code-injection true \
            --identifier-names-generator hexadecimal \
            --rename-globals true \
            --string-array true \
            --string-array-threshold 0.5 \
            --transform-object-keys true`;
          execSync(cmd);
        } catch (e) {
          console.error(`Obfuscation failed for ${file}, falling back to minify.`);
          minifyJs(srcPath, destPath);
        }
      } else {
        minifyJs(srcPath, destPath);
      }
    }
  }
}

function minifyJs(src, dest) {
  try {
    execSync(`npx terser "${src}" --compress --mangle --output "${dest}"`);
  } catch (e) {
    console.error(`Minify failed ${src}, copy raw`);
    fs.copySync(src, dest);
  }
}

async function buildPages() {
  const pagesDir = path.join(SRC_DIR, 'pages');

  async function walk(dir) {
    if (!await fs.pathExists(dir)) return;

    const files = await fs.readdir(dir);
    for (const file of files) {
      const filePath = path.join(dir, file);
      const stat = await fs.stat(filePath);

      if (stat.isDirectory()) {
        await walk(filePath);
      } else if (file.endsWith('.ejs')) {
        // Build for each locale
        for (const locale of LOCALES) {
          await buildPage(filePath, locale);
        }
      }
    }
  }

  await walk(pagesDir);
}

function getTranslation(key, locale) {
  const keys = key.split('.');
  let result = TRANSLATIONS[locale];
  for (const k of keys) {
    if (result && result[k]) {
      result = result[k];
    } else {
      return key; // Return key if not found
    }
  }
  return result;
}

async function buildPage(filePath, locale) {
  const pagesDir = path.join(SRC_DIR, 'pages');
  const relativePath = path.relative(pagesDir, filePath);

  const pageContent = await fs.readFile(filePath, 'utf-8');

  // Determine Output Path
  // 1. 404.ejs -> 404.html (Standard convention for static hosts)
  // 2. index.ejs -> index.html
  // 3. other.ejs -> other/index.html (Clean URL) -- e.g. about.ejs -> about/index.html

  let outputFileName = 'index.html';
  let outputDirRel = path.dirname(relativePath); // e.g. tax/index.ejs -> tax ; about.ejs -> .

  if (path.basename(relativePath) === '404.ejs') {
    outputFileName = '404.html';
  } else if (path.basename(relativePath) !== 'index.ejs') {
    // about.ejs -> about/index.html
    const slug = path.basename(relativePath, '.ejs');
    outputDirRel = path.join(outputDirRel, slug);
  }

  let outputRelPath = path.join(locale, outputDirRel, outputFileName);

  // Calculate generic rootPath for assets
  const depth = outputRelPath.split(path.sep).length - 1;
  const rootPath = depth > 0 ? '../'.repeat(depth) : './';

  // Helper for t()
  const t = (key) => getTranslation(key, locale);

  // Calculate pageUrl for language switcher
  // relativePath examples: "index.ejs", "tax/index.ejs", "about.ejs"
  let pageUrl = relativePath;
  if (pageUrl.endsWith('index.ejs')) {
    pageUrl = pageUrl.substring(0, pageUrl.length - 'index.ejs'.length);
  } else if (pageUrl === '404.ejs') {
    pageUrl = '404.html';
  } else if (pageUrl.endsWith('.ejs')) {
    // about.ejs -> about/
    pageUrl = pageUrl.replace('.ejs', '/');
  }
  // Ensure we don't have backslashes on Windows dev environments (though user is on Mac)
  pageUrl = pageUrl.replace(/\\/g, '/');
  // Ensure we don't have leading slash for relative joining
  if (pageUrl.startsWith('/')) pageUrl = pageUrl.substring(1);

  // Determine Category for Header
  let categoryKey = '';
  const dirName = path.dirname(relativePath);

  if (dirName === 'tax') categoryKey = 'nav.menu_job';
  else if (dirName === 'bmi') categoryKey = 'nav.menu_utils';
  else if (dirName === 'json-formatter') categoryKey = 'nav.menu_dev';

  const category = categoryKey ? t(categoryKey) : '';

  const pageData = {
    title: t('meta.title'), // Default title, can be overridden by page content
    rootPath,
    currentPath: relativePath === 'index.ejs' ? 'home' : path.dirname(relativePath),
    pageUrl,
    locale,
    category,
    t
  };

  // ... (rest of function remains mostly same, just checking output path consistency)

  const renderedBody = ejs.render(pageContent, pageData, {
    views: [path.join(SRC_DIR, 'includes')],
    filename: filePath
  });

  const layoutPath = path.join(SRC_DIR, 'includes', 'layout.ejs');
  let fullHtml = await ejs.renderFile(layoutPath, {
    ...pageData,
    body: renderedBody
  }, {
    views: [path.join(SRC_DIR, 'includes')]
  });

  const distPath = path.join(DIST_DIR, outputRelPath);
  await fs.ensureDir(path.dirname(distPath));
  await fs.writeFile(distPath, fullHtml);
  console.log(`📄 Built [${locale}]: ${outputRelPath}`);
}

async function createRootRedirect() {
  const html = `<!DOCTYPE html>
<html lang="vi">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="refresh" content="0;url=/vi/">
    <script>
        // Optional: Auto-detect language
        const userLang = navigator.language || navigator.userLanguage;
        if (userLang.startsWith('en')) {
            window.location.href = '/en/';
        } else {
            window.location.href = '/vi/';
        }
    </script>
    <title>Redirecting...</title>
</head>
<body>
    <p>Redirecting to <a href="/vi/">/vi/</a>...</p>
</body>
</html>`;
  await fs.writeFile(path.join(DIST_DIR, 'index.html'), html);
  console.log('📄 Created root redirect index.html');
}

build().catch(err => {
  console.error('❌ Build failed:', err);
  process.exit(1);
});
