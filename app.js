// app.js - catálogo de cursos (Sistemas)

const courses = [
  { id: 1, title: 'Fundamentos de Sistemas Operativos', desc: 'Conceptos de procesos, memoria, archivos y drivers.', tags:['Sistemas','OS','Infraestructura'], hours:40 },
  { id: 2, title: 'Redes de Computadoras', desc: 'Modelos OSI/TCP, enrutamiento, switching y seguridad básica.', tags:['Sistemas','Redes','Seguridad'], hours:48 },
  { id: 3, title: 'Administración de Servidores Linux', desc: 'Instalación, configuración, servicios y troubleshooting.', tags:['Sistemas','Linux','Servidor'], hours:60 },
  { id: 4, title: 'Bases de Datos Relacionales', desc: 'Diseño ER, SQL avanzado, índices y optimización.', tags:['Sistemas','BD','SQL'], hours:50 },
  { id: 5, title: 'Seguridad Informática y Hacking Ético', desc: 'Modelos de amenaza, pruebas de penetración y mitigaciones.', tags:['Sistemas','Seguridad','Forense'], hours:56 },
  { id: 6, title: 'Virtualización y Contenedores', desc: 'VMs, Docker, Kubernetes y orquestación.', tags:['Sistemas','DevOps','Containers'], hours:44 },
  { id: 7, title: 'Programación para Administradores', desc: 'Scripting con Bash y Python para automatización de tareas.', tags:['Sistemas','Scripting','Python'], hours:36 },
  { id: 8, title: 'Arquitectura de Computadoras', desc: 'CPU, memoria, buses y organización interna.', tags:['Sistemas','Hardware'], hours:42 },
  { id: 9, title: 'Ingeniería de Sistemas Distribuidos', desc: 'Comunicación, consenso, escalabilidad y tolerancia a fallos.', tags:['Sistemas','Distribuidos'], hours:64 },
  { id: 10, title: 'Gestión de Proyectos TI', desc: 'Metodologías ágiles, Scrum y gestión de equipos técnicos.', tags:['Sistemas','Gestión'], hours:30 },
  { id: 11, title: 'Monitoreo y Observabilidad', desc: 'Prometheus, Grafana, logs y trazas para sistemas en producción.', tags:['Sistemas','DevOps','Monitorización'], hours:38 },
  { id: 12, title: 'Backup y Recuperación ante Desastres', desc: 'Estrategias, herramientas y planes de recuperación.', tags:['Sistemas','Seguridad','Backup'], hours:28 }
];

// State
let state = {
  query: '',
  currentPage: 1,
  perPage: 6,
  filtered: courses
};

// Elements
const catalogEl = document.getElementById('catalog');
const paginationEl = document.getElementById('pagination');
const searchInput = document.getElementById('searchInput');
const perPageSelect = document.getElementById('perPage');

// Helpers
function debounce(fn, wait){
  let t;
  return (...args)=>{
    clearTimeout(t);
    t = setTimeout(()=>fn(...args), wait);
  }
}

// Announcer helper for screen readers
function announce(message){
  const el = document.getElementById('announcer');
  if(!el) return;
  // clear then set to ensure screen readers detect change
  el.textContent = '';
  setTimeout(()=>{ el.textContent = message; }, 50);
}

function filterCourses(query){
  if(!query) return courses.slice();
  const q = query.toLowerCase().trim();
  return courses.filter(c=>{
    return c.title.toLowerCase().includes(q) || c.desc.toLowerCase().includes(q) || c.tags.join(' ').toLowerCase().includes(q);
  });
}

function paginate(list, page, perPage){
  const total = list.length;
  const pages = Math.max(1, Math.ceil(total / perPage));
  const start = (page - 1) * perPage;
  const data = list.slice(start, start + perPage);
  return { data, total, pages };
}

function renderCatalog(){
  catalogEl.innerHTML = '';
  const { data, total, pages } = paginate(state.filtered, state.currentPage, state.perPage);

  if(total === 0){
    const empty = document.createElement('div');
    empty.className = 'empty fade-in';
    empty.textContent = 'No se encontraron cursos que coincidan con la búsqueda.';
    catalogEl.appendChild(empty);
    paginationEl.innerHTML = '';
    announce('No se encontraron cursos que coincidan con la búsqueda.');
    return;
  }

  data.forEach((c, idx)=>{
    const card = document.createElement('article');
    card.className = 'card slide-up';
    card.style.animationDelay = `${idx * 40}ms`;

    card.innerHTML = `
      <h3>${c.title}</h3>
      <p class="desc">${c.desc}</p>
      <div class="meta">
        <span class="tag">${c.tags[0] || 'Sistemas'}</span>
        <small style="color:var(--muted)">${c.hours} hrs</small>
      </div>
      <div class="actions">
        <button class="btn" aria-label="Ver detalles ${c.title}">Detalles</button>
        <button class="btn primary" aria-label="Inscribirse a ${c.title}">Inscribirse</button>
      </div>
    `;

    catalogEl.appendChild(card);
  });

  renderPagination(pages);

  // announce the current view for screen reader users
  announce(`Mostrando ${data.length} de ${total} cursos. Página ${state.currentPage} de ${pages}.`);

  // Move keyboard focus to the first action in the catalog for smoother keyboard navigation
  const firstAction = catalogEl.querySelector('.actions .btn');
  if(firstAction){
    firstAction.setAttribute('tabindex','0');
    firstAction.focus({preventScroll:true});
  }
}

