<script lang="ts">
  import { onMount } from 'svelte';

  let name = $state('');
  let email = $state('');
  let subject = $state('');
  let message = $state('');

  let errors: Record<string, string> = $state({});
  let submitting = $state(false);
  let sendError = $state('');
  let showSuccess = $state(false);

  let nameInput: HTMLInputElement | undefined = $state();

  const PUBLIC_KEY = import.meta.env.VITE_EMAILJS_PUBLIC_KEY as string | undefined;
  const SERVICE_ID = import.meta.env.VITE_EMAILJS_SERVICE_ID as string | undefined;
  const TEMPLATE_ID = import.meta.env.VITE_EMAILJS_TEMPLATE_ID as string | undefined;

  const emailjsConfigured = $derived(!!(PUBLIC_KEY && SERVICE_ID && TEMPLATE_ID));

  const subjectMap: Record<string, string> = {
    consulta: 'Consulta - Click y Aprende',
    sugerencia: 'Sugerencia - Click y Aprende',
    reporte: 'Reporte de error - Click y Aprende',
    otro: 'Contacto - Click y Aprende',
  };

  onMount(() => {
    nameInput?.focus();
  });

  function validateEmail(mail: string): boolean {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(mail);
  }

  function inputClass(errorKey: string): string {
    const base =
      'w-full rounded-lg border px-4 py-2.5 text-gray-900 transition-colors focus:outline-none focus:ring-2';
    if (errorKey && errors[errorKey]) {
      return `${base} border-red-500 focus:border-red-500 focus:ring-red-500/20`;
    }
    return `${base} border-gray-300 focus:border-primary-500 focus:ring-primary-500/20`;
  }

  function resetForm() {
    name = '';
    email = '';
    subject = '';
    message = '';
    errors = {};
    sendError = '';
  }

  async function handleSubmit(e: Event) {
    e.preventDefault();
    errors = {};
    sendError = '';

    if (!name.trim()) {
      errors.name = 'El nombre es obligatorio.';
    }
    if (!email.trim()) {
      errors.email = 'El correo electrónico es obligatorio.';
    } else if (!validateEmail(email.trim())) {
      errors.email = 'Ingresa un correo electrónico válido.';
    }
    if (!subject) {
      errors.subject = 'Selecciona un asunto.';
    }
    if (!message.trim()) {
      errors.message = 'El mensaje es obligatorio.';
    }

    if (Object.keys(errors).length > 0) return;

    const templateSubject = subjectMap[subject] ?? 'Contacto - Click y Aprende';

    if (emailjsConfigured) {
      submitting = true;

      try {
        // @ts-expect-error — módulo opcional, se usa solo si está instalado
        const emailjs = await import(/* @vite-ignore */ '@emailjs/browser');
        emailjs.default.init(PUBLIC_KEY!);
        await emailjs.default.send(SERVICE_ID!, TEMPLATE_ID!, {
          from_name: name.trim(),
          reply_to: email.trim(),
          subject: templateSubject,
          message: message.trim(),
        });
        resetForm();
        showSuccess = true;
      } catch {
        sendError = 'Error al enviar el mensaje. Intenta nuevamente más tarde.';
      } finally {
        submitting = false;
      }
    } else {
      const body = `Nombre: ${name.trim()}%0D%0AEmail: ${email.trim()}%0D%0A%0D%0A${message.trim()}`;
      const mailto = `mailto:diegoreyes.dev@gmail.com?subject=${encodeURIComponent(templateSubject)}&body=${body}`;
      window.location.href = mailto;
      resetForm();
      setTimeout(() => {
        showSuccess = true;
      }, 500);
    }
  }
</script>

<svelte:head>
  <title>Contacto — Click y Aprende</title>
  <meta name="description" content="Contáctanos para consultas, sugerencias o reportes. Estamos aquí para ayudarte." />
</svelte:head>

