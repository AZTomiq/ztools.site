---
title: "Zero to Hero: Puppeteer - Web Automation & Scraping"
date: 2025-06-26T09:00:08.000Z
tags: [headless-browser, nodejs, puppeteer, scraping, testing, web-automation, zero-to-hero]
categories: [Web Automation, Testing, Node.js]
---

# Zero to Hero: Puppeteer - Web Automation & Scraping

Puppeteer là một Node.js library cung cấp high-level API để điều khiển Chrome/Chromium thông qua DevTools Protocol. Đây là công cụ mạnh mẽ cho web automation, testing, scraping, và generating screenshots/PDFs.

## 1\. Giới thiệu và khái niệm cơ bản

### Puppeteer là gì?

Puppeteer là một Node.js library cho phép:

*   **Browser Automation**: Điều khiển Chrome/Chromium programmatically
*   **Web Scraping**: Extract data từ websites
*   **Screenshot & PDF**: Generate screenshots và PDF từ web pages
*   **Testing**: Automated testing cho web applications
*   **Performance Monitoring**: Monitor website performance
*   **SEO Analysis**: Analyze SEO metrics

### Core Concepts:

*   **Browser**: Instance của Chrome/Chromium browser
*   **Page**: Tab trong browser để navigate và interact
*   **Element**: DOM elements trên page
*   **Selector**: CSS selectors để find elements
*   **Event**: Browser events (load, click, etc.)
*   **Network**: Network requests và responses

### Use Cases:

*   **Web Scraping**: Extract data từ e-commerce sites
*   **Testing**: E2E testing cho web applications
*   **Screenshots**: Generate screenshots cho documentation
*   **PDF Generation**: Convert web pages to PDF
*   **Performance Testing**: Monitor website performance
*   **SEO Tools**: Analyze SEO metrics

## 2\. Cài đặt và setup môi trường

### Puppeteer Installation

```bash
# Basic installation
npm install puppeteer

# Installation without Chromium (use system Chrome)
npm install puppeteer-core

# Development dependencies
npm install puppeteer --save-dev
```

### Environment Setup

```javascript
// Basic setup
const puppeteer = require('puppeteer');

// Launch browser
const browser = await puppeteer.launch({
  headless: false, // Show browser window
  slowMo: 100,     // Slow down operations
  defaultViewport: { width: 1280, height: 720 }
});

// Create new page
const page = await browser.newPage();

// Navigate to URL
await page.goto('https://example.com');

// Close browser
await browser.close();
```

### Docker Setup

```dockerfile
# Dockerfile for Puppeteer
FROM node:18-slim

# Install dependencies
RUN apt-get update && apt-get install -y \
    wget \
    gnupg \
    ca-certificates \
    procps \
    libxss1 \
    && wget -q -O - https://dl-ssl.google.com/linux/linux_signing_key.pub | apt-key add - \
    && sh -c 'echo "deb [arch=amd64] http://dl.google.com/linux/chrome/deb/ stable main" >> /etc/apt/sources.list.d/google.list' \
    && apt-get update \
    && apt-get install -y google-chrome-stable fonts-ipafont-gothic fonts-wqy-zenhei fonts-thai-tlwg fonts-kacst fonts-freefont-ttf libxss1 \
    --no-install-recommends \
    && rm -rf /var/lib/apt/lists/*

# Create app directory
WORKDIR /usr/src/app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci --only=production

# Copy app source
COPY . .

# Create user to run as non-root
RUN groupadd -r pptruser && useradd -r -g pptruser -G audio,video pptruser \
    && mkdir -p /home/pptruser/Downloads \
    && chown -R pptruser:pptruser /home/pptruser \
    && chown -R pptruser:pptruser /usr/src/app

# Run everything after as non-privileged user
USER pptruser

# Expose port
EXPOSE 3000

# Start app
CMD ["node", "app.js"]
```

### Docker Compose Setup

