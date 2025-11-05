// analizador.js - VERSIÓN MEJORADA Y COMPLETA
class Analizador {
    constructor() {
        console.log('🔧 Constructor Analizador llamado');
        this.utilidades = new ModuloUtilidades();
        this.explicador = new ModuloExplicaciones();
    }

    analizarExpresionCompleta(expresion) {
        console.log('📊 Analizando expresión:', expresion);
        const pasos = [];
        
        try {
            // Paso 1: Análisis estructural
            pasos.push(this.explicador.generarAnalisisEstructural(expresion));
            
            // Paso 2: Descomposición en términos
            const terminos = this.descomponerEnTerminos(expresion);
            pasos.push(this.explicador.generarDescomposicionTerminos(terminos, expresion));
            
            // Paso 3: Resolución paso a paso
            const resolucion = this.resolverExpresionPasoAPaso(expresion);
            pasos.push(...resolucion.pasos);
            
            // Paso 4: Verificación y conclusión
            pasos.push(this.explicador.generarConclusionPedagogica(expresion, resolucion.resultado));
            
        } catch (error) {
            console.error('❌ Error en análisis:', error);
            pasos.push({
                titulo: "❌ Error en el Análisis",
                contenido: `<div class="alert alert-danger">Error: ${error.message}</div>`
            });
        }
        
        return pasos;
    }

    descomponerEnTerminos(expresion) {
        console.log('🔍 Descomponiendo en términos:', expresion);
        const terminos = [];
        let terminoActual = '';
        let parentesisAbiertos = 0;
        
        for (let i = 0; i < expresion.length; i++) {
            const char = expresion[i];
            
            if (char === '(') parentesisAbiertos++;
            if (char === ')') parentesisAbiertos--;
            
            // Solo separar por + o - que no estén dentro de paréntesis
            if ((char === '+' || char === '-') && parentesisAbiertos === 0 && terminoActual) {
                terminos.push(terminoActual.trim());
                terminoActual = (char === '-') ? '-' : '';
            } else {
                terminoActual += char;
            }
        }
        
        if (terminoActual) {
            terminos.push(terminoActual.trim());
        }
        
        console.log('📝 Términos identificados:', terminos);
        return terminos.filter(term => term !== '' && term !== '+');
    }

    resolverExpresionPasoAPaso(expresion) {
        console.log('🔄 Resolviendo expresión paso a paso:', expresion);
        const pasos = [];
        let expresionActual = expresion;
        let iteracion = 0;
        const maxIteraciones = 20;
        
        while (this.contieneOperaciones(expresionActual) && iteracion < maxIteraciones) {
            iteracion++;
            console.log(`📋 Iteración ${iteracion}:`, expresionActual);
            
            const paso = this.obtenerSiguientePaso(expresionActual);
            if (!paso) {
                console.log('⏹️ No se pudo encontrar siguiente paso');
                break;
            }
            
            pasos.push({
                tipo: 'resolucion',
                titulo: `Paso ${iteracion}: ${this.obtenerNombreOperacion(paso.tipo)}`,
                contenido: this.formatearPasoResolucion(paso),
                ...paso
            });
            
            expresionActual = paso.expresionSimplificada;
            console.log(`✅ Paso ${iteracion} completado:`, expresionActual);
        }
        
        let resultado;
        try {
            resultado = this.utilidades.evaluarExpresionSegura(
                this.utilidades.prepararExpresionParaEvaluacion(expresionActual)
            );
        } catch (error) {
            resultado = 'Error en cálculo';
        }
        
        console.log('🎯 Resultado final:', resultado);
        return {
            pasos: pasos,
            resultado: resultado
        };
    }

    contieneOperaciones(expresion) {
        // Verificar si la expresión contiene operaciones por resolver
        const operadores = /[+\-×÷√²³^]/.test(expresion);
        const parentesis = /[()]/.test(expresion);
        const tieneMultiplesNumeros = expresion.split(/[+\-×÷]/).filter(x => x.trim() && !isNaN(parseFloat(x))).length > 1;
        
        return operadores || parentesis || tieneMultiplesNumeros;
    }

