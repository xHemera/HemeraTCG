export const basePath = process.env.NEXT_PUBLIC_BASE_PATH || '';

const normalizePath = (path) => {
  if (!path) return path;
  if (/^https?:\/\//i.test(path)) return path;

  let normalizedPath = path.startsWith('./') ? path.slice(2) : path;

  if (normalizedPath.endsWith('.html')) {
    normalizedPath = `${normalizedPath.slice(0, -5)}/`;
  }

  return normalizedPath.startsWith('/') ? normalizedPath : `/${normalizedPath}`;
};

export const withBasePath = (path) => {
  const normalized = normalizePath(path);
  return normalized ? `${basePath}${normalized}` : normalized;
};
