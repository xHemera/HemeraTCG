'use client';

import { useEffect, useMemo, useState } from 'react';
import { MDXRemote } from 'next-mdx-remote';
import { withBasePath } from '../lib/site';
import { createGuideComponents } from './mdx/createGuideComponents';

const DECK_ID_ALIASES = {
  gardy: 'gardevoir',
  absol: 'mega-absol'
};

const normalizeDeckId = (deckId) => {
  if (!deckId) return '';
  return DECK_ID_ALIASES[deckId] || deckId;
};

const cacheBustUrl = (url, assetVersion) => {
  if (!url) return '';
  const separator = url.includes('?') ? '&' : '?';
  return assetVersion ? `${url}${separator}v=${assetVersion}` : url;
};

const getStatusBadge = (check) => {
  if (check === true) {
    return '<svg class="absolute -top-1 -right-1 w-5 h-5 text-green-400 bg-base-900 rounded-full" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"/></svg>';
  }
  if (check === 'wip') {
    return '<svg class="absolute -top-1 -right-1 w-5 h-5 text-yellow-400 bg-base-900 rounded-full" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clip-rule="evenodd"/></svg>';
  }
  return '';
};

const getRoleIcon = (role) => {
  const roleNames = {
    owner: 'Owner',
    honor: 'Honor Contributor',
    contributor: 'Contributor',
    admin: 'Administrator'
  };

  const icons = {
    owner: '<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12 2L14 7L19 8L15.5 11.5L16 17L12 14.5L8 17L8.5 11.5L5 8L10 7L12 2Z" fill="#FCD34D" stroke="#F59E0B" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"/><path d="M7 16H17C17 16 18 16 18 17V20C18 21 17 21 17 21H7C7 21 6 21 6 20V17C6 16 7 16 7 16Z" fill="#FBBF24" stroke="#F59E0B" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"/><circle cx="12" cy="18" r="1" fill="#F59E0B"/><circle cx="9" cy="18" r="0.8" fill="#F59E0B"/><circle cx="15" cy="18" r="0.8" fill="#F59E0B"/></svg>',
    honor: '<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12 20H21M3.00003 20H5.67457C6.1637 20 6.40827 20 6.63846 19.9447C6.84254 19.8957 7.03763 19.8149 7.2166 19.7053C7.41843 19.5816 7.59139 19.4086 7.93732 19.0627L19.5001 7.49998C20.3285 6.67156 20.3285 5.32841 19.5001 4.49998C18.6716 3.67156 17.3285 3.67156 16.5001 4.49998L4.93729 16.0627C4.59139 16.4086 4.41843 16.5816 4.29475 16.7834C4.18509 16.9624 4.10428 17.1574 4.05529 17.3615C4.00003 17.5917 4.00003 17.8363 4.00003 18.3254V20Z" stroke="#FCD34D" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    contributor: '<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12 20H21M3.00003 20H5.67457C6.1637 20 6.40827 20 6.63846 19.9447C6.84254 19.8957 7.03763 19.8149 7.2166 19.7053C7.41843 19.5816 7.59139 19.4086 7.93732 19.0627L19.5001 7.49998C20.3285 6.67156 20.3285 5.32841 19.5001 4.49998C18.6716 3.67156 17.3285 3.67156 16.5001 4.49998L4.93729 16.0627C4.59139 16.4086 4.41843 16.5816 4.29475 16.7834C4.18509 16.9624 4.10428 17.1574 4.05529 17.3615C4.00003 17.5917 4.00003 17.8363 4.00003 18.3254V20Z" stroke="#60A5FA" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    admin: '<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12 22C12 22 20 18 20 12V5L12 2L4 5V12C4 18 12 22 12 22Z" fill="#FCA5A5" stroke="#EF4444" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>'
  };

  const icon = icons[role] || icons.contributor;
  const roleName = roleNames[role] || 'Contributor';
  return `<span class="credit-role-icon" title="${roleName}">${icon}</span>`;
};

