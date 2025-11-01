// === Persistence keys ===
const STORAGE_KEY = 'visitedStates.v1';

function getVisitedFromStorage() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return new Set();
    const arr = JSON.parse(raw);
    return new Set(Array.isArray(arr) ? arr : []);
  } catch (e) {
    return new Set();
  }
}

function saveVisitedToStorage() {
  const ids = Array.from(document.querySelectorAll('.state.visited'))
    .map(el => el.id)
    .filter(Boolean);
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(ids));
  } catch (e) {}
}

// === Visual helpers (force inline fill to win over SVG inline styles) ===
const FILL_DEFAULT = '#e0e0e0';
const FILL_VISITED = '#2ecc71';
const STROKE_VISITED = '#2e8b57';

function setVisitedVisual(el, isVisited) {
  if (!el) return;
  if (isVisited) {
    el.style.fill = FILL_VISITED;
    el.style.stroke = STROKE_VISITED;
  } else {
    el.style.fill = FILL_DEFAULT;
    el.style.stroke = '#777';
  }
}

// === Percentage calculation ===
function calculatePercentage() {
  const totalStates = 50;
  const visitedStates = document.querySelectorAll('.state.visited').length;
  const percentage = Math.round((visitedStates / totalStates) * 100);
  return { percentage, visitedCount: visitedStates };
}

function updateProgress() {
  const { percentage, visitedCount } = calculatePercentage();
  const percentageEl = document.getElementById('percentage-number');
  const countEl = document.getElementById('states-count');
  if (percentageEl) percentageEl.textContent = percentage;
  if (countEl) countEl.textContent = visitedCount;
}

// === Tooltips ===
function addStateLabels() {
  const states = document.querySelectorAll('.state');
  let tooltip = null;

  states.forEach(state => {
    const name = state.getAttribute('data-state-name') || state.getAttribute('data-name') || state.id || 'Unknown';

    state.addEventListener('mouseenter', function (e) {
      tooltip = document.createElement('div');
      tooltip.className = 'state-label';
      tooltip.textContent = name;
      document.body.appendChild(tooltip);
      positionTooltip(e, tooltip);
      tooltip.style.display = 'block';
    });

    state.addEventListener('mousemove', function (e) {
      if (tooltip) positionTooltip(e, tooltip);
    });

    state.addEventListener('mouseleave', function () {
      if (tooltip) {
        tooltip.remove();
        tooltip = null;
      }
    });
  });

  function positionTooltip(e, element) {
    const offsetX = 10;
    const offsetY = -30;
    const left = e.pageX + offsetX;
    const top = e.pageY + offsetY;
    element.style.left = left + 'px';
    element.style.top = top + 'px';
  }
}

// === Accessibility ===
function enhanceAccessibility() {
  document.querySelectorAll('.state').forEach(el => {
    el.setAttribute('tabindex', '0');
    el.setAttribute('role', 'button');
    el.setAttribute('aria-pressed', el.classList.contains('visited') ? 'true' : 'false');
    el.addEventListener('keydown', (ev) => {
      if (ev.key === 'Enter' || ev.key === ' ') {
        ev.preventDefault();
        toggleState(el);
      }
    });
  });
}

// === Extra Helpers ===
function toggleState(el) {
  const nowVisited = !el.classList.contains('visited');
  el.classList.toggle('visited', nowVisited);
  setVisitedVisual(el, nowVisited);
  el.setAttribute('aria-pressed', nowVisited ? 'true' : 'false');
  updateProgress();
  saveVisitedToStorage();
}

// Event delegation for clicks (works for inline SVGs)
function initDelegatedClickHandler() {
  document.addEventListener('click', (e) => {
    const target = e.target.closest('.state');
    if (target) {
      toggleState(target);
    }
  });
}

// === Restore saves ===
function restoreVisited() {
  const set = getVisitedFromStorage();
  const states = document.querySelectorAll('.state');
  states.forEach(el => {
    const isVisited = set.has(el.id);
    if (isVisited) {
      el.classList.add('visited');
    } else {
      el.classList.remove('visited');
    }
    // Force inline fill so we override any existing inline style on paths
    setVisitedVisual(el, isVisited);
  });
}

// === Init ===
document.addEventListener('DOMContentLoaded', function () {
  addStateAbbrevLabels();
  restoreVisited();
  addStateLabels();
  enhanceAccessibility();
  initDelegatedClickHandler();
  updateProgress();
});


// === Always-visible state abbreviation labels ===
function addStateAbbrevLabels() {
  // Find any SVG that contains our states; use the first state's owner SVG
  const states = Array.from(document.querySelectorAll('.state'));
  if (states.length === 0) return;
  const svg = states[0].ownerSVGElement || states[0].closest('svg');
  if (!svg) return;

  // Remove old labels group if exists (for hot reloads)
  const old = svg.querySelector('#state-labels');
  if (old) old.remove();

  const g = document.createElementNS('http://www.w3.org/2000/svg', 'g');
  g.setAttribute('id', 'state-labels');
  svg.appendChild(g);

  const offsets = {
    RI: {x: 8, y: -8},
    DE: {x: 8, y: -8},
    CT: {x: 8, y: -8},
    NJ: {x: 8, y: -8},
    MD: {x: 8, y: -8},
    DC: {x: 8, y: -8}
  };
  states.forEach(st => {
    if (!st.id) return;
    const bb = st.getBBox();
    const cx = bb.x + bb.width / 2;
    const cy = bb.y + bb.height / 2;

    const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    text.setAttribute('x', cx);
    text.setAttribute('y', cy);
    const off = offsets[st.id];
    if (off) text.setAttribute('transform', `translate(${off.x}, ${off.y})`);
    text.setAttribute('data-state', st.id);
    text.setAttribute('text-anchor', 'middle');
    text.setAttribute('dominant-baseline', 'middle');
    text.setAttribute('class', 'state-abbrev');
    text.textContent = st.id; // use path id as abbreviation (e.g., 'TX')

    g.appendChild(text);
  });
}

// === Always-visible state abbreviation labels (with NE offsets) ===
function addStateAbbrevLabels() {
  const states = Array.from(document.querySelectorAll('.state'));
  if (states.length === 0) return;
  const svg = states[0].ownerSVGElement || states[0].closest('svg');
  if (!svg) return;

  // remove old group
  const old = svg.querySelector('#state-labels');
  if (old) old.remove();

  const g = document.createElementNS('http://www.w3.org/2000/svg', 'g');
  g.setAttribute('id', 'state-labels');
  svg.appendChild(g);

  // Manual offsets (pixels in SVG coords) for tiny/clustered states
  const offsets = {
    DC: {x: 20, y: -10},
    DE: {x: 16, y: -6},
    RI: {x: 18, y: -8},
    CT: {x: 12, y: -10},
    NJ: {x: 14, y: -8},
    MD: {x: 18, y: -6},
    MA: {x: 8, y: -10},
    VT: {x: -8, y: -10},
    NH: {x: 10, y: -12},
    ME: {x: 4, y: -8}
  };

  states.forEach(st => {
    if (!st.id) return;
    const bb = st.getBBox();
    let cx = bb.x + bb.width / 2;
    let cy = bb.y + bb.height / 2;

    const off = offsets[st.id];
    if (off) { cx += off.x; cy += off.y; }

    const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    text.setAttribute('x', cx);
    text.setAttribute('y', cy);
    text.setAttribute('text-anchor', 'middle');
    text.setAttribute('dominant-baseline', 'middle');
    text.setAttribute('class', 'state-abbrev');
    text.setAttribute('data-state', st.id);
    text.textContent = st.id;
    g.appendChild(text);
  });
}
