<script lang="ts">
  import { NIVELES, ASIGNATURAS, type Nivel, type Asignatura } from '$lib/types';

  interface Props {
    selectedNivel: string;
    selectedAsignatura: string;
    onNivelChange: (value: string) => void;
    onAsignaturaChange: (value: string) => void;
    totalFiltered: number;
  }

  let { selectedNivel, selectedAsignatura, onNivelChange, onAsignaturaChange, totalFiltered }: Props = $props();
</script>

<div class="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
  <div class="flex flex-wrap items-end gap-4">
    <div class="flex-1 min-w-[180px]">
      <label for="nivel-filter" class="mb-1 block text-sm font-medium text-gray-700">Nivel</label>
      <select
        id="nivel-filter"
        value={selectedNivel}
        onchange={(e) => onNivelChange((e.target as HTMLSelectElement).value)}
        class="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-700 shadow-sm transition-colors focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20"
      >
        <option value="todos">Todos los niveles</option>
        {#each NIVELES as nivel}
          <option value={nivel.id}>{nivel.label}</option>
        {/each}
      </select>
    </div>

    <div class="flex-1 min-w-[180px]">
      <label for="asignatura-filter" class="mb-1 block text-sm font-medium text-gray-700">Asignatura</label>
      <select
        id="asignatura-filter"
        value={selectedAsignatura}
        onchange={(e) => onAsignaturaChange((e.target as HTMLSelectElement).value)}
        class="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-700 shadow-sm transition-colors focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20"
      >
        <option value="todos">Todas las asignaturas</option>
        {#each ASIGNATURAS as asignatura}
          <option value={asignatura.id}>{asignatura.label}</option>
        {/each}
      </select>
    </div>

    <div class="flex items-center gap-2 pb-0.5">
      <span class="inline-flex items-center rounded-full bg-primary-50 px-3 py-1.5 text-sm font-medium text-primary-700">
        {totalFiltered} actividad{totalFiltered !== 1 ? 'es' : ''}
      </span>
    </div>
  </div>
</div>
