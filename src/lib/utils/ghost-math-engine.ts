/**
 * GHOST-MATH ENGINE — Motor de Razonamiento Matemático
 * ======================================================
 * Step-by-step mathematical expression analyzer using the
 * COPISI psychopedagogical methodology (Concreto, Pictórico,
 * Simbólico). Operates on a token array, applies PEMDAS
 * iteratively, and generates Spanish-language explanations
 * with concrete analogies at each step.
 *
 * Exports:
 *   GhostMathEngine class (analyze method)
 *   ghostMath singleton instance
 *   AnalysisStep, Token, TokenType types
 *   tokenize function
 */

// ============================================================================
// TYPES
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

export type TokenType = 'number' | 'operator' | 'function' | 'constant' | 'lparen' | 'rparen' | 'variable' | 'equals';

export interface Token {
  type: TokenType;
  value: string;
  numericValue?: number;
}

// ============================================================================
// CHARACTER HELPERS
// ============================================================================

function isDigit(ch: string): boolean {
  return ch >= '0' && ch <= '9';
}

function isAlpha(ch: string): boolean {
  return (ch >= 'a' && ch <= 'z') || (ch >= 'A' && ch <= 'Z');
}

const KNOWN_FUNCTIONS = new Set(['sin', 'cos', 'tan', 'log', 'ln', 'sqrt']);

// ============================================================================
// TOKENIZER
// ============================================================================

export function tokenize(expr: string): Token[] {
  const tokens: Token[] = [];
  let i = 0;
  const len = expr.length;

  while (i < len) {
    const ch = expr[i];

    if (ch === ' ' || ch === '\t' || ch === '\n' || ch === '\r') {
      i++;
      continue;
    }

    // Numbers: integers, decimals, leading decimals like .5
    if (isDigit(ch) || (ch === '.' && i + 1 < len && isDigit(expr[i + 1]))) {
      let numStr = '';
      while (i < len && (isDigit(expr[i]) || expr[i] === '.')) {
        numStr += expr[i];
        i++;
      }
      const numVal = parseFloat(numStr);
      if (!isNaN(numVal)) {
        tokens.push({ type: 'number', value: numStr, numericValue: numVal });
      }
      continue;
    }

    // Parentheses
    if (ch === '(') {
      tokens.push({ type: 'lparen', value: '(' });
      i++;
      continue;
    }
    if (ch === ')') {
      tokens.push({ type: 'rparen', value: ')' });
      i++;
      continue;
    }

    // Operators including Unicode × and ÷
    if ('+-*/^\u00d7\u00f7'.includes(ch)) {
      tokens.push({ type: 'operator', value: ch });
      i++;
      continue;
    }

    // Equals
    if (ch === '=') {
      tokens.push({ type: 'equals', value: '=' });
      i++;
      continue;
    }

    // π constant
    if (ch === '\u03c0') {
      tokens.push({ type: 'constant', value: 'pi', numericValue: Math.PI });
      i++;
      continue;
    }

    // Named functions and constants
    if (isAlpha(ch)) {
      let word = '';
      while (i < len && isAlpha(expr[i])) {
        word += expr[i];
        i++;
      }
      const lower = word.toLowerCase();
      if (KNOWN_FUNCTIONS.has(lower)) {
        tokens.push({ type: 'function', value: lower });
        continue;
      }
      if (lower === 'pi') {
        tokens.push({ type: 'constant', value: 'pi', numericValue: Math.PI });
        continue;
      }
      if (lower === 'e') {
        tokens.push({ type: 'constant', value: 'e', numericValue: Math.E });
        continue;
      }
      if (lower === 'x') {
        tokens.push({ type: 'variable', value: 'x' });
        continue;
      }
      // Unknown word — silently ignored
      continue;
    }

    // Any other character — skip
    i++;
  }

  return tokens;
}

// ============================================================================
// TOKEN NORMALIZATION: symbol replacement, unary minus, implicit multiplication
// ============================================================================

function normalizeTokens(tokens: Token[]): Token[] {
  let result: Token[] = [];

  for (let i = 0; i < tokens.length; i++) {
    const token = tokenClone(tokens[i]);

    // Replace × → *
    if (token.type === 'operator' && token.value === '\u00d7') {
      token.value = '*';
    }
    // Replace ÷ → /
    if (token.type === 'operator' && token.value === '\u00f7') {
      token.value = '/';
    }

    // ---- Handle unary minus ----
    if (token.type === 'operator' && token.value === '-') {
      const prevToken = result.length > 0 ? result[result.length - 1] : null;
      const isUnary =
        !prevToken ||
        prevToken.type === 'lparen' ||
        prevToken.type === 'operator';

      if (isUnary && i + 1 < tokens.length) {
        const next = tokens[i + 1];

        if (next.type === 'number') {
          const negVal = -(next.numericValue ?? 0);
          result.push({
            type: 'number',
            value: fmtNum(negVal),
            numericValue: negVal,
          });
          i++;
          continue;
        }

        if (next.type === 'constant') {
          const negVal = -(next.numericValue ?? 0);
          result.push({
            type: 'number',
            value: fmtNum(negVal),
            numericValue: negVal,
          });
          i++;
          continue;
        }

        if (next.type === 'lparen') {
          // -(expr) → -1 * (expr)
          result.push({ type: 'number', value: '-1', numericValue: -1 });
          result.push({ type: 'operator', value: '*' });
          continue;
        }

        if (next.type === 'function') {
          // -func(x) → -1 * func(x)
          result.push({ type: 'number', value: '-1', numericValue: -1 });
          result.push({ type: 'operator', value: '*' });
          continue;
        }
      }
    }

    result.push(token);
  }

  // ---- Insert implicit multiplication ----
  const inserted: Token[] = [];
  for (let i = 0; i < result.length; i++) {
    inserted.push(result[i]);

    if (i + 1 < result.length) {
      const curr = result[i];
      const next = result[i + 1];

      const needsMult =
        (curr.type === 'number' &&
          (next.type === 'lparen' ||
            next.type === 'function' ||
            next.type === 'constant' ||
            next.type === 'variable')) ||
        (curr.type === 'rparen' &&
          (next.type === 'number' ||
            next.type === 'lparen' ||
            next.type === 'function' ||
            next.type === 'constant' ||
            next.type === 'variable')) ||
        (curr.type === 'constant' &&
          (next.type === 'number' ||
            next.type === 'lparen' ||
            next.type === 'function' ||
            next.type === 'constant' ||
            next.type === 'variable')) ||
        (curr.type === 'variable' &&
          (next.type === 'number' ||
            next.type === 'lparen' ||
            next.type === 'function' ||
            next.type === 'constant' ||
            next.type === 'variable'));

      if (needsMult) {
        inserted.push({ type: 'operator', value: '*' });
      }
    }
  }

  // ---- Convert remaining constants to numbers ----
  return inserted.map((t) =>
    t.type === 'constant'
      ? { type: 'number' as TokenType, value: fmtNum(t.numericValue ?? 0), numericValue: t.numericValue }
      : t
  );
}

