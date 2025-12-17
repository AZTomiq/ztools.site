const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');
const yaml = require('js-yaml');

// Load Config
const globalConfigPath = path.join(__dirname, 'src/data/global.yaml');
let config = {
  build: {
    deploy: {
      branch: 'gh-pages',
      remote: 'origin',
      dist_folder: 'dist'
    }
  }
};

if (fs.existsSync(globalConfigPath)) {
  try {
    const parsed = yaml.load(fs.readFileSync(globalConfigPath, 'utf8'));
    // Merge deeply if needed, but shallow for now is enough for this path
    if (parsed.build && parsed.build.deploy) {
      config.build.deploy = { ...config.build.deploy, ...parsed.build.deploy };
    }
  } catch (e) {
    console.error('⚠️ Could not load global.yaml options, using defaults.');
  }
}

const { branch, remote, dist_folder } = config.build.deploy;

console.log('🚀 Starting Deployment...');
console.log(`📡 Target: ${remote}/${branch}`);
console.log(`📂 Folder: ${dist_folder}`);

try {
  // 1. Build
  console.log('📦 Building Production...');
  execSync('npm run build', { stdio: 'inherit' });

  // 4. Deployment
  const strategy = config.build.deploy.strategy || 'subtree';

  if (strategy === 'init') {
    // Strategy: Init new repo in dist and force push (Good for external repo deploy)
    console.log('☁️  Deploying via git init strategy...');
    const deployDir = path.resolve(__dirname, dist_folder);

    // Commands run inside dist folder
    execSync('git init', { cwd: deployDir, stdio: 'inherit' });
    execSync('git add .', { cwd: deployDir, stdio: 'inherit' });
    execSync('git commit -m "🚀 Deploy"', { cwd: deployDir, stdio: 'inherit' });

    const pushCmd = `git push --force "${remote}" master:${branch}`;
    console.log(`> ${pushCmd}`);
    execSync(pushCmd, { cwd: deployDir, stdio: 'inherit' });

  } else {
    // Strategy: Git Subtree (Good for same-repo gh-pages)
    console.log('☁️  Pushing subtree...');

    // Ensure dist is committed first (subtree needs it)
    try { execSync(`git add ${dist_folder} -f`, { stdio: 'inherit' }); } catch (e) { }
    try { execSync('git commit -m "🚀 Deploy: Update dist"', { stdio: 'inherit' }); } catch (e) { }

    const cmd = `git subtree push --prefix ${dist_folder} ${remote} ${branch}`;
    console.log(`> ${cmd}`);
    execSync(cmd, { stdio: 'inherit' });
  }

  console.log('✅ Deployed Successfully!');

} catch (e) {
  console.error('❌ Deployment Failed:', e.message);
  process.exit(1);
}
