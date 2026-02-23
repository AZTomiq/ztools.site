let qrInstance = null;

function generateQR() {
  const text = document.getElementById('qr-input').value.trim();
  const size = parseInt(document.getElementById('qr-size').value) || 256;
  const level = document.getElementById('qr-level').value;
  const container = document.getElementById('qrcode');

  container.innerHTML = '';

  qrInstance = new QRCode(container, {
    text: text || ' ',
    width: size,
    height: size,
    colorDark: "#000000",
    colorLight: "#ffffff",
    correctLevel: QRCode.CorrectLevel[level]
  });
}

function downloadQR() {
  const img = document.querySelector('#qrcode img');
  if (!img) return;

  const link = document.createElement('a');
  link.download = `iZTools-qr-${Date.now()}.png`;
  link.href = img.src;
  link.click();
}

document.addEventListener('DOMContentLoaded', () => {
  generateQR();

  // Auto update on enter for input
  document.getElementById('qr-input').addEventListener('keypress', (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      generateQR();
    }
  });
});