function tokenClone(t: Token): Token {
  return {
    type: t.type,
    value: t.value,
    numericValue: t.numericValue,
  };
}

// ============================================================================
// NUMBER FORMATTING
// ============================================================================

function fmtNum(n: number): string {
  if (!isFinite(n)) return String(n);
  if (Number.isInteger(n)) return String(n);
  // Round to 10 decimal places to avoid floating-point artifacts,
  // then strip trailing zeros.
  const rounded = parseFloat(n.toFixed(10));
  return String(rounded);
}

function roundEval(n: number): number {
  return parseFloat(n.toFixed(10));
}

// ============================================================================
// TOKEN ARRAY → READABLE STRING
// ============================================================================

function tokensToString(tokens: Token[]): string {
  if (tokens.length === 0) return '';

  let result = '';

  for (let i = 0; i < tokens.length; i++) {
    const t = tokens[i];
    const prev = i > 0 ? tokens[i - 1] : null;

    if (t.type === 'function') {
      result += t.value;
      continue;
    }

    if (t.type === 'lparen') {
      result += '(';
      continue;
    }

    if (t.type === 'rparen') {
      result += ')';
      continue;
    }

    if (t.type === 'operator') {
      if (t.value === '^') {
        result += '^';
      } else {
        result += ' ' + t.value + ' ';
      }
      continue;
    }

    if (t.type === 'number') {
      const display = t.numericValue !== undefined ? fmtNum(t.numericValue) : t.value;
      if (prev && prev.type === 'rparen') {
        result += ' ' + display;
      } else {
        result += display;
      }
      continue;
    }

    if (t.type === 'constant' || t.type === 'variable') {
      result += t.value;
      continue;
    }

    if (t.type === 'equals') {
      result += ' = ';
      continue;
    }

    result += t.value;
  }

  return result.replace(/\s+/g, ' ').trim();
}

// ============================================================================
// TOKEN ARRAY SEARCH HELPERS
// ============================================================================

/** Find the rightmost 'lparen' — innermost nested parenthesis. */
function findInnermostLeftParen(tokens: Token[]): number {
  for (let i = tokens.length - 1; i >= 0; i--) {
    if (tokens[i].type === 'lparen') return i;
  }
  return -1;
}

/** Find the matching 'rparen' for the lparen at `leftIndex`. */
function findMatchingRightParen(tokens: Token[], leftIndex: number): number {
  let depth = 1;
  for (let i = leftIndex + 1; i < tokens.length; i++) {
    if (tokens[i].type === 'lparen') depth++;
    if (tokens[i].type === 'rparen') depth--;
    if (depth === 0) return i;
  }
  return -1;
}

/** Find the rightmost ^ operator (right-associative) with number operands. */
function findRightmostPower(tokens: Token[]): number {
  for (let i = tokens.length - 2; i >= 1; i--) {
    if (
      tokens[i].type === 'operator' &&
      tokens[i].value === '^' &&
      tokens[i - 1].type === 'number' &&
      tokens[i + 1].type === 'number'
    ) {
      return i;
    }
  }
  return -1;
}

/** Find the leftmost * or / with number operands. */
function findLeftmostMulDiv(tokens: Token[]): number {
  for (let i = 1; i < tokens.length - 1; i++) {
    if (
      tokens[i].type === 'operator' &&
      (tokens[i].value === '*' || tokens[i].value === '/') &&
      tokens[i - 1].type === 'number' &&
      tokens[i + 1].type === 'number'
    ) {
      return i;
    }
  }
  return -1;
}

/** Find the leftmost + or - with number operands. */
function findLeftmostAddSub(tokens: Token[]): number {
  for (let i = 1; i < tokens.length - 1; i++) {
    if (
      tokens[i].type === 'operator' &&
      (tokens[i].value === '+' || tokens[i].value === '-') &&
      tokens[i - 1].type === 'number' &&
      tokens[i + 1].type === 'number'
    ) {
      return i;
    }
  }
  return -1;
}

// ============================================================================
// COPISI PSYCHOPEDAGOGICAL EXPLANATION GENERATORS
// ============================================================================

function explainParenthesis(innerStr: string, result: number): string {
  return `Paréntesis: resolvemos primero lo que está dentro, como abrir una caja sorpresa. (${innerStr}) = ${result}. ¡Lo de adentro siempre tiene prioridad!`;
}

function explainPower(base: number, exp: number, result: number): string {
  const baseStr = fmtNum(base);
  const expStr = fmtNum(exp);
  const resStr = fmtNum(result);

  if (Number.isInteger(exp) && exp >= 0 && exp <= 6) {
    const parts: string[] = [];
    for (let i = 0; i < exp; i++) parts.push(baseStr);
    const expansion = parts.join(' × ');
    const analogies: Record<number, string> = {
      2: '¡Como calcular el área de un cuadrado!',
      3: '¡Como calcular el volumen de un cubo!',
    };
    const analogy = analogies[exp] || `¡Como doblar un papel ${exp} veces!`;
    return `Potencia ${baseStr}^${expStr}: multiplicamos ${baseStr} por sí mismo ${exp} ${exp === 1 ? 'vez' : 'veces'} → ${expansion} = ${resStr}. ${analogy}`;
  }

  return `Potencia ${baseStr}^${expStr}: elevamos ${baseStr} al exponente ${expStr} → el resultado es ${resStr}. Las potencias son multiplicaciones abreviadas.`;
}