function renderPagination(totalPages){
  paginationEl.innerHTML = '';
  if(totalPages <= 1) return;

  const createBtn = (label, page, isActive=false)=>{
    const btn = document.createElement('button');
    btn.className = 'page-btn' + (isActive ? ' active' : '');
    btn.textContent = label;
    btn.onclick = ()=>{
      state.currentPage = page;
      renderCatalog();
      window.scrollTo({top:0,behavior:'smooth'});
    };
    btn.setAttribute('aria-label', `Ir a página ${page}`);
    return btn;
  };

  // Prev
  const prev = document.createElement('button');
  prev.className = 'page-btn';
  prev.textContent = '«';
  prev.onclick = ()=>{ if(state.currentPage>1){ state.currentPage--; renderCatalog(); window.scrollTo({top:0,behavior:'smooth'}); } };
  prev.setAttribute('type','button');
  paginationEl.appendChild(prev);

  for(let i=1;i<=totalPages;i++){
    paginationEl.appendChild(createBtn(i, i, i===state.currentPage));
  }

  const next = document.createElement('button');
  next.className = 'page-btn';
  next.textContent = '»';
  next.onclick = ()=>{ if(state.currentPage<totalPages){ state.currentPage++; renderCatalog(); window.scrollTo({top:0,behavior:'smooth'}); } };
  next.setAttribute('type','button');
  paginationEl.appendChild(next);
}

// Events
const onSearch = debounce((e)=>{
  state.query = e.target.value;
  state.filtered = filterCourses(state.query);
  state.currentPage = 1;
  renderCatalog();
}, 220);

searchInput.addEventListener('input', onSearch);
perPageSelect.addEventListener('change', (e)=>{
  state.perPage = Number(e.target.value);
  state.currentPage = 1;
  renderCatalog();
  announce(`Se mostrarán ${state.perPage} cursos por página.`);
});

// Initial render
state.filtered = courses.slice();
renderCatalog();

// Expose for debugging
window._catalogState = state;

// Theme (modo claro/oscuro) - toggle + persistencia
(function(){
  const THEME_KEY = 'site-theme';
  const toggleBtn = document.getElementById('theme-toggle');
  if(!toggleBtn) return;

  function applyTheme(theme){
    // Use class toggles and CSS to animate SVG icons; avoid manipulating textContent
    if(theme === 'light'){
      document.documentElement.setAttribute('data-theme','light');
      toggleBtn.classList.add('is-light');
      toggleBtn.setAttribute('aria-pressed','true');
    } else {
      document.documentElement.removeAttribute('data-theme');
      toggleBtn.classList.remove('is-light');
      toggleBtn.setAttribute('aria-pressed','false');
    }
  }

  // initialize from localStorage or system preference
  const saved = localStorage.getItem(THEME_KEY);
  if(saved){
    applyTheme(saved);
  } else if(window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches){
    applyTheme('light');
  } else {
    applyTheme('dark');
  }

  toggleBtn.addEventListener('click', ()=>{
    const currentIsLight = document.documentElement.getAttribute('data-theme') === 'light';
    const next = currentIsLight ? 'dark' : 'light';
    applyTheme(next);
    localStorage.setItem(THEME_KEY, next);
    // small tactile feedback via aria-live could be added if desired
    announce(next === 'light' ? 'Tema claro activado' : 'Tema oscuro activado');
  });
})();

// Keyboard shortcuts for pagination (Left/Right) and accessibility niceties
document.addEventListener('keydown', (e)=>{
  // Ignore when focus is on an input or editable element
  const tag = document.activeElement && document.activeElement.tagName;
  if(tag === 'INPUT' || tag === 'TEXTAREA' || document.activeElement.isContentEditable) return;

  if(e.key === 'ArrowLeft'){
    if(state.currentPage > 1){ state.currentPage--; renderCatalog(); window.scrollTo({top:0,behavior:'smooth'}); }
  } else if(e.key === 'ArrowRight'){
    // try to compute total pages from filtered list
    const pages = Math.max(1, Math.ceil(state.filtered.length / state.perPage));
    if(state.currentPage < pages){ state.currentPage++; renderCatalog(); window.scrollTo({top:0,behavior:'smooth'}); }
  }
});

// Delegate click events inside catalog for Details/Inscribirse to provide announcements
catalogEl.addEventListener('click', (e)=>{
  const btn = e.target.closest('button');
  if(!btn) return;
  const card = e.target.closest('.card');
  const title = card ? card.querySelector('h3')?.textContent : '';
  if(btn.textContent && title){
    const action = btn.textContent.trim();
    announce(`${action} — ${title}`);
  }
});
