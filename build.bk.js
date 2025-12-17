const fs = require('fs-extra');
const path = require('path');
const ejs = require('ejs');
const { execSync } = require('child_process');
const crypto = require('crypto');
const yaml = require('js-yaml');

// Parse CLI args
const isSecure = process.argv.includes('--obfuscate');
const forceRebuild = process.argv.includes('--force');

const SRC_DIR = path.join(__dirname, 'src');
const DIST_DIR = path.join(__dirname, isSecure ? 'dist' : 'dist-dev');
const ASSETS_DIST = path.join(DIST_DIR, 'assets');
const CACHE_FILE = path.join(__dirname, '.build-cache.json');

// Load Tools from YAML
const toolsYamlPath = path.join(SRC_DIR, 'data', 'tools.yaml');
let TOOLS = [];
try {
  if (fs.existsSync(toolsYamlPath)) {
    const fileContents = fs.readFileSync(toolsYamlPath, 'utf8');
    TOOLS = yaml.load(fileContents);
  } else {
    console.error(`⚠️  Tools data not found at ${toolsYamlPath}`);
  }
} catch (e) {
  console.error('❌ Error parsing tools.yaml:', e);
}

// Helper: Calculate MD5 Hash
function getHash(content) {
  return crypto.createHash('md5').update(content).digest('hex');
}

// Helper: Load/Save Cache
let buildCache = {};
if (fs.existsSync(CACHE_FILE) && !forceRebuild) {
  try {
    buildCache = fs.readJsonSync(CACHE_FILE);
  } catch (e) {
    console.log('⚠️ Could not read cache, rebuilding all...');
  }
}

function saveCache() {
  fs.writeJsonSync(CACHE_FILE, buildCache, { spaces: 2 });
}

// Helper: Check if file changed
function hasChanged(filePath, keyPrefix = '') {
  if (forceRebuild) return true;
  if (!fs.existsSync(filePath)) return true; // Source missing (weird)

  const content = fs.readFileSync(filePath);
  const currentHash = getHash(content);
  const cacheKey = keyPrefix + path.relative(SRC_DIR, filePath);

  if (buildCache[cacheKey] !== currentHash) {
    buildCache[cacheKey] = currentHash;
    return true;
  }
  return false;
}

// Locales Configuration
const LOCALES = ['vi', 'en'];
const DEFAULT_LOCALE = 'vi';

function loadLocales(lang) {
  const translations = {};

  // 1. Load legacy file (e.g., locales/vi.json)
  const legacyPath = path.join(SRC_DIR, 'locales', `${lang}.json`);
  if (fs.existsSync(legacyPath)) {
    try {
      Object.assign(translations, require(legacyPath));
    } catch (e) { console.error(`Error loading legacy locale ${lang} `, e); }
  }

  // 2. Load module folders (e.g., locales/vi/*.json)
  const dirPath = path.join(SRC_DIR, 'locales', lang);
  if (fs.existsSync(dirPath) && fs.statSync(dirPath).isDirectory()) {
    const files = fs.readdirSync(dirPath);
    for (const file of files) {
      if (file.endsWith('.json')) {
        try {
          // Invalidate cache if locale file changes
          // We don't track locale file hashes individually in this simple script for pages,
          // but strictly speaking, page builds depend on them.
          // For simplicity, we'll assume locale changes require force build or we assume
          // we are only tracking source code changes for now.
          const content = require(path.join(dirPath, file));
          // Shallow merge (top-level keys)
          Object.assign(translations, content);
        } catch (e) { console.error(`Error loading locale module $ { lang }/${file}`, e); }
      }
    }
  }
  return translations;
}

const TRANSLATIONS = {
  vi: loadLocales('vi'),
  en: loadLocales('en')
};



async function build() {
  console.log(`🚀 Starting build (Secure Mode: ${isSecure ? 'ON' : 'OFF'})...`);

  // Clean dist only if force rebuild or first time
  if (forceRebuild || !fs.existsSync(DIST_DIR)) {
    await fs.emptyDir(DIST_DIR);
    console.log('🧹 Cleaned dist folder');
  } else {
    await fs.ensureDir(DIST_DIR);
  }

  // 2. Build Assets (JS/CSS)
  await buildAssets();

  // 3. Build Pages (HTML) for all locales
  await buildPages();

  // 4. Create Root Redirect (Only needs to run once)
  if (!fs.existsSync(path.join(DIST_DIR, 'index.html'))) {
    await createRootRedirect();
  }

  // 5. Copy Root Files (PWA)
  await copyRootFiles();

  saveCache();
  console.log('✅ Build complete!');
}

