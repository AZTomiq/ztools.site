document.addEventListener('DOMContentLoaded', () => {
  const glassPreview = document.getElementById('glass-preview');
  const ctrlBlur = document.getElementById('ctrl-blur');
  const ctrlTransparency = document.getElementById('ctrl-transparency');
  const ctrlSaturation = document.getElementById('ctrl-saturation');
  const ctrlRadius = document.getElementById('ctrl-radius');
  const ctrlColor = document.getElementById('ctrl-color');
  const cssOutput = document.getElementById('css-output');
  const btnCopy = document.getElementById('btn-copy-css');

  // Value displays
  const valBlur = document.getElementById('val-blur');
  const valTransparency = document.getElementById('val-transparency');
  const valSaturation = document.getElementById('val-saturation');
  const valRadius = document.getElementById('val-radius');

  // Safety check
  if (!glassPreview || !ctrlBlur || !ctrlTransparency || !ctrlSaturation || !ctrlRadius || !ctrlColor) {
    console.error('Glassmorphism Generator: Required elements not found');
    return;
  }

  function hexToRgb(hex) {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16)
    } : null;
  }

  function updateGlass() {
    const blur = ctrlBlur.value;
    const transparency = ctrlTransparency.value;
    const saturation = ctrlSaturation.value;
    const radius = ctrlRadius.value;
    const color = ctrlColor.value;

    // Update value displays
    valBlur.textContent = `${blur}px`;
    valTransparency.textContent = transparency;
    valSaturation.textContent = `${saturation}%`;
    valRadius.textContent = `${radius}px`;

    // Convert hex to rgba
    const rgb = hexToRgb(color);
    const rgba = `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${transparency})`;

    // Apply styles to preview
    glassPreview.style.background = rgba;
    glassPreview.style.backdropFilter = `blur(${blur}px) saturate(${saturation}%)`;
    glassPreview.style.webkitBackdropFilter = `blur(${blur}px) saturate(${saturation}%)`;
    glassPreview.style.borderRadius = `${radius}px`;
    glassPreview.style.border = `1px solid rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${transparency / 2})`;

    // Generate CSS code
    const cssCode = `background: ${rgba};
backdrop-filter: blur(${blur}px) saturate(${saturation}%);
-webkit-backdrop-filter: blur(${blur}px) saturate(${saturation}%);
border-radius: ${radius}px;
border: 1px solid rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${(transparency / 2).toFixed(2)});`;

    cssOutput.textContent = cssCode;
  }

  // Event listeners
  ctrlBlur.addEventListener('input', updateGlass);
  ctrlTransparency.addEventListener('input', updateGlass);
  ctrlSaturation.addEventListener('input', updateGlass);
  ctrlRadius.addEventListener('input', updateGlass);
  ctrlColor.addEventListener('input', updateGlass);

  // Copy button
  btnCopy.addEventListener('click', () => {
    navigator.clipboard.writeText(cssOutput.textContent).then(() => {
      const originalHTML = btnCopy.innerHTML;
      btnCopy.innerHTML = '<i data-lucide="check"></i>';
      if (window.lucide) lucide.createIcons();

      setTimeout(() => {
        btnCopy.innerHTML = originalHTML;
        if (window.lucide) lucide.createIcons();
      }, 2000);
    });
  });

  // Example cards click handlers
  document.querySelectorAll('.example-card').forEach((card) => {
    card.addEventListener('click', () => {
      const blur = card.dataset.blur;
      const transparency = card.dataset.transparency;
      const saturation = card.dataset.saturation;
      const radius = card.dataset.radius;
      const color = card.dataset.color;

      ctrlBlur.value = blur;
      ctrlTransparency.value = transparency;
      ctrlSaturation.value = saturation;
      ctrlRadius.value = radius;
      ctrlColor.value = color;
      updateGlass();
    });
  });

  // Initial update
  updateGlass();
});
