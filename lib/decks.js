import fs from 'node:fs';
import path from 'node:path';
import matter from 'gray-matter';
import { serialize } from 'next-mdx-remote/serialize';
import remarkGfm from 'remark-gfm';

const docsDir = path.join(process.cwd(), 'expanded-decks', 'docs');

const toBoolean = (value, fallback = true) => {
  if (typeof value === 'boolean') return value;
  if (typeof value === 'string') {
    if (value.toLowerCase() === 'true') return true;
    if (value.toLowerCase() === 'false') return false;
  }
  return fallback;
};

const normalizeAuthor = (author) => {
  if (!author || typeof author !== 'object') return null;
  return {
    name: author.name || '',
    role: author.role || 'contributor',
    avatar: author.avatar || '',
    link: author.link || '#',
    description: author.description || ''
  };
};

const parseDeckFile = async (filename) => {
  const fullPath = path.join(docsDir, filename);
  const raw = fs.readFileSync(fullPath, 'utf8');
  const { data, content } = matter(raw);

  const show = toBoolean(data.show, true);
  if (!show) return null;

  const source = await serialize(content.trim(), {
    parseFrontmatter: false,
    mdxOptions: {
      remarkPlugins: [remarkGfm]
    }
  });

  return {
    id: data.id || filename.replace(/\.(md|mdx)$/i, ''),
    name: data.name || 'Unknown Deck',
    check: data.check,
    icon1: data.icon1 || '',
    icon2: data.icon2 || '',
    authorCredit: normalizeAuthor(data.author),
    source,
    fileName: filename
  };
};

export const getDecks = async () => {
  if (!fs.existsSync(docsDir)) return [];

  const files = fs
    .readdirSync(docsDir)
    .filter((file) => /\.(md|mdx)$/i.test(file))
    .filter((file) => !/^template\.(md|mdx)$/i.test(file))
    .sort((a, b) => a.localeCompare(b));

  const decks = await Promise.all(files.map(parseDeckFile));
  return decks.filter(Boolean);
};
