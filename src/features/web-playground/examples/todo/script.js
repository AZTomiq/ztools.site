let todos = JSON.parse(localStorage.getItem('playground_todos')) || [];
let currentFilter = 'all';

const input = document.getElementById('taskInput');
const addBtn = document.getElementById('addBtn');
const taskList = document.getElementById('taskList');
const stats = document.getElementById('task-stats');
const filterBtns = document.querySelectorAll('.filter-btn');
const clearBtn = document.getElementById('clearCompleted');

function save() {
  localStorage.setItem('playground_todos', JSON.stringify(todos));
  render();
}

function addTodo() {
  const text = input.value.trim();
  if (!text) return;

  todos.push({
    id: Date.now(),
    text: text,
    completed: false
  });

  input.value = '';
  save();
  console.log('Task added:', text);
}

function toggleTodo(id) {
  todos = todos.map(t => t.id === id ? { ...t, completed: !t.completed } : t);
  save();
}

function deleteTodo(id) {
  todos = todos.filter(t => t.id !== id);
  save();
}

function render() {
  taskList.innerHTML = '';

  const filtered = todos.filter(t => {
    if (currentFilter === 'active') return !t.completed;
    if (currentFilter === 'completed') return t.completed;
    return true;
  });

  filtered.forEach(todo => {
    const li = document.createElement('li');
    li.className = `task-item ${todo.completed ? 'completed' : ''}`;
    li.innerHTML = `
      <div class="task-checkbox" onclick="toggleTodo(${todo.id})"></div>
      <span class="task-text">${todo.text}</span>
      <button class="delete-btn" onclick="deleteTodo(${todo.id})">
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
      </button>
    `;
    taskList.appendChild(li);
  });

  const remaining = todos.filter(t => !t.completed).length;
  stats.textContent = `${remaining} task${remaining !== 1 ? 's' : ''} remaining`;
}

// Events
addBtn.onclick = addTodo;
input.onkeypress = (e) => e.key === 'Enter' && addTodo();

filterBtns.forEach(btn => {
  btn.onclick = () => {
    filterBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    currentFilter = btn.dataset.filter;
    render();
  };
});

clearBtn.onclick = () => {
  todos = todos.filter(t => !t.completed);
  save();
};

// Initial Render
render();
console.log('Todo App Initialized with', todos.length, 'items');