function explainMultiplication(a: number, b: number, result: number): string {
  const aStr = fmtNum(a);
  const bStr = fmtNum(b);
  const resStr = fmtNum(result);

  if (Number.isInteger(b) && b >= 1 && b <= 5) {
    const parts: string[] = [];
    for (let i = 0; i < b; i++) parts.push(aStr);
    return `Multiplicación ${aStr} × ${bStr}: sumamos ${aStr} ${b} ${b === 1 ? 'vez' : 'veces'} → ${parts.join(' + ')} = ${resStr}. Es como tener ${b} bolsa${b === 1 ? '' : 's'} con ${aStr} manzanas cada una.`;
  }

  if (Number.isInteger(a) && a >= 1 && a <= 5) {
    const parts: string[] = [];
    for (let i = 0; i < a; i++) parts.push(bStr);
    return `Multiplicación ${aStr} × ${bStr}: sumamos ${bStr} ${a} ${a === 1 ? 'vez' : 'veces'} → ${parts.join(' + ')} = ${resStr}. Es como tener ${a} bolsa${a === 1 ? '' : 's'} con ${bStr} manzanas cada una.`;
  }

  return `Multiplicación ${aStr} × ${bStr}: el resultado es ${resStr}. La multiplicación es una suma repetida: agrupar cantidades iguales.`;
}

function explainDivision(a: number, b: number, result: number): string {
  const aStr = fmtNum(a);
  const bStr = fmtNum(b);
  const resStr = fmtNum(result);

  if (Number.isInteger(a) && Number.isInteger(b) && b >= 2 && b <= 10) {
    return `División ${aStr} ÷ ${bStr}: repartimos ${aStr} entre ${bStr} partes iguales → ${resStr} en cada parte. Como compartir ${aStr} galletas entre ${bStr} amigos.`;
  }

  return `División ${aStr} ÷ ${bStr}: el resultado es ${resStr}. Dividir es repartir en partes iguales, como compartir algo entre amigos.`;
}

function explainAddition(a: number, b: number, result: number): string {
  const aStr = fmtNum(a);
  const bStr = fmtNum(b);
  const resStr = fmtNum(result);

  if (Number.isInteger(a) && Number.isInteger(b) && b > 0 && b <= 10) {
    const forward: string[] = [];
    for (let i = 1; i <= Math.min(b, 8); i++) {
      forward.push(fmtNum(a + i));
    }
    if (b > 8) forward.push('...');
    return `Suma ${aStr} + ${bStr}: juntamos ${aStr} y ${bStr} → contamos hacia adelante desde ${aStr}: ${forward.join(', ')}. ¡Tenemos ${resStr}!`;
  }

  return `Suma ${aStr} + ${bStr}: juntamos ambas cantidades → el resultado es ${resStr}. Sumar es agregar, como cuando juntas tus monedas.`;
}

function explainSubtraction(a: number, b: number, result: number): string {
  const aStr = fmtNum(a);
  const bStr = fmtNum(b);
  const resStr = fmtNum(result);

  if (Number.isInteger(a) && Number.isInteger(b) && b > 0 && b <= 10) {
    const backward: string[] = [];
    for (let i = 1; i <= Math.min(b, 8); i++) {
      backward.push(fmtNum(a - i));
    }
    if (b > 8) backward.push('...');
    return `Resta ${aStr} - ${bStr}: quitamos ${bStr} de ${aStr} → contamos hacia atrás: ${backward.join(', ')}. ¡Quedan ${resStr}!`;
  }

  return `Resta ${aStr} - ${bStr}: quitamos ${bStr} de ${aStr} → el resultado es ${resStr}. Restar es quitar, como cuando gastas parte de tu dinero.`;
}

function explainFunction(funcName: string, arg: number, result: number): string {
  const argStr = fmtNum(arg);
  const resStr = fmtNum(result);

  switch (funcName) {
    case 'sqrt':
      return `√${argStr}: La raíz cuadrada de ${argStr} es ${resStr}, porque ${resStr} × ${resStr} = ${argStr}. Es deshacer un cuadrado perfecto. ¡Como encontrar el lado de un cuadrado sabiendo su área!`;
    case 'sin':
      return `sin(${argStr}°): El seno de ${argStr} grados es ${resStr}. En un triángulo rectángulo, es el cateto opuesto entre la hipotenusa.`;
    case 'cos':
      return `cos(${argStr}°): El coseno de ${argStr} grados es ${resStr}. En un triángulo rectángulo, es el cateto adyacente entre la hipotenusa.`;
    case 'tan':
      return `tan(${argStr}°): La tangente de ${argStr} grados es ${resStr}. En un triángulo rectángulo, es el cateto opuesto entre el cateto adyacente.`;
    case 'log':
      return `log(${argStr}): El logaritmo base 10 de ${argStr} es ${resStr}, porque 10^${resStr} = ${argStr}. Es el exponente al que hay que elevar 10 para obtener ${argStr}.`;
    case 'ln':
      return `ln(${argStr}): El logaritmo natural de ${argStr} es ${resStr}, porque e^${resStr} = ${argStr}. Es el exponente al que hay que elevar e para obtener ${argStr}.`;
    default:
      return `${funcName}(${argStr}) = ${resStr}. Una función transforma un valor de entrada en un valor de salida según sus reglas.`;
  }
}

// ============================================================================
// STRUCTURAL / HIERARCHY EXPLANATION HELPERS
// ============================================================================

function countTokenTypes(tokens: Token[]): Record<string, number> {
  const counts: Record<string, number> = {};
  for (const t of tokens) {
    const key = t.type === 'lparen' || t.type === 'rparen' ? 'parentesis' : t.type;
    counts[key] = (counts[key] || 0) + 1;
  }
  return counts;
}

function buildStructuralExplanation(counts: Record<string, number>, tokens: Token[]): string {
  const numbers: string[] = [];
  const operators: string[] = [];
  const functions: string[] = [];
  const constants: string[] = [];
  let parenCount = 0;

  for (const t of tokens) {
    if (t.type === 'number') numbers.push(t.value);
    else if (t.type === 'operator') operators.push(t.value);
    else if (t.type === 'function') functions.push(t.value);
    else if (t.type === 'constant') constants.push(t.value);
    else if (t.type === 'lparen') parenCount++;
  }

  const parts: string[] = [];
  if (numbers.length) parts.push(`${numbers.length} número(s) (${numbers.join(', ')})`);
  if (operators.length) parts.push(`${operators.length} operador(es) (${operators.join(', ')})`);
  if (functions.length) parts.push(`${functions.length} función(es) (${functions.join(', ')})`);
  if (constants.length) parts.push(`${constants.length} constante(s) (${constants.join(', ')})`);
  if (parenCount > 0) parts.push(`${parenCount} paréntesis`);

  const list = parts.join(', ') || 'Sin elementos';
  return `Encontramos ${list}. Cada número es un dato clave del problema y cada operador define cómo se relacionan entre sí. Como en un mapa del tesoro: los números son los destinos y los operadores te indican el camino para llegar de uno a otro.`;
}

