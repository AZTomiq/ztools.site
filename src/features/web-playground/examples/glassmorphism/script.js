// Interact with the card
const card = document.querySelector('.card');
card.addEventListener('mousemove', (e) => {
  // Add cool tilt effect here if desired
  console.log('Mouse at', e.clientX, e.clientY);
})
