# Contributing Guide

## 🎯 Overview

Adding a new deck guide is simple! Just create **one markdown file** with metadata at the top. The system features intelligent caching and automatic discovery.

## 🚀 Quick Start (3 Steps)

1. **Create** `expanded-decks/docs/my-deck.md` using the template
2. **Add images** to `expanded-decks/assets/decklist/` and `assets/icons/`
3. **Register** your file in `DECK_FILES` array (`script.js` line ~100)
4. **Commit** and push!

That's it! The site features:
- ✅ **Automatic cache-busting** - Images update instantly
- ✅ **Intelligent caching** - 30-minute localStorage cache for faster loads
- ✅ **Lazy loading** - Content loads only when selected
- ✅ **HTML caching** - Rendered content cached for instant display

## 📝 Front Matter Metadata

Add YAML metadata at the top of your markdown file:

```markdown
---
id: my-deck-id
name: My Deck Name
show: true
check: false
icon1: expanded-decks/assets/icons/pokemon1.png
icon2: expanded-decks/assets/icons/pokemon2.png
author:
  name: Your Name
  role: contributor
  avatar: social-icons/avatar.jpg
  link: https://twitter.com/username
  description: Optional description
---

# My Deck Name

![Decklist](expanded-decks/assets/decklist/MyDeck.png)

## Overview
Brief description of the deck and its strategy...
```

## 📋 Metadata Fields

### Required

| Field | Type | Description | Example |
|-------|------|-------------|---------|
| `id` | string | Unique identifier (letters, numbers, hyphens) | `regidrago-vstar` |
| `name` | string | Display name in navbar | `Regidrago Vstar` |

### Optional

| Field | Type | Description | Values |
|-------|------|-------------|--------|
| `show` | boolean | Show in navbar? | `true` / `false` |
| `check` | string/boolean | Status badge | `wip`, `true`, `false` |
| `icon1` | string | First icon (navbar) | Path to image |
| `icon2` | string | Second icon (navbar) | Path to image |
| `author` | object | Author information | See below |

### Author Object

```yaml
author:
  name: Your Name              # Required
  role: contributor            # Optional: owner, honor, contributor, admin
  avatar: path/avatar.jpg      # Required
  link: https://...            # Required
  description: Description     # Optional
```

## 🎨 Status Badges

- `check: false` - No badge
- `check: true` - Green checkmark (✓) = Complete guide
- `check: wip` - Yellow clock (⏱) = Work in Progress

## 🖼️ Images

Add your images to the appropriate folders:

**Required:**
- `expanded-decks/assets/decklist/MyDeck.png` - Decklist image (in guide)

**Optional:**
- `expanded-decks/assets/icons/pokemon1.png` - Icon 1 (navbar)
- `expanded-decks/assets/icons/pokemon2.png` - Icon 2 (navbar)
- `social-icons/your-avatar.jpg` - Your avatar

**Recommended dimensions:**
- **Navbar icons**: 100x100px (transparent PNG)
- **Decklist**: 800px wide (PNG or JPG)
- **Avatar**: 80x80px (PNG or JPG, round or square)

## 📐 Register Your Deck

Add your filename to the `DECK_FILES` array in `script.js` (around line 100):

```javascript
const DECK_FILES = [
  'regidrago-vstar.md',
  'shadow-rider-vmax.md',
  // ... other decks
  'my-deck.md'  // ← Add your file here
];
```

## 🔄 How Caching Works

The site uses a multi-layer caching strategy for optimal performance:

### 1. Metadata Cache (30 minutes)
- Deck list cached in `localStorage`
- First visit: loads all metadata
- Subsequent visits: instant display from cache
- Background refresh checks for updates

### 2. Content Cache
- Markdown content cached per deck
- Only fetches when deck is selected
- Persists during browsing session

### 3. HTML Cache
- Rendered HTML cached per deck
- Instant display on re-selection
- Includes processed images and credits

### 4. Image Cache-Busting
- Automatic timestamp added to all image URLs
- Format: `image.png?v=1735558800123`
- Images refresh automatically on page reload
- No manual cache clearing needed

**To update an image:**
1. Replace the image file (same filename)
2. Users see new image on next page load
3. No code changes required

## ✅ Complete Example

```markdown
---
id: arceus-vstar
name: Arceus VSTAR
show: true
check: true
icon1: expanded-decks/assets/icons/arceus.png
author:
  name: John Doe
  role: contributor
  avatar: social-icons/john.jpg
  link: https://twitter.com/johndoe
  description: Competitive player since 2020
---

# Arceus VSTAR

![Decklist](expanded-decks/assets/decklist/Arceus.png)

## Overview
Arceus VSTAR is a versatile deck that can adapt to any matchup...

## Core Cards
- **Arceus VSTAR** - Main attacker with Trinity Nova
- **Double Turbo Energy** - Acceleration without drawback

## Strategy

### Early Game
Set up multiple Arceus V on the bench...

### Mid Game
Use Trinity Nova to power up attackers...

## Matchups

### Favorable
- **Lost Zone Box** - Outpace their setup

### Difficult  
- **Giratina VSTAR** - Hard to OHKO

## Tech Options
- **Choice Belt** - Extra damage output
- **Path to the Peak** - Counter Abilities
```

## 🧪 Testing

Before submitting, verify:
- ✅ Deck appears in navbar
- ✅ Icons display correctly
- ✅ Content loads when clicked
- ✅ Images render properly (with cache-busting)
- ✅ Author credits appear below first image
- ✅ Links open in new tabs
- ✅ No console errors (F12)

## 📚 Template

Use `expanded-decks/docs/TEMPLATE.md` as your starting point:

```bash
cp expanded-decks/docs/TEMPLATE.md expanded-decks/docs/my-deck.md
```

Then edit the metadata and content.

## 🚀 Performance Benefits

Your deck guide benefits from:
- **Parallel loading**: All decks load simultaneously
- **Smart caching**: 30-minute cache reduces server requests
- **Lazy content**: Markdown only loads when selected
- **HTML caching**: Instant re-display of viewed decks
- **Optimized images**: Automatic cache-busting without overhead

## 🌍 Languages

- 🇬🇧 **English**: CONTRIBUTING.md (this file)
- 🇫🇷 **French**: CONTRIBUTING.fr.md

## ❓ Questions?

Check the [README](README.md) or [open an issue](https://github.com/yourusername/HemeraTCG/issues) if you need help!

---

**Happy Contributing! 🎉**
