const STORAGE_KEY = "todo_tasks";

let tasks = loadTasks();

function loadTasks() {
  const data = localStorage.getItem(STORAGE_KEY);
  return data ? JSON.parse(data) : [];
}

function saveToLocalStorage() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
}

function openModal() {
  document.getElementById("modal").style.display = "block";
}

function closeModal() {
  document.getElementById("modal").style.display = "none";
}

function saveTask() {
  const title = document.getElementById("title").value.trim();
  const desc = document.getElementById("description").value.trim();
  const time = Number(document.getElementById("time").value);

  if (!title || !time) {
    alert("Please enter Title and Time");
    return;
  }

  const task = {
    id: Date.now(),
    title,
    desc,
    time,
    spent: 0,
    status: "todo"
  };

  tasks.push(task);
  saveToLocalStorage();

  document.getElementById("title").value = "";
  document.getElementById("description").value = "";
  document.getElementById("time").value = "";

  closeModal();
  render();
}

function render() {
  document.getElementById("todoList").innerHTML = "";
  document.getElementById("progressList").innerHTML = "";
  document.getElementById("doneList").innerHTML = "";

  tasks.forEach(task => {
    if (task.status === "todo") renderTodo(task);
    if (task.status === "progress") renderProgress(task);
    if (task.status === "done") renderDone(task);
  });
}

function renderTodo(task) {
  const div = document.createElement("div");
  div.className = "task";
  div.innerHTML = `
    <strong>${task.title}</strong><br>
    <small>${task.time} hrs • Uncompleted</small>
    <div class="task-actions">
      <button onclick="showDetails(${task.id})">View</button>
      <button onclick="moveToProgress(${task.id})">Start</button>
      <button onclick="deleteTask(${task.id})">Delete</button>
    </div>
  `;
  document.getElementById("todoList").appendChild(div);
}

function renderProgress(task) {
  let percent = Math.round((task.spent / task.time) * 100);

  // Clamp percentage (IMPORTANT FIX)
  if (percent > 100) percent = 100;
  if (percent < 0) percent = 0;

  let colorClass = "green";
  if (percent > 50 && percent <= 75) colorClass = "yellow";
  if (percent > 75) colorClass = "red";

  const div = document.createElement("div");
  div.className = `task ${colorClass}`;
  div.innerHTML = `
    <strong>${task.title}</strong><br>
    <small>${percent}% completed</small>
    <div class="task-actions">
      <button onclick="markDone(${task.id})">Done</button>
    </div>
  `;
  document.getElementById("progressList").appendChild(div);
}

function renderDone(task) {
  const div = document.createElement("div");
  div.className = "task";
  div.innerHTML = `
    <strong>${task.title}</strong><br>
    <small>Completed</small>
    <div class="task-actions">
      <button onclick="undoTask(${task.id})">Undo</button>
    </div>
  `;
  document.getElementById("doneList").appendChild(div);
}

function moveToProgress(id) {
  const task = findTask(id);

  if (task.spent === 0) {
    task.spent = task.time; // 100% once
  }

  task.status = "progress";
  saveToLocalStorage();
  render();
}

function markDone(id) {
  const task = findTask(id);
  task.status = "done";
  saveToLocalStorage();
  render();
}

function undoTask(id) {
  const task = findTask(id);
  task.status = "todo";
  task.spent = 0; // reset progress
  saveToLocalStorage();
  render();
}

function deleteTask(id) {
  tasks = tasks.filter(t => t.id !== id);
  saveToLocalStorage();
  render();
}

function showDetails(id) {
  const task = findTask(id);
  alert(
    `Title: ${task.title}\n\nDescription: ${task.desc}\n\nTime: ${task.time} hrs\nStatus: ${task.status}`
  );
}

function findTask(id) {
  return tasks.find(t => t.id === id);
}

function viewTasks() {
  alert(`Total Tasks: ${tasks.length}`);
}

render();
