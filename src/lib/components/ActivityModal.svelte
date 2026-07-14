<script lang="ts">
  import type { Activity } from '$lib/types';

  interface Props {
    activity: Activity | null;
    onclose: () => void;
  }

  let { activity, onclose }: Props = $props();

  function handleKeydown(e: KeyboardEvent) {
    if (e.key === 'Escape') onclose();
  }

  $effect(() => {
    if (activity) {
      document.body.style.overflow = 'hidden';
      document.addEventListener('keydown', handleKeydown);
    }
    return () => {
      document.body.style.overflow = '';
      document.removeEventListener('keydown', handleKeydown);
    };
  });
</script>

{#if activity}
  <!-- svelte-ignore a11y_no_static_element_interactions -->
  <div
    class="fixed inset-0 z-50 flex flex-col bg-black animate-fade-in"
    role="dialog"
    aria-modal="true"
    aria-label={activity.titulo}
  >
    <!-- Barra superior -->
    <div class="flex shrink-0 items-center justify-between bg-gray-900 px-4 py-3">
      <div class="flex min-w-0 items-center gap-3">
        <span class="truncate text-sm font-medium text-white">{activity.titulo}</span>
      </div>
      <button
        class="rounded-lg p-2 text-gray-400 transition-colors hover:bg-white/10 hover:text-white focus:outline-none focus:ring-2 focus:ring-white/50"
        onclick={onclose}
        aria-label="Cerrar actividad"
        type="button"
      >
        <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
          <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </div>

    <!-- Iframe a pantalla completa -->
    <iframe
      src={activity.embedUrl}
      title={activity.titulo}
      class="flex-1 border-0"
      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; fullscreen"
      allowfullscreen
      sandbox="allow-scripts allow-same-origin allow-popups allow-forms allow-modals allow-presentation"
    ></iframe>
  </div>
{/if}
