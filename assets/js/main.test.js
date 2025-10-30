/**
 * Unit tests for contact modal functionality
 */

describe('Contact Modal', () => {
    let contactBtn, closeModal, contactModal, contactForm, statusMsg;

    beforeEach(() => {
        // Setup DOM elements
        document.body.innerHTML = `
            <button id="contactBtn">Contacto</button>
            <div id="contactModal" class="modal hidden">
                <div class="modal-content">
                    <button id="closeModal" class="close">&times;</button>
                    <form id="contactForm">
                        <input type="email" id="email" name="user_email" required />
                        <textarea id="msg" name="message" rows="5" required></textarea>
                        <button type="submit">Enviar</button>
                    </form>
                    <p id="statusMsg" role="alert"></p>
                </div>
            </div>
        `;

        // Get references to elements
        contactBtn = document.getElementById('contactBtn');
        closeModal = document.getElementById('closeModal');
        contactModal = document.getElementById('contactModal');
        contactForm = document.getElementById('contactForm');
        statusMsg = document.getElementById('statusMsg');

        // Mock emailjs
        global.emailjs = {
            sendForm: jest.fn()
        };

        // Attach event handlers from main.js
        contactBtn.onclick = () => {
            contactModal.classList.remove('hidden');
        };
        closeModal.onclick = () => {
            contactModal.classList.add('hidden');
        };
        contactForm.onsubmit = function (e) {
            e.preventDefault();
            statusMsg.textContent = 'Enviando...';

            emailjs.sendForm('TU_SERVICE_ID', 'TU_TEMPLATE_ID', this)
                .then(() => statusMsg.textContent = 'Mensaje enviado correctamente.')
                .catch(() => statusMsg.textContent = 'Error al enviar el mensaje.');
        };
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    // Test 1: The contact modal becomes visible when the contact button is clicked
    test('should show contact modal when contact button is clicked', () => {
        expect(contactModal.classList.contains('hidden')).toBe(true);
        
        contactBtn.click();
        
        expect(contactModal.classList.contains('hidden')).toBe(false);
    });

    // Test 2: The contact modal becomes hidden when the close button is clicked
    test('should hide contact modal when close button is clicked', () => {
        contactModal.classList.remove('hidden');
        expect(contactModal.classList.contains('hidden')).toBe(false);
        
        closeModal.click();
        
        expect(contactModal.classList.contains('hidden')).toBe(true);
    });

    // Test 3: The status message displays "Enviando..." when the form is submitted
    test('should display "Enviando..." when form is submitted', () => {
        const mockPromise = new Promise(() => {});
        emailjs.sendForm.mockReturnValue(mockPromise);

        contactForm.dispatchEvent(new Event('submit'));

        expect(statusMsg.textContent).toBe('Enviando...');
    });

    // Test 4: The status message displays "Mensaje enviado correctamente." on successful form submission
    test('should display success message on successful form submission', async () => {
        const mockPromise = Promise.resolve();
        emailjs.sendForm.mockReturnValue(mockPromise);

        contactForm.dispatchEvent(new Event('submit'));

        await mockPromise;

        expect(statusMsg.textContent).toBe('Mensaje enviado correctamente.');
    });

    // Test 5: The status message displays "Error al enviar el mensaje." on failed form submission
    test('should display error message on failed form submission', async () => {
        const mockPromise = Promise.reject();
        emailjs.sendForm.mockReturnValue(mockPromise);

        contactForm.dispatchEvent(new Event('submit'));

        try {
            await mockPromise;
        } catch (e) {
            // Expected to fail
        }

        expect(statusMsg.textContent).toBe('Error al enviar el mensaje.');
    });
});
