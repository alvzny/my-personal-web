// PIN System – user chooses on first run (no defaults)
let currentPIN = localStorage.getItem('userPIN') || '';
let currentMonth = new Date().getMonth();
let currentYear = new Date().getFullYear();

function checkPin() {
    const pin = document.getElementById('pin-input').value;
    if (!currentPIN) {
        alert('🛠 Please create a PIN first.');
        return;
    }
    if (pin === currentPIN) {
        document.getElementById('pin-page').classList.add('hidden');
        setTimeout(() => {
            document.getElementById('dashboard').classList.add('visible');
            document.getElementById('main-content').classList.add('moved');
            loadAllData();
        }, 250);
    } else {
        document.getElementById('pin-input').style.borderColor = 'var(--red)';
        setTimeout(() => document.getElementById('pin-input').style.borderColor = 'var(--light-green)', 1000);
        alert('❌ Wrong PIN!');
    }
}

function createPin() {
    const newPin = document.getElementById('new-pin-input').value;
    if (newPin.length === 6) {
        currentPIN = newPin;
        localStorage.setItem('userPIN', newPin);
        alert('✅ PIN created! Please login with your new PIN.');
        showPinForm();
        toggleCreateButton();
    } else {
        alert('❌ PIN must be exactly 6 characters.');
    }
}

function showPinForm() {
    document.getElementById('create-form').style.display = 'none';
    document.getElementById('forgot-form').style.display = 'none';
    document.getElementById('pin-form').style.display = 'block';
    document.getElementById('pin-input').value = '';
    document.getElementById('pin-input').style.borderColor = 'var(--light-green)';
    document.getElementById('pin-input').focus();
    toggleCreateButton();
}

function showCreateForm() {
    document.getElementById('pin-form').style.display = 'none';
    document.getElementById('forgot-form').style.display = 'none';
    document.getElementById('create-form').style.display = 'block';
    document.getElementById('new-pin-input').value = '';
    document.getElementById('new-pin-input').focus();
}

function showForgotForm() {
    document.getElementById('pin-form').style.display = 'none';
    document.getElementById('create-form').style.display = 'none';
    document.getElementById('forgot-form').style.display = 'block';
    document.getElementById('favorite-game').value = '';
    document.getElementById('favorite-game').focus();
}

function checkFavorite() {
    const fav = document.getElementById('favorite-game').value.trim();
    if (fav.toLowerCase() === 'evade') {
        alert('✅ Correct! Please create a new PIN.');
        showCreateForm();
    } else {
        alert('❌ Incorrect answer. Try again.');
    }
}

document.addEventListener('DOMContentLoaded', function() {
    document.body.style.opacity = '0';
    setTimeout(() => document.body.style.opacity = '1', 100);

    // always start on pin-form; if no PIN, show create button
    showPinForm();
    toggleCreateButton();
});

document.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && document.getElementById('pin-page').style.display !== 'none') {
        if (document.getElementById('create-form').style.display === 'block') {
            createPin();
        } else if (document.getElementById('pin-form').style.display === 'block') {
            checkPin();
        }
    }
});

// helper to show/hide create button
function toggleCreateButton() {
    const btn = document.getElementById('create-btn');
    if (!btn) return;
    btn.style.display = currentPIN ? 'none' : 'inline-block';
}

// Navigation & Transitions
function toggleSidebar() {
    const sidebar = document.getElementById('sidebar');
    const mainContent = document.getElementById('main-content');
    sidebar.classList.toggle('open');
    if (sidebar.classList.contains('open')) {
        mainContent.classList.add('moved');
    } else {
        mainContent.classList.remove('moved');
    }
}

function showSection(sectionId) {
    document.querySelectorAll('.section').forEach(s => s.classList.remove('active'));
    document.querySelectorAll('.nav-item').forEach(item => item.classList.remove('active'));
    event.target.closest('.nav-item').classList.add('active');
    setTimeout(() => document.getElementById(sectionId).classList.add('active'), 150);
    document.getElementById('sidebar').classList.remove('open');
}

function logout() {
    document.getElementById('dashboard').classList.remove('visible');
    document.getElementById('main-content').classList.remove('moved');
    setTimeout(() => {
        document.getElementById('pin-page').classList.remove('hidden');
        showPinForm();
    }, 500);
}

