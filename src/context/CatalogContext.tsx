import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import { loadCatalog, resetCatalog as resetStoredCatalog, saveCatalog } from '../lib/catalogStorage';
import type { Catalog } from '../types/catalog';

type CatalogContextValue = {
  catalog: Catalog;
  setCatalog: (next: Catalog) => void;
  resetCatalog: () => void;
};

const CatalogContext = createContext<CatalogContextValue | null>(null);

export function CatalogProvider({ children }: { children: ReactNode }) {
  const [catalog, setCatalogState] = useState<Catalog>(loadCatalog);

  const setCatalog = useCallback((next: Catalog) => {
    setCatalogState(next);
    saveCatalog(next);
  }, []);

  const resetCatalog = useCallback(() => {
    setCatalogState(resetStoredCatalog());
  }, []);

  useEffect(() => {
    function sync(event: StorageEvent) {
      if (event.key === 'fengtai-catalog-v1') setCatalogState(loadCatalog());
    }
    window.addEventListener('storage', sync);
    return () => window.removeEventListener('storage', sync);
  }, []);

  const value = useMemo(() => ({ catalog, setCatalog, resetCatalog }), [catalog, resetCatalog, setCatalog]);
  return <CatalogContext.Provider value={value}>{children}</CatalogContext.Provider>;
}

export function useCatalog() {
  const context = useContext(CatalogContext);
  if (!context) throw new Error('useCatalog requires CatalogProvider');
  return context;
}
