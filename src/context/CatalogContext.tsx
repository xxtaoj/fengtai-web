import type { ReactNode } from 'react';
import { SiteProvider, useSite } from './SiteContext';
import type { Catalog } from '../types/catalog';

type CatalogContextValue = {
  catalog: Catalog;
  setCatalog: (next: Catalog) => Promise<void>;
  resetCatalog: () => Promise<void>;
};

export function CatalogProvider({ children }: { children: ReactNode }) {
  return <SiteProvider>{children}</SiteProvider>;
}

export function useCatalog(): CatalogContextValue {
  const { site, saveSite, resetSite } = useSite();
  return {
    catalog: site.catalog,
    setCatalog: async (next) => {
      await saveSite({ ...site, catalog: next });
    },
    resetCatalog: async () => {
      await resetSite();
    },
  };
}