// PH Time
function updatePHTime() {
    const now = new Date().toLocaleString('en-PH', { timeZone: 'Asia/Manila', weekday: 'short', year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
    document.querySelector('.ph-time').textContent = `🕐 PH Time: ${now}`;
}
setInterval(updatePHTime, 1000);
updatePHTime();

// Files
// (the rest of the original script follows exactly as in the HTML file)

// Files

const fileUpload = document.getElementById('file-upload');
if (fileUpload) {
    fileUpload.addEventListener('change', (e) => {
        Array.from(e.target.files).forEach(file => {
            const reader = new FileReader();
            reader.onload = (ev) => {
                let files = JSON.parse(localStorage.getItem('userFiles') || '[]');
                files.push({name: file.name, data: ev.target.result, type: file.type});
                localStorage.setItem('userFiles', JSON.stringify(files));
                loadFiles();
            };
            reader.readAsDataURL(file);
        });
    });
}

function loadFiles() {
    let files = JSON.parse(localStorage.getItem('userFiles') || '[]');
    document.getElementById('file-list').innerHTML = files.map((file, i) => `
        <div class="file-item">
            ${file.type.startsWith('image/') ? `<img src="${file.data}" alt="${file.name}" title="Click to view">` : 
              file.type.startsWith('video/') ? `<video src="${file.data}" controls style="max-height:120px;"></video>` : 
              `<i class="fas fa-file-pdf" style="font-size:48px;color:var(--blue);"></i>`}
            <br><small>${file.name}</small>
            <br><button class="delete-btn" onclick="deleteFile(${i})"><i class="fas fa-trash"></i> Delete</button>
        </div>
    `).join('');
}

function deleteFile(index) {
    let files = JSON.parse(localStorage.getItem('userFiles') || '[]');
    files.splice(index, 1);
    localStorage.setItem('userFiles', JSON.stringify(files));
    loadFiles();
}

// Schedule
function addClass() {
    const name = document.getElementById('class-name').value;
    const start = document.getElementById('class-start').value;
    const end = document.getElementById('class-end').value;
    if (name && start && end) {
        let schedule = JSON.parse(localStorage.getItem('classSchedule') || '[]');
        schedule.push({name, start, end});
        localStorage.setItem('classSchedule', JSON.stringify(schedule));
        document.getElementById('class-name').value = '';
        document.getElementById('class-start').value = '';
        document.getElementById('class-end').value = '';
        loadSchedule();
    }
}

function loadSchedule() {
    let schedule = JSON.parse(localStorage.getItem('classSchedule') || '[]');
    document.getElementById('schedule-list').innerHTML = schedule.map(s => 
        `<div style="padding:15px;background:var(--light-green);margin:10px 0;border-radius:10px;display:flex;justify-content:space-between;align-items:center;">
            <span><i class="fas fa-graduation-cap"></i> ${s.name}</span>
            <span>${s.start} - ${s.end}</span>
        </div>`
    ).join('');
}

// Calendar
function renderCalendar() {
    const today = new Date();
    const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    document.getElementById('calendar-header').innerHTML = `
        <i class="fas fa-calendar-day"></i> ${monthNames[currentMonth]} ${currentYear} 
        <button onclick="prevMonth()" style="float:right;background:var(--blue);color:white;border:none;padding:5px 10px;border-radius:5px;"><i class="fas fa-chevron-left"></i></button>
        <button onclick="nextMonth()" style="float:right;background:var(--blue);color:white;border:none;padding:5px 10px;border-radius:5px;margin-right:10px;"><i class="fas fa-chevron-right"></i></button>
    `;
    const firstDay = new Date(currentYear, currentMonth, 1).getDay();
    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
    let deadlines = JSON.parse(localStorage.getItem('deadlines') || '[]');
    let html = '';
    const weekdays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    weekdays.forEach(day => html += `<div class="weekday">${day}</div>`);
    for (let i = 0; i < firstDay; i++) html += '<div class="day no-day"></div>';
    for (let day = 1; day <= daysInMonth; day++) {
        const isToday = day === today.getDate() && currentMonth === today.getMonth() && currentYear === today.getFullYear();
        const dayEvents = deadlines.filter(d => {
            const dlDate = new Date(d.date + 'T00:00:00');
            return dlDate.getDate() === day && dlDate.getMonth() === currentMonth && dlDate.getFullYear() === currentYear;
        });
        html += `
            <div class="day ${isToday ? 'today' : ''}" onclick="selectDay(${day})">
                <div class="day-header">${day}</div>
                ${dayEvents.map(event => `<div class="event" title="${event.desc}">${event.desc.substring(0,20)}...</div>`).join('')}
                ${dayEvents.length > 3 ? `<div style="font-size:10px;color:#666;">+${dayEvents.length-3} more</div>` : ''}
            </div>
        `;
    }
    document.getElementById('calendar').innerHTML = html;
}

function prevMonth() { currentMonth--; if (currentMonth < 0) { currentMonth = 11; currentYear--; } renderCalendar(); }
function nextMonth() { currentMonth++; if (currentMonth > 11) { currentMonth = 0; currentYear++; } renderCalendar(); }
function selectDay(day) { alert(`Selected: Day ${day} of ${currentMonth + 1}/${currentYear}`); }
function addDeadline() {
    const desc = document.getElementById('deadline-desc').value;
    const date = document.getElementById('deadline-date').value;
    if (desc && date) {
        let deadlines = JSON.parse(localStorage.getItem('deadlines') || '[]');
        deadlines.push({desc, date});
        localStorage.setItem('deadlines', JSON.stringify(deadlines));
        document.getElementById('deadline-desc').value = '';
        document.getElementById('deadline-date').value = '';
        renderCalendar();
    }
}

// Reminders & Notes
function addReminder() {
    const text = document.getElementById('reminder-text').value;
    if (text) {
        let reminders = JSON.parse(localStorage.getItem('reminders') || '[]');
        reminders.unshift(text);
        localStorage.setItem('reminders', JSON.stringify(reminders));
        document.getElementById('reminder-text').value = '';
        loadReminders();
    }
}

function loadReminders() {
    let reminders = JSON.parse(localStorage.getItem('reminders') || '[]');
    document.getElementById('reminder-list').innerHTML = reminders.map((r, i) => 
        `<div class="reminder">
            <i class="fas fa-exclamation-triangle" style="margin-right:10px;"></i> ${r}
            <button onclick="deleteReminder(${i})" style="float:right;background:rgba(255,255,255,0.3);color:white;border:none;padding:8px;border-radius:50%;"><i class="fas fa-times"></i></button>
        </div>`
    ).join('');
}

function deleteReminder(index) {
    let reminders = JSON.parse(localStorage.getItem('reminders') || '[]');
    reminders.splice(index, 1);
    localStorage.setItem('reminders', JSON.stringify(reminders));
    loadReminders();
}

function saveNote() {
    const text = document.getElementById('note-input').value;
    if (text) {
        let notes = JSON.parse(localStorage.getItem('notes') || '[]');
        notes.unshift(new Date().toLocaleString('en-PH', { timeZone: 'Asia/Manila' }) + '\n\n' + text);
        localStorage.setItem('notes', JSON.stringify(notes));
        document.getElementById('note-input').value = '';
        loadNotes();
    }
}

function loadNotes() {
    let notes = JSON.parse(localStorage.getItem('notes') || '[]');
    document.getElementById('notes-list').innerHTML = notes.map((n, i) => 
        `<div class="note">${n.replace(/\n/g, '<br>')}
            <button onclick="deleteNote(${i})" style="float:right;background:var(--red);color:white;border:none;padding:5px 10px;border-radius:5px;font-size:12px;"><i class="fas fa-trash"></i></button>
        </div>`
    ).join('');
}

function deleteNote(index) {
    let notes = JSON.parse(localStorage.getItem('notes') || '[]');
    notes.splice(index, 1);
    localStorage.setItem('notes', JSON.stringify(notes));
    loadNotes();
}

function loadAllData() {
    loadFiles();
    loadSchedule();
    renderCalendar();
    loadReminders();
    loadNotes();
    setInterval(renderCalendar, 60000);
}

document.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && document.getElementById('pin-page').style.display !== 'none') checkPin();
});

document.getElementById('deadline-date').addEventListener('focus', function() {
    if (!this.value) this.value = new Date().toISOString().split('T')[0];
});

// Smooth page load
document.addEventListener('DOMContentLoaded', function() {
    document.body.style.opacity = '0';
    setTimeout(() => document.body.style.opacity = '1', 100);
});