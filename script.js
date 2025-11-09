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

const VISIT_DATES_KEY = 'visitDates.v1';
let visitDateCache = loadVisitDatesFromStorage();

function loadVisitDatesFromStorage() {
  try {
    const raw = localStorage.getItem(VISIT_DATES_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw);
    return parsed && typeof parsed === 'object' ? parsed : {};
  } catch (e) {
    return {};
  }
}

function saveVisitDatesToStorage() {
  try {
    localStorage.setItem(VISIT_DATES_KEY, JSON.stringify(visitDateCache));
  } catch (e) {}
}

function setVisitDatesForState(stateId, start, end) {
  if (!stateId) return;
  if (!start && !end) {
    delete visitDateCache[stateId];
  } else {
    visitDateCache[stateId] = { start, end };
  }
  saveVisitDatesToStorage();
}

function getVisitDatesForState(stateId) {
  return visitDateCache[stateId] || null;
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
        openStateModal(el);
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
  let clickTimer = null;
  const DOUBLE_CLICK_DELAY = 300;
  document.addEventListener('click', (e) => {
    const target = e.target.closest('.state');
    if (target) {
      if (clickTimer) {
        clearTimeout(clickTimer);
        clickTimer = null;
        return;
      }
      
      clickTimer = setTimeout(() => {
        openStateModal(target);
        clickTimer = null;
      }, DOUBLE_CLICK_DELAY);
    }
  });
  
  document.addEventListener('dblclick', (e) => {
    if (clickTimer) {
      clearTimeout(clickTimer);
      clickTimer = null;
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
    DC: {x: 0, y: 8},
    DE: {x: 0, y: 14},
    RI: {x: -2, y: 14},
    CT: {x: -6, y: 4},
    NJ: {x: -6, y: 0},
    MD: {x: 0, y: 4},
    MA: {x: 0, y: 0},
    VT: {x: 0, y: -10},
    NH: {x: -2, y: 10},
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

function getVisitDateElements() {
  const modal = document.getElementById('state-modal');
  return {
    section: modal?.querySelector('#visit-date-section') || null,
    startInput: modal?.querySelector('#visit-start-date') || null,
    endInput: modal?.querySelector('#visit-end-date') || null,
    display: modal?.querySelector('#visit-date-display') || null
  };
}

function setVisitDateSectionVisibility(isVisible) {
  const { section } = getVisitDateElements();
  if (section) {
    section.style.display = isVisible ? 'block' : 'none';
  }
}

function formatVisitDateForDisplay(value) {
  if (!value) return '';
  const parts = value.split('-');
  if (parts.length !== 3) return value;
  const [year, month, day] = parts;
  const monthNumber = parseInt(month, 10);
  const dayNumber = parseInt(day, 10);
  if (!year || Number.isNaN(monthNumber) || Number.isNaN(dayNumber)) return value;
  return `${monthNumber}/${dayNumber}/${year}`;
}

function buildVisitDateLabel(startDate, endDate) {
  if (!startDate && !endDate) return '';
  const startText = startDate ? formatVisitDateForDisplay(startDate) : '...';
  const endText = endDate ? formatVisitDateForDisplay(endDate) : '...';
  return `Visited ${startText} - ${endText}`;
}

function updateVisitDateDisplay() {
  const { startInput, endInput, display } = getVisitDateElements();
  if (!display || !startInput || !endInput) return;
  const text = buildVisitDateLabel(startInput.value, endInput.value);
  display.textContent = text;
  display.style.display = text ? '' : 'none';
}

function hydrateVisitDateInputs(stateId) {
  const { startInput, endInput } = getVisitDateElements();
  if (!startInput || !endInput) return;
  const stored = getVisitDatesForState(stateId) || {};
  startInput.value = stored.start || '';
  endInput.value = stored.end || '';
  updateVisitDateDisplay();
}

function openStateModal(stateElement) {
  const modal = document.getElementById('state-modal');
  const modalContent = modal?.querySelector('.modal-content');
  const stateNameEl = document.getElementById('modal-state-name');
  const toggleEl = document.getElementById('modal-visited-toggle');
  
  if (!modal || !modalContent || !stateNameEl || !toggleEl) return;
  
  const stateName = stateElement.getAttribute('data-state-name') || 
                   stateElement.getAttribute('data-name') || 
                   stateElement.id || 
                   'Unknown State';
  
  stateNameEl.textContent = stateName;
  
  const isVisited = stateElement.classList.contains('visited');
  toggleEl.checked = isVisited;
  
  modal.dataset.stateId = stateElement.id;
  modal._stateElement = stateElement;
  
  modal.classList.remove('hidden');

  setVisitDateSectionVisibility(isVisited);
  hydrateVisitDateInputs(stateElement.id);
  
  setTimeout(() => {
    const svg = stateElement.ownerSVGElement || stateElement.closest('svg');
    if (!svg) return;
    
    const bbox = stateElement.getBBox();
    const centerX = bbox.x + bbox.width / 2;
    const centerY = bbox.y + bbox.height / 2;
    
    const svgPoint = svg.createSVGPoint();
    svgPoint.x = centerX;
    svgPoint.y = centerY;
    const screenPoint = svgPoint.matrixTransform(svg.getScreenCTM());
    
    const isOnLeftSide = screenPoint.x < window.innerWidth / 2;
    const spacing = 20;
    
    if (isOnLeftSide) {
      modalContent.style.left = (screenPoint.x + spacing) + 'px';
    } else {
      modalContent.style.left = (screenPoint.x - modalContent.offsetWidth - spacing) + 'px';
    }
    
    modalContent.style.top = (screenPoint.y - modalContent.offsetHeight / 2) + 'px';
  }, 0);
}

setTimeout(() => {
    const svg = stateElement.ownerSVGElement || stateElement.closest('svg');
    if (!svg) return;
    
    const bbox = stateElement.getBBox();
    const centerX = bbox.x + bbox.width / 2;
    const centerY = bbox.y + bbox.height / 2;
    
    const svgPoint = svg.createSVGPoint();
    svgPoint.x = centerX;
    svgPoint.y = centerY;
    const screenPoint = svgPoint.matrixTransform(svg.getScreenCTM());
    
    const isOnLeftSide = screenPoint.x < window.innerWidth / 2;
    const spacing = 20;
    
    if (isOnLeftSide) {
      modalContent.style.left = (screenPoint.x + spacing) + 'px';
    } else {
      modalContent.style.left = (screenPoint.x - modalContent.offsetWidth - spacing) + 'px';
    }
    
    modalContent.style.top = (screenPoint.y - modalContent.offsetHeight / 2) + 'px';
  }, 0);

function closeStateModal() {
  const modal = document.getElementById('state-modal');
  if (modal) {
    modal.classList.add('hidden');
    delete modal._stateElement;
    delete modal.dataset.stateId;
  }
}

function initModalListeners() {
  const modal = document.getElementById('state-modal');
  const closeBtn = modal?.querySelector('.close-btn');
  const toggleEl = document.getElementById('modal-visited-toggle');
  const startInput = document.getElementById('visit-start-date');
  const endInput = document.getElementById('visit-end-date');
  
  if (closeBtn) {
    closeBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      closeStateModal();
    });
  }

  const handleDateChange = () => {
    const activeModal = document.getElementById('state-modal');
    const stateId = activeModal?.dataset.stateId;
    if (!stateId) return;
    const startValue = startInput?.value || '';
    const endValue = endInput?.value || '';
    setVisitDatesForState(stateId, startValue, endValue);
    updateVisitDateDisplay();
  };
  
  startInput?.addEventListener('change', handleDateChange);
  startInput?.addEventListener('input', handleDateChange);
  endInput?.addEventListener('change', handleDateChange);
  endInput?.addEventListener('input', handleDateChange);
  
  if (modal) {
    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        closeStateModal();
      }
    });
  }
  
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal && !modal.classList.contains('hidden')) {
      closeStateModal();
    }
  });
  
  if (toggleEl) {
    toggleEl.addEventListener('change', (e) => {
      const activeModal = document.getElementById('state-modal');
      const stateElement = activeModal?._stateElement;
      
      if (!stateElement) return;
        const shouldBeVisited = e.target.checked;
        const currentlyVisited = stateElement.classList.contains('visited');
        
        if (shouldBeVisited !== currentlyVisited) {
          toggleState(stateElement);
          toggleEl.checked = stateElement.classList.contains('visited');
        }

         setVisitDateSectionVisibility(toggleEl.checked);
      if (toggleEl.checked) {
        hydrateVisitDateInputs(stateElement.id);
        const { startInput: focusStart } = getVisitDateElements();
        focusStart?.focus();
      } else {
        updateVisitDateDisplay();
      }
    });
  }
}

document.addEventListener('DOMContentLoaded', function() {
  initModalListeners();
});
