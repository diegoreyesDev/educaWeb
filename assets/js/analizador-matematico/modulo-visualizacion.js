// modulo-visualizacion.js - VERSIÓN MEJORADA Y COMPLETA
class ModuloVisualizacion {
    mostrarAnalisis(pasos, expresionOriginal) {
        console.log('🎨 Mostrando análisis con', pasos.length, 'pasos');
        const contenedor = document.getElementById('analisis-dinamico');
        if (!contenedor) {
            console.error('❌ No se encontró el contenedor de análisis');
            return;
        }
        
        contenedor.innerHTML = this.generarInterfazAnalisis(pasos, expresionOriginal);
        
        const estadoAnalisis = document.getElementById('estado-analisis');
        if (estadoAnalisis) {
            estadoAnalisis.textContent = 'Análisis completado';
        }
        
        console.log('✅ Análisis visualizado correctamente');
    }

    generarInterfazAnalisis(pasos, expresionOriginal) {
        return `
            <div class="analisis-container">
                <div class="card mb-4">
                    <div class="card-header bg-primary text-white">
                        <h5 class="mb-0">🧮 Análisis Psicopedagógico</h5>
                    </div>
                    <div class="card-body">
                        <div class="expresion-original text-center mb-3">
                            <h4 class="text-dark">${expresionOriginal}</h4>
                        </div>
                        <div class="progreso-pasos text-center">
                            <small class="text-muted">Total de pasos: ${pasos.length}</small>
                        </div>
                    </div>
                </div>
                
                <div id="contenedor-pasos-detallados">
                    ${pasos.map((paso, index) => this.generarPasoHTML(paso, index)).join('')}
                </div>
            </div>
        `;
    }

    generarPasoHTML(paso, index) {
        const icono = this.obtenerIconoPorTipo(paso.titulo);
        const claseCard = this.obtenerClaseCardPorTipo(paso.titulo);
        const claseHeader = this.obtenerClaseHeaderPorTipo(paso.titulo);
        
        return `
            <div class="paso-analisis mb-4" data-paso-index="${index}" data-paso-tipo="${paso.tipo || 'general'}">
                <div class="card ${claseCard}">
                    <div class="card-header ${claseHeader} d-flex align-items-center">
                        <div class="numero-paso bg-white text-dark rounded-circle d-flex align-items-center justify-content-center me-3" 
                             style="width: 35px; height: 35px; font-weight: bold;">
                            ${index + 1}
                        </div>
                        <div class="d-flex align-items-center">
                            <div class="me-2">${icono}</div>
                            <h6 class="mb-0">${paso.titulo}</h6>
                        </div>
                    </div>
                    <div class="card-body">
                        ${paso.contenido}
                        ${this.generarInformacionAdicional(paso)}
                    </div>
                </div>
            </div>
        `;
    }

    obtenerIconoPorTipo(titulo) {
        if (titulo.includes('Estructural')) return '🔍';
        if (titulo.includes('Dividir')) return '📝';
        if (titulo.includes('Paréntesis')) return '📦';
        if (titulo.includes('Raíz')) return '√';
        if (titulo.includes('Potencia')) return '⚡';
        if (titulo.includes('Multiplicación') || titulo.includes('División')) return '✖️';
        if (titulo.includes('Suma') || titulo.includes('Resta')) return '➕';
        if (titulo.includes('Resultado') || titulo.includes('Completado')) return '🎉';
        return '📌';
    }

    obtenerClaseCardPorTipo(titulo) {
        if (titulo.includes('Estructural')) return 'border-info';
        if (titulo.includes('Dividir')) return 'border-warning';
        if (titulo.includes('Paréntesis')) return 'border-primary';
        if (titulo.includes('Raíz')) return 'border-success';
        if (titulo.includes('Potencia')) return 'border-danger';
        if (titulo.includes('Multiplicación') || titulo.includes('División')) return 'border-info';
        if (titulo.includes('Suma') || titulo.includes('Resta')) return 'border-secondary';
        if (titulo.includes('Resultado') || titulo.includes('Completado')) return 'border-success';
        return '';
    }

    obtenerClaseHeaderPorTipo(titulo) {
        if (titulo.includes('Estructural')) return 'bg-info text-white';
        if (titulo.includes('Dividir')) return 'bg-warning text-dark';
        if (titulo.includes('Paréntesis')) return 'bg-primary text-white';
        if (titulo.includes('Raíz')) return 'bg-success text-white';
        if (titulo.includes('Potencia')) return 'bg-danger text-white';
        if (titulo.includes('Multiplicación') || titulo.includes('División')) return 'bg-info text-white';
        if (titulo.includes('Suma') || titulo.includes('Resta')) return 'bg-secondary text-white';
        if (titulo.includes('Resultado') || titulo.includes('Completado')) return 'bg-success text-white';
        return 'bg-dark text-white';
    }

    generarInformacionAdicional(paso) {
        let adicional = '';
        
        // Si es un paso de resolución, mostrar la transición de expresión
        if (paso.tipo && paso.expresionOriginal && paso.expresionSimplificada) {
            adicional = this.generarTransicionExpresion(paso);
        }
        
        // Si hay operación específica, destacarla
        if (paso.operacion) {
            adicional += this.generarDestacadoOperacion(paso.operacion);
        }
        
        return adicional;
    }