    obtenerSiguientePaso(expresion) {
        console.log('🔎 Buscando siguiente paso para:', expresion);
        
        // 1. Paréntesis internos (más internos primero)
        const parentesisInterno = this.obtenerParentesisMasInterno(expresion);
        if (parentesisInterno) {
            console.log('📌 Resolviendo paréntesis:', parentesisInterno);
            return this.resolverParentesis(expresion, parentesisInterno);
        }
        
        // 2. Raíces cuadradas
        const raiz = this.obtenerRaizCuadrada(expresion);
        if (raiz) {
            console.log('📌 Resolviendo raíz:', raiz);
            return this.resolverRaizCuadrada(expresion, raiz);
        }
        
        // 3. Potencias
        const potencia = this.obtenerPotencia(expresion);
        if (potencia) {
            console.log('📌 Resolviendo potencia:', potencia);
            return this.resolverPotencia(expresion, potencia);
        }
        
        // 4. Multiplicación/División (de izquierda a derecha)
        const multiplicacion = this.obtenerMultiplicacionDivision(expresion);
        if (multiplicacion) {
            console.log('📌 Resolviendo multiplicación/división:', multiplicacion);
            return this.resolverMultiplicacionDivision(expresion, multiplicacion);
        }
        
        // 5. Suma/Resta (de izquierda a derecha)
        const suma = this.obtenerSumaResta(expresion);
        if (suma) {
            console.log('📌 Resolviendo suma/resta:', suma);
            return this.resolverSumaResta(expresion, suma);
        }
        
        console.log('❌ No se encontró operación para resolver');
        return null;
    }

    obtenerParentesisMasInterno(expresion) {
        // Buscar el paréntesis más interno (sin paréntesis dentro)
        const regex = /\(([^()]+)\)/;
        const match = expresion.match(regex);
        if (match) {
            return {
                contenido: match[1],
                inicio: match.index,
                fin: match.index + match[0].length,
                textoCompleto: match[0]
            };
        }
        return null;
    }

    obtenerRaizCuadrada(expresion) {
        // Buscar raíces cuadradas: √(contenido) o √numero
        const regex = /√\(([^()]+)\)|√(\d+\.?\d*)/;
        const match = expresion.match(regex);
        if (match) {
            const contenido = match[1] || match[2];
            return {
                contenido: contenido,
                inicio: match.index,
                fin: match.index + match[0].length,
                textoCompleto: match[0]
            };
        }
        return null;
    }

    obtenerPotencia(expresion) {
        // Buscar patrones como ², ³, o ^
        const regex = /(\d+\.?\d*)(²|³|\^\d+)/;
        const match = expresion.match(regex);
        if (match) {
            return {
                base: match[1],
                exponente: match[2],
                inicio: match.index,
                fin: match.index + match[0].length,
                textoCompleto: match[0]
            };
        }
        return null;
    }

    obtenerMultiplicacionDivision(expresion) {
        // Buscar multiplicaciones o divisiones (de izquierda a derecha)
        const regex = /(-?\d+\.?\d*)\s*([×÷])\s*(-?\d+\.?\d*)/;
        const match = expresion.match(regex);
        if (match) {
            return {
                izquierda: match[1],
                operador: match[2],
                derecha: match[3],
                inicio: match.index,
                fin: match.index + match[0].length,
                textoCompleto: match[0]
            };
        }
        return null;
    }

    obtenerSumaResta(expresion) {
        // Buscar sumas o restas (de izquierda a derecha)
        const regex = /(-?\d+\.?\d*)\s*([+-])\s*(-?\d+\.?\d*)/;
        const match = expresion.match(regex);
        if (match && match.index > 0) { // No es el primer término
            return {
                izquierda: match[1],
                operador: match[2],
                derecha: match[3],
                inicio: match.index,
                fin: match.index + match[0].length,
                textoCompleto: match[0]
            };
        }
        return null;
    }

    resolverParentesis(expresion, parentesis) {
        let resultado;
        try {
            // Resolver el contenido del paréntesis
            resultado = this.utilidades.evaluarExpresionSegura(
                this.utilidades.prepararExpresionParaEvaluacion(parentesis.contenido)
            );
        } catch (error) {
            resultado = '?';
        }
        
        const expresionSimplificada = expresion.replace(
            parentesis.textoCompleto, 
            resultado.toString()
        );
        
        return {
            tipo: 'parentesis',
            expresionOriginal: expresion,
            expresionSimplificada: expresionSimplificada,
            operacion: `${parentesis.textoCompleto} = ${resultado}`,
            explicacion: this.explicador.generarExplicacionParentesis(parentesis.contenido, resultado)
        };
    }