```yaml
# docker-compose.yml
version: '3.8'

services:
  puppeteer-app:
    build: .
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=production
    volumes:
      - ./screenshots:/app/screenshots
      - ./pdfs:/app/pdfs
    security_opt:
      - seccomp:unconfined
    cap_add:
      - SYS_ADMIN
```

## 3\. Cú pháp và cấu trúc cơ bản

### Browser Launch Options

```javascript
// Browser launch configuration
const browser = await puppeteer.launch({
  // Display options
  headless: false,           // Show browser window
  headless: 'new',          // New headless mode (Chrome 109+)
  
  // Window options
  defaultViewport: {
    width: 1920,
    height: 1080
  },
  args: [
    '--no-sandbox',
    '--disable-setuid-sandbox',
    '--disable-dev-shm-usage',
    '--disable-accelerated-2d-canvas',
    '--no-first-run',
    '--no-zygote',
    '--disable-gpu'
  ],
  
  // Performance options
  slowMo: 100,              // Slow down operations
  timeout: 30000,           // Default timeout
  
  // Security options
  ignoreHTTPSErrors: true,
  ignoreDefaultArgs: ['--disable-extensions'],
  
  // User data
  userDataDir: './user-data',
  
  // Executable path
  executablePath: '/usr/bin/google-chrome-stable'
});
```

### Page Navigation

```javascript
// Basic navigation
const page = await browser.newPage();

// Navigate to URL
await page.goto('https://example.com', {
  waitUntil: 'networkidle0',  // Wait until network is idle
  timeout: 30000
});

// Navigate with options
await page.goto('https://example.com', {
  waitUntil: ['load', 'domcontentloaded', 'networkidle0'],
  timeout: 30000
});

// Wait for specific element
await page.waitForSelector('.content-loaded');

// Wait for network idle
await page.waitForNetworkIdle({ timeout: 5000 });

// Go back/forward
await page.goBack();
await page.goForward();

// Reload page
await page.reload({ waitUntil: 'networkidle0' });
```

### Element Interaction

```javascript
// Click elements
await page.click('.button');
await page.click('#submit-btn');

// Click with options
await page.click('.button', {
  button: 'right',        // Right click
  clickCount: 2,          // Double click
  delay: 100              // Delay between clicks
});

// Type text
await page.type('#username', 'myusername');
await page.type('#password', 'mypassword');

// Type with options
await page.type('#search', 'search term', {
  delay: 100              // Delay between characters
});

// Clear and type
await page.click('#input');
await page.keyboard.down('Control');
await page.keyboard.press('KeyA');
await page.keyboard.up('Control');
await page.type('#input', 'new text');

// Select dropdown
await page.select('#country', 'US');
await page.select('#fruits', ['apple', 'banana']); // Multiple select
```

### Element Selection

```javascript
// Different selector types
const element = await page.$('.class-name');           // CSS selector
const element = await page.$('#id-name');              // ID selector
const element = await page.$('input[name="username"]'); // Attribute selector
const element = await page.$('div > p');               // Child selector

// Multiple elements
const elements = await page.$$('.item');

// XPath selectors
const element = await page.$x('//div[@class="content"]');
const elements = await page.$x('//li[@class="item"]');

// Complex selectors
const element = await page.$('div.container > p:first-child');
const element = await page.$('input[type="text"][required]');

// Wait for element
await page.waitForSelector('.dynamic-content');
await page.waitForSelector('.hidden', { visible: true });
await page.waitForSelector('.removed', { hidden: true });
```

## 4\. Các tính năng nâng cao

### Screenshots và PDFs

```javascript
// Take screenshot
await page.screenshot({
  path: 'screenshot.png',
  fullPage: true,
  quality: 80,
  type: 'png'
});

// Screenshot specific element
const element = await page.$('.content');
await element.screenshot({
  path: 'element-screenshot.png'
});

// Screenshot with custom viewport
await page.setViewport({ width: 1920, height: 1080 });
await page.screenshot({
  path: 'desktop-screenshot.png'
});

// Generate PDF
await page.pdf({
  path: 'page.pdf',
  format: 'A4',
  printBackground: true,
  margin: {
    top: '20px',
    right: '20px',
    bottom: '20px',
    left: '20px'
  }
});

// PDF with custom options
await page.pdf({
  path: 'custom.pdf',
  format: 'Letter',
  landscape: true,
  displayHeaderFooter: true,
  headerTemplate: '<div>Header</div>',
  footerTemplate: '<div>Footer</div>',
  preferCSSPageSize: true
});
```

