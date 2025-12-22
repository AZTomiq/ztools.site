const input = document.getElementById('taskInput');
const btn = document.getElementById('addBtn');
const list = document.getElementById('taskList');

btn.addEventListener('click', () => {
  const text = input.value;
  if (!text) return;

  const li = document.createElement('li');
  li.innerHTML = `<span>${text}</span> <button onclick="this.parentElement.remove()">❌</button>`;
  list.appendChild(li);

  input.value = '';
  console.log('Task added:', text);
});
