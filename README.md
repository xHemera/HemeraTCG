# Hemera TCG — Site GitHub Pages

Deux pages statiques:
- Expanded Gauntlet: index.html (liste dynamique depuis expanded-decks/decks.json, rendu Markdown via Marked)
- Contact: contact.html (liens style Linktree)

## Déploiement sur GitHub Pages
1. Pousse ce dossier dans un dépôt GitHub (ex: `HemeraTCG`).
2. Active GitHub Pages: Settings → Pages → Deploy from branch → `main` / root.
3. L’URL sera `https://<ton-pseudo>.github.io/<nom-du-repo>/`.

## Contenu
- `expanded-decks/decks.json` pilote la navbar des decks (icônes + fichiers `.md`).
- Les fichiers Markdown sont rendus côté client (aucun build requis).
- Les icônes sont dans `icons/` et `social-icons/`.

## Personnalisation
- Ajoute/édite des decks dans `expanded-decks/decks.json`.
- Remplace les liens Discord dans `contact.html` (ids `havre-link` et `silent-link`).
- Thème sombre avec accents violet/cyan, basé Tailwind CDN.

## Développement local
Ouvre simplement `index.html` dans un navigateur moderne ou sers-le:

```bash
python3 -m http.server 5173
# Puis ouvre http://localhost:5173/
```
# HemeraTCG
