import type { MathNode, SemanticAnalysis, DeepAnalysisReport, ResolutionStep } from './types';

export function solve(ast: MathNode, semantic: SemanticAnalysis, report: DeepAnalysisReport): ResolutionStep[] {
  if (report.recommendedMethod.name === 'Fórmula General') {
    return solveQuadraticFormula(ast);
  }
  if (report.recommendedMethod.name === 'Despeje directo') {
    return solveDirectIsolation(ast);
  }
  if (report.recommendedMethod.name === 'Evaluación aritmética') {
    return evaluateArithmetic(ast);
  }
  throw new Error(`Método '${report.recommendedMethod.name}' aún no implementado.`);
}

export function formatNode(node: MathNode): string {
  switch (node.type) {
    case 'Number': return Number.isInteger(node.value) ? node.value.toString() : parseFloat(node.value.toFixed(10)).toString();
    case 'Variable': return node.name;
    case 'Constant': return node.name;
    case 'Add': return `${formatNode(node.left)} + ${formatNode(node.right)}`;
    case 'Subtract': return `${formatNode(node.left)} - ${formatNode(node.right)}`;
    case 'Multiply': return `${formatNode(node.left)} * ${formatNode(node.right)}`;
    case 'Divide': return `(${formatNode(node.left)}) / (${formatNode(node.right)})`;
    case 'Power': return `${formatNode(node.base)}^${formatNode(node.exp)}`;
    case 'Root': return `root(${formatNode(node.idx)}, ${formatNode(node.rad)})`;
    case 'Equation': return `${formatNode(node.left)} = ${formatNode(node.right)}`;
    case 'FunctionCall': return `${node.name}(${node.args.map(formatNode).join(', ')})`;
  }
}

