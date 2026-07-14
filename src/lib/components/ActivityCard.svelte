<script lang="ts">
  import { ASIGNATURAS, type Activity, type Asignatura } from '$lib/types';

  interface Props {
    activity: Activity;
    onclick: () => void;
  }

  let { activity, onclick }: Props = $props();

  const asignaturaInfo = $derived(ASIGNATURAS.find((a) => a.id === activity.asignatura));
  const asignaturaColor = $derived(asignaturaInfo?.color ?? 'bg-gray-100 text-gray-800');
</script>

<button
  class="group relative flex flex-col overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
  onclick={onclick}
  type="button"
>
  <div class="flex h-40 w-full items-center justify-center overflow-hidden bg-gray-100">
    <img
      src={activity.miniatura}
      alt={activity.titulo}
      class="h-full w-full object-contain p-2 transition-transform duration-300 group-hover:scale-105"
      loading="lazy"
    />
  </div>

  <div class="flex flex-1 flex-col gap-2 p-4 text-left">
    <span class="inline-flex self-start rounded-full px-2.5 py-0.5 text-xs font-medium {asignaturaColor}">
      {asignaturaInfo?.label ?? activity.asignatura}
    </span>

    <h3 class="text-sm font-semibold leading-tight text-gray-900 group-hover:text-primary-700">
      {activity.titulo}
    </h3>

    {#if activity.descripcion.trim()}
      <p class="line-clamp-2 text-xs text-gray-500">{activity.descripcion.trim()}</p>
    {/if}
  </div>
</button>
