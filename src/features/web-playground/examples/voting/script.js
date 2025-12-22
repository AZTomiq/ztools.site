// --- Star Rating Logic ---
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
    console.log(`User rated: ${val} stars (${messages[val - 1]})`);
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
    document.getElementById(`bar-${key}`).style.width = `${pct}%`;
    document.getElementById(`pct-${key}`).textContent = `${pct}%`;
  });

  console.log(`Voted for ${tech}`);
}
