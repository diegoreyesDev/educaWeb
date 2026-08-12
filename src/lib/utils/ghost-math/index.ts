import { Lexer } from './lexer';
import { Parser } from './parser';
import { analyze as semanticAnalyze } from './semantic';
import { solve } from './resolution';
import type { MathNode, SemanticAnalysis, DeepAnalysisReport, ResolutionStep } from './types';

// ============================================================================
// INTERFAZ PUENTE (BRIDGE) HACIA EL FRONTEND SVELTE
// ============================================================================
export interface AnalysisStep {
  paso: number;
  titulo: string;
  expresionAntes: string;
  expresionDespues: string;
  valorCalculado?: number;
  explicacion: string;
  tipo: 'estructural' | 'resolucion' | 'conclusion';
  operacion?: string;
  resultadoIntermedio?: string;
}

export class GhostMathExpert {
  
  analyze(input: string): AnalysisStep[] {
    const analysisSteps: AnalysisStep[] = [];
    
    // 1. Lexical and Syntactic
    const lexer = new Lexer(input);
    let tokens;
    try {
      tokens = lexer.tokenize();
    } catch(err) {
      return [{
         paso: 1,
         titulo: 'Error Léxico',
         expresionAntes: input,
         expresionDespues: 'Símbolo desconocido',
         explicacion: err instanceof Error ? err.message : String(err),
         tipo: 'conclusion'
      }];
    }

    // Bypass para entradas vacías
    if (tokens.length <= 1) {
       return [];
    }

    const parser = new Parser(tokens);
    let ast: MathNode;
    try {
      ast = parser.parse();
    } catch(err) {
      return [{
         paso: 1,
         titulo: 'Error Sintáctico',
         expresionAntes: input,
         expresionDespues: 'Estructura inválida',
         explicacion: err instanceof Error ? err.message : String(err),
         tipo: 'conclusion'
      }];
    }

    // 2 & 3. Semantic & Cognitive
    const { semantic, report } = semanticAnalyze(ast);

    analysisSteps.push({
      paso: 1,
      titulo: 'Análisis Estructural (Motor Cognitivo)',
      expresionAntes: input,
      expresionDespues: `Categoría: ${report.objectType} | Dificultad base: ${report.complexity.totalDifficulty.toFixed(1)}`,
      explicacion: `El sistema ha clasificado el problema como '${report.theme}'. Se aplicará la estrategia pedagógica de '${report.recommendedMethod.name}'.`,
      tipo: 'estructural',
      operacion: 'Reconocimiento Taxonómico'
    });

    // 4. Resolution
    let steps: ResolutionStep[] = [];
    try {
      steps = solve(ast, semantic, report);
    } catch(err) {
      analysisSteps.push({
         paso: 2,
         titulo: 'Límite Algorítmico',
         expresionAntes: input,
         expresionDespues: 'Operación no soportada',
         explicacion: err instanceof Error ? err.message : String(err),
         tipo: 'conclusion'
      });
      return analysisSteps;
    }

    // Bridge Translation from ResolutionStep to AnalysisStep
    let currentPaso = 2;
    for (let i = 0; i < steps.length; i++) {
       const step = steps[i];
       const isLast = (i === steps.length - 1);
       
       let extractedValue: number | undefined = undefined;
       if (isLast) {
          if (step.currentState.includes('=')) {
             const parts = step.currentState.split('=');
             if (parts.length === 2) {
                const val = parseFloat(parts[1].trim());
                if (!isNaN(val)) extractedValue = val;
             }
          } else {
             const val = parseFloat(step.currentState.trim());
             if (!isNaN(val)) extractedValue = val;
          }
       }

       analysisSteps.push({
         paso: currentPaso++,
         titulo: step.appliedProperty,
         expresionAntes: i === 0 ? input : steps[i-1].currentState,
         expresionDespues: step.currentState,
         explicacion: step.justification,
         tipo: isLast ? 'conclusion' : 'resolucion',
         operacion: step.description,
         valorCalculado: extractedValue
       });
    }

    return analysisSteps;
  }
}

// Export the singleton to be used by UI
export const ghostMath = new GhostMathExpert();
