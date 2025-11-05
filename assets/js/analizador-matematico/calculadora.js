// ===== CALCULADORA CIENTÍFICA - MÓDULO PRINCIPAL =====
class CalculadoraCientifica {
    constructor() {
        console.log('🔧 Constructor CalculadoraCientifica llamado');
        this.display = document.getElementById("display-matematico");
        
        if (!this.display) {
            console.error('❌ No se encontró el display matemático');
            return;
        }
        
        this.expresionActual = "";
        this.ultimoResultado = null;
        this.modoGrados = true;
        
        // NO llamar inicializarCalculadora aquí - se llamará desde main.js
        console.log('✅ Calculadora instanciada (pendiente de inicialización)');
    }

    inicializar() {
        console.log('🚀 Inicializando calculadora...');
        this.inicializarEventosTeclado();
        this.inicializarEventosBotones();
        this.inicializarEjemplosRapidos();
        this.mostrarMensajeBienvenida();
        return this;
    }

    inicializarEventosTeclado() {
        document.addEventListener("keydown", (e) => {
            this.manejarTecladoFisico(e);
        });

        this.display.addEventListener("input", (e) => {
            this.validarEntradaDirecta(e.target.value);
        });
    }

    inicializarEventosBotones() {
        console.log('🔘 Inicializando eventos de botones...');
        
        // Botones numéricos y operadores
        document.querySelectorAll(".btn-tecla").forEach((boton) => {
            boton.addEventListener("click", (e) => {
                e.preventDefault();
                const valor = boton.getAttribute("data-val");
                console.log('⌨️ Botón presionado:', valor);
                this.agregarCaracter(valor);
            });
        });

        // Botones de control
        const btnLimpiar = document.getElementById("btn-limpiar");
        const btnBorrar = document.getElementById("btn-borrar");
        const btnAnalizar = document.getElementById("btn-analizar");
        const btnIgual = document.querySelector(".btn-igual");

        if (btnLimpiar) {
            btnLimpiar.addEventListener("click", () => this.limpiarDisplay());
        }

        if (btnBorrar) {
            btnBorrar.addEventListener("click", () => this.borrarUltimoCaracter());
        }

        if (btnAnalizar) {
            btnAnalizar.addEventListener("click", () => {
                console.log('🔍 Botón Analizar clickeado');
                this.analizarExpresion();
            });
        }

        if (btnIgual) {
            btnIgual.addEventListener("click", () => this.calcularResultado());
        }

        console.log('✅ Eventos de botones inicializados');
    }

    inicializarEjemplosRapidos() {
        document.querySelectorAll(".ejemplo-rapido").forEach((boton) => {
            boton.addEventListener("click", (e) => {
                e.preventDefault();
                const ejemplo = boton.getAttribute("data-ejemplo");
                this.cargarEjemplo(ejemplo);
            });
        });
    }

    manejarTecladoFisico(event) {
        const tecla = event.key;

        if (this.esTeclaCalculadora(tecla)) {
            event.preventDefault();
        }

        const mapeoTeclas = {
            0: "0", 1: "1", 2: "2", 3: "3", 4: "4", 5: "5", 6: "6", 7: "7", 8: "8", 9: "9",
            "+": "+", "-": "-", "*": "×", "/": "÷", ".": ".", ",": ".",
            Enter: "=", "=": "=", Backspace: "borrar", Delete: "limpiar", Escape: "limpiar",
            "^": "^", "(": "(", ")": ")", p: "π", P: "π", e: "e", E: "e"
        };

        const accion = mapeoTeclas[tecla];

        if (accion) {
            switch (accion) {
                case "=":
                    this.calcularResultado();
                    break;
                case "borrar":
                    this.borrarUltimoCaracter();
                    break;
                case "limpiar":
                    this.limpiarDisplay();
                    break;
                default:
                    this.agregarCaracter(accion);
            }
        }
    }

    esTeclaCalculadora(tecla) {
        const teclasCalculadora = [
            "0", "1", "2", "3", "4", "5", "6", "7", "8", "9",
            "+", "-", "*", "/", ".", ",", "=", "Enter", "Backspace", 
            "Delete", "Escape", "^", "(", ")", "p", "P", "e", "E"
        ];
        return teclasCalculadora.includes(tecla);
    }