    resolverRaizCuadrada(expresion, raiz) {
        let resultado;
        try {
            const numero = parseFloat(raiz.contenido);
            resultado = Math.sqrt(numero);
        } catch (error) {
            resultado = '?';
        }
        
        const expresionSimplificada = expresion.replace(
            raiz.textoCompleto, 
            resultado.toString()
        );
        
        return {
            tipo: 'raiz',
            expresionOriginal: expresion,
            expresionSimplificada: expresionSimplificada,
            operacion: `${raiz.textoCompleto} = ${resultado}`,
            explicacion: this.explicador.generarExplicacionRaiz(raiz.contenido, resultado)
        };
    }

    resolverPotencia(expresion, potencia) {
        const base = parseFloat(potencia.base);
        let exponente, resultado;
        
        if (potencia.exponente === '²') {
            exponente = 2;
            resultado = base * base;
        } else if (potencia.exponente === '³') {
            exponente = 3;
            resultado = base * base * base;
        } else if (potencia.exponente.startsWith('^')) {
            exponente = parseFloat(potencia.exponente.substring(1));
            resultado = Math.pow(base, exponente);
        } else {
            exponente = 2;
            resultado = base * base;
        }
        
        const expresionSimplificada = expresion.replace(
            potencia.textoCompleto,
            resultado.toString()
        );
        
        return {
            tipo: 'potencia',
            expresionOriginal: expresion,
            expresionSimplificada: expresionSimplificada,
            operacion: `${potencia.textoCompleto} = ${resultado}`,
            explicacion: this.explicador.generarExplicacionPotencia(base, exponente, resultado)
        };
    }

    resolverMultiplicacionDivision(expresion, operacion) {
        const izquierda = parseFloat(operacion.izquierda);
        const derecha = parseFloat(operacion.derecha);
        let resultado;
        
        if (operacion.operador === '×') {
            resultado = izquierda * derecha;
        } else if (operacion.operador === '÷') {
            resultado = izquierda / derecha;
        } else {
            resultado = izquierda * derecha;
        }
        
        const expresionSimplificada = expresion.replace(
            operacion.textoCompleto,
            resultado.toString()
        );
        
        return {
            tipo: 'multiplicacion',
            expresionOriginal: expresion,
            expresionSimplificada: expresionSimplificada,
            operacion: `${operacion.textoCompleto} = ${resultado}`,
            explicacion: this.explicador.generarExplicacionMultiplicacion(izquierda, derecha, resultado, operacion.operador)
        };
    }

    resolverSumaResta(expresion, operacion) {
        const izquierda = parseFloat(operacion.izquierda);
        const derecha = parseFloat(operacion.derecha);
        let resultado;
        
        if (operacion.operador === '+') {
            resultado = izquierda + derecha;
        } else if (operacion.operador === '-') {
            resultado = izquierda - derecha;
        } else {
            resultado = izquierda + derecha;
        }
        
        const expresionSimplificada = expresion.replace(
            operacion.textoCompleto,
            resultado.toString()
        );
        
        return {
            tipo: 'suma',
            expresionOriginal: expresion,
            expresionSimplificada: expresionSimplificada,
            operacion: `${operacion.textoCompleto} = ${resultado}`,
            explicacion: this.explicador.generarExplicacionSuma(izquierda, derecha, resultado, operacion.operador)
        };
    }

    obtenerNombreOperacion(tipo) {
        const nombres = {
            'parentesis': 'Resolución de Paréntesis',
            'raiz': 'Cálculo de Raíz Cuadrada',
            'potencia': 'Cálculo de Potencia',
            'multiplicacion': 'Multiplicación/División',
            'suma': 'Suma/Resta'
        };
        return nombres[tipo] || 'Operación Matemática';
    }

    formatearPasoResolucion(paso) {
        return `
            <div class="paso-resolucion-detallado">
                <div class="operacion-principal mb-3 p-3 bg-light rounded">
                    <h6>📝 Operación realizada:</h6>
                    <div class="fs-5 fw-bold">${paso.operacion}</div>
                </div>
                
                <div class="explicacion-operacion mb-3">
                    ${paso.explicacion}
                </div>
                
                <div class="transicion-expresion p-3 border rounded">
                    <div class="row text-center">
                        <div class="col-md-5">
                            <strong>Expresión anterior:</strong>
                            <div class="expresion-expandida fs-6">${paso.expresionOriginal}</div>
                        </div>
                        <div class="col-md-2 d-flex align-items-center justify-content-center">
                            <div class="flecha-transicion fs-4">→</div>
                        </div>
                        <div class="col-md-5">
                            <strong>Expresión simplificada:</strong>
                            <div class="expresion-simplificada fs-6 text-success">${paso.expresionSimplificada}</div>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }
}