function buildStructuralBreakdown(tokens: Token[]): string {
  const numCount = tokens.filter(t => t.type === 'number').length;
  const opTokens = tokens.filter(t => t.type === 'operator').map(t => t.value);
  const funcCount = tokens.filter(t => t.type === 'function').length;
  const constCount = tokens.filter(t => t.type === 'constant').length;
  const parenCount = tokens.filter(t => t.type === 'lparen').length;

  const parts: string[] = [];
  if (numCount > 0) parts.push(`${numCount} números`);
  if (opTokens.length > 0) parts.push(`${opTokens.length} operadores (${opTokens.join(', ')})`);
  if (funcCount > 0) parts.push(`${funcCount} funciones`);
  if (constCount > 0) parts.push(`${constCount} constantes`);
  if (parenCount > 0) parts.push(`${parenCount} paréntesis`);

  return parts.join(', ');
}

function buildPemdasAnnotation(tokens: Token[]): string {
  const str = tokensToString(tokens);

  const parenIdx = tokens.findIndex(t => t.type === 'lparen');
  if (parenIdx !== -1) {
    const parenEnd = findMatchingRightParen(tokens, parenIdx);
    if (parenEnd !== -1) {
      const before = tokens.slice(0, parenIdx);
      const inner = tokens.slice(parenIdx, parenEnd + 1);
      const after = tokens.slice(parenEnd + 1);
      return `${tokensToString(before)}[${tokensToString(inner)}] → paréntesis primero${tokensToString(after)}`;
    }
  }

  const funcIdx = tokens.findIndex(t => t.type === 'function');
  if (funcIdx !== -1) {
    const funcEnd = findMatchingRightParen(tokens, funcIdx + 1);
    if (funcEnd !== -1) {
      const before = tokens.slice(0, funcIdx);
      const funcExpr = tokens.slice(funcIdx, funcEnd + 1);
      const after = tokens.slice(funcEnd + 1);
      return `${tokensToString(before)}[${tokensToString(funcExpr)}] → función primero${tokensToString(after)}`;
    }
  }

  const powIdx = findRightmostPower(tokens);
  if (powIdx !== -1) {
    const before = tokens.slice(0, powIdx - 1);
    const powExpr = tokens.slice(powIdx - 1, powIdx + 2);
    const after = tokens.slice(powIdx + 2);
    return `${tokensToString(before)}[${tokensToString(powExpr)}] → potencia${after ? ' (' + tokensToString(after).trim() + ' después)' : ''}`;
  }

  const mdIdx = findLeftmostMulDiv(tokens);
  if (mdIdx !== -1) {
    const before = tokens.slice(0, mdIdx - 1);
    const mdExpr = tokens.slice(mdIdx - 1, mdIdx + 2);
    const after = tokens.slice(mdIdx + 2);
    const opName = tokens[mdIdx].value === '*' ? 'multiplicación' : 'división';
    return `${tokensToString(before)}[${tokensToString(mdExpr)}] → ${opName} primero${after ? ' (' + tokensToString(after).trim() + ' después)' : ''}`;
  }

  const asIdx = findLeftmostAddSub(tokens);
  if (asIdx !== -1) {
    const opName = tokens[asIdx].value === '+' ? 'suma' : 'resta';
    return `${str} → resolver ${opName}`;
  }

  return str;
}

function buildPemdasOrder(tokens: Token[]): string {
  const order: string[] = [];
  const ordinals = ['1º', '2º', '3º', '4º', '5º'];

  if (tokens.some(t => t.type === 'lparen')) order.push(`${ordinals[order.length]} ( )`);
  if (tokens.some(t => t.type === 'function')) order.push(`${ordinals[order.length]} func()`);
  if (tokens.some(t => t.type === 'operator' && t.value === '^')) order.push(`${ordinals[order.length]} ^`);
  if (tokens.some(t => t.type === 'operator' && (t.value === '*' || t.value === '/')))
    order.push(`${ordinals[order.length]} ×/÷`);
  if (tokens.some(t => t.type === 'operator' && (t.value === '+' || t.value === '-')))
    order.push(`${ordinals[order.length]} +/-`);

  if (order.length === 0) return 'Sin operaciones por resolver';
  return `Orden: ${order.join(', ')}`;
}

// ============================================================================
// CORE EVALUATOR — iterative PEMDAS on token array
// ============================================================================

interface EvalContext {
  stepCounter: { value: number };
  isTopLevel: boolean;
  originalTokens?: Token[];
}

