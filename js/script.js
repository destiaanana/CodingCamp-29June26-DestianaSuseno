/* ============================================================
   TO-DO LIFE DASHBOARD — script.js
   Author : @destiaanana
   Stack  : Vanilla JS + LocalStorage (no frameworks)

   Sections:
   1.  LocalStorage Helpers
   2.  Toast Notification
   3.  Mouse Glow Effect (card spotlight)
   4.  Greeting Card  (Clock, Date, Greeting, Custom Name + pencil toggle)
   5.  Focus Timer    (Pomodoro + custom duration + modal alarm)
   6.  Web Audio Alarm (synthesized chime — no external files needed)
   7.  Timer Completion Modal
   8.  To-Do List     (Add, Toggle, Edit, Delete, Duplicate guard)
   9.  Quick Links    (Add, Delete, Persist)
   10. Init
   ============================================================ */

'use strict';

/* ============================================================
   1. LOCAL STORAGE HELPERS
   ============================================================ */

function lsGet(key, defaultValue = null) {
  try {
    const raw = localStorage.getItem(key);
    return raw !== null ? JSON.parse(raw) : defaultValue;
  } catch {
    return defaultValue;
  }
}

function lsSet(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

/* ============================================================
   2. TOAST NOTIFICATION
   ============================================================ */

function showToast(message, durationMs = 3000) {
  let toast = document.getElementById('toast');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'toast';
    toast.className = 'toast';
    document.body.appendChild(toast);
  }
  toast.textContent = message;
  toast.classList.add('show');
  clearTimeout(toast._hideTimer);
  toast._hideTimer = setTimeout(() => toast.classList.remove('show'), durationMs);
}

/* ============================================================
   3. MOUSE GLOW EFFECT — card spotlight
   Tracks cursor within each card and drives a CSS radial-gradient
   spotlight via --mouse-x / --mouse-y custom properties.
   ============================================================ */

function initCardGlow() {
  document.querySelectorAll('.card').forEach(card => {
    card.addEventListener('mousemove', e => {
      const r = card.getBoundingClientRect();
      card.style.setProperty('--mouse-x', `${((e.clientX - r.left) / r.width)  * 100}%`);
      card.style.setProperty('--mouse-y', `${((e.clientY - r.top)  / r.height) * 100}%`);
      card.classList.add('hovered');
    });
    card.addEventListener('mouseleave', () => card.classList.remove('hovered'));
  });
}

/* ============================================================
   4. GREETING CARD
   - Real-time clock (1-second interval)
   - Dynamic greeting phrase by hour
   - Challenge 1: custom name in LocalStorage
   - UX: pencil icon toggle — form hides after save, pencil re-opens it
   ============================================================ */

const clockEl     = document.getElementById('clock');
const dateEl      = document.getElementById('date');
const greetingEl  = document.getElementById('greeting');
const nameInput   = document.getElementById('nameInput');
const saveNameBtn = document.getElementById('saveNameBtn');
const nameFormEl  = document.getElementById('nameForm');

const pad = n => String(n).padStart(2, '0');

function getGreetingPhrase(hour) {
  if (hour >= 5  && hour < 12) return 'Good Morning';
  if (hour >= 12 && hour < 17) return 'Good Afternoon';
  if (hour >= 17 && hour < 21) return 'Good Evening';
  return 'Good Night';
}

function setNameFormVisible(visible) {
  nameFormEl.classList.toggle('hidden',  !visible);
  nameFormEl.classList.toggle('visible',  visible);
  if (visible) { nameInput.focus(); nameInput.select(); }
}

function buildGreeting(phrase, savedName) {
  greetingEl.textContent = '';
  greetingEl.appendChild(
    document.createTextNode(
      savedName ? `${phrase}, ${savedName} 👋` : `${phrase} 👋`
    )
  );

  if (savedName) {
    const pencilBtn = document.createElement('button');
    pencilBtn.className = 'edit-name-btn';
    pencilBtn.title = 'Edit your name';
    pencilBtn.setAttribute('aria-label', 'Edit name');
    pencilBtn.textContent = '✏️';
    pencilBtn.addEventListener('click', () => {
      nameInput.value = savedName;
      setNameFormVisible(true);
    });
    greetingEl.appendChild(pencilBtn);
  }
}