### Network Interception

```javascript
// Intercept network requests
await page.setRequestInterception(true);

page.on('request', (request) => {
  // Block images
  if (request.resourceType() === 'image') {
    request.abort();
  }
  // Modify headers
  else if (request.resourceType() === 'stylesheet') {
    request.continue({
      headers: {
        ...request.headers(),
        'X-Custom-Header': 'value'
      }
    });
  }
  // Continue other requests
  else {
    request.continue();
  }
});

// Intercept responses
page.on('response', async (response) => {
  if (response.url().includes('api/data')) {
    const data = await response.json();
    console.log('API Response:', data);
  }
});

// Mock API responses
await page.setRequestInterception(true);

page.on('request', (request) => {
  if (request.url().includes('api/users')) {
    request.respond({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify([
        { id: 1, name: 'John' },
        { id: 2, name: 'Jane' }
      ])
    });
  } else {
    request.continue();
  }
});
```

### Performance Monitoring

```javascript
// Enable performance monitoring
const client = await page.target().createCDPSession();
await client.send('Performance.enable');

// Get performance metrics
const metrics = await page.metrics();
console.log('Performance metrics:', metrics);

// Get timing information
const timing = await page.evaluate(() => {
  const navigation = performance.getEntriesByType('navigation')[0];
  return {
    domContentLoaded: navigation.domContentLoadedEventEnd - navigation.domContentLoadedEventStart,
    loadComplete: navigation.loadEventEnd - navigation.loadEventStart,
    domInteractive: navigation.domInteractive,
    redirectCount: navigation.redirectCount
  };
});

// Monitor memory usage
const memoryInfo = await page.evaluate(() => {
  return {
    usedJSHeapSize: performance.memory.usedJSHeapSize,
    totalJSHeapSize: performance.memory.totalJSHeapSize,
    jsHeapSizeLimit: performance.memory.jsHeapSizeLimit
  };
});

// Track page load time
const startTime = Date.now();
await page.goto('https://example.com');
const loadTime = Date.now() - startTime;
console.log(`Page loaded in ${loadTime}ms`);
```

### File Upload và Download

```javascript
// File upload
const [fileChooser] = await Promise.all([
  page.waitForFileChooser(),
  page.click('#upload-button')
]);

await fileChooser.accept(['./file1.pdf', './file2.jpg']);

// Multiple file upload
const [fileChooser] = await Promise.all([
  page.waitForFileChooser(),
  page.click('#upload-multiple')
]);

await fileChooser.accept([
  './file1.pdf',
  './file2.jpg',
  './file3.txt'
]);

// File download
const client = await page.target().createCDPSession();
await client.send('Page.setDownloadBehavior', {
  behavior: 'allow',
  downloadPath: './downloads'
});

// Click download link
await page.click('#download-link');

// Wait for download to complete
await page.waitForFunction(() => {
  // Check if download is complete
  return document.querySelector('.download-complete');
});
```

## 5\. Best practices và patterns

### Error Handling

