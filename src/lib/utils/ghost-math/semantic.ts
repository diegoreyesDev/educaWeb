import type { MathNode, SemanticAnalysis, DeepAnalysisReport } from './types';

// Helper to evaluate polynomial for degree checking
function evaluateAt(ast: MathNode, val: number): number {
  if (ast.type === 'Number') return ast.value;
  if (ast.type === 'Variable') return val;
  if (ast.type === 'Add') return evaluateAt(ast.left, val) + evaluateAt(ast.right, val);
  if (ast.type === 'Subtract') return evaluateAt(ast.left, val) - evaluateAt(ast.right, val);
  if (ast.type === 'Multiply') return evaluateAt(ast.left, val) * evaluateAt(ast.right, val);
  if (ast.type === 'Divide') return evaluateAt(ast.left, val) / evaluateAt(ast.right, val);
  if (ast.type === 'Power') return Math.pow(evaluateAt(ast.base, val), evaluateAt(ast.exp, val));
  if (ast.type === 'FunctionCall') return 0; // unsupported for simple poly check
  return 0;
}

export function analyze(ast: MathNode): { semantic: SemanticAnalysis; report: DeepAnalysisReport } {
  const semantic: SemanticAnalysis = {
    variables: ['x'],
    constants: [],
    relation: ast.type === 'Equation' ? 'Equality' : 'Expression',
    goal: 'Encontrar x',
    domain: 'Números Reales',
  };

  let isQuadratic = false;
  if (ast.type === 'Equation') {
    const f = (x: number) => evaluateAt(ast.left, x) - evaluateAt(ast.right, x);
    const c = f(0);
    const f1 = f(1);
    const fm1 = f(-1);
    const a = (f1 + fm1 - 2 * c) / 2;
    const b = f1 - c - a;
    const f2 = f(2);
    // Check if it matches a parabola and a !== 0
    if (Math.abs(a) > 1e-7 && Math.abs(f2 - (a * 4 + b * 2 + c)) < 1e-7) {
      isQuadratic = true;
    }
  }

  const isEq = ast.type === 'Equation';
  let method = isEq ? 'Resolución Lineal' : 'Evaluación aritmética';
  let just = isEq ? 'Ecuación lineal o polinómica de primer grado. Se agruparán los términos para despejar la incógnita.' : 'Expresión puramente aritmética, se resolverá respetando la jerarquía de operaciones (PEMDAS).';
  let theme = isEq ? 'Ecuaciones lineales' : 'Cálculo Aritmético';

  if (isQuadratic) {
    method = 'Fórmula General';
    just = 'Ecuación de segundo grado detectada. Se aplicará la fórmula de Bhaskara para encontrar las raíces.';
    theme = 'Ecuaciones cuadráticas';
  }

  // Análisis Profundo
  const report: DeepAnalysisReport = {
    objectType: isEq ? 'Ecuación algebraica' : 'Expresión matemática',
    domain: isEq ? 'Álgebra' : 'Aritmética',
    subdomain: isEq ? 'Polinomios' : 'Operaciones Básicas',
    theme,
    curricularLevel: isEq ? 'Enseñanza Media' : 'Educación Básica/Media',
    complexity: {
      operational: isQuadratic ? 4 : 2,
      conceptual: isEq ? 4 : 2,
      abstraction: isEq ? 3 : 1,
      totalDifficulty: isEq ? (isQuadratic ? 4 : 3) : 1.6,
    },
    recommendedMethod: {
      name: method,
      justification: just,
    },
    estimatedTimeSecs: isQuadratic ? 120 : (isEq ? 60 : 15),
  };

  return { semantic, report };
}
