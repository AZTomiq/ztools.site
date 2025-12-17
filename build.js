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
const CACHE_FILE = path.join(__dirname, '.build-cache.yaml');

// Load Tools from YAML
// Load Tools from Atomic Feature Configs
const featuresDir = path.join(SRC_DIR, 'features');
let TOOLS = [];

if (fs.existsSync(featuresDir)) {
  const features = fs.readdirSync(featuresDir);
  for (const feature of features) {
    const configPath = path.join(featuresDir, feature, 'tool.yaml');
    if (fs.existsSync(configPath)) {
      try {
        const config = yaml.load(fs.readFileSync(configPath, 'utf8'));
        // Ensure ID and Link match folder if not explicitly set (optional safety, but good for atomic)
        if (!config.id) config.id = feature;
        if (!config.link) config.link = `/${feature}/`;

        TOOLS.push(config);
      } catch (e) {
        console.error(`❌ Error parsing ${feature}/tool.yaml:`, e);
      }
    }
  }
}
// Sort tools to ensure consistent order (optional, or by property if added later)
TOOLS.sort((a, b) => a.id.localeCompare(b.id));

// Helper: Calculate MD5 Hash
function getHash(content) {
  return crypto.createHash('md5').update(content).digest('hex');
}

// Helper: Load/Save Cache
let buildCache = {};
if (fs.existsSync(CACHE_FILE) && !forceRebuild) {
  try {
    buildCache = yaml.load(fs.readFileSync(CACHE_FILE, 'utf8')) || {};
  } catch (e) {
    console.log('⚠️ Could not read cache, rebuilding all...');
  }
}

function saveCache() {
  fs.writeFileSync(CACHE_FILE, yaml.dump(buildCache), 'utf8');
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
// Global Configuration
let GLOBAL_CONFIG = {
  build: { locales: ['vi', 'en'], default_locale: 'vi' },
  site: {},
  categories: {},
  category_order: []
};
const globalConfigPath = path.join(SRC_DIR, 'data', 'global.yaml');

try {
  if (fs.existsSync(globalConfigPath)) {
    const yamlContent = fs.readFileSync(globalConfigPath, 'utf8');
    const parsed = yaml.load(yamlContent);
    GLOBAL_CONFIG = { ...GLOBAL_CONFIG, ...parsed };
  }
} catch (e) {
  console.error('⚠️ Could not load global.yaml:', e);
}

const LOCALES = GLOBAL_CONFIG.build.locales;
const DEFAULT_LOCALE = GLOBAL_CONFIG.build.default_locale;

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
          const content = require(path.join(dirPath, file));
          Object.assign(translations, content);
        } catch (e) { console.error(`Error loading locale module ${lang}/${file}`, e); }
      }
    }
  }

  // 3. Load Feature Bundled Locales (features/*/locales/lang.yaml)
  const featuresDir = path.join(SRC_DIR, 'features');
  if (fs.existsSync(featuresDir)) {
    const features = fs.readdirSync(featuresDir);
    for (const feature of features) {
      const localePath = path.join(featuresDir, feature, 'locales', `${lang}.yaml`);
      if (fs.existsSync(localePath)) {
        try {
          const content = yaml.load(fs.readFileSync(localePath, 'utf8'));
          // Merge logic: usually feature locales should be namespaced or just merged?
          // Existing json files had root keys like "tax": {...}.
          // Let's assume the YAML content is the same structure (root keys).
          Object.assign(translations, content);
        } catch (e) {
          console.error(`Error loading feature locale ${feature}/${lang}.yaml`, e);
        }
      }
    }
  }

  return translations;
}

const TRANSLATIONS = {
  vi: loadLocales('vi'),
  en: loadLocales('en')
};


// Main Execution
(async () => {
  console.log(`🚀 Starting build (Secure Mode: ${isSecure ? 'ON' : 'OFF'})...`);

  if (forceRebuild) {
    try { await fs.emptyDir(DIST_DIR); console.log("🧹 Cleaned dist folder"); } catch (e) { }
  } else {
    await fs.ensureDir(DIST_DIR);
  }

  await buildAssets();
  await buildPages();
  // await buildAdmin(); // Temporarily disabled - admin panel not needed in build
  await createRootRedirect();
  await buildTemplates();
  await copyRootFiles(); // Retained from original build() function

  saveCache();
  console.log('✅ Build complete!');
})();

