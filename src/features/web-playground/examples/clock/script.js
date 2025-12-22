function updateClock() {
const now = new Date();

const sec = now.getSeconds();
const min = now.getMinutes();
const hour = now.getHours();

const secDeg = ((sec / 60) * 360);
const minDeg = ((min / 60) * 360) + ((sec/60)*6);
const hourDeg = ((hour / 12) * 360) + ((min/60)*30);

document.getElementById('second').style.transform = `rotate(${secDeg}deg)`;
document.getElementById('minute').style.transform = `rotate(${minDeg}deg)`;
document.getElementById('hour').style.transform = `rotate(${hourDeg}deg)`;
}

setInterval(updateClock, 1000);
updateClock();
console.log('Clock started');