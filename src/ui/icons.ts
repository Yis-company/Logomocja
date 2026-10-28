// Proste ikony liniowe (24×24, obrys currentColor).
const s = (d: string) => `<path d="${d}" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>`;

export const ICONS = {
  run: '<path d="M7 4.5v15l12-7.5z" fill="currentColor"/>',
  step: '<path d="M5 5v14l9-7z" fill="currentColor"/><path d="M17 5v14" stroke="currentColor" stroke-width="2.6" stroke-linecap="round"/>',
  pause: '<rect x="6" y="5" width="4" height="14" rx="1" fill="currentColor"/><rect x="14" y="5" width="4" height="14" rx="1" fill="currentColor"/>',
  resume: '<path d="M7 4.5v15l12-7.5z" fill="currentColor"/>',
  reset: s('M4 12a8 8 0 1 0 2.4-5.7M4 4v4h4'),
  plus: s('M12 5v14M5 12h14'),
  minus: s('M5 12h14'),
  fit: s('M4 9V4h5M20 9V4h-5M4 15v5h5M20 15v5h-5'),
  target: s('M12 3v4M12 17v4M3 12h4M17 12h4') + '<circle cx="12" cy="12" r="3" fill="none" stroke="currentColor" stroke-width="2"/>',
  image: s('M4 5h16v14H4zM4 16l5-5 4 4 2-2 5 5') + '<circle cx="15.5" cy="9" r="1.6" fill="currentColor"/>',
  download: s('M12 4v11M7 10l5 5 5-5M5 20h14'),
  upload: s('M12 20V9M7 14l5-5 5 5M5 4h14'),
  share: s('M10 14a4 4 0 0 0 5.7 0l3-3a4 4 0 0 0-5.7-5.7l-1 1M14 10a4 4 0 0 0-5.7 0l-3 3a4 4 0 0 0 5.7 5.7l1-1'),
  sun: '<circle cx="12" cy="12" r="4" fill="none" stroke="currentColor" stroke-width="2"/>' + s('M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4'),
  moon: s('M20 14.5A8 8 0 0 1 9.5 4a8 8 0 1 0 10.5 10.5z'),
  auto: '<circle cx="12" cy="12" r="8" fill="none" stroke="currentColor" stroke-width="2"/><path d="M12 4a8 8 0 0 1 0 16z" fill="currentColor"/>',
  keyboard: '<rect x="3" y="6" width="18" height="12" rx="2" fill="none" stroke="currentColor" stroke-width="2"/>' + s('M7 10h.01M11 10h.01M15 10h.01M7 14h10'),
  check: s('M5 12.5l4.5 4.5L19 7.5'),
  cross: s('M6 6l12 12M18 6L6 18'),
  back: s('M15 5l-7 7 7 7'),
  eye: s('M2 12s3.6-7 10-7 10 7 10 7-3.6 7-10 7S2 12 2 12z') + '<circle cx="12" cy="12" r="3" fill="none" stroke="currentColor" stroke-width="2"/>',
  book: s('M4 5a2 2 0 0 1 2-2h13v16H6a2 2 0 0 0-2 2zM4 19V5M8 7h7'),
  trophy: s('M8 4h8v5a4 4 0 0 1-8 0zM8 6H4a3 3 0 0 0 4 4M16 6h4a3 3 0 0 1-4 4M12 13v4M8 21h8M9 17h6'),
  grid: s('M4 4h7v7H4zM13 4h7v7h-7zM4 13h7v7H4zM13 13h7v7h-7z'),
  code: s('M9 7l-5 5 5 5M15 7l5 5-5 5'),
  copy: s('M9 9h11v11H9zM5 15H4V4h11v1'),
  restore: s('M3 12a9 9 0 1 0 3-6.7L3 8M3 3v5h5'),
  info: '<circle cx="12" cy="12" r="9" fill="none" stroke="currentColor" stroke-width="2"/>' + s('M12 11v6M12 7.5v.01'),
  warn: s('M12 3l10 18H2zM12 10v5M12 18v.01'),
  turtle: '<ellipse cx="12" cy="13" rx="5.2" ry="6" fill="currentColor"/><circle cx="12" cy="5" r="2.4" fill="currentColor"/><g fill="currentColor"><ellipse cx="6" cy="9" rx="2" ry="1.4" transform="rotate(-35 6 9)"/><ellipse cx="18" cy="9" rx="2" ry="1.4" transform="rotate(35 18 9)"/><ellipse cx="6.4" cy="17.5" rx="2" ry="1.4" transform="rotate(35 6.4 17.5)"/><ellipse cx="17.6" cy="17.5" rx="2" ry="1.4" transform="rotate(-35 17.6 17.5)"/></g>',
};

export type IconName = keyof typeof ICONS;
