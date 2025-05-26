const tiposDeAtaques = [

];

const noticias = [
  {
    titulo: "Hacktivistas revelan vulnerabilidad digital del gobierno",
    resumen: "Grupo anónimo expone fallas críticas en seguridad digital de instituciones públicas.",
    url: "https://www.elsalvador.com/noticias/nacional/hacktivistas-revelan-vulnerabilidad-digital-gobierno/1142955/2024/"
  },
  {
    titulo: "Ciberataque de ransomware afecta entidad pública en El Salvador",
    resumen: "El grupo Rhysida exige rescate tras cifrar datos del Ministerio de Desarrollo Local.",
    url: "https://devel.group/blog/ciberataque-de-ransomware-al-ministerio-de-desarrollo-local-de-el-salvador/"
  },
  {
    titulo: "Sitios web gubernamentales sufren ataques de denegación de servicio",
    resumen: "Portales oficiales permanecieron fuera de línea durante horas por ataques DDoS.",
    url: "https://www.laprensagrafica.com/elsalvador/Realizan-ataques-ciberneticos-contra-Diario-El-Salvador-y-otros-sitios-web-afines-al-oficialismo-20240503-0060.html"
  }
];

function cargarTiposDeAtaques() {
  const contenedor = document.getElementById("types-of-attacks-container");
  contenedor.innerHTML = "";
  tiposDeAtaques.forEach(ataque => {
    const div = document.createElement("div");
    div.className = "tipo-ataque";
    div.innerHTML = `
      <h3>${ataque.tipo}</h3>
      <p>${ataque.descripcion}</p>
    `;
    contenedor.appendChild(div);
  });
}

function cargarNoticias() {
  const contenedor = document.getElementById("news-container");
  contenedor.innerHTML = "";
  noticias.forEach(noticia => {
    const div = document.createElement("div");
    div.className = "noticia";
    div.innerHTML = `
      <h3>${noticia.titulo}</h3>
      <p>${noticia.resumen}</p>
      <p><a href="${noticia.url}" target="_blank">Leer más</a></p>
    `;
    contenedor.appendChild(div);
  });
}

function generarDatosFalsos() {
  const now = new Date();
  const labels = [], data = [];
  for (let i = 11; i >= 0; i--) {
    const t = new Date(now.getTime() - i * 5 * 60000);
    labels.push(t.getHours().toString().padStart(2, '0') + ":" + t.getMinutes().toString().padStart(2, '0'));
    data.push(Math.floor(Math.random() * 20 + 5));
  }
  return { labels, data };
}

function actualizarGrafico(chart) {
  const { labels, data } = generarDatosFalsos();
  chart.data.labels = labels;
  chart.data.datasets[0].data = data;
  chart.update();

  document.getElementById("last-update").textContent = "Última actualización: " + formatTime(new Date());
}

function formatTime(d) {
  return d.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
}

document.addEventListener("DOMContentLoaded", () => {
  cargarTiposDeAtaques();
  cargarNoticias();

  const ctx = document.getElementById("attackChart").getContext("2d");
  const chart = new Chart(ctx, {
    type: "line",
    data: {
      labels: [],
      datasets: [{
        label: "Ataques detectados",
        data: [],
        borderColor: "#34D399", 
        backgroundColor: "rgba(56, 189, 248, 0.2)",
        tension: 0.3,
        pointRadius: 4,
        pointHoverRadius: 6,
        borderWidth: 2
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        x: {
          ticks: { color: "#94a3b8" },
          grid: { color: "rgba(255,255,255,0.05)" }
        },
        y: {
          beginAtZero: true,
          ticks: { color: "#94a3b8", stepSize: 5 },
          grid: { color: "rgba(255,255,255,0.05)", borderDash: [4, 4] },
          max: 30
        }
      },
      plugins: {
        legend: {
          labels: { color: "#38bdf8", font: { weight: "bold" } }
        },
        tooltip: {
          backgroundColor: "#1e293b",
          titleColor: "#38bdf8",
          bodyColor: "#e2e8f0",
          cornerRadius: 6
        }
      }
    }
  });

  actualizarGrafico(chart);
  setInterval(() => actualizarGrafico(chart), 300000); 
});