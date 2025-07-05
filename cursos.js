document.addEventListener('DOMContentLoaded', function () {
    const cursoForm = document.getElementById('cursoForm');
    
    // Verificar autenticación
    function checkAuth() {
        const user = sessionStorage.getItem('wawita_user') || localStorage.getItem('wawita_user');
        if (!user) {
            showAuthMessage();
            return false;
        }
        return true;
    }
    
    function showAuthMessage() {
        const authDiv = document.createElement('div');
        authDiv.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: white;
            padding: 40px;
            border-radius: 15px;
            box-shadow: 0 10px 30px rgba(0,0,0,0.3);
            text-align: center;
            z-index: 10000;
            max-width: 400px;
        `;
        authDiv.innerHTML = `
            <div style="font-size: 64px; margin-bottom: 20px;">🔐</div>
            <h2 style="color: #00796b; margin-bottom: 15px;">Acceso Restringido</h2>
            <p style="color: #666; margin-bottom: 25px;">
                Debes iniciar sesión para crear cursos.
            </p>
            <div style="display: flex; gap: 15px; justify-content: center;">
                <a href="login.html" style="
                    padding: 12px 25px;
                    background: linear-gradient(135deg, #00796b, #004d40);
                    color: white;
                    text-decoration: none;
                    border-radius: 25px;
                    font-weight: 500;
                ">Iniciar Sesión</a>
                <a href="galeria.html" style="
                    padding: 12px 25px;
                    background: #6c757d;
                    color: white;
                    text-decoration: none;
                    border-radius: 25px;
                    font-weight: 500;
                ">Volver</a>
            </div>
        `;
        document.body.appendChild(authDiv);
        return;
    }

    // Verificar autenticación al cargar
    if (!checkAuth()) return;

    // Obtener información del usuario actual
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

    // Pre-llenar el ID del tutor con el ID del usuario actual
    const currentUser = getCurrentUser();
    if (currentUser) {
        document.getElementById('tutorID').value = currentUser.id;
        document.getElementById('tutorID').readOnly = true;
        
        // Agregar información del usuario
        const userInfo = document.createElement('div');
        userInfo.style.cssText = `
            background: linear-gradient(135deg, #e8f5e8, #f0f8f0);
            padding: 15px;
            border-radius: 8px;
            margin-bottom: 20px;
            border-left: 4px solid #00796b;
        `;
        userInfo.innerHTML = `
            <p style="margin: 0; color: #00796b; font-weight: 600;">
                👤 Creando curso como: ${currentUser.name} (${currentUser.role})
            </p>
        `;
        
        const container = document.querySelector('.container');
        const form = document.getElementById('cursoForm');
        container.insertBefore(userInfo, form);
    }

    // Manejo del formulario de creación de cursos
    cursoForm.addEventListener('submit', function (e) {
        e.preventDefault();

        const tutorID = document.getElementById('tutorID').value.trim();
        const nombreCurso = document.getElementById('nombreCurso').value.trim();
        const descripcionCurso = document.getElementById('descripcionCurso').value.trim();
        const nivelCurso = document.getElementById('nivelCurso').value;
        const fondoCurso = document.getElementById('fondoCurso').files[0];
        const duracionCurso = parseInt(document.getElementById('duracionCurso').value);
        const sesionesPorSemana = parseInt(document.getElementById('sesionesPorSemana').value);
        const fechaInicio = new Date(document.getElementById('fechaInicio').value);

        // Validaciones mejoradas
        if (!nombreCurso) {
            showError('El nombre del curso es requerido');
            return;
        }

        if (!descripcionCurso) {
            showError('La descripción del curso es requerida');
            return;
        }

        if (!nivelCurso) {
            showError('Selecciona el nivel del curso');
            return;
        }

        if (!fondoCurso) {
            showError('Por favor, selecciona un fondo para el curso');
            return;
        }

        if (!duracionCurso || duracionCurso < 1) {
            showError('La duración debe ser al menos 1 semana');
            return;
        }

        if (!sesionesPorSemana || sesionesPorSemana < 1) {
            showError('Debe haber al menos 1 sesión por semana');
            return;
        }

        if (!fechaInicio || fechaInicio < new Date()) {
            showError('La fecha de inicio debe ser futura');
            return;
        }

        // Mostrar loading
        showLoading('Creando curso...');

        const reader = new FileReader();
        reader.onload = function () {
            const curso = {
                id: Date.now(),
                tutorID,
                tutorName: currentUser ? currentUser.name : 'Tutor',
                nombreCurso,
                descripcionCurso,
                nivelCurso,
                fondoCurso: reader.result,
                duracionCurso,
                sesionesPorSemana,
                fechaInicio: fechaInicio.toISOString(),
                fechaCreacion: new Date().toISOString(),
                reuniones: [],
                materiales: []
            };

            // Generar las reuniones basadas en la fecha de inicio
            for (let semana = 0; semana < duracionCurso; semana++) {
                for (let sesion = 1; sesion <= sesionesPorSemana; sesion++) {
                    const fechaReunion = new Date(fechaInicio);
                    fechaReunion.setDate(fechaInicio.getDate() + semana * 7 + (sesion - 1) * 2);
                    const roomName = `Curso-${curso.id}-Semana${semana + 1}-Sesion${sesion}`;

                    curso.reuniones.push({
                        id: Date.now() + semana * 1000 + sesion,
                        semana: semana + 1,
                        sesion,
                        fecha: fechaReunion.toISOString(),
                        roomName,
                        url: `https://meet.jit.si/${roomName}`,
                        estado: 'programada'
                    });
                }
            }

            const cursos = JSON.parse(localStorage.getItem('cursos')) || [];
            cursos.push(curso);
            localStorage.setItem('cursos', JSON.stringify(cursos));
            
            // Limpiar formulario
            cursoForm.reset();
            
            // Restaurar el ID del tutor
            if (currentUser) {
                document.getElementById('tutorID').value = currentUser.id;
            }
            
            showSuccessMessage('Curso creado con éxito');
            
            // Redirigir a la galería después de 2 segundos
            setTimeout(() => {
                window.location.href = 'galeria.html';
            }, 2000);
        };

        reader.readAsDataURL(fondoCurso);
    });

    // Funciones de utilidad
    function showError(message) {
        const errorDiv = document.createElement('div');
        errorDiv.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: linear-gradient(135deg, #f44336, #d32f2f);
            color: white;
            padding: 15px 25px;
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
            z-index: 10000;
            animation: slideInRight 0.3s ease;
        `;
        errorDiv.innerHTML = `❌ ${message}`;
        document.body.appendChild(errorDiv);

        setTimeout(() => {
            if (errorDiv.parentNode) {
                errorDiv.remove();
            }
        }, 4000);
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
        successDiv.innerHTML = `✅ ${message}`;
        document.body.appendChild(successDiv);

        setTimeout(() => {
            if (successDiv.parentNode) {
                successDiv.remove();
            }
        }, 4000);
    }

    function showLoading(message) {
        const loadingDiv = document.createElement('div');
        loadingDiv.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: linear-gradient(135deg, #00796b, #004d40);
            color: white;
            padding: 15px 25px;
            border-radius: 25px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
            z-index: 10000;
            display: flex;
            align-items: center;
            gap: 10px;
            animation: slideInRight 0.3s ease;
        `;
        loadingDiv.innerHTML = `
            <div class="loading"></div>
            ${message}
        `;
        document.body.appendChild(loadingDiv);

        setTimeout(() => {
            if (loadingDiv.parentNode) {
                loadingDiv.remove();
            }
        }, 3000);
    }

    // Agregar estilos para las animaciones
    const styles = document.createElement('style');
    styles.textContent = `
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
        
        .loading {
            display: inline-block;
            width: 16px;
            height: 16px;
            border: 2px solid rgba(255,255,255,.3);
            border-radius: 50%;
            border-top-color: white;
            animation: spin 1s ease-in-out infinite;
        }
        
        @keyframes spin {
            to { transform: rotate(360deg); }
        }
    `;
    document.head.appendChild(styles);
});