export type TokenType = 
  | 'Number' 
  | 'Identifier' 
  | 'Plus' | 'Minus' | 'Asterisk' | 'Slash' | 'Caret' 
  | 'Equals' 
  | 'LParen' | 'RParen' 
  | 'EOF';

export interface Token {
  type: TokenType;
  lexeme: string;
  numericValue?: number;
}

export class Lexer {
  private input: string;
  private position: number = 0;

  constructor(input: string) {
    this.input = input;
  }

  tokenize(): Token[] {
    const tokens: Token[] = [];
    while (this.position < this.input.length) {
      const c = this.input[this.position];

      if (/\s/.test(c)) {
        this.position++;
        continue;
      }

      if (c === '+') { tokens.push(this.advanceToken('Plus', c)); continue; }
      if (c === '-') { tokens.push(this.advanceToken('Minus', c)); continue; }
      if (c === '*') { tokens.push(this.advanceToken('Asterisk', c)); continue; }
      if (c === '/') { tokens.push(this.advanceToken('Slash', c)); continue; }
      if (c === '^') { tokens.push(this.advanceToken('Caret', c)); continue; }
      if (c === '=') { tokens.push(this.advanceToken('Equals', c)); continue; }
      if (c === '(') { tokens.push(this.advanceToken('LParen', c)); continue; }
      if (c === ')') { tokens.push(this.advanceToken('RParen', c)); continue; }

      if (/\d|\./.test(c)) {
        tokens.push(this.readNumber());
        continue;
      }

      if (/[a-zA-Z]/.test(c)) {
        tokens.push(this.readIdentifier());
        continue;
      }

      throw new Error(`Carácter no reconocido: ${c}`);
    }

    tokens.push({ type: 'EOF', lexeme: '' });
    return tokens;
  }

  private advanceToken(type: TokenType, lexeme: string): Token {
    this.position++;
    return { type, lexeme };
  }

  private readNumber(): Token {
    const start = this.position;
    let hasDot = false;

    while (this.position < this.input.length) {
      const c = this.input[this.position];
      if (/\d/.test(c)) {
        this.position++;
      } else if (c === '.' && !hasDot) {
        hasDot = true;
        this.position++;
      } else {
        break;
      }
    }

    const lexeme = this.input.substring(start, this.position);
    return { type: 'Number', lexeme, numericValue: parseFloat(lexeme) };
  }

  private readIdentifier(): Token {
    const start = this.position;
    while (this.position < this.input.length && /[a-zA-Z]/.test(this.input[this.position])) {
      this.position++;
    }
    return { type: 'Identifier', lexeme: this.input.substring(start, this.position) };
  }
}
