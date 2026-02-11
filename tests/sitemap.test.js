
import { describe, it, expect } from 'vitest';
import fs from 'fs-extra';
import path from 'path';
import xml2js from 'xml2js';

const DIST_DIR = path.resolve(__dirname, '../dist');
const SITEMAP_PATH = path.join(DIST_DIR, 'sitemap.xml');

describe('Sitemap Integrity', () => {
  it('should exist', () => {
    expect(fs.existsSync(SITEMAP_PATH)).toBe(true);
  });

  it('should generate clean URLs for subdomains', async () => {
    if (!fs.existsSync(SITEMAP_PATH)) return;

    const xml = await fs.readFile(SITEMAP_PATH, 'utf-8');
    const parser = new xml2js.Parser();
    const result = await parser.parseStringPromise(xml);
    const urls = result.urlset.url.map(u => u.loc[0].trim());

    // 1. Blog Subdomain (blog.ph4n4n.xyz)
    // Should NOT contain /blog/ after the domain
    const blogUrls = urls.filter(u => u.includes('blog.ph4n4n.xyz'));
    expect(blogUrls.length).toBeGreaterThan(0);
    blogUrls.forEach(url => {
      const pathPart = url.replace('https://blog.ph4n4n.xyz', '');
      // Allow /en/blog/ if that's the structure? No, clean URL means /en/post
      // Wait, did we clean localized URLs? 
      // Dist sitemap showed: https://blog.ph4n4n.xyz/en/
      // It did NOT show https://blog.ph4n4n.xyz/en/blog/
      // So pathPart should not contain /blog/
      expect(pathPart).not.toMatch(/\/blog\//);
      // Also check strictly against being exactly /blog/ (unlikely if trailing slash used)
      expect(pathPart).not.toBe('/blog/');
    });

    // 2. Roadmap Subdomain (roadmap.ph4n4n.xyz)
    const roadmapUrls = urls.filter(u => u.includes('roadmap.ph4n4n.xyz'));
    expect(roadmapUrls.length).toBeGreaterThan(0);
    roadmapUrls.forEach(url => {
      const pathPart = url.replace('https://roadmap.ph4n4n.xyz', '');
      expect(pathPart).not.toMatch(/\/roadmap\//);
      expect(pathPart).not.toBe('/roadmap/');
    });

    // 3. Playground Subdomain (playground.iztools.xyz)
    // Original path: /web-playground/
    const playgroundUrls = urls.filter(u => u.includes('playground.iztools.xyz'));
    expect(playgroundUrls.length).toBeGreaterThan(0);
    playgroundUrls.forEach(url => {
      const pathPart = url.replace('https://playground.iztools.xyz', '');
      expect(pathPart).not.toMatch(/\/web-playground\//);
      expect(pathPart).not.toBe('/web-playground/');
    });

    // 4. Compound Interest (laikep.iztools.xyz)
    // Original path: /compound-interest/
    const laikepUrls = urls.filter(u => u.includes('laikep.iztools.xyz'));
    expect(laikepUrls.length).toBeGreaterThan(0);
    laikepUrls.forEach(url => {
      const pathPart = url.replace('https://laikep.iztools.xyz', '');
      expect(pathPart).not.toMatch(/\/compound-interest\//);
    });
  });
});
