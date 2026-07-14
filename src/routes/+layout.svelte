<script lang="ts">
  import '../app.css';
  import Header from '$lib/components/Header.svelte';
  import Footer from '$lib/components/Footer.svelte';
  import { page } from '$app/stores';

  let { children } = $props();
</script>

<svelte:head>
  <title>{$page.data.title ?? 'Click y Aprende — Psicopedagogía'}</title>
  <meta name="description" content="{$page.data.description ?? 'Plataforma educativa interactiva de Psicopedagogía'}" />
</svelte:head>

<div class="flex min-h-screen flex-col">
  <Header />
  <main class="flex-1">
    {@render children()}
  </main>
  <Footer />
</div>
