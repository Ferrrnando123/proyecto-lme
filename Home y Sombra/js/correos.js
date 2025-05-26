let token = "";
let accountId = "";
let email = "";
let password = "";

const emailInput = document.getElementById("email-pass");
const passwordInput = document.getElementById("password");
const generateBtn = document.getElementById("generateBtn");
const timerEl = document.getElementById("timer");
const inboxDiv = document.getElementById("inbox");
const messagesList = document.getElementById("messagesList");
const messageContent = document.getElementById("messageContent");

let timerInterval = null;
let remainingSeconds = 0;

generateBtn.addEventListener("click", async () => {
  // Ya no bloqueamos nada ni mostramos alert, el usuario puede generar cuando quiera

  messageContent.style.display = "none";
  messagesList.innerHTML = "";
  inboxDiv.style.display = "none";

  try {
    // Obtener dominio
    const domainsResp = await fetch("https://api.mail.tm/domains");
    const domainsData = await domainsResp.json();
    const domain = domainsData["hydra:member"][0].domain;

    // Generar password random
    password = "Sancocho929_" + Math.floor(Math.random() * 10000);

    // Generar email random
    email = `temp${Math.floor(Math.random() * 100000)}@${domain}`;

    // Crear cuenta
    const createAccResp = await fetch("https://api.mail.tm/accounts", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ address: email, password: password }),
    });

    if (!createAccResp.ok) {
      alert("Error creando cuenta, intenta de nuevo.");
      return;
    }

    const accData = await createAccResp.json();
    accountId = accData.id;

    // Login para obtener token
    const tokenResp = await fetch("https://api.mail.tm/token", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ address: email, password: password }),
    });

    const tokenData = await tokenResp.json();
    token = tokenData.token;

    // Mostrar email y password
    emailInput.value = email;
    passwordInput.value = password;

    // Mostrar bandeja
    inboxDiv.style.display = "block";

    // Reiniciar timer a 10 minutos
    remainingSeconds = 600;
    updateTimer();

    if (timerInterval) clearInterval(timerInterval);

    timerInterval = setInterval(() => {
      remainingSeconds--;
      if (remainingSeconds <= 0) {
        clearInterval(timerInterval);
        timerEl.textContent = "Tiempo restante 0:00";
        // No bloqueamos nada, no alertamos, solo limpiamos datos y esperamos nueva cuenta
        inboxDiv.style.display = "none";
        emailInput.value = "";
        passwordInput.value = "";
        messagesList.innerHTML = "";
        messageContent.style.display = "none";
        token = "";
        accountId = "";
        email = "";
        password = "";
        return;
      }
      updateTimer();
      fetchMessages();
    }, 1000);

    // Obtener mensajes iniciales
    fetchMessages();
  } catch (error) {
    alert("Error inesperado: " + error.message);
  }
});

function updateTimer() {
  const minutes = Math.floor(remainingSeconds / 60);
  const seconds = remainingSeconds % 60;
  timerEl.textContent = `Tiempo restante ${minutes}:${seconds.toString().padStart(2, "0")}`;
}

async function fetchMessages() {
  if (!token) return;

  try {
    const resp = await fetch("https://api.mail.tm/messages", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!resp.ok) return;

    const data = await resp.json();

    messagesList.innerHTML = "";

    if (data["hydra:totalItems"] === 0) {
      messagesList.innerHTML = "<p style='text-align:center;color:#555'>No hay mensajes</p>";
      messageContent.style.display = "none";
      return;
    }

    data["hydra:member"].forEach((msg) => {
      const div = document.createElement("div");
      div.className = "message-item";
      div.dataset.id = msg.id;
      div.innerHTML = `
        <span class="message-subject">${msg.subject || "(Sin asunto)"}</span>
        <span class="message-date">${new Date(msg.createdAt).toLocaleString()}</span><br/>
        <span class="message-from">De: ${msg.from.address}</span>
      `;
      div.onclick = () => showMessageContent(msg.id);
      messagesList.appendChild(div);
    });
  } catch {
    // ignorar error
  }
}

async function showMessageContent(id) {
  if (!token) return;
  messageContent.style.display = "block";
  messageContent.textContent = "Cargando mensaje...";
  try {
    const resp = await fetch(`https://api.mail.tm/messages/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!resp.ok) {
      messageContent.textContent = "Error al cargar el mensaje.";
      return;
    }
    const msgData = await resp.json();
    messageContent.textContent = msgData.text || "(Mensaje sin contenido visible)";
  } catch {
    messageContent.textContent = "Error al cargar el mensaje.";
  }
}
