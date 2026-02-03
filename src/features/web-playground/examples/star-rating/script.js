const scoreVal = document.getElementById('score-val');
const scoreText = document.getElementById('score-text');
const btnSubmit = document.getElementById('btn-submit');
const inputs = document.querySelectorAll('input[name="rating"]');

const messages = {
  0.5: "Absolutely horrible 💀",
  1.0: "Just plain bad 🥱",
  1.5: "Slightly annoying 😕",
  2.0: "Below average 📉",
  2.5: "Getting there... ⚖️",
  3.0: "Solid middle 🆗",
  3.5: "Good effort 👍",
  4.0: "Very satisfied! ✨",
  4.5: "Almost perfect! 🔥",
  5.0: "Pro VIP Excellence! 🌟"
};

inputs.forEach(input => {
  input.addEventListener('change', (e) => {
    const val = e.target.value;
    scoreVal.textContent = parseFloat(val).toFixed(1);
    scoreText.textContent = messages[val] || "Rating processed...";

    // Animate the score
    scoreVal.style.transform = 'scale(1.2)';
    setTimeout(() => {
      scoreVal.style.transform = 'scale(1)';
    }, 200);
  });
});

btnSubmit.addEventListener('click', () => {
  const checked = document.querySelector('input[name="rating"]:checked');
  if (!checked) {
    alert("Please choose a star first!");
    return;
  }

  const val = checked.value;
  btnSubmit.disabled = true;
  btnSubmit.textContent = "Thank You! ❤️";
  btnSubmit.style.background = "#22c55e";
  btnSubmit.style.color = "white";

  console.log("Rating Submitted:", val);
});

// Basic Read-only Logic (as seen in Blog)
function applyRating(val) {
  const el = document.querySelector(`input[value="${val}"]`);
  if (el) el.checked = true;
}

// Start with 4.5
applyRating("4.5");
scoreVal.textContent = "4.5";
scoreText.textContent = messages[4.5];
