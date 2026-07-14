<script lang="ts">
  import { base } from '$app/paths';
  import activities from '$lib/data/activities';
  import { NIVELES, ASIGNATURAS } from '$lib/types';

  const nivelesCount = NIVELES.length;
  const asignaturasCount = ASIGNATURAS.length;
  const totalActividades = activities.length;

  const stats = [
    { label: 'Actividades', value: totalActividades },
    { label: 'Niveles', value: nivelesCount },
    { label: 'Asignaturas', value: asignaturasCount },
  ];
</script>

<svelte:head>
  <title>Click y Aprende con la Psicopedagogía</title>
  <meta name="description" content="Plataforma educativa interactiva con actividades para apoyar el aprendizaje desde la psicopedagogía." />
</svelte:head>

<!-- HERO con imagen original del proyecto (hero-psp.jpeg) -->
<section class="relative flex min-h-[85vh] items-center justify-center overflow-hidden px-4 py-24">
  <!-- Imagen de fondo: preservada del proyecto original -->
  <img
    src="{base}/img/img-grupo/hero-psp.jpeg"
    alt="Estudiantes de Psicopedagogía IPCHILE"
    class="absolute inset-0 h-full w-full object-cover object-center"
    loading="eager"
    fetchpriority="high"
  />

  <!-- Overlay gradiente: mismo efecto que el original (rgba con primario) -->
  <div class="absolute inset-0 bg-gradient-to-br from-primary-700/70 via-primary-600/60 to-primary-800/80"></div>

  <!-- Overlay textura sutil para profundidad -->
  <div class="absolute inset-0 bg-grid opacity-10"></div>

  <!-- Contenido del hero -->
  <div class="container-page relative z-10 text-center">
    <h1 class="mb-6 animate-slide-up text-3xl font-extrabold leading-tight text-white drop-shadow-lg sm:text-5xl lg:text-6xl">
      Bienvenidos a Click y Aprende con la Psicopedagogía
    </h1>
    <p class="mx-auto mb-10 max-w-2xl animate-slide-up text-base text-white/90 drop-shadow-md sm:text-lg">
      Un espacio creado por estudiantes de Psicopedagogía para apoyar el aprendizaje con actividades interactivas y recursos didácticos.
    </p>
    <a
      href="{base}/actividades"
      class="btn-primary inline-flex animate-slide-up items-center gap-2 bg-white px-8 py-4 text-primary-700 shadow-xl shadow-primary-900/30 transition-all hover:bg-primary-50 hover:shadow-2xl"
    >
      Explorar Actividades
      <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
        <path fill-rule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clip-rule="evenodd" />
      </svg>
    </a>
  </div>
</section>

<section class="bg-gray-50 py-16 sm:py-20">
  <div class="container-page">
    <h2 class="section-title">Nuestro Enfoque Psicopedagógico</h2>
    <p class="section-subtitle">Principios que guían nuestro trabajo para apoyar el aprendizaje de cada estudiante.</p>

    <div class="grid gap-8 md:grid-cols-3">
      <div class="card group hover:-translate-y-1">
        <div class="mb-4 flex h-14 w-14 items-center justify-center rounded-xl bg-primary-100 text-primary-600 transition-colors group-hover:bg-primary-600 group-hover:text-white">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-7 w-7" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
            <path d="M6 12v5c0 2 2 3 6 3s6-1 6-3v-5" />
          </svg>
        </div>
        <h3 class="mb-2 text-lg font-semibold text-gray-900">Aprendizaje Activo</h3>
        <p class="text-sm leading-relaxed text-gray-600">Fomentamos la participación a través de actividades interactivas que estimulan la comprensión y la curiosidad.</p>
      </div>

      <div class="card group hover:-translate-y-1">
        <div class="mb-4 flex h-14 w-14 items-center justify-center rounded-xl bg-accent-100 text-accent-600 transition-colors group-hover:bg-accent-600 group-hover:text-white">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-7 w-7" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
            <circle cx="9" cy="7" r="4" />
            <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
            <path d="M16 3.13a4 4 0 0 1 0 7.75" />
          </svg>
        </div>
        <h3 class="mb-2 text-lg font-semibold text-gray-900">Inclusión y Diversidad</h3>
        <p class="text-sm leading-relaxed text-gray-600">Diseñamos materiales adaptados a distintos ritmos de aprendizaje, respetando las diferencias individuales.</p>
      </div>

      <div class="card group hover:-translate-y-1">
        <div class="mb-4 flex h-14 w-14 items-center justify-center rounded-xl bg-green-100 text-green-600 transition-colors group-hover:bg-green-600 group-hover:text-white">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-7 w-7" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
            <circle cx="9" cy="7" r="4" />
            <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
            <path d="M16 3.13a4 4 0 0 1 0 7.75" />
          </svg>
        </div>
        <h3 class="mb-2 text-lg font-semibold text-gray-900">Trabajo Colaborativo</h3>
        <p class="text-sm leading-relaxed text-gray-600">Creamos recursos junto a docentes y estudiantes para enriquecer el proceso educativo desde la práctica.</p>
      </div>
    </div>
  </div>
</section>

<section class="bg-primary-900 py-16 sm:py-20">
  <div class="container-page text-center">
    <h2 class="mb-6 text-2xl font-bold text-white sm:text-3xl">¡Explora, aprende y diviértete con nuestras actividades interactivas!</h2>
    <a href="{base}/actividades" class="btn-outline inline-flex items-center gap-2 border-white text-white hover:bg-white hover:text-primary-700 px-8 py-4">
      Ver Actividades
      <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
        <path fill-rule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clip-rule="evenodd" />
      </svg>
    </a>
  </div>
</section>

<section class="bg-white py-16 sm:py-20">
  <div class="container-page">
    <div class="grid gap-8 sm:grid-cols-3">
      {#each stats as stat}
        <div class="rounded-xl border border-gray-100 bg-gray-50 px-6 py-8 text-center shadow-sm">
          <span class="mb-2 block text-4xl font-extrabold text-primary-600">{stat.value}</span>
          <span class="text-sm font-medium uppercase tracking-wide text-gray-500">{stat.label}</span>
        </div>
      {/each}
    </div>
  </div>
</section>
