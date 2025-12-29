# Hemera TCG — Expanded Gauntlet

A community-driven website for Pokémon TCG Expanded format deck guides and resources.

## 🎯 Purpose

Hemera TCG is a personal deck library and learning resource for the Pokémon TCG Expanded format:

- **Deck Lending Library**: Provides comprehensive guides for physical decks available to borrow at local league play
- **Beginner-Friendly Guides**: Entry-level guides designed to help newcomers learn and understand the Expanded format
- **Community Resource**: Helps players get into competitive Expanded with accessible, well-documented deck strategies

## 🔧 How It Works

The website dynamically loads and displays deck guides written in Markdown format:

1. **Deck Configuration**: All decks are managed through `expanded-decks/decks.json`
2. **Markdown Guides**: Each deck has its own `.md` file in `expanded-decks/docs/`
3. **Dynamic Rendering**: The site uses JavaScript to fetch and render Markdown content in real-time
4. **Author Credits**: Contributors are automatically credited via metadata in the JSON configuration

### Project Structure
```
HemeraTCG/
├── index.html              # Main page
├── contact.html            # Contact/contribution page
├── styles.css              # Custom styles
├── script.js               # Core functionality
└── expanded-decks/
    ├── decks.json          # Deck database & configuration
    ├── docs/               # Markdown guides
    └── assets/             # Images & icons
```

## 🤝 Contributing

We welcome contributions from the Expanded community! If you'd like to:
- Submit a deck guide
- Suggest improvements
- Report issues
- Collaborate on content

**Please visit the [Contact page](hhttps://xhemera.github.io/HemeraTCG/contact.html) on our website** to get in touch with us.

---

## 📄 License

Community-driven project maintained by Expanded format players.
