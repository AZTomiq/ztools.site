document.addEventListener('DOMContentLoaded', async () => {
  const gallery = document.getElementById('meme-gallery');

  // Config for path resolution
  const JSON_PATH = '/assets/features/dev-memes/memes.json';

  try {
    const response = await fetch(JSON_PATH);
    if (!response.ok) throw new Error('Failed to load memes');

    const memes = await response.json();
    renderGallery(memes);
  } catch (error) {
    console.error('Error loading memes:', error);
    gallery.innerHTML = `
            <div class="empty-state">
                <i data-lucide="alert-circle" style="width: 48px; height: 48px; margin-bottom: 1rem; color: var(--text-muted);"></i>
                <h3>Oops!</h3>
                <p>Could not load memes database.</p>
            </div>
        `;
    lucide.createIcons();
  }
});

function renderGallery(memes) {
  const gallery = document.getElementById('meme-gallery');

  if (!memes || memes.length === 0) {
    gallery.innerHTML = `
            <div class="empty-state" style="grid-column: 1 / -1;">
                <i data-lucide="ghost" style="width: 48px; height: 48px; margin-bottom: 1rem; color: var(--text-muted);"></i>
                <h3>No Memes Yet!</h3>
                <p>Our AI Agents are hard at work cooking up some jokes...</p>
                <small class="text-muted">Check back later for fresh content.</small>
            </div>
        `;
    lucide.createIcons();
    return;
  }

  gallery.innerHTML = memes.map(meme => `
        <div class="meme-card">
            <img src="${meme.image}" alt="${meme.title}" class="meme-image" loading="lazy">
            <div class="meme-content">
                <div class="meme-title">${escapeHtml(meme.title)}</div>
                <div class="meme-meta">
                    <span class="badge badge-sm">${meme.tags ? meme.tags[0] : 'meme'}</span>
                </div>
            </div>
        </div>
    `).join('');

  lucide.createIcons();
}

function escapeHtml(text) {
  if (!text) return '';
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}
