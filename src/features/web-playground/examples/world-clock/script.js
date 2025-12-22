function updateClocks() {
  const now = new Date();
  const utc = now.getTime() + (now.getTimezoneOffset() * 60000);
  
  const clocks = [
    { id: 'hcm', offset: 7 },
    { id: 'tokyo', offset: 9 },
    { id: 'london', offset: 0 },
    { id: 'ny', offset: -5 }
  ];
  
  clocks.forEach(clock => {
    const cityTime = new Date(utc + (3600000 * clock.offset));
    document.getElementById(`time-${clock.id}`).textContent = cityTime.toLocaleTimeString('en-US', { hour12: false });
    document.getElementById(`date-${clock.id}`).textContent = cityTime.toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' });
  });
}

setInterval(updateClocks, 1000);
updateClocks();