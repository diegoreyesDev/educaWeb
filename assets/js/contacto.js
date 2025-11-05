// Requiere cuenta gratuita en https://www.emailjs.com/
document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById("contactForm");
  const estado = document.getElementById("estadoEnvio");

  // Inicializa EmailJS con tu User ID (lo obtienes tras registrarte)
  emailjs.init("TU_USER_ID_EMAILJS");

  form.addEventListener("submit", function (e) {
    e.preventDefault();

    estado.innerText = "Enviando mensaje...";
    const serviceID = "TU_SERVICE_ID";
    const templateID = "TU_TEMPLATE_ID";

    const params = {
      nombre: document.getElementById("nombre").value,
      email: document.getElementById("email").value,
      mensaje: document.getElementById("mensaje").value,
    };

    emailjs.send(serviceID, templateID, params)
      .then(() => {
        estado.innerText = "✅ ¡Mensaje enviado con éxito!";
        form.reset();
      })
      .catch((err) => {
        console.error("Error al enviar:", err);
        estado.innerText = "❌ Ocurrió un error. Inténtalo nuevamente.";
      });
  });
});