function evaluateStepByStep(
  tokens: Token[],
  ctx: EvalContext
): { steps: AnalysisStep[]; result: number } {
  const current: Token[] = tokens.map(tokenClone);
  const steps: AnalysisStep[] = [];
  const sc = ctx.stepCounter;

  // ---- Top-level structural steps ----
  if (ctx.isTopLevel) {
    const counts = countTokenTypes(current);
    steps.push({
      paso: sc.value++,
      titulo: 'Paso 1: Análisis estructural',
      expresionAntes: tokensToString(current),
      expresionDespues: buildStructuralBreakdown(current),
      explicacion: buildStructuralExplanation(counts, current),
      tipo: 'estructural',
      operacion: 'Ecuación original',
    });

    steps.push({
      paso: sc.value++,
      titulo: 'Paso 2: Jerarquía de operaciones (PEMDAS)',
      expresionAntes: tokensToString(current),
      expresionDespues: buildPemdasAnnotation(current),
      explicacion:
        'Seguimos el orden PEMDAS: 1º Paréntesis, 2º Funciones, 3º Potencias, 4º Multiplicación/División (izquierda a derecha), 5º Suma/Resta (izquierda a derecha). ¡Es como las reglas de un juego donde cada operación tiene su turno!',
      tipo: 'estructural',
      operacion: buildPemdasOrder(current),
    });
  }

  // ---- Single-number short-circuit ----
  if (current.length === 1 && current[0].type === 'number') {
    const val = current[0].numericValue ?? NaN;
    if (!ctx.isTopLevel) return { steps, result: val };
    // Top-level single value: fall through to add conclusion step
  }

  // ---- Empty expression ----
  if (current.length === 0) {
    return { steps, result: NaN };
  }

  // ---- ITERATIVE PEMDAS RESOLUTION ----
  // Safety limit: prevent infinite loops on malformed input
  let safety = 0;
  const MAX_ITERATIONS = 10000;

  while (current.length > 1 && safety++ < MAX_ITERATIONS) {
    // ----- Priority 1: Parenthesized expressions & Function calls -----
    const parenStart = findInnermostLeftParen(current);

    if (parenStart !== -1) {
      const beforeParen = parenStart > 0 ? current[parenStart - 1] : null;
      const parenEnd = findMatchingRightParen(current, parenStart);

      if (parenEnd === -1) {
        // Unmatched parenthesis
        steps.push({
          paso: sc.value++,
          titulo: 'Error: Paréntesis sin cerrar',
          expresionAntes: tokensToString(current),
          expresionDespues: 'Error de sintaxis',
          explicacion:
            'Hay un paréntesis de apertura sin su paréntesis de cierre correspondiente. ¡Cada caja que abrimos debemos cerrarla!',
          tipo: 'conclusion',
        });
        return { steps, result: NaN };
      }

      if (beforeParen && beforeParen.type === 'function') {
        // ---- Function call: func( ... ) ----
        const funcIndex = parenStart - 1;
        const funcToken = current[funcIndex];
        const argTokens = current.slice(parenStart + 1, parenEnd);

        // Recursively evaluate the argument
        if (argTokens.length > 0) {
          const subCtx: EvalContext = {
            stepCounter: sc,
            isTopLevel: false,
          };
          const subResult = evaluateStepByStep(argTokens, subCtx);
          steps.push(...subResult.steps);
          const argValue = subResult.result;

          if (!isFinite(argValue)) {
            steps.push({
              paso: sc.value++,
              titulo: 'Error en el argumento de la función',
              expresionAntes: tokensToString(current),
              expresionDespues: 'Error',
              explicacion: `El argumento de ${funcToken.value}() produjo un resultado no válido. Revisa la expresión dentro de los paréntesis.`,
              tipo: 'conclusion',
            });
            return { steps, result: NaN };
          }

          const funcResult = applyFunction(funcToken.value, argValue);

          const antes = tokensToString(current);
          const opDescription = `${funcToken.value}(${tokensToString(argTokens)})`;

          // Replace func ( arg ) with result number token
          current.splice(funcIndex, parenEnd - funcIndex + 1, {
            type: 'number',
            value: fmtNum(funcResult),
            numericValue: funcResult,
          });

          const despues = tokensToString(current);

          steps.push({
            paso: sc.value++,
            titulo: `Paso F: Evaluando función: ${funcToken.value}()`,
            expresionAntes: antes,
            expresionDespues: despues,
            valorCalculado: funcResult,
            explicacion: explainFunction(funcToken.value, argValue, funcResult),
            tipo: 'resolucion',
            operacion: `${opDescription} = ${fmtNum(funcResult)}`,
            resultadoIntermedio: despues,
          });
          continue;
        } else {
          // Empty function argument
          steps.push({
            paso: sc.value++,
            titulo: 'Error: Función sin argumento',
            expresionAntes: tokensToString(current),
            expresionDespues: 'Error de sintaxis',
            explicacion: `La función ${funcToken.value}() necesita un valor dentro de los paréntesis. ¡Dale algo que transformar!`,
            tipo: 'conclusion',
          });
          return { steps, result: NaN };
        }
      } else {
        // ---- Regular parenthesized sub-expression ----
        const innerTokens = current.slice(parenStart + 1, parenEnd);

        if (innerTokens.length === 0) {
          // Empty parentheses: ()
          steps.push({
            paso: sc.value++,
            titulo: 'Error: Paréntesis vacíos',
            expresionAntes: tokensToString(current),
            expresionDespues: 'Error de sintaxis',
            explicacion:
              'Los paréntesis están vacíos. Necesitan contener una expresión para poder resolverla.',
            tipo: 'conclusion',
          });
          return { steps, result: NaN };
        }

        const subCtx: EvalContext = {
          stepCounter: sc,
          isTopLevel: false,
        };
        const subResult = evaluateStepByStep(innerTokens, subCtx);
        steps.push(...subResult.steps);

        const innerValue = subResult.result;
        const antes = tokensToString(current);
        const innerStr = tokensToString(innerTokens);

        // Replace ( inner ) with result number token
        current.splice(parenStart, parenEnd - parenStart + 1, {
          type: 'number',
          value: fmtNum(innerValue),
          numericValue: innerValue,
        });

        const despues = tokensToString(current);

        steps.push({
          paso: sc.value++,
          titulo: 'Paso P: Resolviendo paréntesis',
          expresionAntes: antes,
          expresionDespues: despues,
          valorCalculado: innerValue,
          explicacion: explainParenthesis(innerStr, innerValue),
          tipo: 'resolucion',
          operacion: `(${innerStr}) = ${fmtNum(innerValue)}`,
          resultadoIntermedio: despues,
        });
        continue;
      }
    }

    // ----- Priority 2: Powers (rightmost, right-associative) -----
    const powIndex = findRightmostPower(current);
    if (powIndex !== -1) {
      const base = current[powIndex - 1].numericValue!;
      const exp = current[powIndex + 1].numericValue!;
      const powResult = roundEval(Math.pow(base, exp));

      if (!isFinite(powResult)) {
        steps.push({
          paso: sc.value++,
          titulo: 'Error: Resultado infinito en potencia',
          expresionAntes: tokensToString(current),
          expresionDespues: 'Infinito',
          explicacion: 'La potencia produjo un resultado demasiado grande o no definido.',
          tipo: 'conclusion',
        });
        return { steps, result: NaN };
      }

      const antes = tokensToString(current);
      const opDescription = `${fmtNum(base)}^${fmtNum(exp)}`;

      current.splice(powIndex - 1, 3, {
        type: 'number',
        value: fmtNum(powResult),
        numericValue: powResult,
      });

      const despues = tokensToString(current);

      steps.push({
        paso: sc.value++,
        titulo: 'Paso E: Calculando potencia',
        expresionAntes: antes,
        expresionDespues: despues,
        valorCalculado: powResult,
        explicacion: explainPower(base, exp, powResult),
        tipo: 'resolucion',
        operacion: `${opDescription} = ${fmtNum(powResult)}`,
        resultadoIntermedio: despues,
      });
      continue;
    }

    // ----- Priority 3: Multiplication & Division (leftmost) -----
    const mdIndex = findLeftmostMulDiv(current);
    if (mdIndex !== -1) {
      const left = current[mdIndex - 1].numericValue!;
      const right = current[mdIndex + 1].numericValue!;
      const op = current[mdIndex].value;

      if (op === '/' && right === 0) {
        steps.push({
          paso: sc.value++,
          titulo: 'Error: División por cero',
          expresionAntes: tokensToString(current),
          expresionDespues: 'Indefinido',
          explicacion:
            'No se puede dividir entre cero. Es como intentar repartir galletas entre cero amigos: ¡no tiene sentido!',
          tipo: 'conclusion',
          operacion: `${fmtNum(left)} ÷ 0`,
        });
        return { steps, result: NaN };
      }

      const result = op === '*' ? roundEval(left * right) : roundEval(left / right);

      if (!isFinite(result)) {
        steps.push({
          paso: sc.value++,
          titulo: 'Error: Resultado no finito',
          expresionAntes: tokensToString(current),
          expresionDespues: 'Infinito',
          explicacion: 'La operación produjo un resultado infinito.',
          tipo: 'conclusion',
        });
        return { steps, result: NaN };
      }

      const antes = tokensToString(current);
      const opSymbol = op === '*' ? '×' : '÷';
      const titulo = op === '*' ? 'Paso MD: Multiplicando' : 'Paso MD: Dividiendo';

      current.splice(mdIndex - 1, 3, {
        type: 'number',
        value: fmtNum(result),
        numericValue: result,
      });

      const despues = tokensToString(current);

      steps.push({
        paso: sc.value++,
        titulo,
        expresionAntes: antes,
        expresionDespues: despues,
        valorCalculado: result,
        explicacion:
          op === '*'
            ? explainMultiplication(left, right, result)
            : explainDivision(left, right, result),
        tipo: 'resolucion',
        operacion: `${fmtNum(left)} ${opSymbol} ${fmtNum(right)} = ${fmtNum(result)}`,
        resultadoIntermedio: despues,
      });
      continue;
    }

    // ----- Priority 4: Addition & Subtraction (leftmost) -----
    const asIndex = findLeftmostAddSub(current);
    if (asIndex !== -1) {
      const left = current[asIndex - 1].numericValue!;
      const right = current[asIndex + 1].numericValue!;
      const op = current[asIndex].value;
      const result = op === '+' ? roundEval(left + right) : roundEval(left - right);

      const antes = tokensToString(current);
      const titulo = op === '+' ? 'Paso AS: Sumando' : 'Paso AS: Restando';

      current.splice(asIndex - 1, 3, {
        type: 'number',
        value: fmtNum(result),
        numericValue: result,
      });

      const despues = tokensToString(current);

      steps.push({
        paso: sc.value++,
        titulo,
        expresionAntes: antes,
        expresionDespues: despues,
        valorCalculado: result,
        explicacion:
          op === '+'
            ? explainAddition(left, right, result)
            : explainSubtraction(left, right, result),
        tipo: 'resolucion',
        operacion: `${fmtNum(left)} ${op === '+' ? '+' : '-'} ${fmtNum(right)} = ${fmtNum(result)}`,
        resultadoIntermedio: despues,
      });
      continue;
    }

    // If no operation matched, the expression is in an unresolvable state.
    break;
  }

  // ---- Safety limit exceeded ----
  if (safety >= MAX_ITERATIONS) {
    steps.push({
      paso: sc.value++,
      titulo: 'Error: Expresión demasiado compleja',
      expresionAntes: tokensToString(tokens),
      expresionDespues: 'Error',
      explicacion: 'La expresión es demasiado compleja para analizar paso a paso.',
      tipo: 'conclusion',
    });
    return { steps, result: NaN };
  }

  // ---- Determine final result ----
  const finalResult =
    current.length === 1 && current[0].type === 'number'
      ? (current[0].numericValue ?? NaN)
      : NaN;

  // ---- Top-level conclusion ----
  if (ctx.isTopLevel) {
    steps.push({
      paso: sc.value++,
      titulo: 'Resultado final',
      expresionAntes: ctx.originalTokens
        ? tokensToString(ctx.originalTokens)
        : tokensToString(tokens),
      expresionDespues: isFinite(finalResult) ? fmtNum(finalResult) : 'Error',
      valorCalculado: isFinite(finalResult) ? finalResult : undefined,
      explicacion: isFinite(finalResult)
        ? `¡El resultado es ${fmtNum(finalResult)}! Cada paso que diste te acerca más a dominar las matemáticas. Recuerda: resolver problemas fortalece tu cerebro como el ejercicio fortalece tus músculos. ¡Sigue así!`
        : 'La expresión no pudo resolverse completamente. Revisa la sintaxis e inténtalo de nuevo.',
      tipo: 'conclusion',
    });
  }

  return { steps, result: finalResult };
}