```javascript
// Comprehensive error handling
class PuppeteerManager {
  constructor() {
    this.browser = null;
    this.page = null;
  }

  async initialize() {
    try {
      this.browser = await puppeteer.launch({
        headless: 'new',
        args: ['--no-sandbox', '--disable-setuid-sandbox']
      });
      
      this.page = await this.browser.newPage();
      
      // Set default timeout
      this.page.setDefaultTimeout(30000);
      this.page.setDefaultNavigationTimeout(30000);
      
      // Handle page errors
      this.page.on('error', (err) => {
        console.error('Page error:', err);
      });
      
      this.page.on('pageerror', (err) => {
        console.error('Page error:', err);
      });
      
      return true;
    } catch (error) {
      console.error('Initialization failed:', error);
      await this.cleanup();
      throw error;
    }
  }

  async navigateWithRetry(url, maxRetries = 3) {
    for (let i = 0; i < maxRetries; i++) {
      try {
        await this.page.goto(url, {
          waitUntil: 'networkidle0',
          timeout: 30000
        });
        return true;
      } catch (error) {
        console.error(`Navigation attempt ${i + 1} failed:`, error);
        if (i === maxRetries - 1) throw error;
        await this.page.waitForTimeout(2000);
      }
    }
  }

  async safeClick(selector, options = {}) {
    try {
      await this.page.waitForSelector(selector, { timeout: 10000 });
      await this.page.click(selector, options);
      return true;
    } catch (error) {
      console.error(`Failed to click ${selector}:`, error);
      return false;
    }
  }

  async cleanup() {
    if (this.page) {
      await this.page.close();
    }
    if (this.browser) {
      await this.browser.close();
    }
  }
}
```

### Performance Optimization

```javascript
// Performance optimization techniques
class OptimizedPuppeteer {
  constructor() {
    this.browser = null;
    this.page = null;
  }

  async initialize() {
    this.browser = await puppeteer.launch({
      headless: 'new',
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage',
        '--disable-accelerated-2d-canvas',
        '--no-first-run',
        '--no-zygote',
        '--disable-gpu',
        '--disable-background-timer-throttling',
        '--disable-backgrounding-occluded-windows',
        '--disable-renderer-backgrounding'
      ]
    });
    
    this.page = await this.browser.newPage();
    
    // Disable images and CSS for faster loading
    await this.page.setRequestInterception(true);
    this.page.on('request', (request) => {
      if (['image', 'stylesheet', 'font'].includes(request.resourceType())) {
        request.abort();
      } else {
        request.continue();
      }
    });
  }

  async optimizePage() {
    // Disable JavaScript (if not needed)
    await this.page.setJavaScriptEnabled(false);
    
    // Set viewport
    await this.page.setViewport({ width: 1280, height: 720 });
    
    // Disable cache
    await this.page.setCacheEnabled(false);
    
    // Set user agent
    await this.page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36');
  }

  async batchProcess(urls, processor) {
    const results = [];
    const concurrency = 3; // Process 3 pages at a time
    
    for (let i = 0; i < urls.length; i += concurrency) {
      const batch = urls.slice(i, i + concurrency);
      const promises = batch.map(async (url) => {
        const page = await this.browser.newPage();
        try {
          await page.goto(url);
          const result = await processor(page);
          return result;
        } finally {
          await page.close();
        }
      });
      
      const batchResults = await Promise.all(promises);
      results.push(...batchResults);
    }
    
    return results;
  }
}
```

### Memory Management

```javascript
// Memory management
class MemoryOptimizedPuppeteer {
  constructor() {
    this.browser = null;
    this.pages = new Set();
  }

  async createPage() {
    const page = await this.browser.newPage();
    this.pages.add(page);
    
    // Monitor page memory usage
    page.on('close', () => {
      this.pages.delete(page);
    });
    
    return page;
  }

  async cleanupPages() {
    for (const page of this.pages) {
      await page.close();
    }
    this.pages.clear();
  }

  async monitorMemory() {
    const metrics = await this.browser.process().memoryUsage();
    console.log('Memory usage:', {
      rss: Math.round(metrics.rss / 1024 / 1024) + 'MB',
      heapTotal: Math.round(metrics.heapTotal / 1024 / 1024) + 'MB',
      heapUsed: Math.round(metrics.heapUsed / 1024 / 1024) + 'MB',
      external: Math.round(metrics.external / 1024 / 1024) + 'MB'
    });
  }

  async garbageCollect() {
    const client = await this.browser.target().createCDPSession();
    await client.send('HeapProfiler.collectGarbage');
  }
}
```