function updateClock() {
  const now = new Date();
  const h = now.getHours();
  clockEl.textContent = `${pad(h)}:${pad(now.getMinutes())}:${pad(now.getSeconds())}`;
  dateEl.textContent = now.toLocaleDateString('en-US', {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
  });
  buildGreeting(getGreetingPhrase(h), lsGet('userName', ''));
}

function initGreeting() {
  const savedName = lsGet('userName', '');
  nameInput.value = savedName;
  setNameFormVisible(!savedName);
  updateClock();
  setInterval(updateClock, 1000);
}

saveNameBtn.addEventListener('click', () => {
  const name = nameInput.value.trim();
  lsSet('userName', name);
  updateClock();
  if (name) {
    setNameFormVisible(false);
    showToast(`Name saved: ${name}`, 2000);
  } else {
    setNameFormVisible(true);
    showToast('Name cleared.', 2000);
  }
});

nameInput.addEventListener('keydown', e => {
  if (e.key === 'Enter') saveNameBtn.click();
});

/* ============================================================
   5. FOCUS TIMER (POMODORO)
   - 25-min default countdown
   - Start / Stop / Reset
   - Preset + custom duration (Challenge 2)
   - On completion → show modal + play alarm
   ============================================================ */

const timerDisplay  = document.getElementById('timerDisplay');
const startBtn      = document.getElementById('startBtn');
const stopBtn       = document.getElementById('stopBtn');
const resetBtn      = document.getElementById('resetBtn');
const customMinutes = document.getElementById('customMinutes');
const setCustomBtn  = document.getElementById('setCustomBtn');
const presetBtns    = document.querySelectorAll('.btn-preset');

let timerDuration = 25 * 60;
let timeRemaining = timerDuration;
let timerInterval = null;
let timerRunning  = false;

function formatTime(totalSeconds) {
  return `${pad(Math.floor(totalSeconds / 60))}:${pad(totalSeconds % 60)}`;
}

function renderTimer() {
  timerDisplay.textContent = formatTime(timeRemaining);
}

function startTimer() {
  if (timerRunning) return;
  timerRunning = true;
  timerInterval = setInterval(() => {
    if (timeRemaining <= 0) {
      clearInterval(timerInterval);
      timerRunning = false;
      renderTimer();
      // 3. Show modal + start alarm instead of a plain toast
      showTimerModal();
      return;
    }
    timeRemaining--;
    renderTimer();
  }, 1000);
}

function stopTimer() {
  if (!timerRunning) return;
  clearInterval(timerInterval);
  timerRunning = false;
}

function resetTimer() {
  stopTimer();
  timeRemaining = timerDuration;
  renderTimer();
}

function setDuration(minutes) {
  const mins = parseInt(minutes, 10);
  if (isNaN(mins) || mins < 1 || mins > 120) {
    showToast('Please enter a duration between 1 and 120 minutes.');
    return;
  }
  stopTimer();
  timerDuration = mins * 60;
  timeRemaining = timerDuration;
  renderTimer();
}

function setActivePreset(minutes) {
  presetBtns.forEach(btn =>
    btn.classList.toggle('active', parseInt(btn.dataset.minutes) === minutes)
  );
}

presetBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    const mins = parseInt(btn.dataset.minutes, 10);
    setDuration(mins);
    setActivePreset(mins);
    customMinutes.value = '';
  });
});

setCustomBtn.addEventListener('click', () => {
  const mins = parseInt(customMinutes.value, 10);
  if (isNaN(mins) || mins < 1 || mins > 120) {
    showToast('Enter a number between 1 and 120.');
    return;
  }
  setDuration(mins);
  setActivePreset(mins);
});

customMinutes.addEventListener('keydown', e => {
  if (e.key === 'Enter') setCustomBtn.click();
});

startBtn.addEventListener('click', startTimer);
stopBtn.addEventListener('click',  stopTimer);
resetBtn.addEventListener('click', resetTimer);

