document.addEventListener('DOMContentLoaded', function() {
    const loginForm = document.getElementById('loginForm');
    const registerForm = document.getElementById('registerForm');
    const formTitle = document.getElementById('formTitle');
    const formSubtitle = document.getElementById('formSubtitle');
    const showRegisterForm = document.getElementById('showRegisterForm');
    const showLoginForm = document.getElementById('showLoginForm');

    // Elementos del formulario de login
    const emailInput = document.getElementById('email');
    const passwordInput = document.getElementById('password');
    const emailError = document.getElementById('emailError');
    const passwordError = document.getElementById('passwordError');

    // Elementos del formulario de registro
    const regNameInput = document.getElementById('regName');
    const regEmailInput = document.getElementById('regEmail');
    const regPasswordInput = document.getElementById('regPassword');
    const regConfirmPasswordInput = document.getElementById('regConfirmPassword');
    const userRoleInput = document.getElementById('userRole');

    // Cambiar entre formularios
    showRegisterForm.addEventListener('click', (e) => {
        e.preventDefault();
        loginForm.style.display = 'none';
        registerForm.style.display = 'block';
        formTitle.textContent = 'Crear Cuenta';
        formSubtitle.textContent = 'Únete a la comunidad Wawita';
    });

    showLoginForm.addEventListener('click', (e) => {
        e.preventDefault();
        registerForm.style.display = 'none';
        loginForm.style.display = 'block';
        formTitle.textContent = 'Bienvenido a Wawita';
        formSubtitle.textContent = 'Inicia sesión para acceder a tu cuenta';
    });

    // Validación en tiempo real para login
    emailInput.addEventListener('input', validateEmail);
    passwordInput.addEventListener('input', validatePassword);
    emailInput.addEventListener('blur', validateEmail);
    passwordInput.addEventListener('blur', validatePassword);

    // Validación en tiempo real para registro
    regNameInput.addEventListener('input', validateRegName);
    regEmailInput.addEventListener('input', validateRegEmail);
    regPasswordInput.addEventListener('input', validateRegPassword);
    regConfirmPasswordInput.addEventListener('input', validateRegConfirmPassword);
    userRoleInput.addEventListener('change', validateUserRole);

    // Envío del formulario de login
    loginForm.addEventListener('submit', handleLogin);

    // Envío del formulario de registro
    registerForm.addEventListener('submit', handleRegister);

    // Botones de redes sociales
    document.querySelector('.google-btn').addEventListener('click', () => socialLogin('Google'));
    document.querySelector('.facebook-btn').addEventListener('click', () => socialLogin('Facebook'));
    document.querySelector('.microsoft-btn').addEventListener('click', () => socialLogin('Microsoft'));

    // Funciones de validación para login
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

    // Funciones de validación para registro
    function validateRegName() {
        const name = regNameInput.value.trim();
        const nameError = document.getElementById('regNameError');
        
        if (!name) {
            showError(regNameInput, nameError, 'El nombre es requerido');
            return false;
        } else if (name.length < 2) {
            showError(regNameInput, nameError, 'El nombre debe tener al menos 2 caracteres');
            return false;
        } else {
            showSuccess(regNameInput, nameError);
            return true;
        }
    }

    function validateRegEmail() {
        const email = regEmailInput.value.trim();
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const emailError = document.getElementById('regEmailError');
        
        if (!email) {
            showError(regEmailInput, emailError, 'El correo electrónico es requerido');
            return false;
        } else if (!emailRegex.test(email)) {
            showError(regEmailInput, emailError, 'Ingresa un correo electrónico válido');
            return false;
        } else {
            // Verificar si el email ya existe
            const users = JSON.parse(localStorage.getItem('wawita_users')) || [];
            const emailExists = users.some(user => user.email === email);
            if (emailExists) {
                showError(regEmailInput, emailError, 'Este correo ya está registrado');
                return false;
            }
            showSuccess(regEmailInput, emailError);
            return true;
        }
    }

    function validateRegPassword() {
        const password = regPasswordInput.value;
        const passwordError = document.getElementById('regPasswordError');
        
        if (!password) {
            showError(regPasswordInput, passwordError, 'La contraseña es requerida');
            return false;
        } else if (password.length < 6) {
            showError(regPasswordInput, passwordError, 'La contraseña debe tener al menos 6 caracteres');
            return false;
        } else {
            showSuccess(regPasswordInput, passwordError);
            return true;
        }
    }

    function validateRegConfirmPassword() {
        const password = regPasswordInput.value;
        const confirmPassword = regConfirmPasswordInput.value;
        const confirmPasswordError = document.getElementById('regConfirmPasswordError');
        
        if (!confirmPassword) {
            showError(regConfirmPasswordInput, confirmPasswordError, 'Confirma tu contraseña');
            return false;
        } else if (password !== confirmPassword) {
            showError(regConfirmPasswordInput, confirmPasswordError, 'Las contraseñas no coinciden');
            return false;
        } else {
            showSuccess(regConfirmPasswordInput, confirmPasswordError);
            return true;
        }
    }

    function validateUserRole() {
        const role = userRoleInput.value;
        const roleError = document.getElementById('userRoleError');
        
        if (!role) {
            showError(userRoleInput, roleError, 'Selecciona tu tipo de usuario');
            return false;
        } else {
            showSuccess(userRoleInput, roleError);
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
        setLoading(loginForm, true);

        try {
            // Simular delay de autenticación
            await new Promise(resolve => setTimeout(resolve, 1500));

            // Verificar credenciales en localStorage
            const users = JSON.parse(localStorage.getItem('wawita_users')) || [];
            const user = users.find(u => u.email === email && u.password === password);
            
            if (user) {
                // Login exitoso
                const userData = {
                    id: user.id,
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
                showSuccessMessage(`¡Bienvenido ${user.name}! Redirigiendo...`);
                
                // Redirigir después de 1 segundo
                setTimeout(() => {
                    window.location.href = 'index.html';
                }, 1000);

            } else {
                // Credenciales incorrectas
                showError(emailInput, emailError, 'Credenciales incorrectas');
                showError(passwordInput, passwordError, 'Verifica tu email y contraseña');
                setLoading(loginForm, false);
            }

        } catch (error) {
            console.error('Error en el login:', error);
            showError(emailInput, emailError, 'Error del servidor. Intenta nuevamente.');
            setLoading(loginForm, false);
        }
    }

    // Manejo del registro
    async function handleRegister(e) {
        e.preventDefault();
        
        const isNameValid = validateRegName();
        const isEmailValid = validateRegEmail();
        const isPasswordValid = validateRegPassword();
        const isConfirmPasswordValid = validateRegConfirmPassword();
        const isRoleValid = validateUserRole();
        
        if (!isNameValid || !isEmailValid || !isPasswordValid || !isConfirmPasswordValid || !isRoleValid) {
            return;
        }

        const name = regNameInput.value.trim();
        const email = regEmailInput.value.trim();
        const password = regPasswordInput.value;
        const role = userRoleInput.value;

        // Mostrar loading
        setLoading(registerForm, true);

        try {
            // Simular delay de registro
            await new Promise(resolve => setTimeout(resolve, 2000));

            // Crear nuevo usuario
            const users = JSON.parse(localStorage.getItem('wawita_users')) || [];
            const newUser = {
                id: Date.now(),
                name: name,
                email: email,
                password: password,
                role: role,
                registrationDate: new Date().toISOString()
            };

            users.push(newUser);
            localStorage.setItem('wawita_users', JSON.stringify(users));

            // Mostrar mensaje de éxito
            showSuccessMessage('¡Cuenta creada exitosamente! Ahora puedes iniciar sesión.');
            
            // Cambiar al formulario de login después de 2 segundos
            setTimeout(() => {
                registerForm.style.display = 'none';
                loginForm.style.display = 'block';
                formTitle.textContent = 'Bienvenido a Wawita';
                formSubtitle.textContent = 'Inicia sesión para acceder a tu cuenta';
                
                // Pre-llenar el email en el formulario de login
                emailInput.value = email;
                
                setLoading(registerForm, false);
                registerForm.reset();
            }, 2000);

        } catch (error) {
            console.error('Error en el registro:', error);
            showError(regEmailInput, document.getElementById('regEmailError'), 'Error del servidor. Intenta nuevamente.');
            setLoading(registerForm, false);
        }
    }

    function setLoading(form, loading) {
        const btn = form.querySelector('.login-btn');
        const btnText = btn.querySelector('.btn-text');
        const btnLoading = btn.querySelector('.btn-loading');
        
        btn.disabled = loading;
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
            if (successDiv.parentNode) {
                successDiv.remove();
            }
        }, 4000);
    }

    // Login con redes sociales (simulado)
    function socialLogin(provider) {
        setLoading(loginForm, true);
        
        setTimeout(() => {
            const userData = {
                id: Date.now(),
                email: `usuario@${provider.toLowerCase()}.com`,
                name: `Usuario de ${provider}`,
                role: 'student',
                loginTime: new Date().toISOString(),
                provider: provider
            };

            sessionStorage.setItem('wawita_user', JSON.stringify(userData));
            showSuccessMessage(`¡Conectado con ${provider}! Redirigiendo...`);
            
            setTimeout(() => {
                window.location.href = 'index.html';
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
                window.location.href = 'index.html';
            }, 1500);
        }
    }

    // Inicializar
    checkExistingSession();
});

// Funciones para alternar visibilidad de contraseña
function togglePassword() {
    const passwordInput = document.getElementById('password');
    const toggleBtn = passwordInput.nextElementSibling;
    
    if (passwordInput.type === 'password') {
        passwordInput.type = 'text';
        toggleBtn.textContent = '🙈';
    } else {
        passwordInput.type = 'password';
        toggleBtn.textContent = '👁️';
    }
}

function toggleRegisterPassword() {
    const passwordInput = document.getElementById('regPassword');
    const toggleBtn = passwordInput.nextElementSibling;
    
    if (passwordInput.type === 'password') {
        passwordInput.type = 'text';
        toggleBtn.textContent = '🙈';
    } else {
        passwordInput.type = 'password';
        toggleBtn.textContent = '👁️';
    }
}

function toggleConfirmPassword() {
    const passwordInput = document.getElementById('regConfirmPassword');
    const toggleBtn = passwordInput.nextElementSibling;
    
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