<script lang="ts">
  import { page } from '$app/stores';

  let mobileOpen = $state(false);

  const navLinks = [
    { href: '/', label: 'Inicio' },
    { href: '/actividades', label: 'Actividades' },
    { href: '/canva-matematico', label: 'GHOST-MATH' },
    { href: '/quienes-somos', label: 'Quiénes Somos' },
    { href: '/contacto', label: 'Contacto' }
  ];

  function toggleMobile() {
    mobileOpen = !mobileOpen;
  }

  function closeMobile() {
    mobileOpen = false;
  }

  $effect(() => {
    if (mobileOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  });
</script>

<header class="sticky top-0 z-50 bg-white shadow-sm">
  <div class="container-page">
    <nav class="flex h-16 items-center justify-between">
      <a href="/" class="flex items-center gap-3" aria-label="Ir al inicio">
        <img
          src="/img/LOGO-VINCULACION1.png"
          alt="Logo Click y Aprende"
          class="h-10 w-auto"
          style="max-width: 150px;"
        />
        <span class="hidden text-lg font-bold text-gray-900 sm:block">Click y Aprende</span>
      </a>

      <ul class="hidden items-center gap-1 md:flex">
        {#each navLinks as link}
          <li>
            <a
              href={link.href}
              class="rounded-lg px-3 py-2 text-sm font-medium transition-colors duration-200"
              class:bg-primary-50={$page.url.pathname === link.href}
              class:text-primary-700={$page.url.pathname === link.href}
              class:text-gray-600={$page.url.pathname !== link.href}
              class:hover:bg-gray-100={$page.url.pathname !== link.href}
              class:hover:text-gray-900={$page.url.pathname !== link.href}
            >
              {link.label}
            </a>
          </li>
        {/each}
      </ul>

      <button
        class="inline-flex items-center justify-center rounded-lg p-2 text-gray-600 hover:bg-gray-100 hover:text-gray-900 md:hidden"
        aria-label={mobileOpen ? 'Cerrar menú' : 'Abrir menú'}
        onclick={toggleMobile}
      >
        {#if mobileOpen}
          <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        {:else}
          <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        {/if}
      </button>
    </nav>
  </div>

  {#if mobileOpen}
    <!-- svelte-ignore a11y_no_static_element_interactions -->
    <!-- svelte-ignore a11y_click_events_have_key_events -->
    <div class="fixed inset-0 top-16 z-40 bg-black/50 md:hidden" role="button" tabindex="0" aria-label="Cerrar menú" onclick={closeMobile} onkeydown={(e) => e.key === 'Enter' && closeMobile()}></div>
    <div class="fixed left-0 right-0 top-16 z-50 border-t border-gray-200 bg-white shadow-lg md:hidden">
      <ul class="container-page flex flex-col gap-1 py-4">
        {#each navLinks as link}
          <li>
            <a
              href={link.href}
              class="block rounded-lg px-4 py-3 text-base font-medium transition-colors duration-200"
              class:bg-primary-50={$page.url.pathname === link.href}
              class:text-primary-700={$page.url.pathname === link.href}
              class:text-gray-600={$page.url.pathname !== link.href}
              class:hover:bg-gray-100={$page.url.pathname !== link.href}
              onclick={closeMobile}
            >
              {link.label}
            </a>
          </li>
        {/each}
      </ul>
    </div>
  {/if}
</header>