// -----------------------------------------------------------------
// SOLVER 1: EVALUACIÓN ARITMÉTICA (Expresiones, PEMDAS recursivo)
// -----------------------------------------------------------------
function evaluateArithmetic(ast: MathNode): ResolutionStep[] {
  const steps: ResolutionStep[] = [];
  let stepCounter = 1;

  steps.push({
    stepId: `STEP_${stepCounter++}`,
    description: "Análisis inicial de la expresión.",
    currentState: formatNode(ast),
    appliedProperty: "Jerarquía de Operaciones (PEMDAS)",
    justification: "Expresión aritmética identificada. Se procederá a simplificar siguiendo el orden de las operaciones."
  });

  // Helper recursivo para evaluar el AST y emitir pasos
  function evalNode(node: MathNode): MathNode {
    if (node.type === 'Number' || node.type === 'Variable' || node.type === 'Constant') {
      return node;
    }

    if (node.type === 'FunctionCall') {
      const args = node.args.map(evalNode);
      if (args.every(a => a.type === 'Number')) {
        const val = (args[0] as any).value;
        let res = 0;
        switch(node.name) {
          case 'sin': res = Math.sin(val * Math.PI / 180); break;
          case 'cos': res = Math.cos(val * Math.PI / 180); break;
          case 'tan': res = Math.tan(val * Math.PI / 180); break;
          case 'sqrt': res = Math.sqrt(val); break;
          case 'log': res = Math.log10(val); break;
          case 'ln': res = Math.log(val); break;
        }
        const stateBefore = formatNode(ast);
        const nextNode = { type: 'Number', value: res } as MathNode;
        replaceNodeInAst(node, nextNode);
        steps.push({
          stepId: `STEP_${stepCounter++}`,
          description: `Evaluar función ${node.name}(${val})`,
          currentState: formatNode(ast),
          appliedProperty: "Funciones Trigonométricas y Logarítmicas",
          justification: "Se resuelve la función antes que otras operaciones."
        });
        return nextNode;
      }
      return { ...node, args };
    }

    // Binary operations
    if ('left' in node && 'right' in node) {
      let l = evalNode((node as any).left);
      let r = evalNode((node as any).right);
      
      if (l.type === 'Number' && r.type === 'Number') {
        const leftVal = (l as any).value;
        const rightVal = (r as any).value;
        let res = 0;
        let opDesc = "";
        let prop = "";
        let just = "";

        switch (node.type) {
          case 'Add': 
            res = leftVal + rightVal; 
            opDesc = `Sumar ${leftVal} + ${rightVal}`; 
            prop = "Adición (Suma)"; just = "Combinamos ambas cantidades numéricas según la regla de los signos, respetando el orden PEMDAS."; break;
          case 'Subtract': 
            res = leftVal - rightVal; 
            opDesc = `Restar ${leftVal} - ${rightVal}`; 
            prop = "Sustracción (Resta)"; just = "Calculamos la diferencia entre ambos valores, reduciendo la expresión."; break;
          case 'Multiply': 
            res = leftVal * rightVal; 
            opDesc = `Multiplicar ${leftVal} × ${rightVal}`; 
            prop = "Multiplicación (Producto)"; just = "Evaluamos el producto de los factores antes que las sumas o restas."; break;
          case 'Divide': 
            res = leftVal / rightVal; 
            opDesc = `Dividir ${leftVal} ÷ ${rightVal}`; 
            prop = "División (Cociente)"; just = "Repartimos el dividendo entre el divisor (operación prioritaria)."; break;
        }
        
        const nextNode = { type: 'Number', value: res } as MathNode;
        replaceNodeInAst(node, nextNode);
        
        steps.push({
          stepId: `STEP_${stepCounter++}`,
          description: opDesc,
          currentState: formatNode(ast),
          appliedProperty: prop,
          justification: just
        });
        
        return nextNode;
      }
      return { ...node, left: l, right: r } as MathNode;
    }
    
    if (node.type === 'Power') {
      let b = evalNode(node.base);
      let e = evalNode(node.exp);
      if (b.type === 'Number' && e.type === 'Number') {
        const res = Math.pow((b as any).value, (e as any).value);
        const nextNode = { type: 'Number', value: res } as MathNode;
        replaceNodeInAst(node, nextNode);
        steps.push({
          stepId: `STEP_${stepCounter++}`,
          description: `Calcular la potencia: ${b.value}^${e.value}`,
          currentState: formatNode(ast),
          appliedProperty: "Potenciación (Exponentes)",
          justification: "Resolvemos las potencias (E en PEMDAS) multiplicando la base por sí misma tantas veces como indica el exponente."
        });
        return nextNode;
      }
    }

    return node;
  }

  // Dirty trick to mutate the root AST tree step by step so formatNode(ast) always prints the global state.
  function replaceNodeInAst(target: MathNode, replacement: MathNode) {
    if (ast === target) {
      ast = replacement;
      return;
    }
    // Deep search and replace
    function traverse(n: MathNode): boolean {
      if ('left' in n) {
        if ((n as any).left === target) { (n as any).left = replacement; return true; }
        if (traverse((n as any).left)) return true;
      }
      if ('right' in n) {
        if ((n as any).right === target) { (n as any).right = replacement; return true; }
        if (traverse((n as any).right)) return true;
      }
      if (n.type === 'Power') {
        if (n.base === target) { n.base = replacement; return true; }
        if (traverse(n.base)) return true;
        if (n.exp === target) { n.exp = replacement; return true; }
        if (traverse(n.exp)) return true;
      }
      if (n.type === 'FunctionCall') {
        for (let i=0; i<n.args.length; i++) {
          if (n.args[i] === target) { n.args[i] = replacement; return true; }
          if (traverse(n.args[i])) return true;
        }
      }
      return false;
    }
    traverse(ast);
  }

  // Iterate evaluation until the tree doesn't change
  let prevStr = "";
  while (true) {
    evalNode(ast);
    const curStr = formatNode(ast);
    if (curStr === prevStr || ast.type === 'Number') break;
    prevStr = curStr;
  }

  steps.push({
    stepId: `STEP_${stepCounter++}`,
    description: "Evaluación completada.",
    currentState: formatNode(ast),
    appliedProperty: "Resultado Final",
    justification: "La expresión aritmética ha sido reducida a su mínima expresión."
  });

  return steps;
}

