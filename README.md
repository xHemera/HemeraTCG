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
1. Copy `expanded-decks/docs/TEMPLATE.md` as your starting point
2. Add your deck metadata (YAML front matter) and content
3. Add the filename to `DECK_FILES` in `script.js`
4. Submit a pull request!

## 🔧 How It Works

The website dynamically loads and displays deck guides written in Markdown format with YAML metadata:

1. **Front Matter Metadata**: Each deck guide contains its configuration in YAML format at the top
2. **Markdown Guides**: Each deck has its own `.md` file in `expanded-decks/docs/`
3. **Intelligent Caching**: 30-minute localStorage cache for instant loading on repeat visits
4. **Dynamic Rendering**: JavaScript fetches and renders Markdown content in real-time
5. **Lazy Loading**: Deck content loaded only when selected, with HTML render caching
6. **Author Credits**: Contributors are automatically credited via front matter metadata

### Project Structure
```
HemeraTCG/
├── index.html              # Main page
├── contact.html            # Contact/contribution page
├── styles.css              # Custom styles
├── script.js               # Core functionality (includes YAML parser & caching)
├── CONTRIBUTING.md         # Contribution guide (English)
├── CONTRIBUTING.fr.md      # Guide de contribution (Français)
├── OPTIMIZATIONS.md        # Technical optimization details
└── expanded-decks/
    ├── docs/               # Markdown guides with YAML front matter
    │   ├── TEMPLATE.md     # Template for new guides
    │   └── *.md            # Individual deck guides
    └── assets/             # Images & icons
        ├── decklist/       # Decklist images
        ├── icons/          # Deck icons for navbar
        └── symbols/        # Other symbols
```

## ✨ Features

- **⚡ Intelligent Caching**: 30-minute localStorage cache for instant page loads
- **🚀 Lazy Loading**: Deck content loaded only when needed, with HTML caching
- **🎨 Smooth Transitions**: Fade effects during content loading
- **🔄 Automatic Cache-Busting**: Images update automatically when modified
- **📝 Front Matter Metadata**: Each deck guide contains its own configuration
- **✅ No Manual JSON Editing**: Just create markdown files!
- **🏆 Role Badges**: Display contributor roles (owner, honor, contributor)
- **📊 Status Badges**: Show deck completion status (WIP, complete)
- **📦 Parallel Loading**: All decks load simultaneously for 70% faster initial load

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

**Please visit the [Contact page](https://xhemera.github.io/HemeraTCG/contact.html) on our website** to get in touch with us.

---

## 📄 License

Community-driven project maintained by Expanded format players.
