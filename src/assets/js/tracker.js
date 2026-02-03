/**
 * zTools Anonymous Tracking System (Secure Proxy)
 */

(function () {
  const toolID = window.currentPath;
  if (!toolID || toolID === 'home') return;

  // Prevent double tracking in same session
  const sessionKey = `tracked_${toolID}`;
  if (sessionStorage.getItem(sessionKey)) return;

  async function trackUsage() {
    try {
      // Call our secure Vercel API instead of Supabase directly
      const response = await fetch('/api/stats', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ tool_id: toolID })
      });

      if (response.ok) {
        sessionStorage.setItem(sessionKey, 'true');

        // Update local usage for personal sorting
        const usage = JSON.parse(localStorage.getItem('ztools_usage') || '{}');
        usage[toolID] = (usage[toolID] || 0) + 1;
        localStorage.setItem('ztools_usage', JSON.stringify(usage));
      }
    } catch (err) {
      // Fail silently
    }
  }

  // Delay tracking slightly
  setTimeout(trackUsage, 2000);
})();
