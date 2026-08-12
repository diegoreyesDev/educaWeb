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
    domain: 'Álgebra',
    subdomain: 'Polinomios',
    theme: 'Ecuaciones lineales',
    curricularLevel: 'Enseñanza Media',
    complexity: {
      operational: 2,
      conceptual: 4,
      abstraction: 3,
      totalDifficulty: (2+4+3) / 3,
    },
    recommendedMethod: {
      name: ast.type === 'Equation' ? 'Despeje directo' : 'Evaluación aritmética',
      justification: ast.type === 'Equation' ? 'La variable aparece aislada y puede resolverse mediante operaciones inversas básicas.' : 'Expresión puramente aritmética, se resolverá respetando la jerarquía de operaciones (PEMDAS).',
    },
    estimatedTimeSecs: 60,
  };

  return { semantic, report };
}
