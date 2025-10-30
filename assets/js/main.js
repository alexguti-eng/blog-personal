// JS (usa EmailJS)
document.getElementById('contactBtn').onclick = () => {
    document.getElementById('contactModal').classList.remove('hidden');
};
document.getElementById('closeModal').onclick = () => {
    document.getElementById('contactModal').classList.add('hidden');
};

document.getElementById('contactForm').onsubmit = function (e) {
    e.preventDefault();
    const statusMsg = document.getElementById('statusMsg');
    statusMsg.textContent = 'Enviando...';

    emailjs.sendForm('TU_SERVICE_ID', 'TU_TEMPLATE_ID', this)
        .then(() => statusMsg.textContent = 'Mensaje enviado correctamente.')
        .catch(() => statusMsg.textContent = 'Error al enviar el mensaje.');
};
