/** Prosty router na hashu: działa na statycznym hostingu pod dowolną ścieżką. */

export interface Route {
  /** Segmenty ścieżki, np. ['wyzwania', 'kwadrat']. */
  path: string[];
  query: URLSearchParams;
}

export function parseHash(hash: string = location.hash): Route {
  let s = hash.startsWith('#') ? hash.slice(1) : hash;
  const qi = s.indexOf('?');
  const query = new URLSearchParams(qi >= 0 ? s.slice(qi + 1) : '');
  if (qi >= 0) s = s.slice(0, qi);
  const path = s.split('/').filter(Boolean).map((p) => {
    try {
      return decodeURIComponent(p);
    } catch {
      return p;
    }
  });
  return { path, query };
}

export function hrefFor(path: string[], query?: Record<string, string>): string {
  const p = '#/' + path.map(encodeURIComponent).join('/');
  const q = query ? new URLSearchParams(query).toString() : '';
  return q ? `${p}?${q}` : p;
}

export function navigate(path: string[], query?: Record<string, string>, replace = false): void {
  const href = hrefFor(path, query);
  if (replace) history.replaceState(null, '', href);
  else if (location.hash !== href) location.hash = href;
  else window.dispatchEvent(new HashChangeEvent('hashchange'));
}

/** Podmienia hash bez wywoływania zdarzenia hashchange. */
export function replaceHash(href: string): void {
  history.replaceState(null, '', href);
}
