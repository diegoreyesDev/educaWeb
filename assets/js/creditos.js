/* ================================================================
   CREDITOS CON ESTILO CONSOLA - BOOT BIOS / ATM RESPONSIVE
   ================================================================ */
(function() {
  const container = document.getElementById("creditos-consola");
  if (!container) return;

  const velocidad = 20;
  const delayLinea = 120;
  const pauseModulo = 700;

  const grupos = {
    "CIENCIAS": [
      "> JOCELYN      ALVAREZ",
      "> ADRIANA      DURAN",
      "> VALENTINA    FERNÁNDEZ",
      "> JOSELINA     GARRIDO",
      "> PIA          ORTEGA",
      "> MARTA        RAYO",
      "> CLAUDIA      SEGURA"
    ],
    "HISTORIA": [
      "> KRISHNA      ANDAUR",
      "> LISBETH      CORNEJO",
      "> AMBAR        DIAZ",
      "> THERANA      DUBRE",
      "> PIERANGELA   FIGUEROA",
      "> EMILIA       GONZALEZ",
      "> KIARA        MORALES"
    ],
    "LENGUAJE": [
      "> AYLIN        ALFARO",
      "> JAVIERA      BARRIGA",
      "> CONSTANZA    CASTRO",
      "> CATALINA     MENA",
      "> EVELIN       TIMANA",
      "> ESTEFANY     TOLEDO"
    ],
    "MATEMATICAS": [
      "> FERNANDA     GARCIA",
      "> DANNAE       GOMEZ",
      "> CONSTANZA    LARA",
      "> DENISSE      LARA",
      "> CONSTANTINE  PIZARRO",
      "> DIEGO        REYES"
    ]
  };

  const contentLines = [];
  const cursorSpan = document.createElement("span");
  cursorSpan.classList.add("cursor");
  cursorSpan.textContent = " ";
  container.appendChild(cursorSpan);

  const sleep = (ms) => new Promise(res => setTimeout(res, ms));

  function render() {
    container.textContent = contentLines.join("\n");
    container.appendChild(cursorSpan);
    container.scrollTop = container.scrollHeight;
  }

  async function typeLine(text) {
    contentLines.push("");
    for (let i = 0; i < text.length; i++) {
      contentLines[contentLines.length - 1] += text.charAt(i);
      render();
      await sleep(velocidad + Math.random() * 10);
    }
    await sleep(delayLinea);
  }

  async function progressBar(label, length = 25) {
    contentLines.push(`${label} [${" ".repeat(length)}] 0%`);
    render();
    let progress = 0;
    while (progress < 100) {
      const inc = 5 + Math.random() * 10;
      progress = Math.min(100, progress + inc);
      const filled = "#".repeat(Math.floor((progress / 100) * length));
      const bar = (filled + "-".repeat(length - filled));
      contentLines[contentLines.length - 1] =
        `${label} [${bar}] ${String(Math.floor(progress)).padStart(3)}%`;
      render();
      await sleep(40 + Math.random() * 60);
    }
    await sleep(pauseModulo);
  }

  function calcularColumnas() {
    const w = window.innerWidth;
    if (w < 768) return 1;  // pantalla pequeña
    return 2;               // escritorio
  }

  async function typeNames(names) {
    const cols = calcularColumnas();
    const maxLen = Math.max(...names.map(n => n.length)) + 4;
    const rows = Math.ceil(names.length / cols);
    for (let r = 0; r < rows; r++) {
      let line = "";
      for (let c = 0; c < cols; c++) {
        const idx = r + c * rows;
        if (idx < names.length) line += names[idx].padEnd(maxLen, " ");
      }
      await typeLine(line.trimEnd());
    }
  }

  async function runSequence() {
    await typeLine("╔═══════════════════════════════════════════════╗");
    await typeLine("║              SISTEMA DE CRÉDITOS              ║");
    await typeLine("║                                               ║");
    await typeLine("║                CLICK Y APRENDE                ║");
    await typeLine("║             Con la Psicopedagogía             ║");
    await typeLine("║                                               ║");
    await typeLine("║               Instituto IPCHILE               ║");
    await typeLine("╚═══════════════════════════════════════════════╝");
    await typeLine("");
    await typeLine("");
    await typeLine("╔═══════════════════════════════════════════════╗");
    await typeLine("║ [SYS]> Iniciando secuencia de créditos...     ║");
    await typeLine("╚═══════════════════════════════════════════════╝");
    await typeLine("");
    await typeLine("");
    await sleep(400);
    await typeLine("╔═══════════════════════════════════════════════╗");
    await typeLine("║[SYS]> SUPERVISORA DE PROYECTO:                ║");
    await typeLine("║[SYS]> PROFESORA:                              ║");
    await typeLine("║                                               ║");
    await typeLine("║   > Isabel Monsalvez - Psicopedagoga          ║");
    await typeLine("╚═══════════════════════════════════════════════╝");
    await typeLine("");
    await sleep(400);
    await typeLine("╔═══════════════════════════════════════════════╗");
    await typeLine("║[SYS]> DISEÑO Y DESARROLLO WEB:                ║");
    await typeLine("║[SYS]> ESTUDIANTE:                             ║");
    await typeLine("║                                               ║");
    await typeLine("║   > Diego Reyes - Desarrollador Full Stack    ║");
    await typeLine("╚═══════════════════════════════════════════════╝");
    await typeLine("");

    const order = ["CIENCIAS", "HISTORIA", "LENGUAJE", "MATEMATICAS"];
    for (const key of order) {
        await typeLine("");
      await typeLine("╔═══════════════════════════════════════════════╗");
      await typeLine(`║[MÓDULO] Cargando actividades: ${key}`);
      await typeLine("║                                               ║");
   await progressBar(`║ [LOAD] ${key}`);
      await typeLine("║                                               ║");
      await typeLine(`║ [OK] Módulo ${key} completado con exito.`);
      await typeLine("║                                               ║");
      await typeLine("║[SYS]> Agradecemos a las creadoras:            ║");
      await typeLine("║                                               ║");
      await typeNames(grupos[key]);
      await typeLine("║                                               ║");
      await typeLine("╚═══════════════════════════════════════════════╝");
      await typeLine("");
    }

    await typeLine("");
    await typeLine("╔═══════════════════════════════════════════════╗");
    await typeLine("║ [STATUS] Todos las actividades listas.        ║");
    await typeLine("╚═══════════════════════════════════════════════╝");
    await typeLine("");
    await typeLine("╔═══════════════════════════════════════════════╗");
    await typeLine("║ [SYS]> Agradecimientos finales:               ║");
    await typeLine("║                                               ║");
    await typeLine("║ > Agradecimientos a todas las integrantes     ║");
    await typeLine("║ del equipo por su dedicación y compromiso     ║");
    await typeLine("║ en la creación de este proyecto educativo.    ║");
    await typeLine("║ Su esfuerzo ha sido fundamental para el       ║");
    await typeLine("║ éxito de esta plataforma.                     ║");
    await typeLine("║ ¡Gracias por su valiosa contribución!         ║");
    await typeLine("║                                               ║");
    await typeLine("║ [SYS]> Agradecemos a la Institucion:          ║");
    await typeLine("║                                               ║");
    await typeLine("║ [SYS]> Instituto Profesional IPCHILE.         ║");
    await typeLine("╚═══════════════════════════════════════════════╝");
    await typeLine("");
    await typeLine("");
    await typeLine("╔═══════════════════════════════════════════════╗");
    await typeLine("║ [STATUS] Todos los agradecimientos cargados.  ║");
    await typeLine("╚═══════════════════════════════════════════════╝");
    await typeLine("");
    await typeLine("");
    await typeLine("╔═══════════════════════════════════════════════╗");
    await typeLine("║ [SYS] Créditos finalizados.                   ║");
    await typeLine("╚═══════════════════════════════════════════════╝");
    await typeLine("");
    await typeLine("╔═══════════════════════════════════════════════╗");
    await typeLine("║ [SYS] Gracias por visualizar.                 ║");
    await typeLine("╚═══════════════════════════════════════════════╝");
    await typeLine("");
    await typeLine("╔═══════════════════════════════════════════════╗");
    await typeLine("║                 diegoreyesDev                 ║");
    await typeLine("╚═══════════════════════════════════════════════╝");
    await typeLine("  ════════════════════ FIN ════════════════════  ");
  }

  render();
  setTimeout(runSequence, 600);
})();
