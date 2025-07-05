document.addEventListener('DOMContentLoaded', function () {
    const meetingsList = document.getElementById('meetingsList');
    
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
    document.querySelector('h1').textContent = `Reuniones de: ${curso.nombreCurso}`;

    function mostrarReuniones() {
        const reuniones = curso.reuniones || [];

        if (reuniones.length === 0) {
            meetingsList.innerHTML = `
                <div style="text-align: center; padding: 60px 20px; color: #666;">
                    <div style="font-size: 64px; margin-bottom: 20px;">🎥</div>
                    <h3 style="color: #00796b; margin-bottom: 15px;">No hay reuniones programadas</h3>
                    <p style="margin-bottom: 25px;">Las reuniones se generan automáticamente al crear el curso.</p>
                    <a href="galeria.html" style="
                        display: inline-block;
                        padding: 15px 30px;
                        background: linear-gradient(135deg, #00796b, #004d40);
                        color: white;
                        text-decoration: none;
                        border-radius: 25px;
                        font-weight: 600;
                        transition: all 0.3s ease;
                        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
                    ">
                        ← Volver a la Galería
                    </a>
                </div>
            `;
            return;
        }

        // Ordenar reuniones por fecha
        reuniones.sort((a, b) => new Date(a.fecha) - new Date(b.fecha));

        meetingsList.innerHTML = `
            <div style="margin-bottom: 30px; text-align: center;">
                <div style="display: inline-flex; gap: 15px; background: #f8f9fa; padding: 15px; border-radius: 25px; border: 1px solid #e0e0e0;">
                    <span style="color: #00796b; font-weight: 600;">📊 Total: ${reuniones.length} reuniones</span>
                    <span style="color: #666;">|</span>
                    <span style="color: #00796b; font-weight: 600;">⏱️ Duración: ${curso.duracionCurso} semanas</span>
                    <span style="color: #666;">|</span>
                    <span style="color: #00796b; font-weight: 600;">📅 ${curso.sesionesPorSemana} sesiones/semana</span>
                </div>
            </div>
            
            <div class="meetings-list">
                ${reuniones.map((reunion, index) => {
                    const fechaReunion = new Date(reunion.fecha);
                    const ahora = new Date();
                    const esPasada = fechaReunion < ahora;
                    const esHoy = fechaReunion.toDateString() === ahora.toDateString();
                    const esFutura = fechaReunion > ahora;
                    
                    let estadoColor = '#6c757d';
                    let estadoTexto = 'Programada';
                    let estadoIcon = '⏰';
                    
                    if (esPasada) {
                        estadoColor = '#dc3545';
                        estadoTexto = 'Finalizada';
                        estadoIcon = '✅';
                    } else if (esHoy) {
                        estadoColor = '#28a745';
                        estadoTexto = 'Hoy';
                        estadoIcon = '🔴';
                    } else if (esFutura) {
                        estadoColor = '#007bff';
                        estadoTexto = 'Próxima';
                        estadoIcon = '📅';
                    }
                    
                    return `
                        <div class="meeting-card" style="animation-delay: ${index * 0.1}s; ${esHoy ? 'border: 2px solid #28a745; box-shadow: 0 0 20px rgba(40, 167, 69, 0.3);' : ''}">
                            <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 15px;">
                                <h4>Semana ${reunion.semana} - Sesión ${reunion.sesion}</h4>
                                <span style="
                                    background: ${estadoColor};
                                    color: white;
                                    padding: 4px 12px;
                                    border-radius: 15px;
                                    font-size: 11px;
                                    font-weight: 600;
                                    display: flex;
                                    align-items: center;
                                    gap: 4px;
                                ">
                                    ${estadoIcon} ${estadoTexto}
                                </span>
                            </div>
                            
                            <div style="margin-bottom: 15px;">
                                <p style="margin: 8px 0; display: flex; align-items: center; gap: 8px;">
                                    <strong>📅 Fecha:</strong> 
                                    ${fechaReunion.toLocaleDateString('es-ES', { 
                                        weekday: 'long', 
                                        year: 'numeric', 
                                        month: 'long', 
                                        day: 'numeric' 
                                    })}
                                </p>
                                <p style="margin: 8px 0; display: flex; align-items: center; gap: 8px;">
                                    <strong>🕐 Hora:</strong> 
                                    ${fechaReunion.toLocaleTimeString('es-ES', { 
                                        hour: '2-digit', 
                                        minute: '2-digit' 
                                    })}
                                </p>
                                <p style="margin: 8px 0; display: flex; align-items: center; gap: 8px;">
                                    <strong>🏠 Sala:</strong> 
                                    <code style="background: #f8f9fa; padding: 2px 6px; border-radius: 4px; font-size: 12px;">
                                        ${reunion.roomName}
                                    </code>
                                </p>
                            </div>
                            
                            <div style="display: flex; gap: 10px; flex-wrap: wrap;">
                                <a href="${reunion.url}" target="_blank" class="join-btn" style="
                                    flex: 1;
                                    min-width: 150px;
                                    display: inline-flex;
                                    align-items: center;
                                    justify-content: center;
                                    gap: 8px;
                                    padding: 12px 20px;
                                    background: linear-gradient(135deg, #00796b, #004d40);
                                    color: white;
                                    text-decoration: none;
                                    border-radius: 25px;
                                    font-weight: 600;
                                    transition: all 0.3s ease;
                                    box-shadow: 0 4px 12px rgba(0, 121, 107, 0.3);
                                ">
                                    🎥 Unirse a la Reunión
                                </a>
                                
                                <button onclick="copiarEnlace('${reunion.url}')" style="
                                    padding: 12px 16px;
                                    background: #6c757d;
                                    color: white;
                                    border: none;
                                    border-radius: 25px;
                                    cursor: pointer;
                                    font-weight: 500;
                                    transition: all 0.3s ease;
                                    display: flex;
                                    align-items: center;
                                    gap: 4px;
                                " title="Copiar enlace">
                                    📋
                                </button>
                                
                                <button onclick="recordarReunion(${reunion.id}, '${reunion.roomName}', '${fechaReunion.toISOString()}')" style="
                                    padding: 12px 16px;
                                    background: #f9a825;
                                    color: white;
                                    border: none;
                                    border-radius: 25px;
                                    cursor: pointer;
                                    font-weight: 500;
                                    transition: all 0.3s ease;
                                    display: flex;
                                    align-items: center;
                                    gap: 4px;
                                " title="Recordatorio">
                                    🔔
                                </button>
                            </div>
                            
                            ${esHoy ? `
                                <div style="
                                    margin-top: 15px;
                                    padding: 10px;
                                    background: linear-gradient(135deg, #d4edda, #c3e6cb);
                                    border-radius: 8px;
                                    border-left: 4px solid #28a745;
                                    font-size: 13px;
                                    color: #155724;
                                    font-weight: 500;
                                ">
                                    🔴 ¡Reunión programada para hoy! No olvides unirte a tiempo.
                                </div>
                            ` : ''}
                        </div>
                    `;
                }).join('')}
            </div>
        `;
    }

    // Copiar enlace de reunión
    window.copiarEnlace = function(url) {
        navigator.clipboard.writeText(url).then(() => {
            showSuccessMessage('Enlace copiado al portapapeles');
        }).catch(() => {
            // Fallback para navegadores que no soportan clipboard API
            const textArea = document.createElement('textarea');
            textArea.value = url;
            document.body.appendChild(textArea);
            textArea.select();
            document.execCommand('copy');
            document.body.removeChild(textArea);
            showSuccessMessage('Enlace copiado al portapapeles');
        });
    };

    // Recordatorio de reunión
    window.recordarReunion = function(reunionId, roomName, fecha) {
        const fechaReunion = new Date(fecha);
        const ahora = new Date();
        
        if (fechaReunion <= ahora) {
            showError('No se puede programar recordatorio para reuniones pasadas');
            return;
        }
        
        // Simular programación de recordatorio
        const recordatorios = JSON.parse(localStorage.getItem('recordatorios')) || [];
        const nuevoRecordatorio = {
            id: Date.now(),
            reunionId,
            roomName,
            fecha: fecha,
            creado: new Date().toISOString()
        };
        
        recordatorios.push(nuevoRecordatorio);
        localStorage.setItem('recordatorios', JSON.stringify(recordatorios));
        
        showSuccessMessage(`Recordatorio programado para ${fechaReunion.toLocaleDateString('es-ES')}`);
    };

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
        
        .meeting-card {
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
        
        .join-btn:hover {
            background: linear-gradient(135deg, #004d40, #00251a) !important;
            transform: translateY(-2px);
            box-shadow: 0 6px 20px rgba(0, 121, 107, 0.4) !important;
        }
    `;
    document.head.appendChild(styles);

    mostrarReuniones();
});