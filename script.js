const $ = (s, r=document) => r.querySelector(s);
const $$ = (s, r=document) => Array.from(r.querySelectorAll(s));

// Year
$('#year').textContent = new Date().getFullYear();

// Markdown renderer setup
if (typeof marked !== 'undefined') {
  if (marked.setOptions) {
    marked.setOptions({ breaks: true, gfm: true });
  }
}

// Load decks from JSON and build navbar
const state = { decks: [], current: null, expanded: localStorage.getItem('deckExpanded') === 'true' };

const getParam = (k) => new URLSearchParams(location.search).get(k);
const setParam = (k, v) => {
  const u = new URL(location.href);
  if (v) u.searchParams.set(k, v); else u.searchParams.delete(k);
  history.replaceState({}, '', u);
};

async function loadDecks() {
  try {
    const res = await fetch('./expanded-decks/decks.json', { cache: 'no-cache' });
    const data = await res.json();
    state.decks = data.decks || [];
    renderDeckNavbar();
    const initial = getParam('deck');
    if (initial) {
      // Vérifier que le deck existe et est visible
      const deck = state.decks.find(d => d.id === initial && d.show !== false);
      if (deck) {
        selectDeck(initial);
      } else {
        showDefaultMessage();
      }
    } else {
      showDefaultMessage();
    }
  } catch (e) {
    console.error(e);
    $('#deckScroller').innerHTML = '<div class="text-red-300">Error loading decks.json</div>';
  }
}

function deckIcon(img, alt) {
  return `<span class="relative flex items-center justify-center w-10 h-10">
    <img src="${img}" alt="${alt}" class="max-w-full max-h-full object-contain drop-shadow"/>
  </span>`;
}

function buildCreditSection(credit) {
  const roleIcon = credit.role ? getRoleIcon(credit.role) : '';
  const description = credit.description ? `<p class="credit-description">${credit.description}</p>` : '';

  return `
    <div class="credits-section">
      <div class="credit-item">
        <img src="${credit.avatar}" alt="${credit.name}" class="credit-avatar">
        <div class="credit-info">
          <div class="credit-header">
            <span class="credit-name">${credit.name}</span>
            ${roleIcon}
          </div>
          ${description}
        </div>
        <a href="${credit.link}" class="credit-link" target="_blank">View Profile</a>
      </div>
    </div>
  `;
}

function getRoleIcon(role) {
  const icons = {
    'owner': `<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"
            fill="url(#crownGradient)" stroke="rgba(139,92,246,0.8)" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
      <defs>
        <linearGradient id="crownGradient" x1="2" y1="2" x2="22" y2="22" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stop-color="#8B5CF6"/>
          <stop offset="100%" stop-color="#22D3EE"/>
        </linearGradient>
      </defs>
    </svg>`,
    'contributor': `<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M12 20H21M3.00003 20H5.67457C6.1637 20 6.40827 20 6.63846 19.9447C6.84254 19.8957 7.03763 19.8149 7.2166 19.7053C7.41843 19.5816 7.59139 19.4086 7.93732 19.0627L19.5001 7.49998C20.3285 6.67156 20.3285 5.32841 19.5001 4.49998C18.6716 3.67156 17.3285 3.67156 16.5001 4.49998L4.93729 16.0627C4.59139 16.4086 4.41843 16.5816 4.29475 16.7834C4.18509 16.9624 4.10428 17.1574 4.05529 17.3615C4.00003 17.5917 4.00003 17.8363 4.00003 18.3254V20Z"
            stroke="url(#penGradient)" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>
      <defs>
        <linearGradient id="penGradient" x1="3" y1="4" x2="21" y2="20" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stop-color="#8B5CF6"/>
          <stop offset="100%" stop-color="#22D3EE"/>
        </linearGradient>
      </defs>
    </svg>`,
    'translator': `<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="12" cy="12" r="10" stroke="url(#globeGradient)" stroke-width="1.8"/>
      <path d="M2 12H22M12 2C14.5013 4.73835 15.9228 8.29203 16 12C15.9228 15.708 14.5013 19.2616 12 22C9.49872 19.2616 8.07725 15.708 8 12C8.07725 8.29203 9.49872 4.73835 12 2Z"
            stroke="url(#globeGradient)" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>
      <defs>
        <linearGradient id="globeGradient" x1="2" y1="2" x2="22" y2="22" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stop-color="#8B5CF6"/>
          <stop offset="100%" stop-color="#22D3EE"/>
        </linearGradient>
      </defs>
    </svg>`,
    'editor': `<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M14 3V7C14 7.55228 14.4477 8 15 8H19M14 3H7C5.89543 3 5 3.89543 5 5V19C5 20.1046 5.89543 21 7 21H17C18.1046 21 19 20.1046 19 19V8M14 3L19 8M9 13H15M9 17H15"
            stroke="url(#docGradient)" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>
      <defs>
        <linearGradient id="docGradient" x1="5" y1="3" x2="19" y2="21" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stop-color="#8B5CF6"/>
          <stop offset="100%" stop-color="#22D3EE"/>
        </linearGradient>
      </defs>
    </svg>`
  };
  const icon = icons[role] || icons['contributor'];
  return `<span class="credit-role-icon" title="${role}">${icon}</span>`;
}

