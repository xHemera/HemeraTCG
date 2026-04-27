# Hemera TCG — Expanded Gauntlet

A community-driven website for Pokémon TCG Expanded format deck guides and resources.

## 🎯 Purpose

Hemera TCG is a personal deck library and learning resource for the Pokémon TCG Expanded format:

- **Deck Lending Library**: Provides comprehensive guides for physical decks available to borrow at local league play
- **Beginner-Friendly Guides**: Entry-level guides designed to help newcomers learn and understand the Expanded format
- **Community Resource**: Helps players get into competitive Expanded with accessible, well-documented deck strategies

## 🤝 Contributing

Want to add your own deck guide? Check out [CONTRIBUTING.md](CONTRIBUTING.md) for detailed instructions.

**Quick start:**
1. Copy `expanded-decks/docs/TEMPLATE.mdx` as your starting point
2. Add your deck metadata (YAML front matter) and content
3. Commit and push (no manual registration needed)
4. Submit a pull request

### Bun Commands

- `bun run dev` - starts Next.js dev server (auto-syncs `expanded-decks/` and `social-icons/` to `public/`)
- `bun run build` - static export build for GitHub Pages (auto-syncs before build)
- `bun run new:deck <slug> "Deck Name"` - creates a new deck markdown file from template
- `bun run sync:public` - manually syncs static assets/docs to `public/`

## 🔧 How It Works

The website is now built with Next.js and dynamically renders deck guides written in Markdown/MDX format with YAML metadata:

1. **Front Matter Metadata**: Each deck guide contains its configuration in YAML format at the top
2. **Markdown + MDX Guides**: Each deck has its own `.md` or `.mdx` file in `expanded-decks/docs/`
3. **Automatic Discovery**: New `.md` and `.mdx` files in `expanded-decks/docs/` are auto-detected at build time
4. **Dynamic Rendering**: React client renders MDX content with reusable guide components
5. **Query Deep Link**: `?deck=<id>` works for direct deck links
6. **Author Credits**: Contributors are automatically credited via front matter metadata

### Project Structure
```
HemeraTCG/
├── app/
│   ├── page.js             # Main page (React)
│   ├── contact/page.js     # Contact page (React)
│   ├── layout.js           # App shell
│   └── globals.css         # Tailwind + custom styles
├── components/
│   └── DeckExplorer.js     # Deck UI and interactions
├── lib/
│   ├── decks.js            # Markdown/MDX loading + front matter parsing
│   └── site.js             # Base path helpers
├── next.config.mjs         # Static export config for GitHub Pages
├── CONTRIBUTING.md         # Contribution guide (English)
├── .github/workflows/      # Pages deployment workflow
└── expanded-decks/
    ├── docs/               # Markdown/MDX guides with YAML front matter
    │   ├── TEMPLATE.mdx    # Template for new guides
    │   └── *.{md,mdx}      # Individual deck guides
    └── assets/             # Images & icons
        ├── decklist/       # Decklist images
        ├── icons/          # Deck icons for navbar
        └── symbols/        # Other symbols
```

## ✨ Features

- **⚡ Next.js Static Export**: Optimized static output for GitHub Pages
- **🚀 Automatic Deck Discovery**: Add one `.md` or `.mdx` file and it appears automatically
- **🧱 Reusable MDX Components**: DeckTip, WarningBox, MatchupTable, ImageFigure, CardGrid
- **🎨 Smooth Transitions**: Fade effects during content loading
- **🔄 Automatic Cache-Busting**: Images update automatically when modified
- **📝 Front Matter Metadata**: Each deck guide contains its own configuration
- **✅ No Manual Registration**: No deck list array to maintain
- **🛠 Bun-first Workflow**: Local scripts and CI run with Bun
- **📁 Automatic Public Sync**: Build/dev automatically sync static docs and assets
- **🏆 Role Badges**: Display contributor roles (owner, honor, contributor)
- **📊 Status Badges**: Show deck completion status (WIP, complete)
- **🔗 Deep-link support**: Existing `?deck=` links still work

## ⚙️ Performance

- **First Load**: ~270ms (parallel loading of all deck metadata)
- **Cached Load**: <10ms (instant from localStorage)
- **Deck Selection**: Instant with HTML render cache
- **Background Refresh**: Automatic cache updates every 30 minutes

## 🤝 Get In Touch

We welcome contributions from the Expanded community! If you'd like to:
- Submit a deck guide
- Suggest improvements
- Report issues
- Collaborate on content

**Please visit the [Contact page](https://xhemera.github.io/HemeraTCG/contact/) on our website** to get in touch with us.

---

## 📄 License

Community-driven project maintained by Expanded format players.
