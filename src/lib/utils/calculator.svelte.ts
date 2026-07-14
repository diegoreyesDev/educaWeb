export class CalculadoraCientifica {
  expression: string = $state('');
  result: number | null = $state(null);
  error: string | null = $state(null);
  history: string[] = $state([]);

  append(value: string): void {
    this.error = null;
    this.result = null;
    this.expression += value;
  }

  clear(): void {
    this.expression = '';
    this.result = null;
    this.error = null;
  }

  backspace(): void {
    this.error = null;
    this.result = null;
    this.expression = this.expression.slice(0, -1);
  }

  calculate(): void {
    this.error = null;
    if (!this.expression.trim()) {
      this.result = null;
      return;
    }
    try {
      let expr = this.expression
        .replace(/×/g, '*')
        .replace(/÷/g, '/')
        .replace(/\^/g, '**')
        .replace(/π/g, 'Math.PI')
        .replace(/e(?![a-z])/g, 'Math.E')
        .replace(/sin\(/g, 'Math.sin(')
        .replace(/cos\(/g, 'Math.cos(')
        .replace(/tan\(/g, 'Math.tan(')
        .replace(/log\(/g, 'Math.log10(')
        .replace(/ln\(/g, 'Math.log(')
        .replace(/sqrt\(/g, 'Math.sqrt(');

      this.result = new Function(`return ${expr}`)();
      if (typeof this.result !== 'number' || !isFinite(this.result)) {
        this.error = this.result === Infinity || this.result === -Infinity
          ? 'Error: División por cero'
          : 'Error: Resultado no válido';
        this.result = null;
        return;
      }
      this.history = [...this.history, `${this.expression} = ${this.result}`];
    } catch {
      this.error = 'Error: Expresión inválida';
      this.result = null;
    }
  }

  getHistory(): string[] {
    return this.history;
  }
}

export const calculadora = new CalculadoraCientifica();
