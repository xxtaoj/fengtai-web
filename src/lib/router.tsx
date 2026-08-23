import React, { createContext, isValidElement, useContext, useEffect, useMemo, useState, type AnchorHTMLAttributes, type ReactElement, type ReactNode } from 'react';

type LocationState = {
  pathname: string;
  search: string;
  hash: string;
};

type RouterContextValue = {
  location: LocationState;
  navigate: (to: string, options?: { replace?: boolean }) => void;
};

const RouterContext = createContext<RouterContextValue | null>(null);
const ParamsContext = createContext<Record<string, string>>({});
const navigationEvent = 'fengtai:navigate';

function readLocation(): LocationState {
  return {
    pathname: window.location.pathname || '/',
    search: window.location.search || '',
    hash: window.location.hash || ''
  };
}

function safeTo(to: string) {
  if (!to || /[\u0000-\u001f\\]/.test(to)) return '/';
  if (/^\s*javascript:/i.test(to)) return '/';
  if (/^[a-z][a-z\d+.-]*:/i.test(to)) return '/';
  if (to.startsWith('//')) return '/';
  return to.startsWith('/') || to.startsWith('#') ? to : `/${to}`;
}

function pathOnly(to: string) {
  return safeTo(to).split(/[?#]/, 1)[0] || '/';
}

export function BrowserRouter({ children }: { children: ReactNode }) {
  const [location, setLocation] = useState<LocationState>(() => readLocation());

  useEffect(() => {
    const update = () => setLocation(readLocation());
    window.addEventListener('popstate', update);
    window.addEventListener(navigationEvent, update);
    return () => {
      window.removeEventListener('popstate', update);
      window.removeEventListener(navigationEvent, update);
    };
  }, []);

  const value = useMemo<RouterContextValue>(() => ({
    location,
    navigate(to, options) {
      const next = safeTo(to);
      if (options?.replace) window.history.replaceState(null, '', next);
      else window.history.pushState(null, '', next);
      window.dispatchEvent(new Event(navigationEvent));
    }
  }), [location]);

  return <RouterContext.Provider value={value}>{children}</RouterContext.Provider>;
}

function useRouter() {
  const router = useContext(RouterContext);
  if (!router) throw new Error('Router components must be used inside BrowserRouter');
  return router;
}

export function useLocation() {
  return useRouter().location;
}

export function useParams() {
  return useContext(ParamsContext);
}

export function useSearchParams() {
  const { location, navigate } = useRouter();
  const params = useMemo(() => new URLSearchParams(location.search), [location.search]);
  function setSearchParams(next: URLSearchParams | Record<string, string> | string) {
    const value = next instanceof URLSearchParams ? next.toString() : typeof next === 'string' ? next.replace(/^\?/, '') : new URLSearchParams(next).toString();
    navigate(`${location.pathname}${value ? `?${value}` : ''}${location.hash}`, { replace: false });
  }
  return [params, setSearchParams] as const;
}

type LinkProps = Omit<AnchorHTMLAttributes<HTMLAnchorElement>, 'href'> & {
  to: string;
  replace?: boolean;
};

export function Link({ to, replace, onClick, target, ...props }: LinkProps) {
  const { navigate } = useRouter();
  const href = safeTo(to);
  return <a
    {...props}
    href={href}
    target={target}
    onClick={event => {
      onClick?.(event);
      if (event.defaultPrevented || target || event.button !== 0 || event.metaKey || event.altKey || event.ctrlKey || event.shiftKey) return;
      event.preventDefault();
      navigate(href, { replace });
    }}
  />;
}

type NavLinkProps = Omit<LinkProps, 'className'> & {
  end?: boolean;
  className?: string | ((state: { isActive: boolean }) => string);
};

export function NavLink({ to, end, className, ...props }: NavLinkProps) {
  const { location } = useRouter();
  const targetPath = pathOnly(to);
  const isActive = end ? location.pathname === targetPath : location.pathname === targetPath || location.pathname.startsWith(`${targetPath}/`);
  const nextClassName = typeof className === 'function' ? className({ isActive }) : className;
  return <Link to={to} className={nextClassName} {...props} />;
}

type RouteProps = {
  path: string;
  element: ReactNode;
};

export function Route(_props: RouteProps) {
  return null;
}

function segmentMatch(pattern: string, pathname: string) {
  if (pattern === '*') return { matched: true, params: {} };
  const patternParts = pattern.replace(/^\/|\/$/g, '').split('/').filter(Boolean);
  const pathParts = pathname.replace(/^\/|\/$/g, '').split('/').filter(Boolean);
  if (patternParts.length !== pathParts.length) return { matched: false, params: {} };
  const params: Record<string, string> = {};
  for (let index = 0; index < patternParts.length; index += 1) {
    const patternPart = patternParts[index];
    const pathPart = pathParts[index];
    if (patternPart.startsWith(':')) {
      try {
        params[patternPart.slice(1)] = decodeURIComponent(pathPart);
      } catch {
        params[patternPart.slice(1)] = pathPart;
      }
      continue;
    }
    if (patternPart !== pathPart) return { matched: false, params: {} };
  }
  return { matched: true, params };
}

export function Routes({ children }: { children: ReactNode }) {
  const { location } = useRouter();
  const routes = React.Children.toArray(children).filter(isValidElement) as Array<ReactElement<RouteProps>>;
  for (const route of routes) {
    const { matched, params } = segmentMatch(route.props.path, location.pathname);
    if (matched) return <ParamsContext.Provider value={params}>{route.props.element}</ParamsContext.Provider>;
  }
  return null;
}

export function Navigate({ to, replace }: { to: string; replace?: boolean }) {
  const { navigate } = useRouter();
  useEffect(() => {
    navigate(to, { replace });
  }, [navigate, replace, to]);
  return null;
}
