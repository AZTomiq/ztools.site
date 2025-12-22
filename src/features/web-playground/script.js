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

  // Layout & Resizing
  const editorsSplit = document.getElementById('editors-split');
  const previewArea = document.getElementById('preview-area');
  const btnMaximizePreview = document.getElementById('btn-maximize-preview');
  const btnPopout = document.getElementById('btn-popout');
  const resizerV = document.getElementById('resizer-v');
  const resizerH1 = document.getElementById('resizer-h1');
  const resizerH2 = document.getElementById('resizer-h2');
  const paneHtml = document.getElementById('pane-html');
  const paneJs = document.getElementById('pane-js');
  const paneCss = document.getElementById('pane-css');

  // Utility to refresh monaco layout
  const refreshLayout = () => {
    if (editorHtml) editorHtml.layout();
    if (editorCss) editorCss.layout();
    if (editorJs) editorJs.layout();
  };

  // --- VERTICAL RESIZING ---
  let isResizingV = false;
  resizerV.addEventListener('mousedown', (e) => {
    isResizingV = true;
    resizerV.classList.add('active');
    document.body.classList.add('resizing');
    document.body.style.cursor = 'row-resize';
  });

  // --- HORIZONTAL RESIZING ---
  let isResizingH1 = false;
  let isResizingH2 = false;

  resizerH1.addEventListener('mousedown', () => {
    isResizingH1 = true;
    resizerH1.classList.add('active');
    document.body.classList.add('resizing');
    document.body.style.cursor = 'col-resize';
  });
  resizerH2.addEventListener('mousedown', () => {
    isResizingH2 = true;
    resizerH2.classList.add('active');
    document.body.classList.add('resizing');
    document.body.style.cursor = 'col-resize';
  });

  document.addEventListener('mousemove', (e) => {
    if (isResizingV) {
      const containerRect = document.getElementById('work-area').getBoundingClientRect();
      const relativeY = e.clientY - containerRect.top;
      const percentage = (relativeY / containerRect.height) * 100;
      if (percentage > 5 && percentage < 95) {
        editorsSplit.style.flex = 'none';
        previewArea.style.flex = 'none';
        editorsSplit.style.height = `${percentage}%`;
        previewArea.style.height = `${100 - percentage}%`;
        refreshLayout();
      }
    }

    if (isResizingH1 || isResizingH2) {
      const splitRect = editorsSplit.getBoundingClientRect();
      const relativeX = e.clientX - splitRect.left;
      const totalWidth = splitRect.width;

      if (isResizingH1) {
        const p1 = (relativeX / totalWidth) * 100;
        if (p1 > 2 && p1 < 90) {
          paneHtml.style.flex = `0 0 ${p1}%`;
          refreshLayout();
        }
      } else if (isResizingH2) {
        // Find HTML width first
        const htmlRect = paneHtml.getBoundingClientRect();
        const p1 = (htmlRect.width / totalWidth) * 100;
        const p2 = ((relativeX / totalWidth) * 100) - p1;

        if (p2 > 2 && (p1 + p2) < 98) {
          paneJs.style.flex = `0 0 ${p2}%`;
          refreshLayout();
        }
      }
    }
  });

  document.addEventListener('mouseup', () => {
    if (isResizingV || isResizingH1 || isResizingH2) {
      isResizingV = false;
      isResizingH1 = false;
      isResizingH2 = false;
      resizerV.classList.remove('active');
      resizerH1.classList.remove('active');
      resizerH2.classList.remove('active');
      document.body.classList.remove('resizing');
      document.body.style.cursor = 'default';
      refreshLayout();
    }
  });

  // Popout Preview
  if (btnPopout) {
    btnPopout.addEventListener('click', () => {
      const html = editorHtml ? editorHtml.getValue() : '';
      const css = editorCss ? editorCss.getValue() : '';
      const js = editorJs ? editorJs.getValue() : '';

      let finalContent = html;
      if (!finalContent.includes('<html>')) {
        finalContent = `<!DOCTYPE html><html><head><style>${css}</style></head><body>${html}<script>${js}<\/script></body></html>`;
      } else {
        finalContent = finalContent.replace('</head>', `<style>${css}</style></head>`);
        finalContent = finalContent.replace('</body>', `<script>${js}<\/script></body>`);
      }

      const win = window.open();
      win.document.write(finalContent);
      win.document.close();
    });
  }

  // Pane Toggling Logic
  const panes = [paneHtml, paneJs, paneCss];
  panes.forEach(pane => {
    const header = pane.querySelector('.pane-header');
    header.addEventListener('click', (e) => {
      // Don't toggle if clicking a button inside header
      if (e.target.closest('button')) return;

      togglePane(pane);
    });

    const toggleBtn = pane.querySelector('.btn-pane-toggle');
    if (toggleBtn) {
      toggleBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        togglePane(pane);
      });
    }
  });

  function togglePane(pane) {
    const isMinimized = pane.classList.toggle('minimized');
    pane.classList.toggle('active');

    // Update icon
    const toggleBtn = pane.querySelector('.btn-pane-toggle');
    if (toggleBtn) {
      toggleBtn.innerHTML = isMinimized ? '<i data-lucide="plus"></i>' : '<i data-lucide="minus"></i>';
      if (window.lucide) lucide.createIcons();
    }

    refreshLayout();
  }

  if (btnMaximizePreview) {
    btnMaximizePreview.addEventListener('click', () => {
      const isMax = editorsSplit.style.display === 'none';
      if (isMax) {
        editorsSplit.style.display = 'flex';
        resizerV.style.display = 'block';
        previewArea.style.height = '50%';
        btnMaximizePreview.innerHTML = '<i data-lucide="maximize" style="width: 14px; height: 14px;"></i>';
      } else {
        editorsSplit.style.display = 'none';
        resizerV.style.display = 'none';
        previewArea.style.height = '100%';
        btnMaximizePreview.innerHTML = '<i data-lucide="minimize-2" style="width: 14px; height: 14px;"></i>';
      }
      if (window.lucide) lucide.createIcons();
      refreshLayout();
    });
  }

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
      setTimeout(refreshLayout, 310);
    });
  }

  function loadExample(ex) {
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
    body { font-family: sans-serif; padding: 20px; color: #333; height: 100vh; margin:0; display:flex; align-items:center; justify-content:center; background: #f0f2f5; }
    .card { background: #fff; padding: 30px; border-radius: 12px; box-shadow: 0 10px 25px rgba(0,0,0,0.1); text-align:center; max-width: 400px; }
    h1 { color: #0891b2; margin-top:0; }
  </style>
</head>
<body>
  <div class="card">
    <h1>ZTools Playground</h1>
    <p>Now with <b>Resizability</b> and better <b>Pane Share</b>!</p>
    <button id="click-me">Click Me</button>
    <div id="result" style="margin-top: 20px; font-weight: bold; color: #0891b2;"></div>
  </div>
</body>
</html>`;

  const defaultCss = `/* Styles */
button {
  padding: 12px 24px;
  background: #0891b2;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 600;
  transition: all 0.2s;
}

button:hover {
  background: #0e7490;
  transform: translateY(-2px);
  box-shadow: 0 5px 15px rgba(8, 145, 178, 0.3);
}`;

  const defaultJs = `// JS Logic
document.getElementById('click-me').addEventListener('click', () => {
  const result = document.getElementById('result');
  result.innerHTML = '✨ Sparkle! ' + new Date().toLocaleTimeString();
  console.log('Action logged at: ' + new Date().toISOString());
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
      tabSize: 2,
      fontFamily: 'Monaco, monospace'
    };

    // Check URL for shared data
    let initialHtml = defaultHtml;
    let initialCss = defaultCss;
    let initialJs = defaultJs;

    const hash = window.location.hash;
    if (hash && hash.startsWith('#code=')) {
      try {
        const encoded = hash.substring(6);
        const decompressed = LZString.decompressFromEncodedURIComponent(encoded);
        if (decompressed) {
          const data = JSON.parse(decompressed);
          initialHtml = data.html || '';
          initialCss = data.css || '';
          initialJs = data.js || '';

          // Apply active states if provided
          if (data.active) {
            const activeIds = data.active.split(',');
            activeIds.forEach(id => {
              const el = document.getElementById(`pane-${id}`);
              if (el) {
                el.classList.add('active');
                el.classList.remove('minimized');
              }
            });
            // Minimize others
            ['html', 'css', 'js'].forEach(id => {
              if (!activeIds.includes(id)) {
                const el = document.getElementById(`pane-${id}`);
                if (el) {
                  el.classList.add('minimized');
                  el.classList.remove('active');
                }
              }
            });
          }
        }
      } catch (e) { }
    }

    // Init Editors
    editorHtml = monaco.editor.create(document.getElementById('monaco-html'), {
      ...editorOptions,
      value: initialHtml,
      language: 'html'
    });

    editorCss = monaco.editor.create(document.getElementById('monaco-css'), {
      ...editorOptions,
      value: initialCss,
      language: 'css'
    });

    editorJs = monaco.editor.create(document.getElementById('monaco-js'), {
      ...editorOptions,
      value: initialJs,
      language: 'javascript'
    });

    // Hook Change Events for Auto-Run
    const handleChange = () => {
      if (autoRunToggle.checked) {
        clearTimeout(autoRunTimer);
        autoRunTimer = setTimeout(updatePreview, 1000);
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

      const activePanes = [];
      if (!paneHtml.classList.contains('minimized')) activePanes.push('html');
      if (!paneJs.classList.contains('minimized')) activePanes.push('js');
      if (!paneCss.classList.contains('minimized')) activePanes.push('css');

      const data = {
        html: editorHtml.getValue(),
        css: editorCss.getValue(),
        js: editorJs.getValue(),
        active: activePanes.join(',')
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

        window.history.replaceState(null, null, `#code=${compressed}`);
      } catch (e) {
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
    div.style.color = type === 'error' ? '#ff5f56' : (type === 'warn' ? '#ffbd2e' : '#888');

    const text = args.map(arg => {
      if (typeof arg === 'object') return JSON.stringify(arg);
      return String(arg);
    }).join(' ');

    div.textContent = `> ${text}`;
    consoleLogs.appendChild(div);
    consoleLogs.scrollTop = consoleLogs.scrollHeight;
  }

  function updatePreview() {
    if (!editorHtml || !editorCss || !editorJs) return;

    const html = editorHtml.getValue();
    const css = editorCss.getValue();
    const js = editorJs.getValue();

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

    let finalHtml = html;
    if (!finalHtml.includes('<html>')) {
      finalHtml = `<html><head><style>${css}</style>${consoleProxyScript}</head><body>${html}<script>${js}<\/script></body></html>`;
    } else {
      if (finalHtml.includes('</head>')) {
        finalHtml = finalHtml.replace('</head>', `<style>${css}</style>${consoleProxyScript}</head>`);
      } else {
        finalHtml = finalHtml.replace('<html>', `<html><head><style>${css}</style>${consoleProxyScript}</head>`);
      }

      if (finalHtml.includes('</body>')) {
        finalHtml = finalHtml.replace('</body>', `<script>${js}<\/script></body>`);
      } else {
        finalHtml = finalHtml.replace('</html>', `<script>${js}<\/script></html>`);
      }
    }

    const blob = new Blob([finalHtml], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    iframe.src = url;
  }

  window.addEventListener('message', (event) => {
    if (event.data && event.data.type === 'console') {
      addLog(event.data.level, event.data.args);
    }
  });
});
