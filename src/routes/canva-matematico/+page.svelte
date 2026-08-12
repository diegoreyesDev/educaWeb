<script lang="ts">
  import { calculadora } from '$lib/utils/calculator.svelte';
  import { ghostMath, type AnalysisStep } from '$lib/utils/ghost-math';

  let analysisResults: AnalysisStep[] = $state([]);
  let hasAnalyzed = $state(false);
  let isAnalyzing = $state(false);
  let analysisStats = $state({ totalSteps: 0, timeMs: 0, complexity: 'Básico' });



  const buttons = [
    ['□/□', '√□', '<', '(', ')', '⌫', 'AC'],
    ['x²', '|□|', '≤', '7', '8', '9', '÷'],
    ['log_□', '□!', '>', '4', '5', '6', '×'],
    ['i', '%', '≥', '1', '2', '3', '-'],
    ['x', 'y', '=', '0', '.', 'SEND', '+']
  ];

  const allExamples = [
    "5 × 2 + 10",
    "3 + 4 * 2 / 2^2",
    "2x + 4 = 10",
    "3(x - 2) = 9",
    "x^2 - 4 = 0",
    "4x^2 - 5x - 12 = 0",
    "sin(30) + cos(60)",
    "log(100) + ln(e)",
    "sqrt(16) * 2^3",
    "x/2 + 5 = 15"
  ];
  let examples = $state<string[]>([]);

  function shuffleExamples() {
    examples = [...allExamples].sort(() => 0.5 - Math.random()).slice(0, 3);
  }
  // Initialize
  shuffleExamples();

  function btnClass(btn: string): string {
    const base = "h-12 rounded-full flex items-center justify-center text-sm active:scale-95 transition-transform font-medium";
    if (btn === 'SEND') return `${base} bg-[#cbb5ff] hover:bg-[#b89fff] text-black font-bold text-lg`;
    if (btn === 'AC' || btn === '⌫') return `${base} bg-red-900/40 hover:bg-red-800/60 text-red-300 border border-red-800/30`;
    if (/^[0-9.]$/.test(btn)) return `${base} bg-[#3a3a44] hover:bg-[#4a4a55] text-gray-100 text-lg`;
    if (/^[xyabc]$/.test(btn) || ['□/□', '√□', 'x²', '|□|', 'log_□', '□!', 'i', '%', '(', ')'].includes(btn)) 
        return `${base} bg-indigo-900/30 hover:bg-indigo-800/50 text-indigo-300 italic border border-indigo-800/30`;
    return `${base} bg-[#303038] hover:bg-[#3e3e48] text-gray-300`;
  }

  function handleButton(value: string) {
    calculadora.error = null;
    if (value === 'AC') {
      calculadora.clear();
    } else if (value === '⌫') {
      calculadora.backspace();
    } else if (value === 'SEND') {
      iniciarAnalisis();
    } else if (value === '=') {
      if (!calculadora.expression.includes('=')) calculadora.append(' = ');
    } else if (value === 'x²') {
      calculadora.append('^2');
    } else if (value === '√□') {
      calculadora.append('sqrt(');
    } else if (value === '□/□') {
      calculadora.append('/');
    } else {
      calculadora.append(value);
    }
  }

  function handleKeydown(e: KeyboardEvent) {
    const key = e.key;
    if (key >= '0' && key <= '9') handleButton(key);
    if (key === '.') handleButton('.');
    if (key === '+') handleButton('+');
    if (key === '-') handleButton('-');
    if (key === '*') handleButton('×');
    if (key === '/') handleButton('÷');
    if (key === '^') handleButton('^');
    if (key === '(') handleButton('(');
    if (key === ')') handleButton(')');
    if (key === '=' || /^[xyabc]$/i.test(key)) {
      e.preventDefault();
      handleButton(key.toLowerCase());
    }
    if (key === 'Enter') {
      e.preventDefault();
      handleButton('EXE');
    }
    if (key === 'Backspace') handleButton('⌫');
    if (key === 'Escape') handleButton('AC');
  }

  function iniciarAnalisis() {
    if (!calculadora.expression.trim()) return;
    isAnalyzing = true;
    hasAnalyzed = true;
    analysisResults = [];
    const startTime = performance.now();

    try {
      const results = ghostMath.analyze(calculadora.expression);
      analysisResults = results;
      const endTime = performance.now();
      analysisStats = {
        totalSteps: results.length,
        timeMs: Math.round(endTime - startTime),
        complexity: results.length <= 3 ? 'Básico' : results.length <= 7 ? 'Intermedio' : 'Avanzado'
      };
    } catch (err) {
      analysisResults = [{
        paso: 1,
        titulo: 'Error inesperado',
        expresionAntes: calculadora.expression,
        expresionDespues: 'Error',
        explicacion: 'Ocurrió un error al analizar la expresión. Intenta con una expresión más simple.',
        tipo: 'conclusion'
      }];
    } finally {
      isAnalyzing = false;
    }
  }

  function getBadgeColor(tipo: string): string {
    if (tipo === 'estructural') return 'bg-blue-600/20 text-blue-300 border border-blue-500/30';
    if (tipo === 'resolucion') return 'bg-amber-600/20 text-amber-300 border border-amber-500/30';
    return 'bg-emerald-600/20 text-emerald-300 border border-emerald-500/30';
  }

  function getBorderColor(tipo: string): string {
    if (tipo === 'estructural') return 'border-l-blue-500';
    if (tipo === 'resolucion') return 'border-l-amber-500';
    return 'border-l-emerald-500';
  }

  function getStepCircleColor(tipo: string): string {
    if (tipo === 'estructural') return 'bg-blue-600';
    if (tipo === 'resolucion') return 'bg-amber-600';
    return 'bg-emerald-600';
  }

  function getBadgeLabel(tipo: string): string {
    if (tipo === 'estructural') return 'ESTRUCTURA';
    if (tipo === 'resolucion') return 'RESOLUCIÓN';
    return 'CONCLUSIÓN';
  }

  const conclusionStep = $derived(
    analysisResults.filter(s => s.tipo === 'conclusion').at(-1) ?? null
  );

  let resultsContainer: HTMLDivElement | undefined = $state();

  $effect(() => {
    if (analysisResults.length > 0 && resultsContainer) {
      requestAnimationFrame(() => {
        resultsContainer?.scrollTo({ top: resultsContainer.scrollHeight, behavior: 'smooth' });
      });
    }
  });

  function handlePrint() {
    if (analysisResults.length === 0) return;

    const expr = calculadora.expression;
    const finalResult = conclusionStep?.valorCalculado;
    const badges: Record<string, string> = {
      estructural: 'ESTRUCTURA',
      resolucion: 'RESOLUCIÓN',
      conclusion: 'CONCLUSIÓN'
    };

    // Build each step as clean HTML
    const stepsHtml = analysisResults.map((step) => {
      const badgeLabel = badges[step.tipo] ?? step.tipo.toUpperCase();
      const badgeColor = step.tipo === 'conclusion' ? '#059669' : step.tipo === 'resolucion' ? '#d97706' : '#2563eb';
      const borderColor = step.tipo === 'conclusion' ? '#059669' : step.tipo === 'resolucion' ? '#d97706' : '#2563eb';

      let body = '';

      // Expression transformation
      body += `<div style="margin-bottom:8px;padding:8px 12px;background:#f8fafc;border-radius:6px;font-family:monospace;font-size:13px;">`;
      body += `<div style="color:#64748b;margin-bottom:4px;"><strong>Expresión:</strong> ${escapeHtml(step.expresionAntes)}</div>`;
      if (step.operacion) {
        body += `<div style="color:#7c3aed;margin-bottom:4px;"><strong>Operación:</strong> ${escapeHtml(step.operacion)}</div>`;
      }
      body += `<div style="color:#0f172a;font-weight:600;"><strong>Resultante:</strong> ${escapeHtml(step.expresionDespues)}</div>`;
      body += `</div>`;

      // Calculated value highlight
      if (step.valorCalculado !== undefined) {
        body += `<div style="text-align:center;margin-bottom:8px;padding:8px;background:linear-gradient(135deg,#ede9fe,#e0e7ff);border-radius:6px;">`;
        body += `<span style="font-size:22px;font-weight:700;color:#4c1d95;">= ${step.valorCalculado}</span>`;
        body += `</div>`;
      }

      // Explanation
      body += `<div style="padding:8px 12px;background:#f1f5f9;border-left:3px solid #94a3b8;border-radius:0 6px 6px 0;font-style:italic;color:#475569;font-size:13px;">`;
      body += `"${escapeHtml(step.explicacion)}"`;
      body += `</div>`;

      return `
        <div style="break-inside:avoid;margin-bottom:18px;padding:16px;background:#fff;border:1px solid #e2e8f0;border-left:4px solid ${borderColor};border-radius:8px;box-shadow:0 1px 3px rgba(0,0,0,0.06);">
          <div style="display:flex;align-items:center;gap:10px;margin-bottom:12px;">
            <span style="display:inline-flex;align-items:center;justify-content:center;width:28px;height:28px;border-radius:50%;background:#1e293b;color:#fff;font-size:12px;font-weight:700;">${step.paso}</span>
            <span style="display:inline-block;padding:2px 8px;border-radius:20px;background:${badgeColor}15;color:${badgeColor};font-size:10px;font-weight:700;letter-spacing:0.05em;">${badgeLabel}</span>
            <span style="font-size:14px;font-weight:700;color:#1e293b;">${escapeHtml(step.titulo)}</span>
          </div>
          ${body}
        </div>`;
    }).join('');

    const win = window.open('', '_blank', 'width=900,height=700');
    if (!win) return;
    win.document.write(`<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <title>Análisis GHOST-MATH — ${escapeHtml(expr)}</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: 'Segoe UI', system-ui, -apple-system, sans-serif; color: #1e293b; padding: 32px 40px; max-width: 800px; margin: 0 auto; }
    h1 { font-size: 24px; font-weight: 800; margin-bottom: 6px; background: linear-gradient(135deg, #4f46e5, #7c3aed); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
    .expr-box { background: #f1f5f9; padding: 12px 16px; border-radius: 8px; margin-bottom: 6px; }
    .expr-box code { font-size: 18px; font-weight: 600; color: #0f172a; }
    .result { font-size: 28px; font-weight: 800; color: #059669; margin-top: 4px; }
    .subtitle { color: #64748b; font-size: 13px; margin-bottom: 24px; }
    @media print {
      body { padding: 20px; }
      @page { margin: 1.5cm; }
    }
  </style>
</head>
<body>
  <h1>GHOST-MATH — Análisis de Razonamiento</h1>
  <div class="expr-box">
    <div style="font-size:12px;color:#64748b;margin-bottom:4px;">EXPRESIÓN ANALIZADA</div>
    <code>${escapeHtml(expr)}</code>
    ${finalResult !== undefined ? `<div class="result">= ${finalResult}</div>` : ''}
  </div>
  <div class="subtitle">
    ${analysisResults.length} paso${analysisResults.length !== 1 ? 's' : ''} 
    · Método COPISI (Concreto, Pictórico, Simbólico)
    · Motor GHOST-MATH v2.0
  </div>
  ${stepsHtml}
  <div style="text-align:center;margin-top:24px;padding-top:16px;border-top:1px solid #e2e8f0;color:#94a3b8;font-size:11px;">
    Generado por GHOST-MATH · Click y Aprende con la Psicopedagogía · IPCHILE
  </div>
</body>
</html>`);
    win.document.close();
    setTimeout(() => win.print(), 400);
  }

  function escapeHtml(str: string): string {
    return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  }
