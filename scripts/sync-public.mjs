import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();

const copies = [
  ['expanded-decks', path.join('public', 'expanded-decks')],
  ['social-icons', path.join('public', 'social-icons')]
];

for (const [from, to] of copies) {
  const src = path.join(root, from);
  const dest = path.join(root, to);

  if (!fs.existsSync(src)) {
    console.warn(`[sync-public] Skip missing path: ${from}`);
    continue;
  }

  fs.mkdirSync(path.dirname(dest), { recursive: true });
  fs.cpSync(src, dest, { recursive: true, force: true });
  console.log(`[sync-public] Synced ${from} -> ${to}`);
}