const buildCreditSection = (credit, assetVersion) => {
  if (!credit) return '';

  const roleIcon = credit.role ? getRoleIcon(credit.role) : '';
  const description = credit.description ? `<p class="credit-description">${credit.description}</p>` : '';
  const avatarUrl = cacheBustUrl(withBasePath(credit.avatar), assetVersion);
  const profileHref = credit.link?.startsWith('http') ? credit.link : withBasePath(credit.link || '/contact/');

  return `
    <div class="credits-section">
      <div class="credit-item">
        <img src="${avatarUrl}" alt="${credit.name}" class="credit-avatar" />
        <div class="credit-info">
          <div class="credit-header">
            <span class="credit-name">${credit.name}</span>
            ${roleIcon}
          </div>
          ${description}
        </div>
        <a href="${profileHref}" class="credit-link" target="_blank" rel="noreferrer">View Profile</a>
      </div>
    </div>
  `;
};

export default function DeckExplorer({ decks, basePath, assetVersion }) {
  const [expanded, setExpanded] = useState(false);
  const [currentId, setCurrentId] = useState('');

  useEffect(() => {
    const expandedPref = window.localStorage.getItem('deckExpanded') === 'true';
    setExpanded(expandedPref);

    const url = new URL(window.location.href);
    const fromQuery = normalizeDeckId(url.searchParams.get('deck'));
    const hasDeck = decks.some((deck) => deck.id === fromQuery);
    if (hasDeck) {
      setCurrentId(fromQuery);
    }
  }, [decks]);

  const currentDeck = useMemo(() => decks.find((deck) => deck.id === currentId) || null, [decks, currentId]);
  const mdxComponents = useMemo(() => createGuideComponents({ assetVersion, cacheBustUrl }), [assetVersion]);

  const handleSelectDeck = (id) => {
    setCurrentId(id);
    const url = new URL(window.location.href);
    url.searchParams.set('deck', id);
    window.history.replaceState({}, '', url);
  };

  const handleToggleExpand = () => {
    const next = !expanded;
    setExpanded(next);
    window.localStorage.setItem('deckExpanded', `${next}`);
  };

  const handleDownloadTemplate = () => {
    const templateUrl = withBasePath('/expanded-decks/docs/TEMPLATE.mdx');
    fetch(templateUrl)
      .then((response) => response.text())
      .then((content) => {
        const blob = new Blob([content], { type: 'text/markdown' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'TEMPLATE.mdx';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      })
      .catch(() => {
        window.alert('Failed to download template.');
      });
  };

  return (
    <>
      <div className="fixed -z-10 inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
        <div className="absolute -top-40 -left-20 h-80 w-80 rounded-full blur-3xl opacity-30" style={{ background: 'radial-gradient(closest-side, #7C3AED, transparent)' }} />
        <div className="absolute top-40 right-0 h-96 w-96 rounded-full blur-3xl opacity-20" style={{ background: 'radial-gradient(closest-side, #00E5FF, transparent)' }} />
      </div>

      <header className="sticky top-0 z-40 backdrop-blur-xl supports-[backdrop-filter]:bg-base-950/80 bg-base-950/90 border-b border-white/10">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <a href={withBasePath('/')} className="group inline-flex items-center gap-3 hover:opacity-80 transition">
              <img src={withBasePath('/expanded-decks/assets/icons/calyrex-shadow-rider.png')} alt="Hemera" className="h-9 w-9 object-contain drop-shadow-lg" />
              <span className="text-lg font-bold tracking-tight">Hemera TCG</span>
              <span className="ml-2 text-xs px-2.5 py-1 rounded-full bg-accent-500/20 border border-accent-500/30 text-accent-300 font-medium">Expanded</span>
            </a>
            <nav className="flex items-center gap-1">
              <a href={withBasePath('/')} className="px-4 py-2 rounded-lg text-sm font-medium bg-accent-500/10 text-white border border-accent-500/20 shadow-glow">
                <span className="hidden sm:inline">Expanded Gauntlet</span>
                <span className="sm:hidden">Gauntlet</span>
              </a>
              <a href="#" target="_blank" rel="noopener noreferrer" className="px-4 py-2 rounded-lg text-sm font-medium text-white/70 hover:text-white hover:bg-white/5 border border-transparent transition">
                <span className="hidden sm:inline">Needed Cards</span>
                <span className="sm:hidden">Cards</span>
              </a>
              <a href={withBasePath('/contact/')} className="px-4 py-2 rounded-lg text-sm font-medium text-white/70 hover:text-white hover:bg-white/5 border border-transparent transition">
                <span className="hidden sm:inline">Contact</span>
                <svg className="sm:hidden h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </a>
              <button type="button" onClick={handleDownloadTemplate} className="p-2 rounded-lg text-white/70 hover:text-white hover:bg-white/5 border border-transparent transition" title="Download Deck Template">
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </button>
            </nav>
          </div>
        </div>

        <div className="border-t border-white/5">
          <div className="max-w-6xl mx-auto px-4 sm:px-4 py-3 sm:py-5">
            <div className="flex items-start gap-2 sm:gap-3">
              <div className={`flex-1 flex items-center gap-2 sm:gap-4 pb-2 px-1 ${expanded ? 'flex-wrap' : 'overflow-x-auto'}`}>
                {decks.map((deck) => {
                  const icons = [deck.icon1, deck.icon2].filter(Boolean);
                  const isActive = currentId === deck.id;

                  return (
                    <button
                      type="button"
                      key={deck.id}
                      onClick={() => handleSelectDeck(deck.id)}
                      className={`group relative shrink-0 px-3 sm:px-4 py-3 sm:py-4 rounded-xl border bg-gradient-to-br transition-all duration-300 text-left ${isActive ? 'ring-1 ring-inset ring-accent-500 shadow-glow-lg bg-accent-500/10 border-accent-500/40' : 'border-white/10 from-white/5 to-white/[0.02] hover:from-white/10 hover:to-white/5 hover:border-accent-500/30 hover:shadow-glow'}`}
                    >
                      <span dangerouslySetInnerHTML={{ __html: getStatusBadge(deck.check) }} />
                      <div className="flex items-center gap-2 sm:gap-3">
                        <div className="flex -space-x-2">
                          {icons.map((src) => (
                            <span key={src} className="relative flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10">
                              <img src={cacheBustUrl(withBasePath(src), assetVersion)} alt={deck.name} className="max-w-full max-h-full object-contain drop-shadow" />
                            </span>
                          ))}
                        </div>
                        <span className="text-xs sm:text-sm font-semibold group-hover:text-accent-300 transition whitespace-nowrap">{deck.name}</span>
                      </div>
                    </button>
                  );
                })}
              </div>
              <button type="button" onClick={handleToggleExpand} className="shrink-0 mt-1 p-2 sm:p-2.5 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 hover:border-accent-500/30 transition-all" title="Deplier/Replier">
                <svg className="h-4 w-4 sm:h-5 sm:w-5 text-white/70 transition-transform" style={{ transform: expanded ? 'rotate(180deg)' : 'rotate(0deg)' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 sm:px-6 pt-6 sm:pt-8 pb-12 sm:pb-16">
        <section className="relative">
          <article id="deckContent" className="prose prose-invert max-w-none">
            {!currentDeck && (
              <div className="flex items-center justify-center h-full">
                <div className="text-center p-8">
                  <svg className="w-16 h-16 mx-auto mb-4 text-white/30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                  </svg>
                  <h2 className="text-2xl font-bold text-white/70 mb-2">Welcome to HemeraTCG Expanded Decks</h2>
                  <p className="text-white/50">Click on a deck to show information</p>
                </div>
              </div>
            )}
            {currentDeck && (
              <>
                <MDXRemote {...currentDeck.source} components={mdxComponents} />
                {currentDeck.authorCredit ? <div dangerouslySetInnerHTML={{ __html: buildCreditSection(currentDeck.authorCredit, assetVersion) }} /> : null}
              </>
            )}
          </article>
        </section>
      </main>

      <footer className="border-t border-white/10 bg-base-950/50 py-8">
        <div className="max-w-6xl mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-4 text-white/50 text-sm">
          <div className="flex items-center gap-2">
            <span>© {new Date().getFullYear()} Hemera TCG · Expanded Format</span>
            <span className="text-white/30">·</span>
            <span className="text-accent-300/70 font-medium">Community Driven</span>
          </div>
          <div className="flex items-center gap-6">
            <a href={withBasePath('/contact/')} className="hover:text-accent-300 transition">Contact</a>
            <a href="#top" className="hover:text-accent-300 transition">Back to Top</a>
          </div>
        </div>
      </footer>
    </>
  );
}