// ============================================================================
// FUNCTION APPLICATION
// ============================================================================

function applyFunction(name: string, arg: number): number {
  switch (name) {
    case 'sqrt':
      return roundEval(Math.sqrt(arg));
    case 'sin':
      return roundEval(Math.sin((arg * Math.PI) / 180));
    case 'cos':
      return roundEval(Math.cos((arg * Math.PI) / 180));
    case 'tan':
      return roundEval(Math.tan((arg * Math.PI) / 180));
    case 'log':
      return roundEval(Math.log10(arg));
    case 'ln':
      return roundEval(Math.log(arg));
    default:
      return NaN;
  }
}

// ============================================================================
// PUBLIC API
// ============================================================================

export class GhostMathEngine {
  analyze(expression: string): AnalysisStep[] {
    const trimmed = expression.trim();

    if (!trimmed) {
      return [
        {
          paso: 1,
          titulo: 'Expresión vacía',
          expresionAntes: '',
          expresionDespues: '',
          explicacion:
            'No hay expresión para analizar. Ingresa una operación matemática y presiona ANALIZAR para comenzar el análisis paso a paso.',
          tipo: 'conclusion',
        },
      ];
    }

    const rawTokens = tokenize(trimmed);

    if (rawTokens.length === 0) {
      return [
        {
          paso: 1,
          titulo: 'Expresión no reconocida',
          expresionAntes: trimmed,
          expresionDespues: 'Error',
          explicacion:
            'No se reconocieron elementos matemáticos en la expresión. Asegúrate de usar números, operadores (+, -, *, /, ^), funciones (sin, cos, tan, log, ln, sqrt) y paréntesis válidos.',
          tipo: 'conclusion',
        },
      ];
    }

    const normalized = normalizeTokens(rawTokens);

    if (normalized.length === 0) {
      return [
        {
          paso: 1,
          titulo: 'Expresión no válida',
          expresionAntes: trimmed,
          expresionDespues: 'Error',
          explicacion:
            'La expresión no contiene elementos matemáticos válidos después del procesamiento.',
          tipo: 'conclusion',
        },
      ];
    }

    if (normalized.some(t => t.type === 'equals')) {
      return analyzeEquation(normalized);
    }

    const ctx: EvalContext = {
      stepCounter: { value: 1 },
      isTopLevel: true,
      originalTokens: normalized,
    };

    const { steps } = evaluateStepByStep(normalized, ctx);
    return steps;
  }
}

