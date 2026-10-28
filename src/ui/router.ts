import { parseHash, type Route } from './share';

export interface Page {
  el: HTMLElement;
  title: string;
  onShow?(route: Route): void;
  onHide?(): void;
  onShortcut?(name: 'run' | 'step' | 'pause' | 'reset'): void;
}

export const ROUTES = {
  pracownia: 'Pracownia',
  przyklady: 'Przykłady',
  wyzwania: 'Wyzwania',
  instrukcja: 'Instrukcja',
} as const;
export type RouteName = keyof typeof ROUTES;

export class Router {
  private pages = new Map<RouteName, Page>();
  current: RouteName | null = null;
  /** Called before a route is shown; may handle (and consume) the route. */
  beforeShow: (name: RouteName, route: Route) => void = () => {};
  afterShow: (name: RouteName) => void = () => {};

  add(name: RouteName, page: Page): void {
    this.pages.set(name, page);
  }

  page(name: RouteName): Page | undefined {
    return this.pages.get(name);
  }

  start(): void {
    window.addEventListener('hashchange', () => this.render());
    this.render();
  }

  go(name: RouteName, rest = ''): void {
    const target = `#/${name}${rest ? '/' + rest : ''}`;
    if (location.hash === target) this.render();
    else location.hash = target;
  }

  render(): void {
    const route = parseHash();
    const first = route.path[0] as RouteName | undefined;
    const name: RouteName = first && first in ROUTES ? first : 'pracownia';
    if (this.current && this.current !== name) this.pages.get(this.current)?.onHide?.();
    for (const [n, p] of this.pages) p.el.hidden = n !== name;
    this.current = name;
    const page = this.pages.get(name)!;
    this.beforeShow(name, route);
    page.onShow?.(route);
    document.title = `${page.title} – Logomocja`;
    this.afterShow(name);
  }
}
