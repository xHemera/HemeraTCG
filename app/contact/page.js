'use client';

import { useState } from 'react';
import { withBasePath } from '../../lib/site';

export default function ContactPage() {
  const [copied, setCopied] = useState(false);

  const copyDiscord = async () => {
    try {
      await navigator.clipboard.writeText('x.hemera');
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1500);
    } catch {
      setCopied(false);
    }
  };

  return (
    <>
      <div className="fixed -z-10 inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
        <div className="absolute -top-40 -left-20 h-80 w-80 rounded-full blur-3xl opacity-30" style={{ background: 'radial-gradient(closest-side, #7C3AED, transparent)' }} />
        <div className="absolute top-40 right-0 h-96 w-96 rounded-full blur-3xl opacity-20" style={{ background: 'radial-gradient(closest-side, #00E5FF, transparent)' }} />
      </div>

      <header className="sticky top-0 z-40 backdrop-blur-xl supports-[backdrop-filter]:bg-base-950/80 bg-base-950/90 border-b border-white/10">
        <div className="max-w-3xl mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <a href={withBasePath('/')} className="group inline-flex items-center gap-3 hover:opacity-80 transition">
              <img src={withBasePath('/expanded-decks/assets/icons/regidrago.png')} alt="Hemera" className="h-9 w-9 drop-shadow-lg" />
              <span className="text-lg font-bold tracking-tight">Hemera TCG</span>
            </a>
            <nav className="flex items-center gap-1">
              <a href={withBasePath('/')} className="px-4 py-2 rounded-lg text-sm font-medium text-white/70 hover:text-white hover:bg-white/5 border border-transparent transition">Expanded Gauntlet</a>
              <a href="#" target="_blank" rel="noopener noreferrer" className="px-4 py-2 rounded-lg text-sm font-medium text-white/70 hover:text-white hover:bg-white/5 border border-transparent transition">
                <span className="hidden sm:inline">Needed Cards</span>
                <span className="sm:hidden">Cards</span>
              </a>
              <a href={withBasePath('/contact/')} className="px-4 py-2 rounded-lg text-sm font-medium bg-accent-500/10 text-white border border-accent-500/20 shadow-glow">Contact</a>
            </nav>
          </div>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 pt-10 pb-20">
        <section className="text-center mb-10">
          <h1 className="text-4xl font-bold tracking-tight bg-gradient-to-r from-white via-accent-300 to-cyan-400 bg-clip-text text-transparent">Contact</h1>
          <p className="mt-3 text-white/60">Useful links and socials</p>
        </section>

        <section className="space-y-4">
          <a href="https://discord.gg/ercwJFBy42" target="_blank" rel="noreferrer" className="glass rounded-2xl p-5 flex items-center gap-5 transition group">
            <div className="h-12 w-12 rounded-xl bg-accent-500/10 border border-accent-500/20 p-2 flex items-center justify-center">
              <img src={withBasePath('/social-icons/havre.png')} alt="Havre de Duel" className="h-full w-full object-contain" />
            </div>
            <div className="flex-1 text-left">
              <div className="font-semibold text-base group-hover:text-accent-300 transition">Havre de Duel</div>
              <div className="text-sm text-white/60">Personal Discord Server</div>
            </div>
            <span className="text-accent-300 text-sm font-medium">Join -&gt;</span>
          </a>

          <a href="https://discord.gg/VKaFT95Z2z" target="_blank" rel="noreferrer" className="glass rounded-2xl p-5 flex items-center gap-5 transition group">
            <div className="h-12 w-12 rounded-xl bg-accent-500/10 border border-accent-500/20 p-2 flex items-center justify-center">
              <img src={withBasePath('/social-icons/silent-lab.png')} alt="Silent Lab" className="h-full w-full object-contain" />
            </div>
            <div className="flex-1 text-left">
              <div className="font-semibold text-base group-hover:text-accent-300 transition">Silent Lab</div>
              <div className="text-sm text-white/60">Discord - Expanded Format</div>
            </div>
            <span className="text-accent-300 text-sm font-medium">Join -&gt;</span>
          </a>

          <div className="glass rounded-2xl p-5 flex items-center gap-5 border">
            <div className="h-12 w-12 rounded-xl bg-accent-500/10 border border-accent-500/20 p-2 flex items-center justify-center">
              <img src={withBasePath('/social-icons/discord.png')} alt="Discord" className="h-full w-full object-contain" />
            </div>
            <div className="flex-1 text-left">
              <div className="font-semibold text-base">Discord (DM)</div>
              <div className="text-sm text-white/60 font-mono">x.hemera</div>
            </div>
            <button type="button" onClick={copyDiscord} className="px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-sm hover:bg-white/10 hover:border-accent-500/30 transition font-medium">{copied ? 'Copied!' : 'Copy'}</button>
          </div>

          <a href="https://instagram.com/tony.bsrd" target="_blank" rel="noreferrer" className="glass rounded-2xl p-5 flex items-center gap-5 transition group">
            <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 p-2 flex items-center justify-center">
              <img src={withBasePath('/social-icons/Instagram.png')} alt="Instagram" className="h-full w-full object-contain" />
            </div>
            <div className="flex-1 text-left">
              <div className="font-semibold text-base group-hover:text-cyan-300 transition">Instagram</div>
              <div className="text-sm text-white/60">@tony.bsrd</div>
            </div>
            <span className="text-cyan-300 text-sm font-medium">Open -&gt;</span>
          </a>
        </section>
      </main>
    </>
  );
}