// -----------------------------------------------------------------
// SOLVER 2: DESPEJE DIRECTO (Ecuaciones algebraicas simples)
// -----------------------------------------------------------------
function solveDirectIsolation(ast: MathNode): ResolutionStep[] {
  const steps: ResolutionStep[] = [];
  let stepCounter = 1;

  steps.push({
    stepId: `STEP_${stepCounter++}`,
    description: "Análisis inicial de la ecuación lineal.",
    currentState: formatNode(ast),
    appliedProperty: "Planteamiento de Igualdad",
    justification: "El objetivo de resolver una ecuación es despejar la incógnita (la letra). Imaginamos la ecuación como una balanza en equilibrio perfecto."
  });

  if (ast.type !== 'Equation') {
    throw new Error("El nodo raíz no es una ecuación.");
  }

  let left = ast.left;
  let right = ast.right;

  const MAX_ITERS = 10;
  let iters = 0;

  while (iters++ < MAX_ITERS) {
    if (right.type !== 'Number') {
      throw new Error("El motor actual requiere que el miembro derecho sea una constante.");
    }
    const rightVal = right.value;

    if (left.type === 'Variable') {
      steps.push({
        stepId: `STEP_${stepCounter++}`,
        description: "Despeje completado exitosamente.",
        currentState: `${formatNode(left)} = ${formatNode(right)}`,
        appliedProperty: "Aislamiento Total",
        justification: "Al quedar la variable completamente sola en un lado, el valor del otro lado representa su solución final."
      });
      break;
    }

    if (left.type === 'Add') {
      if (left.right.type === 'Number') {
        const c = left.right.value;
        left = left.left;
        right = { type: 'Number', value: rightVal - c };
        
        steps.push({
          stepId: `STEP_${stepCounter++}`,
          description: `Restar ${c} en ambos lados.`,
          currentState: `${formatNode(left)} = ${formatNode(right)}`,
          appliedProperty: "Inverso Aditivo (Cancelar Suma)",
          justification: "Para eliminar un número que suma, realizamos la operación contraria (resta) a ambos lados para no alterar la balanza."
        });
        continue;
      }
    }

    if (left.type === 'Subtract') {
      if (left.right.type === 'Number') {
        const c = left.right.value;
        left = left.left;
        right = { type: 'Number', value: rightVal + c };
        
        steps.push({
          stepId: `STEP_${stepCounter++}`,
          description: `Sumar ${c} en ambos lados.`,
          currentState: `${formatNode(left)} = ${formatNode(right)}`,
          appliedProperty: "Inverso Aditivo (Cancelar Resta)",
          justification: "Para eliminar un número negativo o resta, sumamos esa misma cantidad en ambos miembros para mantener el equilibrio."
        });
        continue;
      }
    }

    if (left.type === 'Multiply') {
      if (left.left.type === 'Number') {
        const c = left.left.value;
        left = left.right;
        right = { type: 'Number', value: rightVal / c };
        
        steps.push({
          stepId: `STEP_${stepCounter++}`,
          description: `Dividir entre ${c} ambos lados.`,
          currentState: `${formatNode(left)} = ${formatNode(right)}`,
          appliedProperty: "Inverso Multiplicativo (Cancelar Multiplicación)",
          justification: "Como el número multiplica a la incógnita, dividimos ambos lados entre dicho valor para dejar la variable con coeficiente 1."
        });
        continue;
      }
    }

    if (left.type === 'Power') {
      if (left.exp.type === 'Number') {
        const c = left.exp.value;
        left = left.base;
        const rootVal = Math.pow(rightVal, 1.0 / c);
        right = { type: 'Number', value: rootVal };
        
        steps.push({
          stepId: `STEP_${stepCounter++}`,
          description: `Aplicar raíz de índice ${c} en ambos lados.`,
          currentState: `${formatNode(left)} = ${formatNode(right)}`,
          appliedProperty: "Radicación (Cancelar Potencia)",
          justification: "Para eliminar un exponente, aplicamos la raíz equivalente a ambos lados de la ecuación."
        });
        continue;
      }
    }

    throw new Error(`Operaciones en el AST no soportadas para Despeje Directo en este prototipo (nodo actual: ${left.type}).`);
  }

  return steps;
}

