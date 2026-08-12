import type { MathNode } from './types';
import type { Token, TokenType } from './lexer';

export class Parser {
  private tokens: Token[];
  private position: number = 0;

  constructor(tokens: Token[]) {
    this.tokens = tokens;
  }

  parse(): MathNode {
    const expr = this.parseEquation();
    if (this.currentToken().type !== 'EOF') {
      throw new Error(`Tokens extraños al final de la expresión: ${this.currentToken().lexeme}`);
    }
    return expr;
  }

  private currentToken(): Token {
    return this.tokens[this.position];
  }

  private consume() {
    if (this.position < this.tokens.length - 1) {
      this.position++;
    }
  }

  private parseEquation(): MathNode {
    const left = this.parseExpression();

    if (this.currentToken().type === 'Equals') {
      this.consume();
      const right = this.parseEquation();
      return { type: 'Equation', left, right };
    }

    return left;
  }

  private parseExpression(): MathNode {
    let node = this.parseTerm();

    while (true) {
      if (this.currentToken().type === 'Plus') {
        this.consume();
        node = { type: 'Add', left: node, right: this.parseTerm() };
      } else if (this.currentToken().type === 'Minus') {
        this.consume();
        node = { type: 'Subtract', left: node, right: this.parseTerm() };
      } else {
        break;
      }
    }
    return node;
  }

  private parseTerm(): MathNode {
    let node = this.parseFactor();

    while (true) {
      if (this.currentToken().type === 'Asterisk') {
        this.consume();
        node = { type: 'Multiply', left: node, right: this.parseFactor() };
      } else if (this.currentToken().type === 'Slash') {
        this.consume();
        node = { type: 'Divide', left: node, right: this.parseFactor() };
      } else if (this.currentToken().type === 'Identifier' || this.currentToken().type === 'LParen') {
        // Implicit multiplication (e.g. 2x, 2(x+1))
        node = { type: 'Multiply', left: node, right: this.parseFactor() };
      } else {
        break;
      }
    }
    return node;
  }

  private parseFactor(): MathNode {
    let node = this.parseUnary();

    if (this.currentToken().type === 'Caret') {
      this.consume();
      // Right-associative power
      node = { type: 'Power', base: node, exp: this.parseFactor() };
    }
    return node;
  }

  private parseUnary(): MathNode {
    if (this.currentToken().type === 'Minus') {
      this.consume();
      const node = this.parseUnary();
      // Convert -x to 0 - x for structural simplicity
      return { type: 'Subtract', left: { type: 'Number', value: 0 }, right: node };
    }
    return this.parsePrimary();
  }

  private parsePrimary(): MathNode {
    const token = this.currentToken();

    if (token.type === 'Number') {
      this.consume();
      return { type: 'Number', value: token.numericValue! };
    }
    
    if (token.type === 'Identifier') {
      this.consume();
      // Very basic check for functions like sin, cos (just generic check for now)
      if (['sin', 'cos', 'tan', 'sqrt'].includes(token.lexeme)) {
         if (this.currentToken().type === 'LParen') {
           this.consume();
           const arg = this.parseEquation();
           if (this.currentToken().type !== 'RParen') throw new Error("Se esperaba ')'");
           this.consume();
           return { type: 'FunctionCall', name: token.lexeme, args: [arg] };
         }
      }
      return { type: 'Variable', name: token.lexeme };
    }

    if (token.type === 'LParen') {
      this.consume();
      const node = this.parseEquation();
      if (this.currentToken().type !== 'RParen') {
        throw new Error("Se esperaba ')'");
      }
      this.consume();
      return node;
    }

    throw new Error(`Token inesperado en expresión primaria: ${token.lexeme}`);
  }
}
