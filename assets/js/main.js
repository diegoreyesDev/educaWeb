// main.js - VERSIÓN COMPLETAMENTE CORREGIDA
class SistemaEducaWeb {
    constructor() {
        console.log('Iniciando Sistema EducaWeb...');
        this.calculadora = null;
        this.analizador = null;
        this.inicializarSistema();
    }

    async inicializarSistema() {
        console.log('Inicializando sistema...');
        await this.cargarComponentes();
        this.inicializarModulos();
        this.inicializarEventosGlobales();
        console.log('Sistema EducaWeb inicializado correctamente');
    }

    async cargarComponentes() {
        try {
            console.log('Cargando componentes...');
            const [headerData, footerData] = await Promise.all([
                this.cargarComponente('components/header.html'),
                this.cargarComponente('components/footer.html')
            ]);

            if (headerData) {
                document.getElementById('header').innerHTML = headerData;
                console.log('Header cargado');
            }
            if (footerData) {
                document.getElementById('footer').innerHTML = footerData;
                console.log('Footer cargado');
            }

        } catch (error) {
            console.warn('Algunos componentes no se cargaron:', error.message);
        }
    }

    async cargarComponente(url) {
        try {
            const response = await fetch(url);
            if (!response.ok) throw new Error(`HTTP ${response.status}`);
            return await response.text();
        } catch (error) {
            console.warn(`No se pudo cargar ${url}:`, error.message);
            return null;
        }
    }

    inicializarModulos() {
        console.log('🔌 Inicializando módulos...');
        const displayMatematico = document.getElementById('display-matematico');
        
        if (displayMatematico) {
            console.log('Página de canva matemático detectada');
            
            // 1. Inicializar CALCULADORA PRIMERO
            try {
                if (typeof CalculadoraCientifica !== 'undefined') {
                    this.calculadora = new CalculadoraCientifica();
                    // LLAMAR AL MÉTODO INICIALIZAR - ¡ESTO ES CRÍTICO!
                    if (this.calculadora.inicializar) {
                        this.calculadora.inicializar();
                    } else {
                        console.warn('Calculadora no tiene método inicializar');
                        // Fallback: llamar a inicializarCalculadora si existe
                        if (this.calculadora.inicializarCalculadora) {
                            this.calculadora.inicializarCalculadora();
                        }
                    }
                    console.log('Calculadora científica inicializada');
                    
                    // Hacer disponible globalmente
                    window.calculadora = this.calculadora;
                } else {
                    console.error('Clase CalculadoraCientifica no encontrada');
                }
            } catch (error) {
                console.error('Error inicializando calculadora:', error);
            }

            // 2. Inicializar ANALIZADOR DESPUÉS
            try {
                if (typeof AnalizadorMatematico !== 'undefined') {
                    this.analizador = new AnalizadorMatematico();
                    console.log('✅ Analizador matemático inicializado');
                    
                    // HACER GLOBAL EL ANALIZADOR - ¡ESTO ES CRÍTICO!
                    window.analizador = this.analizador;
                    console.log('Analizador disponible como window.analizador');
                } else {
                    console.error('Clase AnalizadorMatematico no encontrada');
                }
            } catch (error) {
                console.error('Error inicializando analizador:', error);
            }
        } else {
            console.log('No es la página del canva matemático, omitiendo módulos matemáticos');
        }
    }

    inicializarEventosGlobales() {
        console.log('Inicializando eventos globales...');
        
        // Evento para debug - mostrar estado del sistema
        document.addEventListener('sistemaListo', () => {
            console.log('Evento sistemaListo disparado');
            console.log('Estado del sistema:');
            console.log('  - Calculadora:', this.calculadora ? 'Inicializada' : 'No inicializada');
            console.log('  - Analizador:', this.analizador ? 'Inicializada' : 'No inicializada');
            console.log('  - window.analizador:', window.analizador ? 'Disponible' : 'No disponible');
        });

        // Disparar evento de sistema listo
        setTimeout(() => {
            const evento = new CustomEvent('sistemaListo', {
                detail: {
                    timestamp: new Date().toISOString(),
                    calculadora: this.calculadora !== null,
                    analizador: this.analizador !== null
                }
            });
            document.dispatchEvent(evento);
        }, 1000);

        console.log('Eventos globales inicializados');
    }
}

// INICIALIZACIÓN ROBUSTA
console.log('Script main.js cargado, esperando DOM...');

// Verificar que todos los módulos están cargados
console.log('VERIFICACIÓN DE MÓDULOS EN main.js:');
console.log('  - CalculadoraCientifica:', typeof CalculadoraCientifica);
console.log('  - AnalizadorMatematico:', typeof AnalizadorMatematico);
console.log('  - AnalizadorBaldor:', typeof AnalizadorBaldor);
console.log('  - ModuloUtilidades:', typeof ModuloUtilidades);

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function() {
        console.log('🏗️  DOM completamente cargado, iniciando sistema...');
        window.app = new SistemaEducaWeb();
    });
} else {
    // DOM ya está listo
    console.log('DOM ya está listo, iniciando sistema inmediatamente...');
    window.app = new SistemaEducaWeb();
}

// Exportar para uso global
window.SistemaEducaWeb = SistemaEducaWeb;