## 6\. Ví dụ thực tế

### Web Scraping E-commerce

```javascript
// E-commerce scraper
class EcommerceScraper {
  constructor() {
    this.browser = null;
    this.page = null;
  }

  async initialize() {
    this.browser = await puppeteer.launch({
      headless: 'new',
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    this.page = await this.browser.newPage();
  }

  async scrapeProducts(baseUrl, maxPages = 5) {
    const products = [];
    
    for (let pageNum = 1; pageNum <= maxPages; pageNum++) {
      const url = `${baseUrl}?page=${pageNum}`;
      console.log(`Scraping page ${pageNum}: ${url}`);
      
      await this.page.goto(url, { waitUntil: 'networkidle0' });
      
      // Wait for products to load
      await this.page.waitForSelector('.product-item');
      
      // Extract product data
      const pageProducts = await this.page.evaluate(() => {
        const items = document.querySelectorAll('.product-item');
        return Array.from(items).map(item => ({
          title: item.querySelector('.product-title')?.textContent?.trim(),
          price: item.querySelector('.product-price')?.textContent?.trim(),
          image: item.querySelector('.product-image img')?.src,
          url: item.querySelector('a')?.href,
          rating: item.querySelector('.product-rating')?.textContent?.trim()
        }));
      });
      
      products.push(...pageProducts);
      
      // Check if next page exists
      const hasNextPage = await this.page.$('.pagination .next:not(.disabled)');
      if (!hasNextPage) break;
    }
    
    return products;
  }

  async scrapeProductDetails(productUrls) {
    const details = [];
    
    for (const url of productUrls) {
      await this.page.goto(url, { waitUntil: 'networkidle0' });
      
      const productDetail = await this.page.evaluate(() => {
        return {
          title: document.querySelector('.product-title')?.textContent?.trim(),
          price: document.querySelector('.product-price')?.textContent?.trim(),
          description: document.querySelector('.product-description')?.textContent?.trim(),
          specifications: Array.from(document.querySelectorAll('.spec-item')).map(spec => ({
            name: spec.querySelector('.spec-name')?.textContent?.trim(),
            value: spec.querySelector('.spec-value')?.textContent?.trim()
          })),
          images: Array.from(document.querySelectorAll('.product-gallery img')).map(img => img.src),
          availability: document.querySelector('.availability')?.textContent?.trim(),
          reviews: Array.from(document.querySelectorAll('.review-item')).map(review => ({
            author: review.querySelector('.review-author')?.textContent?.trim(),
            rating: review.querySelector('.review-rating')?.textContent?.trim(),
            comment: review.querySelector('.review-comment')?.textContent?.trim(),
            date: review.querySelector('.review-date')?.textContent?.trim()
          }))
        };
      });
      
      details.push(productDetail);
    }
    
    return details;
  }

  async saveToFile(data, filename) {
    const fs = require('fs');
    fs.writeFileSync(filename, JSON.stringify(data, null, 2));
  }

  async cleanup() {
    if (this.browser) {
      await this.browser.close();
    }
  }
}

// Usage
const scraper = new EcommerceScraper();
await scraper.initialize();

const products = await scraper.scrapeProducts('https://example-store.com/products');
await scraper.saveToFile(products, 'products.json');

const productUrls = products.map(p => p.url).slice(0, 10);
const details = await scraper.scrapeProductDetails(productUrls);
await scraper.saveToFile(details, 'product-details.json');

await scraper.cleanup();
```

### Automated Testing

