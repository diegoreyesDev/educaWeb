import type { KnowledgeGraph, ConceptNode } from './types';

export function buildUniversalGraph(): KnowledgeGraph {
  const nodes: Record<string, ConceptNode> = {};

  const addNode = (id: string, name: string, hierarchy: string[], pre: string[], unlocks: string[], weight: number) => {
    nodes[id] = { id, name, hierarchy, prerequisites: pre, unlocks, cognitiveWeight: weight };
  };

  // Aritmética
  addNode("num_reales", "Números Reales", ["Aritmética", "Números Reales"], [], ["aritmetica_basica"], 2);
  addNode("aritmetica_basica", "Aritmética Básica", ["Aritmética", "Operaciones Básicas"], ["num_reales"], ["potenciacion", "algebra_base"], 3);
  addNode("potenciacion", "Potenciación y Radicación", ["Aritmética", "Potencias"], ["aritmetica_basica"], ["polinomios"], 5);

  // Álgebra
  addNode("algebra_base", "Introducción al Álgebra", ["Álgebra", "Fundamentos"], ["aritmetica_basica"], ["ecuaciones_lineales", "polinomios"], 4);
  addNode("polinomios", "Polinomios", ["Álgebra", "Polinomios"], ["algebra_base", "potenciacion"], ["factorizacion", "ecuaciones_cuadraticas"], 5);
  addNode("factorizacion", "Factorización de Polinomios", ["Álgebra", "Factorización"], ["polinomios"], ["ecuaciones_cuadraticas_fact"], 7);

  // Ecuaciones
  addNode("ecuaciones_lineales", "Ecuaciones Lineales", ["Álgebra", "Ecuaciones", "Primer Grado"], ["algebra_base"], ["ecuaciones_cuadraticas"], 5);
  addNode("ecuaciones_cuadraticas", "Ecuaciones Cuadráticas", ["Álgebra", "Ecuaciones", "Segundo Grado"], ["ecuaciones_lineales", "polinomios"], ["discriminante"], 6);
  addNode("ecuaciones_cuadraticas_fact", "Resolución por Factorización", ["Álgebra", "Ecuaciones", "Segundo Grado", "Factorización"], ["ecuaciones_cuadraticas", "factorizacion"], [], 6);
  addNode("discriminante", "Discriminante", ["Álgebra", "Ecuaciones", "Segundo Grado", "Discriminante"], ["ecuaciones_cuadraticas"], ["formula_general"], 5);
  addNode("formula_general", "Fórmula General", ["Álgebra", "Ecuaciones", "Segundo Grado", "Fórmula General"], ["discriminante"], [], 6);

  return { nodes };
}
