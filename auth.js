// Sistema de autenticación global
document.addEventListener('DOMContentLoaded', function() {
    const userBar = document.getElementById('userBar');
    const userName = document.getElementById('userName');
    const userRole = document.getElementById('userRole');
    const authMenuItem = document.getElementById('authMenuItem');
    const logoutBtn = document.getElementById('logoutBtn');

    // Verificar estado de autenticación
    function checkAuthStatus() {
        const user = getCurrentUser();
        
        if (user) {
            showUserBar(user);
        } else {
            hideUserBar();
        }
    }

    // Obtener usuario actual
    function getCurrentUser() {
        const sessionUser = sessionStorage.getItem('wawita_user');
        const localUser = localStorage.getItem('wawita_user');
        
        if (sessionUser) {
            return JSON.parse(sessionUser);
        } else if (localUser) {
            return JSON.parse(localUser);
        }
        
        return null;
    }

    // Mostrar barra de usuario
    function showUserBar(user) {
        if (userBar && userName && userRole && authMenuItem) {
            userBar.style.display = 'flex';
            userName.textContent = user.name;
            
            // Configurar rol con emoji
            const roleEmojis = {
                'student': '🎓 Estudiante',
                'tutor': '👨‍🏫 Tutor',
                'admin': '👑 Administrador'
            };
            
            userRole.textContent = roleEmojis[user.role] || '👤 Usuario';
            
            // Cambiar el menú de autenticación
            authMenuItem.innerHTML = `<a href="#" onclick="showUserProfile()">Mi Perfil</a>`;
        }
    }

    // Ocultar barra de usuario
    function hideUserBar() {
        if (userBar && authMenuItem) {
            userBar.style.display = 'none';
            authMenuItem.innerHTML = '<a href="login.html">Iniciar Sesión</a>';
        }
    }

    // Cerrar sesión
    function logout() {
        // Limpiar datos de sesión
        sessionStorage.removeItem('wawita_user');
        localStorage.removeItem('wawita_user');
        localStorage.removeItem('wawita_remember');
        
        // Mostrar mensaje
        showMessage('Sesión cerrada exitosamente', 'success');
        
        // Actualizar UI
        hideUserBar();
        
        // Redirigir después de un momento
        setTimeout(() => {
            window.location.href = 'index.html';
        }, 1500);
    }

    // Mostrar perfil de usuario
    window.showUserProfile = function() {
        const user = getCurrentUser();
        if (!user) return;
        
        const profileModal = document.createElement('div');
        profileModal.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.7);
            display: flex;
            justify-content: center;
            align-items: center;
            z-index: 10000;
            backdrop-filter: blur(5px);
        `;
        
        profileModal.innerHTML = `
            <div style="
                background: white;
                padding: 30px;
                border-radius: 15px;
                max-width: 400px;
                width: 90%;
                text-align: center;
                box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
            ">
                <div style="font-size: 64px; margin-bottom: 20px;">👤</div>
                <h2 style="color: #00796b; margin-bottom: 20px;">Mi Perfil</h2>
                <div style="text-align: left; margin-bottom: 25px;">
                    <p style="margin: 10px 0;"><strong>Nombre:</strong> ${user.name}</p>
                    <p style="margin: 10px 0;"><strong>Email:</strong> ${user.email}</p>
                    <p style="margin: 10px 0;"><strong>Rol:</strong> ${user.role}</p>
                    <p style="margin: 10px 0;"><strong>Registro:</strong> ${user.registrationDate ? new Date(user.registrationDate).toLocaleDateString() : 'N/A'}</p>
                    <p style="margin: 10px 0;"><strong>Último acceso:</strong> ${new Date(user.loginTime).toLocaleDateString()}</p>
                </div>
                <div style="display: flex; gap: 15px; justify-content: center;">
                    <button onclick="closeProfileModal()" style="
                        padding: 12px 25px;
                        background: #6c757d;
                        color: white;
                        border: none;
                        border-radius: 25px;
                        cursor: pointer;
                        font-weight: 500;
                    ">Cerrar</button>
                    <button onclick="editProfile()" style="
                        padding: 12px 25px;
                        background: linear-gradient(135deg, #00796b, #004d40);
                        color: white;
                        border: none;
                        border-radius: 25px;
                        cursor: pointer;
                        font-weight: 500;
                    ">Editar</button>
                </div>
            </div>
        `;
        
        document.body.appendChild(profileModal);
        
        // Cerrar modal
        window.closeProfileModal = function() {
            document.body.removeChild(profileModal);
        };
        
        // Editar perfil (funcionalidad básica)
        window.editProfile = function() {
            showMessage('Funcionalidad de edición próximamente', 'info');
            closeProfileModal();
        };
        
        // Cerrar al hacer clic fuera
        profileModal.addEventListener('click', function(e) {
            if (e.target === profileModal) {
                closeProfileModal();
            }
        });
    };

    // Función para mostrar mensajes
    function showMessage(message, type = 'info') {
        const colors = {
            'success': 'linear-gradient(135deg, #4caf50, #45a049)',
            'error': 'linear-gradient(135deg, #f44336, #d32f2f)',
            'info': 'linear-gradient(135deg, #2196f3, #1976d2)',
            'warning': 'linear-gradient(135deg, #ff9800, #f57c00)'
        };
        
        const messageDiv = document.createElement('div');
        messageDiv.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: ${colors[type]};
            color: white;
            padding: 15px 25px;
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
            z-index: 10000;
            animation: slideInRight 0.3s ease;
            max-width: 300px;
        `;
        messageDiv.textContent = message;
        document.body.appendChild(messageDiv);

        setTimeout(() => {
            if (messageDiv.parentNode) {
                messageDiv.remove();
            }
        }, 4000);
    }

    // Proteger páginas que requieren autenticación
    function protectPage() {
        const protectedPages = ['galeria.html', 'cursos.html', 'materiales.html', 'vermaterial.html', 'verreuniones.html'];
        const currentPage = window.location.pathname.split('/').pop();
        
        if (protectedPages.includes(currentPage)) {
            const user = getCurrentUser();
            if (!user) {
                showMessage('Debes iniciar sesión para acceder a esta página', 'warning');
                setTimeout(() => {
                    window.location.href = 'login.html';
                }, 2000);
                return false;
            }
        }
        return true;
    }

    // Event listeners
    if (logoutBtn) {
        logoutBtn.addEventListener('click', logout);
    }

    // Verificar autenticación al cargar la página
    checkAuthStatus();
    protectPage();

    // Agregar estilos CSS para la barra de usuario
    const userBarStyles = document.createElement('style');
    userBarStyles.textContent = `
        .user-bar {
            background: linear-gradient(135deg, #00796b, #004d40);
            color: white;
            padding: 10px 20px;
            display: flex;
            justify-content: space-between;
            align-items: center;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
            position: sticky;
            top: 80px;
            z-index: 999;
        }
        
        .user-info {
            display: flex;
            align-items: center;
            gap: 10px;
        }
        
        .user-avatar {
            background: rgba(255,255,255,0.2);
            border-radius: 50%;
            width: 32px;
            height: 32px;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 16px;
        }
        
        .user-name {
            font-weight: 600;
            font-size: 16px;
        }
        
        .user-role {
            font-size: 12px;
            background: rgba(255,255,255,0.2);
            padding: 4px 8px;
            border-radius: 12px;
        }
        
        .logout-btn {
            background: rgba(255,255,255,0.2);
            color: white;
            border: none;
            padding: 8px 16px;
            border-radius: 20px;
            cursor: pointer;
            font-weight: 500;
            transition: all 0.3s ease;
        }
        
        .logout-btn:hover {
            background: rgba(255,255,255,0.3);
            transform: translateY(-1px);
        }
        
        @media (max-width: 768px) {
            .user-bar {
                padding: 8px 15px;
                top: 70px;
            }
            
            .user-name {
                font-size: 14px;
            }
            
            .user-role {
                font-size: 11px;
            }
            
            .logout-btn {
                padding: 6px 12px;
                font-size: 12px;
            }
        }
        
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
    document.head.appendChild(userBarStyles);
});