async function copyRootFiles() {
  const files = ['manifest.json', 'sw.js', 'robots.txt', 'sitemap.xml'];
  for (const file of files) {
    const srcPath = path.join(__dirname, file); // These are in root, not src
    // Just copy always or check? Check is better.
    // We treat root files as part of 'src' for cache usage convenience or just use absolute path
    if (fs.existsSync(file)) {
      const content = fs.readFileSync(file);
      const hash = getHash(content);
      const cacheKey = `root/${file}`;

      if (buildCache[cacheKey] !== hash || !fs.existsSync(path.join(DIST_DIR, file))) {
        await fs.copy(file, path.join(DIST_DIR, file));
        buildCache[cacheKey] = hash;
        console.log(`📂 Copied root file: ${file}`);
      }
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

      if (hasChanged(srcPath) || !fs.existsSync(destPath)) {
        console.log(`🎨 Minifying CSS: ${file}`);
        try {
          execSync(`npx clean-css-cli -o "${destPath}" "${srcPath}"`);
        } catch (e) {
          console.error(`Failed to minify ${file}, copying raw.`);
          await fs.copy(srcPath, destPath);
        }
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

      if (hasChanged(srcPath) || !fs.existsSync(destPath)) {
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
  const includesDir = path.join(SRC_DIR, 'includes');

  // Check if any include changed. If so, we must rebuild ALL pages.
  let includesChanged = false;
  if (fs.existsSync(includesDir)) {
    const includeFiles = fs.readdirSync(includesDir);
    for (const file of includeFiles) {
      if (hasChanged(path.join(includesDir, file), 'include/')) {
        includesChanged = true;
      }
    }
  }

  // Note: if tools.js changes, we basically need to rebuild index.ejs.
  // Ideally we track data dependency too.
  const toolsDataPath = path.join(SRC_DIR, 'data', 'tools.js');
  let toolsChanged = false;
  if (fs.existsSync(toolsDataPath)) {
    if (hasChanged(toolsDataPath, 'data/')) toolsChanged = true;
  }

  async function walk(dir) {
    if (!await fs.pathExists(dir)) return;

    const files = await fs.readdir(dir);
    for (const file of files) {
      const filePath = path.join(dir, file);
      const stat = await fs.stat(filePath);

      if (stat.isDirectory()) {
        await walk(filePath);
      } else if (file.endsWith('.ejs')) {
        // If includes changed, we force 'hasChanged' to update the cache for this page too,
        // or we simply bypass the check.
        // We need to update the cache for the page itself even if we rebuild due to include change.

        const fileChanged = hasChanged(filePath, 'page/');
        const mustRebuild = fileChanged || includesChanged || (toolsChanged && file === 'index.ejs');

        // Check if dist file exists
        // We need to check for both locales
        const distExists = LOCALES.every(locale => {
          // Logic to guess output path is duplicated here, which is messy.
          // Simpler: Just pass a 'force' flag to buildPage if mustRebuild is true.
          // But we need to know the output path to check existence.
          return true; // Simplified for now, relying on source change or global change
        });

        if (mustRebuild) {
          for (const locale of LOCALES) {
            await buildPage(filePath, locale);
          }
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

  if (['tax', 'business-tax', 'social-insurance'].includes(dirName)) categoryKey = 'nav.menu_job';
  else if (['loan-calculator', 'compound-interest', 'savings-interest', 'percentage-calculator'].includes(dirName)) categoryKey = 'nav.menu_finance';
  else if (['word-counter', 'lorem-ipsum'].includes(dirName)) categoryKey = 'nav.menu_text';
  else if (['password-generator', 'uuid-generator'].includes(dirName)) categoryKey = 'nav.menu_generator';
  else if (['bmi'].includes(dirName)) categoryKey = 'nav.menu_utils';
  else if (['json-toolkit'].includes(dirName)) categoryKey = 'nav.menu_dev';

  const category = categoryKey ? t(categoryKey) : '';

  const pageData = {
    title: t('meta.title'), // Default title, can be overridden by page content
    rootPath,
    currentPath: relativePath === 'index.ejs' ? 'home' : path.dirname(relativePath),
    pageUrl,
    locale,
    category,
    tools: TOOLS,
    t
  };

  // ... (rest of function remains mostly same, just checking output path consistency)

  try {
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
  } catch (e) {
    console.error(`❌ Error building page ${filePath}:`, e);
  }
}

async function createRootRedirect() {
  const html = `<!DOCTYPE html>
<html lang="vi">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="refresh" content="0;url=/vi/">
    <script>
        // Default to Vietnamese
        window.location.href = '/vi/';
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
