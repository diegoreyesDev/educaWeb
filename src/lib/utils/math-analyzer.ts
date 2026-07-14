export interface AnalysisResult {
  paso: number;
  titulo: string;
  expresionAntes: string;
  expresionDespues: string;
  explicacion: string;
  tipo: 'estructural' | 'resolucion' | 'conclusion';
}

export class AnalizadorMatematico {
  analizar(expression: string): AnalysisResult[] {
    const steps: AnalysisResult[] = [];
    let paso = 0;
    const expr = expression.trim();

    if (!expr) {
      steps.push({
        paso: 1,
        titulo: 'Expresión vacía',
        expresionAntes: '',
        expresionDespues: '',
        explicacion: 'No hay expresión para analizar. Ingresa una operación matemática para comenzar.',
        tipo: 'estructural'
      });
      return steps;
    }

    paso++;
    steps.push({
      paso,
      titulo: 'Análisis estructural',
      expresionAntes: expr,
      expresionDespues: this.describirEstructura(expr),
      explicacion: 'Observamos la expresión completa y localizamos cada elemento: números, operadores, paréntesis y funciones. Es como leer un mapa antes de iniciar un viaje.',
      tipo: 'estructural'
    });

    paso++;
    steps.push({
      paso,
      titulo: 'Identificación de jerarquía',
      expresionAntes: expr,
      expresionDespues: this.describirJerarquia(expr),
      explicacion: 'Recordamos el orden PEMDAS: primero resolvemos lo que está dentro de Paréntesis, luego Exponentes (potencias y raíces), después Multiplicación y División (de izquierda a derecha), y finalmente Adición y Sustracción (de izquierda a derecha). Es como preparar una receta: no puedes decorar el pastel antes de hornearlo.',
      tipo: 'estructural'
    });

    const subExpressions = this.descomponerTerminos(expr);
    if (subExpressions.length > 0) {
      paso++;
      steps.push({
        paso,
        titulo: 'Descomposición de términos',
        expresionAntes: expr,
        expresionDespues: subExpressions.join(' | '),
        explicacion: 'Separamos la expresión por niveles de precedencia. Cada "capa" de la operación se resuelve en orden. Imagina que cada operador es como un semáforo que indica cuándo avanzar.',
        tipo: 'estructural'
      });
    }

    const pemdasSteps = this.aplicarPEMDAS(expr);
    for (const ps of pemdasSteps) {
      paso++;
      steps.push({
        paso,
        titulo: ps.titulo,
        expresionAntes: ps.antes,
        expresionDespues: ps.despues,
        explicacion: ps.explicacion,
        tipo: 'resolucion'
      });
    }

    try {
      let safeExpr = expr
        .replace(/×/g, '*')
        .replace(/÷/g, '/')
        .replace(/\^/g, '**')
        .replace(/π/g, 'Math.PI')
        .replace(/e(?![a-z])/g, 'Math.E')
        .replace(/sin\(/g, 'Math.sin(')
        .replace(/cos\(/g, 'Math.cos(')
        .replace(/tan\(/g, 'Math.tan(')
        .replace(/log\(/g, 'Math.log10(')
        .replace(/ln\(/g, 'Math.log(')
        .replace(/sqrt\(/g, 'Math.sqrt(');

      const resultado = new Function(`return ${safeExpr}`)();

      if (!isFinite(resultado)) {
        paso++;
        steps.push({
          paso,
          titulo: 'Resultado indefinido',
          expresionAntes: expr,
          expresionDespues: resultado === Infinity ? '∞ (Infinito)' : '-∞ (Infinito negativo)',
          explicacion: 'Al dividir entre cero obtenemos un valor infinito. Recuerda: en matemáticas, dividir entre cero no está definido. Es como intentar repartir galletas entre cero amigos: no tiene sentido.',
          tipo: 'conclusion'
        });
        return steps;
      }

      paso++;
      steps.push({
        paso,
        titulo: '¡Resultado final!',
        expresionAntes: expr,
        expresionDespues: String(resultado),
        explicacion: `La expresión "${expr}" es igual a ${resultado}. ¡Excelente trabajo! Cada paso que diste te acerca más a dominar las matemáticas. Recuerda: las matemáticas no son un talento, son una habilidad que se construye con práctica y paciencia. ¡Sigue así!`,
        tipo: 'conclusion'
      });
    } catch {
      paso++;
      steps.push({
        paso,
        titulo: 'Error de sintaxis',
        expresionAntes: expr,
        expresionDespues: '---',
        explicacion: 'La expresión contiene errores de sintaxis. Revisa que los paréntesis estén balanceados, que no haya operadores consecutivos y que todas las funciones tengan sus argumentos. Recuerda: incluso los matemáticos más brillantes revisan su trabajo.',
        tipo: 'conclusion'
      });
    }

    return steps;
  }

  private describirEstructura(expr: string): string {
    const partes: string[] = [];
    const numeros = expr.match(/\d+\.?\d*/g);
    const operadores = expr.match(/[+\-*/^×÷()]/g);
    const funciones = expr.match(/(sin|cos|tan|log|ln|sqrt)/g);
    const constantes = expr.match(/[πe]/g);

    if (numeros) partes.push(`${numeros.length} número(s)`);
    if (operadores) partes.push(`${operadores.length} operador(es)`);
    if (funciones) partes.push(`${funciones.length} función(es)`);
    if (constantes) partes.push(`${constantes.length} constante(s)`);

    return partes.length > 0 ? partes.join(', ') : 'Sin elementos identificables';
  }

  private describirJerarquia(expr: string): string {
    const desc: string[] = [];

    if (/[()]/.test(expr)) desc.push('1º Paréntesis');
    if (/sqrt|sin|cos|tan|log|ln/.test(expr)) desc.push('2º Funciones/Raíces');
    if (/\^/.test(expr)) desc.push('3º Potencias');
    if (/[*/×÷]/.test(expr)) desc.push('4º Multiplicación/División');
    if (/[+\-]/.test(expr) && !/^-\d/.test(expr)) desc.push('5º Suma/Resta');

    return desc.length > 0 ? desc.join(' → ') : 'Operación simple';
  }

  private descomponerTerminos(expr: string): string[] {
    const terminos: string[] = [];
    const procesada = expr.replace(/\s+/g, '');

    const regex = /\d+\.?\d*|[+\-*/×÷^()]|sin|cos|tan|log|ln|sqrt|π|e/g;
    const tokens = procesada.match(regex) || [];

    let buffer = '';
    for (const token of tokens) {
      if (/[+\-]/.test(token) && buffer.length > 0) {
        terminos.push(buffer.trim());
        buffer = token;
      } else {
        buffer += token;
      }
    }
    if (buffer.trim()) terminos.push(buffer.trim());

    return terminos;
  }

  private aplicarPEMDAS(expr: string): { titulo: string; antes: string; despues: string; explicacion: string }[] {
    const steps: { titulo: string; antes: string; despues: string; explicacion: string }[] = [];
    const clean = expr.replace(/\s+/g, '');

    if (/[()]/.test(clean)) {
      const parenMatch = clean.match(/\(([^()]+)\)/);
      if (parenMatch) {
        steps.push({
          titulo: 'Paso P: Resolviendo paréntesis',
          antes: clean,
          despues: clean.replace(/\([^()]+\)/, `[${parenMatch[1]}]`),
          explicacion: 'Primero resolvemos lo que está dentro de los paréntesis. Es como abrir una caja sorpresa: lo de adentro se resuelve antes que lo de afuera.'
        });
      }
    }

    if (/sqrt/.test(clean)) {
      const sqrtMatch = clean.match(/sqrt\(([^)]+)\)/);
      if (sqrtMatch) {
        steps.push({
          titulo: 'Paso E: Calculando raíz cuadrada',
          antes: clean,
          despues: clean.replace(/sqrt\([^)]+\)/, `√(${sqrtMatch[1]})`),
          explicacion: 'Las raíces son como preguntar "¿qué número multiplicado por sí mismo me da este valor?". Es destapar el origen de un cuadrado perfecto.'
        });
      }
    }

    if (/\^/.test(clean)) {
      const powMatch = clean.match(/(\d+\.?\d*)\^(\d+\.?\d*)/);
      if (powMatch) {
        const base = parseFloat(powMatch[1]);
        const exp = parseFloat(powMatch[2]);
        const result = Math.pow(base, exp);
        steps.push({
          titulo: 'Paso E: Calculando potencia',
          antes: clean,
          despues: clean.replace(/\d+\.?\d*\^\d+\.?\d*/, String(result)),
          explicacion: `La potencia ${base}^${exp} significa multiplicar ${base} por sí mismo ${exp} ${exp === 1 ? 'vez' : 'veces'}. Es como doblar un papel: cada doblez multiplica las capas.`
        });
      }
    }

    const mulDivMatch = clean.match(/(\d+\.?\d*)\s*[*/×÷]\s*(\d+\.?\d*)/);
    if (mulDivMatch) {
      const op = clean.match(/[*/×÷]/)![0];
      const a = parseFloat(mulDivMatch[1]);
      const b = parseFloat(mulDivMatch[2]);
      let result: number;
      let opName: string;
      let analogia: string;

      if (op === '*' || op === '×') {
        result = a * b;
        opName = 'multiplicación';
        analogia = 'Multiplicar es sumar repetidamente. Es como contar grupos iguales de objetos.';
      } else {
        if (b === 0) {
          steps.push({
            titulo: 'Paso MD: División por cero detectada',
            antes: clean,
            despues: '∞',
            explicacion: '¡Alerta! Dividir entre cero no está definido. Es como intentar repartir algo entre nada: no tiene sentido matemático.'
          });
          return steps;
        }
        result = a / b;
        opName = 'división';
        analogia = 'Dividir es repartir en partes iguales. Es como compartir un queque entre amigos.';
      }

      steps.push({
        titulo: `Paso MD: Resolviendo ${opName}`,
        antes: clean,
        despues: clean.replace(mulDivMatch[0], String(result)),
        explicacion: analogia
      });
    }

    const addSubMatch = clean.match(/(\d+\.?\d*)\s*[+\-]\s*(\d+\.?\d*)/);
    if (addSubMatch) {
      const a = parseFloat(addSubMatch[1]);
      const b = parseFloat(addSubMatch[2]);
      const isAdd = clean.includes('+');
      const result = isAdd ? a + b : a - b;

      steps.push({
        titulo: `Paso AS: Resolviendo ${isAdd ? 'suma' : 'resta'}`,
        antes: clean,
        despues: clean.replace(addSubMatch[0], String(result)),
        explicacion: isAdd
          ? 'Sumar es juntar cantidades. Es como agregar más fichas a tu colección.'
          : 'Restar es quitar una cantidad de otra. Es como cuando compartes tus galletas: lo que te queda es la resta.'
      });
    }

    return steps;
  }
}

export const analizador = new AnalizadorMatematico();
