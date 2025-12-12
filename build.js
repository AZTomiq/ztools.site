const fs = require('fs-extra');
const path = require('path');
const ejs = require('ejs');

const SRC_DIR = path.join(__dirname, 'src');
const DIST_DIR = path.join(__dirname, 'dist');

async function build() {
  console.log('🚀 Starting build...');

  // 1. Clean dist folder
  await fs.emptyDir(DIST_DIR);
  console.log('🧹 Cleaned dist folder');

  // 2. Copy assets
  const assetsSrc = path.join(SRC_DIR, 'assets');
  const assetsDist = path.join(DIST_DIR, 'assets');
  if (await fs.pathExists(assetsSrc)) {
    await fs.copy(assetsSrc, assetsDist);
    console.log('📦 Copied assets');
  }

  // 3. Build Pages
  const pagesDir = path.join(SRC_DIR, 'pages');

  // Helper to walk through directories
  async function walk(dir) {
    const files = await fs.readdir(dir);
    for (const file of files) {
      const filePath = path.join(dir, file);
      const stat = await fs.stat(filePath);

      if (stat.isDirectory()) {
        await walk(filePath);
      } else if (file.endsWith('.ejs')) {
        await buildPage(filePath);
      }
    }
  }

  await walk(pagesDir);
  console.log('✅ Build complete!');
}

async function buildPage(filePath) {
  // Determine relative path from pages root
  const pagesDir = path.join(SRC_DIR, 'pages');
  const relativePath = path.relative(pagesDir, filePath);

  // Determine input content
  const pageContent = await fs.readFile(filePath, 'utf-8');

  // Prepare metadata (can be FrontMatter later, now simple object)
  const pageData = {
    title: 'ZTools - Tiện ích cho mọi người', // Default title
    rootPath: relativePath.split(path.sep).length > 1 ? '../'.repeat(relativePath.split(path.sep).length - 1) : './'
  };

  // Extract simple title comment if exists <!-- title: ... -->
  const titleMatch = pageContent.match(/<!--\s*title:\s*(.*?)\s*-->/);
  if (titleMatch) pageData.title = titleMatch[1];

  // Render Page Content first (to process includes if any, but usually main content)
  // Actually, simpler: render Layout, and pass Page Content as a string.
  // BUT: Page might use EJS logic too. So render page first.
  const renderedBody = ejs.render(pageContent, pageData, {
    views: [path.join(SRC_DIR, 'includes')], // Allow partial includes from includes dir
    filename: filePath // Enable relative includes
  });

  // Render Layout with Body
  const layoutPath = path.join(SRC_DIR, 'includes', 'layout.ejs');
  const fullHtml = await ejs.renderFile(layoutPath, {
    ...pageData,
    body: renderedBody
  }, {
    views: [path.join(SRC_DIR, 'includes')]
  });

  // Write to dist
  const distPath = path.join(DIST_DIR, relativePath.replace('.ejs', '.html'));
  await fs.ensureDir(path.dirname(distPath));
  await fs.writeFile(distPath, fullHtml);
  console.log(`📄 Built: ${relativePath} -> ${path.relative(DIST_DIR, distPath)}`);
}

build().catch(err => {
  console.error('❌ Build failed:', err);
  process.exit(1);
});
