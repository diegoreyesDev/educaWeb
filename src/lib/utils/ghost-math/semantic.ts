import type { MathNode, SemanticAnalysis, DeepAnalysisReport } from './types';
import { buildUniversalGraph } from './graph';

export function analyze(ast: MathNode): { semantic: SemanticAnalysis; report: DeepAnalysisReport } {
  // Mockup semántico: en un caso real se recorre el AST para buscar variables y grados
  const semantic: SemanticAnalysis = {
    variables: ['x'],
    constants: [],
    relation: ast.type === 'Equation' ? 'Equality' : 'Expression',
    goal: 'Encontrar x',
    domain: 'Números Reales',
  };

  const graph = buildUniversalGraph();

  // Análisis Profundo
  const report: DeepAnalysisReport = {
    objectType: ast.type === 'Equation' ? 'Ecuación algebraica' : 'Expresión matemática',
    domain: ast.type === 'Equation' ? 'Álgebra' : 'Aritmética',
    subdomain: ast.type === 'Equation' ? 'Polinomios' : 'Operaciones Básicas',
    theme: ast.type === 'Equation' ? 'Ecuaciones lineales' : 'Cálculo Aritmético',
    curricularLevel: ast.type === 'Equation' ? 'Enseñanza Media' : 'Educación Básica/Media',
    complexity: {
      operational: 2,
      conceptual: ast.type === 'Equation' ? 4 : 2,
      abstraction: ast.type === 'Equation' ? 3 : 1,
      totalDifficulty: ast.type === 'Equation' ? (2+4+3) / 3 : (2+2+1) / 3,
    },
    recommendedMethod: {
      name: ast.type === 'Equation' ? 'Despeje directo' : 'Evaluación aritmética',
      justification: ast.type === 'Equation' ? 'La variable aparece aislada y puede resolverse mediante operaciones inversas básicas.' : 'Expresión puramente aritmética, se resolverá respetando la jerarquía de operaciones (PEMDAS).',
    },
    estimatedTimeSecs: ast.type === 'Equation' ? 60 : 15,
  };

  return { semantic, report };
}
