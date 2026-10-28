import { signal } from '@preact/signals';

export type Route =
  | { name: 'studio' }
  | { name: 'challenge'; id: string }
  | { name: 'examples' }
  | { name: 'challenges' }
  | { name: 'reference'; section: string | null }
  | { name: 'example'; id: string }
  | { name: 'permalink'; mode: string; data: string }
  | { name: 'notfound'; path: string };

export function parseHash(hash: string): Route {
  const path = hash.replace(/^#/, '').replace(/^\/+/, '');
  const parts = path.split('/').map((p) => {
    try {
      return decodeURIComponent(p);
    } catch {
      return p;
    }
  });
  const [head, a, ...rest] = parts;
  switch (head) {
    case '':
    case undefined:
    case 'studio':
      return { name: 'studio' };
    case 'przyklady':
      return { name: 'examples' };
    case 'wyzwania':
      return { name: 'challenges' };
    case 'wyzwanie':
      return a ? { name: 'challenge', id: a } : { name: 'challenges' };
    case 'opis':
      return { name: 'reference', section: a || null };
    case 'przyklad':
      return a ? { name: 'example', id: a } : { name: 'examples' };
    case 'p':
      // The payload itself never contains "/" (base64url), but be lenient.
      return { name: 'permalink', mode: a ?? '2d', data: rest.join('/') };
    default:
      return { name: 'notfound', path };
  }
}

export function hrefFor(route: Route): string {
  switch (route.name) {
    case 'studio': return '#/';
    case 'challenge': return `#/wyzwanie/${encodeURIComponent(route.id)}`;
    case 'examples': return '#/przyklady';
    case 'challenges': return '#/wyzwania';
    case 'reference': return route.section ? `#/opis/${route.section}` : '#/opis';
    case 'example': return `#/przyklad/${encodeURIComponent(route.id)}`;
    case 'permalink': return `#/p/${route.mode}/${route.data}`;
    default: return '#/';
  }
}

export const route = signal<Route>(parseHash(location.hash));

window.addEventListener('hashchange', () => {
  route.value = parseHash(location.hash);
});

export function navigate(to: Route, replace = false): void {
  const href = hrefFor(to);
  if (replace) {
    history.replaceState(history.state, '', href);
  } else if (location.hash !== href) {
    history.pushState(history.state, '', href);
  }
  route.value = parseHash(href);
}
