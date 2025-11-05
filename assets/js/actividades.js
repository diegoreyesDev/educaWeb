const actividadesContainer = document.getElementById("actividadesContainer");
const nivelSelect = document.getElementById("nivelSelect");
const asignaturaSelect = document.getElementById("asignaturaSelect");
const paginacionContainer = document.getElementById("paginacionContainer"); // Nuevo elemento
let actividadesData = [];
let actividadesFiltradas = [];
let paginaActual = 1;
const ACTIVIDADES_POR_PAGINA = 6;

// Cargar archivo JSON
fetch("assets/data/actividades.json")
  .then((res) => res.json())
  .then((data) => {
    actividadesData = data;
    mostrarActividades();
  })
  .catch((err) => console.error("Error al cargar actividades:", err));

// Filtros dinámicos
[nivelSelect, asignaturaSelect].forEach((select) =>
  select.addEventListener("change", function() {
    paginaActual = 1; // Reiniciar a primera página al filtrar
    mostrarActividades();
  })
);

function mostrarActividades() {
  const nivel = nivelSelect.value;
  const asignatura = asignaturaSelect.value;

  actividadesFiltradas = actividadesData.filter((act) => {
    return (
      (!nivel || act.nivel === nivel) &&
      (!asignatura || act.asignatura === asignatura)
    );
  });

  if (actividadesFiltradas.length === 0) {
    actividadesContainer.innerHTML = `
      <div class="col-12 text-center text-muted py-5">
        <i class="fas fa-search fa-3x mb-3"></i>
        <p class="fs-5">No hay actividades para esta selección.</p>
        <p class="text-muted">Intenta con otros filtros</p>
      </div>`;
    
    // Limpiar paginación si no hay resultados
    if (paginacionContainer) {
      paginacionContainer.innerHTML = '';
    }
    return;
  }

  // Calcular páginas
  const totalPaginas = Math.ceil(actividadesFiltradas.length / ACTIVIDADES_POR_PAGINA);
  
  // Asegurar que la página actual sea válida
  if (paginaActual > totalPaginas) {
    paginaActual = totalPaginas;
  }

  // Obtener actividades para la página actual
  const inicio = (paginaActual - 1) * ACTIVIDADES_POR_PAGINA;
  const fin = inicio + ACTIVIDADES_POR_PAGINA;
  const actividadesPagina = actividadesFiltradas.slice(inicio, fin);

  // Mostrar actividades
  actividadesContainer.innerHTML = actividadesPagina
    .map((a) => `
      <div class="col-lg-4 col-md-6 mb-4">
        <div class="card actividad-card h-100 shadow-sm border-0" 
             onclick="abrirActividad('${a.embedUrl}', '${a.titulo}')"
             style="cursor: pointer;">
          <div class="card-img-container position-relative">
            <img src="${a.miniatura}" 
                 class="card-img-top" 
                 alt="${a.titulo}"
                 style="height: 200px; object-fit: contain;">
            
          </div>
          <div class="card-body text-center">
            <h5 class="card-title fw-bold text-primary">${a.titulo}</h5>
            <p class="card-text text-muted">${a.descripcion}</p>
            <div class="badge bg-light text-dark mb-2">
              ${a.asignatura.toUpperCase()}
            </div>
          </div>
          <div class="card-footer bg-transparent border-0 pb-3">
            <button class="btn btn-primary w-100">
              <i class="fas fa-play me-2"></i>Iniciar Actividad
            </button>
          </div>
        </div>
      </div>
    `).join("");

  // Mostrar controles de paginación
  mostrarPaginacion(totalPaginas);
}

