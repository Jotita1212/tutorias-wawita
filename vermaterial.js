document.addEventListener('DOMContentLoaded', function () {
    const materialsList = document.getElementById('materialsList');
    
    // Verificar autenticación
    function checkAuth() {
        const user = sessionStorage.getItem('wawita_user') || localStorage.getItem('wawita_user');
        if (!user) {
            window.location.href = 'login.html';
            return false;
        }
        return true;
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

    // Actualizar el título con el nombre del curso
    document.querySelector('h1').textContent = `Materiales de: ${curso.nombreCurso}`;

    // Mostrar los materiales del curso
    function mostrarMateriales() {
        const materiales = curso.materiales || [];
        
        if (materiales.length === 0) {
            materialsList.innerHTML = `
                <div style="text-align: center; padding: 60px 20px; color: #666;">
                    <div style="font-size: 64px; margin-bottom: 20px;">📚</div>
                    <h3 style="color: #00796b; margin-bottom: 15px;">No hay materiales</h3>
                    <p style="margin-bottom: 25px;">Aún no se han agregado materiales para este curso.</p>
                    <button onclick="agregarMaterial()" style="
                        padding: 15px 30px;
                        background: linear-gradient(135deg, #00796b, #004d40);
                        color: white;
                        border: none;
                        border-radius: 25px;
                        cursor: pointer;
                        font-weight: 600;
                        transition: all 0.3s ease;
                        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
                    ">
                        ➕ Agregar Primer Material
                    </button>
                </div>
            `;
            return;
        }

        // Ordenar los materiales por semana y sesión
        materiales.sort((a, b) => {
            if (a.semana !== b.semana) return a.semana - b.semana;
            return a.sesion - b.sesion;
        });

        materialsList.innerHTML = materiales.map((material, index) => `
            <div class="material-card" style="animation-delay: ${index * 0.1}s;">
                <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 15px;">
                    <h4>${material.titulo}</h4>
                    <button onclick="eliminarMaterial(${material.id})" class="delete-btn" title="Eliminar material">
                        🗑️
                    </button>
                </div>
                
                <p style="margin-bottom: 15px;">${material.descripcion}</p>
                
                <div style="display: flex; justify-content: space-between; margin-bottom: 15px; font-size: 12px; color: #666;">
                    <span>📅 Semana ${material.semana}</span>
                    <span>🎯 Sesión ${material.sesion}</span>
                </div>
                
                <div style="margin-bottom: 15px;">
                    <strong style="color: #00796b;">📎 Archivos (${material.archivos.length}):</strong>
                </div>
                
                <div style="display: flex; flex-wrap: wrap; gap: 8px; margin-bottom: 15px;">
                    ${material.archivos.map(file => `
                        <div style="
                            background: #f8f9fa;
                            padding: 8px 12px;
                            border-radius: 20px;
                            border: 1px solid #e0e0e0;
                            font-size: 12px;
                            display: flex;
                            align-items: center;
                            gap: 5px;
                        ">
                            ${getFileIcon(file.type)}
                            <a href="${file.url}" download="${file.name}" style="
                                color: #00796b;
                                text-decoration: none;
                                font-weight: 500;
                                max-width: 150px;
                                overflow: hidden;
                                text-overflow: ellipsis;
                                white-space: nowrap;
                            " title="${file.name}">
                                ${file.name}
                            </a>
                            <span style="color: #999; font-size: 10px;">
                                (${formatFileSize(file.size)})
                            </span>
                        </div>
                    `).join('')}
                </div>
                
                <div style="font-size: 11px; color: #999; text-align: right;">
                    Creado por: ${material.createdBy || 'Usuario'} • 
                    ${new Date(material.fechaCreacion).toLocaleDateString('es-ES')}
                </div>
            </div>
        `).join('');
    }

    // Obtener icono según el tipo de archivo
    function getFileIcon(type) {
        if (type.includes('pdf')) return '📄';
        if (type.includes('image')) return '🖼️';
        if (type.includes('video')) return '🎥';
        if (type.includes('audio')) return '🎵';
        if (type.includes('word') || type.includes('document')) return '📝';
        if (type.includes('excel') || type.includes('spreadsheet')) return '📊';
        if (type.includes('powerpoint') || type.includes('presentation')) return '📋';
        if (type.includes('zip') || type.includes('rar')) return '📦';
        return '📎';
    }

    // Formatear tamaño de archivo
    function formatFileSize(bytes) {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    }

    // Eliminar material
    window.eliminarMaterial = function (materialID) {
        const confirmDelete = confirm('¿Estás seguro de que deseas eliminar este material?');
        if (!confirmDelete) return;

        showLoading('Eliminando material...');

        // Filtrar los materiales en la lista global de materiales
        const materials = JSON.parse(localStorage.getItem('materials')) || [];
        const updatedMaterials = materials.filter(material => material.id !== materialID);

        // Filtrar los materiales en la lista de materiales del curso
        const updatedCourses = cursos.map(c => {
            if (c.id === parseInt(cursoID)) {
                c.materiales = c.materiales.filter(material => material.id !== materialID);
            }
            return c;
        });

        // Guardar los datos actualizados en localStorage
        localStorage.setItem('materials', JSON.stringify(updatedMaterials));
        localStorage.setItem('cursos', JSON.stringify(updatedCourses));

        // Actualizar el curso local
        curso.materiales = curso.materiales.filter(material => material.id !== materialID);

        showSuccessMessage('Material eliminado exitosamente');
        
        // Volver a cargar los materiales
        setTimeout(() => {
            mostrarMateriales();
        }, 500);
    }

    // Función para redirigir al formulario de materiales
    window.agregarMaterial = function () {
        localStorage.setItem('cursoSeleccionado', cursoID);
        window.location.href = 'materiales.html';
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
        
        .material-card {
            animation: fadeInUp 0.6s ease-out;
            animation-fill-mode: both;
        }
        
        @keyframes fadeInUp {
            from {
                opacity: 0;
                transform: translateY(20px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }
    `;
    document.head.appendChild(styles);

    // Cargar los materiales al iniciar
    mostrarMateriales();
});