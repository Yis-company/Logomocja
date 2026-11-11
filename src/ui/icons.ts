const svg = (body: string) =>
  `<svg class="ico" viewBox="0 0 20 20" width="20" height="20" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">${body}</svg>`;

export const ICON = {
  play: svg('<path d="M6 3.5v13l10-6.5z" fill="currentColor"/>'),
  step: svg('<path d="M4 4v12l8-6z" fill="currentColor"/><path d="M15.5 4v12"/>'),
  pause: svg('<path d="M6.5 4v12M13.5 4v12" stroke-width="2.5"/>'),
  reset: svg('<path d="M4.5 10a5.5 5.5 0 1 0 1.700-4"/><path d="M4 3v3.5h3.5"/>'),
  fit: svg('<path d="M3 7V3h4M13 3h4v4M17 13v4h-4M7 17H3v-4"/><rect x="7" y="7" width="6" height="6"/>'),
  plus: svg('<path d="M10 4v12M4 10h12"/>'),
  minus: svg('<path d="M4 10h12"/>'),
  camera: svg('<path d="M10 2.5 16.5 6v8L10 17.5 3.5 14V6z"/><path d="M3.5 6 10 9.5 16.5 6M10 9.5v8"/>'),
  download: svg('<path d="M10 3v9.5M6 9l4 4 4-4M3.5 16.5h13"/>'),
  open: svg('<path d="M2.5 15.5v-11h5l2 2h8v9z"/>'),
  link: svg('<path d="M8.5 11.5a3.2 3.2 0 0 0 4.5 0l3-3a3.2 3.2 0 0 0-4.5-4.5l-1 1"/><path d="M11.5 8.5a3.2 3.2 0 0 0-4.5 0l-3 3a3.2 3.2 0 0 0 4.5 4.5l1-1"/>'),
  image: svg('<rect x="2.5" y="3.5" width="15" height="13"/><path d="m2.5 13.5 4-4 3.5 3.5 2.5-2.5 5 5"/><circle cx="13" cy="7.5" r="1.2"/>'),
  theme: svg('<circle cx="10" cy="10" r="6.5"/><path d="M10 3.5v13a6.5 6.5 0 0 0 0-13z" fill="currentColor"/>'),
  check: svg('<path d="m4 10.5 4 4 8-9"/>'),
  cross: svg('<path d="m5 5 10 10M15 5 5 15"/>'),
  undo: svg('<path d="M4 8h8a4 4 0 0 1 0 8H8"/><path d="M7 5 4 8l3 3"/>'),
  arrow: svg('<path d="M4 10h12M11 5l5 5-5 5"/>'),
};
