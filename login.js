document.addEventListener('DOMContentLoaded', function() {
    const loginForm = document.getElementById('loginForm');
    const emailInput = document.getElementById('email');
    const passwordInput = document.getElementById('password');
    const emailError = document.getElementById('emailError');
    const passwordError = document.getElementById('passwordError');
    const loginBtn = document.querySelector('.login-btn');
    const btnText = document.querySelector('.btn-text');
    const btnLoading = document.querySelector('.btn-loading');

    // Usuarios predefinidos para demostración
    const users = [
        { email: 'admin@wawita.es', password: 'admin123', role: 'admin', name: 'Administrador' },
        { email: 'tutor@wawita.es', password: 'tutor123', role: 'tutor', name: 'Tutor Demo' },
        { email: 'estudiante@wawita.es', password: 'estudiante123', role: 'student', name: 'Estudiante Demo' },
        { email: 'demo@wawita.es', password: 'demo123', role: 'demo', name: 'Usuario Demo' }
    ];

    // Validación en tiempo real
    emailInput.addEventListener('input', validateEmail);
    passwordInput.addEventListener('input', validatePassword);
    emailInput.addEventListener('blur', validateEmail);
    passwordInput.addEventListener('blur', validatePassword);

    // Envío del formulario
    loginForm.addEventListener('submit', handleLogin);

    // Botones de redes sociales
    document.querySelector('.google-btn').addEventListener('click', () => socialLogin('Google'));
    document.querySelector('.facebook-btn').addEventListener('click', () => socialLogin('Facebook'));
    document.querySelector('.microsoft-btn').addEventListener('click', () => socialLogin('Microsoft'));

    // Funciones de validación
    function validateEmail() {
        const email = emailInput.value.trim();
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        
        if (!email) {
            showError(emailInput, emailError, 'El correo electrónico es requerido');
            return false;
        } else if (!emailRegex.test(email)) {
            showError(emailInput, emailError, 'Ingresa un correo electrónico válido');
            return false;
        } else {
            showSuccess(emailInput, emailError);
            return true;
        }
    }

    function validatePassword() {
        const password = passwordInput.value;
        
        if (!password) {
            showError(passwordInput, passwordError, 'La contraseña es requerida');
            return false;
        } else if (password.length < 6) {
            showError(passwordInput, passwordError, 'La contraseña debe tener al menos 6 caracteres');
            return false;
        } else {
            showSuccess(passwordInput, passwordError);
            return true;
        }
    }

    function showError(input, errorElement, message) {
        input.parentElement.classList.remove('success');
        input.parentElement.classList.add('error');
        errorElement.textContent = message;
        errorElement.style.color = '#f44336';
    }

    function showSuccess(input, errorElement) {
        input.parentElement.classList.remove('error');
        input.parentElement.classList.add('success');
        errorElement.textContent = '';
    }

    // Manejo del login
    async function handleLogin(e) {
        e.preventDefault();
        
        const isEmailValid = validateEmail();
        const isPasswordValid = validatePassword();
        
        if (!isEmailValid || !isPasswordValid) {
            return;
        }

        const email = emailInput.value.trim();
        const password = passwordInput.value;
        const remember = document.getElementById('remember').checked;

        // Mostrar loading
        setLoading(true);

        try {
            // Simular delay de autenticación
            await new Promise(resolve => setTimeout(resolve, 1500));

            // Verificar credenciales
            const user = users.find(u => u.email === email && u.password === password);
            
            if (user) {
                // Login exitoso
                const userData = {
                    email: user.email,
                    name: user.name,
                    role: user.role,
                    loginTime: new Date().toISOString()
                };

                // Guardar datos del usuario
                if (remember) {
                    localStorage.setItem('wawita_user', JSON.stringify(userData));
                    localStorage.setItem('wawita_remember', 'true');
                } else {
                    sessionStorage.setItem('wawita_user', JSON.stringify(userData));
                }

                // Mostrar mensaje de éxito
                showSuccessMessage('¡Bienvenido! Redirigiendo...');
                
                // Redirigir después de 1 segundo
                setTimeout(() => {
                    window.location.href = 'galeria.html';
                }, 1000);

            } else {
                // Credenciales incorrectas
                showError(emailInput, emailError, 'Credenciales incorrectas');
                showError(passwordInput, passwordError, 'Verifica tu email y contraseña');
                setLoading(false);
            }

        } catch (error) {
            console.error('Error en el login:', error);
            showError(emailInput, emailError, 'Error del servidor. Intenta nuevamente.');
            setLoading(false);
        }
    }

    function setLoading(loading) {
        loginBtn.disabled = loading;
        if (loading) {
            btnText.style.display = 'none';
            btnLoading.style.display = 'inline-flex';
        } else {
            btnText.style.display = 'inline';
            btnLoading.style.display = 'none';
        }
    }

    function showSuccessMessage(message) {
        const successDiv = document.createElement('div');
        successDiv.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: linear-gradient(135deg, #4caf50, #45a049);
            color: white;
            padding: 15px 25px;
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
            z-index: 10000;
            animation: slideInRight 0.3s ease;
        `;
        successDiv.textContent = message;
        document.body.appendChild(successDiv);

        setTimeout(() => {
            successDiv.remove();
        }, 3000);
    }

    // Login con redes sociales (simulado)
    function socialLogin(provider) {
        setLoading(true);
        
        setTimeout(() => {
            const userData = {
                email: `usuario@${provider.toLowerCase()}.com`,
                name: `Usuario de ${provider}`,
                role: 'student',
                loginTime: new Date().toISOString(),
                provider: provider
            };

            sessionStorage.setItem('wawita_user', JSON.stringify(userData));
            showSuccessMessage(`¡Conectado con ${provider}! Redirigiendo...`);
            
            setTimeout(() => {
                window.location.href = 'galeria.html';
            }, 1000);
        }, 2000);
    }

    // Verificar si ya hay una sesión activa
    function checkExistingSession() {
        const savedUser = localStorage.getItem('wawita_user') || sessionStorage.getItem('wawita_user');
        const rememberMe = localStorage.getItem('wawita_remember');
        
        if (savedUser && rememberMe) {
            const userData = JSON.parse(savedUser);
            showSuccessMessage(`¡Bienvenido de nuevo, ${userData.name}!`);
            setTimeout(() => {
                window.location.href = 'galeria.html';
            }, 1500);
        }
    }

    // Mostrar credenciales de demo
    function showDemoCredentials() {
        const demoDiv = document.createElement('div');
        demoDiv.style.cssText = `
            position: fixed;
            bottom: 20px;
            left: 20px;
            background: rgba(0, 121, 107, 0.9);
            color: white;
            padding: 15px;
            border-radius: 8px;
            font-size: 12px;
            max-width: 300px;
            z-index: 1000;
        `;
        demoDiv.innerHTML = `
            <strong>🔑 Credenciales de Demo:</strong><br>
            📧 demo@wawita.es<br>
            🔒 demo123<br>
            <small style="opacity: 0.8;">Haz clic para cerrar</small>
        `;
        
        demoDiv.addEventListener('click', () => demoDiv.remove());
        document.body.appendChild(demoDiv);

        setTimeout(() => {
            if (demoDiv.parentNode) {
                demoDiv.remove();
            }
        }, 10000);
    }

    // Inicializar
    checkExistingSession();
    
    // Mostrar credenciales de demo después de 3 segundos
    setTimeout(showDemoCredentials, 3000);
});

// Función para alternar visibilidad de contraseña
function togglePassword() {
    const passwordInput = document.getElementById('password');
    const toggleBtn = document.querySelector('.toggle-password');
    
    if (passwordInput.type === 'password') {
        passwordInput.type = 'text';
        toggleBtn.textContent = '🙈';
    } else {
        passwordInput.type = 'password';
        toggleBtn.textContent = '👁️';
    }
}

// Agregar estilos para las animaciones
const style = document.createElement('style');
style.textContent = `
    @keyframes slideInRight {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
`;
document.head.appendChild(style);