</script>

<svelte:window onkeydown={handleKeydown} />

<div class="min-h-screen bg-gray-950">

  <div class="relative overflow-hidden border-b border-gray-800">
    <div class="absolute inset-0 opacity-[0.03]" style="background-image: radial-gradient(circle at 25% 50%, #6366f1 0.5px, transparent 0.5px), radial-gradient(circle at 75% 50%, #8b5cf6 0.5px, transparent 0.5px); background-size: 40px 40px, 40px 40px; background-position: 0 0, 20px 20px;">
    </div>
    <div class="container-page relative py-12 sm:py-16">
      <h1 class="text-center text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
        <span class="bg-gradient-to-r from-indigo-400 via-violet-400 to-purple-400 bg-clip-text text-transparent">
          GHOST-MATH
        </span>
      </h1>
      <p class="mt-4 text-center text-base text-gray-400 sm:text-lg">
        Motor de Razonamiento Matemático — Análisis COPISI paso a paso
      </p>
      <div class="mt-6 flex justify-center gap-1 opacity-40">
        {#each Array(3) as _}
          <span class="inline-block h-1.5 w-1.5 animate-pulse rounded-full bg-violet-400" style="animation-delay: {Math.random() * 2}s"></span>
        {/each}
      </div>
    </div>
  </div>

  <div class="container-page py-8">
    <div class="grid gap-6 lg:grid-cols-2">

      <!-- LEFT PANEL: Calculator -->
      <div class="rounded-2xl bg-[#1e1e24] text-gray-200 p-5 sm:p-6 shadow-2xl font-sans border border-gray-800">
        <h2 class="mb-4 flex items-center gap-2 text-xl font-medium text-white">
          Resolución de problemas matemáticos
        </h2>

        <div class="relative flex items-center mb-6">
          <input 
            type="text" 
            bind:value={calculadora.expression}
            oninput={(e) => calculadora.expression = (e.target as HTMLInputElement).value}
            class="w-full bg-[#2a2a32] text-white text-xl p-4 pr-12 rounded-xl outline-none border border-transparent focus:border-gray-500 transition-all font-mono"
            placeholder="Escribe o pega una expresión..."
          />
          <button class="absolute right-4 text-gray-400 hover:text-white" onclick={() => calculadora.clear()}>
            ✕
          </button>
        </div>

        {#if calculadora.error}
          <div class="mb-3 rounded-lg bg-red-950/50 px-3 py-2 text-sm text-red-400 ring-1 ring-red-900/50">
            {calculadora.error}
          </div>
        {/if}



        <!-- Teclado (CSS Grid) -->
        <div class="grid grid-cols-7 gap-2 mb-6">
          {#each buttons as row}
            {#each row as btn}
              {#if btn === 'SEND'}
                <button 
                  onclick={() => handleButton(btn)}
                  disabled={isAnalyzing}
                  class={btnClass(btn)}
                >
                  {#if isAnalyzing}
                    <svg class="h-5 w-5 animate-spin text-black" fill="none" viewBox="0 0 24 24">
                      <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                      <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
                    </svg>
                  {:else}
                    ➤
                  {/if}
                </button>
              {:else}
                <button 
                  onclick={() => handleButton(btn)}
                  class={btnClass(btn)}
                >
                  {btn}
                </button>
              {/if}
            {/each}
          {/each}
        </div>

        <!-- Ejemplos -->
        <div class="mt-4">
          <div class="flex items-center gap-2 mb-3">
            <h3 class="text-gray-400 text-sm m-0">Ejemplos aleatorios</h3>
            <button onclick={shuffleExamples} class="text-gray-500 hover:text-white transition-colors" title="Cargar otros ejemplos">
              <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
            </button>
          </div>
          <div class="flex gap-2 overflow-x-auto pb-2 scrollbar-hide" style="scrollbar-width: none; -ms-overflow-style: none;">
            {#each examples as ex}
              <button 
                onclick={() => { calculadora.clear(); calculadora.append(ex); iniciarAnalisis(); }}
                class="whitespace-nowrap bg-transparent border border-gray-600 hover:bg-gray-800 text-gray-200 px-5 py-2 rounded-full text-sm transition-colors"
              >
                {ex}
              </button>
            {/each}
          </div>
        </div>


      </div>

      <!-- RIGHT PANEL: Analysis -->
      <div class="flex flex-col rounded-2xl border border-gray-800 bg-gray-900/60 p-5 backdrop-blur-sm sm:p-6">
        <h2 class="mb-4 flex items-center gap-2 text-lg font-bold text-gray-200">
          <svg class="h-5 w-5 text-violet-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.455 2.456L21.75 6l-1.036.259a3.375 3.375 0 00-2.455 2.456z" />
          </svg>
          Análisis de Razonamiento
          {#if analysisResults.length > 0}
            <span class="rounded-full bg-violet-900/50 px-2.5 py-0.5 text-xs font-medium text-violet-300">
              {analysisResults.length} paso{analysisResults.length !== 1 ? 's' : ''}
            </span>
          {/if}
        </h2>

        {#if !hasAnalyzed && !isAnalyzing}
          <div class="flex flex-1 items-center justify-center">
            <div class="w-full max-w-md rounded-xl border border-dashed border-gray-700 bg-gray-950/80 p-8 text-center">
              <div class="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-gray-800">
                <svg class="h-7 w-7 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M17.25 6.75L22.5 12l-5.25 5.25m-10.5 0L1.5 12l5.25-5.25m7.5-3l-4.5 16.5" />
                </svg>
              </div>
              <p class="font-mono text-sm text-gray-500">
                <span class="text-violet-400">&gt;</span>
                <span class="ml-1 animate-blink border-r-2 border-violet-400 pr-0.5">Esperando expresión para analizar...</span>
              </p>
              <p class="mt-4 text-xs text-gray-600">
                Ingresa una expresión en la calculadora y presiona ANALIZAR
              </p>
            </div>
          </div>
        {:else if isAnalyzing}
          <div class="flex flex-1 items-center justify-center">
            <div class="text-center">
              <div class="mx-auto mb-4 flex h-16 w-16 items-center justify-center">
                <svg class="h-10 w-10 animate-spin text-violet-400" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
                </svg>
              </div>
              <p class="font-mono text-sm text-violet-400 animate-pulse">Procesando razonamiento...</p>
              <p class="mt-1 text-xs text-gray-500">Aplicando método COPISI</p>
            </div>
          </div>
        {:else if analysisResults.length === 0}
          <div class="flex flex-1 items-center justify-center">
            <p class="text-sm text-gray-500">No se encontraron pasos para analizar.</p>
          </div>
        {:else}
          <div
            bind:this={resultsContainer}
            class="flex-1 space-y-3 overflow-y-auto pr-1"
            style="max-height: 60vh;"
            id="analysis-results"
          >
            <div id="analysis-results-print" class="space-y-3">
              {#each analysisResults as step, idx (step.paso)}
                <div
                  class="animate-slide-up rounded-xl border border-gray-800 bg-gray-950/70 border-l-4 p-4 {getBorderColor(step.tipo)}"
                  style="animation-delay: {idx * 0.08}s; animation-fill-mode: both;"
                >
                  <div class="mb-3 flex items-center gap-2.5">
                    <span class="flex h-7 w-7 items-center justify-center rounded-full text-xs font-bold text-white {getStepCircleColor(step.tipo)}">
                      {step.paso}
                    </span>
                    <span class="rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider {getBadgeColor(step.tipo)}">
                      {getBadgeLabel(step.tipo)}
                    </span>
                    <span class="text-sm font-bold text-gray-200">{step.titulo}</span>
                  </div>

                  <div class="mb-3 space-y-1.5 text-sm">
                    <div class="flex items-start gap-2">
                      <span class="mt-0.5 flex-shrink-0 rounded-md bg-gray-800 px-2 py-0.5 font-mono text-[11px] text-gray-400">ANTERIOR</span>
                      <span class="font-mono text-gray-400">{step.expresionAntes}</span>
                    </div>
                    {#if step.operacion}
                    <div class="flex items-start gap-2">
                      <span class="mt-0.5 flex-shrink-0 rounded-md bg-violet-900/50 px-2 py-0.5 font-mono text-[11px] text-violet-300">OPERACIÓN</span>
                      <span class="font-mono text-sm text-white">{step.operacion}</span>
                    </div>
                    {/if}
                    {#if step.expresionDespues && step.expresionDespues !== step.expresionAntes}
                    <div class="flex items-start gap-2">
                      <span class="mt-0.5 flex-shrink-0 rounded-md bg-emerald-900/50 px-2 py-0.5 font-mono text-[11px] text-emerald-300">RESULTANTE</span>
                      <span class="font-mono font-bold text-emerald-400">{step.expresionDespues}</span>
                    </div>
                    {:else if step.expresionDespues}
                    <div class="flex items-start gap-2">
                      <span class="mt-0.5 flex-shrink-0 rounded-md bg-emerald-900/50 px-2 py-0.5 font-mono text-[11px] text-emerald-300">DETALLE</span>
                      <span class="font-mono text-sm text-emerald-400">{step.expresionDespues}</span>
                    </div>
                    {/if}
                  </div>

                  {#if step.valorCalculado !== undefined}
                    <div class="mb-3 animate-pulse rounded-lg bg-gradient-to-r from-violet-900/30 to-indigo-900/30 px-4 py-2.5 text-center">
                      <span class="text-xs text-violet-300">Valor calculado</span>
                      <p class="text-2xl font-bold text-white">{step.valorCalculado}</p>
                    </div>
                  {/if}

                  <div class="rounded-lg bg-gray-900/80 border-l-2 border-gray-600 px-3 py-2.5">
                    <p class="text-xs leading-relaxed italic text-gray-400">
                      "{step.explicacion}"
                    </p>
                  </div>
                </div>
              {/each}
            </div>

            {#if conclusionStep && conclusionStep.valorCalculado !== undefined}
              <div class="animate-fade-in rounded-2xl bg-gradient-to-br from-indigo-900/80 via-violet-900/80 to-purple-900/80 p-6 text-center ring-1 ring-white/10" style="animation-delay: 0.3s; animation-fill-mode: both;">
                <div class="mb-3 flex justify-center gap-2 text-3xl">
                  <span class="inline-block animate-pulse">🌟</span>
                  <span class="inline-block animate-pulse" style="animation-delay: 0.2s">🧠</span>
                  <span class="inline-block animate-pulse" style="animation-delay: 0.4s">💪</span>
                </div>
                <div class="mb-3 font-mono text-sm text-gray-400">
                  {calculadora.expression}
                </div>
                <div class="mb-1 text-5xl font-bold text-white">
                  {conclusionStep.valorCalculado}
                </div>
                <div class="mb-4 text-sm text-violet-300">
                  = <span class="font-mono">{conclusionStep.valorCalculado}</span>
                </div>
                <p class="mb-4 text-sm italic text-gray-300">
                  "{conclusionStep.explicacion}"
                </p>
                <div class="flex flex-wrap justify-center gap-3 text-xs text-gray-400">
                  <span class="rounded-full bg-white/5 px-3 py-1.5">
                    {analysisStats.totalSteps} pasos
                  </span>
                  <span class="rounded-full bg-white/5 px-3 py-1.5">
                    {analysisStats.timeMs} ms
                  </span>
                  <span class="rounded-full bg-white/5 px-3 py-1.5">
                    Nivel {analysisStats.complexity}
                  </span>
                </div>
              </div>
            {/if}
          </div>

          <div class="mt-4 border-t border-gray-800 pt-4">
            <button
              class="flex w-full items-center justify-center gap-2 rounded-lg border border-gray-700 px-6 py-2.5 text-sm font-medium text-gray-400 transition-all duration-200 hover:border-gray-600 hover:bg-gray-800 hover:text-gray-200 active:scale-[0.98]"
              onclick={handlePrint}
            >
              <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M6.72 13.829c-.24.03-.48.062-.72.096m.72-.096a42.415 42.415 0 0110.56 0m-10.56 0L6.34 18m10.94-4.171c.24.03.48.062.72.096m-.72-.096L17.66 18m0 0l.229 2.523a1.125 1.125 0 01-1.12 1.227H7.231c-.662 0-1.18-.568-1.12-1.227L6.34 18m11.318 0h1.091A2.25 2.25 0 0021 15.75V9.456c0-1.081-.768-2.015-1.837-2.175a48.055 48.055 0 00-1.913-.247M6.34 18H5.25A2.25 2.25 0 013 15.75V9.456c0-1.081.768-2.015 1.837-2.175a48.041 48.041 0 011.913-.247m8 0V6a2.25 2.25 0 00-2.25-2.25h-1.5A2.25 2.25 0 0010.75 6v.294m5.25 0A48.259 48.259 0 0112 6.544a48.259 48.259 0 00-1.25-.05v.294" />
              </svg>
              Imprimir / Compartir
            </button>
          </div>
        {/if}
      </div>
    </div>
  </div>
</div>