function mostrarPaginacion(totalPaginas) {
  if (!paginacionContainer) return;
  
  if (totalPaginas <= 1) {
    paginacionContainer.innerHTML = '';
    return;
  }

  let paginacionHTML = `
    <nav aria-label="Navegación de actividades">
      <ul class="pagination justify-content-center">
  `;

  // Botón Anterior
  if (paginaActual > 1) {
    paginacionHTML += `
      <li class="page-item">
        <a class="page-link" href="javascript:void(0)" onclick="cambiarPagina(${paginaActual - 1})">
          <i class="fas fa-chevron-left me-1"></i> Anterior
        </a>
      </li>
    `;
  } else {
    paginacionHTML += `
      <li class="page-item disabled">
        <span class="page-link">
          <i class="fas fa-chevron-left me-1"></i> Anterior
        </span>
      </li>
    `;
  }

  // Números de página
  const paginasParaMostrar = 3; // Máximo de números de página a mostrar
  let inicioPagina = Math.max(1, paginaActual - Math.floor(paginasParaMostrar / 2));
  let finPagina = Math.min(totalPaginas, inicioPagina + paginasParaMostrar - 1);

  // Ajustar si estamos cerca del final
  if (finPagina - inicioPagina + 1 < paginasParaMostrar) {
    inicioPagina = Math.max(1, finPagina - paginasParaMostrar + 1);
  }

  // Primera página y elipsis si es necesario
  if (inicioPagina > 1) {
    paginacionHTML += `
      <li class="page-item">
        <a class="page-link" href="javascript:void(0)" onclick="cambiarPagina(1)">1</a>
      </li>
    `;
    if (inicioPagina > 2) {
      paginacionHTML += `
        <li class="page-item disabled">
          <span class="page-link">...</span>
        </li>
      `;
    }
  }

  // Números de página
  for (let i = inicioPagina; i <= finPagina; i++) {
    if (i === paginaActual) {
      paginacionHTML += `
        <li class="page-item active">
          <span class="page-link">${i}</span>
        </li>
      `;
    } else {
      paginacionHTML += `
        <li class="page-item">
          <a class="page-link" href="javascript:void(0)" onclick="cambiarPagina(${i})">${i}</a>
        </li>
      `;
    }
  }

  // Última página y elipsis si es necesario
  if (finPagina < totalPaginas) {
    if (finPagina < totalPaginas - 1) {
      paginacionHTML += `
        <li class="page-item disabled">
          <span class="page-link">...</span>
        </li>
      `;
    }
    paginacionHTML += `
      <li class="page-item">
        <a class="page-link" href="javascript:void(0)" onclick="cambiarPagina(${totalPaginas})">${totalPaginas}</a>
      </li>
    `;
  }

  // Botón Siguiente
  if (paginaActual < totalPaginas) {
    paginacionHTML += `
      <li class="page-item">
        <a class="page-link" href="javascript:void(0)" onclick="cambiarPagina(${paginaActual + 1})">
          Siguiente <i class="fas fa-chevron-right ms-1"></i>
        </a>
      </li>
    `;
  } else {
    paginacionHTML += `
      <li class="page-item disabled">
        <span class="page-link">
          Siguiente <i class="fas fa-chevron-right ms-1"></i>
        </span>
      </li>
    `;
  }

  paginacionHTML += `
      </ul>
    </nav>
    
    <div class="text-center text-muted mt-2">
      <small>Mostrando ${((paginaActual - 1) * ACTIVIDADES_POR_PAGINA) + 1}-${Math.min(paginaActual * ACTIVIDADES_POR_PAGINA, actividadesFiltradas.length)} de ${actividadesFiltradas.length} actividades</small>
    </div>
  `;

  paginacionContainer.innerHTML = paginacionHTML;
}

function cambiarPagina(nuevaPagina) {
  paginaActual = nuevaPagina;
  mostrarActividades();
  
  // Scroll suave hacia arriba
  window.scrollTo({
    top: actividadesContainer.offsetTop - 100,
    behavior: 'smooth'
  });
}

function abrirActividad(embedUrl, titulo) {
  const modal = new bootstrap.Modal(document.getElementById("actividadModal"));
  const iframe = document.getElementById("actividadIframe");
  
  iframe.src = embedUrl;
  document.getElementById("actividadTitulo").innerText = titulo;
  modal.show();
  
  document.getElementById('actividadModal').addEventListener('hidden.bs.modal', function () {
    iframe.src = '';
  });
}