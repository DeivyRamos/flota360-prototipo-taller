/* ============================================================
   FLOTA 360 — APP JS
   Navegación, microinteracciones, simulaciones
   ============================================================ */

const SECTIONS = [
  { id: 'hero',        label: 'Inicio',         icon: '🏠' },
  { id: 'panel',       label: 'Panel',          icon: '📊' },
  { id: 'recepcion',   label: 'Recepción',      icon: '📋' },
  { id: 'ot',          label: 'Orden de Trabajo',icon: '🔧' },
  { id: 'diagnostico', label: 'Diagnóstico',    icon: '🔍' },
  { id: 'cotizacion',  label: 'Cotización',     icon: '💬' },
  { id: 'costos',      label: 'Costos',         icon: '💰' },
  { id: 'proveedores', label: 'Proveedores',    icon: '📦' },
  { id: 'evidencia',   label: 'Evidencia',      icon: '📷' },
  { id: 'calidad',     label: 'Calidad',        icon: '✅' },
  { id: 'entrega',     label: 'Entrega',        icon: '🚗' },
  { id: 'portal',      label: 'Portal Cliente', icon: '👁️' },
  { id: 'config',      label: 'Configuración',  icon: '⚙️' },
  { id: 'cierre',      label: 'Cierre',         icon: '🏆' },
];

let currentSection = 'hero';

// ── NAVIGATION ──────────────────────────────────────────────

function goSection(id) {
  if (!id) return;
  const target = document.getElementById(id);
  if (!target) return;

  document.querySelectorAll('.section').forEach(s => s.classList.remove('active'));
  target.classList.add('active');
  currentSection = id;

  // Update desktop nav
  document.querySelectorAll('.navbtn').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.section === id);
  });

  // Update bottom nav
  document.querySelectorAll('.bn-btn').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.section === id);
  });

  // Scroll to top smoothly
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function scrollToSection(id) {
  goSection(id);
}

// Attach click handlers to all nav buttons
document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('[data-section]').forEach(btn => {
    btn.addEventListener('click', () => goSection(btn.dataset.section));
  });

  // Also handle any inline onclick=goSection calls from buttons in hero
  goSection('hero');
});

// ── EVIDENCE TABS ────────────────────────────────────────────

function switchEvid(btn, panelId) {
  document.querySelectorAll('.etab').forEach(t => t.classList.remove('active'));
  btn.classList.add('active');

  document.querySelectorAll('.evid-panel').forEach(p => p.style.display = 'none');
  const panel = document.getElementById(panelId);
  if (panel) panel.style.display = 'block';
}

// ── PORTAL TABS ──────────────────────────────────────────────

function switchPortal(btn, panelId) {
  document.querySelectorAll('.ptab').forEach(t => t.classList.remove('active'));
  btn.classList.add('active');

  document.querySelectorAll('.portal-panel').forEach(p => p.style.display = 'none');
  const panel = document.getElementById(panelId);
  if (panel) panel.style.display = 'block';
}

// ── STATUS CHANGE (OT) ───────────────────────────────────────

function changeStatus(btn, label) {
  document.querySelectorAll('.status-btn').forEach(b => {
    b.classList.remove('active-btn', 'done-btn');
  });

  const idx = Array.from(document.querySelectorAll('.status-btn')).indexOf(btn);
  document.querySelectorAll('.status-btn').forEach((b, i) => {
    if (i < idx) b.classList.add('done-btn');
  });
  btn.classList.add('active-btn');

  const msg = document.getElementById('statusMsg');
  if (msg) {
    msg.style.display = 'block';
    msg.textContent = `Estado actualizado: "${label}" — ${new Date().toLocaleTimeString('es-CL', {hour:'2-digit',minute:'2-digit'})} hrs. Cliente notificado.`;
    msg.className = 'info-box blue';
  }

  showToast(`Estado cambiado a: ${label}`);
}

// ── MODAL ────────────────────────────────────────────────────

function openModal(id) {
  const modal = document.getElementById(id);
  if (modal) modal.style.display = 'flex';
  document.body.style.overflow = 'hidden';
}

function closeModal(event) {
  if (event.target === event.currentTarget) {
    closeModalDirect();
  }
}

function closeModalDirect() {
  document.querySelectorAll('.modal-overlay').forEach(m => m.style.display = 'none');
  document.body.style.overflow = '';
}

function approveQuote() {
  closeModalDirect();
  showToast('✅ Cotización aprobada. OT-0044 en ejecución.');
  goSection('cotizacion');
}

// ── TOAST ────────────────────────────────────────────────────

let toastTimer;
function showToast(message) {
  const toast = document.getElementById('toast');
  if (!toast) return;

  clearTimeout(toastTimer);
  toast.textContent = message;
  toast.classList.add('show');

  toastTimer = setTimeout(() => toast.classList.remove('show'), 3000);
}

// ── SATISFACTION SELECTOR ────────────────────────────────────

function selectSat(el) {
  document.querySelectorAll('.sat-opt').forEach(o => o.classList.remove('selected'));
  el.classList.add('selected');
  const emoji = el.querySelector('.sat-icon').textContent;
  const label = el.querySelector('.sat-text').textContent;
  showToast(`Satisfacción registrada: ${emoji} ${label}`);
}

// ── FILTER COSTOS ────────────────────────────────────────────

function filterCostos(value) {
  const rows = document.querySelectorAll('#costosTable tbody tr');
  rows.forEach(row => {
    const estado = row.dataset.estado || '';
    row.style.display = (value === 'todos' || estado === value) ? '' : 'none';
  });
}

// ── FILTER PROVEEDORES ───────────────────────────────────────

function filterProveedores(query) {
  const q = query.toLowerCase().trim();
  const rows = document.querySelectorAll('#provBody tr');
  rows.forEach(row => {
    const text = row.textContent.toLowerCase();
    row.style.display = (!q || text.includes(q)) ? '' : 'none';
  });
}

// ── KEYBOARD SHORTCUTS ───────────────────────────────────────

document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') closeModalDirect();
});

// ── RESIZE: toggle bottomnav display ─────────────────────────

function handleResize() {
  const bottomnav = document.getElementById('bottomnav');
  if (!bottomnav) return;
  bottomnav.style.display = window.innerWidth <= 768 ? 'flex' : 'none';
}

window.addEventListener('resize', handleResize);
document.addEventListener('DOMContentLoaded', handleResize);
