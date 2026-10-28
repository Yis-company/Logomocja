const paths:Record<string,string>={
 play:'<path d="m9 5 11 7-11 7V5Z"/>',pause:'<path d="M8 5v14M16 5v14"/>',step:'<path d="m5 5 10 7-10 7V5ZM19 5v14"/>',reset:'<path d="M3 10a9 9 0 1 1 2 8M3 4v6h6"/>',
 share:'<path d="M12 15V3m-4 4 4-4 4 4M5 12v7a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-7"/>',download:'<path d="M12 3v12m-4-4 4 4 4-4M5 16v4h14v-4"/>',upload:'<path d="M12 16V4m-4 4 4-4 4 4M4 16v4h16v-4"/>',
 plus:'<path d="M12 5v14M5 12h14"/>',minus:'<path d="M5 12h14"/>',fit:'<path d="M8 3H3v5m13-5h5v5M3 16v5h5m13-5v5h-5"/><path d="M8 8h8v8H8Z"/>',
 grid:'<rect x="4" y="4" width="16" height="16" rx="2"/><path d="M4 10h16M4 16h16M10 4v16M16 4v16"/>',moon:'<path d="M20 13A8 8 0 0 1 11 4 8.5 8.5 0 1 0 20 13Z"/>',sun:'<circle cx="12" cy="12" r="4"/><path d="M12 2v2m0 16v2M2 12h2m16 0h2M5 5l1.5 1.5m11 11L19 19M5 19l1.5-1.5m11-11L19 5"/>',monitor:'<rect x="3" y="4" width="18" height="13" rx="2"/><path d="M8 21h8m-4-4v4"/>',
 arrow:'<path d="M5 12h14m-5-5 5 5-5 5"/>',chevron:'<path d="m9 5 7 7-7 7"/>',down:'<path d="m6 9 6 6 6-6"/>',close:'<path d="m6 6 12 12M6 18 18 6"/>',check:'<path d="m5 12 4 4L19 6"/>',
 code:'<path d="m8 7-5 5 5 5m8-10 5 5-5 5m-3-14-2 18"/>',file:'<path d="M14 3H6a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9Z"/><path d="M14 3v6h6M8 14h8m-8 3h5"/>',folder:'<path d="M3 7V5h6l2 2h10v13H3Z"/>',
 book:'<path d="M12 5v15M12 5C8 2 3 3 3 3v16s5-1 9 1c4-2 9-1 9-1V3s-5-1-9 2Z"/>',trophy:'<path d="M7 3h10v6a5 5 0 0 1-10 0V3ZM7 5H3v3a4 4 0 0 0 4 4m10-7h4v3a4 4 0 0 1-4 4M12 14v7m-4 0h8"/>',
 cube:'<path d="m12 3 9 5v9l-9 5-9-5V8Zm0 0v10m0 9V12M3 8l9 5 9-5"/>',layers:'<path d="m12 3 10 6-10 6L2 9ZM2 14l10 6 10-6"/>',spark:'<path d="m12 3 2.5 6.5L21 12l-6.5 2.5L12 21l-2.5-6.5L3 12l6.5-2.5Z"/>',
 info:'<circle cx="12" cy="12" r="9"/><path d="M12 11v6m0-10v.1"/>',alert:'<path d="m12 3 10 18H2ZM12 9v5m0 3v.1"/>',keyboard:'<rect x="2" y="5" width="20" height="14" rx="2"/><path d="M5 9h1m3 0h1m3 0h1m3 0h1M5 12h1m3 0h1m3 0h1m3 0h1M7 16h10"/>',
 leaf:'<path d="M20 3C10 2 3 6 4 13a7 7 0 0 0 12 4c4-4 4-10 4-14ZM3 21 16 8"/>',undo:'<path d="m8 4-5 5 5 5M3 9h11a6 6 0 0 1 0 12h-2"/>',eye:'<path d="M2 12s4-7 10-7 10 7 10 7-4 7-10 7S2 12 2 12Z"/><circle cx="12" cy="12" r="3"/>',
};
export function icon(name:string,size=18) {return `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.65" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${paths[name]||paths.code}</svg>`;}
export const turtleLogo='<svg viewBox="0 0 48 48" fill="none" aria-hidden="true"><path d="m24 9 13 27H11Z" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"/><path d="M24 18v11m-5-1 5 8 5-8M14 23l-5-2m25 2 5-2M15 35l-5 5m23-5 5 5" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg>';
