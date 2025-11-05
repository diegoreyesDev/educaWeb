// modulo-explicaciones-psicopedagogico.js - VERSIÓN MEJORADA
class ModuloExplicaciones {
  generarAnalisisEstructural(expresion) {
    return {
      titulo: "🔍 Comprendiendo la Estructura Matemática",
      contenido: `
                <div class="analisis-psicopedagogico">
                    <h6>Paso 1: Observar y entender</h6>
                    <p>Vamos a analizar la expresión: <strong>${expresion}</strong></p>
                    ${this.generarDesgloseAccesible(expresion)}
                    
                    <div class="estrategia-aprendizaje mt-3 p-3 bg-light rounded">
                        <strong>💡 Estrategia para comenzar:</strong>
                        <p class="mb-0">Antes de resolver, <em>siempre observa toda la expresión</em>. Identifica qué tipos de operaciones contiene y en qué orden deben resolverse.</p>
                    </div>
                </div>
            `,
    };
  }

  generarDesgloseAccesible(expresion) {
    const componentes = {
      numeros: this.contarNumeros(expresion),
      operadores: this.contarOperadores(expresion),
      parentesis: this.contarParentesis(expresion),
      potencias: this.contarPotencias(expresion),
    };

    return `
            <div class="componentes-accesibles mb-3">
                <p><strong>Elementos que encontramos:</strong></p>
                <div class="row">
                    <div class="col-md-6 mb-2">
                        <div class="d-flex align-items-center p-2 bg-primary bg-opacity-10 rounded">
                            <div class="me-3">🔢</div>
                            <div>
                                <strong>${
                                  componentes.numeros
                                } números</strong><br>
                                <small>Los valores con los que trabajaremos</small>
                            </div>
                        </div>
                    </div>
                    <div class="col-md-6 mb-2">
                        <div class="d-flex align-items-center p-2 bg-success bg-opacity-10 rounded">
                            <div class="me-3">⚡</div>
                            <div>
                                <strong>${
                                  componentes.operadores
                                } operaciones</strong><br>
                                <small>Las acciones que realizaremos</small>
                            </div>
                        </div>
                    </div>
                    ${
                      componentes.parentesis > 0
                        ? `
                    <div class="col-md-6 mb-2">
                        <div class="d-flex align-items-center p-2 bg-warning bg-opacity-10 rounded">
                            <div class="me-3">📦</div>
                            <div>
                                <strong>${componentes.parentesis} paréntesis</strong><br>
                                <small>Grupos que se resuelven primero</small>
                            </div>
                        </div>
                    </div>
                    `
                        : ""
                    }
                    ${
                      componentes.potencias > 0
                        ? `
                    <div class="col-md-6 mb-2">
                        <div class="d-flex align-items-center p-2 bg-info bg-opacity-10 rounded">
                            <div class="me-3">🚀</div>
                            <div>
                                <strong>${componentes.potencias} potencias</strong><br>
                                <small>Multiplicaciones repetidas</small>
                            </div>
                        </div>
                    </div>
                    `
                        : ""
                    }
                </div>
            </div>
        `;
  }

  generarDescomposicionTerminos(terminos, expresionOriginal) {
    return {
      titulo: "📝 Dividir en Partes Más Pequeñas",
      contenido: `
                <div class="descomposicion-accesible">
                    <h6>Paso 2: Fragmentar el problema</h6>
                    <p>Hemos separado la expresión en <strong>${
                      terminos.length
                    } partes más simples</strong>:</p>
                    
                    <div class="terminos-visuales mb-3">
                        ${terminos
                          .map(
                            (termino, index) => `
                            <div class="termino-visual p-3 border-start border-4 border-primary mb-2 bg-white rounded">
                                <div class="d-flex justify-content-between align-items-center">
                                    <div>
                                        <strong class="text-primary">Parte ${
                                          index + 1
                                        }</strong>
                                        <div class="expresion-termino fs-5 mt-1">${termino}</div>
                                    </div>
                                    <div class="text-muted">
                                        <small>Se resolverá por separado</small>
                                    </div>
                                </div>
                            </div>
                        `
                          )
                          .join("")}
                    </div>
                    
                    <div class="explicacion-estrategica mt-3 p-3 bg-success bg-opacity-10 rounded">
                        <strong>🎯 Estrategia psicopedagógica:</strong>
                        <p class="mb-2"><em>"Dividir problemas grandes en partes pequeñas hace que sean más manejables."</em></p>
                        <p class="mb-0">Esta técnica te ayuda a no sentirte abrumado por expresiones complejas.</p>
                    </div>
                </div>
            `,
    };
  }

