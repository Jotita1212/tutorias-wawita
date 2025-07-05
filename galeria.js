document.addEventListener('DOMContentLoaded', function () {
    const coursesContainer = document.getElementById('coursesContainer');
    let courses = JSON.parse(localStorage.getItem('cursos')) || [];
  
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
                Debes iniciar sesión para acceder a la galería de cursos y todas las funcionalidades.
            </p>
            <div style="display: flex; gap: 15px; justify-content: center;">
                <a href="login.html" style="
                    padding: 12px 25px;
                    background: linear-gradient(135deg, #00796b, #004d40);
                    color: white;
                    text-decoration: none;
                    border-radius: 25px;
                    font-weight: 500;
                    transition: all 0.3s ease;
                ">Iniciar Sesión</a>
                <a href="index.html" style="
                    padding: 12px 25px;
                    background: #6c757d;
                    color: white;
                    text-decoration: none;
                    border-radius: 25px;
                    font-weight: 500;
                ">Volver al Inicio</a>
            </div>
        `;
        document.body.appendChild(authDiv);
    }

    // Función para mostrar los cursos en la galería con diseño mejorado
    function renderCourses() {
        if (!checkAuth()) return;
        
        coursesContainer.innerHTML = '';
  
        if (courses.length === 0) {
            coursesContainer.innerHTML = `
                <div class="empty-state" style="grid-column: 1 / -1;">
                    <h3>📚 No hay cursos registrados</h3>
                    <p>¡Comienza creando tu primer curso para estudiantes!</p>
                    <a href="cursos.html" style="
                        display: inline-block;
                        margin-top: 20px;
                        padding: 15px 30px;
                        background: linear-gradient(135deg, #00796b, #004d40);
                        color: white;
                        text-decoration: none;
                        border-radius: 25px;
                        font-weight: 600;
                        transition: all 0.3s ease;
                        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
                    ">
                        ➕ Crear Primer Curso
                    </a>
                </div>
            `;
            return;
        }
  
        courses.forEach((course, index) => {
            const courseDiv = document.createElement('div');
            courseDiv.classList.add('course-card');
            courseDiv.style.animationDelay = `${index * 0.1}s`;
            
            // Calcular estadísticas del curso
            const totalMaterials = course.materiales ? course.materiales.length : 0;
            const totalMeetings = course.reuniones ? course.reuniones.length : 0;
            const startDate = new Date(course.fechaInicio);
            const formattedDate = startDate.toLocaleDateString('es-ES', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            });
            
            courseDiv.innerHTML = `
                <img src="${course.fondoCurso}" alt="Fondo del curso ${course.nombreCurso}" loading="lazy">
                <div class="course-card-content">
                    <h3>${course.nombreCurso}</h3>
                    <p>${course.descripcionCurso}</p>
                    
                    <div style="display: flex; justify-content: space-between; margin: 15px 0; font-size: 12px; color: #666;">
                        <span>📅 ${formattedDate}</span>
                        <span>⏱️ ${course.duracionCurso} semanas</span>
                    </div>
                    
                    <div style="display: flex; justify-content: space-between; margin: 10px 0; font-size: 12px; color: #666;">
                        <span>📚 ${totalMaterials} materiales</span>
                        <span>🎯 Nivel ${course.nivelCurso}</span>
                    </div>
                    
                    <div style="display: flex; justify-content: space-between; margin: 10px 0; font-size: 12px; color: #666;">
                        <span>👨‍🏫 Tutor ID: ${course.tutorID}</span>
                        <span>📹 ${totalMeetings} reuniones</span>
                    </div>
                    
                    <div class="course-card-buttons">
                        <button onclick="irAMateriales(${course.id})" title="Ver y gestionar materiales del curso">
                            📚 Ver Materiales
                        </button>
                        <button onclick="irAReuniones(${course.id})" title="Acceder a las reuniones virtuales">
                            🎥 Ver Reuniones
                        </button>
                        <button onclick="eliminarCurso(${course.id})" title="Eliminar este curso permanentemente" 
                                style="background: linear-gradient(135deg, #e57373, #d32f2f);">
                            🗑️ Eliminar Curso
                        </button>
                    </div>
                </div>
            `;
            coursesContainer.appendChild(courseDiv);
        });
    }
  
    // Función para redirigir al formulario de materiales
    window.irAMateriales = function (courseID) {
        if (!checkAuth()) return;
        
        // Mostrar loading
        showLoading('Cargando materiales...');
        
        localStorage.setItem('cursoSeleccionado', courseID);
        setTimeout(() => {
            window.location.href = 'vermaterial.html';
        }, 500);
    }
  
    // Función para redirigir a la página de reuniones
    window.irAReuniones = function (courseID) {
        if (!checkAuth()) return;
        
        // Mostrar loading
        showLoading('Accediendo a reuniones...');
        
        localStorage.setItem('cursoSeleccionado', courseID);
        setTimeout(() => {
            window.location.href = 'verreuniones.html';
        }, 500);
    }
  
    // Función para eliminar un curso con confirmación mejorada
    window.eliminarCurso = function (courseID) {
        if (!checkAuth()) return;
        
        const course = courses.find(c => c.id === courseID);
        if (!course) return;
        
        // Crear modal de confirmación personalizado
        const confirmModal = document.createElement('div');
        confirmModal.style.cssText = `
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
        
        confirmModal.innerHTML = `
            <div style="
                background: white;
                padding: 30px;
                border-radius: 15px;
                max-width: 400px;
                text-align: center;
                box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
                animation: modalSlideIn 0.3s ease;
            ">
                <div style="font-size: 48px; margin-bottom: 20px;">⚠️</div>
                <h3 style="color: #d32f2f; margin-bottom: 15px;">¿Eliminar curso?</h3>
                <p style="color: #666; margin-bottom: 10px; font-weight: 600;">${course.nombreCurso}</p>
                <p style="color: #666; margin-bottom: 25px; font-size: 14px;">
                    Esta acción eliminará permanentemente el curso y todos sus materiales asociados.
                </p>
                <div style="display: flex; gap: 15px; justify-content: center;">
                    <button onclick="cancelDelete()" style="
                        padding: 12px 25px;
                        background: #6c757d;
                        color: white;
                        border: none;
                        border-radius: 25px;
                        cursor: pointer;
                        font-weight: 500;
                        transition: all 0.3s ease;
                    ">Cancelar</button>
                    <button onclick="confirmDelete(${courseID})" style="
                        padding: 12px 25px;
                        background: linear-gradient(135deg, #e57373, #d32f2f);
                        color: white;
                        border: none;
                        border-radius: 25px;
                        cursor: pointer;
                        font-weight: 500;
                        transition: all 0.3s ease;
                    ">Eliminar</button>
                </div>
            </div>
        `;
        
        document.body.appendChild(confirmModal);
        
        // Funciones para el modal
        window.cancelDelete = function() {
            document.body.removeChild(confirmModal);
        };
        
        window.confirmDelete = function(courseID) {
            // Filtrar el curso que queremos eliminar
            const updatedCourses = courses.filter(course => course.id !== courseID);
            localStorage.setItem('cursos', JSON.stringify(updatedCourses));
            courses = updatedCourses;
  
            // También eliminar los materiales asociados a este curso
            const updatedMaterials = JSON.parse(localStorage.getItem('materials')) || [];
            const materialsToKeep = updatedMaterials.filter(material => material.cursoID !== courseID);
            localStorage.setItem('materials', JSON.stringify(materialsToKeep));
  
            // Cerrar modal y mostrar mensaje de éxito
            document.body.removeChild(confirmModal);
            showSuccessMessage('Curso eliminado exitosamente');
            
            // Recargar los cursos después de eliminar
            setTimeout(() => {
                renderCourses();
            }, 500);
        };
    }
    
    // Función para mostrar mensajes de loading
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
        }, 2000);
    }
    
    // Función para mostrar mensajes de éxito
    function showSuccessMessage(message) {
        const successDiv = document.createElement('div');
        successDiv.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: linear-gradient(135deg, #4caf50, #45a049);
            color: white;
            padding: 15px 25px;
            border-radius: 25px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
            z-index: 10000;
            animation: slideInRight 0.3s ease;
        `;
        successDiv.innerHTML = `✅ ${message}`;
        document.body.appendChild(successDiv);

        setTimeout(() => {
            successDiv.remove();
        }, 3000);
    }
    
    // Función para cerrar modal de materiales
    window.closeMaterialsModal = function() {
        const modal = document.getElementById('materialsModal');
        if (modal) {
            modal.style.display = 'none';
        }
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
    
    // Cargar los cursos al iniciar
    renderCourses();
});