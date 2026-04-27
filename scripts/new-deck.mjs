import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const docsDir = path.join(root, 'expanded-decks', 'docs');
const templateMdxPath = path.join(docsDir, 'TEMPLATE.mdx');
const templateMdPath = path.join(docsDir, 'TEMPLATE.md');

const slug = process.argv[2];
const rawName = process.argv.slice(3).join(' ').trim();

if (!slug) {
  console.error('Usage: bun run new:deck <slug> [Deck Name]');
  process.exit(1);
}

if (!/^[a-z0-9-]+$/i.test(slug)) {
  console.error('Invalid slug. Use only letters, numbers and hyphens.');
  process.exit(1);
}

const templatePath = fs.existsSync(templateMdxPath) ? templateMdxPath : templateMdPath;
if (!templatePath || !fs.existsSync(templatePath)) {
  console.error('Template not found at expanded-decks/docs/TEMPLATE.mdx or TEMPLATE.md');
  process.exit(1);
}

const deckPath = path.join(docsDir, `${slug}.mdx`);
if (fs.existsSync(deckPath)) {
  console.error(`Deck file already exists: expanded-decks/docs/${slug}.mdx`);
  process.exit(1);
}

const displayName = rawName || slug
  .split('-')
  .filter(Boolean)
  .map((part) => part[0].toUpperCase() + part.slice(1).toLowerCase())
  .join(' ');

let content = fs.readFileSync(templatePath, 'utf8');
content = content
  .replace(/^id:\s*.*$/m, `id: ${slug}`)
  .replace(/^name:\s*.*$/m, `name: ${displayName}`)
  .replace(/^#\s*.*$/m, `# ${displayName}`);

fs.writeFileSync(deckPath, content, 'utf8');
console.log(`Created expanded-decks/docs/${slug}.mdx`);
console.log('Next step: add decklist/icon images, then run bun run sync:public');