// ============================================================================
// POLYNOMIAL AND EQUATION ENGINE
// ============================================================================

function polyToString(p: number[]): string {
  if (p.length === 0) return '0';
  let terms = [];
  for (let i = p.length - 1; i >= 0; i--) {
    let c = p[i];
    if (Math.abs(c) < 1e-10) continue;
    let term = '';
    if (i === 0) {
      term = String(roundEval(c));
    } else if (i === 1) {
      term = (c === 1 ? '' : c === -1 ? '-' : String(roundEval(c))) + 'x';
    } else {
      term = (c === 1 ? '' : c === -1 ? '-' : String(roundEval(c))) + 'x^' + i;
    }
    terms.push(term);
  }
  if (terms.length === 0) return '0';
  let res = terms[0];
  for (let i = 1; i < terms.length; i++) {
    if (terms[i].startsWith('-')) {
      res += ' - ' + terms[i].substring(1);
    } else {
      res += ' + ' + terms[i];
    }
  }
  return res;
}

function polyAdd(p1: number[], p2: number[], sub: boolean = false): number[] {
  const len = Math.max(p1.length, p2.length);
  const r = new Array(len).fill(0);
  for (let i = 0; i < len; i++) {
    const a = p1[i] || 0;
    const b = p2[i] || 0;
    r[i] = sub ? a - b : a + b;
  }
  while (r.length > 1 && Math.abs(r[r.length - 1]) < 1e-10) r.pop();
  return r;
}

function polyMul(p1: number[], p2: number[]): number[] {
  if (p1.length === 0 || p2.length === 0) return [0];
  const r = new Array(p1.length + p2.length - 1).fill(0);
  for (let i = 0; i < p1.length; i++) {
    for (let j = 0; j < p2.length; j++) {
      r[i + j] += p1[i] * p2[j];
    }
  }
  while (r.length > 1 && Math.abs(r[r.length - 1]) < 1e-10) r.pop();
  return r;
}

function parsePoly(tokens: Token[]): number[] | null {
  let pos = 0;

  function parseExpr(): number[] | null {
    let p1 = parseTerm();
    if (!p1) return null;
    while (pos < tokens.length) {
      const op = tokens[pos].value;
      if (op === '+' || op === '-') {
        pos++;
        const p2 = parseTerm();
        if (!p2) return null;
        p1 = polyAdd(p1, p2, op === '-');
      } else {
        break;
      }
    }
    return p1;
  }

  function parseTerm(): number[] | null {
    let p1 = parseFactor();
    if (!p1) return null;
    while (pos < tokens.length) {
      const op = tokens[pos].value;
      if (op === '*' || op === '/') {
        pos++;
        const p2 = parseFactor();
        if (!p2) return null;
        if (op === '*') {
          p1 = polyMul(p1, p2);
        } else {
          if (p2.length > 1) return null; // Division by variable not supported
          const scalar = p2[0];
          p1 = p1.map(c => c / scalar);
        }
      } else {
        break;
      }
    }
    return p1;
  }

  function parseFactor(): number[] | null {
    if (pos >= tokens.length) return null;
    const t = tokens[pos];
    if (t.type === 'number') {
      pos++;
      return [t.numericValue!];
    }
    if (t.type === 'variable') {
      pos++;
      if (pos < tokens.length && tokens[pos].value === '^') {
        pos++;
        const exp = tokens[pos];
        if (exp && exp.type === 'number' && Number.isInteger(exp.numericValue!) && exp.numericValue! >= 0) {
          pos++;
          const p = new Array(exp.numericValue! + 1).fill(0);
          p[exp.numericValue!] = 1;
          return p;
        }
        return null;
      }
      return [0, 1];
    }
    if (t.type === 'operator' && (t.value === '-' || t.value === '+')) {
      const isNeg = t.value === '-';
      pos++;
      const p = parseFactor();
      if (!p) return null;
      return isNeg ? p.map(c => -c) : p;
    }
    if (t.type === 'lparen') {
      pos++;
      const p = parseExpr();
      if (!p) return null;
      if (pos < tokens.length && tokens[pos].type === 'rparen') {
        pos++;
        if (pos < tokens.length && tokens[pos].value === '^') {
           pos++;
           const exp = tokens[pos];
           if (exp && exp.type === 'number' && Number.isInteger(exp.numericValue!) && exp.numericValue! >= 0) {
              pos++;
              let res = [1];
              for (let i = 0; i < exp.numericValue!; i++) res = polyMul(res, p);
              return res;
           }
           return null;
        }
        return p;
      }
      return null;
    }
    return null;
  }

  const result = parseExpr();
  if (pos < tokens.length) return null; // Unparsed tokens left
  return result;
}

