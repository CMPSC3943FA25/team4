// === Persistence keys ===
const STORAGE_KEY = 'visitedStates.v1';
const RATINGS_KEY = 'stateRatings.v1';
let lastClickedState = null; // {id, name}

// State images mapping
const STATE_IMAGES = {
  'AL': 'https://media.istockphoto.com/id/1050674152/photo/tennessee-river-overlook-2.jpg?s=612x612&w=0&k=20&c=3slCteKWER6P_gmpMwIEi1atvl1xcBjK8aG_kzce35Q=',
  'AK': 'https://media.istockphoto.com/id/498296158/photo/juneau-alaska.jpg?s=612x612&w=0&k=20&c=73MXWklww8sOUmMOteSg_raQOo7b6DczRNIOiZO2TFs=',
  'AZ': 'https://media.istockphoto.com/id/1296913338/photo/sonoran-sunset.jpg?s=612x612&w=0&k=20&c=lGXd-vnDmH_bCnR53BNmwxsh3qn8MBLQoh5M926QAbY=',
  'AR': 'https://e6tnk9va8hh.exactdn.com/wp-content/uploads/2022/06/Arkansass-Mountain-Ranges.jpg?strip=all&lossy=1&ssl=1',
  'CA': 'https://media.istockphoto.com/id/1571494714/photo/view-of-golden-gate-bridge.jpg?s=612x612&w=0&k=20&c=VYSXTGOPzkNrXOY_UfNJMksDB8_iMLgF0m7FUuKdqnU=',
  'CO': 'https://media.istockphoto.com/id/2054864236/photo/stunning-sunset-sky-over-colorado-highway-with-san-juan-mountains.jpg?s=612x612&w=0&k=20&c=bfi45pXxakDREjjEOWsXawLC2KNxsNtFmUQ2AW2hacc=',
  'CT': 'https://media.istockphoto.com/id/845985042/photo/autumn-in-new-haven.jpg?s=612x612&w=0&k=20&c=_yl6juMq-0WF8R7ZIcQRf0_yHOlHgf1x6aI8UmvTuqU=',
  'DE': 'https://media.istockphoto.com/id/1097578006/photo/philadelphia-sunset-skyline-refection.jpg?s=612x612&w=0&k=20&c=NATDbNntQPkBm79M9Kifqjz54I0GkLJuKMOcCLYdhN4=',
  'FL': 'https://media.istockphoto.com/id/1137760730/photo/ft-lauderdale-florida-usa.jpg?s=612x612&w=0&k=20&c=BeLX1o7VK39_xshqDCQ_hOxiX32J9Zy2MiCYCzRmKIg=',
  'GA': 'https://media.istockphoto.com/id/531011391/photo/appalachian-mountain-scene-04.jpg?s=612x612&w=0&k=20&c=Hi3elX5bOGqw0JoIP95XGd7saXAFULsmJDPFuSbrCUU=',
  'HI': 'https://media.istockphoto.com/id/487103866/photo/bali-hai.jpg?s=612x612&w=0&k=20&c=HwEljDbrtzfoAnpykfBhr12mxZEX3whY_d4D9QUWVrs=',
  'ID': 'https://media.istockphoto.com/id/1469264510/photo/sawtooth-wilderness.jpg?s=612x612&w=0&k=20&c=QxrUjtqJyZkxgjW3VzTruFJQhFzlN7rUH7AmG27PC3U=',
  'IL': 'https://media.istockphoto.com/id/1063769770/photo/lincoln-park-chicago-illinois-skyline.jpg?s=612x612&w=0&k=20&c=6BTpD10kwjNf8nQqCKrR07BFWsuE9y2hpIbcUVQnXFc=',
  'IN': 'https://media.istockphoto.com/id/1130838092/photo/indiana-central-canal.jpg?s=612x612&w=0&k=20&c=uCOgM29nv7I1jfgDaTuLCBgCsYfbIXsHT_Cl-ZbLj6g=',
  'IA': 'https://media.istockphoto.com/id/183682587/photo/stormy-sky-over-corn-field-in-american-countryside.jpg?s=612x612&w=0&k=20&c=-XROG3gIWrEqh92hxE9w3HYgRndgAGcYHeOjnP0MPw4=',
  'KS': 'https://media.istockphoto.com/id/471847825/photo/dramatic-sunrise-over-the-kansas-tallgrass-prairie-preserve-national-park.jpg?s=612x612&w=0&k=20&c=MS5NND9KIIaFFFMTx3FWY_sx25CaE88GuB3yZ3kgMN0=',
  'KY': 'https://media.istockphoto.com/id/811551654/photo/kentucky-city-and-ohio-river.jpg?s=612x612&w=0&k=20&c=wKj7paiynNxODOfPk8g8KABYswLN-nF8pfVGCWDDM6Q=',
  'LA': 'https://media.istockphoto.com/id/139741508/photo/dusk-on-a-marsh-with-a-low-flying-dragonfly.jpg?s=612x612&w=0&k=20&c=suCJWy2X-VzTfJPD8z4isxuItowNrxAQ6TkaaqW2drE=',
  'ME': 'https://media.istockphoto.com/id/900887330/photo/portland-maine-usa.jpg?s=612x612&w=0&k=20&c=fkHtJ_EYvOE1rLE090Ri1_jG9bTCIcUeUudFa-e3uYI=',
  'MD': 'https://media.istockphoto.com/id/1358593179/photo/national-harbor-maryland.jpg?s=612x612&w=0&k=20&c=bn2oBAyuX2IaRrjkZjUGP564nnrmTAJYum0-JPa2N8s=',
  'MA': 'https://media.istockphoto.com/id/1236234566/photo/weeks-bridge.jpg?s=612x612&w=0&k=20&c=2vr3Mncw4WjR3f2f9ChJANmsHamBfchvO65xlpUu3Nw=',
  'MI': 'https://media.istockphoto.com/id/644828018/photo/sunset-on-the-lake.jpg?s=612x612&w=0&k=20&c=lb-zptfxGz800EjEuRPnOQl677olgctYxo-P5SN6BhI=',
  'MN': 'https://media.istockphoto.com/id/1280015859/photo/blue-lake-with-treeline-in-autumn-color-on-a-sunny-afternoon-in-northern-minnesota.jpg?s=612x612&w=0&k=20&c=smtj8bw1BW3gUI9rrxRnAzQKGWmTyMQYcODgbuWNMbc=',
  'MS': 'https://media.istockphoto.com/id/600381062/photo/sunset-on-the-river.jpg?s=612x612&w=0&k=20&c=Fo5FCS01BqIECVob1ll-j50sgm37LSKviWb71xEGaXI=',
  'MO': 'https://media.istockphoto.com/id/901810698/photo/path-on-wahkon-tah-prairie.jpg?s=612x612&w=0&k=20&c=-AvqLhRhbIQEDhb5LUEfto3P1EMG7_YtWx0YjMxey-U=',
  'MT': 'https://media.istockphoto.com/id/179484804/photo/meadow-in-western-montana.jpg?s=612x612&w=0&k=20&c=int2UIFN73-DL0BjCoY7WMHEeP8Wuwy7ZSs0Mo8qR38=',
  'NE': 'https://media.istockphoto.com/id/1280399693/photo/hazy-sunrise-over-nebraska-sandhills.jpg?s=612x612&w=0&k=20&c=LFAiXG3YABnnynluQ31PmFQLVlGrEzX1VvVL0dYC9WQ=',
  'NV': 'https://media.istockphoto.com/id/1977578779/photo/cholla-cactus-desert-sunset-at-red-rock-canyon-conservation-area.jpg?s=612x612&w=0&k=20&c=4h_JIzQzGtXPw9EEWnobB9Sp6p6fhh7cUM0UsgsfE3M=',
  'NH': 'https://media.istockphoto.com/id/1865645812/photo/aerial-view-of-road-in-colorful-autumn-mountain-forest-during-sunset.jpg?s=612x612&w=0&k=20&c=fvTik_XASV3ehvbz1-Z9T1YX5tMdcMcmHAADBI7O-K4=',
  'NJ': 'https://media.istockphoto.com/id/1452722122/photo/point-pleasant-beach-new-jersey.jpg?s=612x612&w=0&k=20&c=VzKXqg3fifZKlauQwH-8MnR7C2137csz-mIxzSxyRxQ=',
  'NM': 'https://media.istockphoto.com/id/1227277241/photo/sandia-sunset.jpg?s=612x612&w=0&k=20&c=lpSlrIZDu8vvqhWTznOK8y-5307_mbAVWYR6KWXWNzU=',
  'NY': 'https://media.istockphoto.com/id/1454217037/photo/statue-of-liberty-and-new-york-city-skyline-with-manhattan-financial-district-world-trade.jpg?s=612x612&w=0&k=20&c=6V54_qVlDfo59GLEdY2W8DOjLbbHTJ9y4AnJ58a3cis=',
  'NC': 'https://media.istockphoto.com/id/486807560/photo/sunrise-from-jane-bald.jpg?s=612x612&w=0&k=20&c=J9mEiMjs5EPUtiMIUjnz5Nr87m-9WzU5cXBUAfxVVSc=',
  'ND': 'https://media.istockphoto.com/id/177338867/photo/a-landscape-of-a-large-golden-wheat-field-at-sunset.jpg?s=612x612&w=0&k=20&c=UT80XMXrw42qH52S2LUco32oalq9ebshtiJGw59XuWI=',
  'OH': 'https://media.istockphoto.com/id/1453319272/photo/columbus-ohio-usa-skyline-on-the-scioto-river.jpg?s=612x612&w=0&k=20&c=EwKyzKt_0w8qpplNxLuoB9rrmoAQKR5naAhHaY7fYFk=',
  'OK': 'https://media.istockphoto.com/id/639246126/photo/sunset-clouds-wichita-mtns-oklahoma.jpg?s=612x612&w=0&k=20&c=iIov8Wu9T_EsSf0K7hFSHgI8QPahArlybTeBXSc7GpM=',
  'OR': 'Oregon.jpg',
  'PA': 'Pennsylvania.jpg',
  'RI': 'RhodeIsland.jpg',
  'SC': 'SouthCarolina.jpg',
  'SD': 'SouthDakota.jpg',
  'TN': 'Tennessee.jpg',
  'TX': 'Texas.jpg',
  'UT': 'Utah.jpg',
  'VT': 'Vermont.jpg',
  'VA': 'Virginia.jpg',
  'WA': 'Washington.jpg',
  'WV': 'WestVirginia.jpg',
  'WI': 'Wisconsin.jpg',
  'WY': 'Wyoming.jpg'
};

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
    const offsetY = -20;
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

  // favorites and notes
  addFavoritesCounter();
  const notes = getNotesFromStorage();
  Object.keys(notes).forEach(id => updateStateNotesIndicator(id, true));
  const favorites = getFavoritesFromStorage();
  favorites.forEach(id => addStarToState(id));
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

