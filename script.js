// ============================================
// UTILITY FUNCTIONS
// ============================================

const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));

// ============================================
// INITIALIZATION
// ============================================

// Set current year in footer
if ($('#year')) $('#year').textContent = new Date().getFullYear();

// Download template button
if ($('#downloadTemplate')) {
  $('#downloadTemplate').addEventListener('click', async () => {
    try {
      const response = await fetch('expanded-decks/docs/TEMPLATE.md');
      const content = await response.text();
      const blob = new Blob([content], { type: 'text/markdown' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'TEMPLATE.md';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error('Error downloading template:', err);
      alert('Failed to download template. Please try again.');
    }
  });
}

// Configure Markdown renderer
if (typeof marked !== 'undefined' && marked.setOptions) {
  marked.setOptions({ breaks: true, gfm: true });
}

// ============================================
// CACHE BUSTING
// ============================================

// Cache version based on page load timestamp - ensures fresh images
const IMAGE_CACHE_BUST = Date.now();

const cacheBustUrl = (url) => {
  if (!url) return url;
  const separator = url.includes('?') ? '&' : '?';
  return `${url}${separator}v=${IMAGE_CACHE_BUST}`;
};

// ============================================
// STATE MANAGEMENT
// ============================================

const state = {
  decks: [],
  current: null,
  expanded: localStorage.getItem('deckExpanded') === 'true'
};

// ============================================
// URL PARAMETERS
// ============================================

const getParam = (k) => new URLSearchParams(location.search).get(k);

const setParam = (k, v) => {
  const url = new URL(location.href);
  v ? url.searchParams.set(k, v) : url.searchParams.delete(k);
  history.replaceState({}, '', url);
};

// ============================================
// YAML FRONT MATTER PARSER
// ============================================

/**
 * Parse YAML front matter from markdown content
 * @param {string} markdown - Full markdown content with front matter
 * @returns {Object} - { content: string, meta: Object }
 */
const parseFrontMatter = (markdown) => {
  const match = markdown.match(/^---\n([\s\S]+?)\n---/);
  if (!match) return { content: markdown, meta: {} };

  const yamlContent = match[1];
  const content = markdown.slice(match[0].length).trim();
  const meta = {};
  let currentKey = null;
  let currentIndent = 0;

  // Parse YAML line by line
  yamlContent.split('\n').forEach(line => {
    if (!line.trim()) return;

    const indent = line.search(/\S/);
    const trimmed = line.trim();

    if (indent === 0 && trimmed.includes(':')) {
      // Top-level key
      const [key, ...valueParts] = trimmed.split(':');
      currentKey = key.trim();
      const value = valueParts.join(':').trim();

      if (value) {
        // Convert string booleans to actual booleans
        meta[currentKey] = value === 'true' ? true : value === 'false' ? false : value;
      } else {
        meta[currentKey] = {};
        currentIndent = indent;
      }
    } else if (indent > currentIndent && currentKey && typeof meta[currentKey] === 'object') {
      // Nested key
      const [key, ...valueParts] = trimmed.split(':');
      if (key) {
        const nestedKey = key.trim();
        const nestedValue = valueParts.join(':').trim();
        meta[currentKey][nestedKey] = nestedValue;
      }
    }
  });

  return { content, meta };
};

// ============================================
// DECK LOADING & CACHING
// ============================================

// Cache configuration
const CACHE_KEY = 'hemera_decks_cache';
const CACHE_VERSION_KEY = 'hemera_cache_version';
const STORAGE_VERSION = '1.2';
const CACHE_DURATION = 1000 * 60 * 30; // 30 minutes

/**
 * List of markdown files to load
 * To add a new deck: just create a .md file in expanded-decks/docs/
 * and add its name here. The system will auto-discover it.
 */
const DECK_FILES = [
  'regidrago-vstar.md',
  'shadow-rider-vmax.md',
  'mew-vmax.md',
  'charizard-ex.md',
  'lugia.md',
  'vileplume-bunnelby.md',
  'ceruledge.md',
  'miraidon.md',
  'tsareena.md'
];

/**
 * Get cached deck metadata from localStorage
 * @returns {Array|null} - Cached decks or null if expired/invalid
 */
const getCachedDecks = () => {
  try {
    const version = localStorage.getItem(CACHE_VERSION_KEY);
    if (version !== STORAGE_VERSION) {
      localStorage.removeItem(CACHE_KEY);
      localStorage.setItem(CACHE_VERSION_KEY, STORAGE_VERSION);
      return null;
    }

    const cached = localStorage.getItem(CACHE_KEY);
    if (!cached) return null;

    const { timestamp, decks } = JSON.parse(cached);

    // Check if cache is still valid
    if (Date.now() - timestamp > CACHE_DURATION) {
      localStorage.removeItem(CACHE_KEY);
      return null;
    }

    return decks;
  } catch (err) {
    console.warn('Cache read error:', err);
    return null;
  }
};

/**
 * Save deck metadata to localStorage
 * @param {Array} decks - Array of deck objects to cache
 */
const setCachedDecks = (decks) => {
  try {
    localStorage.setItem(CACHE_KEY, JSON.stringify({
      timestamp: Date.now(),
      decks
    }));
  } catch (err) {
    console.warn('Cache write error:', err);
  }
};

/**
 * Load a single deck file and parse its front matter
 * @param {string} filename - Name of the markdown file
 * @returns {Promise<Object|null>} - Deck object or null if failed
 */
const loadDeckFile = async (filename) => {
  try {
    const res = await fetch(`./expanded-decks/docs/${filename}`, { cache: 'no-cache' });
    if (!res.ok) return null;

    const markdown = await res.text();
    const { content, meta } = parseFrontMatter(markdown);

    // Only return visible decks
    if (meta.show === false) return null;

    return {
      id: meta.id || filename.replace('.md', ''),
      name: meta.name || 'Unknown Deck',
      file: `docs/${filename}`,
      check: meta.check,
      icon1: meta.icon1,
      icon2: meta.icon2,
      authorCredit: meta.author,
      _content: content,
      _filename: filename
    };
  } catch (err) {
    console.warn(`Failed to load ${filename}:`, err);
    return null;
  }
};

/**
 * Load decks from server (parallel fetching)
 * @returns {Promise<Array>} - Array of deck objects
 */
const loadDecksFromServer = async () => {
  const deckPromises = DECK_FILES.map(loadDeckFile);
  const results = await Promise.all(deckPromises);
  return results.filter(Boolean);
};

/**
 * Load all deck files with intelligent caching
 */
const loadDecks = async () => {
  try {
    // Try to load from cache first
    const cached = getCachedDecks();

    if (cached) {
      // Display cached content immediately
      state.decks = cached;
      renderDeckNavbar();

      // Load fresh data in background and update if changed
      loadDecksFromServer().then(freshDecks => {
        const cacheHash = JSON.stringify(cached.map(d => d.id + d.name));
        const freshHash = JSON.stringify(freshDecks.map(d => d.id + d.name));

        if (cacheHash !== freshHash) {
          state.decks = freshDecks;
          renderDeckNavbar();
          setCachedDecks(freshDecks);
        }
      }).catch(err => console.warn('Background refresh failed:', err));
    } else {
      // No cache: load normally
      const decks = await loadDecksFromServer();
      state.decks = decks;
      setCachedDecks(decks);
      renderDeckNavbar();
    }

    // Handle initial deck selection from URL
    const initialDeck = getParam('deck');
    if (initialDeck) {
      const deck = state.decks.find(d => d.id === initialDeck);
      deck ? selectDeck(initialDeck) : showDefaultMessage();
    } else {
      showDefaultMessage();
    }
  } catch (err) {
    console.error('Error loading decks:', err);
    $('#deckScroller').innerHTML = '<div class="text-red-300">Error loading decks</div>';
  }
};

// ============================================
// UI COMPONENTS
// ============================================

/**
 * Generate HTML for a deck icon
 */
const deckIcon = (img, alt) => {
  const imgUrl = cacheBustUrl(img);
  return `<span class="relative flex items-center justify-center w-10 h-10">
    <img src="${imgUrl}" alt="${alt}" class="max-w-full max-h-full object-contain drop-shadow"/>
  </span>`;
};

/**
 * Generate status badge (checkmark or WIP)
 */
const getStatusBadge = (check) => {
  if (check === true) {
    return `<svg class="absolute -top-1 -right-1 w-5 h-5 text-green-400 bg-base-900 rounded-full" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"/></svg>`;
  }
  if (check === 'wip') {
    return `<svg class="absolute -top-1 -right-1 w-5 h-5 text-yellow-400 bg-base-900 rounded-full" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clip-rule="evenodd"/></svg>`;
  }
  return '';
};

/**
 * Build credit section HTML
 */
const buildCreditSection = (credit) => {
  if (!credit) return '';

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
};

/**
 * Get role icon SVG based on role type
 */
const getRoleIcon = (role) => {
  const roleNames = {
    owner: 'Owner',
    honor: 'Honor Contributor',
    contributor: 'Contributor',
    admin: 'Administrator'
  };

  const icons = {
    owner: `<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M12 2L14 7L19 8L15.5 11.5L16 17L12 14.5L8 17L8.5 11.5L5 8L10 7L12 2Z"
            fill="#FCD34D" stroke="#F59E0B" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"/>
      <path d="M7 16H17C17 16 18 16 18 17V20C18 21 17 21 17 21H7C7 21 6 21 6 20V17C6 16 7 16 7 16Z"
            fill="#FBBF24" stroke="#F59E0B" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"/>
      <circle cx="12" cy="18" r="1" fill="#F59E0B"/>
      <circle cx="9" cy="18" r="0.8" fill="#F59E0B"/>
      <circle cx="15" cy="18" r="0.8" fill="#F59E0B"/>
    </svg>`,
    honor: `<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M12 20H21M3.00003 20H5.67457C6.1637 20 6.40827 20 6.63846 19.9447C6.84254 19.8957 7.03763 19.8149 7.2166 19.7053C7.41843 19.5816 7.59139 19.4086 7.93732 19.0627L19.5001 7.49998C20.3285 6.67156 20.3285 5.32841 19.5001 4.49998C18.6716 3.67156 17.3285 3.67156 16.5001 4.49998L4.93729 16.0627C4.59139 16.4086 4.41843 16.5816 4.29475 16.7834C4.18509 16.9624 4.10428 17.1574 4.05529 17.3615C4.00003 17.5917 4.00003 17.8363 4.00003 18.3254V20Z"
            stroke="#FCD34D" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>
    </svg>`,
    contributor: `<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M12 20H21M3.00003 20H5.67457C6.1637 20 6.40827 20 6.63846 19.9447C6.84254 19.8957 7.03763 19.8149 7.2166 19.7053C7.41843 19.5816 7.59139 19.4086 7.93732 19.0627L19.5001 7.49998C20.3285 6.67156 20.3285 5.32841 19.5001 4.49998C18.6716 3.67156 17.3285 3.67156 16.5001 4.49998L4.93729 16.0627C4.59139 16.4086 4.41843 16.5816 4.29475 16.7834C4.18509 16.9624 4.10428 17.1574 4.05529 17.3615C4.00003 17.5917 4.00003 17.8363 4.00003 18.3254V20Z"
            stroke="#60A5FA" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>
    </svg>`,
    admin: `<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M12 22C12 22 20 18 20 12V5L12 2L4 5V12C4 18 12 22 12 22Z"
            fill="#FCA5A5" stroke="#EF4444" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>
    </svg>`
  };

  const icon = icons[role] || icons.contributor;
  const roleName = roleNames[role] || 'Contributor';
  return `<span class="credit-role-icon" title="${roleName}">${icon}</span>`;
};

// ============================================
// RENDERING FUNCTIONS
// ============================================

/**
 * Render the deck navigation bar
 */
const renderDeckNavbar = () => {
  const scroller = $('#deckScroller');
  const icon = $('#expandIcon');

  // Update classes based on expanded state
  scroller.classList.toggle('overflow-x-auto', !state.expanded);
  scroller.classList.toggle('flex-wrap', state.expanded);
  if (icon) icon.style.transform = state.expanded ? 'rotate(180deg)' : 'rotate(0deg)';

  // Clear and rebuild deck buttons
  scroller.innerHTML = '';

  state.decks.forEach(deck => {
    if (deck.show === false) return;

    const btn = document.createElement('button');
    btn.className = 'group relative shrink-0 px-4 py-4 rounded-xl border border-white/10 bg-gradient-to-br from-white/5 to-white/[0.02] hover:from-white/10 hover:to-white/5 hover:border-accent-500/30 hover:shadow-glow transition-all duration-300 text-left';
    btn.setAttribute('data-id', deck.id);

    const icons = [deck.icon1, deck.icon2]
      .filter(Boolean)
      .map(src => deckIcon(src, deck.name))
      .join('');

    btn.innerHTML = `
      ${getStatusBadge(deck.check)}
      <div class="flex items-center gap-3">
        <div class="flex -space-x-2">${icons}</div>
        <span class="text-sm font-semibold group-hover:text-accent-300 transition whitespace-nowrap">${deck.name}</span>
      </div>`;

    btn.addEventListener('click', () => selectDeck(deck.id));
    scroller.appendChild(btn);
  });
};

/**
 * Show default welcome message
 */
const showDefaultMessage = () => {
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
};

/**
 * Select and display a deck with optimized lazy loading and HTML caching
 * @param {string} id - Deck identifier
 */
const selectDeck = async (id) => {
  const deck = state.decks.find(x => x.id === id);
  if (!deck) return;

  state.current = id;
  setParam('deck', id);
  updateActiveButton(id);

  const art = $('#deckContent');

// If HTML is already cached, display immediately with fresh title
  if (deck._cachedHTML) {
    const titleHtml = `<h1>${deck.name}</h1>`;
    art.innerHTML = titleHtml + deck._cachedHTML;
    art.classList.add('prose', 'prose-invert', 'max-w-none');
    return;
  }

  // Show loading state with smooth transition
  art.style.opacity = '0.5';
  art.innerHTML = '<div class="p-4 text-white/70">Loading guide…</div>';

  try {
    // Get content (from cache or fetch)
    let content = deck._content;

    if (!content) {
      const url = `./expanded-decks/${deck.file}`;
      const res = await fetch(url, { cache: 'no-cache' });
      if (!res.ok) throw new Error('404');

      const md = await res.text();
      const parsed = parseFrontMatter(md);
      content = parsed.content;
      deck._content = content; // Cache for future use
    }

    // Parse markdown to HTML (without H1 title)
    let html = typeof marked.parse === 'function' ? marked.parse(content) : marked(content);

    // Remove any existing H1 from the content to avoid duplicates
    html = html.replace(/<h1[^>]*>.*?<\/h1>/i, '');

    // Apply cache busting to images directly in HTML
    html = html.replace(/<img([^>]*)src="([^"]+)"/g, (match, attrs, src) => {
      const bustedSrc = cacheBustUrl(src);
      return `<img${attrs}src="${bustedSrc}"`;
    });

    // Inject author credits after first image if present
    if (deck.authorCredit) {
      const imgMatch = html.match(/<img[^>]*>/);
      if (imgMatch) {
        const imgTag = imgMatch[0];
        const imgIndex = html.indexOf(imgTag) + imgTag.length;
        html = html.slice(0, imgIndex) + buildCreditSection(deck.authorCredit) + html.slice(imgIndex);
      }
    }

    // Cache the rendered HTML (without title - will be injected dynamically)
    deck._cachedHTML = html;

    // Display content with dynamic title
    const titleHtml = `<h1>${deck.name}</h1>`;
    art.innerHTML = titleHtml + html;
    art.style.opacity = '1';

    // Enhance all links
    $$('a', art).forEach(a => {
      a.classList.add('text-accent-300', 'hover:text-white', 'underline', 'decoration-accent-500/50');
      a.setAttribute('target', '_blank');
      a.setAttribute('rel', 'noreferrer');
    });

    art.classList.add('prose', 'prose-invert', 'max-w-none');
  } catch (err) {
    console.error('Error loading deck:', err);
    art.style.opacity = '1';
    art.innerHTML = `<div class="p-4 text-red-300">Unable to load this deck's markdown guide.</div>`;
  }
};

/**
 * Update active state of deck buttons
 * @param {string} id - Active deck identifier
 */
const updateActiveButton = (id) => {
  $$('[data-id]', $('#deckScroller')).forEach(el => {
    const isActive = el.getAttribute('data-id') === id;
    el.classList.toggle('ring-1', isActive);
    el.classList.toggle('ring-inset', isActive);
    el.classList.toggle('ring-accent-500', isActive);
    el.classList.toggle('shadow-glow-lg', isActive);
    el.classList.toggle('bg-accent-500/10', isActive);
    el.classList.toggle('border-accent-500/40', isActive);
  });
};

// ============================================
// EVENT HANDLERS
// ============================================

// Toggle expand/collapse deck navbar
$('#expandToggle')?.addEventListener('click', () => {
  state.expanded = !state.expanded;
  localStorage.setItem('deckExpanded', state.expanded);
  renderDeckNavbar();
  if (state.current) updateActiveButton(state.current);
});

// ============================================
// INITIALIZATION
// ============================================

loadDecks();
