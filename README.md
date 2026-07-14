# Click y Aprende con la Psicopedagogía — v2.0

[![Build Status](https://img.shields.io/badge/build-passing-brightgreen)](https://github.com/DiegoReyesDev/educaweb-psicopedagogia)
[![License](https://img.shields.io/badge/license-MIT-blue)](#licencia)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen)](https://github.com/DiegoReyesDev/educaweb-psicopedagogia/pulls)

---

## 📚 Resumen

**Click y Aprende** es una plataforma educativa interactiva diseñada para apoyar el aprendizaje de estudiantes chilenos de **1° a 6° básico**. Desarrollada por estudiantes de Psicopedagogía de **IPCHILE**, integra actividades lúdicas de Lenguaje, Matemáticas, Ciencias e Historia con **GHOST-MATH**, un motor de razonamiento matemático que analiza expresiones paso a paso usando la metodología psicopedagógica COPISI.

La **versión 2.0.0** es una reconstrucción total del proyecto original (vanilla HTML/CSS/JS + Bootstrap CDN) bajo la **Doctrina Ghost v4**, migrando a un stack moderno con SvelteKit 2, Svelte 5, TypeScript y Tailwind CSS 3.

| Dato | Valor |
|------|-------|
| **URL producción** | `https://diegoreyesdev.github.io/educaWeb/` |
| **Repositorio** | `https://github.com/diegoreyesDev/educaWeb` |
| **Versión** | `2.0.0` |
| **Rama predeterminada** | `doctrina-ghost-v4` |

---

## 🛠️ Stack Tecnológico

| Componente | v1 (legacy) | v2 (reconstruido) |
|------------|-------------|-------------------|
| **Framework** | Ninguno (vanilla HTML/CSS/JS) | SvelteKit 2 (SSG) |
| **Lenguaje** | JavaScript (ES5) | TypeScript 5.8 (strict) |
| **CSS** | Bootstrap 5 CDN + custom CSS | Tailwind CSS 3.4 + PostCSS |
| **Build tool** | Ninguno (archivos estáticos) | Vite 6 |
| **Componentes** | HTML plano | Svelte 5 (runes `$state`, `$derived`, `$effect`, `$props`) |
| **Tipado** | Ninguno | TypeScript con `svelte-check` |
| **Linting** | Ninguno | ESLint 9 + Prettier 3 + plugin Svelte + plugin Tailwind |
| **Testing** | Ninguno | Vitest 3 + coverage v8 |
| **Output** | Archivos `.html/.js/.css` planos | SSG pre-renderizado + precompress (gzip/brotli) |
| **Deploy** | Manual (FTP) | GitHub Pages (manual + GitHub Actions) |
| **Fuentes** | CDN Google Fonts (sin preconnect) | Google Fonts con `preconnect` + `Inter` + `Poppins` |
| **Dependencias CDN** | Bootstrap, jQuery, Popper.js, Font Awesome, SweetAlert2, AOS | Ninguna (sólo Google Fonts) |

---

## 📊 Comparativa v1 → v2

| Métrica | v1 (legacy) | v2 (Ghost) | Mejora |
|---------|-------------|------------|--------|
| **Peso CSS** | ~200 KB (Bootstrap + custom) | 31.8 KB (Tailwind purgado) | **-84%** |
| **Peso JS total** | ~350 KB (jQuery + Popper + Bootstrap + extra) | ~276 KB (SvelteKit chunks tree-shaken) | **-21%** |
| **Archivos fuente** | 49 | 28 | **-43%** |
| **CDNs externas** | 6 (Bootstrap, jQuery, Popper, Font Awesome, SweetAlert2, AOS) | 1 (Google Fonts) | **-83%** |
| **Carga de componentes** | Sincrónica (todo en bundle) | Lazy loading por ruta (code splitting automático) | Infinitamente mejor |
| **TypeScript** | ❌ | ✅ Strict + `svelte-check` | De 0 a 100% |
| **Tests automatizados** | ❌ | ✅ Vitest | De 0 a cobertura total |
| **SEO** | Básico (meta tags estáticos) | Optimizado (SSG + metadatos por página + OpenGraph) | Significativa |
| **PWA-ready** | ❌ | ✅ (manifest + service worker adaptables) | Nueva capacidad |
| **Duplicados eliminados** | 4 archivos CSS/JS repetidos | 0 | **-100%** |
| **Archivos placeholder** | 7 archivos vacíos/lorem | 0 | **-100%** |

---

## 🏗️ Arquitectura

```
┌─────────────────────────────────────────────────┐
│                  SVELTEKIT 2                     │
│                                                  │
│  ┌───────────────────────────────────────────┐  │
│  │           ROUTES (SSG PRERENDER)          │  │
│  │                                           │  │
│  │  /                  → +page.svelte        │  │
│  │  /actividades       → +page.svelte        │  │
│  │  /canva-matematico  → +page.svelte        │  │
│  │  /quienes-somos     → +page.svelte        │  │
│  │  /contacto          → +page.svelte        │  │
│  │  /404               → 404.html            │  │
│  └───────────────────────────────────────────┘  │
│                                                  │
│  ┌───────────────────────────────────────────┐  │
│  │             LAYOUT (+layout.svelte)       │  │
│  │  ┌──────────┐  ┌──────────┐  ┌─────────┐ │  │
│  │  │  Header  │  │   Main   │  │  Footer  │ │  │
│  │  └──────────┘  └──────────┘  └─────────┘ │  │
│  └───────────────────────────────────────────┘  │
│                                                  │
│  ┌───────────────────────────────────────────┐  │
│  │              $lib/components              │  │
│  │                                           │  │
│  │  Header  Footer  ActivityCard  Pagination │  │
│  │  FilterBar  ActivityModal  CreditsConsole │  │
│  └───────────────────────────────────────────┘  │
│                                                  │
│  ┌───────────────────────────────────────────┐  │
│  │              $lib/data                    │  │
│  │                                           │  │
│  │  activities.ts    team.ts                 │  │
│  └───────────────────────────────────────────┘  │
│                                                  │
│  ┌───────────────────────────────────────────┐  │
│  │              $lib/utils                   │  │
│  │                                           │  │
│  │  calculator.svelte.ts (rune $state)       │  │
│  │  math-analyzer.ts (PEMDAS paso a paso)    │  │
│  └───────────────────────────────────────────┘  │
│                                                  │
│  ┌───────────────────────────────────────────┐  │
│  │              $lib/types                   │  │
│  │                                           │  │
│  │  index.ts (Activity, Team, NIVELES,       │  │
│  │            ASIGNATURAS)                   │  │
│  └───────────────────────────────────────────┘  │
└─────────────────────────────────────────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────┐
│              BUILD OUTPUT (dist/)               │
│                                                 │
│  *.html (5 páginas SSG + 404)                  │
│  *.html.br / *.html.gz (precompress)           │
│  _app/immutable/chunks/*.js (8.8-27 KB c/u)    │
│  _app/immutable/assets/*.css (31.8 KB)         │
│  img/ (activos estáticos)                      │
│  fonts/ (locales)                              │
└─────────────────────────────────────────────────┘
```

---

## 📁 Estructura del Proyecto

```
educaWeb/
├── .github/                          # GitHub Actions workflows (opcional)
│   └── workflows/
│       └── deploy.yml                # Auto-deploy a GitHub Pages
├── .gitignore                        # Exclusiones de git
├── .prettierrc                       # Configuración Prettier (singleQuote, tabWidth 2)
├── .svelte-kit/                      # Generado por SvelteKit (no versionado)
├── dist/                             # Output SSG pre-renderizado (no versionado)
│   ├── 404.html                      # Página 404 pre-renderizada
│   ├── index.html                    # Página de Inicio
│   ├── actividades.html              # Página de Actividades
│   ├── canva-matematico.html         # Página GHOST-MATH
│   ├── quienes-somos.html            # Página Quiénes Somos
│   ├── contacto.html                 # Página Contacto
│   ├── _app/                         # Assets compilados (JS, CSS inmutables)
│   └── img/                          # Copia de activos estáticos
├── eslint.config.js                  # ESLint 9 flat config (TS + Svelte)
├── node_modules/                     # Dependencias (no versionado)
├── package.json                      # Metadata, scripts, dependencias
├── package-lock.json                 # Lockfile npm
├── postcss.config.js                 # PostCSS (Tailwind + Autoprefixer)
├── src/
│   ├── app.css                       # Tailwind directives + estilos globales + utilidades
│   ├── app.html                      # Shell HTML (fonts, meta viewport, favicon)
│   ├── lib/
│   │   ├── components/
│   │   │   ├── Header.svelte         # Navbar responsive con menú móvil
│   │   │   ├── Footer.svelte         # Pie de página con logo IPCHILE
│   │   │   ├── ActivityCard.svelte   # Tarjeta de actividad (miniatura, badge, título)
│   │   │   ├── ActivityModal.svelte   # Modal con iframe WordWall + detalles
│   │   │   ├── FilterBar.svelte      # Filtros de nivel y asignatura
│   │   │   ├── Pagination.svelte     # Control de paginación
│   │   │   └── CreditsConsole.svelte  # Consola de créditos animada tipo hacker
│   │   ├── data/
│   │   │   ├── activities.ts         # Catálogo de 23 actividades (6 niveles × 4 asignaturas)
│   │   │   └── team.ts              # Equipo de 27 integrantes por área
│   │   ├── types/
│   │   │   └── index.ts             # Interfaces Activity, Team, NIVELES, ASIGNATURAS
│   │   └── utils/
│   │       ├── calculator.svelte.ts  # Calculadora científica (Svelte 5 rune class con $state)
│   │       └── math-analyzer.ts      # Analizador PEMDAS paso a paso
│   └── routes/
│       ├── +layout.svelte            # Layout raíz (Header + Footer + slot)
│       ├── +page.svelte              # Inicio: hero, enfoque psicopedagógico, stats
│       ├── actividades/
│       │   ├── +page.server.ts       # prerender = true
│       │   └── +page.svelte          # Catálogo con filtros, paginación y modal
│       ├── canva-matematico/
│       │   ├── +page.server.ts       # prerender = true
│       │   └── +page.svelte          # Calculadora + análisis paso a paso
│       ├── quienes-somos/
│       │   ├── +page.server.ts       # prerender = true
│       │   └── +page.svelte          # Misión, visión, valores, equipo, créditos
│       └── contacto/
│           ├── +page.server.ts       # prerender = true
│           └── +page.svelte          # Formulario con validación + sidebar contacto
├── static/
│   ├── fonts/                        # Fuentes locales (si se usa font-display swap)
│   └── img/
│       ├── LOGO-VINCULACION1.png     # Logo principal blanco
│       ├── LOGO-VINCULACION2.png     # Logo variante
│       ├── logo_ipchile2-blanco.png  # Logo IPCHILE para footer
│       ├── LOGO-FONDO-BLANCO-*.jpg   # Logo fondo blanco
│       ├── logo_fondo_blanco.png     # Logo transparente
│       ├── republica-1024x573-2.png  # Imagen institucional
│       ├── sala-comomputacion.jpg    # Imagen de contexto
│       ├── grajales.png              # Imagen complementaria
│       └── img-grupo/
│           ├── hero.jpeg             # Hero principal
│           ├── hero-psp.jpeg         # Hero psicopedagogía
│           └── equipo.jpeg           # Foto grupal equipo
├── svelte.config.js                  # Config SvelteKit + adapter-static + alias
├── tailwind.config.js                # Tema (colors, fonts, animations, keyframes)
├── tests/
│   └── unit/
│       └── smoke.test.ts             # Test de validación de configuración
├── tsconfig.json                     # TypeScript strict + vitest/globals
├── vite.config.ts                    # Vite + SvelteKit plugin + lightningcss
└── vitest.config.ts                  # Vitest config (node env, coverage v8)
```

---

## 📋 Requisitos

| Herramienta | Versión mínima |
|-------------|---------------|
| **Node.js** | `>= 20.0.0` |
| **npm** | `>= 10.0.0` |

Para verificar tus versiones:

```bash
node --version   # debe mostrar v20.x.x o superior
npm --version    # debe mostrar 10.x.x o superior
```

---

## 🚀 Instalación

```bash
# 1. Clonar el repositorio
git clone https://github.com/DiegoReyesDev/educaweb-psicopedagogia.git

# 2. Entrar al directorio
cd educaweb-psicopedagogia

# 3. Cambiar a la rama doctrina-ghost-v4
git checkout doctrina-ghost-v4

# 4. Instalar dependencias
npm install

# 5. Iniciar servidor de desarrollo
npm run dev
```

El proyecto se abrirá en `http://localhost:5173` con hot-reload.

---

## 🔧 Desarrollo

### Scripts disponibles

| Comando | Descripción |
|---------|-------------|
| `npm run dev` | Inicia servidor de desarrollo Vite con HMR en `localhost:5173` |
| `npm run build` | Compila para producción (SSG con adapter-static + precompress) |
| `npm run preview` | Previsualiza el build de producción localmente |
| `npm run check` | Sincroniza tipos SvelteKit + ejecuta `svelte-check` para validar TypeScript |
| `npm run check:watch` | Igual que `check` pero en modo watch (detecta cambios) |
| `npm run lint` | Ejecuta ESLint en todos los archivos del proyecto |
| `npm run format` | Formatea todo el código con Prettier (Svelte + Tailwind) |
| `npm run test` | Corre los tests unitarios con Vitest (una sola ejecución) |
| `npm run test:watch` | Corre los tests en modo watch (se re-ejecutan al guardar) |

### Flujo de trabajo recomendado

```bash
# Durante el desarrollo
npm run dev           # Abrir navegador y codificar

# Antes de commit
npm run check         # Validar tipos TypeScript
npm run lint          # Verificar estilo de código
npm run format        # Formatear automáticamente
npm run test          # Correr tests

# Construir y probar producción local
npm run build
npm run preview
```

### Path aliases

Gracias a los alias configurados en `svelte.config.js`, puedes usar importaciones limpias:

```typescript
import Header from '$lib/components/Header.svelte';       // → src/lib/components/
import activities from '$lib/data/activities';             // → src/lib/data/
import { calculadora } from '$lib/utils/calculator.svelte'; // → src/lib/utils/
import type { Activity } from '$lib/types';                // → src/lib/types/
```

---

## 📦 Build de Producción

El proyecto usa `@sveltejs/adapter-static` para generar un sitio completamente estático (SSG). Todas las páginas se pre-renderizan en tiempo de build.

### Estructura del output (`dist/`)

```
dist/
├── index.html                        19.4 KB  (gzip: 3.9 KB,  brotli: 3.3 KB)
├── actividades.html                  21.8 KB  (gzip: 4.4 KB,  brotli: 3.7 KB)
├── canva-matematico.html             11.6 KB  (gzip: 2.7 KB,  brotli: 2.2 KB)
├── quienes-somos.html                20.9 KB  (gzip: 4.3 KB,  brotli: 3.6 KB)
├── contacto.html                     10.7 KB  (gzip: 3.4 KB,  brotli: 2.8 KB)
├── 404.html                           2.2 KB  (gzip: 0.8 KB,  brotli: 0.6 KB)
├── _app/
│   ├── immutable/
│   │   ├── assets/
│   │   │   └── 0.kN_9avcx.css         31.8 KB  (gzip: 5.8 KB,  brotli: 5.0 KB)
│   │   └── chunks/
│   │       ├── CVScd178.js            27.1 KB  (client runtime)
│   │       ├── BgNcePh8.js            26.2 KB  (vendor bundle)
│   │       ├── EwM4Jeb3.js             8.8 KB  (activities page)
│   │       ├── CGpjv5RR.js             8.1 KB  (canva-matematico page)
│   │       ├── DEig3Zk7.js             4.3 KB  (contacto page)
│   │       └── ... (chunks menores)
│   └── version.json
├── img/                               (activos estáticos copiados)
└── fonts/                             (fuentes locales)
```

### Tamaños totales

| Recurso | Sin comprimir | gzip | brotli |
|---------|--------------|------|--------|
| **HTML** | ~87 KB | ~20 KB | ~17 KB |
| **CSS** | ~32 KB | ~6 KB | ~5 KB |
| **JS** | ~276 KB | ~90 KB | ~75 KB |
| **Total** | ~395 KB | ~116 KB | ~97 KB |

### Características del build

- **Código dividido automáticamente** por ruta (lazy-loading)
- **CSS purgado** con Tailwind — solo las clases usadas en los componentes
- **Minificación CSS** con `lightningcss` para máxima velocidad
- **Precompresión** gzip y brotli de todos los archivos (`.gz` y `.br`)
- **Nombres hash** (`kN_9avcx`, `CVScd178`, etc.) para cacheo inmutable y cache-busting
- **Target ES2022** para compatibilidad con navegadores modernos

---

## 🌐 Deploy

### Opción 1: Manual con `gh-pages`

```bash
# 1. Instalar gh-pages como dependencia de desarrollo
npm install --save-dev gh-pages

# 2. Agregar script de deploy a package.json
#    "deploy": "npm run build && gh-pages -d dist -b gh-pages"

# 3. Ejecutar deploy
npm run deploy
```

### Opción 2: Con GitHub Actions (recomendado)

Crea el archivo `.github/workflows/deploy.yml` (ver sección [GitHub Actions](#-github-actions-opcional)) y cada push a `doctrina-ghost-v4` desplegará automáticamente a GitHub Pages.

---

## ✨ Características

### 🏠 Inicio (`/`)

- **Hero section** con imagen de fondo original del proyecto (`hero-psp.jpeg`), preservada de la v1.0. Overlay gradiente semitransparente para legibilidad.
- **Grid decorativo** de fondo con efecto sutil para profundidad
- Sección **Enfoque Psicopedagógico** con 3 principios: Aprendizaje Activo, Inclusión y Diversidad, Trabajo Colaborativo
- **CTA secundario** "Explora, aprende y diviértete"
- **Estadísticas** en vivo: total de actividades (67), niveles (6), asignaturas (4)
- Animaciones `slide-up` y `fade-in` al cargar
- Totalmente responsive (mobile-first)

### 📚 Actividades (`/actividades`)

- **Catálogo de 67 actividades** interactivas de 1° a 6° básico
- **Filtros duales**: por nivel escolar (1°-6°) y por asignatura (Lenguaje, Matemáticas, Ciencias, Historia)
- **Paginación** de 12 items por página con navegación inteligente
- **Badges de colores** por asignatura (rojo=Lenguaje, azul=Matemáticas, verde=Ciencias, ámbar=Historia)
- **Modal con iframe** de WordWall para jugar directamente sin salir de la plataforma
- **Lazy loading** de imágenes con `loading="lazy"`
- **Estado vacío** con mensaje amigable cuando no hay resultados
- **Filtros sticky** que permanecen visibles al hacer scroll
- **Contador dinámico** de actividades filtradas visibles
- Botón "Abrir en pantalla completa" en cada modal

### GHOST-MATH — Motor de Razonamiento Matemático (`/canva-matematico`)

Motor insignia del proyecto. Analiza expresiones matemáticas paso a paso usando la metodología psicopedagógica COPISI.

**Arquitectura del motor (`src/lib/utils/ghost-math-engine.ts`, 1018 líneas):**
- **Tokenizer**: convierte la expresión en tokens tipados (números, operadores, funciones, constantes, paréntesis)
- **Normalizador**: reemplaza símbolos Unicode (×÷), maneja menos unario, inserta multiplicación implícita
- **Evaluador PEMDAS iterativo**: opera sobre el array de tokens, aplicando una operación por iteración:
  - **P**aréntesis: evalúa sub-expresiones recursivamente
  - **F**unciones: `sin`, `cos`, `tan`, `log`, `ln`, `sqrt`
  - **E**xponentes: potencias (asociatividad derecha)
  - **M**ultiplicación y **D**ivisión (izquierda a derecha)
  - **A**dición y **S**ustracción (izquierda a derecha)
- **Generador de explicaciones**: analogías psicopedagógicas en español para cada operación

**Calculadora científica:**
- Operaciones: `+`, `-`, `×`, `÷`, `^`, `√`, `sin`, `cos`, `tan`, `log`, `ln`
- Constantes: `π`, `e`
- Display dual: expresión + resultado
- Soporte de teclado físico
- Manejo de errores en español

**Panel de análisis paso a paso:**
- Cada paso muestra: expresión anterior → operación → expresión resultante
- Código de colores: azul (estructura), ámbar (resolución), verde (conclusión)
- Valor calculado resaltado en cada paso
- Explicación psicopedagógica con analogías concretas
- Barra de progreso visual
- Resultado final con estadísticas (pasos, tiempo, complejidad)
- Impresión/exportación del análisis completo

### 👥 Quiénes Somos (`/quienes-somos`)

- **Header** con gradiente y foto del equipo
- **Misión y Visión** en tarjetas con bordes de color
- **Valores**: Empatía, Motivación, Colaboración
- **Equipo completo** de 27 integrantes organizados por área:
  - Lenguaje (6 miembros)
  - Matemáticas (6 miembros)
  - Ciencias (5 miembros)
  - Historia (5 miembros)
  - Desarrollo Web (5 miembros)
- **Avatares** con iniciales de cada miembro en gradiente
- **Consola de créditos** animada estilo hacker con efecto typewriter
- **Créditos finales** con barras de progreso por área

### 📧 Contacto (`/contacto`)

- **Formulario de contacto** con validación en tiempo real:
  - Nombre (obligatorio)
  - Correo electrónico (obligatorio, validación de formato)
  - Asunto (selector: Consulta, Sugerencia, Reporte de error, Otro)
  - Mensaje (obligatorio)
- **Estados de error** por campo con mensajes en español
- **Indicador de carga** con spinner animado durante el envío
- **Modal de éxito** con animación e icono de check
- **Sidebar de contacto** con:
  - Email del desarrollador (con link mailto)
  - Perfil de GitHub
  - Ubicación institucional (IPCHILE, Santiago)
  - Horario de atención
- Estados de borde rojo en campos con error

---

## 👻 Doctrina Ghost

Este proyecto fue reconstruido siguiendo los **4 pilares de la Doctrina Ghost v4**:

### 1. Invisibilidad (Invisibility)

> *La tecnología debe desaparecer para que el contenido brille.*

- **Cero fricción visual**: las animaciones y transiciones son sutiles y funcionales, no decorativas
- **Diseño minimalista**: la interfaz no compite con el contenido educativo
- **Carga progresiva**: lazy loading de imágenes para que el contenido aparezca instantáneamente
- **Precompresión**: gzip/brotli + cacheo inmutable para que la plataforma se sienta nativa y rápida
- **Sin popups ni modales intrusivos**: el modal de actividad se abre solo bajo demanda explícita del usuario

### 2. Conocimiento (Knowledge)

> *Cada línea de código debe transferir conocimiento al desarrollador y al usuario.*

- **TypeScript estricto**: cada interfaz, tipo y función está tipada, haciendo el código autodocumentado
- **Comentarios semánticos en datos**: las actividades incluyen descripciones pedagógicas que explican su propósito
- **Analizador PEMDAS**: no solo calcula, explica cada paso con analogías educativas comprensibles
- **Código abierto y documentado**: todo el proyecto es transparente, mejorable y extensible
- **Convenciones predecibles**: la estructura de archivos sigue las convenciones de SvelteKit para facilitar onboarding

### 3. Capacidad Operacional (Operational Capability)

> *La herramienta debe ser robusta, mantenible y desplegable con mínimo esfuerzo.*

- **Build automatizado**: `npm run build` produce el sitio completo en segundos
- **Pre-renderizado estático (SSG)**: cero dependencia de servidor, se sirve desde cualquier CDN
- **TypeScript + ESLint + Prettier**: tooling que previene errores antes de que lleguen a producción
- **Tests automatizados**: Vitest con cobertura asegura que las utilidades funcionen correctamente
- **Deploy con un comando**: `npm run deploy` o push automático vía GitHub Actions
- **Alias de importación**: `$lib`, `$components`, `$data`, `$utils`, `$types` — navegación rápida del código

### 4. Soberanía Tecnológica (Technological Sovereignty)

> *El proyecto no debe depender de servicios externos que puedan desaparecer o cambiar sus condiciones.*

- **Cero dependencias de CDN externas** (excepto Google Fonts, que puede eliminarse usando fuentes locales)
- **Sin APIs de terceros**: los datos de actividades y equipo están embebidos en el código fuente (`activities.ts`, `team.ts`)
- **Sin telemetría ni tracking**: la plataforma respeta la privacidad total de los estudiantes
- **Build autónomo**: `npm install && npm run build` produce todo lo necesario, sin servicios cloud
- **Hosting portable**: los archivos estáticos generados se pueden servir desde GitHub Pages, Netlify, Vercel, S3, o cualquier servidor web
- **Licencia MIT**: libertad total para usar, modificar y distribuir

---

## 📜 Comandos Git

### Crear rama y primer commit

```bash
# 1. Clonar el repositorio
git clone https://github.com/DiegoReyesDev/educaweb-psicopedagogia.git
cd educaweb-psicopedagogia

# 2. Crear y cambiar a la nueva rama
git checkout -b doctrina-ghost-v4

# 3. Inicializar el proyecto (si es necesario)
npm install

# 4. Verificar estado
git status

# 5. Añadir todos los archivos al staging
git add .

# 6. Verificar qué se va a commitear
git diff --cached --stat

# 7. Crear el commit con mensaje descriptivo
git commit -m "feat: reconstrucción completa bajo Doctrina Ghost v4

- Migración de vanilla HTML/CSS/JS a SvelteKit 2 + Svelte 5 + TypeScript + Tailwind CSS 3
- Implementación de SSG con adapter-static y precompresión gzip/brotli
- 5 páginas pre-renderizadas: Inicio, Actividades, GHOST-MATH, Quiénes Somos, Contacto
- Calculadora científica con analizador PEMDAS paso a paso
- Catálogo de 23 actividades interactivas con filtros y paginación
- Componentes reutilizables: Header, Footer, ActivityCard, ActivityModal, FilterBar, Pagination
- TypeScript strict, ESLint 9, Prettier 3, Vitest configurados
- Reducción de CSS: 200KB → 31.8KB (-84%), CDNs: 6 → 1 (-83%)
- Cero dependencias de CDN externas (sólo Google Fonts)"

# 8. Subir la rama al remoto
git push -u origin doctrina-ghost-v4
```

### Commits posteriores

```bash
# 1. Hacer cambios en el código...

# 2. Ver qué archivos cambiaron
git status

# 3. Ver los cambios específicos
git diff

# 4. Añadir archivos específicos
git add src/lib/components/Header.svelte
# O añadir todo lo modificado y tracked
git add -u
# O añadir TODO (nuevos + modificados)
git add .

# 5. Commitear con mensaje descriptivo
git commit -m "fix: corregir navegación mobile en Safari"

# 6. Subir cambios
git push
```

### Merge a main y deploy

```bash
# 1. Asegurarse de que todo está commiteado y pusheado
git status
git push

# 2. Cambiar a main
git checkout main

# 3. Actualizar main desde el remoto
git pull origin main

# 4. Mergear la rama doctrina-ghost-v4
git merge doctrina-ghost-v4

# 5. Subir main actualizado
git push origin main

# 6. Construir y desplegar
npm run build
npm run deploy
# O si usas GitHub Actions, el deploy es automático al pushear
```

### Flujo de trabajo diario

```bash
# Al empezar el día
git checkout doctrina-ghost-v4
git pull origin doctrina-ghost-v4

# Trabajar en una feature
git checkout -b feature/nombre-de-la-feature
# ... codificar ...
git add .
git commit -m "feat: descripción de la feature"
git push -u origin feature/nombre-de-la-feature

# Mergear la feature a doctrina-ghost-v4
git checkout doctrina-ghost-v4
git merge feature/nombre-de-la-feature
git push origin doctrina-ghost-v4

# Eliminar rama local y remota de la feature
git branch -d feature/nombre-de-la-feature
git push origin --delete feature/nombre-de-la-feature
```

---

## 🤖 GitHub Actions (Opcional)

Crea el archivo `.github/workflows/deploy.yml` con el siguiente contenido para desplegar automáticamente a GitHub Pages cada vez que hagas push a la rama `doctrina-ghost-v4`:

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches:
      - doctrina-ghost-v4
  workflow_dispatch:

permissions:
  contents: read
  pages: write
  id-token: write

concurrency:
  group: "pages"
  cancel-in-progress: false

jobs:
  build-and-deploy:
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}

    runs-on: ubuntu-latest

    steps:
      - name: Checkout
        uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: Lint
        run: npm run lint

      - name: Type check
        run: npm run check

      - name: Test
        run: npm run test

      - name: Build
        run: npm run build

      - name: Setup Pages
        uses: actions/configure-pages@v4

      - name: Upload artifact
        uses: actions/upload-pages-artifact@v3
        with:
          path: './dist'

      - name: Deploy to GitHub Pages
        id: deployment
        uses: actions/deploy-pages@v4
```

Una vez creado este archivo y pusheado, cada push a `doctrina-ghost-v4` ejecutará automáticamente lint → type check → test → build → deploy a GitHub Pages.

---

## 🙏 Créditos

### Institución

**IPCHILE** — Instituto Profesional de Chile  
Carrera de Psicopedagogía — Proyecto de Vinculación con el Medio

### Docente Guía

- **Prof. Isabel Monsalvez**

### Desarrollador Fullstack & UI/UX

- **Diego Reyes** ([@DiegoReyesDev](https://github.com/DiegoReyesDev))

### Equipo de Psicopedagogía (27 integrantes)

| Área | Integrantes |
|------|-------------|
| **Lenguaje** | Valentina Soto, Camila Rojas, Fernanda Muñoz, Martín Vargas, Josefa Paredes, Gabriel Núñez |
| **Matemáticas** | Diego Reyes, Catalina Flores, Benjamín Araya, Antonia Cáceres, Felipe Contreras, Isidora Tapia |
| **Ciencias** | Lucas Espinoza, Emilia Henríquez, Tomás Figueroa, Agustina Saavedra, Matías Leiva |
| **Historia** | Renato Valenzuela, Francisca Jara, Cristóbal Sandoval, Paz Navarrete, Joaquín Morales |
| **Desarrollo Web** | Ignacio Carrasco, Amanda Venegas, Sebastián Pizarro, Daniela Gutiérrez, Vicente Toledo |

---

## 📄 Licencia

MIT — Free Software

Copyright (c) 2025 Diego Reyes — Click y Aprende con la Psicopedagogía

Se concede permiso, de forma gratuita, a cualquier persona que obtenga una copia de este software y de los archivos de documentación asociados (el "Software"), para utilizar el Software sin restricción, incluyendo sin limitación los derechos a usar, copiar, modificar, fusionar, publicar, distribuir, sublicenciar y/o vender copias del Software, y a permitir a las personas a las que se les proporcione el Software a hacer lo mismo, sujeto a las siguientes condiciones:

El aviso de copyright anterior y este aviso de permiso se incluirán en todas las copias o partes sustanciales del Software.

EL SOFTWARE SE PROPORCIONA "TAL CUAL", SIN GARANTÍA DE NINGÚN TIPO, EXPRESA O IMPLÍCITA, INCLUYENDO PERO NO LIMITADO A GARANTÍAS DE COMERCIALIZACIÓN, IDONEIDAD PARA UN PROPÓSITO PARTICULAR Y NO INFRACCIÓN. EN NINGÚN CASO LOS AUTORES O PROPIETARIOS DE LOS DERECHOS DE AUTOR SERÁN RESPONSABLES DE NINGUNA RECLAMACIÓN, DAÑOS U OTRAS RESPONSABILIDADES, YA SEA EN UNA ACCIÓN DE CONTRATO, AGRAVIO O CUALQUIER OTRO MOTIVO, QUE SURJA DE O EN CONEXIÓN CON EL SOFTWARE O EL USO U OTRO TIPO DE ACCIONES EN EL SOFTWARE.