// === Favorites and Notes storage ===
const FAVORITES_KEY = 'favoriteStates.v1';
const NOTES_KEY = 'stateNotes.v1';

function getFavoritesFromStorage() {
  try {
    const raw = localStorage.getItem(FAVORITES_KEY);
    return raw ? new Set(JSON.parse(raw)) : new Set();
  } catch (e) {
    return new Set();
  }
}

function saveFavoritesToStorage(favorites) {
  try {
    localStorage.setItem(FAVORITES_KEY, JSON.stringify(Array.from(favorites)));
  } catch (e) {
    console.error('Failed to save favorites:', e);
  }
}

function getNotesFromStorage() {
  try {
    const raw = localStorage.getItem(NOTES_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch (e) {
    return {};
  }
}

function saveNoteForState(stateId, note) {
  const notes = getNotesFromStorage();
  if (note && note.trim()) {
    notes[stateId] = note.trim();
  } else {
    delete notes[stateId];
  }
  try {
    localStorage.setItem(NOTES_KEY, JSON.stringify(notes));
    updateStateNotesIndicator(stateId, !!notes[stateId]);
    return true;
  } catch (e) {
    console.error('Failed to save note:', e);
    return false;
  }
}

function getNoteForState(stateId) {
  const notes = getNotesFromStorage();
  return notes[stateId] || '';
}

function updateStateNotesIndicator(stateId, hasNotes) {
  const state = document.getElementById(stateId);
  if (!state) return;
  state.classList.toggle('has-notes', !!hasNotes);
}

// Place a star near the top-right of a state path for favorites (for now needs to be moved)
function addStarToState(stateId) {
  const state = document.getElementById(stateId);
  if (!state) return;
  const svg = state.ownerSVGElement || state.closest('svg');
  if (!svg) return;

  const existing = svg.querySelector('#star-' + stateId);
  if (existing) return;

  const bbox = state.getBBox();
  const star = document.createElementNS('http://www.w3.org/2000/svg', 'text');
  star.setAttribute('id', 'star-' + stateId);
  star.setAttribute('x', bbox.x + bbox.width - 10);
  star.setAttribute('y', bbox.y + 15);
  star.setAttribute('class', 'state-favorite-star');
  star.setAttribute('font-size', '12');
  star.textContent = '\u2605'; // ★
  svg.appendChild(star);
}

function removeStarFromState(stateId) {
  const star = document.getElementById('star-' + stateId);
  if (star) star.remove();
}

function updateFavoritesDisplay() {
  const favorites = getFavoritesFromStorage();
  const counter = document.getElementById('favorites-count');
  if (counter) {
    counter.textContent = favorites.size;
  }
}

function handleResetClick() {
  if (!window.confirm('Clear all visited states, favorites, notes, and pins?')) return;

  try {
    localStorage.removeItem(STORAGE_KEY);
    localStorage.removeItem(VISIT_DATES_KEY);
    localStorage.removeItem(FAVORITES_KEY);
    localStorage.removeItem(NOTES_KEY);
    localStorage.removeItem('mapDots');
  } catch (e) {}

  // Reset states
  document.querySelectorAll('.state').forEach(el => {
    el.classList.remove('visited', 'has-notes');
    setVisitedVisual(el, false);
    el.setAttribute('aria-pressed', 'false');
  });

  // Remove any favorite stars
  document.querySelectorAll('.state-favorite-star').forEach(node => node.remove());

  // Reset visit date cache and UI
  visitDateCache = {};
  const { startInput, endInput, display } = getVisitDateElements();
  if (startInput) startInput.value = '';
  if (endInput) endInput.value = '';
  if (display) {
    display.textContent = '';
    display.style.display = 'none';
  }

  // Reset counters
  updateProgress();
  updateFavoritesDisplay();

  //reset rating
  localStorage.removeItem(RATINGS_KEY);
  lastClickedState = null;
  updateLastRatingDisplay();
}

function addFavoritesCounter() {
  if (!document.querySelector('.favorites-counter')) {
    const counter = document.createElement('div');
    counter.className = 'favorites-counter';
    counter.innerHTML = ''
      + '<span class="star-icon">\u2605</span>'
      + '<span><span id="favorites-count">0</span> Favorites</span>'
      + '<button type="button" class="reset-btn" id="reset-data-btn" title="Clear all saved data">Reset</button>';
    document.body.appendChild(counter);

    const resetBtn = counter.querySelector('#reset-data-btn');
    if (resetBtn) {
      resetBtn.addEventListener('click', handleResetClick);
    }
  }
  updateFavoritesDisplay();
}

function toggleFavorite(stateId) {
  const favorites = getFavoritesFromStorage();
  if (favorites.has(stateId)) {
    favorites.delete(stateId);
  } else {
    favorites.add(stateId);
  }
  saveFavoritesToStorage(favorites);
  updateFavoritesDisplay();
  return favorites.has(stateId);
}

function updateCharCount() {
  const textarea = document.getElementById('state-notes');
  const charCount = document.getElementById('char-count');
  if (textarea && charCount) {
    charCount.textContent = textarea.value.length;
  }
}

// Inject favorites and also notes controls into the modal
function updateModalContent(stateId, stateName) {
  const modal = document.querySelector('.modal-content');
  if (!modal) return;
  const extraContainer = modal.querySelector('#extra-features');
  if (!extraContainer) return;

  // Favorite section
  let favoriteSection = modal.querySelector('.favorite-section');
  if (!favoriteSection) {
    favoriteSection = document.createElement('div');
    favoriteSection.className = 'favorite-section';
    favoriteSection.innerHTML = ''
      + '<button class="favorite-btn" id="favorite-btn">'
      + '  <span class="star-icon">\u2606</span>'
      + '  <span>Add to Favorites</span>'
      + '</button>';
    extraContainer.appendChild(favoriteSection);
  }

  const favoriteBtn = favoriteSection.querySelector('#favorite-btn');
  const favorites = getFavoritesFromStorage();
  if (favorites.has(stateId)) {
    favoriteBtn.classList.add('active');
    favoriteBtn.querySelector('.star-icon').textContent = '\u2605';
    favoriteBtn.querySelector('span:last-child').textContent = 'Remove from Favorites';
  } else {
    favoriteBtn.classList.remove('active');
    favoriteBtn.querySelector('.star-icon').textContent = '\u2606';
    favoriteBtn.querySelector('span:last-child').textContent = 'Add to Favorites';
  }

  favoriteBtn.onclick = function () {
    const isFavorite = toggleFavorite(stateId);
    if (isFavorite) {
      this.classList.add('active');
      this.querySelector('.star-icon').textContent = '\u2605';
      this.querySelector('span:last-child').textContent = 'Remove from Favorites';
      addStarToState(stateId);
    } else {
      this.classList.remove('active');
      this.querySelector('.star-icon').textContent = '\u2606';
      this.querySelector('span:last-child').textContent = 'Add to Favorites';
      removeStarFromState(stateId);
    }
  };

  // Notes section
  let notesSection = modal.querySelector('.notes-section');
  if (!notesSection) {
    notesSection = document.createElement('div');
    notesSection.className = 'notes-section';
    notesSection.innerHTML = ''
      + '<label class="notes-label" for="state-notes">Personal Notes</label>'
      + '<textarea id="state-notes" class="notes-textarea" maxlength="500"></textarea>'
      + '<div class="notes-char-count"><span id="char-count">0</span> / 500 characters</div>'
      + '<button class="save-notes-btn" id="save-notes-btn" type="button">Save Notes</button>';
    extraContainer.appendChild(notesSection);
  }

    // Star rating section 
  let ratingSection = modal.querySelector('.rating-section');
  if (!ratingSection) {
    ratingSection = document.createElement('div');
    ratingSection.className = 'rating-section';
    ratingSection.innerHTML = `
      <div class="rating-label">Your rating</div>
      <div class="star-rating">
        <span class="star" data-value="1">☆</span>
        <span class="star" data-value="2">☆</span>
        <span class="star" data-value="3">☆</span>
        <span class="star" data-value="4">☆</span>
        <span class="star" data-value="5">☆</span>
      </div>
    `;
    extraContainer.appendChild(ratingSection);
  }

  const starContainer = ratingSection.querySelector('.star-rating');
  const starElements = starContainer.querySelectorAll('.star');
  let currentRating = getRatingForState(stateId);

  const fillStars = (num) => {
    starElements.forEach(star => {
      if (parseInt(star.dataset.value) <= num) {
        star.textContent = '★';
        star.classList.add('filled');
      } else {
        star.textContent = '☆';
        star.classList.remove('filled');
      }
    });
  };

  fillStars(currentRating);

  // Hover preview
  starContainer.onmouseleave = () => fillStars(currentRating);

  starElements.forEach(star => {
    star.onmouseover = () => fillStars(star.dataset.value);
    star.onclick = () => {
      const clicked = parseInt(star.dataset.value);
      // Clicking the star again clears rating, should work
      currentRating = (currentRating === clicked) ? 0 : clicked;
      saveStateRating(stateId, currentRating);
      fillStars(currentRating);
      updateLastRatingDisplay();
    };
  });

  const notesTextarea = notesSection.querySelector('#state-notes');
  const saveButton = notesSection.querySelector('#save-notes-btn');

  notesTextarea.value = getNoteForState(stateId);
  updateCharCount();
  notesTextarea.oninput = updateCharCount;

  saveButton.onclick = function () {
    const saved = saveNoteForState(stateId, notesTextarea.value);
    if (saved) {
      this.textContent = 'Saved!';
      this.classList.add('saved');
      setTimeout(() => {
        this.textContent = 'Save Notes';
        this.classList.remove('saved');
      }, 1500);
    }
  };
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
  const stateImageEl = document.getElementById('modal-state-image');
  const toggleEl = document.getElementById('modal-visited-toggle');
  
  if (!modal || !modalContent || !stateNameEl || !toggleEl) return;
  
  const stateName = stateElement.getAttribute('data-state-name') || 
                   stateElement.getAttribute('data-name') || 
                   stateElement.id || 
                   'Unknown State';
  
  stateNameEl.textContent = stateName;
  lastClickedState = { id: stateElement.id, name: stateName }; //added for star system
  updateLastRatingDisplay(); //added for star system

  // Set state image if available
  const imagePath = STATE_IMAGES[stateElement.id];
  const imageContainer = modalContent.querySelector('.modal-image-container');
  
  if (stateImageEl) {
    if (imagePath) {
      // Show image container
      if (imageContainer) {
        imageContainer.style.display = 'block';
      }
      // Set and show image
      stateImageEl.src = imagePath;
      stateImageEl.alt = `${stateName} landscape`;
      stateImageEl.style.display = 'block';
      // Handle image load errors
      stateImageEl.onerror = function() {
        console.warn(`Failed to load image for ${stateElement.id}: ${imagePath}`);
        this.style.display = 'none';
      };
      stateImageEl.onload = function() {
        this.style.display = 'block';
      };
    } else {
      // Hide image container if no image path
      if (imageContainer) {
        imageContainer.style.display = 'none';
      }
      stateImageEl.style.display = 'none';
    }
  }

  // Inject favorites + notes UI
  updateModalContent(stateElement.id, stateName);
  
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
    
    const modalWidth = modalContent.offsetWidth;
    const modalHeight = modalContent.offsetHeight;
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;
    const edgePadding = 20;
    const spacing = 20;
    
    let left, top;
    
    const isOnLeftSide = screenPoint.x < viewportWidth / 2;
    
    if (isOnLeftSide) {
      left = screenPoint.x + spacing;
    } else {
      left = screenPoint.x - modalWidth - spacing;
    }
    
    top = screenPoint.y - modalHeight / 2;
    
    if (left < edgePadding) {
      left = edgePadding;
    } else if (left + modalWidth > viewportWidth - edgePadding) {
      left = viewportWidth - modalWidth - edgePadding;
    }
    
    if (top < edgePadding) {
      top = edgePadding;
    } else if (top + modalHeight > viewportHeight - edgePadding) {
      top = viewportHeight - modalHeight - edgePadding;
    }
    
    if (top < viewportHeight / 2 - modalHeight / 2) {
      top = Math.max(edgePadding, viewportHeight / 2 - modalHeight / 2);
    }
    
    modalContent.style.left = left + 'px';
    modalContent.style.top = top + 'px';
  }, 0);
}

