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
            prop = "Adición"; just = "Juntamos ambas cantidades."; break;
          case 'Subtract': 
            res = leftVal - rightVal; 
            opDesc = `Restar ${leftVal} - ${rightVal}`; 
            prop = "Sustracción"; just = "Diferencia entre las cantidades."; break;
          case 'Multiply': 
            res = leftVal * rightVal; 
            opDesc = `Multiplicar ${leftVal} * ${rightVal}`; 
            prop = "Multiplicación"; just = "Suma repetida."; break;
          case 'Divide': 
            res = leftVal / rightVal; 
            opDesc = `Dividir ${leftVal} / ${rightVal}`; 
            prop = "División"; just = "Repartimos en partes iguales."; break;
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
          description: `Elevar ${(b as any).value} a la ${(e as any).value}`,
          currentState: formatNode(ast),
          appliedProperty: "Potenciación",
          justification: "Multiplicamos la base tantas veces indique el exponente."
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
    description: "Análisis inicial de la ecuación.",
    currentState: formatNode(ast),
    appliedProperty: "Identidad",
    justification: "Ecuación original planteada en el problema."
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
        description: "Variable aislada con éxito.",
        currentState: `${formatNode(left)} = ${formatNode(right)}`,
        appliedProperty: "Finalización",
        justification: "Se ha encontrado el valor de la incógnita."
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
          description: `Restar ${c} en ambos miembros.`,
          currentState: `${formatNode(left)} = ${formatNode(right)}`,
          appliedProperty: "Propiedad Uniforme (Inverso Aditivo)",
          justification: "Aislar el término restando la constante aditiva."
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
          description: `Sumar ${c} en ambos miembros.`,
          currentState: `${formatNode(left)} = ${formatNode(right)}`,
          appliedProperty: "Propiedad Uniforme (Inverso Aditivo)",
          justification: "Neutralizar el término negativo sumando su opuesto."
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
          description: `Dividir entre ${c} en ambos miembros.`,
          currentState: `${formatNode(left)} = ${formatNode(right)}`,
          appliedProperty: "Propiedad Uniforme (Inverso Multiplicativo)",
          justification: "Eliminar el coeficiente dividiendo toda la ecuación."
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
          description: `Aplicar raíz de índice ${c} en ambos miembros.`,
          currentState: `${formatNode(left)} = ${formatNode(right)}`,
          appliedProperty: "Propiedad Uniforme de la Radicación",
          justification: "Neutralizar el exponente mediante la raíz equivalente."
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
    description: "Análisis inicial de la ecuación cuadrática.",
    currentState: formatNode(ast),
    appliedProperty: "Forma Estándar",
    justification: "Se detecta una ecuación polinómica de segundo grado."
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
    description: "Extracción de coeficientes.",
    currentState: `a = ${aStr}, b = ${bStr}, c = ${cStr}`,
    appliedProperty: "Estructura Algebraica",
    justification: "Se identifican los términos cuadrático (a), lineal (b) y constante (c)."
  });

  const discriminante = b * b - 4 * a * c;
  const dStr = Number.isInteger(discriminante) ? discriminante.toString() : discriminante.toFixed(2);

  steps.push({
    stepId: `STEP_${stepCounter++}`,
    description: `Calcular el Discriminante (Δ = b² - 4ac).`,
    currentState: `Δ = (${bStr})² - 4(${aStr})(${cStr}) = ${dStr}`,
    appliedProperty: "Discriminante",
    justification: discriminante > 0 
      ? "Δ > 0, existen dos raíces reales y distintas." 
      : discriminante === 0 
        ? "Δ = 0, existe una raíz real repetida (doble)." 
        : "Δ < 0, las raíces son complejas."
  });

  if (discriminante < 0) {
    steps.push({
      stepId: `STEP_${stepCounter++}`,
      description: "Resolución detenida.",
      currentState: `No existen soluciones reales.`,
      appliedProperty: "Conclusión Cuadrática",
      justification: "Dado que el discriminante es negativo, la parábola no cruza el eje X (soluciones en los números complejos)."
    });
    return steps;
  }

  const sqrtD = Math.sqrt(discriminante);
  const x1 = (-b + sqrtD) / (2 * a);
  const x2 = (-b - sqrtD) / (2 * a);

  const x1Str = Number.isInteger(x1) ? x1.toString() : x1.toFixed(3);
  const x2Str = Number.isInteger(x2) ? x2.toString() : x2.toFixed(3);

  steps.push({
    stepId: `STEP_${stepCounter++}`,
    description: `Aplicar fórmula de Bhaskara: x = (-b ± √Δ) / 2a`,
    currentState: `x = (-${bStr} ± √${dStr}) / (2 * ${aStr})`,
    appliedProperty: "Fórmula General",
    justification: "Se sustituyen los valores para encontrar los puntos de intersección."
  });

  steps.push({
    stepId: `STEP_${stepCounter++}`,
    description: "Desglose de raíces (x₁ y x₂).",
    currentState: `x₁ = ${x1Str} | x₂ = ${x2Str}`,
    appliedProperty: "Raíces del Polinomio",
    justification: "Soluciones de la ecuación."
  });

  // Emulate setting the final calculated value
  // We'll put both roots in the last state
  const finalState = discriminante === 0 ? `x = ${x1Str}` : `x₁ = ${x1Str}, x₂ = ${x2Str}`;

  steps.push({
    stepId: `STEP_${stepCounter++}`,
    description: "Evaluación completada.",
    currentState: finalState,
    appliedProperty: "Resultado Final",
    justification: "Se han determinado los valores que satisfacen la ecuación cuadrática original."
  });

  return steps;
}
