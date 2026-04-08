// Get DOM elements
const taskForm = document.getElementById('task-form');
const taskInput = document.getElementById('task-input');
const tasksList = document.getElementById('tasks');
const darkModeToggle = document.getElementById('dark-mode-toggle');

// Load tasks from localStorage
let tasks = JSON.parse(localStorage.getItem('tasks')) || [];

// Current filter
let currentFilter = 'all';

// Dark mode state
let isDarkMode = JSON.parse(localStorage.getItem('darkMode')) || false;

// Render tasks
function renderTasks() {
    tasksList.innerHTML = '';
    let filteredTasks = tasks;
    if (currentFilter === 'completed') {
        filteredTasks = tasks.filter(task => task.completed);
    } else if (currentFilter === 'pending') {
        filteredTasks = tasks.filter(task => !task.completed);
    }
    filteredTasks.forEach(task => {
        const li = document.createElement('li');
        li.className = 'task-item';
        if (task.completed) {
            li.classList.add('completed');
        }
        li.innerHTML = `
            <input type="checkbox" class="task-checkbox" ${task.completed ? 'checked' : ''} data-id="${task.id}">
            <span class="task-text">${task.text}</span>
            <button class="delete-btn" data-id="${task.id}" aria-label="Delete task: ${task.text}">Delete</button>
        `;
        tasksList.appendChild(li);
    });
}

// Add task
function addTask(text) {
    const task = {
        id: Date.now(),
        text: text,
        completed: false
    };
    tasks.push(task);
    saveTasks();
    renderTasks();
    taskInput.value = '';
}

// Delete task
function deleteTask(id) {
    tasks = tasks.filter(task => task.id !== id);
    saveTasks();
    renderTasks();
}

// Toggle task completion
function toggleTask(id) {
    const task = tasks.find(task => task.id === id);
    if (task) {
        task.completed = !task.completed;
        saveTasks();
        renderTasks();
    }
}

// Save tasks to localStorage
function saveTasks() {
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

// Toggle dark mode
function toggleDarkMode() {
    isDarkMode = !isDarkMode;
    document.body.classList.toggle('dark-mode', isDarkMode);
    darkModeToggle.textContent = isDarkMode ? '☀️' : '🌙';
    localStorage.setItem('darkMode', JSON.stringify(isDarkMode));
}

// Apply dark mode on load
document.body.classList.toggle('dark-mode', isDarkMode);
darkModeToggle.textContent = isDarkMode ? '☀️' : '🌙';

// Event listeners
taskForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const text = taskInput.value.trim();
    if (text) {
        addTask(text);
    }
});

tasksList.addEventListener('click', (e) => {
    if (e.target.classList.contains('delete-btn')) {
        const id = parseInt(e.target.dataset.id);
        deleteTask(id);
    } else if (e.target.classList.contains('task-checkbox')) {
        const id = parseInt(e.target.dataset.id);
        toggleTask(id);
    }
});

// Filter event listeners
document.getElementById('show-all').addEventListener('click', () => setFilter('all'));
document.getElementById('show-completed').addEventListener('click', () => setFilter('completed'));
document.getElementById('show-pending').addEventListener('click', () => setFilter('pending'));

// Dark mode toggle event listener
darkModeToggle.addEventListener('click', toggleDarkMode);

// Set filter
function setFilter(filter) {
    currentFilter = filter;
    // Update active class
    document.querySelectorAll('.filters button').forEach(btn => btn.classList.remove('active'));
    document.getElementById(`show-${filter}`).classList.add('active');
    renderTasks();
}

// Initial render
renderTasks();