function closeStateModal() {
  const modal = document.getElementById('state-modal');
  if (modal) {
    modal.classList.add('hidden');
    delete modal._stateElement;
    delete modal.dataset.stateId;
  }
}

//---------state rating system----------
function getStateRatings() {
  try {
    const raw = localStorage.getItem(RATINGS_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw);
    return parsed && typeof parsed === 'object' ? parsed : {};
  } catch (e) {
    return {};
  }
}

function getRatingForState(stateId) {
  return getStateRatings()[stateId] || 0;
}

function saveStateRating(stateId, rating) {
  const ratings = getStateRatings();
  if (rating > 0) {
    ratings[stateId] = rating;
  } else {
    delete ratings[stateId];
  }
  try {
    localStorage.setItem(RATINGS_KEY, JSON.stringify(ratings));
  } catch (e) {
    console.error(e);
  }
}

function updateLastRatingDisplay() {
  const el = document.getElementById('last-state-rating');
  if (!lastClickedState) {
    el.innerHTML = '';
    return;
  }
  const rating = getRatingForState(lastClickedState.id);
  let stars = '';
  for (let i = 1; i <= 5; i++) {
    if (i <= rating) stars += '<span class="filled-star">★</span>';
    else stars += '<span class="empty-star">☆</span>';
  }
  el.innerHTML = `<strong>${lastClickedState.name}</strong> ${stars}`;
} //---------end of state rating----------


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