    agregarCaracter(caracter) {
        const seleccionInicio = this.display.selectionStart;
        const seleccionFin = this.display.selectionEnd;
        const textoActual = this.display.value;

        const caracterConvertido = this.convertirSimboloMatematico(caracter);

        const nuevoTexto =
            textoActual.substring(0, seleccionInicio) +
            caracterConvertido +
            textoActual.substring(seleccionFin);

        this.display.value = nuevoTexto;
        this.expresionActual = nuevoTexto;

        const nuevaPosicion = seleccionInicio + caracterConvertido.length;
        this.display.setSelectionRange(nuevaPosicion, nuevaPosicion);
        this.display.focus();

        this.actualizarEstadoDisplay();
    }

    convertirSimboloMatematico(simbolo) {
        const conversiones = {
            "÷": "/", "×": "*", "−": "-", "²": "^2", "³": "^3", "^": "^",
            "√": "sqrt(", π: "π", e: "e", sin: "sin(", cos: "cos(", tan: "tan(", log: "log("
        };
        return conversiones[simbolo] || simbolo;
    }

    borrarUltimoCaracter() {
        const inicio = this.display.selectionStart;
        const fin = this.display.selectionEnd;
        const textoActual = this.display.value;

        if (inicio === fin && inicio > 0) {
            this.display.value =
                textoActual.substring(0, inicio - 1) + textoActual.substring(inicio);
            this.display.setSelectionRange(inicio - 1, inicio - 1);
        } else if (inicio !== fin) {
            this.display.value =
                textoActual.substring(0, inicio) + textoActual.substring(fin);
            this.display.setSelectionRange(inicio, inicio);
        } else {
            this.display.value = textoActual.slice(0, -1);
            this.display.setSelectionRange(
                this.display.value.length,
                this.display.value.length
            );
        }

        this.expresionActual = this.display.value;
        this.display.focus();
        this.actualizarEstadoDisplay();
    }

    limpiarDisplay() {
        this.display.value = "";
        this.expresionActual = "";
        this.ultimoResultado = null;
        this.actualizarEstadoDisplay();
        this.display.focus();
    }

    validarEntradaDirecta(valor) {
        const caracteresValidos = /^[0-9+\-*/().√πe^²³sincostanlog]*$/;

        if (!caracteresValidos.test(valor)) {
            this.display.value = valor.replace(
                /[^0-9+\-*/().√πe^²³sincostanlog]/g,
                ""
            );
        }

        this.expresionActual = this.display.value;
        this.actualizarEstadoDisplay();
    }

    formatearNumero(numero) {
        if (typeof numero !== "number") return numero;

        if (Math.abs(numero) > 1e10 || (Math.abs(numero) < 1e-10 && numero !== 0)) {
            return numero.toExponential(6);
        }

        return Math.round(numero * 1e10) / 1e10;
    }

    calcularResultado() {
        if (!this.expresionActual.trim()) {
            this.mostrarError("Ingresa una expresión para calcular");
            return;
        }

        try {
            const expresionEvaluable = this.prepararExpresionParaEvaluacion(
                this.expresionActual
            );
            const resultado = this.evaluarExpresion(expresionEvaluable);

            if (resultado !== null && resultado !== undefined) {
                this.ultimoResultado = resultado;
                this.display.value = this.formatearNumero(resultado);
                this.expresionActual = this.display.value;
                this.mostrarMensajeExito("Cálculo completado");
            }
        } catch (error) {
            this.mostrarError(`Error en el cálculo: ${error.message}`);
        }
    }

