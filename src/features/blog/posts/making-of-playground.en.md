---
title: "Behind the Scenes: Building zTool Playground without a Database"
date: Dec 22, 2025
tag: Tech Deep Dive
readTime: 5 min read
slug: making-of-playground
relatedTool: web-playground
---

<p>Driven by an idea, I always wanted a place to quickly test HTML/CSS/JS ideas without opening VS Code, creating files, or setting up a server. Using Codepen or JSFiddle is great, but they are too heavy for "instant" needs. And more importantly: <strong>I wanted to own it, I wanted a unique way to share impressive short demos with a full personal touch.</strong></p>

<img src="https://i.imgur.com/placeholer-playground.png" alt="Playground Preview" style="background:#333; height: 300px; display:flex; align-items:center; justify-content:center; color:#666;" />

<h2>Challenge 1: A Real Editor on the Web</h2>
<p>Using <code>textarea</code> was too "basic". I needed syntax highlighting and auto-complete. The solution? <strong>Monaco Editor</strong> - the heart of VS Code. However, integrating Monaco into an SSG (Static Site Generator) environment was a small nightmare involving loading Worker files. I had to use a CDN trick and manual <code>require.config</code> configuration.</p>

<h2>Challenge 2: Running Code Safely</h2>
<p>Allowing users to run JS code directly in their browser is a major security risk. The solution? <strong>Iframe Sandbox</strong>. We create an iframe, inject the code into <code>srcdoc</code>, and isolate it using the <code>sandbox="allow-scripts"</code> attribute. It's like putting a tiger in a glass cage.</p>

<h2>Challenge 3: Database-less Sharing (My favorite part) 😎</h2>
<p>How do you finish coding, click Share, send the link to a friend, and have my server not consume a single byte of storage?</p>

<p>The answer is: <strong>URL Hash & LZ-String</strong>.</p>

<ul>
    <li>Step 1: Get all HTML/CSS/JS code.</li>
    <li>Step 2: Bundle them into a JSON object.</li>
    <li>Step 3: Compress that JSON string using the LZW algorithm (via <code>lz-string</code> library).</li>
    <li>Step 4: Append the compressed string after the <code>#</code> in the URL.</li>
</ul>

<pre><code>// Demo Logic
const data = JSON.stringify({ html, css, js });
const compressed = LZString.compressToEncodedURIComponent(data);
window.location.hash = 'code=' + compressed;</code></pre>

<p>The result is a slightly long link, but it contains <strong>your entire</strong> source code. The server knows nothing. Absolute privacy. Absolutely free.</p>

<h2>Conclusion & Experience</h2>
<p>Sometimes, the best solution isn't the most complex technology (like Docker or Microservices), but the smartest one. <strong>zTool Playground</strong> is proof that you can build powerful tools with just a Static Web approach.</p>

<div class="card" style="margin: 2rem 0; padding: 1.5rem; background: var(--bg-hover);">
    <h3 style="margin-top: 0;">✨ Featured Examples</h3>
    <p>I've set up a few demos to show you its power:</p>
    <ul>
        <li><a href="/en/web-playground/examples/todo/">👉 <strong>Advanced Todo App</strong></a>: CRUD, Filter, Stats.</li>
        <li><a href="/en/web-playground/examples/bst-visualizer/">🌳 <strong>B-Tree Visualizer</strong></a>: Visualizing data structures.</li>
    </ul>
</div>

<p style="margin-top: 3rem; font-style: italic; border-left: 3px solid #666; padding-left: 1rem;">
    Try it now: <a href="/en/web-playground/" style="color: #61dafb; text-decoration: none;">🚀 Open zTool Playground IDE</a>
</p>