function initTimer() { renderTimer(); }

/* ============================================================
   6. WEB AUDIO ALARM
   Synthesizes a repeating electronic chime using the Web Audio API.
   No external files — always works, never lags.

   Architecture:
   • `startAlarm()` creates an AudioContext and schedules a rhythmic
     pattern of tone bursts that repeats until `stopAlarm()` is called.
   • Each "chime" = a short sine wave burst (attack + release envelope)
     at alternating frequencies, giving a clean hi-lo alarm feel.
   ============================================================ */

let alarmContext = null;   // AudioContext instance
let alarmTimer   = null;   // setInterval that keeps chiming

/**
 * Play one short electronic chime burst.
 * @param {AudioContext} ctx
 * @param {number} freq      - Frequency in Hz
 * @param {number} startTime - AudioContext time to start (seconds)
 * @param {number} duration  - Burst duration in seconds
 */
function scheduleChime(ctx, freq, startTime, duration) {
  const osc  = ctx.createOscillator();
  const gain = ctx.createGain();

  osc.connect(gain);
  gain.connect(ctx.destination);

  osc.type = 'sine';
  osc.frequency.setValueAtTime(freq, startTime);

  // Envelope: quick attack, sustain, fast release
  gain.gain.setValueAtTime(0, startTime);
  gain.gain.linearRampToValueAtTime(0.55, startTime + 0.02);    // attack
  gain.gain.setValueAtTime(0.55, startTime + duration - 0.04);  // sustain
  gain.gain.linearRampToValueAtTime(0, startTime + duration);   // release

  osc.start(startTime);
  osc.stop(startTime + duration);
}

function startAlarm() {
  // Resume or create AudioContext (browsers require user gesture first,
  // which the timer start button provides)
  if (!alarmContext) {
    alarmContext = new (window.AudioContext || window.webkitAudioContext)();
  }
  if (alarmContext.state === 'suspended') alarmContext.resume();

  let beat = 0;

  function playBeat() {
    if (!alarmContext) return;
    const now = alarmContext.currentTime;
    // Alternating hi (C6 ≈ 1046 Hz) and lo (G5 ≈ 784 Hz) tones
    const freq = (beat % 2 === 0) ? 1046 : 784;
    scheduleChime(alarmContext, freq, now, 0.18);
    beat++;
  }

  // Play first beat immediately, then every 380 ms
  playBeat();
  alarmTimer = setInterval(playBeat, 380);
}

function stopAlarm() {
  if (alarmTimer) {
    clearInterval(alarmTimer);
    alarmTimer = null;
  }
  if (alarmContext) {
    // Close the context to free audio resources
    alarmContext.close().catch(() => {});
    alarmContext = null;
  }
}

/* ============================================================
   7. TIMER COMPLETION MODAL
   Shows a full-screen frosted glass modal when the timer ends.
   The "Stop Alarm" button dismisses both the modal and the alarm.
   ============================================================ */

const timerModal   = document.getElementById('timerModal');
const modalCard    = document.getElementById('modalCard');
const stopAlarmBtn = document.getElementById('stopAlarmBtn');

function showTimerModal() {
  // Reset the shake animation by removing and re-adding the element's
  // animation — cloning the node forces the browser to restart it.
  modalCard.style.animation = 'none';
  // Force a reflow so the next frame re-applies the animation
  void modalCard.offsetWidth;
  modalCard.style.animation = '';

  timerModal.removeAttribute('hidden');
  startAlarm();
}

function hideTimerModal() {
  timerModal.setAttribute('hidden', '');
  stopAlarm();
}

stopAlarmBtn.addEventListener('click', hideTimerModal);

// Also allow closing by clicking the dark overlay outside the card
timerModal.addEventListener('click', e => {
  if (e.target === timerModal) hideTimerModal();
});

/* ============================================================
   8. TO-DO LIST
   - Add / Toggle / Edit / Delete tasks
   - Challenge 3: duplicate guard (case-insensitive)
   - Persist to LocalStorage
   ============================================================ */

