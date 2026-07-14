<script lang="ts">
  import { teamData } from '$lib/data/team';
  import CreditsConsole from '$lib/components/CreditsConsole.svelte';
</script>

<svelte:head>
  <title>Quiénes Somos | Click y Aprende</title>
  <meta name="description" content="Conoce al equipo de estudiantes de Psicopedagogía del IPCHILE detrás de Click y Aprende." />
</svelte:head>

<div class="min-h-screen bg-white">
  <!-- Introducción: texto + imagen IPCHILE -->
  <section class="bg-gray-50">
    <div class="container-page py-12 sm:py-16">
      <div class="flex flex-col items-center gap-8 md:flex-row md:gap-12">
        <!-- Texto -->
        <div class="flex-1">
          <h1 class="mb-4 text-3xl font-extrabold text-primary-700 sm:text-4xl">Quiénes Somos</h1>
          <p class="text-lg leading-relaxed text-gray-600">
            Somos un grupo de estudiantes de <strong class="text-gray-900">Psicopedagogía</strong> de 2° año del Instituto Profesional
            <strong class="text-gray-900">IPCHILE</strong> que busca aportar al aprendizaje significativo a través de herramientas
            digitales interactivas. Creemos en la educación como un espacio de descubrimiento, motivación y
            acompañamiento individual, fomentando el desarrollo integral de cada estudiante, respetando sus ritmos
            y estilos de aprendizaje.
          </p>
        </div>

        <!-- Imagen IPCHILE -->
        <div class="flex-shrink-0">
          <img
            src="/img/republica-1024x573-2.png"
            alt="Instituto Profesional IPCHILE"
            class="w-full max-w-md rounded-xl shadow-lg transition-transform duration-300 hover:scale-[1.03] hover:shadow-xl"
          />
        </div>
      </div>
    </div>
  </section>

  <!-- Misión y Visión -->
  <section class="container-page py-12 sm:py-16">
    <div class="grid gap-6 md:grid-cols-2">
      <div class="rounded-xl border border-gray-100 bg-white p-8 shadow-sm">
        <h2 class="mb-3 text-2xl font-bold text-primary-700">Nuestra Misión</h2>
        <p class="leading-relaxed text-gray-600">
          Fomentar el desarrollo cognitivo, emocional y social mediante
          experiencias de aprendizaje dinámicas y accesibles, integrando la
          tecnología como herramienta inclusiva.
        </p>
      </div>

      <div class="rounded-xl border border-gray-100 bg-white p-8 shadow-sm">
        <h2 class="mb-3 text-2xl font-bold text-primary-700">Nuestra Visión</h2>
        <p class="leading-relaxed text-gray-600">
          Ser un referente en innovación educativa y apoyo psicopedagógico,
          impulsando la motivación por aprender en cada estudiante,
          respetando sus ritmos, intereses y estilos de aprendizaje.
        </p>
      </div>
    </div>
  </section>

  <!-- Nuestro Equipo: foto grupal -->
  <section class="bg-gray-50 py-12 sm:py-16">
    <div class="container-page text-center">
      <h2 class="mb-8 text-3xl font-extrabold text-primary-700">Nuestro Equipo</h2>

      <!-- Foto grupal con overlay al hover -->
      <div class="group relative mx-auto mb-8 max-w-4xl overflow-hidden rounded-xl shadow-lg">
        <img
          src="/img/img-grupo/equipo.jpeg"
          alt="Equipo IPCHILE — Estudiantes de 2° año de Psicopedagogía"
          class="w-full object-cover transition-transform duration-[6s] group-hover:scale-105"
        />

        <!-- Overlay que aparece al hacer hover -->
        <div class="absolute inset-0 flex flex-col items-center justify-center bg-gradient-to-t from-primary-900/80 to-primary-900/20 text-white opacity-0 transition-opacity duration-300 group-hover:opacity-100">
          <h3 class="mb-2 text-2xl font-bold">Click y Aprende</h3>
          <p class="text-sm text-white/80">Proyecto realizado por Estudiantes de 2° año de Psicopedagogía</p>
          <p class="mt-1 text-sm text-white/80">Instituto Profesional IPCHILE — Sede República, Santiago, Chile</p>
        </div>
      </div>

      <p class="mx-auto mb-12 max-w-3xl text-gray-600">
        Este proyecto fue desarrollado de manera colaborativa por estudiantes de segundo año de Psicopedagogía del
        <strong class="text-gray-900">Instituto Profesional de Chile (IPCHILE)</strong>, bajo la guía de la profesora
        <strong class="text-gray-900">Isabel Monsalvez</strong>.
        Cada integrante participó en la creación de actividades interactivas en la plataforma
        <strong class="text-gray-900">Wordwall</strong>.
      </p>
    </div>
  </section>

  <!-- Créditos: Consola hacker -->
  <section class="container-page py-12 sm:py-16">
    <h2 class="mb-2 text-center text-3xl font-extrabold text-primary-700">Créditos</h2>
    <p class="mb-8 text-center text-gray-500">Animación interactiva estilo consola — espera unos segundos a que cargue</p>
    <CreditsConsole teamAreas={teamData} />
  </section>

  <!-- Valores -->
  <section class="bg-gray-50 py-12 sm:py-16">
    <div class="container-page text-center">
      <h2 class="mb-8 text-3xl font-extrabold text-primary-700">Nuestros Valores</h2>
      <div class="grid gap-6 md:grid-cols-3">
        <div class="rounded-xl border border-gray-100 bg-white p-6 shadow-sm">
          <h3 class="mb-2 text-lg font-bold text-green-600">Empatía</h3>
          <p class="text-sm text-gray-600">Comprendemos las necesidades individuales de cada estudiante.</p>
        </div>
        <div class="rounded-xl border border-gray-100 bg-white p-6 shadow-sm">
          <h3 class="mb-2 text-lg font-bold text-amber-500">Motivación</h3>
          <p class="text-sm text-gray-600">Promovemos el aprendizaje desde la curiosidad y el interés personal.</p>
        </div>
        <div class="rounded-xl border border-gray-100 bg-white p-6 shadow-sm">
          <h3 class="mb-2 text-lg font-bold text-sky-500">Colaboración</h3>
          <p class="text-sm text-gray-600">Creemos en el aprendizaje compartido y en el trabajo en equipo.</p>
        </div>
      </div>
    </div>
  </section>
</div>
