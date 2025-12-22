# 🧪 UI Testing Tool

Automated visual and i18n testing tool for ZTools.

## Features

✅ **Automated Screenshot Testing**
- Desktop screenshots (1400x900)
- Mobile screenshots (375x667)
- Full-page captures

✅ **i18n Validation**
- Detects missing translation keys
- Finds untranslated text
- Reports visible translation placeholders

✅ **CSS Issue Detection**
- Horizontal overflow detection
- Elements outside viewport
- Low contrast warnings

✅ **Console Error Tracking**
- JavaScript errors
- Page errors
- Runtime warnings

✅ **Beautiful HTML Report**
- Visual comparison (desktop vs mobile)
- Issue categorization
- Severity levels (error/warning/info)

## Usage

### 1. Build the site first
```bash
npm run build:dev
```

### 2. Start dev server
```bash
npm run dev
```

### 3. Run UI tests (in another terminal)
```bash
npm run test:ui
```

### 4. View report
```bash
open ui-test-results/report.html
```

## Configuration

Edit `scripts/ui-test.js` to customize:

```javascript
const CONFIG = {
  baseUrl: 'http://localhost:3000',  // Test server URL
  sitemapPath: './dist-dev/sitemap.xml',  // Sitemap location
  outputDir: './ui-test-results',  // Output directory
  viewport: {
    width: 1400,
    height: 900
  },
  mobileViewport: {
    width: 375,
    height: 667
  }
};
```

## Output Structure

```
ui-test-results/
├── report.html              # Main HTML report
└── screenshots/
    ├── home_desktop.png
    ├── home_mobile.png
    ├── vi_tax_desktop.png
    ├── vi_tax_mobile.png
    └── ...
```

## Report Features

### Summary Dashboard
- Total pages tested
- Passed/Failed/Warning counts
- Quick overview

### Per-Page Details
- URL and status
- Desktop & Mobile screenshots side-by-side
- Detected issues with details
- Severity indicators

### Issue Types

**🔴 Errors (Critical)**
- Missing translations (i18n keys visible)
- Console JavaScript errors
- Page load failures

**🟡 Warnings**
- Horizontal overflow
- Elements outside viewport
- Layout issues

**🔵 Info**
- Low contrast warnings
- Performance hints

## Integration with CI/CD

Add to your CI pipeline:

```yaml
# .github/workflows/ui-test.yml
- name: Build site
  run: npm run build:dev

- name: Start server
  run: npm run dev &
  
- name: Wait for server
  run: sleep 5

- name: Run UI tests
  run: npm run test:ui

- name: Upload report
  uses: actions/upload-artifact@v3
  with:
    name: ui-test-report
    path: ui-test-results/
```

## Tips

### Test Specific Pages
Modify the script to filter URLs:

```javascript
const urls = await readSitemap();
const filteredUrls = urls.filter(url => url.includes('/vi/'));
```

### Adjust Timeouts
For slow pages:

```javascript
await page.goto(url, { 
  waitUntil: 'networkidle0', 
  timeout: 60000  // 60 seconds
});
```

### Custom Checks
Add your own validation:

```javascript
const customCheck = await page.evaluate(() => {
  // Your custom validation logic
  return {
    hasLogo: !!document.querySelector('.logo'),
    hasFooter: !!document.querySelector('footer')
  };
});
```

## Troubleshooting

### "Cannot find module 'puppeteer'"
```bash
npm install -D puppeteer xml2js
```

### "Sitemap not found"
Make sure you've built the site first:
```bash
npm run build:dev
```

### "Connection refused"
Ensure dev server is running:
```bash
npm run dev
```

### Screenshots are blank
Increase wait time:
```javascript
await page.waitForTimeout(2000);  // Wait 2 seconds
```

## Advanced Usage

### Compare with Production
```javascript
const CONFIG = {
  baseUrl: 'https://ztools.site',  // Production URL
  // ...
};
```

### Test Dark Mode
```javascript
await page.emulateMediaFeatures([
  { name: 'prefers-color-scheme', value: 'dark' }
]);
```

### Performance Metrics
```javascript
const metrics = await page.metrics();
console.log('Performance:', metrics);
```

## Contributing

To add new checks:

1. Add detection function in `scripts/ui-test.js`
2. Call it in `testPage()`
3. Add results to `pageResult.issues`
4. Update report template if needed

---

**Last Updated**: 2025-12-19  
**Version**: 1.0.0