  generarExplicacionParentesis(contenido, resultado) {
    return `
            <div class="explicacion-parentesis-psico">
                <h6>Resolviendo Grupos Primero</h6>
                <p><strong>¿Por qué empezamos por los paréntesis?</strong></p>
                <p>Los paréntesis nos indican <em>"resuelve esto primero"</em>. Es como cuando tienes una tarea con varios pasos y algunos están entre paréntesis: esos son los más importantes.</p>
                
                <div class="proceso-visual mb-3 p-3 bg-light rounded">
                    <div class="d-flex align-items-center justify-content-around">
                        <div class="text-center">
                            <div class="fs-4">📦</div>
                            <div><strong>Grupo</strong></div>
                            <div class="text-muted">${contenido}</div>
                        </div>
                        <div class="fs-2">→</div>
                        <div class="text-center">
                            <div class="fs-4">✅</div>
                            <div><strong>Resultado</strong></div>
                            <div class="text-success">${resultado}</div>
                        </div>
                    </div>
                </div>
                
                <div class="analogia-psicopedagogica p-3 bg-info bg-opacity-10 rounded">
                    <strong>💭 Piensa así:</strong>
                    <p class="mb-0">"Los paréntesis son como paquetes que debemos desenvolver antes de usar lo que hay dentro."</p>
                </div>
            </div>
        `;
  }

  generarExplicacionPotencia(base, exponente, resultado) {
    const repeticiones = Array(exponente).fill(base).join(" × ");

    return `
            <div class="explicacion-potencia-psico">
                <h6>Entendiendo las Potencias</h6>
                <p><strong>¿Qué significa ${base} elevado a ${exponente}?</strong></p>
                <p>Es una forma abreviada de escribir una multiplicación repetida:</p>
                
                <div class="visualizacion-potencia mb-3 p-3 bg-warning bg-opacity-10 rounded text-center">
                    <div class="fs-4 mb-2">${base}${this.obtenerSuperindice(
      exponente
    )} = ${repeticiones}</div>
                    <div class="text-muted">Multiplicamos ${base} por sí mismo ${exponente} veces</div>
                </div>
                
                <div class="proceso-calculo mb-3 p-3 bg-light rounded">
                    <p class="mb-1"><strong>Cálculo paso a paso:</strong></p>
                    <p class="mb-0">${this.generarPasosPotencia(
                      base,
                      exponente,
                      resultado
                    )}</p>
                </div>
                
                <div class="estrategia-memoria p-3 bg-success bg-opacity-10 rounded">
                    <strong>🧠 Para recordar mejor:</strong>
                    <p class="mb-0">"La potencia es como un atajo: en lugar de escribir la multiplicación muchas veces, usamos un número pequeño arriba que nos dice cuántas veces multiplicar."</p>
                </div>
            </div>
        `;
  }

  generarExplicacionRaiz(contenido, resultado) {
    return `
        <div class="explicacion-raiz-psico">
            <h6>Calculando Raíz Cuadrada</h6>
            <p><strong>¿Qué es una raíz cuadrada?</strong></p>
            <p>La raíz cuadrada encuentra qué número multiplicado por sí mismo da el resultado:</p>
            
            <div class="visualizacion-raiz mb-3 p-3 bg-info bg-opacity-10 rounded text-center">
                <div class="fs-4 mb-2">√${contenido} = ${resultado}</div>
                <div class="text-muted">Porque ${resultado} × ${resultado} = ${contenido}</div>
            </div>
            
            <div class="proceso-calculo mb-3 p-3 bg-light rounded">
                <p class="mb-1"><strong>Pensamiento:</strong></p>
                <p class="mb-0">"Estoy buscando un número que, cuando se multiplica por sí mismo, dé ${contenido}. Ese número es ${resultado}."</p>
            </div>
            
            <div class="estrategia-memoria p-3 bg-success bg-opacity-10 rounded">
                <strong>🧠 Para recordar mejor:</strong>
                <p class="mb-0">"La raíz cuadrada es la operación inversa de elevar al cuadrado. Si ${resultado}² = ${contenido}, entonces √${contenido} = ${resultado}."</p>
            </div>
        </div>
    `;
  }

