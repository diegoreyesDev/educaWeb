<script lang="ts">
  import { onMount } from 'svelte';
  import type { TeamArea } from '$lib/types';
  import { profesora, desarrollador } from '$lib/data/team';

  let { teamAreas }: { teamAreas: TeamArea[] } = $props();

  let lines = $state<string[]>([]);
  let running = $state(false);
  let containerEl: HTMLDivElement | undefined = $state();

  const VELOCIDAD = 15; // ms por carácter (menos = más rápido)
  const DELAY_LINEA = 30;
  const PAUSA_MODULO = 400;

  function sleep(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  function scrollToBottom() {
    if (containerEl) {
      containerEl.scrollTop = containerEl.scrollHeight;
    }
  }

  async function typeLine(text: string) {
    let current = '';
    for (let i = 0; i < text.length; i++) {
      current += text.charAt(i);
      lines = [...lines.slice(0, -1), current];
      scrollToBottom();
      await sleep(VELOCIDAD + Math.random() * 10);
    }
    lines = [...lines, ''];
    scrollToBottom();
    await sleep(DELAY_LINEA);
  }

  async function progressBar(label: string, length = 25) {
    const barLine = `${label} [${' '.repeat(length)}]   0%`;
    lines = [...lines, barLine];
    scrollToBottom();
    let progress = 0;
    while (progress < 100) {
      const inc = 5 + Math.random() * 10;
      progress = Math.min(100, progress + inc);
      const filled = '#'.repeat(Math.floor((progress / 100) * length));
      const empty = '-'.repeat(length - filled);
      const pct = String(Math.floor(progress)).padStart(3);
      lines = [...lines.slice(0, -1), `${label} [${filled}${empty}] ${pct}%`];
      scrollToBottom();
      await sleep(40 + Math.random() * 60);
    }
    await sleep(PAUSA_MODULO);
  }

  async function typeNames(names: string[]) {
    const cols = 2;
    const maxLen = Math.max(...names.map((n) => n.length)) + 4;
    const rows = Math.ceil(names.length / cols);
    for (let r = 0; r < rows; r++) {
      let line = '';
      for (let c = 0; c < cols; c++) {
        const idx = r + c * rows;
        if (idx < names.length) line += names[idx].padEnd(maxLen, ' ');
      }
      await typeLine(line.trimEnd());
    }
  }

  async function runSequence() {
    if (running) return;
    running = true;
    lines = [''];

    await typeLine('╔═══════════════════════════════════════════════╗');
    await typeLine('║              SISTEMA DE CRÉDITOS              ║');
    await typeLine('║                                               ║');
    await typeLine('║                CLICK Y APRENDE                ║');
    await typeLine('║             Con la Psicopedagogía             ║');
    await typeLine('║                                               ║');
    await typeLine('║               Instituto IPCHILE               ║');
    await typeLine('╚═══════════════════════════════════════════════╝');
    await typeLine('');
    await typeLine('');
    await typeLine('╔═══════════════════════════════════════════════╗');
    await typeLine('║ [SYS]> Iniciando secuencia de créditos...     ║');
    await typeLine('╚═══════════════════════════════════════════════╝');
    await typeLine('');
    await typeLine('');
    await sleep(400);
    await typeLine('╔═══════════════════════════════════════════════╗');
    await typeLine('║[SYS]> SUPERVISORA DE PROYECTO:                ║');
    await typeLine('║[SYS]> PROFESORA:                              ║');
    await typeLine('║                                               ║');
    await typeLine(`║   > ${profesora} - Psicopedagoga          ║`);
    await typeLine('╚═══════════════════════════════════════════════╝');
    await typeLine('');
    await sleep(400);
    await typeLine('╔═══════════════════════════════════════════════╗');
    await typeLine('║[SYS]> DISEÑO Y DESARROLLO WEB:                ║');
    await typeLine('║[SYS]> ESTUDIANTE:                             ║');
    await typeLine('║                                               ║');
    await typeLine(`║   > ${desarrollador} - Desarrollador Full Stack    ║`);
    await typeLine('╚═══════════════════════════════════════════════╝');
    await typeLine('');

    for (const area of teamAreas) {
      await typeLine('');
      await typeLine('╔═══════════════════════════════════════════════╗');
      await typeLine(`║[MÓDULO] Cargando actividades: ${area.area}`);
      await typeLine('║                                               ║');
      await progressBar(`║ [LOAD] ${area.area}`);
      await typeLine('║                                               ║');
      await typeLine(`║ [OK] Módulo ${area.area} completado con éxito.`);
      await typeLine('║                                               ║');
      await typeLine('║[SYS]> Agradecemos a las creadoras:            ║');
      await typeLine('║                                               ║');
      const names = area.miembros.map((m) => `> ${m.nombre.toUpperCase()}`);
      await typeNames(names);
      await typeLine('║                                               ║');
      await typeLine('╚═══════════════════════════════════════════════╝');
      await typeLine('');
    }

    await typeLine('');
    await typeLine('╔═══════════════════════════════════════════════╗');
    await typeLine('║ [STATUS] Todas las actividades listas.        ║');
    await typeLine('╚═══════════════════════════════════════════════╝');
    await typeLine('');
    await typeLine('╔═══════════════════════════════════════════════╗');
    await typeLine('║ [SYS]> Agradecimientos finales:               ║');
    await typeLine('║                                               ║');
    await typeLine('║ > Agradecimientos a todas las integrantes     ║');
    await typeLine('║ del equipo por su dedicación y compromiso     ║');
    await typeLine('║ en la creación de este proyecto educativo.    ║');
    await typeLine('║ Su esfuerzo ha sido fundamental para el       ║');
    await typeLine('║ éxito de esta plataforma.                     ║');
    await typeLine('║ ¡Gracias por su valiosa contribución!         ║');
    await typeLine('║                                               ║');
    await typeLine('║ [SYS]> Agradecemos a la Institución:          ║');
    await typeLine('║                                               ║');
    await typeLine('║ [SYS]> Instituto Profesional IPCHILE.         ║');
    await typeLine('╚═══════════════════════════════════════════════╝');
    await typeLine('');
    await typeLine('');
    await typeLine('╔═══════════════════════════════════════════════╗');
    await typeLine('║ [STATUS] Todos los agradecimientos cargados.  ║');
    await typeLine('╚═══════════════════════════════════════════════╝');
    await typeLine('');
    await typeLine('');
    await typeLine('╔═══════════════════════════════════════════════╗');
    await typeLine('║ [SYS] Créditos finalizados.                   ║');
    await typeLine('╚═══════════════════════════════════════════════╝');
    await typeLine('');
    await typeLine('╔═══════════════════════════════════════════════╗');
    await typeLine('║ [SYS] Gracias por visualizar.                 ║');
    await typeLine('╚═══════════════════════════════════════════════╝');
    await typeLine('');
    await typeLine('╔═══════════════════════════════════════════════╗');
    await typeLine('║                 diegoreyesDev                 ║');
    await typeLine('╚═══════════════════════════════════════════════╝');
    await typeLine('  ════════════════════ FIN ════════════════════  ');
    await typeLine('');
    await typeLine('[SYS]> ▋');
  }

  onMount(() => {
    setTimeout(runSequence, 600);
  });
</script>

<div class="credits-console mx-auto w-full max-w-3xl overflow-hidden rounded-lg border border-green-500/30 bg-gray-950 shadow-2xl">
  <div class="flex items-center gap-2 border-b border-green-500/20 px-4 py-3">
    <span class="h-3 w-3 rounded-full bg-red-500"></span>
    <span class="h-3 w-3 rounded-full bg-yellow-500"></span>
    <span class="h-3 w-3 rounded-full bg-green-500"></span>
    <span class="ml-2 font-mono text-xs text-green-500/60">creditos.exe — Click y Aprende</span>
  </div>

  <div
    bind:this={containerEl}
    class="console-content h-[500px] overflow-y-auto p-4 font-mono text-xs leading-relaxed text-green-400 sm:text-sm"
    aria-live="polite"
  >
    {#each lines as line, i}
      <div class="whitespace-pre-wrap">
        {line}
        {#if i === lines.length - 1 && running}
          <span class="inline-block w-2.5 animate-pulse bg-green-500 align-middle">&nbsp;</span>
        {/if}
      </div>
    {/each}
    {#if lines.length === 0}
      <div class="flex items-center gap-2 text-green-500/40">
        <span class="inline-block w-2.5 animate-pulse bg-green-500">&nbsp;</span>
        <span>Inicializando sistema de créditos...</span>
      </div>
    {/if}
  </div>
</div>

<style>
  .credits-console {
    font-family: 'Courier New', 'Liberation Mono', 'DejaVu Sans Mono', monospace;
  }

  .console-content::-webkit-scrollbar {
    width: 6px;
  }
  .console-content::-webkit-scrollbar-track {
    background: rgba(0, 255, 0, 0.05);
  }
  .console-content::-webkit-scrollbar-thumb {
    background: rgba(0, 255, 0, 0.15);
    border-radius: 3px;
  }
</style>
