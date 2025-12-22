// Tilt Effect Logic
const card = document.querySelector('.glass-card');

document.addEventListener('mousemove', (e) => {
  const xAxis = (window.innerWidth / 2 - e.pageX) / 25;
  const yAxis = (window.innerHeight / 2 - e.pageY) / 25;
  card.style.transform = `rotateY(${xAxis}deg) rotateX(${yAxis}deg)`;
});

console.log('Premium Tilt Glass effect ready! ✨');