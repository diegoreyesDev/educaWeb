<script lang="ts">
  interface Props {
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void;
  }

  let { currentPage, totalPages, onPageChange }: Props = $props();
</script>

{#if totalPages > 1}
  <nav class="mt-8 flex items-center justify-center gap-1" aria-label="Paginación">
    <button
      class="rounded-lg px-3 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-40"
      disabled={currentPage === 1}
      onclick={() => onPageChange(currentPage - 1)}
      aria-label="Página anterior"
    >
      <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
        <path fill-rule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clip-rule="evenodd" />
      </svg>
    </button>

    {#each Array.from({ length: totalPages }, (_, i) => i + 1) as page}
      {#if page === 1 || page === totalPages || (page >= currentPage - 1 && page <= currentPage + 1)}
        <button
          class="min-w-[2.5rem] rounded-lg px-3 py-2 text-sm font-medium transition-colors {page === currentPage ? 'bg-primary-600 text-white shadow-sm' : 'text-gray-700 hover:bg-gray-100'}"
          onclick={() => onPageChange(page)}
          aria-label={`Página ${page}`}
          aria-current={page === currentPage ? 'page' : undefined}
        >
          {page}
        </button>
      {:else if page === currentPage - 2 || page === currentPage + 2}
        <span class="px-1 text-gray-400">...</span>
      {/if}
    {/each}

    <button
      class="rounded-lg px-3 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-40"
      disabled={currentPage === totalPages}
      onclick={() => onPageChange(currentPage + 1)}
      aria-label="Página siguiente"
    >
      <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
        <path fill-rule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clip-rule="evenodd" />
      </svg>
    </button>
  </nav>
{/if}