async function buildTemplates() {
  const templatesDir = path.join(SRC_DIR, 'templates');
  if (!fs.existsSync(templatesDir)) return;

  const files = fs.readdirSync(templatesDir);
  for (const file of files) {
    if (!file.endsWith('.ejs')) continue;

    const srcPath = path.join(templatesDir, file);
    const fileName = file.replace('.ejs', '');

    // Only build specific standalone templates
    if (!['robots', 'sw', 'manifest'].includes(fileName)) {
      continue;
    }

    let outputName = fileName;
    if (fileName === 'robots') outputName = 'robots.txt';
    else if (fileName === 'sw') outputName = 'sw.js';
    else if (fileName === 'manifest') outputName = 'manifest.json';

    const destPath = path.join(DIST_DIR, outputName);

    // T helper for templates
    const t = (key) => {
      const dict = loadLocales(DEFAULT_LOCALE);
      return key.split('.').reduce((o, i) => (o ? o[i] : null), dict) || key;
    };

    const data = {
      global: GLOBAL_CONFIG,
      tools: TOOLS,
      locales: LOCALES,
      defaultLocale: DEFAULT_LOCALE,
      t
    };

    try {
      const content = await ejs.renderFile(srcPath, data);
      await fs.writeFile(destPath, content);
      console.log(`📄 Generated: ${outputName}`);
    } catch (e) {
      console.error(`❌ Error building template ${file}:`, e);
    }
  }
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
  const featuresDir = path.join(SRC_DIR, 'features');
  const cssDist = path.join(ASSETS_DIST, 'css');
  const jsDist = path.join(ASSETS_DIST, 'js');
  const featuresDist = path.join(ASSETS_DIST, 'features');

  await fs.ensureDir(cssDist);
  await fs.ensureDir(jsDist);
  await fs.ensureDir(featuresDist);

  // 1. Global CSS
  if (await fs.pathExists(cssSrc)) {
    const files = await fs.readdir(cssSrc);
    for (const file of files) {
      if (!file.endsWith('.css')) continue;
      const srcPath = path.join(cssSrc, file);
      const destPath = path.join(cssDist, file);
      if (hasChanged(srcPath) || !fs.existsSync(destPath)) {
        console.log(`🎨 Minifying Global CSS: ${file}`);
        try { execSync(`npx clean-css-cli -o "${destPath}" "${srcPath}"`); }
        catch (e) { await fs.copy(srcPath, destPath); }
      }
    }
  }

  // 2. Global JS
  if (await fs.pathExists(jsSrc)) {
    const files = await fs.readdir(jsSrc);
    for (const file of files) {
      if (!file.endsWith('.js')) continue;
      const srcPath = path.join(jsSrc, file);
      const destPath = path.join(jsDist, file);
      processJs(srcPath, destPath, file);
    }
  }

  // 3. Feature Assets
  if (await fs.pathExists(featuresDir)) {
    const features = await fs.readdir(featuresDir);
    for (const feature of features) {
      const featDir = path.join(featuresDir, feature);
      if (!(await fs.stat(featDir)).isDirectory()) continue;

      const featDistDir = path.join(featuresDist, feature);
      await fs.ensureDir(featDistDir);

      // Feature CSS
      const cssPath = path.join(featDir, 'style.css');
      if (fs.existsSync(cssPath)) {
        const destPath = path.join(featDistDir, 'style.css');
        if (hasChanged(cssPath) || !fs.existsSync(destPath)) {
          console.log(`🎨 Minifying Feature CSS: ${feature}/style.css`);
          try { execSync(`npx clean-css-cli -o "${destPath}" "${cssPath}"`); }
          catch (e) { await fs.copy(cssPath, destPath); }
        }
      }

      // Feature JS
      const jsPath = path.join(featDir, 'script.js');
      if (fs.existsSync(jsPath)) {
        const destPath = path.join(featDistDir, 'script.js');
        processJs(jsPath, destPath, `${feature}/script.js`);
      }
    }
  }
}