<div class="min-h-screen bg-gray-50">
  <section class="bg-gradient-to-br from-primary-600 to-accent-600 py-16 sm:py-20">
    <div class="container-page text-center text-white">
      <h1 class="text-4xl font-extrabold sm:text-5xl">Contacto</h1>
      <p class="mt-4 text-lg text-white/80">
        Estamos aquí para ayudarte. Escríbenos y te responderemos a la brevedad.
      </p>
    </div>
  </section>

  <div class="container-page py-12">
    {#if !emailjsConfigured}
      <div class="mb-8 rounded-lg border border-amber-300 bg-amber-50 px-5 py-4">
        <div class="flex items-start gap-3">
          <svg xmlns="http://www.w3.org/2000/svg" class="mt-0.5 h-5 w-5 flex-shrink-0 text-amber-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
            <line x1="12" y1="9" x2="12" y2="13" />
            <line x1="12" y1="17" x2="12.01" y2="17" />
          </svg>
          <div class="text-sm text-amber-800">
            <p class="font-semibold">EmailJS no está configurado</p>
            <p class="mt-1">
              El formulario usará tu cliente de correo para enviar el mensaje. Para habilitar el envío directo, configura las variables de entorno
              <code class="rounded bg-amber-100 px-1 font-mono text-xs">VITE_EMAILJS_PUBLIC_KEY</code>,
              <code class="rounded bg-amber-100 px-1 font-mono text-xs">VITE_EMAILJS_SERVICE_ID</code> y
              <code class="rounded bg-amber-100 px-1 font-mono text-xs">VITE_EMAILJS_TEMPLATE_ID</code> e instala
              <code class="rounded bg-amber-100 px-1 font-mono text-xs">@emailjs/browser</code>.
            </p>
          </div>
        </div>
      </div>
    {/if}

    <div class="grid gap-8 md:grid-cols-[1fr_320px]">
      <div class="card">
        <h2 class="mb-6 text-2xl font-bold text-gray-900">Envíanos un mensaje</h2>

        <form onsubmit={handleSubmit} novalidate>
          <div class="mb-4">
            <label for="name" class="mb-1 block text-sm font-medium text-gray-700">Nombre *</label>
            <input
              id="name"
              type="text"
              bind:value={name}
              bind:this={nameInput}
              class={inputClass('name')}
              placeholder="Tu nombre completo"
            />
            {#if errors.name}
              <p class="mt-1 text-sm text-red-600">{errors.name}</p>
            {/if}
          </div>

          <div class="mb-4">
            <label for="email" class="mb-1 block text-sm font-medium text-gray-700">Correo electrónico *</label>
            <input
              id="email"
              type="email"
              bind:value={email}
              class={inputClass('email')}
              placeholder="tu@correo.com"
            />
            {#if errors.email}
              <p class="mt-1 text-sm text-red-600">{errors.email}</p>
            {/if}
          </div>

          <div class="mb-4">
            <label for="subject" class="mb-1 block text-sm font-medium text-gray-700">Asunto *</label>
            <select id="subject" bind:value={subject} class={inputClass('subject')}>
              <option value="">Selecciona un asunto</option>
              <option value="consulta">Consulta</option>
              <option value="sugerencia">Sugerencia</option>
              <option value="reporte">Reporte de error</option>
              <option value="otro">Otro</option>
            </select>
            {#if errors.subject}
              <p class="mt-1 text-sm text-red-600">{errors.subject}</p>
            {/if}
          </div>

          <div class="mb-6">
            <label for="message" class="mb-1 block text-sm font-medium text-gray-700">Mensaje *</label>
            <textarea
              id="message"
              bind:value={message}
              rows={5}
              class={inputClass('message') + ' resize-none'}
              placeholder="Escribe tu mensaje aquí..."
            ></textarea>
            {#if errors.message}
              <p class="mt-1 text-sm text-red-600">{errors.message}</p>
            {/if}
          </div>

          {#if sendError}
            <div class="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {sendError}
            </div>
          {/if}

          <button type="submit" class="btn-primary w-full" disabled={submitting}>
            {#if submitting}
              <svg
                class="-ml-1 mr-2 h-5 w-5 animate-spin"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Enviando...
            {:else}
              {emailjsConfigured ? 'Enviar mensaje' : 'Abrir cliente de correo'}
            {/if}
          </button>
        </form>
      </div>

      <aside class="space-y-6">
        <div class="card">
          <h3 class="mb-4 text-lg font-bold text-gray-900">Información de contacto</h3>
          <div class="space-y-4">
            <div class="flex items-start gap-3">
              <div class="mt-0.5 flex-shrink-0 rounded-lg bg-primary-100 p-2 text-primary-600">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
                </svg>
              </div>
              <div>
                <p class="text-sm font-medium text-gray-500">Email</p>
                <a href="mailto:diegoreyes.dev@gmail.com" class="text-sm text-primary-600 hover:underline">
                  diegoreyes.dev@gmail.com
                </a>
              </div>
            </div>

            <div class="flex items-start gap-3">
              <div class="mt-0.5 flex-shrink-0 rounded-lg bg-gray-800 p-2 text-white">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                  <path fill-rule="evenodd" clip-rule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
                </svg>
              </div>
              <div>
                <p class="text-sm font-medium text-gray-500">GitHub</p>
                <a href="https://github.com/diegoreyesDev" target="_blank" rel="noopener noreferrer" class="text-sm text-primary-600 hover:underline">
                  github.com/diegoreyesDev
                </a>
              </div>
            </div>

            <div class="flex items-start gap-3">
              <div class="mt-0.5 flex-shrink-0 rounded-lg bg-accent-100 p-2 text-accent-600">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path stroke-linecap="round" stroke-linejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
                </svg>
              </div>
              <div>
                <p class="text-sm font-medium text-gray-500">Institución</p>
                <p class="text-sm text-gray-700">IPCHILE, Santiago</p>
              </div>
            </div>
          </div>
        </div>

        <div class="card bg-gradient-to-br from-primary-50 to-accent-50">
          <div class="mb-2 flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-primary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <h3 class="text-sm font-bold text-primary-800">Horario de atención</h3>
          </div>
          <p class="mb-1 text-lg font-semibold text-gray-800">Lunes a viernes</p>
          <p class="text-sm text-gray-600">9:00 a 18:00 hrs.</p>
        </div>
      </aside>
    </div>
  </div>
</div>

{#if showSuccess}
  <div
    class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
    onclick={() => (showSuccess = false)}
    onkeydown={() => {}}
    role="presentation"
  >
    <div
      class="card mx-auto max-w-md animate-slide-up text-center"
      onclick={(e: MouseEvent) => e.stopPropagation()}
      onkeydown={() => {}}
      role="dialog"
      aria-modal="true"
      aria-label="Mensaje enviado"
      tabindex="-1"
    >
      <div class="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
          <path stroke-linecap="round" stroke-linejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      </div>
      <h2 class="mb-2 text-xl font-bold text-gray-900">¡Mensaje enviado!</h2>
      <p class="mb-6 text-gray-600">
        Gracias por contactarnos. Te responderemos a la brevedad.
      </p>
      <button class="btn-primary w-full" onclick={() => (showSuccess = false)}>
        Entendido
      </button>
    </div>
  </div>
{/if}
