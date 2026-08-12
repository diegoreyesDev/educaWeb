import type { MathNode, SemanticAnalysis, DeepAnalysisReport, ResolutionStep } from './types';

export function solve(ast: MathNode, semantic: SemanticAnalysis, report: DeepAnalysisReport): ResolutionStep[] {
  if (report.recommendedMethod.name === 'Despeje directo') {
    return solveDirectIsolation(ast);
  }
  throw new Error(`Método '${report.recommendedMethod.name}' aún no implementado.`);
}

export function formatNode(node: MathNode): string {
  switch (node.type) {
    case 'Number': return node.value.toString();
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
      if (left.left.type === 'Number') { // e.g. 2 * x
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