    prepararExpresionParaEvaluacion(expresion) {
        return expresion
            .replace(/π/g, Math.PI)
            .replace(/e/g, Math.E)
            .replace(/sqrt\(/g, "Math.sqrt(")
            .replace(
                /sin\(/g,
                this.modoGrados ? "Math.sin(Math.PI/180*" : "Math.sin("
            )
            .replace(
                /cos\(/g,
                this.modoGrados ? "Math.cos(Math.PI/180*" : "Math.cos("
            )
            .replace(
                /tan\(/g,
                this.modoGrados ? "Math.tan(Math.PI/180*" : "Math.tan("
            )
            .replace(/log\(/g, "Math.log10(")
            .replace(/\^/g, "**");
    }

    evaluarExpresion(expresion) {
        if (!this.validarExpresion(expresion)) {
            throw new Error("Expresión matemática inválida");
        }

        try {
            const funcionEvaluadora = new Function("return " + expresion);
            return funcionEvaluadora();
        } catch (error) {
            throw new Error("No se puede evaluar la expresión");
        }
    }

    validarExpresion(expresion) {
        const pila = [];
        for (let char of expresion) {
            if (char === "(") pila.push("(");
            if (char === ")") {
                if (pila.length === 0) return false;
                pila.pop();
            }
        }
        if (pila.length !== 0) return false;

        const estructuraValida = /^[0-9+\-*/().Math\s]+$/.test(
            expresion.replace(/Math\.\w+\(/g, "")
        );
        if (!estructuraValida) return false;

        return true;
    }

    analizarExpresion() {
        const expresion = this.display.value.trim();
        console.log('🔍 Iniciando análisis de expresión:', expresion);

        if (!expresion) {
            this.mostrarError("Por favor, ingresa una expresión matemática");
            return;
        }

        try {
            // VERIFICAR que el analizador existe antes de disparar el evento
            if (typeof window.analizador !== 'undefined' && window.analizador.analizarExpresionCompleta) {
                console.log('✅ Llamando analizador directamente');
                // Método DIRECTO - más confiable que eventos
                window.analizador.analizarExpresionCompleta(expresion);
                this.mostrarMensajeExito("Expresión enviada para análisis");
            } else {
                console.log('⚠️ Usando evento como fallback');
                // Fallback: usar evento personalizado
                const eventoAnalisis = new CustomEvent("expresionParaAnalizar", {
                    detail: {
                        expresion: expresion,
                        timestamp: new Date().toISOString(),
                    },
                });
                document.dispatchEvent(eventoAnalisis);
                this.mostrarMensajeExito("Expresión enviada para análisis (modo evento)");
            }
        } catch (error) {
            console.error('❌ Error en analizarExpresion:', error);
            this.mostrarError(`Error al analizar: ${error.message}`);
        }
    }

    cargarEjemplo(ejemplo) {
        this.display.value = ejemplo;
        this.expresionActual = ejemplo;
        this.actualizarEstadoDisplay();
        this.mostrarMensajeInfo(`Ejemplo cargado: ${ejemplo}`);
    }

    actualizarEstadoDisplay() {
        const expresion = this.display.value;
        const tieneContenido = expresion.trim().length > 0;

        if (tieneContenido) {
            this.display.classList.add("display-activo");
        } else {
            this.display.classList.remove("display-activo");
        }

        const btnAnalizar = document.getElementById("btn-analizar");
        if (btnAnalizar) {
            btnAnalizar.disabled = !tieneContenido;
        }
    }

    mostrarMensajeBienvenida() {
        console.log("🧮 Calculadora Científica inicializada y lista");
        this.actualizarEstadoDisplay();
    }

    mostrarMensajeExito(mensaje) {
        this.mostrarNotificacion(mensaje, "success");
    }

    mostrarMensajeInfo(mensaje) {
        this.mostrarNotificacion(mensaje, "info");
    }

    mostrarError(mensaje) {
        this.mostrarNotificacion(mensaje, "danger");
    }

    mostrarNotificacion(mensaje, tipo = "info") {
        const toast = document.createElement("div");
        toast.className = `alert alert-${tipo} alert-dismissible fade show`;
        toast.innerHTML = `
            ${mensaje}
            <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
        `;

        toast.style.position = "fixed";
        toast.style.top = "20px";
        toast.style.right = "20px";
        toast.style.zIndex = "9999";
        toast.style.minWidth = "300px";

        document.body.appendChild(toast);

        setTimeout(() => {
            if (toast.parentNode) {
                toast.parentNode.removeChild(toast);
            }
        }, 5000);
    }

    toggleModoAngulos() {
        this.modoGrados = !this.modoGrados;
        const modoTexto = this.modoGrados ? "Grados" : "Radianes";
        this.mostrarMensajeInfo(`Modo de ángulos cambiado a: ${modoTexto}`);
        return this.modoGrados;
    }

    usarUltimoResultado() {
        if (this.ultimoResultado !== null) {
            this.agregarCaracter(this.ultimoResultado.toString());
        } else {
            this.mostrarError("No hay resultado previo para usar");
        }
    }

    getExpresionActual() {
        return this.expresionActual;
    }

    setExpresion(expresion) {
        this.display.value = expresion;
        this.expresionActual = expresion;
        this.actualizarEstadoDisplay();
    }

    getUltimoResultado() {
        return this.ultimoResultado;
    }
}

// ELIMINAR estas líneas comentadas al final - ya no son necesarias
// let calculadora;
// document.addEventListener("DOMContentLoaded", function () {
//   calculadora = new CalculadoraCientifica();
//   window.calculadora = calculadora;
//   console.log("✅ Calculadora científica cargada correctamente");
// });