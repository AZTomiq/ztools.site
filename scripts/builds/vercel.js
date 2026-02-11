const fs = require('fs-extra');
const path = require('path');
const yaml = require('js-yaml');

const ROOT_DIR = path.join(__dirname, '../..');
const SUBDOMAINS_PATH = path.join(ROOT_DIR, 'src/data/subdomains.yaml');
const VERCEL_JSON_PATH = path.join(ROOT_DIR, 'vercel.json');

async function generateVercelConfig() {
  console.log('🛠️ Generating vercel.json from subdomains.yaml...');

  try {
    const subdomainsData = yaml.load(await fs.readFile(SUBDOMAINS_PATH, 'utf8'));
    const subdomains = subdomainsData.subdomains || [];

    const config = {
      cleanUrls: true,
      trailingSlash: true,
      redirects: [],
      rewrites: []
    };

    // 1. Static Rewrites (Assets, SEO, etc.)
    const staticRewrites = [
      { source: '/assets/:path*', destination: '/assets/:path*' },
      { source: '/sw.js', destination: '/sw.js' },
      { source: '/manifest.json', destination: '/manifest.json' },
      { source: '/sitemap.xml', destination: '/sitemap.xml' },
      { source: '/robots.txt', destination: '/robots.txt' },
      { source: '/favicon.ico', destination: '/favicon.ico' }
    ];

    // 2. Base Subdomain Root Rewrites (Optimization for flat files)
    const baseSubdomainRewrites = [
      {
        source: '/en/',
        has: [{ type: 'host', value: '(?<subdom>.*)' }],
        destination: '/subdom-en-:subdom.html'
      },
      {
        source: '/',
        has: [{ type: 'host', value: '(?<subdom>.*)' }],
        destination: '/subdom-:subdom.html'
      }
    ];

    config.rewrites.push(...staticRewrites);
    config.rewrites.push(...baseSubdomainRewrites);

    // 3. Dynamic Redirects & Rewrites from subdomains.yaml
    subdomains.forEach(item => {
      const { domain, path: toolPath } = item;
      const cleanPath = toolPath.replace(/^\/|\/$/g, ''); // e.g. "tax"

      // Add redirects from satellite domains to main subdomain
      if (domain.endsWith('iztools.xyz')) {
        const subdomainPrefix = domain.replace('.iztools.xyz', '');

        // Redirect from iztools.xyz subdomains
        config.redirects.push({
          source: '/:path*',
          has: [{ type: 'host', value: `${subdomainPrefix}.iztools.xyz` }],
          destination: `https://${domain}/:path*`,
          permanent: true
        });

        // Redirect from eztools.site subdomains (if they exist/future-proof)
        config.redirects.push({
          source: '/:path*',
          has: [{ type: 'host', value: `${subdomainPrefix}.eztools.site` }],
          destination: `https://${domain}/:path*`,
          permanent: true
        });
      }

      // Add Subdomain Rewrites
      // English version
      config.rewrites.push({
        source: '/en/:path*',
        has: [{ type: 'host', value: domain }],
        destination: `/en/${cleanPath}/:path*`
      });

      // Default version (VI)
      config.rewrites.push({
        source: '/:path*',
        has: [{ type: 'host', value: domain }],
        destination: `/${cleanPath}/:path*`
      });
    });

    // 4. Global Satellite Root Redirects
    const satelliteDomains = ['iztools.xyz', 'eztools.site'];
    satelliteDomains.forEach(sat => {
      config.redirects.push({
        source: '/:path*',
        has: [{ type: 'host', value: sat }],
        destination: `https://iztools.xyz/:path*`,
        permanent: true
      });
      // Also handle www if needed (optional but good)
      config.redirects.push({
        source: '/:path*',
        has: [{ type: 'host', value: `www.${sat}` }],
        destination: `https://iztools.xyz/:path*`,
        permanent: true
      });
    });

    await fs.writeJson(VERCEL_JSON_PATH, config, { spaces: 2 });
    console.log('✅ Successfully generated vercel.json');

  } catch (error) {
    console.error('❌ Error generating vercel.json:', error);
    process.exit(1);
  }
}

if (require.main === module) {
  generateVercelConfig();
}

module.exports = { generateVercelConfig };
