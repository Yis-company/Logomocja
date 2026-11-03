import {
  Play, Pause, StepForward, RotateCcw, Maximize, ZoomIn, ZoomOut, Sun, Moon, Monitor, Keyboard,
  FolderOpen, Download, Link, Image, Check, X, Undo2, Box, Square, Eye, EyeOff, Trophy, ChevronRight,
  BookOpen, LayoutGrid, PenLine, CircleAlert, Copy, Tag, LogOut, createElement, type IconNode,
} from 'lucide';

const ICONS = {
  play: Play, pause: Pause, step: StepForward, reset: RotateCcw, fit: Maximize, zoomIn: ZoomIn,
  zoomOut: ZoomOut, sun: Sun, moon: Moon, monitor: Monitor, keyboard: Keyboard, open: FolderOpen,
  download: Download, link: Link, image: Image, check: Check, x: X, undo: Undo2, cube: Box,
  square: Square, eye: Eye, eyeOff: EyeOff, trophy: Trophy, chevron: ChevronRight, book: BookOpen,
  grid: LayoutGrid, pen: PenLine, alert: CircleAlert, copy: Copy, tag: Tag, exit: LogOut,
} satisfies Record<string, IconNode>;

export type IconName = keyof typeof ICONS;

/** One stroke family for every icon: lucide at 1.75px. */
export function icon(name: IconName, size = 18): SVGElement {
  const el = createElement(ICONS[name]) as unknown as SVGElement;
  el.setAttribute('width', String(size));
  el.setAttribute('height', String(size));
  el.setAttribute('stroke-width', '1.75');
  el.setAttribute('aria-hidden', 'true');
  el.setAttribute('focusable', 'false');
  el.classList.add('icon');
  return el;
}
