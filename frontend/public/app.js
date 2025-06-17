const API_BASE = 'http://localhost:8000';

let calendar;

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
    const disabled = appointments.map(a => a.datetime);
    calendar.set('disable', disabled);
  }
}

async function deleteAppointment(id) {
  await fetch(`${API_BASE}/appointments/${id}`, { method: 'DELETE' });
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
    alert(data.detail || 'Failed to book appointment');
    return;
  }
  e.target.reset();
  fetchAppointments();
});

document.addEventListener('DOMContentLoaded', () => {
  calendar = flatpickr('#datetime', {
    enableTime: true,
    dateFormat: 'Y-m-d\\TH:i'
  });
  fetchAppointments();
  document.getElementById('new-appointment-btn').addEventListener('click', () => {
    document.getElementById('appointment-form').classList.toggle('hidden');
  });
});
