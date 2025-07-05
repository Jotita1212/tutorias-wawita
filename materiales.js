document.addEventListener('DOMContentLoaded', function () {
    const materialForm = document.getElementById('materialForm');
    
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
        window.location.href = 'login.html';
        return;
    }

    // Verificar autenticación al cargar
    if (!checkAuth()) return;
    
    // Obtener el ID del curso desde el localStorage
    const cursoID = localStorage.getItem('cursoSeleccionado');
    const cursos = JSON.parse(localStorage.getItem('cursos')) || [];
    const curso = cursos.find(c => c.id === parseInt(cursoID));

    if (!curso) {
        showError('Curso no encontrado');
        setTimeout(() => {
            window.location.href = 'galeria.html';
        }, 2000);
        return;
    }

    // Mostrar el nombre del curso para el que se está agregando material
    document.querySelector('h1').textContent = `Agregar Material para: ${curso.nombreCurso}`;

    // Llenar las opciones de semana y sesión basadas en la duración del curso
    const semanaSelect = document.getElementById('semana');
    const sesionSelect = document.getElementById('sesion');

    // Llenar las semanas (de 1 a la duración del curso)
    for (let i = 1; i <= curso.duracionCurso; i++) {
        const option = document.createElement('option');
        option.value = i;
        option.textContent = `Semana ${i}`;
        semanaSelect.appendChild(option);
    }

    // Llenar las sesiones para cada semana
    semanaSelect.addEventListener('change', function () {
        const selectedSemana = parseInt(semanaSelect.value);
        sesionSelect.innerHTML = '<option value="">Selecciona una sesión</option>';

        if (selectedSemana) {
            // Usar las sesiones por semana del curso
            for (let sesion = 1; sesion <= curso.sesionesPorSemana; sesion++) {
                const option = document.createElement('option');
                option.value = sesion;
                option.textContent = `Sesión ${sesion}`;
                sesionSelect.appendChild(option);
            }
        }
    });

    // Inicializar el evento para cargar las sesiones de la primera semana por defecto
    if (semanaSelect.children.length > 0) {
        semanaSelect.value = 1;
        semanaSelect.dispatchEvent(new Event('change'));
    }

    // Manejar el envío del formulario para registrar un nuevo material
    materialForm.addEventListener('submit', function (e) {
        e.preventDefault();

        const semana = parseInt(document.getElementById('semana').value);
        const sesion = parseInt(document.getElementById('sesion').value);
        const titulo = document.getElementById('titulo').value.trim();
        const descripcion = document.getElementById('descripcion').value.trim();
        const archivos = Array.from(document.getElementById('archivo').files);

        // Validaciones
        if (!semana) {
            showError('Selecciona una semana');
            return;
        }

        if (!sesion) {
            showError('Selecciona una sesión');
            return;
        }

        if (!titulo) {
            showError('El título es requerido');
            return;
        }

        if (!descripcion) {
            showError('La descripción es requerida');
            return;
        }

        if (archivos.length === 0) {
            showError('Selecciona al menos un archivo');
            return;
        }

        // Mostrar loading
        showLoading('Guardando material...');

        // Procesar archivos
        const procesarArchivos = archivos.map(file => {
            return new Promise((resolve) => {
                const reader = new FileReader();
                reader.onload = function(e) {
                    resolve({
                        name: file.name,
                        type: file.type,
                        size: file.size,
                        url: e.target.result,
                        uploadDate: new Date().toISOString()
                    });
                };
                reader.readAsDataURL(file);
            });
        });

        Promise.all(procesarArchivos).then(archivosData => {
            const material = {
                id: Date.now(),
                cursoID: curso.id,
                cursoNombre: curso.nombreCurso,
                semana,
                sesion,
                titulo,
                descripcion,
                archivos: archivosData,
                fechaCreacion: new Date().toISOString(),
                createdBy: getCurrentUser()?.name || 'Usuario'
            };

            // Guardar el material en la lista global de materiales
            const materials = JSON.parse(localStorage.getItem('materials')) || [];
            materials.push(material);
            localStorage.setItem('materials', JSON.stringify(materials));

            // Agregar el material dentro de la lista de materiales del curso
            const cursosActualizados = cursos.map(c => {
                if (c.id === curso.id) {
                    c.materiales = c.materiales || [];
                    c.materiales.push(material);
                }
                return c;
            });
            localStorage.setItem('cursos', JSON.stringify(cursosActualizados));

            showSuccessMessage('Material guardado exitosamente');
            materialForm.reset();
            
            // Reinicializar selects
            semanaSelect.value = '';
            sesionSelect.innerHTML = '<option value="">Selecciona una sesión</option>';
            
            // Redirigir a ver materiales después de 2 segundos
            setTimeout(() => {
                localStorage.setItem('cursoSeleccionado', cursoID);
                window.location.href = 'vermaterial.html';
            }, 2000);
        });
    });

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