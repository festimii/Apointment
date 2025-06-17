const API_BASE = 'http://localhost:8000';

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
    del.onclick = () => deleteAppointment(a.id);
    li.appendChild(del);
    list.appendChild(li);
  });
}

async function deleteAppointment(id) {
  await fetch(`${API_BASE}/appointments/${id}`, { method: 'DELETE' });
  fetchAppointments();
}

document.getElementById('appointment-form').addEventListener('submit', async e => {
  e.preventDefault();
  const customer = document.getElementById('customer').value;
  const datetime = document.getElementById('datetime').value;
  const service = document.getElementById('service').value;
  await fetch(`${API_BASE}/appointments`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ customer, datetime, service })
  });
  e.target.reset();
  fetchAppointments();
});

fetchAppointments();