function analyzeEquation(tokens: Token[]): AnalysisStep[] {
  const steps: AnalysisStep[] = [];
  let sc = 1;

  const eqIdx = tokens.findIndex(t => t.type === 'equals');
  const leftTokens = tokens.slice(0, eqIdx);
  const rightTokens = tokens.slice(eqIdx + 1);

  if (leftTokens.length === 0 || rightTokens.length === 0) {
    steps.push({
      paso: sc++,
      titulo: 'Ecuación incompleta',
      expresionAntes: tokensToString(tokens),
      expresionDespues: 'Error',
      explicacion: 'Una ecuación necesita expresiones válidas en ambos lados del signo igual.',
      tipo: 'conclusion'
    });
    return steps;
  }

  const leftPoly = parsePoly(leftTokens);
  const rightPoly = parsePoly(rightTokens);

  if (!leftPoly || !rightPoly) {
    steps.push({
      paso: sc++,
      titulo: 'Error en la ecuación',
      expresionAntes: tokensToString(tokens),
      expresionDespues: 'Sintaxis compleja o inválida',
      explicacion: 'La ecuación contiene elementos no soportados para el análisis paso a paso (por ejemplo, funciones trigonométricas con incógnitas o división por x).',
      tipo: 'conclusion'
    });
    return steps;
  }

  const degL = leftPoly.length - 1;
  const degR = rightPoly.length - 1;
  const degree = Math.max(degL, degR);

  if (degree > 2) {
    steps.push({
      paso: sc++,
      titulo: 'Ecuación de grado superior',
      expresionAntes: tokensToString(tokens),
      expresionDespues: 'Grado ' + degree,
      explicacion: 'GHOST-MATH actualmente soporta análisis paso a paso para ecuaciones de primer y segundo grado.',
      tipo: 'conclusion'
    });
    return steps;
  }

  steps.push({
    paso: sc++,
    titulo: 'Paso 1: Identificación',
    expresionAntes: tokensToString(tokens),
    expresionDespues: `${polyToString(leftPoly)} = ${polyToString(rightPoly)}`,
    explicacion: \`Es una ecuación de grado \${degree}. El objetivo es encontrar el valor de la incógnita 'x' que hace que ambos lados sean iguales.\`,
    tipo: 'estructural',
    operacion: 'Simplificación inicial'
  });

  const fullPoly = polyAdd(leftPoly, rightPoly, true);
  
  if (degree === 1) {
    const b = fullPoly[0] || 0;
    const a = fullPoly[1] || 0;

    steps.push({
      paso: sc++,
      titulo: 'Paso 2: Agrupación de términos',
      expresionAntes: \`\${polyToString(leftPoly)} = \${polyToString(rightPoly)}\`,
      expresionDespues: \`\${polyToString([b, a])} = 0\`,
      explicacion: \`Agrupamos todas las 'x' y los números en un solo lado. Para ello, usamos operaciones inversas en ambos lados. ¡Mantenemos el equilibrio de la balanza!\`,
      tipo: 'resolucion'
    });

    if (Math.abs(a) < 1e-10) {
       if (Math.abs(b) < 1e-10) {
         steps.push({ paso: sc++, titulo: 'Identidad', expresionAntes: \`\${b} = 0\`, expresionDespues: 'Infinitas soluciones', explicacion: 'Ambos lados son siempre iguales sin importar el valor de x. ¡Cualquier número real es solución!', tipo: 'conclusion' });
       } else {
         steps.push({ paso: sc++, titulo: 'Inconsistencia', expresionAntes: \`\${b} = 0\`, expresionDespues: 'Sin solución', explicacion: 'La igualdad es falsa. ¡No existe ningún número x que cumpla esta condición!', tipo: 'conclusion' });
       }
       return steps;
    }

    const xVal = roundEval(-b / a);
    
    steps.push({
      paso: sc++,
      titulo: 'Paso 3: Despejar la incógnita',
      expresionAntes: \`\${polyToString([b, a])} = 0\`,
      expresionDespues: \`x = \${fmtNum(xVal)}\`,
      valorCalculado: xVal,
      explicacion: \`Aislamos la 'x' pasando el \${fmtNum(b)} al otro lado con signo opuesto y dividiendo entre el coeficiente \${fmtNum(a)}.\`,
      tipo: 'conclusion',
      operacion: \`x = \${fmtNum(-b)} / \${fmtNum(a)}\`
    });

  } else if (degree === 2) {
    const c = fullPoly[0] || 0;
    const b = fullPoly[1] || 0;
    const a = fullPoly[2] || 0;

    steps.push({
      paso: sc++,
      titulo: 'Paso 2: Forma general (ax² + bx + c = 0)',
      expresionAntes: \`\${polyToString(leftPoly)} = \${polyToString(rightPoly)}\`,
      expresionDespues: \`\${polyToString([c, b, a])} = 0\`,
      explicacion: \`Agrupamos todos los términos a la izquierda para igualar a cero. Identificamos: a=\${fmtNum(a)}, b=\${fmtNum(b)}, c=\${fmtNum(c)}.\`,
      tipo: 'resolucion'
    });

    const discriminante = roundEval(b * b - 4 * a * c);
    
    steps.push({
      paso: sc++,
      titulo: 'Paso 3: El Discriminante (Δ)',
      expresionAntes: \`Δ = b² - 4ac\`,
      expresionDespues: \`Δ = \${fmtNum(discriminante)}\`,
      explicacion: \`Calculamos el discriminante (\${fmtNum(b)}² - 4·\${fmtNum(a)}·\${fmtNum(c)}). Este valor determina cuántas soluciones tiene nuestra parábola.\`,
      tipo: 'resolucion'
    });

    if (discriminante < -1e-10) {
      steps.push({
        paso: sc++,
        titulo: 'Conclusión: Sin soluciones reales',
        expresionAntes: \`Δ = \${fmtNum(discriminante)} < 0\`,
        expresionDespues: 'Raíces complejas',
        explicacion: \`Como el discriminante es negativo, la parábola nunca cruza el eje X. No hay soluciones dentro de los números reales.\`,
        tipo: 'conclusion'
      });
    } else if (Math.abs(discriminante) < 1e-10) {
      const xVal = roundEval(-b / (2 * a));
      steps.push({
        paso: sc++,
        titulo: 'Conclusión: Solución única',
        expresionAntes: \`x = -b / 2a\`,
        expresionDespues: \`x = \${fmtNum(xVal)}\`,
        valorCalculado: xVal,
        explicacion: \`Como el discriminante es exactamente cero, la parábola solo toca el eje X en un único punto.\`,
        tipo: 'conclusion'
      });
    } else {
      const x1 = roundEval((-b + Math.sqrt(discriminante)) / (2 * a));
      const x2 = roundEval((-b - Math.sqrt(discriminante)) / (2 * a));
      steps.push({
        paso: sc++,
        titulo: 'Conclusión: Dos soluciones',
        expresionAntes: \`x = (-b ± √Δ) / 2a\`,
        expresionDespues: \`x₁ = \${fmtNum(x1)}, x₂ = \${fmtNum(x2)}\`,
        explicacion: \`Como el discriminante es positivo, aplicamos la fórmula general para encontrar los dos puntos exactos donde la parábola cruza el eje X.\`,
        tipo: 'conclusion'
      });
    }
  } else {
    const val = fullPoly[0] || 0;
    if (Math.abs(val) < 1e-10) {
       steps.push({ paso: sc++, titulo: 'Identidad', expresionAntes: \`\${val} = 0\`, expresionDespues: 'Infinitas soluciones', explicacion: 'La igualdad es siempre verdadera.', tipo: 'conclusion' });
    } else {
       steps.push({ paso: sc++, titulo: 'Inconsistencia', expresionAntes: \`\${val} = 0\`, expresionDespues: 'Sin solución', explicacion: 'La igualdad matemática es falsa.', tipo: 'conclusion' });
    }
  }

  return steps;
}

export const ghostMath = new GhostMathEngine();
