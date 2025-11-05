// analisis-principal.js - VERSIÓN CORREGIDA
class AnalizadorMatematico {
    constructor() {
        console.log('🔧 Constructor AnalizadorMatematico llamado');
        this.pasos = [];
        this.expresionOriginal = '';
        this.pasoActual = 0;
        
        // Inicializar módulos
        this.utilidades = new ModuloUtilidades();
        
        // Inicializar módulos principales
        try {
            this.analizador = new Analizador();
            console.log('✅ Analizador principal inicializado');
        } catch (error) {
            console.error('❌ Error inicializando Analizador:', error);
            this.analizador = null;
        }

        try {
            this.visualizador = new ModuloVisualizacion();
            console.log('✅ Visualizador inicializado');
        } catch (error) {
            console.error('❌ Error inicializando Visualizador:', error);
            this.visualizador = null;
        }
        
        this.inicializarAnalizador();
    }

    inicializarAnalizador() {
        console.log('🔄 Inicializando analizador matemático...');
        this.inicializarEventos();
        this.inicializarNavegacion();
        
        // Hacer disponible globalmente para la calculadora
        window.analizador = this;
        console.log('✅ Analizador matemático inicializado y disponible como window.analizador');
    }

    inicializarEventos() {
        console.log('🎯 Inicializando eventos del analizador...');
        
        // Escuchar evento de la calculadora
        document.addEventListener('expresionParaAnalizar', (event) => {
            console.log('🎯 Evento expresionParaAnalizar capturado:', event.detail);
            const { expresion } = event.detail;
            this.analizarExpresionCompleta(expresion);
        });

        // También escuchar Enter en el display
        const display = document.getElementById('display-matematico');
        if (display) {
            display.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    const expresion = e.target.value.trim();
                    if (expresion) {
                        console.log('↵ Enter presionado, analizando:', expresion);
                        this.analizarExpresionCompleta(expresion);
                    }
                }
            });
        }

        console.log('✅ Eventos del analizador inicializados');
    }

    inicializarNavegacion() {
        console.log('🧭 Inicializando navegación...');
        const btnPrev = document.getElementById('btn-prev-paso');
        const btnNext = document.getElementById('btn-next-paso');
        
        if (btnPrev) {
            btnPrev.addEventListener('click', () => this.pasoAnterior());
            console.log('✅ Botón anterior configurado');
        }
        
        if (btnNext) {
            btnNext.addEventListener('click', () => this.pasoSiguiente());
            console.log('✅ Botón siguiente configurado');
        }
    }

    analizarExpresionCompleta(expresion) {
        console.log('🧮 Iniciando análisis de expresión:', expresion);
        
        try {
            this.utilidades.prepararInterfaz();
            this.expresionOriginal = expresion;
            this.pasos = [];
            this.pasoActual = 0;

            // Verificar que tenemos el analizador
            if (!this.analizador) {
                throw new Error('Analizador no está disponible');
            }

            // Usar el analizador - CORREGIDO: usar this.analizador, no this.analizadorBaldor
            this.pasos = this.analizador.analizarExpresionCompleta(expresion);
            
            // Verificar que tenemos pasos para mostrar
            if (!this.pasos || this.pasos.length === 0) {
                throw new Error('No se generaron pasos de análisis');
            }

            // Mostrar el análisis - CORREGIDO: usar método genérico
            if (this.visualizador && this.visualizador.mostrarAnalisis) {
                this.visualizador.mostrarAnalisis(this.pasos, this.expresionOriginal);
            } else {
                // Fallback: usar el método básico
                this.mostrarAnalisisBasico();
            }
            
            this.actualizarNavegacion();
            
            console.log('✅ Análisis completado con', this.pasos.length, 'pasos');
            
        } catch (error) {
            console.error('❌ Error en análisis:', error);
            this.mostrarError(`Error en el análisis: ${error.message}`);
        }
    }

    mostrarAnalisisBasico() {
        // Método de respaldo si el visualizador no funciona
        const contenedor = document.getElementById('analisis-dinamico');
        if (contenedor) {
            let html = `
                <div class="card">
                    <div class="card-header bg-primary text-white">
                        <h5>🧮 Análisis Matemático</h5>
                    </div>
                    <div class="card-body">
                        <h6>Expresión: ${this.expresionOriginal}</h6>
                        <p>Se generaron ${this.pasos.length} pasos de análisis.</p>
            `;
            
            this.pasos.forEach((paso, index) => {
                html += `
                    <div class="card mb-2">
                        <div class="card-body">
                            <h6>${paso.titulo || `Paso ${index + 1}`}</h6>
                            <div>${paso.contenido || 'Contenido no disponible'}</div>
                        </div>
                    </div>
                `;
            });
            
            html += `</div></div>`;
            contenedor.innerHTML = html;
        }
    }

    mostrarError(mensaje) {
        const contenedor = document.getElementById('analisis-dinamico');
        if (!contenedor) return;
        
        contenedor.innerHTML = `
            <div class="alert alert-danger">
                <h5>❌ Error en el Análisis</h5>
                <p>${mensaje}</p>
                <button class="btn btn-warning mt-2" onclick="window.analizador.reiniciarAnalisis()">
                    Intentar de Nuevo
                </button>
            </div>
        `;
        
        const estadoAnalisis = document.getElementById('estado-analisis');
        if (estadoAnalisis) estadoAnalisis.textContent = 'Error en el análisis';
    }

    actualizarNavegacion() {
        const btnPrev = document.getElementById('btn-prev-paso');
        const btnNext = document.getElementById('btn-next-paso');
        
        if (btnPrev) btnPrev.disabled = this.pasoActual === 0;
        if (btnNext) btnNext.disabled = this.pasoActual === this.pasos.length - 1;
        
        console.log(`🧭 Navegación: Paso ${this.pasoActual + 1} de ${this.pasos.length}`);
    }

    pasoAnterior() {
        if (this.pasoActual > 0) {
            this.pasoActual--;
            if (this.visualizador && this.visualizador.actualizarVistaPasos) {
                this.visualizador.actualizarVistaPasos(this.pasoActual);
            }
            this.actualizarNavegacion();
            console.log('⬅️ Retrocediendo al paso:', this.pasoActual + 1);
        }
    }

    pasoSiguiente() {
        if (this.pasoActual < this.pasos.length - 1) {
            this.pasoActual++;
            if (this.visualizador && this.visualizador.actualizarVistaPasos) {
                this.visualizador.actualizarVistaPasos(this.pasoActual);
            }
            this.actualizarNavegacion();
            console.log('➡️ Avanzando al paso:', this.pasoActual + 1);
        }
    }

    reiniciarAnalisis() {
        console.log('🔄 Reiniciando análisis...');
        this.utilidades.reiniciarInterfaz();
        this.pasos = [];
        this.expresionOriginal = '';
        this.pasoActual = 0;
        this.actualizarNavegacion();
    }
}

// Hacer disponible globalmente
window.AnalizadorMatematico = AnalizadorMatematico;