const taskInput  = document.getElementById('taskInput');
const addTaskBtn = document.getElementById('addTaskBtn');
const taskListEl = document.getElementById('taskList');

function getTasks()        { return lsGet('tasks', []); }
function saveTasks(tasks)  { lsSet('tasks', tasks); }
function genId()           { return `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`; }

function createTaskElement(task) {
  const li = document.createElement('li');
  li.className = 'task-item';
  li.dataset.id = task.id;

  // Checkbox
  const checkbox = document.createElement('input');
  checkbox.type = 'checkbox';
  checkbox.className = 'task-check';
  checkbox.checked = task.done;

  // Text span
  const span = document.createElement('span');
  span.className = `task-text${task.done ? ' done' : ''}`;
  span.textContent = task.text;

  // Inline edit input (hidden by default)
  const editInput = document.createElement('input');
  editInput.type = 'text';
  editInput.className = 'task-edit-input';
  editInput.value = task.text;

  // Edit / Save button
  const editBtn = document.createElement('button');
  editBtn.className = 'task-btn edit-btn';
  editBtn.title = 'Edit task';
  editBtn.textContent = '✏️';

  // Delete button
  const deleteBtn = document.createElement('button');
  deleteBtn.className = 'task-btn delete-btn';
  deleteBtn.title = 'Delete task';
  deleteBtn.textContent = '🗑️';

  li.append(checkbox, span, editInput, editBtn, deleteBtn);

  /* ---- CHECKBOX ---- */
  checkbox.addEventListener('change', () => {
    const tasks = getTasks();
    const t = tasks.find(t => t.id === task.id);
    if (t) { t.done = checkbox.checked; saveTasks(tasks); }
    span.classList.toggle('done', checkbox.checked);
  });

  /* ---- EDIT / SAVE logic ---- */
  let isEditing = false;
  let _saving = false;

  function enterEditMode() {
    if (task.done) return;
    isEditing = true;
    span.style.display = 'none';
    editInput.style.display = 'block';
    editBtn.textContent = '💾';
    editBtn.title = 'Save edit';
    editInput.focus();
    editInput.select();
  }

  function exitEditMode(save) {
    // Guard: if already exited, do nothing (makes the function idempotent)
    if (!isEditing) return;

    isEditing = false;
    editInput.style.display = 'none';
    span.style.display = '';
    editBtn.textContent = '✏️';
    editBtn.title = 'Edit task';

    if (!save) return;

    const newText = editInput.value.trim();

    if (!newText) {
      showToast('Task text cannot be empty.');
      editInput.value = task.text;
      return;
    }

    // Duplicate check (Challenge 3 also applies to edits)
    const tasks = getTasks();
    const isDuplicate = tasks.some(
      t => t.id !== task.id && t.text.toLowerCase() === newText.toLowerCase()
    );
    if (isDuplicate) {
      showToast(`"${newText}" already exists in your list.`);
      editInput.value = task.text;
      return;
    }

    const t = tasks.find(t => t.id === task.id);
    if (t) {
      t.text = newText;
      task.text = newText;   // keep closure reference in sync
      saveTasks(tasks);
      span.textContent = newText;
    }
  }

  /*
   * EDIT BUTTON — mousedown
   */
  editBtn.addEventListener('mousedown', e => {
    if (isEditing) {
      e.preventDefault();
      _saving = true;
    }
  });

  /*
   * EDIT BUTTON — click
   */
  editBtn.addEventListener('click', e => {
    e.stopPropagation();   // prevent bubbling up to the <li>
    e.preventDefault();

    if (isEditing) {
      exitEditMode(true);                           // save + reset UI right now
      setTimeout(() => { _saving = false; }, 0);   // clear flag after blur settles
    } else {
      enterEditMode();
    }
  });

  // Save on Enter, cancel on Escape
  editInput.addEventListener('keydown', e => {
    if (e.key === 'Enter') {
      _saving = true;
      exitEditMode(true);
      setTimeout(() => { _saving = false; }, 0);
    }
    if (e.key === 'Escape') exitEditMode(false);
  });

  /*
   * BLUR HANDLER
   */
  editInput.addEventListener('blur', () => {
    if (_saving) return;
    if (isEditing) exitEditMode(true);
  });

  /* ---- DELETE ---- */
  deleteBtn.addEventListener('click', () => {
    saveTasks(getTasks().filter(t => t.id !== task.id));
    li.remove();
  });

  return li;
}