```javascript
// E2E testing with Puppeteer
class E2ETester {
  constructor() {
    this.browser = null;
    this.page = null;
  }

  async initialize() {
    this.browser = await puppeteer.launch({
      headless: 'new',
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    this.page = await this.browser.newPage();
  }

  async testUserRegistration() {
    const testData = {
      username: 'testuser' + Date.now(),
      email: `test${Date.now()}@example.com`,
      password: 'TestPassword123!'
    };

    // Navigate to registration page
    await this.page.goto('http://localhost:3000/register');
    
    // Fill registration form
    await this.page.type('#username', testData.username);
    await this.page.type('#email', testData.email);
    await this.page.type('#password', testData.password);
    await this.page.type('#confirm-password', testData.password);
    
    // Submit form
    await this.page.click('#register-btn');
    
    // Wait for success message
    await this.page.waitForSelector('.success-message');
    
    // Verify success
    const successText = await this.page.$eval('.success-message', el => el.textContent);
    return successText.includes('Registration successful');
  }

  async testUserLogin() {
    const testData = {
      username: 'testuser',
      password: 'TestPassword123!'
    };

    // Navigate to login page
    await this.page.goto('http://localhost:3000/login');
    
    // Fill login form
    await this.page.type('#username', testData.username);
    await this.page.type('#password', testData.password);
    
    // Submit form
    await this.page.click('#login-btn');
    
    // Wait for dashboard
    await this.page.waitForSelector('.dashboard');
    
    // Verify login success
    const dashboardTitle = await this.page.$eval('.dashboard h1', el => el.textContent);
    return dashboardTitle.includes('Welcome');
  }

  async testShoppingCart() {
    // Navigate to products page
    await this.page.goto('http://localhost:3000/products');
    
    // Add first product to cart
    await this.page.click('.product-item:first-child .add-to-cart');
    
    // Wait for cart update
    await this.page.waitForSelector('.cart-count');
    
    // Check cart count
    const cartCount = await this.page.$eval('.cart-count', el => el.textContent);
    const count = parseInt(cartCount);
    
    // Navigate to cart
    await this.page.click('.cart-icon');
    await this.page.waitForSelector('.cart-items');
    
    // Verify item in cart
    const cartItems = await this.page.$$('.cart-item');
    return cartItems.length === count;
  }

  async runAllTests() {
    const results = {
      registration: false,
      login: false,
      shoppingCart: false
    };

    try {
      results.registration = await this.testUserRegistration();
      console.log('Registration test:', results.registration ? 'PASSED' : 'FAILED');
      
      results.login = await this.testUserLogin();
      console.log('Login test:', results.login ? 'PASSED' : 'FAILED');
      
      results.shoppingCart = await this.testShoppingCart();
      console.log('Shopping cart test:', results.shoppingCart ? 'PASSED' : 'FAILED');
      
    } catch (error) {
      console.error('Test failed:', error);
    }

    return results;
  }

  async cleanup() {
    if (this.browser) {
      await this.browser.close();
    }
  }
}

// Usage
const tester = new E2ETester();
await tester.initialize();

const results = await tester.runAllTests();
console.log('Test results:', results);

await tester.cleanup();
```

### PDF Generation

