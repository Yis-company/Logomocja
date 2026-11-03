// One authored icon set: 20×20 grid, 1.75 stroke, round joins.
const P: Record<string, string> = {
  play: '<path d="M6.5 4.5v11l9-5.5z" fill="currentColor" stroke="none"/>',
  step: '<path d="M4.5 4.5v11l7-5.5z" fill="currentColor" stroke="none"/><path d="M14.5 4.5v11"/>',
  pause: '<path d="M7 4.5v11M13 4.5v11"/>',
  resume: '<path d="M6.5 4.5v11l9-5.5z"/>',
  reset: '<path d="M4.5 10a5.5 5.5 0 1 0 1.8-4.1"/><path d="M4.5 3.5v3.2h3.2"/>',
  fit: '<path d="M3.5 7.5v-4h4M12.5 3.5h4v4M16.5 12.5v4h-4M7.5 16.5h-4v-4"/>',
  plus: '<path d="M10 4.5v11M4.5 10h11"/>',
  minus: '<path d="M4.5 10h11"/>',
  open: '<path d="M3.5 6V4.5h5l1.5 2h6.5v9h-13z"/><path d="M3.5 8.5h13"/>',
  download: '<path d="M10 3.5v9M6.5 9l3.5 3.5L13.5 9"/><path d="M4 15.5h12"/>',
  link: '<path d="M8.5 11.5l3-3"/><path d="M9 6l1.4-1.4a3 3 0 0 1 4.2 4.2L13.2 10.2"/><path d="M11 14l-1.4 1.4a3 3 0 0 1-4.2-4.2L6.8 9.8"/>',
  image: '<rect x="3.5" y="4.5" width="13" height="11" rx="1.5"/><path d="M3.5 13l3.8-3.6 3 2.8 2.2-2 3.5 3.3"/><circle cx="13" cy="7.8" r="1.1"/>',
  sun: '<circle cx="10" cy="10" r="3.2"/><path d="M10 2.5v1.8M10 15.7v1.8M2.5 10h1.8M15.7 10h1.8M4.7 4.7l1.3 1.3M14 14l1.3 1.3M4.7 15.3L6 14M14 6l1.3-1.3"/>',
  moon: '<path d="M15.5 12.3A6 6 0 0 1 7.7 4.5a6 6 0 1 0 7.8 7.8z"/>',
  auto: '<circle cx="10" cy="10" r="6.5"/><path d="M10 3.5v13a6.5 6.5 0 0 0 0-13z" fill="currentColor" stroke="none"/>',
  check: '<path d="M4.5 10.5l3.5 3.5 7.5-8"/>',
  cross: '<path d="M5.5 5.5l9 9M14.5 5.5l-9 9"/>',
  keyboard: '<rect x="2.5" y="5.5" width="15" height="9" rx="1.5"/><path d="M5.5 8.5h1M9.5 8.5h1M13.5 8.5h1M6.5 11.5h7"/>',
  camera: '<path d="M10 3.5l6 3.5v6l-6 3.5-6-3.5v-6z"/><path d="M4 7l6 3.5 6-3.5M10 10.5v6"/>',
  book: '<path d="M10 5.5c-1.5-1.2-3.8-1.6-6.5-1.3v11c2.7-.3 5 .1 6.5 1.3 1.5-1.2 3.8-1.6 6.5-1.3v-11c-2.7-.3-5 .1-6.5 1.3z"/><path d="M10 5.5v11"/>',
  flag: '<path d="M5 17V3.5M5 4h9l-2 3 2 3H5"/>',
  pen: '<path d="M4 16l1-4 8-8 3 3-8 8z"/><path d="M11.5 5.5l3 3"/>',
  restore: '<path d="M4.5 10a5.5 5.5 0 1 0 1.8-4.1"/><path d="M4.5 3.5v3.2h3.2"/><path d="M10 7v3.2l2 1.3"/>',
  menu: '<path d="M3.5 6h13M3.5 10h13M3.5 14h13"/>',
};

export function icon(name: string, cls = 'ico'): string {
  return `<svg class="${cls}" viewBox="0 0 20 20" width="20" height="20" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">${P[name] ?? ''}</svg>`;
}

/** The turtle mark used in the wordmark: a plan-view arrowhead. */
export const MARK = `<svg class="mark" viewBox="0 0 24 24" width="22" height="22" aria-hidden="true" focusable="false"><path d="M12 2.5 19.5 20 12 16.2 4.5 20Z" fill="currentColor"/></svg>`;
