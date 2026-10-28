/** Hash routing: works on any static host and under any BASE_PATH, with no rewrite rules. */

export interface Route {
  page: 'workspace' | 'reference';
  params: URLSearchParams;
}

export function currentRoute(): Route {
  const raw = window.location.hash.replace(/^#/, '');
  const [pathPart, query = ''] = raw.split('?', 2);
  const path = pathPart.replace(/^\/+/, '');
  const page = path === 'pomoc' ? 'reference' : 'workspace';
  return { page, params: new URLSearchParams(query) };
}

export function navigate(hash: string): void {
  if (window.location.hash === hash) return;
  window.location.hash = hash;
}