```javascript
// PDF generator for reports
class PDFGenerator {
  constructor() {
    this.browser = null;
  }

  async initialize() {
    this.browser = await puppeteer.launch({
      headless: 'new',
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
  }

  async generateInvoicePDF(invoiceData) {
    const page = await this.browser.newPage();
    
    // Set content
    const html = this.generateInvoiceHTML(invoiceData);
    await page.setContent(html);
    
    // Generate PDF
    const pdf = await page.pdf({
      format: 'A4',
      printBackground: true,
      margin: {
        top: '20px',
        right: '20px',
        bottom: '20px',
        left: '20px'
      }
    });
    
    await page.close();
    return pdf;
  }

  generateInvoiceHTML(data) {
    return `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; margin: 0; padding: 20px; }
            .header { text-align: center; margin-bottom: 30px; }
            .invoice-details { margin-bottom: 20px; }
            .items-table { width: 100%; border-collapse: collapse; margin: 20px 0; }
            .items-table th, .items-table td { border: 1px solid #ddd; padding: 8px; text-align: left; }
            .total { text-align: right; font-weight: bold; margin-top: 20px; }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>INVOICE</h1>
            <p>Invoice #${data.invoiceNumber}</p>
            <p>Date: ${data.date}</p>
          </div>
          
          <div class="invoice-details">
            <p><strong>Bill To:</strong> ${data.customerName}</p>
            <p><strong>Email:</strong> ${data.customerEmail}</p>
          </div>
          
          <table class="items-table">
            <thead>
              <tr>
                <th>Item</th>
                <th>Quantity</th>
                <th>Price</th>
                <th>Total</th>
              </tr>
            </thead>
            <tbody>
              ${data.items.map(item => `
                <tr>
                  <td>${item.name}</td>
                  <td>${item.quantity}</td>
                  <td>$${item.price}</td>
                  <td>$${item.quantity * item.price}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
          
          <div class="total">
            <p>Subtotal: $${data.subtotal}</p>
            <p>Tax: $${data.tax}</p>
            <p>Total: $${data.total}</p>
          </div>
        </body>
      </html>
    `;
  }

  async generateReportPDF(reportData) {
    const page = await this.browser.newPage();
    
    // Navigate to report page
    await page.goto('http://localhost:3000/reports', { waitUntil: 'networkidle0' });
    
    // Wait for report to load
    await page.waitForSelector('.report-content');
    
    // Generate PDF
    const pdf = await page.pdf({
      format: 'A4',
      printBackground: true,
      margin: {
        top: '20px',
        right: '20px',
        bottom: '20px',
        left: '20px'
      }
    });
    
    await page.close();
    return pdf;
  }

  async cleanup() {
    if (this.browser) {
      await this.browser.close();
    }
  }
}

// Usage
const pdfGen = new PDFGenerator();
await pdfGen.initialize();

const invoiceData = {
  invoiceNumber: 'INV-001',
  date: new Date().toLocaleDateString(),
  customerName: 'John Doe',
  customerEmail: 'john@example.com',
  items: [
    { name: 'Product 1', quantity: 2, price: 25.00 },
    { name: 'Product 2', quantity: 1, price: 50.00 }
  ],
  subtotal: 100.00,
  tax: 10.00,
  total: 110.00
};

const pdf = await pdfGen.generateInvoicePDF(invoiceData);
require('fs').writeFileSync('invoice.pdf', pdf);

await pdfGen.cleanup();
```

## 7\. Troubleshooting và tips

### Common Issues

```javascript
// Common issues and solutions
class PuppeteerTroubleshooter {
  async handleTimeoutIssues() {
    // Increase timeouts
    await this.page.setDefaultTimeout(60000);
    await this.page.setDefaultNavigationTimeout(60000);
    
    // Wait for specific conditions
    await this.page.waitForFunction(() => {
      return document.readyState === 'complete';
    }, { timeout: 30000 });
  }

  async handleElementNotFound() {
    // Wait for element with retry
    const maxRetries = 3;
    for (let i = 0; i < maxRetries; i++) {
      try {
        await this.page.waitForSelector('.element', { timeout: 10000 });
        break;
      } catch (error) {
        if (i === maxRetries - 1) throw error;
        await this.page.waitForTimeout(2000);
      }
    }
  }

  async handleNetworkIssues() {
    // Retry navigation
    const maxRetries = 3;
    for (let i = 0; i < maxRetries; i++) {
      try {
        await this.page.goto('https://example.com', {
          waitUntil: 'networkidle0',
          timeout: 30000
        });
        break;
      } catch (error) {
        if (i === maxRetries - 1) throw error;
        console.log(`Navigation attempt ${i + 1} failed, retrying...`);
        await this.page.waitForTimeout(5000);
      }
    }
  }

  async handleMemoryLeaks() {
    // Monitor memory usage
    const metrics = await this.page.metrics();
    console.log('Memory usage:', metrics.JSHeapUsedSize / 1024 / 1024, 'MB');
    
    // Force garbage collection
    const client = await this.page.target().createCDPSession();
    await client.send('HeapProfiler.collectGarbage');
  }
}
```

### Debugging Tips

```javascript
// Debugging techniques
class PuppeteerDebugger {
  async enableDebugMode() {
    // Launch in non-headless mode
    this.browser = await puppeteer.launch({
      headless: false,
      slowMo: 1000,
      devtools: true
    });
    
    this.page = await this.browser.newPage();
    
    // Enable console logging
    this.page.on('console', msg => {
      console.log('Browser console:', msg.text());
    });
    
    // Enable request logging
    this.page.on('request', request => {
      console.log('Request:', request.url());
    });
    
    // Enable response logging
    this.page.on('response', response => {
      console.log('Response:', response.url(), response.status());
    });
  }

  async takeDebugScreenshot(name) {
    await this.page.screenshot({
      path: `debug-${name}-${Date.now()}.png`,
      fullPage: true
    });
  }

  async logPageState() {
    const state = await this.page.evaluate(() => {
      return {
        url: window.location.href,
        title: document.title,
        readyState: document.readyState,
        elements: {
          buttons: document.querySelectorAll('button').length,
          inputs: document.querySelectorAll('input').length,
          links: document.querySelectorAll('a').length
        }
      };
    });
    
    console.log('Page state:', state);
  }
}
```

### Performance Tips

```javascript
// Performance optimization tips
class PerformanceOptimizer {
  async optimizeForSpeed() {
    // Disable unnecessary features
    await this.page.setRequestInterception(true);
    this.page.on('request', (request) => {
      if (['image', 'stylesheet', 'font', 'media'].includes(request.resourceType())) {
        request.abort();
      } else {
        request.continue();
      }
    });
    
    // Disable JavaScript (if not needed)
    await this.page.setJavaScriptEnabled(false);
    
    // Set smaller viewport
    await this.page.setViewport({ width: 800, height: 600 });
  }

  async optimizeForScraping() {
    // Use faster selectors
    // Good: ID selectors
    await this.page.$('#element-id');
    
    // Good: Simple class selectors
    await this.page.$('.simple-class');
    
    // Avoid: Complex selectors
    // await this.page.$('div.container > div.row > div.col-md-6 > p.text-muted');
    
    // Use evaluate for multiple operations
    const data = await this.page.evaluate(() => {
      const items = document.querySelectorAll('.item');
      return Array.from(items).map(item => ({
        title: item.querySelector('.title')?.textContent,
        price: item.querySelector('.price')?.textContent
      }));
    });
  }
}
```

## 8\. Tài liệu tham khảo

### Official Documentation

*   [Puppeteer Documentation](https://pptr.dev/)
*   [Puppeteer API Reference](https://pptr.dev/api/)
*   [Puppeteer Examples](https://github.com/puppeteer/puppeteer/tree/main/examples)

### Learning Resources

*   [Puppeteer Getting Started](https://pptr.dev/getting-started)
*   [Puppeteer Best Practices](https://pptr.dev/best-practices)
*   [Puppeteer Troubleshooting](https://pptr.dev/troubleshooting)

### Tools & Extensions

*   [Puppeteer Recorder](https://github.com/checkly/puppeteer-recorder)
*   [Puppeteer Stealth](https://github.com/berstend/puppeteer-extra/tree/master/packages/puppeteer-extra-plugin-stealth)
*   [Puppeteer Cluster](https://github.com/thomasdondorf/puppeteer-cluster)

### Performance & Monitoring

*   [Puppeteer Performance](https://pptr.dev/best-practices#performance)
*   [Puppeteer Memory Management](https://pptr.dev/best-practices#memory-management)
*   [Puppeteer Debugging](https://pptr.dev/troubleshooting#debugging)

### Security

*   [Puppeteer Security](https://pptr.dev/best-practices#security)
*   [Puppeteer Sandbox](https://pptr.dev/troubleshooting#sandbox)
*   [Puppeteer Permissions](https://pptr.dev/best-practices#permissions)

### Deployment & Operations

*   [Puppeteer Docker](https://pptr.dev/troubleshooting#running-puppeteer-in-docker)
*   [Puppeteer CI/CD](https://pptr.dev/troubleshooting#running-puppeteer-in-ci)
*   [Puppeteer Production](https://pptr.dev/best-practices#production)