function renderDeckNavbar() {
  const scroller = $('#deckScroller');
  const icon = $('#expandIcon');

  // Update classes based on expanded state
  if (state.expanded) {
    scroller.classList.remove('overflow-x-auto');
    scroller.classList.add('flex-wrap');
    if (icon) icon.style.transform = 'rotate(180deg)';
  } else {
    scroller.classList.add('overflow-x-auto');
    scroller.classList.remove('flex-wrap');
    if (icon) icon.style.transform = 'rotate(0deg)';
  }

  scroller.innerHTML = '';
  state.decks.forEach(d => {
    // Masquer les decks avec show: false
    if (d.show === false) return;

    const btn = document.createElement('button');
    btn.className = 'group relative shrink-0 px-4 py-4 rounded-xl border border-white/10 bg-gradient-to-br from-white/5 to-white/[0.02] hover:from-white/10 hover:to-white/5 hover:border-accent-500/30 hover:shadow-glow transition-all duration-300 text-left';
    btn.setAttribute('data-id', d.id);
    const icons = [d.icon1, d.icon2].filter(Boolean).map((src,i)=> deckIcon(src, d.name)).join('');
    let checkmark = '';
    if (d.check === true) {
      checkmark = `<svg class="absolute -top-1 -right-1 w-5 h-5 text-green-400 bg-base-900 rounded-full" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"/></svg>`;
    } else if (d.check === 'wip') {
      checkmark = `<svg class="absolute -top-1 -right-1 w-5 h-5 text-yellow-400 bg-base-900 rounded-full" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clip-rule="evenodd"/></svg>`;
    }
    btn.innerHTML = `
      ${checkmark}
      <div class="flex items-center gap-3">
        <div class="flex -space-x-2">${icons}</div>
        <span class="text-sm font-semibold group-hover:text-accent-300 transition whitespace-nowrap">${d.name}</span>
      </div>`;
    btn.addEventListener('click', () => selectDeck(d.id));
    scroller.appendChild(btn);
  });
}

function showDefaultMessage() {
  const art = $('#deckContent');
  art.innerHTML = `
    <div class="flex items-center justify-center h-full">
      <div class="text-center p-8">
        <svg class="w-16 h-16 mx-auto mb-4 text-white/30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"/>
        </svg>
        <h2 class="text-2xl font-bold text-white/70 mb-2">Welcome to HemeraTCG Expanded Decks</h2>
        <p class="text-white/50">Click on a deck to show information</p>
      </div>
    </div>
  `;
}

async function selectDeck(id) {
  console.log('selectDeck called with id:', id);
  const deck = state.decks.find(x => x.id === id);
  console.log('Found deck:', deck);
  if (!deck) return;
  state.current = id;
  setParam('deck', id);
  $$('[data-id]', $('#deckScroller')).forEach(el => {
    const isActive = el.getAttribute('data-id') === id;
    el.classList.toggle('ring-1', isActive);
    el.classList.toggle('ring-inset', isActive);
    el.classList.toggle('ring-accent-500', isActive);
    el.classList.toggle('shadow-glow-lg', isActive);
    el.classList.toggle('bg-accent-500/10', isActive);
    el.classList.toggle('border-accent-500/40', isActive);
  });
  const art = $('#deckContent');
  console.log('deckContent element:', art);
  art.innerHTML = '<div class="p-4 text-white/70">Loading guide…</div>';
  try {
    const url = `./expanded-decks/${deck.file}`;
    console.log('Fetching:', url);
    const res = await fetch(url, { cache: 'no-cache' });
    console.log('Fetch response:', res.status, res.ok);
    if (!res.ok) throw new Error('404');
    const md = await res.text();
    console.log('Markdown loaded, length:', md.length);
    console.log('Marked available?', typeof marked !== 'undefined');

    // Support both marked() and marked.parse() APIs
    let html;
    if (typeof marked !== 'undefined') {
      if (typeof marked.parse === 'function') {
        console.log('Using marked.parse()');
        html = marked.parse(md);
      } else if (typeof marked === 'function') {
        console.log('Using marked()');
        html = marked(md);
      } else {
        throw new Error('Marked library not loaded correctly');
      }
    } else {
      throw new Error('Marked library not found');
    }

    console.log('HTML generated, length:', html.length);
    art.innerHTML = html;
    console.log('HTML inserted into DOM');

    // Inject author credits from JSON after the first image
    if (deck.authorCredit) {
      const firstImg = art.querySelector('img');
      if (firstImg && firstImg.parentElement) {
        const creditsHtml = buildCreditSection(deck.authorCredit);
        firstImg.parentElement.insertAdjacentHTML('afterend', creditsHtml);
      }
    }

    // Enhance links
    $$('a', art).forEach(a => { a.classList.add('text-accent-300','hover:text-white','underline','decoration-accent-500/50'); a.setAttribute('target','_blank'); a.setAttribute('rel','noreferrer'); });
    // Prose tuning
    art.classList.add('prose','prose-invert','max-w-none');
    console.log('Deck loaded successfully');
  } catch (e) {
    console.error('Error loading deck:', e);
    art.innerHTML = `<div class="p-4 text-red-300">Unable to load this deck's markdown guide. Error: ${e.message}</div>`;
  }
}

// Toggle expand/collapse
$('#expandToggle')?.addEventListener('click', () => {
  state.expanded = !state.expanded;
  localStorage.setItem('deckExpanded', state.expanded);
  renderDeckNavbar();
  // Update active state after re-render
  if (state.current) {
    $$('[data-id]', $('#deckScroller')).forEach(el => {
      const isActive = el.getAttribute('data-id') === state.current;
      el.classList.toggle('ring-1', isActive);
      el.classList.toggle('ring-inset', isActive);
      el.classList.toggle('ring-accent-500', isActive);
      el.classList.toggle('shadow-glow-lg', isActive);
      el.classList.toggle('bg-accent-500/10', isActive);
      el.classList.toggle('border-accent-500/40', isActive);
    });
  }
});

loadDecks();