    generarTransicionExpresion(paso) {
        return `
            <div class="transicion-expresion mt-3 p-3 bg-light rounded">
                <h6>🔄 Progreso de la Expresión</h6>
                <div class="row align-items-center">
                    <div class="col-md-5">
                        <div class="expresion-anterior">
                            <strong>Antes:</strong>
                            <div class="expresion-expandida p-2 bg-white border rounded mt-1">
                                <code>${paso.expresionOriginal}</code>
                            </div>
                        </div>
                    </div>
                    <div class="col-md-2 text-center">
                        <div class="flecha-transicion fs-3 text-primary">→</div>
                        <small class="text-muted">simplificado</small>
                    </div>
                    <div class="col-md-5">
                        <div class="expresion-simplificada">
                            <strong>Después:</strong>
                            <div class="expresion-simplificada p-2 bg-success text-white border rounded mt-1">
                                <code>${paso.expresionSimplificada}</code>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    generarDestacadoOperacion(operacion) {
        return `
            <div class="operacion-destacada mt-3 p-3 bg-primary text-white rounded">
                <div class="d-flex align-items-center">
                    <div class="me-3">📝</div>
                    <div>
                        <strong>Operación realizada:</strong>
                        <div class="fs-5 mt-1">${operacion}</div>
                    </div>
                </div>
            </div>
        `;
    }

    actualizarVistaPasos(pasoActual) {
        console.log('🔄 Actualizando vista al paso:', pasoActual + 1);
        const pasos = document.querySelectorAll('.paso-analisis');
        
        pasos.forEach((paso, index) => {
            const card = paso.querySelector('.card');
            if (index === pasoActual) {
                // Paso activo
                card.style.transform = 'scale(1.02)';
                card.style.boxShadow = '0 4px 8px rgba(0,0,0,0.15)';
                card.style.transition = 'all 0.3s ease';
                paso.scrollIntoView({ behavior: 'smooth', block: 'center' });
            } else {
                // Pasos inactivos
                card.style.transform = 'scale(1)';
                card.style.boxShadow = 'none';
            }
        });

        this.actualizarBarraProgreso(pasoActual, pasos.length);
    }

    actualizarBarraProgreso(pasoActual, totalPasos) {
        let barraProgreso = document.getElementById('barra-progreso-pasos');
        
        if (!barraProgreso) {
            // Crear barra de progreso si no existe
            barraProgreso = document.createElement('div');
            barraProgreso.id = 'barra-progreso-pasos';
            barraProgreso.className = 'progress mb-3';
            barraProgreso.innerHTML = `
                <div class="progress-bar" role="progressbar" style="width: 0%"></div>
            `;
            
            const contenedorAnalisis = document.getElementById('analisis-dinamico');
            if (contenedorAnalisis) {
                contenedorAnalisis.insertBefore(barraProgreso, contenedorAnalisis.firstChild);
            }
        }

        const porcentaje = ((pasoActual + 1) / totalPasos) * 100;
        const progressBar = barraProgreso.querySelector('.progress-bar');
        progressBar.style.width = `${porcentaje}%`;
        progressBar.textContent = `Paso ${pasoActual + 1} de ${totalPasos}`;
    }

    mostrarError(mensaje) {
        const contenedor = document.getElementById('analisis-dinamico');
        if (!contenedor) return;
        
        contenedor.innerHTML = `
            <div class="error-container">
                <div class="alert alert-danger">
                    <div class="d-flex align-items-center">
                        <div class="me-3">❌</div>
                        <div>
                            <h5 class="alert-heading">Error en el Análisis</h5>
                            <p class="mb-2">${mensaje}</p>
                            <div class="mt-3">
                                <button class="btn btn-warning me-2" onclick="window.analizador.reiniciarAnalisis()">
                                    🔄 Intentar de Nuevo
                                </button>
                                <button class="btn btn-outline-secondary" onclick="this.parentElement.parentElement.parentElement.style.display='none'">
                                    Cerrar
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
                
                <div class="card mt-3">
                    <div class="card-body">
                        <h6>💡 Sugerencias:</h6>
                        <ul>
                            <li>Verifica que la expresión esté bien escrita</li>
                            <li>Asegúrate de que los paréntesis estén balanceados</li>
                            <li>Usa ejemplos simples como "2+3" para empezar</li>
                            <li>Revisa que los operadores sean válidos (+, -, ×, ÷, √, ², ³)</li>
                        </ul>
                    </div>
                </div>
            </div>
        `;
        
        const estadoAnalisis = document.getElementById('estado-analisis');
        if (estadoAnalisis) estadoAnalisis.textContent = 'Error en el análisis';
    }

    // Método para resaltar elementos específicos en las expresiones
    resaltarElementoExpresion(expresion, elemento) {
        // Resaltar el elemento que se está resolviendo
        const regex = new RegExp(`(${elemento})`, 'g');
        return expresion.replace(regex, '<mark class="bg-warning">$1</mark>');
    }
}