// -----------------------------------------------------------------
// SOLVER 3: FÓRMULA GENERAL (Ecuaciones Cuadráticas)
// -----------------------------------------------------------------
function evaluateAtPoly(ast: MathNode, val: number): number {
  if (ast.type === 'Number') return ast.value;
  if (ast.type === 'Variable') return val;
  if (ast.type === 'Add') return evaluateAtPoly(ast.left, val) + evaluateAtPoly(ast.right, val);
  if (ast.type === 'Subtract') return evaluateAtPoly(ast.left, val) - evaluateAtPoly(ast.right, val);
  if (ast.type === 'Multiply') return evaluateAtPoly(ast.left, val) * evaluateAtPoly(ast.right, val);
  if (ast.type === 'Divide') return evaluateAtPoly(ast.left, val) / evaluateAtPoly(ast.right, val);
  if (ast.type === 'Power') return Math.pow(evaluateAtPoly(ast.base, val), evaluateAtPoly(ast.exp, val));
  return 0;
}

function solveQuadraticFormula(ast: MathNode): ResolutionStep[] {
  const steps: ResolutionStep[] = [];
  let stepCounter = 1;

  steps.push({
    stepId: `STEP_${stepCounter++}`,
    description: "Reconocimiento de la Ecuación Cuadrática.",
    currentState: formatNode(ast),
    appliedProperty: "Inspección Algebraica",
    justification: "Se detecta que la variable está elevada al cuadrado (x²), por lo que es una ecuación de segundo grado que requiere métodos avanzados."
  });

  if (ast.type !== 'Equation') {
    throw new Error("El nodo raíz no es una ecuación.");
  }

  const f = (x: number) => evaluateAtPoly(ast.left, x) - evaluateAtPoly(ast.right, x);
  const c = f(0);
  const f1 = f(1);
  const fm1 = f(-1);
  const a = (f1 + fm1 - 2 * c) / 2;
  const b = f1 - c - a;

  const aStr = Number.isInteger(a) ? a.toString() : a.toFixed(2);
  const bStr = Number.isInteger(b) ? b.toString() : b.toFixed(2);
  const cStr = Number.isInteger(c) ? c.toString() : c.toFixed(2);

  steps.push({
    stepId: `STEP_${stepCounter++}`,
    description: "Ordenamiento a la Forma Estándar.",
    currentState: `${aStr}x² ${b >= 0 ? '+' : ''}${bStr}x ${c >= 0 ? '+' : ''}${cStr} = 0`,
    appliedProperty: "Forma General (ax² + bx + c = 0)",
    justification: "Para resolverla, agrupamos todos los términos a un lado de la igualdad, dejándola igualada a cero."
  });

  steps.push({
    stepId: `STEP_${stepCounter++}`,
    description: "Identificación de Coeficientes.",
    currentState: `a = ${aStr} | b = ${bStr} | c = ${cStr}`,
    appliedProperty: "Abstracción Simbólica",
    justification: "Extraemos los valores numéricos que acompañan a x² (a), a x (b) y al término independiente (c)."
  });

  steps.push({
    stepId: `STEP_${stepCounter++}`,
    description: "Planteamiento del Discriminante (Δ).",
    currentState: `Δ = b² - 4ac`,
    appliedProperty: "Fórmula del Discriminante",
    justification: "El discriminante nos dirá cuántas soluciones tiene la ecuación antes de resolverla por completo."
  });

  steps.push({
    stepId: `STEP_${stepCounter++}`,
    description: "Sustitución en el Discriminante.",
    currentState: `Δ = (${bStr})² - 4(${aStr})(${cStr})`,
    appliedProperty: "Sustitución Algebraica",
    justification: "Reemplazamos las letras b, a y c por sus respectivos valores numéricos."
  });

  const bSquared = b * b;
  const fourAC = 4 * a * c;
  steps.push({
    stepId: `STEP_${stepCounter++}`,
    description: "Cálculo de Potencia y Multiplicación.",
    currentState: `Δ = ${Number.isInteger(bSquared) ? bSquared : bSquared.toFixed(2)} - (${Number.isInteger(fourAC) ? fourAC : fourAC.toFixed(2)})`,
    appliedProperty: "Jerarquía de Operaciones",
    justification: "Resolvemos primero la potencia cuadrada y luego la multiplicación triple."
  });

  const discriminante = bSquared - fourAC;
  const dStr = Number.isInteger(discriminante) ? discriminante.toString() : discriminante.toFixed(2);

  steps.push({
    stepId: `STEP_${stepCounter++}`,
    description: `Valor Final del Discriminante.`,
    currentState: `Δ = ${dStr}`,
    appliedProperty: "Naturaleza de las Raíces",
    justification: discriminante > 0 
      ? "Como Δ es positivo (> 0), la ecuación tiene dos soluciones reales y distintas. La parábola corta el eje X en dos puntos." 
      : discriminante === 0 
        ? "Como Δ es cero, la ecuación tiene una única solución real (raíz doble). La parábola solo toca el eje X en un punto." 
        : "Como Δ es negativo (< 0), la ecuación no tiene soluciones reales (son complejas). La parábola no toca el eje X."
  });

  if (discriminante < 0) {
    steps.push({
      stepId: `STEP_${stepCounter++}`,
      description: "Resolución Detenida.",
      currentState: `Sin soluciones reales.`,
      appliedProperty: "Conclusión",
      justification: "El proceso se detiene aquí para el conjunto de los números reales."
    });
    return steps;
  }

  steps.push({
    stepId: `STEP_${stepCounter++}`,
    description: "Planteamiento de la Fórmula General (Bhaskara).",
    currentState: `x = (-b ± √Δ) / 2a`,
    appliedProperty: "Fórmula General Cuadrática",
    justification: "Utilizamos la fórmula universal para encontrar exactamente dónde están las soluciones."
  });

  const sqrtD = Math.sqrt(discriminante);
  const sqrtDStr = Number.isInteger(sqrtD) ? sqrtD.toString() : sqrtD.toFixed(3);
  const twoA = 2 * a;
  const twoAStr = Number.isInteger(twoA) ? twoA.toString() : twoA.toFixed(2);

  steps.push({
    stepId: `STEP_${stepCounter++}`,
    description: "Sustitución y Cálculo de Raíz.",
    currentState: `x = (-(${bStr}) ± ${sqrtDStr}) / ${twoAStr}`,
    appliedProperty: "Operaciones Aritméticas Básicas",
    justification: "Sustituimos -b, extraemos la raíz cuadrada de Δ y multiplicamos el denominador (2a)."
  });

  const x1 = (-b + sqrtD) / (2 * a);
  const x2 = (-b - sqrtD) / (2 * a);

  const x1Str = Number.isInteger(x1) ? x1.toString() : x1.toFixed(3);
  const x2Str = Number.isInteger(x2) ? x2.toString() : x2.toFixed(3);

  if (discriminante > 0) {
    steps.push({
      stepId: `STEP_${stepCounter++}`,
      description: "Bifurcación de Soluciones (Camino Positivo).",
      currentState: `x₁ = (-(${bStr}) + ${sqrtDStr}) / ${twoAStr}`,
      appliedProperty: "Separación del ±",
      justification: "Calculamos la primera solución usando el signo de suma (+)."
    });
    steps.push({
      stepId: `STEP_${stepCounter++}`,
      description: "Resultado de x₁.",
      currentState: `x₁ = ${x1Str}`,
      appliedProperty: "Simplificación",
      justification: "Se obtiene la primera coordenada del punto de corte."
    });

    steps.push({
      stepId: `STEP_${stepCounter++}`,
      description: "Bifurcación de Soluciones (Camino Negativo).",
      currentState: `x₂ = (-(${bStr}) - ${sqrtDStr}) / ${twoAStr}`,
      appliedProperty: "Separación del ±",
      justification: "Calculamos la segunda solución usando el signo de resta (-)."
    });
    steps.push({
      stepId: `STEP_${stepCounter++}`,
      description: "Resultado de x₂.",
      currentState: `x₂ = ${x2Str}`,
      appliedProperty: "Simplificación",
      justification: "Se obtiene la segunda coordenada del punto de corte."
    });
  }

  const finalState = discriminante === 0 ? `x = ${x1Str}` : `x₁ = ${x1Str}, x₂ = ${x2Str}`;

  steps.push({
    stepId: `STEP_${stepCounter++}`,
    description: "Conclusión de la Resolución.",
    currentState: finalState,
    appliedProperty: "Resultado Final",
    justification: discriminante === 0 ? "La ecuación tiene un único punto de intersección." : "Se han encontrado ambas intersecciones donde la ecuación se equilibra."
  });

  return steps;
}