  generarExplicacionMultiplicacion(izquierda, derecha, resultado, operador) {
    const nombreOperacion = operador === "×" ? "multiplicación" : "división";
    const concepto =
      operador === "×"
        ? `sumar ${izquierda} grupos de ${derecha} elementos`
        : `repartir ${izquierda} elementos en ${derecha} grupos iguales`;

    return `
            <div class="explicacion-multiplicacion-psico">
                <h6>${
                  operador === "×"
                    ? "Multiplicando Grupos"
                    : "Dividiendo en Partes Iguales"
                }</h6>
                <p><strong>Concepto fundamental:</strong> La ${nombreOperacion} significa ${concepto}.</p>
                
                <div class="visualizacion-concreta mb-3 p-3 bg-primary bg-opacity-10 rounded">
                    ${this.generarVisualizacionOperacion(
                      izquierda,
                      derecha,
                      operador
                    )}
                </div>
                
                <div class="proceso-mental p-3 bg-light rounded">
                    <p class="mb-1"><strong>Pensamiento paso a paso:</strong></p>
                    <p class="mb-0">${this.generarPensamientoOperacion(
                      izquierda,
                      derecha,
                      operador,
                      resultado
                    )}</p>
                </div>
                
                <div class="refuerzo-positivo mt-3 p-3 bg-success text-white rounded">
                    <strong>¡Bien hecho! 👏</strong>
                    <p class="mb-0">Has comprendido cómo ${
                      operador === "×"
                        ? "combinar grupos"
                        : "repartir equitativamente"
                    }. Esta habilidad es fundamental en matemáticas y en la vida diaria.</p>
                </div>
            </div>
        `;
  }

  generarExplicacionSuma(izquierda, derecha, resultado, operador) {
    const concepto =
      operador === "+"
        ? `juntar ${izquierda} y ${derecha} para tener más`
        : `quitar ${derecha} de ${izquierda} para tener menos`;

    return `
            <div class="explicacion-suma-psico">
                <h6>${
                  operador === "+"
                    ? "Combinando Cantidades"
                    : "Encontrando la Diferencia"
                }</h6>
                <p><strong>Operación básica:</strong> La ${
                  operador === "+" ? "suma" : "resta"
                } nos permite ${concepto}.</p>
                
                <div class="analogia-concreta mb-3 p-3 bg-warning bg-opacity-10 rounded">
                    <strong>📚 Situación de la vida real:</strong>
                    <p class="mb-0">${this.generarEjemploReal(
                      izquierda,
                      derecha,
                      operador
                    )}</p>
                </div>
                
                <div class="proceso-visual-suma mb-3">
                    <div class="d-flex align-items-center justify-content-around text-center">
                        <div>
                            <div class="fs-2">${izquierda}</div>
                            <small>cantidad inicial</small>
                        </div>
                        <div class="fs-1 ${
                          operador === "+" ? "text-success" : "text-danger"
                        }">
                            ${operador === "+" ? "➕" : "➖"}
                        </div>
                        <div>
                            <div class="fs-2">${derecha}</div>
                            <small>${
                              operador === "+" ? "agregamos" : "quitamos"
                            }</small>
                        </div>
                        <div class="fs-1">🟰</div>
                        <div>
                            <div class="fs-2 text-success">${resultado}</div>
                            <small>resultado final</small>
                        </div>
                    </div>
                </div>
                
                <div class="confianza-matematica p-3 bg-info bg-opacity-10 rounded">
                    <strong>💪 Construyendo confianza:</strong>
                    <p class="mb-0">Cada operación que resuelves correctamente fortalece tu comprensión matemática. ¡Sigue practicando!</p>
                </div>
            </div>
        `;
  }

