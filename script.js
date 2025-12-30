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

// Cache busting: add timestamp to image URLs
// The timestamp is updated each time the page loads, forcing fresh images
const CACHE_VERSION = Date.now();

function cacheBustUrl(url) {
  if (!url) return url;
  const separator = url.includes('?') ? '&' : '?';
  return `${url}${separator}v=${CACHE_VERSION}`;
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
  const imgUrl = cacheBustUrl(img);
  return `<span class="relative flex items-center justify-center w-10 h-10">
    <img src="${imgUrl}" alt="${alt}" class="max-w-full max-h-full object-contain drop-shadow"/>
  </span>`;
}

function buildCreditSection(credit) {
  const roleIcon = credit.role ? getRoleIcon(credit.role) : '';
  const description = credit.description ? `<p class="credit-description">${credit.description}</p>` : '';
  const avatarUrl = cacheBustUrl(credit.avatar);

  return `
    <div class="credits-section">
      <div class="credit-item">
        <img src="${avatarUrl}" alt="${credit.name}" class="credit-avatar">
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
  const roleNames = {
    'owner': 'Owner',
    'honor': 'Honor Contributor',
    'contributor': 'Contributor',
    'admin': 'Administrator'
  };

  const icons = {
    'owner': `<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M12 2L14 7L19 8L15.5 11.5L16 17L12 14.5L8 17L8.5 11.5L5 8L10 7L12 2Z"
            fill="#FCD34D" stroke="#F59E0B" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"/>
      <path d="M7 16H17C17 16 18 16 18 17V20C18 21 17 21 17 21H7C7 21 6 21 6 20V17C6 16 7 16 7 16Z"
            fill="#FBBF24" stroke="#F59E0B" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"/>
      <circle cx="12" cy="18" r="1" fill="#F59E0B"/>
      <circle cx="9" cy="18" r="0.8" fill="#F59E0B"/>
      <circle cx="15" cy="18" r="0.8" fill="#F59E0B"/>
    </svg>`,
    'honor': `<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M12 20H21M3.00003 20H5.67457C6.1637 20 6.40827 20 6.63846 19.9447C6.84254 19.8957 7.03763 19.8149 7.2166 19.7053C7.41843 19.5816 7.59139 19.4086 7.93732 19.0627L19.5001 7.49998C20.3285 6.67156 20.3285 5.32841 19.5001 4.49998C18.6716 3.67156 17.3285 3.67156 16.5001 4.49998L4.93729 16.0627C4.59139 16.4086 4.41843 16.5816 4.29475 16.7834C4.18509 16.9624 4.10428 17.1574 4.05529 17.3615C4.00003 17.5917 4.00003 17.8363 4.00003 18.3254V20Z"
            stroke="#FCD34D" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>
    </svg>`,
    'contributor': `<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M12 20H21M3.00003 20H5.67457C6.1637 20 6.40827 20 6.63846 19.9447C6.84254 19.8957 7.03763 19.8149 7.2166 19.7053C7.41843 19.5816 7.59139 19.4086 7.93732 19.0627L19.5001 7.49998C20.3285 6.67156 20.3285 5.32841 19.5001 4.49998C18.6716 3.67156 17.3285 3.67156 16.5001 4.49998L4.93729 16.0627C4.59139 16.4086 4.41843 16.5816 4.29475 16.7834C4.18509 16.9624 4.10428 17.1574 4.05529 17.3615C4.00003 17.5917 4.00003 17.8363 4.00003 18.3254V20Z"
            stroke="#60A5FA" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>
    </svg>`,
    'admin': `<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M12 22C12 22 20 18 20 12V5L12 2L4 5V12C4 18 12 22 12 22Z"
            fill="#FCA5A5" stroke="#EF4444" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>
    </svg>`
  };

  const icon = icons[role] || icons['contributor'];
  const roleName = roleNames[role] || 'Contributor';
  return `<span class="credit-role-icon" title="${roleName}">${icon}</span>`;
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
  const deck = state.decks.find(x => x.id === id);
  if (!deck) return;

  state.current = id;
  setParam('deck', id);
  updateActiveButton(id);

  const art = $('#deckContent');
  art.innerHTML = '<div class="p-4 text-white/70">Loading guide…</div>';

  try {
    const url = `./expanded-decks/${deck.file}`;
    const res = await fetch(url, { cache: 'no-cache' });
    if (!res.ok) throw new Error('404');

    const md = await res.text();
    const html = typeof marked.parse === 'function' ? marked.parse(md) : marked(md);

    art.innerHTML = html;

    // Apply cache busting to all images in the markdown
    $$('img', art).forEach(img => {
      if (img.src && !img.src.includes('?v=')) {
        const url = new URL(img.src);
        img.src = cacheBustUrl(url.pathname + url.search);
      }
    });

    // Inject author credits after the first image
    if (deck.authorCredit) {
      const firstImg = art.querySelector('img');
      if (firstImg?.parentElement) {
        firstImg.parentElement.insertAdjacentHTML('afterend', buildCreditSection(deck.authorCredit));
      }
    }

    // Enhance links
    $$('a', art).forEach(a => {
      a.classList.add('text-accent-300', 'hover:text-white', 'underline', 'decoration-accent-500/50');
      a.setAttribute('target', '_blank');
      a.setAttribute('rel', 'noreferrer');
    });

    art.classList.add('prose', 'prose-invert', 'max-w-none');
  } catch (e) {
    console.error('Error loading deck:', e);
    art.innerHTML = `<div class="p-4 text-red-300">Unable to load this deck's markdown guide.</div>`;
  }
}

function updateActiveButton(id) {
  $$('[data-id]', $('#deckScroller')).forEach(el => {
    const isActive = el.getAttribute('data-id') === id;
    el.classList.toggle('ring-1', isActive);
    el.classList.toggle('ring-inset', isActive);
    el.classList.toggle('ring-accent-500', isActive);
    el.classList.toggle('shadow-glow-lg', isActive);
    el.classList.toggle('bg-accent-500/10', isActive);
    el.classList.toggle('border-accent-500/40', isActive);
  });
}

// Toggle expand/collapse
$('#expandToggle')?.addEventListener('click', () => {
  state.expanded = !state.expanded;
  localStorage.setItem('deckExpanded', state.expanded);
  renderDeckNavbar();
  if (state.current) updateActiveButton(state.current);
});

loadDecks();
