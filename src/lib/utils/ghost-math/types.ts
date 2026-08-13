export type MathNode =
  | { type: 'Number'; value: number }
  | { type: 'Variable'; name: string }
  | { type: 'Constant'; name: string }
  | { type: 'Add'; left: MathNode; right: MathNode }
  | { type: 'Subtract'; left: MathNode; right: MathNode }
  | { type: 'Multiply'; left: MathNode; right: MathNode }
  | { type: 'Divide'; left: MathNode; right: MathNode }
  | { type: 'Power'; base: MathNode; exp: MathNode }
  | { type: 'Root'; idx: MathNode; rad: MathNode }
  | { type: 'Equation'; left: MathNode; right: MathNode }
  | { type: 'FunctionCall'; name: string; args: MathNode[] };

export interface SemanticAnalysis {
  variables: string[];
  constants: number[];
  relation: 'Equality' | 'Expression';
  goal: string;
  domain: string;
}

export interface ComplexityIndex {
  operational: number;
  conceptual: number;
  abstraction: number;
  totalDifficulty: number;
}

export interface ResolutionMethod {
  name: string;
  justification: string;
}

export interface DeepAnalysisReport {
  objectType: string;
  domain: string;
  subdomain: string;
  theme: string;
  curricularLevel: string;
  complexity: ComplexityIndex;
  recommendedMethod: ResolutionMethod;
  estimatedTimeSecs: number;
}

export interface ResolutionStep {
  stepId: string;
  description: string;
  currentState: string;
  appliedProperty: string;
  justification: string;
}

export interface ConceptNode {
  id: string;
  name: string;
  hierarchy: string[];
  prerequisites: string[];
  unlocks: string[];
  cognitiveWeight: number;
}

export interface KnowledgeGraph {
  nodes: Record<string, ConceptNode>;
}
