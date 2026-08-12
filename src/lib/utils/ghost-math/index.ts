import { Lexer } from './lexer';
import { Parser } from './parser';
import { analyze } from './semantic';
import { solve } from './resolution';
import type { MathNode, SemanticAnalysis, DeepAnalysisReport, ResolutionStep } from './types';

export class GhostMathExpert {
  
  /**
   * Process a mathematical string through the 4-motor architecture:
   * 1. Lexical/Syntactic (AST creation)
   * 2. Semantic Analysis (Taxonomy)
   * 3. Pedagogical (Graph & Complexity)
   * 4. Resolution Engine
   */
  static process(input: string): { ast: MathNode, semantic: SemanticAnalysis, report: DeepAnalysisReport, steps: ResolutionStep[] } {
    // Phase 1: Lexical and Syntactic Engine
    const lexer = new Lexer(input);
    const tokens = lexer.tokenize();
    const parser = new Parser(tokens);
    const ast = parser.parse();

    // Phase 2 & 3: Semantic and Cognitive Engine (Knowledge Graph evaluation)
    const { semantic, report } = analyze(ast);

    // Phase 4: Resolution Engine
    const steps = solve(ast, semantic, report);

    return {
      ast,
      semantic,
      report,
      steps
    };
  }
}
