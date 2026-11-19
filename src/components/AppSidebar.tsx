import { Link, NavLink } from "react-router";
import { version } from "../../package.json";
import { benchmarkPath, studioPath } from "../routes";
import type { Theme } from "../theme";
import { Icon, TurtleMark } from "./Icon";
import { Button } from "./ui/button";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "./ui/sidebar";
const studioDestinations = [
  [studioPath, "Pracownia", "code"],
  ["/examples", "Przykłady", "grid"],
  ["/commands", "Polecenia", "book"],
  ["/challenges", "Wyzwania", "trophy"],
] as const;
const benchmarkDestination = [benchmarkPath, "Benchmark", "spark"] as const;
const destinations = import.meta.env.VITE_PAGES
  ? [benchmarkDestination, ...studioDestinations]
  : [...studioDestinations, benchmarkDestination];
export function AppSidebar({
  theme,
  toggleTheme,
}: {
  theme: Theme;
  toggleTheme: () => void;
}) {
  const { setOpenMobile } = useSidebar();
  const themeLabel = theme === "dark" ? "Jasny motyw" : "Ciemny motyw";
  return (
    <Sidebar className="app-sidebar">
      <SidebarHeader className="px-5 pt-7 pb-9">
        <Link
          className="brand"
          to="/"
          onClick={() => setOpenMobile(false)}
          aria-label="Logomocja — strona główna"
        >
          <TurtleMark size={34} />
          logomocja<span className="brand-dot">.</span>
        </Link>
      </SidebarHeader>
      <SidebarContent className="px-3">
        <p className="nav-caption">PRACOWNIA LOGO</p>
        <nav aria-label="Nawigacja główna">
          <SidebarMenu>
            {destinations.map(([path, label, icon]) => (
              <SidebarMenuItem key={path}>
                <NavLink
                  to={path}
                  end={path === studioPath}
                  onClick={() => setOpenMobile(false)}
                >
                  {({ isActive }) => (
                    <SidebarMenuButton
                      render={<span />}
                      isActive={isActive}
                      className="h-11 px-3 text-xs"
                    >
                      <Icon name={icon} size={18} />
                      <span>{label}</span>
                    </SidebarMenuButton>
                  )}
                </NavLink>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </nav>
      </SidebarContent>
      <SidebarFooter className="p-6 gap-3">
        <p>Szkice zapisane lokalnie</p>
        <Button
          variant="ghost"
          onClick={toggleTheme}
          aria-label={theme === "dark" ? "Włącz jasny motyw" : "Włącz ciemny motyw"}
        >
          <Icon name={theme === "dark" ? "sun" : "moon"} />
          {themeLabel}
        </Button>
        <span className="app-version" title={`Wersja ${version}`}>
          v{version}
        </span>
      </SidebarFooter>
    </Sidebar>
  );
}
