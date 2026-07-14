<script lang="ts">
  import activities from '$lib/data/activities';
  import { type Activity } from '$lib/types';
  import FilterBar from '$lib/components/FilterBar.svelte';
  import Pagination from '$lib/components/Pagination.svelte';
  import ActivityCard from '$lib/components/ActivityCard.svelte';
  import ActivityModal from '$lib/components/ActivityModal.svelte';

  let selectedNivel = $state('todos');
  let selectedAsignatura = $state('todos');
  let currentPage = $state(1);
  let selectedActivity = $state<Activity | null>(null);

  const ITEMS_PER_PAGE = 12;

  const filteredActivities = $derived(
    activities.filter((a) => {
      if (selectedNivel !== 'todos' && a.nivel !== selectedNivel) return false;
      if (selectedAsignatura !== 'todos' && a.asignatura !== selectedAsignatura) return false;
      return true;
    })
  );

  const totalPages = $derived(Math.max(1, Math.ceil(filteredActivities.length / ITEMS_PER_PAGE)));

  const paginatedActivities = $derived(
    filteredActivities.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE)
  );

  function handleNivelChange(value: string) {
    selectedNivel = value;
    currentPage = 1;
  }

  function handleAsignaturaChange(value: string) {
    selectedAsignatura = value;
    currentPage = 1;
  }

  function handlePageChange(page: number) {
    currentPage = page;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function handleActivityClick(activity: Activity) {
    selectedActivity = activity;
  }

  function handleCloseModal() {
    selectedActivity = null;
  }

  function handleResetFilters() {
    selectedNivel = 'todos';
    selectedAsignatura = 'todos';
    currentPage = 1;
  }

  $effect(() => {
    if (currentPage > totalPages) {
      currentPage = totalPages;
    }
  });
</script>

<svelte:head>
  <title>Actividades Interactivas | Click y Aprende</title>
  <meta name="description" content="Catálogo de actividades interactivas de psicopedagogía organizadas por nivel y asignatura." />
</svelte:head>

<div class="min-h-screen bg-gray-50">
  <section class="border-b border-gray-200 bg-white">
    <div class="container-page py-8 sm:py-12">
      <h1 class="text-3xl font-extrabold text-gray-900 sm:text-4xl">Actividades Interactivas</h1>
      <p class="mt-2 text-gray-600">Encuentra actividades según nivel escolar y asignatura.</p>
    </div>
  </section>

  <section class="sticky top-0 z-30 border-b border-gray-200 bg-white/95 backdrop-blur-sm">
    <div class="container-page py-4">
      <FilterBar
        selectedNivel={selectedNivel}
        selectedAsignatura={selectedAsignatura}
        onNivelChange={handleNivelChange}
        onAsignaturaChange={handleAsignaturaChange}
        totalFiltered={filteredActivities.length}
      />
    </div>
  </section>

  <section class="container-page py-8">
    {#if filteredActivities.length === 0}
      <div class="flex flex-col items-center justify-center py-20 text-center">
        <svg xmlns="http://www.w3.org/2000/svg" class="mb-4 h-16 w-16 text-gray-300" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
          <circle cx="11" cy="11" r="8" />
          <path d="M21 21l-4.3-4.3" />
        </svg>
        <h2 class="mb-2 text-xl font-semibold text-gray-700">No se encontraron actividades</h2>
        <p class="mb-6 text-gray-500">No se encontraron actividades con esos filtros.</p>
        <button class="btn-primary" onclick={handleResetFilters} type="button">
          Restablecer filtros
        </button>
      </div>
    {:else}
      <div class="mb-4 text-sm text-gray-500">
        Mostrando {paginatedActivities.length} de {filteredActivities.length} actividad{filteredActivities.length !== 1 ? 'es' : ''}
      </div>

      <div class="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {#each paginatedActivities as activity (activity.id)}
          <ActivityCard activity={activity} onclick={() => handleActivityClick(activity)} />
        {/each}
      </div>

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={handlePageChange}
      />
    {/if}
  </section>
</div>

<ActivityModal activity={selectedActivity} onclose={handleCloseModal} />