function renderTasks() {
  taskListEl.innerHTML = '';
  getTasks().forEach(task => taskListEl.appendChild(createTaskElement(task)));
}

function addTask() {
  const text = taskInput.value.trim();
  if (!text) { showToast('Please enter a task first.'); taskInput.focus(); return; }

  const tasks = getTasks();
  if (tasks.find(t => t.text.toLowerCase() === text.toLowerCase())) {
    showToast(`"${text}" is already in your list!`);
    taskInput.focus();
    return;
  }

  const newTask = { id: genId(), text, done: false };
  tasks.push(newTask);
  saveTasks(tasks);
  taskListEl.appendChild(createTaskElement(newTask));
  taskInput.value = '';
  taskInput.focus();
}

addTaskBtn.addEventListener('click', addTask);
taskInput.addEventListener('keydown', e => { if (e.key === 'Enter') addTask(); });

function initTasks() { renderTasks(); }

/* ============================================================
   9. QUICK LINKS
   - Add / Delete links with name + URL
   - Persist to LocalStorage
   ============================================================ */

const linkNameInput  = document.getElementById('linkNameInput');
const linkUrlInput   = document.getElementById('linkUrlInput');
const addLinkBtn     = document.getElementById('addLinkBtn');
const linksContainer = document.getElementById('linksContainer');

function getLinks()       { return lsGet('quickLinks', []); }
function saveLinks(links) { lsSet('quickLinks', links); }

function createLinkChip(link) {
  const wrapper = document.createElement('div');
  wrapper.style.cssText = 'display:inline-flex;align-items:center;';
  wrapper.dataset.id = link.id;

  const anchor = document.createElement('a');
  anchor.className = 'link-chip';
  anchor.href = link.url;
  anchor.target = '_blank';
  anchor.rel = 'noopener noreferrer';
  anchor.textContent = link.name;

  const delBtn = document.createElement('button');
  delBtn.className = 'link-delete';
  delBtn.title = 'Remove link';
  delBtn.textContent = '×';
  delBtn.addEventListener('click', e => {
    e.preventDefault();
    saveLinks(getLinks().filter(l => l.id !== link.id));
    wrapper.remove();
  });

  anchor.appendChild(delBtn);
  wrapper.appendChild(anchor);
  return wrapper;
}

function renderLinks() {
  linksContainer.innerHTML = '';
  getLinks().forEach(link => linksContainer.appendChild(createLinkChip(link)));
}

function addLink() {
  const name = linkNameInput.value.trim();
  let url    = linkUrlInput.value.trim();

  if (!name) { showToast('Please enter a link name.'); linkNameInput.focus(); return; }
  if (!url)  { showToast('Please enter a URL.');       linkUrlInput.focus();  return; }

  if (!/^https?:\/\//i.test(url)) url = 'https://' + url;

  const newLink = { id: genId(), name, url };
  const links = getLinks();
  links.push(newLink);
  saveLinks(links);
  linksContainer.appendChild(createLinkChip(newLink));
  linkNameInput.value = '';
  linkUrlInput.value  = '';
  linkNameInput.focus();
}

addLinkBtn.addEventListener('click', addLink);
[linkNameInput, linkUrlInput].forEach(el =>
  el.addEventListener('keydown', e => { if (e.key === 'Enter') addLink(); })
);

function initLinks() { renderLinks(); }

/* ============================================================
   10. INIT
   ============================================================ */
document.addEventListener('DOMContentLoaded', () => {
  initGreeting();   // clock, date, greeting, name + pencil toggle
  initTimer();      // pomodoro display
  initTasks();      // to-do list
  initLinks();      // quick links
  initCardGlow();   // mouse spotlight effect
});
