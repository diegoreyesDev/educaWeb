// Actividad interactiva mejorada de fracciones con pizza - VERSION COMPLETAMENTE FUNCIONAL
document.addEventListener('DOMContentLoaded', function() {
    // Elementos DOM
    const modosJuego = document.querySelectorAll('.modo-btn');
    const contenedoresModo = document.querySelectorAll('.modo-container');
    const puntosElemento = document.getElementById('puntos');
    
    // Elementos del modo construir
    const pizzaOrigen = document.getElementById('pizzaOrigen');
    const platoDestino = document.getElementById('platoDestino');
    const fraccionNumerador = document.getElementById('fraccionNumerador');
    const fraccionDenominador = document.getElementById('fraccionDenominador');
    const porcionesActual = document.getElementById('porcionesActual');
    const porcionesNecesarias = document.getElementById('porcionesNecesarias');
    const verificarConstruirBtn = document.getElementById('verificarConstruirBtn');
    const siguienteBtn = document.getElementById('siguienteBtn');
    
    // Elementos del modo comparar
    const pizzaComparacion1 = document.getElementById('pizzaComparacion1');
    const pizzaComparacion2 = document.getElementById('pizzaComparacion2');
    const fraccionTexto1 = document.getElementById('fraccionTexto1');
    const fraccionTexto2 = document.getElementById('fraccionTexto2');
    const simbolosBtns = document.querySelectorAll('.simbolo-btn');
    const siguienteCompararBtn = document.getElementById('siguienteCompararBtn');
    
    // Elementos del modo equivalentes
    const pizzaModelo = document.getElementById('pizzaModelo');
    const fraccionModeloTexto = document.getElementById('fraccionModeloTexto');
    const opcionesEquivalentes = document.querySelectorAll('.opcion-equivalente');
    const verificarEquivalenteBtn = document.getElementById('verificarEquivalenteBtn');
    const siguienteEquivalenteBtn = document.getElementById('siguienteEquivalenteBtn');
    
    // Elementos generales
    const feedback = document.getElementById('feedback');
    const progresoActual = document.getElementById('progresoActual');
    const progresoTotal = document.getElementById('progresoTotal');
    const btnExplicacion = document.getElementById('btnExplicacion');
    const explicacion = document.getElementById('explicacion');
    
    // Estado del juego
    let estado = {
        puntos: 0,
        progreso: 0,
        maxProgreso: 10,
        modoActual: 'construir',
        
        // Estado modo construir
        construir: {
            fraccionActual: { numerador: 1, denominador: 4 },
            porcionesColocadas: 0,
            ejercicios: [
                { numerador: 1, denominador: 4 },
                { numerador: 2, denominador: 4 },
                { numerador: 3, denominador: 4 },
                { numerador: 1, denominador: 3 },
                { numerador: 2, denominador: 3 },
                { numerador: 1, denominador: 2 },
                { numerador: 2, denominador: 6 },
                { numerador: 3, denominador: 8 },
                { numerador: 5, denominador: 8 },
                { numerador: 4, denominador: 6 }
            ],
            ejercicioActual: 0
        },
        
        // Estado modo comparar
        comparar: {
            fraccion1: { numerador: 1, denominador: 2 },
            fraccion2: { numerador: 1, denominador: 4 },
            simboloCorrecto: '>',
            ejercicios: [
                { f1: {n:1,d:2}, f2: {n:1,d:4}, simbolo: '>' },
                { f1: {n:1,d:3}, f2: {n:2,d:3}, simbolo: '<' },
                { f1: {n:2,d:4}, f2: {n:1,d:2}, simbolo: '=' },
                { f1: {n:3,d:4}, f2: {n:2,d:3}, simbolo: '>' },
                { f1: {n:1,d:4}, f2: {n:1,d:5}, simbolo: '>' },
                { f1: {n:2,d:6}, f2: {n:1,d:3}, simbolo: '=' },
                { f1: {n:3,d:8}, f2: {n:2,d:4}, simbolo: '<' },
                { f1: {n:4,d:6}, f2: {n:2,d:3}, simbolo: '=' },
                { f1: {n:5,d:8}, f2: {n:3,d:4}, simbolo: '<' },
                { f1: {n:2,d:5}, f2: {n:3,d:8}, simbolo: '>' }
            ],
            ejercicioActual: 0,
            simboloSeleccionado: null
        },
        
        // Estado modo equivalentes
        equivalente: {
            fraccionModelo: { numerador: 1, denominador: 2 },
            opcionesCorrectas: ['2/4', '3/6'],
            ejercicios: [
                {
                    modelo: {n:1,d:2},
                    correctas: ['2/4', '3/6'],
                    opciones: ['2/4', '3/6', '1/3', '3/4']
                },
                {
                    modelo: {n:2,d:3},
                    correctas: ['4/6', '6/9'],
                    opciones: ['4/6', '3/4', '6/9', '1/2']
                },
                {
                    modelo: {n:3,d:4},
                    correctas: ['6/8', '9/12'],
                    opciones: ['6/8', '2/3', '9/12', '1/2']
                },
                {
                    modelo: {n:1,d:3},
                    correctas: ['2/6', '3/9'],
                    opciones: ['2/6', '2/4', '3/9', '1/2']
                },
                {
                    modelo: {n:2,d:5},
                    correctas: ['4/10', '6/15'],
                    opciones: ['4/10', '3/5', '6/15', '1/3']
                }
            ],
            ejercicioActual: 0,
            opcionesSeleccionadas: []
        }
    };

    // Inicialización
    function inicializarJuego() {
        actualizarInterfaz();
        configurarEventListeners();
        inicializarModoConstruir();
        progresoTotal.textContent = estado.maxProgreso;
    }

    // Configurar event listeners
    function configurarEventListeners() {
        // Cambio de modos
        modosJuego.forEach(boton => {
            boton.addEventListener('click', function() {
                cambiarModo(this.dataset.modo);
            });
        });

        // Botón de explicación
        btnExplicacion.addEventListener('click', function() {
            explicacion.classList.toggle('mostrar');
        });

        // Modo construir
        verificarConstruirBtn.addEventListener('click', verificarConstruir);
        siguienteBtn.addEventListener('click', siguienteConstruir);

        // Modo comparar
        simbolosBtns.forEach(boton => {
            boton.addEventListener('click', function() {
                seleccionarSimbolo(this.dataset.simbolo);
            });
        });
        siguienteCompararBtn.addEventListener('click', siguienteComparar);

        // Modo equivalentes
        opcionesEquivalentes.forEach(opcion => {
            opcion.addEventListener('click', function() {
                seleccionarEquivalente(this);
            });
        });
        verificarEquivalenteBtn.addEventListener('click', verificarEquivalente);
        siguienteEquivalenteBtn.addEventListener('click', siguienteEquivalente);

        // Configurar eventos de arrastre
        configurarArrastreSuelta();
    }

    // Cambiar entre modos de juego
    function cambiarModo(modo) {
        estado.modoActual = modo;
        
        // Actualizar botones activos
        modosJuego.forEach(boton => {
            boton.classList.toggle('active', boton.dataset.modo === modo);
        });

        // Mostrar contenedor activo
        contenedoresModo.forEach(contenedor => {
            contenedor.classList.toggle('active', contenedor.id === `modo${modo.charAt(0).toUpperCase() + modo.slice(1)}`);
        });

        // Reinicializar el modo
        switch(modo) {
            case 'construir':
                inicializarModoConstruir();
                break;
            case 'comparar':
                inicializarModoComparar();
                break;
            case 'equivalente':
                inicializarModoEquivalente();
                break;
        }

        feedback.textContent = `Modo ${modo} activado. ¡Comienza a jugar!`;
        feedback.className = 'feedback';
    }

    // ========== MODO CONSTRUIR ==========
    function inicializarModoConstruir() {
        const ejercicio = estado.construir.ejercicios[estado.construir.ejercicioActual];
        estado.construir.fraccionActual = ejercicio;
        estado.construir.porcionesColocadas = 0;

        actualizarInterfazConstruir();
        crearPizzaOrigen(ejercicio.denominador);
        limpiarPlato();
        
        feedback.textContent = "Arrastra las porciones necesarias al plato.";
        feedback.className = 'feedback';
    }

    function actualizarInterfazConstruir() {
        const frac = estado.construir.fraccionActual;
        fraccionNumerador.textContent = frac.numerador;
        fraccionDenominador.textContent = frac.denominador;
        porcionesActual.textContent = estado.construir.porcionesColocadas;
        porcionesNecesarias.textContent = frac.numerador;
    }

    function crearPizzaOrigen(denominador) {
        pizzaOrigen.innerHTML = '';
        
        // Crear porciones individuales en lugar de una pizza segmentada
        for (let i = 0; i < denominador; i++) {
            const porcion = document.createElement('div');
            porcion.className = 'porcion-individual';
            porcion.dataset.indice = i;
            porcion.style.backgroundColor = getColorPorcion(i, denominador);
            porcion.textContent = '🍕'; // Emoji de pizza para mejor visibilidad
            
            pizzaOrigen.appendChild(porcion);
        }
    }

    function getColorPorcion(indice, total) {
        const colores = ['#FF6B6B', '#4ECDC4', '#FFD166', '#6A0572', '#06D6A0', '#118AB2', '#EF476F', '#073B4C'];
        return colores[indice % colores.length];
    }

    function configurarArrastreSuelta() {
        let porcionArrastrada = null;
        let offsetX = 0, offsetY = 0;

        // Eventos para las porciones individuales
        document.addEventListener('mousedown', function(e) {
            if (e.target.classList.contains('porcion-individual')) {
                porcionArrastrada = e.target;
                porcionArrastrada.classList.add('arrastrando');
                
                const rect = porcionArrastrada.getBoundingClientRect();
                offsetX = e.clientX - rect.left;
                offsetY = e.clientY - rect.top;
                
                // Crear un clon para arrastrar
                const clon = porcionArrastrada.cloneNode(true);
                clon.style.position = 'fixed';
                clon.style.zIndex = '1000';
                clon.style.pointerEvents = 'none';
                clon.style.transform = 'scale(1.2)';
                clon.id = 'porcion-arrastrando';
                document.body.appendChild(clon);
                
                e.preventDefault();
            }
        });

        document.addEventListener('mousemove', function(e) {
            if (porcionArrastrada) {
                const clon = document.getElementById('porcion-arrastrando');
                if (clon) {
                    clon.style.left = (e.clientX - offsetX) + 'px';
                    clon.style.top = (e.clientY - offsetY) + 'px';
                }
                
                // Verificar si está sobre el plato
                const rectPlato = platoDestino.getBoundingClientRect();
                
                if (e.clientX >= rectPlato.left && e.clientX <= rectPlato.right &&
                    e.clientY >= rectPlato.top && e.clientY <= rectPlato.bottom) {
                    platoDestino.classList.add('sobre');
                } else {
                    platoDestino.classList.remove('sobre');
                }
            }
        });

        document.addEventListener('mouseup', function(e) {
            if (porcionArrastrada) {
                porcionArrastrada.classList.remove('arrastrando');
                platoDestino.classList.remove('sobre');
                
                // Eliminar el clon
                const clon = document.getElementById('porcion-arrastrando');
                if (clon) {
                    clon.remove();
                }
                
                // Verificar si está sobre el plato
                const rectPlato = platoDestino.getBoundingClientRect();
                
                if (e.clientX >= rectPlato.left && e.clientX <= rectPlato.right &&
                    e.clientY >= rectPlato.top && e.clientY <= rectPlato.bottom) {
                    // Porción colocada correctamente
                    estado.construir.porcionesColocadas++;
                    
                    // Crear representación visual en el plato
                    const porcionEnPlato = document.createElement('div');
                    porcionEnPlato.className = 'porcion-en-plato';
                    porcionEnPlato.style.backgroundColor = porcionArrastrada.style.backgroundColor;
                    porcionEnPlato.textContent = '🍕';
                    platoDestino.appendChild(porcionEnPlato);
                    
                    // Ocultar porción original
                    porcionArrastrada.style.visibility = 'hidden';
                    
                    actualizarInterfazConstruir();
                    verificarProgresoConstruir();
                }
                
                porcionArrastrada = null;
            }
        });
    }

    function verificarProgresoConstruir() {
        const necesarias = estado.construir.fraccionActual.numerador;
        const actuales = estado.construir.porcionesColocadas;
        
        if (actuales === necesarias) {
            feedback.textContent = "¡Correcto! Has colocado todas las porciones necesarias. Presiona Verificar.";
            feedback.className = 'feedback correcto';
        } else if (actuales > necesarias) {
            feedback.textContent = "¡Demasiadas porciones! Intenta nuevamente.";
            feedback.className = 'feedback incorrecto';
        }
    }

    function verificarConstruir() {
        const necesarias = estado.construir.fraccionActual.numerador;
        const actuales = estado.construir.porcionesColocadas;
        
        if (actuales === necesarias) {
            feedback.textContent = `¡Excelente! Has comprendido la fracción ${necesarias}/${estado.construir.fraccionActual.denominador}.`;
            feedback.className = 'feedback correcto';
            estado.puntos += 10;
            estado.progreso++;
            actualizarInterfaz();
            crearConfeti();
        } else {
            feedback.textContent = `La fracción requiere ${necesarias} porciones. Tienes ${actuales}. ¡Sigue intentando!`;
            feedback.className = 'feedback incorrecto';
        }
    }

    function siguienteConstruir() {
        estado.construir.ejercicioActual = (estado.construir.ejercicioActual + 1) % estado.construir.ejercicios.length;
        inicializarModoConstruir();
    }

    function limpiarPlato() {
        platoDestino.innerHTML = '<span class="instruccion-arrastre">Suelta aquí las porciones</span>';
        
        // Restaurar visibilidad de todas las porciones
        const porciones = pizzaOrigen.querySelectorAll('.porcion-individual');
        porciones.forEach(porcion => {
            porcion.style.visibility = 'visible';
        });
    }

    // ========== MODO COMPARAR ==========
    function inicializarModoComparar() {
        const ejercicio = estado.comparar.ejercicios[estado.comparar.ejercicioActual];
        estado.comparar.fraccion1 = ejercicio.f1;
        estado.comparar.fraccion2 = ejercicio.f2;
        estado.comparar.simboloCorrecto = ejercicio.simbolo;
        estado.comparar.simboloSeleccionado = null;

        actualizarInterfazComparar();
        simbolosBtns.forEach(boton => boton.classList.remove('seleccionado'));
        feedback.textContent = "Selecciona el símbolo correcto para comparar las fracciones.";
        feedback.className = 'feedback';
    }

    function actualizarInterfazComparar() {
        // Actualizar fracción 1
        const f1 = estado.comparar.fraccion1;
        fraccionTexto1.textContent = `${f1.numerador}/${f1.denominador}`;
        crearPizzaVisual(pizzaComparacion1, f1);

        // Actualizar fracción 2
        const f2 = estado.comparar.fraccion2;
        fraccionTexto2.textContent = `${f2.numerador}/${f2.denominador}`;
        crearPizzaVisual(pizzaComparacion2, f2);
    }

    function crearPizzaVisual(contenedor, fraccion) {
        contenedor.innerHTML = '';
        const { numerador, denominador } = fraccion;
        const anguloPorcion = 360 / denominador;

        // Crear fondo de pizza
        const fondo = document.createElement('div');
        fondo.className = 'pizza-fondo';
        contenedor.appendChild(fondo);

        // Crear porciones
        for (let i = 0; i < denominador; i++) {
            const porcion = document.createElement('div');
            porcion.className = 'porcion-visual';
            porcion.style.transform = `rotate(${anguloPorcion * i}deg)`;
            
            // Colorear solo las porciones que corresponden al numerador
            if (i < numerador) {
                porcion.style.backgroundColor = getColorPorcion(i, denominador);
                porcion.style.opacity = '1';
            } else {
                porcion.style.backgroundColor = '#E9C46A';
                porcion.style.opacity = '0.3';
            }
            
            contenedor.appendChild(porcion);
        }
    }

    function seleccionarSimbolo(simbolo) {
        estado.comparar.simboloSeleccionado = simbolo;
        
        simbolosBtns.forEach(boton => {
            boton.classList.toggle('seleccionado', boton.dataset.simbolo === simbolo);
        });

        // Verificar automáticamente
        verificarComparar();
    }

    function verificarComparar() {
        if (estado.comparar.simboloSeleccionado === estado.comparar.simboloCorrecto) {
            feedback.textContent = "¡Correcto! Has comparado las fracciones adecuadamente.";
            feedback.className = 'feedback correcto';
            estado.puntos += 15;
            estado.progreso++;
            actualizarInterfaz();
            crearConfeti();
        } else {
            feedback.textContent = "Intenta nuevamente. Recuerda: < significa menor, > significa mayor, = significa igual.";
            feedback.className = 'feedback incorrecto';
        }
    }

    function siguienteComparar() {
        estado.comparar.ejercicioActual = (estado.comparar.ejercicioActual + 1) % estado.comparar.ejercicios.length;
        inicializarModoComparar();
    }

    // ========== MODO EQUIVALENTES ==========
    function inicializarModoEquivalente() {
        const ejercicio = estado.equivalente.ejercicios[estado.equivalente.ejercicioActual];
        estado.equivalente.fraccionModelo = ejercicio.modelo;
        estado.equivalente.opcionesCorrectas = ejercicio.correctas;
        estado.equivalente.opcionesSeleccionadas = [];

        actualizarInterfazEquivalente();
        opcionesEquivalentes.forEach(opcion => opcion.classList.remove('seleccionada'));
        feedback.textContent = "Selecciona todas las fracciones equivalentes a la mostrada.";
        feedback.className = 'feedback';
    }

    function actualizarInterfazEquivalente() {
        // Actualizar fracción modelo
        const modelo = estado.equivalente.fraccionModelo;
        fraccionModeloTexto.textContent = `${modelo.numerador}/${modelo.denominador}`;
        crearPizzaVisual(pizzaModelo, modelo);

        // Actualizar opciones
        const ejercicio = estado.equivalente.ejercicios[estado.equivalente.ejercicioActual];
        
        opcionesEquivalentes.forEach((opcion, index) => {
            const fraccionTexto = opcion.querySelector('.fraccion-texto');
            const pizzaOpcion = opcion.querySelector('.pizza-opcion');
            
            // Asignar la fracción correspondiente al dataset
            const fraccionStr = ejercicio.opciones[index];
            opcion.dataset.fraccion = fraccionStr;
            
            // Actualizar texto
            fraccionTexto.textContent = fraccionStr;
            
            // Crear visualización de pizza
            const fraccion = parseFraccion(fraccionStr);
            crearPizzaVisual(pizzaOpcion, fraccion);
        });
    }

    function parseFraccion(texto) {
        const partes = texto.split('/');
        return { 
            numerador: parseInt(partes[0]), 
            denominador: parseInt(partes[1]) 
        };
    }

    function seleccionarEquivalente(elemento) {
        elemento.classList.toggle('seleccionada');
        const fraccion = elemento.dataset.fraccion;
        
        if (elemento.classList.contains('seleccionada')) {
            estado.equivalente.opcionesSeleccionadas.push(fraccion);
        } else {
            estado.equivalente.opcionesSeleccionadas = estado.equivalente.opcionesSeleccionadas.filter(f => f !== fraccion);
        }
    }

    function verificarEquivalente() {
        const seleccionadas = [...estado.equivalente.opcionesSeleccionadas].sort();
        const correctas = [...estado.equivalente.opcionesCorrectas].sort();
        
        // Verificar si las seleccionadas coinciden exactamente con las correctas
        const esCorrecto = seleccionadas.length === correctas.length && 
                          seleccionadas.every((val, index) => val === correctas[index]);
        
        if (esCorrecto) {
            feedback.textContent = "¡Excelente! Has identificado correctamente las fracciones equivalentes.";
            feedback.className = 'feedback correcto';
            estado.puntos += 20;
            estado.progreso++;
            actualizarInterfaz();
            crearConfeti();
        } else {
            feedback.textContent = `Las fracciones equivalentes correctas son: ${correctas.join(', ')}.`;
            feedback.className = 'feedback incorrecto';
        }
    }

    function siguienteEquivalente() {
        estado.equivalente.ejercicioActual = (estado.equivalente.ejercicioActual + 1) % estado.equivalente.ejercicios.length;
        inicializarModoEquivalente();
    }

    // ========== FUNCIONES GENERALES ==========
    function actualizarInterfaz() {
        puntosElemento.textContent = estado.puntos;
        progresoActual.textContent = estado.progreso;
    }

    function crearConfeti() {
        for (let i = 0; i < 30; i++) {
            setTimeout(() => {
                const confeti = document.createElement('div');
                confeti.className = 'confeti';
                confeti.style.left = Math.random() * 100 + 'vw';
                confeti.style.backgroundColor = getColorPorcion(i, 10);
                confeti.style.animationDelay = Math.random() * 2 + 's';
                document.body.appendChild(confeti);
                
                setTimeout(() => {
                    confeti.remove();
                }, 3000);
            }, i * 50);
        }
    }

    // Iniciar el juego
    inicializarJuego();
});