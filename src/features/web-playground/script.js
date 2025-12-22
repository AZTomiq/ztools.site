document.addEventListener('DOMContentLoaded', () => {
  // UI References
  const runBtn = document.getElementById('btn-run');
  const autoRunToggle = document.getElementById('auto-run-toggle');
  const toggleConsoleBtn = document.getElementById('toggle-console');
  const clearConsoleBtn = document.getElementById('clear-console');
  const consolePane = document.getElementById('console-pane');
  const consoleLogs = document.getElementById('console-logs');
  const iframe = document.getElementById('preview-frame');

  // Sidebar Refs
  const sidebar = document.getElementById('sidebar-examples');
  const toggleSidebarBtn = document.getElementById('toggle-sidebar');
  const examplesList = document.getElementById('examples-list');

  // Initialize Sidebar Buttons
  if (examplesList && window.PLAYGROUND_EXAMPLES) {
    window.PLAYGROUND_EXAMPLES.forEach(ex => {
      const div = document.createElement('div');
      div.className = 'example-item';
      div.textContent = ex.title;
      div.onclick = () => loadExample(ex);
      examplesList.appendChild(div);
    });
  }

  if (toggleSidebarBtn && sidebar) {
    toggleSidebarBtn.addEventListener('click', () => {
      sidebar.classList.toggle('collapsed');
    });

    // Mobile auto-collapse logic if needed
  }

  function loadExample(ex) {
    // Confirm only if user has modified code (basic check can be added later)
    // For now, simple confirm
    if (confirm(`Load example "${ex.title}"?\nYour current code will be replaced.`)) {
      if (editorHtml) editorHtml.setValue(ex.html);
      if (editorCss) editorCss.setValue(ex.css);
      if (editorJs) editorJs.setValue(ex.js);

      // On mobile, close sidebar after pick
      if (window.innerWidth <= 768) {
        sidebar.classList.add('collapsed');
      }
    }
  }

  // Default Content
  const defaultHtml = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>ZTools Playground</title>
  <style>
    body { font-family: sans-serif; padding: 20px; }
    h1 { color: #0891b2; }
  </style>
</head>
<body>
  <h1>Hello World, Welcome to your ZTools Playground 👋</h1>
  <p>Start coding with auto-complete!</p>
  <button id="click-me">Click Me</button>
  
  <div id="result"></div>
</body>
</html>`;

  const defaultCss = `/* Custom Styles */
button {
  padding: 8px 16px;
  background: #0891b2;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

button:hover {
  background: #0e7490;
}`;

  const defaultJs = `// JavaScript Logic
document.getElementById('click-me').addEventListener('click', () => {
  const result = document.getElementById('result');
  result.innerHTML = '<p>✨ Button clicked at ' + new Date().toLocaleTimeString() + '</p>';
  console.log('Button was clicked!');
});`;

  let editorHtml, editorCss, editorJs;
  let autoRunTimer = null;

  // Load Monaco
  require.config({ paths: { 'vs': 'https://cdnjs.cloudflare.com/ajax/libs/monaco-editor/0.45.0/min/vs' } });

  require(['vs/editor/editor.main'], function () {

    // Theme config
    monaco.editor.defineTheme('ztools-dark', {
      base: 'vs-dark',
      inherit: true,
      rules: [],
      colors: {
        'editor.background': '#1e1e1e',
      }
    });

    const editorOptions = {
      theme: 'ztools-dark',
      minimap: { enabled: false },
      fontSize: 14,
      padding: { top: 10 },
      automaticLayout: true,
      tabSize: 2
    };

    // Check URL for shared data
    let initialHtml = defaultHtml;
    let initialCss = defaultCss;
    let initialJs = defaultJs;

    const hash = window.location.hash;
    if (hash && hash.startsWith('#code=')) {
      try {
        const encoded = hash.substring(6); // Remove #code=
        const decompressed = LZString.decompressFromEncodedURIComponent(encoded);
        if (decompressed) {
          const data = JSON.parse(decompressed);
          initialHtml = data.html || '';
          initialCss = data.css || '';
          initialJs = data.js || '';
          console.log('✅ Loaded shared code from URL');
        }
      } catch (e) {
        console.error('Failed to load code from URL', e);
      }
    }

    // Init HTML Editor
    editorHtml = monaco.editor.create(document.getElementById('monaco-html'), {
      ...editorOptions,
      value: initialHtml,
      language: 'html'
    });

    // Init CSS Editor
    editorCss = monaco.editor.create(document.getElementById('monaco-css'), {
      ...editorOptions,
      value: initialCss,
      language: 'css'
    });

    // Init JS Editor
    editorJs = monaco.editor.create(document.getElementById('monaco-js'), {
      ...editorOptions,
      value: initialJs,
      language: 'javascript'
    });

    // Hook Change Events for Auto-Run
    const handleChange = () => {
      // Store simple state in localStorage if desired (Phase 5 enhancement), for now just auto-run
      if (autoRunToggle.checked) {
        clearTimeout(autoRunTimer);
        autoRunTimer = setTimeout(updatePreview, 1000); // Debounce 1s
      }
    };

    editorHtml.onDidChangeModelContent(handleChange);
    editorCss.onDidChangeModelContent(handleChange);
    editorJs.onDidChangeModelContent(handleChange);

    // Initial Run
    updatePreview();

    // Bind Ctrl+S
    const saveAction = () => {
      updatePreview();
      runBtn.innerText = 'running...';
      setTimeout(() => runBtn.innerText = '▶ Run', 500);
    };

    editorHtml.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyS, saveAction);
    editorCss.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyS, saveAction);
    editorJs.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyS, saveAction);
  });

  // Run Button Logic
  if (runBtn) {
    runBtn.addEventListener('click', () => {
      updatePreview();
    });
  }

  // Share Button Logic
  const shareBtn = document.getElementById('btn-share');
  if (shareBtn) {
    shareBtn.addEventListener('click', () => {
      if (!editorHtml || !editorCss || !editorJs) return;

      const data = {
        html: editorHtml.getValue(),
        css: editorCss.getValue(),
        js: editorJs.getValue()
      };

      try {
        const json = JSON.stringify(data);
        const compressed = LZString.compressToEncodedURIComponent(json);
        const url = `${window.location.origin}${window.location.pathname}#code=${compressed}`;

        navigator.clipboard.writeText(url).then(() => {
          const originalText = shareBtn.innerText;
          shareBtn.innerText = '✅ Copied!';
          setTimeout(() => shareBtn.innerText = originalText, 2000);
        });

        // Also update URL bar without reload
        window.history.replaceState(null, null, `#code=${compressed}`);

      } catch (e) {
        console.error('Share failed', e);
        alert('Sharing failed. Code might be too large.');
      }
    });
  }

  // Console UI Logic
  if (toggleConsoleBtn) {
    toggleConsoleBtn.addEventListener('click', () => {
      consolePane.classList.toggle('collapsed');
    });
  }

  if (clearConsoleBtn) {
    clearConsoleBtn.addEventListener('click', () => {
      consoleLogs.innerHTML = '';
    });
  }

  function addLog(type, args) {
    const div = document.createElement('div');
    div.className = `log-entry log-${type}`;

    const text = args.map(arg => {
      if (typeof arg === 'object') return JSON.stringify(arg);
      return String(arg);
    }).join(' ');

    div.textContent = `[${type}] ${text}`;
    consoleLogs.appendChild(div);
    consoleLogs.scrollTop = consoleLogs.scrollHeight;
  }

  function updatePreview() {
    if (!editorHtml || !editorCss || !editorJs) return;

    const html = editorHtml.getValue();
    const css = editorCss.getValue();
    const js = editorJs.getValue();

    // Prepare Console Hijack Script
    const consoleProxyScript = `
            <script>
                (function(){
                    const oldLog = console.log;
                    const oldWarn = console.warn;
                    const oldError = console.error;
                    const oldInfo = console.info;

                    function send(type, args) {
                        try {
                            window.parent.postMessage({
                                type: 'console',
                                level: type,
                                args: Array.from(args)
                            }, '*');
                        } catch(e) {}
                    }

                    console.log = function(...args) { oldLog.apply(console, args); send('info', args); };
                    console.warn = function(...args) { oldWarn.apply(console, args); send('warn', args); };
                    console.error = function(...args) { oldError.apply(console, args); send('error', args); };
                    console.info = function(...args) { oldInfo.apply(console, args); send('info', args); };
                })();
            <\/script>
        `;

    // Simple logic for examples without full HTML structure
    let finalHtml = html;
    if (!finalHtml.includes('<html>')) {
      finalHtml = `<html><body>${html}</body></html>`; // Wrap simple fragments
    }

    // Inject CSS
    if (finalHtml.includes('</head>')) {
      finalHtml = finalHtml.replace('</head>', `<style>${css}</style>${consoleProxyScript}</head>`);
    } else {
      // Lazy fallback
      finalHtml += `<style>${css}</style>${consoleProxyScript}`;
    }

    // Inject JS (Safe wrap)
    if (finalHtml.includes('</body>')) {
      finalHtml = finalHtml.replace('</body>', `<script>${js}<\/script></body>`);
    } else {
      finalHtml += `<script>${js}<\/script>`;
    }

    const blob = new Blob([finalHtml], { type: 'text/html' });
    const url = URL.createObjectURL(blob);

    iframe.src = url;
  }

  // Listen for messages from iframe console
  window.addEventListener('message', (event) => {
    if (event.data && event.data.type === 'console') {
      addLog(event.data.level, event.data.args);
    }
  });
});
