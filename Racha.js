document.addEventListener('DOMContentLoaded', function () {
    let startDate = new Date();
    let startDay = 2; 
    let currentDay = startDay + Math.floor((new Date() - startDate) / (1000 * 60 * 60 * 24));

    const logos = document.querySelectorAll('.logo');

    function changeLogo(day) {
        logos.forEach(logo => {
            if (day >= 1 && day <= 2) {
                logo.src = "img/logo.jpeg";
                logo.setAttribute('data-info', 'Logo: Comienzo<br>Día: ' + day + '<br>Descripción: Este logo representa el comienzo de tu nueva etapa de aprendizaje, simbolizando el nacimiento de tu viaje hacia el conocimiento.');
            } else if (day >= 3 && day <= 9) {
                logo.src = "gif/logo2.gif";
                logo.setAttribute('data-info', 'Logo: Resiliencia Cristalina<br>Día: ' + day + '<br>Descripción: Este logo simboliza tu capacidad para adaptarte y recomponerte, representando la evolución constante de tu conocimiento.');
            } else if (day >= 10 && day <= 29) {
                logo.src = "gif/logo3.gif";
                logo.setAttribute('data-info', 'Logo: Llama del Conocimiento<br>Día: ' + day + '<br>Descripción: Esta llama azul en tus manos simboliza la chispa de tu curiosidad y el poder del conocimiento que posees.');
            } else if (day >= 30 && day <= 99) {
                logo.src = "gif/logo4.gif";
                logo.setAttribute('data-info', 'Logo: Cielo Infinito<br>Día: ' + day + '<br>Descripción: Este cielo en movimiento representa la vastedad de tu conocimiento y tu capacidad de elevarte y expandirte sin límites.');
            } else if (day >= 100 && day <= 199) {
                logo.src = "gif/logo5.gif";
                logo.setAttribute('data-info', 'Logo: Exploración Galáctica<br>Día: ' + day + '<br>Descripción: Este logo simboliza tu exploración constante y tu búsqueda de nuevos horizontes en el aprendizaje.');
            } else if (day >= 200) {
                logo.src = "gif/logo6.gif";
                logo.setAttribute('data-info', 'Logo: Dragón de Sabiduría<br>Día: ' + day + '<br>Descripción: Este dragón representa tu sabiduría, tu fuerza y tu dominio de grandes conocimientos.');
            }
        });
    }
    
    // Chat mejorado con funcionalidad real
    const openChatBtn = document.getElementById('openChatBtn');
    const chatModal = document.getElementById('chatModal');
    const closeChatBtn = document.getElementById('closeChatBtn');
    const sendBtn = document.getElementById('sendBtn');
    const chatBox = document.getElementById('chatBox');
    const messageInput = document.getElementById('messageInput');

    // Mensajes predefinidos del bot
    const botResponses = [
        "¡Hola! Soy el asistente virtual de Wawita. ¿En qué puedo ayudarte?",
        "¿Necesitas información sobre nuestros cursos?",
        "¿Tienes alguna pregunta sobre las tutorías?",
        "Puedo ayudarte con información sobre pagos y planes.",
        "¿Te gustaría saber más sobre nuestros tutores?",
        "¿Necesitas ayuda técnica con la plataforma?",
        "Estoy aquí para resolver tus dudas. ¿Qué necesitas saber?",
        "¿Quieres conocer más sobre nuestras metodologías de enseñanza?"
    ];

    let chatHistory = JSON.parse(localStorage.getItem('wawita_chat_history')) || [];
    let isFirstMessage = true;

    // Abrir el modal
    if (openChatBtn) {
        openChatBtn.addEventListener('click', () => {
            chatModal.style.display = 'block';
            loadChatHistory();
            if (isFirstMessage && chatHistory.length === 0) {
                setTimeout(() => {
                    addBotMessage("¡Hola! Soy el asistente virtual de Wawita. ¿En qué puedo ayudarte hoy? 😊");
                }, 500);
                isFirstMessage = false;
            }
            messageInput.focus();
        });
    }

    // Cerrar el modal
    if (closeChatBtn) {
        closeChatBtn.addEventListener('click', () => {
            chatModal.style.display = 'none';
        });
    }

    // Enviar mensaje
    if (sendBtn) {
        sendBtn.addEventListener('click', sendMessage);
    }

    if (messageInput) {
        messageInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                sendMessage();
            }
        });
    }

    function sendMessage() {
        const message = messageInput.value.trim();
        if (message) {
            addUserMessage(message);
            messageInput.value = '';
            
            // Simular respuesta del bot después de un delay
            setTimeout(() => {
                const response = generateBotResponse(message);
                addBotMessage(response);
            }, 1000 + Math.random() * 1000);
        }
    }

    function addUserMessage(message) {
        const messageData = {
            type: 'user',
            message: message,
            timestamp: new Date().toISOString()
        };
        
        chatHistory.push(messageData);
        saveChatHistory();
        displayMessage(messageData);
    }

    function addBotMessage(message) {
        const messageData = {
            type: 'bot',
            message: message,
            timestamp: new Date().toISOString()
        };
        
        chatHistory.push(messageData);
        saveChatHistory();
        displayMessage(messageData);
    }

    function displayMessage(messageData) {
        const messageDiv = document.createElement('div');
        messageDiv.style.cssText = `
            margin: 10px 0;
            padding: 12px 16px;
            border-radius: 18px;
            max-width: 80%;
            word-wrap: break-word;
            animation: fadeInUp 0.3s ease;
            ${messageData.type === 'user' ? 
                'background: linear-gradient(135deg, #00796b, #004d40); color: white; margin-left: auto; text-align: right;' : 
                'background: #f0f0f0; color: #333; margin-right: auto;'
            }
        `;
        
        const time = new Date(messageData.timestamp).toLocaleTimeString('es-ES', {
            hour: '2-digit',
            minute: '2-digit'
        });
        
        messageDiv.innerHTML = `
            <div style="font-size: 14px; line-height: 1.4;">
                ${messageData.type === 'bot' ? '🤖 ' : ''}${messageData.message}
            </div>
            <div style="font-size: 11px; opacity: 0.7; margin-top: 4px;">
                ${time}
            </div>
        `;
        
        chatBox.appendChild(messageDiv);
        chatBox.scrollTop = chatBox.scrollHeight;
    }

    function generateBotResponse(userMessage) {
        const message = userMessage.toLowerCase();
        
        if (message.includes('hola') || message.includes('buenos') || message.includes('saludos')) {
            return "¡Hola! 👋 Bienvenido a Wawita. ¿En qué puedo ayudarte hoy?";
        } else if (message.includes('curso') || message.includes('clase')) {
            return "Tenemos cursos de Matemáticas, Ciencias, Historia, Lenguaje y más. ¿Te interesa alguna materia en particular? 📚";
        } else if (message.includes('precio') || message.includes('costo') || message.includes('pago')) {
            return "Ofrecemos diferentes planes: Básico (4 sesiones - $15), Intermedio (8 sesiones - $30) y Avanzado (12 sesiones - $50). ¿Te gustaría más información? 💰";
        } else if (message.includes('tutor') || message.includes('profesor')) {
            return "Nuestros tutores son profesionales certificados con amplia experiencia. Puedes ver sus perfiles en la sección de galería. 👨‍🏫👩‍🏫";
        } else if (message.includes('horario') || message.includes('tiempo')) {
            return "Nuestros horarios son flexibles. Puedes agendar sesiones de lunes a viernes de 9:00 AM a 6:00 PM. ⏰";
        } else if (message.includes('ayuda') || message.includes('problema')) {
            return "Estoy aquí para ayudarte. ¿Podrías contarme más detalles sobre lo que necesitas? 🆘";
        } else if (message.includes('gracias') || message.includes('thank')) {
            return "¡De nada! Es un placer ayudarte. ¿Hay algo más en lo que pueda asistirte? 😊";
        } else if (message.includes('adiós') || message.includes('bye') || message.includes('chao')) {
            return "¡Hasta luego! Que tengas un excelente día. No dudes en contactarnos si necesitas algo más. 👋";
        } else {
            return botResponses[Math.floor(Math.random() * botResponses.length)];
        }
    }

    function loadChatHistory() {
        chatBox.innerHTML = '';
        if (chatHistory.length === 0) {
            chatBox.innerHTML = '<div style="color: #666; font-style: italic; text-align: center; margin-top: 100px;">¡Bienvenido al chat! Escribe un mensaje para comenzar. 💬</div>';
        } else {
            chatHistory.forEach(messageData => {
                displayMessage(messageData);
            });
        }
    }

    function saveChatHistory() {
        localStorage.setItem('wawita_chat_history', JSON.stringify(chatHistory));
    }

    // Cerrar el modal si se hace clic fuera de él
    window.addEventListener('click', (event) => {
        if (event.target === chatModal) {
            chatModal.style.display = 'none';
        }
    });

    changeLogo(currentDay);

    // Método para hacer clic en el logo y mostrar el box con el logo ampliado y la información
    logos.forEach(logo => {
        logo.addEventListener('click', function () {
            const overlay = document.createElement('div');
            overlay.classList.add('overlay');
            document.body.appendChild(overlay);

            const overlayBox = document.createElement('div');
            overlayBox.classList.add('overlay-box');
            overlay.appendChild(overlayBox);

            const fullScreenLogo = document.createElement('img');
            fullScreenLogo.src = logo.src;
            fullScreenLogo.classList.add('fullscreen-logo');
            overlayBox.appendChild(fullScreenLogo);

            const info = document.createElement('div');
            info.classList.add('info');
            info.innerHTML = logo.getAttribute('data-info');
            overlayBox.appendChild(info);

            overlay.addEventListener('click', function (e) {
                if (e.target === overlay) {
                    document.body.removeChild(overlay);
                }
            });
        });
    });

    // Verificar la hora cada minuto y actualizar el día si es necesario
    setInterval(function () {
        const now = new Date();
        if (now.getHours() === 0 && now.getMinutes() === 0) {
            currentDay++;
            changeLogo(currentDay);
        }
    }, 60000); 

    // Agregar estilos para las animaciones del chat
    const chatStyles = document.createElement('style');
    chatStyles.textContent = `
        @keyframes fadeInUp {
            from {
                opacity: 0;
                transform: translateY(10px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }
    `;
    document.head.appendChild(chatStyles);
});