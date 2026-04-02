// CONFIGURATION
const API_BASE = "?????"; //URL de l'api
const MAX_POINTS = 50; // nb de points max affichés sur le graphe
const CAPTEURS = ["alx", "aly", "alz", "glx", "gly", "glz"];

const state = {
  patient1: { interval: null, chart: null, active: false },
  patient2: { interval: null, chart: null, active: false }
};

function initChart(canvasId) {
  const ctx = document.getElementById(canvasId).getContext("2d");
  return new Chart(ctx, {
    type: "line",
    data: {
      labels: [],
      datasets: CAPTEURS.map((capteur, i) => ({
        label: capteur,
        data: [],
        borderColor: getColor(i),
        borderWidth: 1.5,
        pointRadius: 0,
        fill: false,
        tension: 0.3
      }))
    },
    options: {
      animation: false,
      responsive: true,
      scales: {
        x: { display: false },
        y: { beginAtZero: false }
      },
      plugins: {
        legend: { position: "top" }
      }
    }
  });
}

function getColor(i) {
  const colors = ["#2ecc71","#f39c12", "#e74c3c","#3498db","#9b59b6","#bc731a"];
  return colors[i];
}

function fetchAndUpdate(patientId, chart) {
  const selectedCapteurs = getSelectedCapteurs();
  fetch(`${API_BASE}/data?patient=${patientId}`)
    .then(res => res.json())
    .then(data => {
      if (data.error) return;
      const now = new Date().toLocaleTimeString();
      chart.data.labels.push(now);
      if (chart.data.labels.length > MAX_POINTS)
        chart.data.labels.shift();
      chart.data.datasets.forEach((dataset, i) => {
        const key = CAPTEURS[i];
        const value = data[key] ?? null;
        dataset.hidden = !selectedCapteurs.includes(key);
        dataset.data.push(value);
        if (dataset.data.length > MAX_POINTS)
          dataset.data.shift();
      });
      chart.update();
    })
    .catch(err => console.error(`Erreur patient ${patientId}:`, err));
}

function getSelectedCapteurs() {
  const checkboxes = document.querySelectorAll(".sensor-checkbox:checked");
  return Array.from(checkboxes).map(cb => cb.dataset.sensor);
}

function startPatient(patientId) {
  const key = `patient${patientId}`;
  if (state[key].active) return;
  const activity = document.getElementById(`activity${patientId}-select`).value;
  const refreshRate = parseInt(document.getElementById("refresh-slider").value);
  fetch(`${API_BASE}/start?patient=${patientId}&activity=${activity}`)
    .then(res => res.json())
    .then(data => {
      console.log(data.status);
      state[key].interval = setInterval(() => {
        fetchAndUpdate(patientId, state[key].chart);
      }, refreshRate);
      state[key].active = true;
      updateButtons(patientId, true);
    })
    .catch(err => console.error("Erreur start:", err));
}

function stopPatient(patientId) {
  const key = `patient${patientId}`;
  if (!state[key].active) return;
  fetch(`${API_BASE}/stop?patient=${patientId}`)
    .then(res => res.json())
    .then(data => console.log(data.status));
  clearInterval(state[key].interval);
  state[key].interval = null;
  state[key].active = false;
  updateButtons(patientId, false);
}

function updateButtons(patientId, isRunning) {
  document.getElementById(`start-patient${patientId}`).disabled = isRunning;
  document.getElementById(`stop-patient${patientId}`).disabled = !isRunning;
}

function updateRefreshRate() {
  const val = document.getElementById("refresh-slider").value;
  document.getElementById("refresh-value").textContent = val + " ms";
  [1, 2].forEach(patientId => {
    const key = `patient${patientId}`;
    if (state[key].active) {
      clearInterval(state[key].interval);
      state[key].interval = setInterval(() => {
        fetchAndUpdate(patientId, state[key].chart);
      }, parseInt(val));
    }
  });
}
document.addEventListener("DOMContentLoaded", () => {
  state.patient1.chart = initChart("chart-patient1");
  state.patient2.chart = initChart("chart-patient2");

  document.getElementById("start-patient1").addEventListener("click", () => startPatient(1));
  document.getElementById("stop-patient1").addEventListener("click", () => stopPatient(1));
  document.getElementById("start-patient2").addEventListener("click", () => startPatient(2));
  document.getElementById("stop-patient2").addEventListener("click", () => stopPatient(2));
  document.getElementById("refresh-slider").addEventListener("input", updateRefreshRate);

  updateButtons(1, false);
  updateButtons(2, false);
});