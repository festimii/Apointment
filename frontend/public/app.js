const API_BASE = 'http://localhost:8000';

let calendar;

function showNotification(message, type = 'success') {
  const box = document.getElementById('notification');
  box.textContent = message;
  box.className = `notification ${type}`;
  box.classList.remove('hidden');
  setTimeout(() => box.classList.add('hidden'), 3000);
}

async function fetchAppointments() {
  const res = await fetch(`${API_BASE}/appointments`);
  const appointments = await res.json();
  const list = document.getElementById('appointments');
  list.innerHTML = '';
  appointments.forEach(a => {
    const li = document.createElement('li');
    li.textContent = `${a.datetime} - ${a.customer} (${a.service})`;
    const del = document.createElement('button');
    del.textContent = 'Delete';
    del.className = 'mui-btn mui-btn--danger';
    del.onclick = () => deleteAppointment(a.id);
    li.appendChild(del);
    list.appendChild(li);
  });
  if (calendar) {
    const disabledDates = [date => date.getDay() === 0];
    disabledDates.push(...appointments.map(a => a.datetime));
    calendar.set('disable', disabledDates);
  }
}

async function deleteAppointment(id) {
  await fetch(`${API_BASE}/appointments/${id}`, { method: 'DELETE' });
  showNotification('Appointment deleted');
  fetchAppointments();
}

document.getElementById('appointment-form').addEventListener('submit', async e => {
  e.preventDefault();
  const customer = document.getElementById('customer').value;
  const phone = document.getElementById('phone').value;
  const datetime = document.getElementById('datetime').value;
  const service = document.getElementById('service').value;
  const res = await fetch(`${API_BASE}/appointments`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ customer, phone, datetime, service })
  });
  if (!res.ok) {
    const data = await res.json();
    showNotification(data.detail || 'Failed to book appointment', 'error');
    return;
  }
  e.target.reset();
  showNotification('Appointment booked');
  fetchAppointments();
});

document.addEventListener('DOMContentLoaded', () => {
  calendar = flatpickr('#datetime', {
    enableTime: true,
    dateFormat: 'Y-m-d\\TH:i',
    minDate: 'today',
    time_24hr: true,
    minuteIncrement: 30,
    minTime: '09:00',
    maxTime: '18:00',
    disable: [
      date => date.getDay() === 0
    ]
  });
  fetchAppointments();
  document.getElementById('new-appointment-btn').addEventListener('click', () => {
    document.getElementById('appointment-form').classList.toggle('hidden');
  });
});
