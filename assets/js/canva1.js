document.addEventListener("DOMContentLoaded", () => {
  const boton = document.getElementById("btn-analizar");
  const salida = document.getElementById("explicacion");
  const input = document.getElementById("operacion");

  boton.addEventListener("click", () => {
    const expr = input.value.trim();
    if (!expr) {
      salida.innerHTML =
        "<p class='text-danger'>⚠️ Por favor, ingresa una operación.</p>";
      return;
    }

    try {
      const pasos = resolverPasoAPaso(expr);
      mostrarExplicacion(pasos);
    } catch (err) {
      salida.innerHTML =
        `<p class="text-danger">❌ Error al analizar la expresión: ${err.message}</p>`;
    }
  });

  // Función principal para resolver paso a paso
  function resolverPasoAPaso(expr) {
    const pasos = [];
    let exprActual = expr;

    pasos.push({
      titulo: "1️⃣ Expresión inicial",
      texto: `Has ingresado: \\(${exprActual}\\)`,
    });

    // Reemplazar raíz cuadrada por notación math.js
    exprActual = exprActual.replace(/√/g, "sqrt");

    // Resolver paréntesis primero
    while (exprActual.includes("(")) {
      const res = math.evaluate(exprActual.match(/\([^()]*\)/)[0]);
      const pasoExp = exprActual.match(/\([^()]*\)/)[0];
      pasos.push({
        titulo: "2️⃣ Resolver paréntesis",
        texto: `Resolvemos el paréntesis \\(${pasoExp}\\) = \\(${res}\\)`,
      });
      exprActual = exprActual.replace(/\([^()]*\)/, res);
    }

    // Resolver exponentes
    const expRegex = /(\d+(\.\d+)?(\s*\^\s*\d+(\.\d+)?)?)/;
    while (exprActual.includes("^")) {
      const match = exprActual.match(/(\d+(\.\d+)?)\s*\^\s*(\d+(\.\d+)?)/);
      if (!match) break;
      const base = parseFloat(match[1]);
      const exponente = parseFloat(match[3]);
      const resultado = Math.pow(base, exponente);
      pasos.push({
        titulo: "3️⃣ Resolver exponentes",
        texto: `Calculamos ${base} ^ ${exponente} = ${resultado}`,
      });
      exprActual = exprActual.replace(match[0], resultado);
    }

    // Multiplicaciones y divisiones
    while (exprActual.match(/(\d+(\.\d+)?)(\s*[*\/]\s*)(\d+(\.\d+)?)/)) {
      const match = exprActual.match(/(\d+(\.\d+)?)(\s*[*\/]\s*)(\d+(\.\d+)?)/);
      const a = parseFloat(match[1]);
      const operador = match[3].trim();
      const b = parseFloat(match[4]);
      let resultado;
      if (operador === "*") resultado = a * b;
      else resultado = a / b;
      pasos.push({
        titulo: "4️⃣ Multiplicación o división",
        texto: `Calculamos ${a} ${operador} ${b} = ${resultado}`,
      });
      exprActual = exprActual.replace(match[0], resultado);
    }

    // Sumas y restas
    while (exprActual.match(/-?\d+(\.\d+)?(\s*[+\-]\s*\d+(\.\d+)?)/)) {
      const match = exprActual.match(/(-?\d+(\.\d+)?)(\s*[+\-]\s*)(\d+(\.\d+)?)/);
      const a = parseFloat(match[1]);
      const operador = match[3].trim();
      const b = parseFloat(match[4]);
      let resultado;
      if (operador === "+") resultado = a + b;
      else resultado = a - b;
      pasos.push({
        titulo: "5️⃣ Suma o resta",
        texto: `Calculamos ${a} ${operador} ${b} = ${resultado}`,
      });
      exprActual = exprActual.replace(match[0], resultado);
    }

    pasos.push({
      titulo: "✅ Resultado final",
      texto: `El resultado final es: \\(${parseFloat(exprActual)}\\)`,
    });

    pasos.push({
      titulo: "🧠 Reflexión psicopedagógica",
      texto:
        "Recuerda el orden de operaciones: primero paréntesis, luego exponentes/raíces, después multiplicación/división, y finalmente suma/resta. Comprender cada paso ayuda a consolidar el aprendizaje.",
    });

    return pasos;
  }

  // Función para mostrar los pasos en HTML
  function mostrarExplicacion(pasos) {
    salida.innerHTML = "";
    pasos.forEach((p) => {
      const div = document.createElement("div");
      div.classList.add("mb-4");
      div.innerHTML = `
        <h5 class="text-primary fw-bold">${p.titulo}</h5>
        <p class="text-muted">${p.texto}</p>
      `;
      salida.appendChild(div);
    });

    // Renderiza fórmulas con MathJax
    MathJax.typesetPromise();
  }
});