function processJs(srcPath, destPath, fileName) {
  if (hasChanged(srcPath) || !fs.existsSync(destPath)) {
    console.log(`📦 Processing JS: ${fileName}`);
    if (isSecure) {
      try {
        const cmd = `npx javascript-obfuscator "${srcPath}" --output "${destPath}" \
            --compact true --control-flow-flattening true --control-flow-flattening-threshold 0.5 \
            --dead-code-injection true --identifier-names-generator hexadecimal \
            --rename-globals true --string-array true --string-array-threshold 0.5 \
            --transform-object-keys true`;
        execSync(cmd);
      } catch (e) {
        console.error(`Obfuscation failed for ${fileName}, fallback to minify.`);
        minifyJs(srcPath, destPath);
      }
    } else {
      minifyJs(srcPath, destPath);
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
  const featuresDir = path.join(SRC_DIR, 'features');
  const includesDir = path.join(SRC_DIR, 'includes');

  // Check include changes
  let includesChanged = false;
  if (fs.existsSync(includesDir)) {
    const includeFiles = fs.readdirSync(includesDir);
    for (const file of includeFiles) {
      if (hasChanged(path.join(includesDir, file), 'include/')) {
        includesChanged = true;
      }
    }
  }

  // Check Data changes (Atomic tool.yaml)
  let toolsChanged = false;
  if (fs.existsSync(featuresDir)) {
    const features = fs.readdirSync(featuresDir);
    for (const feature of features) {
      const configPath = path.join(featuresDir, feature, 'tool.yaml');
      if (fs.existsSync(configPath)) {
        // We track this as 'config/[feature]' to isolate cache keys
        if (hasChanged(configPath, `config/${feature}/`)) {
          toolsChanged = true;
          console.log(`⚙️  Config changed for: ${feature}`);
        }
      }
    }
  }

  // Helper to walk a directory and build pages
  // baseDir: root folder being walked (e.g. src/pages or src/features)
  async function walk(dir, baseDir) {
    if (!await fs.pathExists(dir)) return;

    const files = await fs.readdir(dir);
    for (const file of files) {
      const filePath = path.join(dir, file);
      const stat = await fs.stat(filePath);

      if (stat.isDirectory()) {
        await walk(filePath, baseDir);
      } else if (file.endsWith('.ejs')) {
        const fileChanged = hasChanged(filePath, 'page/');
        // Calculate relative path for index check logic? 
        // Actually, we rebuild everything if global includes change.
        // For features, index.ejs is the entry point.

        const mustRebuild = fileChanged || includesChanged || toolsChanged;

        if (mustRebuild) {
          for (const locale of LOCALES) {
            await buildPage(filePath, locale, baseDir);
          }
        }
      }
    }
  }

  await walk(pagesDir, pagesDir);
  await walk(featuresDir, featuresDir);
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

async function buildPage(filePath, locale, baseDir) {
  const relativePath = path.relative(baseDir, filePath); // Use dynamic baseDir

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

  // Feature Detection & Asset Path
  const isFeature = baseDir.endsWith('features');
  let featureName = '';
  let assetPath = '';

  let toolConfig = {};

  if (isFeature) {
    // relativePath example: "tax/index.ejs" -> featureName = "tax"
    featureName = relativePath.split(path.sep)[0];
    assetPath = `${rootPath}assets/features/${featureName}/`;
    // Find the specific tool config
    toolConfig = TOOLS.find(t => t.id === featureName) || {};
    console.log(`Debug: Feature ${featureName}, found config: ${!!toolConfig.id}`);
  }

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
    assetPath, // Inject assetPath here
    currentPath: relativePath === 'index.ejs' ? 'home' : path.dirname(relativePath),
    pageUrl,
    locale,
    category,
    tools: TOOLS,
    toolConfig, // Auto-injected tool configuration
    global: GLOBAL_CONFIG,
    t
  };

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


async function buildAdmin() {
  const adminSrc = path.join(SRC_DIR, 'admin');
  const adminDist = path.join(DIST_DIR, 'admin');

  if (fs.existsSync(adminSrc)) {
    console.log('🛡️  Building Admin Panel...');
    await fs.ensureDir(adminDist);
    await fs.copy(adminSrc, adminDist);
    console.log('✅ Admin Panel copied.');
  }
}

