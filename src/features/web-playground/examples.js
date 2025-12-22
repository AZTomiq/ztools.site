/**
 * ZTools Playground Examples Library
 * This file contains the source code for the examples shown in the sidebar.
 * It is loaded before the main script.js
 */

window.PLAYGROUND_EXAMPLES = [
  {
    id: 'glassmorphism',
    title: '✨ Glassmorphism',
    html: `<!DOCTYPE html>
<html>
<body>
<div class="container">
    <div class="card">
        <div class="content">
            <h2>Glassmorphism</h2>
            <p>A modern UI trend focusing on frosting glass effect.</p>
            <a href="#">Read More</a>
        </div>
    </div>
</div>
</body>
</html>`,
    css: `body {
display: flex;
justify-content: center;
align-items: center;
min-height: 100vh;
background: #161623;
}

.container {
position: relative;
display: flex;
justify-content: center;
align-items: center;
}

.card {
position: relative;
width: 280px;
height: 400px;
margin: 30px;
box-shadow: 20px 20px 50px rgba(0,0,0,0.5);
border-radius: 15px;
background: rgba(255,255,255,0.1);
overflow: hidden;
display: flex;
justify-content: center;
align-items: center;
border-top: 1px solid rgba(255,255,255,0.5);
border-left: 1px solid rgba(255,255,255,0.5);
backdrop-filter: blur(5px);
}

.content {
padding: 20px;
text-align: center;
color: #fff;
}

.content h2 {
font-size: 2em;
margin-bottom: 10px;
}

.content a {
display: inline-block;
padding: 8px 20px;
margin-top: 15px;
background: #fff;
color: #000;
border-radius: 20px;
text-decoration: none;
font-weight: 500;
}`,
    js: `// Interact with the card
const card = document.querySelector('.card');
card.addEventListener('mousemove', (e) => {
// Add cool tilt effect here if desired
console.log('Mouse at', e.clientX, e.clientY);
})`
  },
  {
    id: 'todo',
    title: '📝 Simple Todo List',
    html: `<div class="app">
<h1>My Tasks</h1>
<div class="input-group">
<input type="text" id="taskInput" placeholder="Add a new task...">
<button id="addBtn">Add</button>
</div>
<ul id="taskList"></ul>
</div>`,
    css: `body {
font-family: 'Segoe UI', sans-serif;
background: #f0f2f5;
display: flex;
justify-content: center;
padding-top: 50px;
}
.app {
background: white;
padding: 2rem;
border-radius: 12px;
box-shadow: 0 4px 6px -1px rgba(0,0,0,0.1);
width: 350px;
}
h1 { margin-top: 0; color: #1a1a1a; }
.input-group { display: flex; gap: 10px; margin-bottom: 20px; }
input {
flex: 1;
padding: 8px;
border: 1px solid #ddd;
border-radius: 4px;
}
button {
background: #0891b2;
color: white;
border: none;
padding: 8px 16px;
border-radius: 4px;
cursor: pointer;
}
button:hover { background: #0e7490; }
ul { list-style: none; padding: 0; }
li {
padding: 10px;
border-bottom: 1px solid #eee;
display: flex;
justify-content: space-between;
}
li button {
background: #ef4444; 
padding: 4px 8px; 
font-size: 0.8rem;
}`,
    js: `const input = document.getElementById('taskInput');
const btn = document.getElementById('addBtn');
const list = document.getElementById('taskList');

btn.addEventListener('click', () => {
const text = input.value;
if(!text) return;

const li = document.createElement('li');
li.innerHTML = \`<span>\${text}</span> <button onclick="this.parentElement.remove()">❌</button>\`;
list.appendChild(li);

input.value = '';
console.log('Task added:', text);
});`
  },
  {
    id: 'clock',
    title: '⏰ Analog Clock',
    html: `<div class="clock">
<div class="hand hour" id="hour"></div>
<div class="hand minute" id="minute"></div>
<div class="hand second" id="second"></div>
</div>`,
    css: `body {
background: #282c34;
display: flex;
justify-content: center;
align-items: center;
height: 100vh;
}
.clock {
width: 200px;
height: 200px;
border: 10px solid #fff;
border-radius: 50%;
position: relative;
background: rgba(255,255,255,0.1);
}
.hand {
position: absolute;
bottom: 50%;
left: 50%;
transform-origin: bottom;
background: white;
border-radius: 4px;
}
.hour { width: 6px; height: 60px; margin-left: -3px; background: #61dafb; }
.minute { width: 4px; height: 80px; margin-left: -2px; }
.second { width: 2px; height: 90px; margin-left: -1px; background: #ff4757; }`,
    js: `function updateClock() {
const now = new Date();

const sec = now.getSeconds();
const min = now.getMinutes();
const hour = now.getHours();

const secDeg = ((sec / 60) * 360);
const minDeg = ((min / 60) * 360) + ((sec/60)*6);
const hourDeg = ((hour / 12) * 360) + ((min/60)*30);

document.getElementById('second').style.transform = \`rotate(\${secDeg}deg)\`;
document.getElementById('minute').style.transform = \`rotate(\${minDeg}deg)\`;
document.getElementById('hour').style.transform = \`rotate(\${hourDeg}deg)\`;
}

setInterval(updateClock, 1000);
updateClock();
console.log('Clock started');`
  },
  {
    id: 'voting',
    title: '⭐ Voting & Polls',
    html: `<div class="card feedback-card">
  <h2>Product Feedback</h2>
  <p>What do you think about our new feature?</p>
  
  <!-- Star Rating Section -->
  <div class="rating-section">
      <div class="stars" id="star-container">
          <span class="star" data-value="1">★</span>
          <span class="star" data-value="2">★</span>
          <span class="star" data-value="3">★</span>
          <span class="star" data-value="4">★</span>
          <span class="star" data-value="5">★</span>
      </div>
      <div class="rating-text" id="rating-text">Rate us!</div>
  </div>

  <hr>

  <!-- Poll Section -->
  <h3>Quick Poll: Favorite Framework?</h3>
  <div class="poll-options">
      <div class="option" onclick="vote('react')">
          <div class="label-row">
              <span>React</span>
              <span id="pct-react">40%</span>
          </div>
          <div class="bar-bg"><div class="bar" id="bar-react" style="width: 40%"></div></div>
      </div>
      <div class="option" onclick="vote('vue')">
          <div class="label-row">
              <span>Vue</span>
              <span id="pct-vue">35%</span>
          </div>
          <div class="bar-bg"><div class="bar" id="bar-vue" style="width: 35%"></div></div>
      </div>
      <div class="option" onclick="vote('svelte')">
          <div class="label-row">
              <span>Svelte</span>
              <span id="pct-svelte">25%</span>
          </div>
          <div class="bar-bg"><div class="bar" id="bar-svelte" style="width: 25%"></div></div>
      </div>
  </div>
</div>`,
    css: `body {
  font-family: 'Inter', system-ui, sans-serif;
  background: #111827; /* Dark bg */
  color: #e5e7eb;
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  margin: 0;
}

.card {
  background: #1f2937;
  padding: 2rem;
  border-radius: 12px;
  width: 380px;
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.5);
  border: 1px solid #374151;
}

h2 { margin-top: 0; color: #60a5fa; }
h3 { font-size: 1rem; color: #9ca3af; margin-bottom: 1rem; }
p { color: #d1d5db; }
hr { border: 0; border-top: 1px solid #374151; margin: 1.5rem 0; }

/* Star Rating */
.rating-section {
    text-align: center;
    margin-bottom: 1rem;
}
.stars {
    font-size: 2.5rem;
    cursor: pointer;
    color: #4b5563; /* Inactive color */
}
.star {
    transition: color 0.2s, transform 0.1s;
    display: inline-block;
}
.star:hover {
    transform: scale(1.2);
}
.star.active {
    color: #fbbf24; /* Gold */
    text-shadow: 0 0 10px rgba(251, 191, 36, 0.5);
}
.rating-text {
    margin-top: 0.5rem;
    font-weight: 600;
    color: #fbbf24;
    height: 1.5em; 
}

/* Poll Bars */
.option {
    margin-bottom: 1rem;
    cursor: pointer;
    transition: opacity 0.2s;
}
.option:hover { opacity: 0.9; }

.label-row {
    display: flex;
    justify-content: space-between;
    font-size: 0.9rem;
    margin-bottom: 0.25rem;
}

.bar-bg {
    height: 8px;
    background: #374151;
    border-radius: 4px;
    overflow: hidden;
}

.bar {
    height: 100%;
    border-radius: 4px;
    transition: width 0.5s ease-out;
}

#bar-react { background: #61dafb; }
#bar-vue { background: #42b883; }
#bar-svelte { background: #ff3e00; }`,
    js: `// --- Star Rating Logic ---
const stars = document.querySelectorAll('.star');
const ratingText = document.getElementById('rating-text');
const messages = ['Terrible 😭', 'Bad 😞', 'Okay 😐', 'Good 🙂', 'Amazing! 🤩'];

stars.forEach(star => {
    // Hover Effect
    star.addEventListener('mouseenter', () => {
        const val = parseInt(star.dataset.value);
        highlightStars(val);
        ratingText.textContent = messages[val - 1]; 
    });
    
    // Click Effect
    star.addEventListener('click', () => {
        const val = parseInt(star.dataset.value);
        // Persist selection (visually) by adding a class to container
        document.getElementById('star-container').dataset.rating = val;
        console.log(\`User rated: \${val} stars (\${messages[val-1]})\`);
    });
});

// Reset on mouse leave if not clicked
document.getElementById('star-container').addEventListener('mouseleave', () => {
    const saved = parseInt(document.getElementById('star-container').dataset.rating) || 0;
    highlightStars(saved);
    ratingText.textContent = saved ? messages[saved - 1] : 'Rate us!';
});

function highlightStars(count) {
    stars.forEach(s => {
        const val = parseInt(s.dataset.value);
        if (val <= count) s.classList.add('active');
        else s.classList.remove('active');
    });
}

// --- Poll Logic ---
let votes = { react: 40, vue: 35, svelte: 25 };

function vote(tech) {
    votes[tech] += 5; // increment
    const total = votes.react + votes.vue + votes.svelte;
    
    // Update all bars
    Object.keys(votes).forEach(key => {
        const pct = Math.round((votes[key] / total) * 100);
        document.getElementById(\`bar-\${key}\`).style.width = \`\${pct}%\`;
        document.getElementById(\`pct-\${key}\`).textContent = \`\${pct}%\`;
    });
    
    console.log(\`Voted for \${tech}\`);
}
`
  },
  {
    id: 'css-i18n',
    title: '🌍 CSS-only i18n',
    html: `<div class="container" lang="en">
<div class="lang-switch">
<button onclick="setLang('en')">🇺🇸 English</button>
<button onclick="setLang('vi')">🇻🇳 Tiếng Việt</button>
<button onclick="setLang('jp')">🇯🇵 日本語</button>
</div>

<div class="card">
<h1 class="greeting"></h1>
<p class="description"></p>
<button class="cta"></button>
</div>
</div>`,
    css: `/* Dictionary Definitions using CSS Variables */
:root {
--txt-hello: "Hello World";
--txt-desc: "Welcome to our website.";
--txt-cta: "Get Started";
}

/* Vietnamese Overrides */
:lang(vi) {
--txt-hello: "Xin Chào";
--txt-desc: "Chào mừng đến với website của chúng tôi.";
--txt-cta: "Bắt Đầu Ngay";
}

/* Japanese Overrides */
:lang(jp) {
--txt-hello: "こんにちは";
--txt-desc: "私たちのウェブサイトへようこそ。";
--txt-cta: "始めましょう";
}

/* Applying Content */
.greeting::before { content: var(--txt-hello); }
.description::before { content: var(--txt-desc); }
.cta::before { content: var(--txt-cta); }

/* Basic Styling */
body {
font-family: sans-serif;
background: #f0f4f8;
display: flex;
justify-content: center;
align-items: center;
height: 100vh;
}
.card {
background: white;
padding: 2rem;
border-radius: 12px;
text-align: center;
box-shadow: 0 4px 12px rgba(0,0,0,0.1);
}
.lang-switch { margin-bottom: 2rem; }
button {
cursor: pointer;
padding: 5px 10px;
margin: 0 5px;
border: 1px solid #ddd;
background: white;
border-radius: 4px;
}
.cta {
background: #2563eb;
color: white;
border: none;
padding: 10px 20px;
font-weight: bold;
margin-top: 1rem;
}`,
    js: `function setLang(code) {
// Just change the lang attribute on the container
// CSS handles the text replacement! 🤯
document.querySelector('.container').setAttribute('lang', code);
console.log('Language switched to:', code);
}`
  }
];