  generarConclusionPedagogica(expresionOriginal, resultado) {
    return {
      titulo: "🎉 ¡Proceso Completado!",
      contenido: `
                <div class="conclusion-psicopedagogica">
                    <div class="logro-final mb-4 p-4 bg-gradient-success text-white rounded text-center">
                        <h3 class="mb-2">¡Excelente trabajo!</h3>
                        <h2 class="mb-0">${expresionOriginal} = ${resultado}</h2>
                    </div>
                    
                    <div class="resumen-metodologico mb-4 p-3 bg-light rounded">
                        <h6>📊 Resumen de la estrategia aplicada:</h6>
                        <div class="row">
                            <div class="col-md-6">
                                <ul class="mb-0">
                                    <li><strong>Observación</strong> - Analizar la expresión completa</li>
                                    <li><strong>Fragmentación</strong> - Dividir en partes manejables</li>
                                </ul>
                            </div>
                            <div class="col-md-6">
                                <ul class="mb-0">
                                    <li><strong>Resolución ordenada</strong> - Seguir el orden correcto</li>
                                    <li><strong>Verificación</strong> - Confirmar cada resultado</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                    
                    <div class="desarrollo-habilidades mb-4 p-3 bg-primary bg-opacity-10 rounded">
                        <h6>🧩 Habilidades que has desarrollado:</h6>
                        <div class="d-flex flex-wrap gap-2">
                            <span class="badge bg-success">Pensamiento lógico</span>
                            <span class="badge bg-info">Resolución de problemas</span>
                            <span class="badge bg-warning">Organización mental</span>
                            <span class="badge bg-primary">Paciencia y perseverancia</span>
                        </div>
                    </div>
                    
                    <div class="mensaje-motivacional p-3 bg-warning bg-opacity-20 rounded">
                        <h6>🌟 Mensaje de tu asistente matemático:</h6>
                        <p class="mb-2"><em>"Las matemáticas no son sobre ser rápido, sino sobre entender profundamente. Cada problema que resuelves construye tu confianza y capacidad para enfrentar desafíos más complejos."</em></p>
                        <p class="mb-0"><strong>Siguiente paso:</strong> Intenta con una expresión un poco más compleja. ¡Tú puedes!</p>
                    </div>

                    <div class="mt-4 text-center">
                        <button class="btn btn-success btn-lg" onclick="window.analizador.reiniciarAnalisis()">
                            🧮 Probar Otra Expresión
                        </button>
                    </div>
                </div>
            `,
    };
  }

  // Métodos auxiliares mejorados
  generarVisualizacionOperacion(izquierda, derecha, operador) {
    if (operador === "×") {
      return `Imagina ${izquierda} filas con ${derecha} puntos cada una. En total tendrías ${
        izquierda * derecha
      } puntos.`;
    } else {
      return `Imagina ${izquierda} caramelos repartidos entre ${derecha} amigos. Cada uno recibiría ${
        izquierda / derecha
      } caramelos.`;
    }
  }

  generarPensamientoOperacion(izquierda, derecha, operador, resultado) {
    if (operador === "×") {
      return `Pensé: "Si tengo ${izquierda} grupos de ${derecha}, eso es lo mismo que sumar ${derecha} + ${derecha} ${
        izquierda > 2 ? `+ ... + ${derecha}` : ""
      } (${izquierda} veces), lo que da ${resultado}."`;
    } else {
      return `Pensé: "Si reparto ${izquierda} entre ${derecha} partes iguales, cada parte debe ser ${resultado}, porque ${derecha} × ${resultado} = ${izquierda}."`;
    }
  }

  generarEjemploReal(izquierda, derecha, operador) {
    if (operador === "+") {
      return `Si tienes ${izquierda} manzanas y compras ${derecha} más, ahora tienes ${
        izquierda + derecha
      } manzanas.`;
    } else {
      return `Si tienes ${izquierda} galletas y comes ${derecha}, te quedan ${
        izquierda - derecha
      } galletas.`;
    }
  }

  generarPasosPotencia(base, exponente, resultado) {
    let pasos = [];
    let acumulado = 1;

    for (let i = 1; i <= exponente; i++) {
      acumulado *= base;
      pasos.push(`${i}º: ${Array(i).fill(base).join(" × ")} = ${acumulado}`);
    }

    return pasos.join("<br>");
  }

  obtenerSuperindice(numero) {
    const superindices = ["⁰", "¹", "²", "³", "⁴", "⁵", "⁶", "⁷", "⁸", "⁹"];
    return numero
      .toString()
      .split("")
      .map((d) => superindices[parseInt(d)])
      .join("");
  }

  contarNumeros(expresion) {
    const numeros = expresion.match(/\d+/g);
    return numeros ? numeros.length : 0;
  }

  contarOperadores(expresion) {
    const operadores = expresion.match(/[+\-×÷]/g);
    return operadores ? operadores.length : 0;
  }

  contarParentesis(expresion) {
    const parentesis = expresion.match(/[()]/g);
    return parentesis ? parentesis.length : 0;
  }

  contarPotencias(expresion) {
    const potencias = expresion.match(/[²³^]/g);
    return potencias ? potencias.length : 0;
  }
}
