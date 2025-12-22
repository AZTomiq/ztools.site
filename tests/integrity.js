const fs = require('fs-extra');
const path = require('path');
const yaml = require('js-yaml');

const ROOT_DIR = path.join(__dirname, '..');
const SRC_DIR = path.join(ROOT_DIR, 'src');
const DIST_DIR = path.join(ROOT_DIR, 'dist-dev'); // Test against dev build first

let errors = [];

function logError(msg) {
  errors.push(msg);
  console.error(`❌ ${msg}`);
}

async function runTests() {
  console.log('🧪 Running ZTools Integrity Tests...');

  // 1. Check Tool Configs
  const featuresDir = path.join(SRC_DIR, 'features');
  if (fs.existsSync(featuresDir)) {
    const features = fs.readdirSync(featuresDir);
    for (const feature of features) {
      const toolYaml = path.join(featuresDir, feature, 'tool.yaml');
      if (!fs.existsSync(toolYaml)) {
        logError(`Feature "${feature}" is missing tool.yaml`);
        continue;
      }

      try {
        const config = yaml.load(fs.readFileSync(toolYaml, 'utf8'));
        const required = ['id', 'category', 'translationKey'];

        // Legacy support: 'wid' can be used instead of 'id'
        if (config.wid && !config.id) config.id = config.wid;

        required.forEach(key => {
          if (!config[key]) logError(`Tool "${feature}" config missing required key: ${key}`);
        });
      } catch (e) {
        logError(`Failed to parse tool.yaml for "${feature}": ${e.message}`);
      }
    }
  }

  // 2. Check Build Output (if exists)
  if (fs.existsSync(DIST_DIR)) {
    console.log(`🔍 Checking build output in ${DIST_DIR}...`);

    const checkFiles = (dir) => {
      const items = fs.readdirSync(dir);
      for (const item of items) {
        const fullPath = path.join(dir, item);
        if (fs.statSync(fullPath).isDirectory()) {
          checkFiles(fullPath);
        } else if (item.endsWith('.html')) {
          const content = fs.readFileSync(fullPath, 'utf8');

          // Check for unrendered EJS tags
          if (content.includes('<%=')) {
            logError(`Unrendered EJS tag found in ${path.relative(DIST_DIR, fullPath)}`);
          }

          // Check for common error indicators (optional/heuristic)
          // Look for t('...') patterns that didn't get replaced if t() helper failed
          // Note: our t() returns the key if missing, so we'd see "nav.title" etc.
          // This is harder to detect without a list of all valid keys.
        }
      }
    };

    checkFiles(DIST_DIR);
  } else {
    console.warn('⚠️ DIST_DIR not found. Run "npm run build:dev" before testing.');
  }

  console.log('\n--- Result ---');
  if (errors.length === 0) {
    console.log('✅ All integrity tests passed!');
    process.exit(0);
  } else {
    console.log(`💥 Found ${errors.length} error(s).`);
    process.exit(1);
  }
}

runTests();
