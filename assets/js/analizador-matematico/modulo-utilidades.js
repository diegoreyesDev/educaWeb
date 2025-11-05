// modulo-utilidades.js
class ModuloUtilidades {
    prepararInterfaz() {
        const vistaInicial = document.getElementById('vista-inicial');
        const analisisDinamico = document.getElementById('analisis-dinamico');
        const estadoAnalisis = document.getElementById('estado-analisis');
        
        if (vistaInicial) vistaInicial.style.display = 'none';
        if (analisisDinamico) analisisDinamico.style.display = 'block';
        if (estadoAnalisis) estadoAnalisis.textContent = 'Analizando expresión...';
    }

    reiniciarInterfaz() {
        const vistaInicial = document.getElementById('vista-inicial');
        const analisisDinamico = document.getElementById('analisis-dinamico');
        const estadoAnalisis = document.getElementById('estado-analisis');
        const display = document.getElementById('display-matematico');
        
        if (vistaInicial) vistaInicial.style.display = 'block';
        if (analisisDinamico) analisisDinamico.style.display = 'none';
        if (estadoAnalisis) estadoAnalisis.textContent = 'Esperando expresión matemática';
        if (display) {
            display.value = '';
            display.focus();
        }
    }

    identificarComponentes(expresion) {
        const parentesis = this.contarParentesis(expresion);
        const operadores = this.identificarOperadores(expresion);
        const funciones = this.identificarFunciones(expresion);
        const constantes = this.identificarConstantes(expresion);
        const numeros = this.identificarNumeros(expresion);

        const lista = [];
        if (parentesis.total > 0) {
            lista.push(`<strong>${parentesis.total} paréntesis</strong> - Agrupan operaciones prioritarias`);
        }
        if (operadores.length > 0) {
            const operadoresUnicos = [...new Set(operadores)];
            lista.push(`<strong>${operadores.length} operadores</strong> - ${operadoresUnicos.join(', ')}`);
        }
        if (funciones.length > 0) {
            lista.push(`<strong>Funciones matemáticas</strong> - ${funciones.join(', ')}`);
        }
        if (constantes.length > 0) {
            lista.push(`<strong>Constantes</strong> - ${constantes.join(', ')}`);
        }
        if (numeros.length > 0) {
            lista.push(`<strong>${numeros.length} números</strong> - Valores a operar`);
        }

        return { lista };
    }

    contarParentesis(expresion) {
        const aperturas = (expresion.match(/\(/g) || []).length;
        const cierres = (expresion.match(/\)/g) || []).length;
        return { total: aperturas + cierres, balanceado: aperturas === cierres };
    }

    identificarOperadores(expresion) {
        return (expresion.match(/\+|\-|\×|\÷/g) || []);
    }

    identificarFunciones(expresion) {
        return (expresion.match(/sin|cos|tan|log/g) || []);
    }

    identificarConstantes(expresion) {
        return (expresion.match(/π|e/g) || []);
    }

    identificarNumeros(expresion) {
        return (expresion.match(/-?\d+\.?\d*/g) || []);
    }

    extraerExpresionActual(expresionConHTML) {
        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = expresionConHTML;
        return tempDiv.textContent || tempDiv.innerText || '';
    }

    prepararExpresionParaEvaluacion(expresion) {
        return expresion
            .replace(/×/g, '*')
            .replace(/÷/g, '/')
            .replace(/²/g, '**2')
            .replace(/³/g, '**3')
            .replace(/\^/g, '**')
            .replace(/√/g, 'Math.sqrt')
            .replace(/π/g, Math.PI.toString())
            .replace(/e/g, Math.E.toString())
            .replace(/sin/g, 'Math.sin')
            .replace(/cos/g, 'Math.cos')
            .replace(/tan/g, 'Math.tan')
            .replace(/log/g, 'Math.log10');
    }

    evaluarExpresionSegura(expresion) {
        try {
            if (!/^[0-9+\-*/(). Math]+$/.test(expresion.replace(/Math\.(sqrt|sin|cos|tan|log10)/g, ''))) {
                throw new Error('Expresión contiene caracteres no permitidos');
            }
            
            const resultado = new Function('return ' + expresion)();
            return this.formatearNumero(resultado);
        } catch (error) {
            throw new Error('No se pudo evaluar la expresión: ' + error.message);
        }
    }

    formatearNumero(numero) {
        if (typeof numero !== 'number') return numero;
        return Math.round(numero * 100000000) / 100000000;
    }

    destacarElementos(expresion) {
        if (expresion.includes('<span') || !expresion) return expresion;
        
        let resultado = expresion;
        const reemplazos = [
            { patron: /(sin|cos|tan|log)\(/g, clase: 'funcion' },
            { patron: /(π|e)/g, clase: 'constante' },
            { patron: /(\(|\))/g, clase: 'parentesis' },
            { patron: /(\+|\-)/g, clase: 'operador' },
            { patron: /(×|\÷)/g, clase: 'operador' },
            { patron: /(\^|²|³)/g, clase: 'potencia' },
            { patron: /(√)/g, clase: 'raiz' },
            { patron: /(\d+)/g, clase: 'numero' }
        ];
        
        reemplazos.forEach(item => {
            resultado = resultado.replace(item.patron, `<span class="dest ${item.clase}">$1</span>`);
        });
        
        return resultado;
    }
}