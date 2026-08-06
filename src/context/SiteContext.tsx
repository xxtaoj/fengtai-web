import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import { loadSite, resetSite as resetSiteApi, saveSite as saveSiteApi, saveSiteContent as saveSiteContentApi, uploadMedia as uploadMediaApi, listMedia, getSession, type AdminUser, type Permission } from '../lib/siteApi';
import { siteSeed } from '../data/siteSeed';
import type { SiteContent } from '../types/site';

type MediaRecord = Awaited<ReturnType<typeof listMedia>>[number];

type SiteContextValue = {
  site: SiteContent;
  loading: boolean;
  saving: boolean;
  media: MediaRecord[];
  authenticated: boolean;
  adminUser: AdminUser | null;
  permissions: Permission[];
  refreshSite: () => Promise<void>;
  saveSite: (next: SiteContent) => Promise<void>;
  saveSiteContent: (next: SiteContent) => Promise<void>;
  resetSite: () => Promise<void>;
  refreshMedia: () => Promise<void>;
  uploadMedia: (file: File) => Promise<string>;
  refreshSession: () => Promise<void>;
};

const SiteContext = createContext<SiteContextValue | null>(null);

function cloneSite(value: SiteContent): SiteContent {
  return JSON.parse(JSON.stringify(value)) as SiteContent;
}

export function SiteProvider({ children }: { children: ReactNode }) {
  const [site, setSite] = useState<SiteContent>(() => cloneSite(siteSeed));
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [media, setMedia] = useState<MediaRecord[]>([]);
  const [authenticated, setAuthenticated] = useState(false);
  const [adminUser, setAdminUser] = useState<AdminUser | null>(null);
  const [permissions, setPermissions] = useState<Permission[]>([]);

  const refreshSite = useCallback(async () => {
    try {
      const next = await loadSite();
      setSite(next);
    } catch {
      setSite(cloneSite(siteSeed));
    }
  }, []);

  const refreshMedia = useCallback(async () => {
    try {
      setMedia(await listMedia());
    } catch {
      setMedia([]);
    }
  }, []);

  const refreshSession = useCallback(async () => {
    try {
      const session = await getSession();
      setAuthenticated(session.authenticated);
      setAdminUser(session.user);
      setPermissions(session.permissions);
    } catch {
      setAuthenticated(false);
      setAdminUser(null);
      setPermissions([]);
    }
  }, []);

  useEffect(() => {
    let active = true;
    (async () => {
      try {
        const [nextSite, session] = await Promise.all([loadSite(), getSession()]);
        if (!active) return;
        setSite(nextSite);
        setAuthenticated(session.authenticated);
        setAdminUser(session.user);
        setPermissions(session.permissions);
      } catch {
        if (!active) return;
        setSite(cloneSite(siteSeed));
        setAdminUser(null);
        setPermissions([]);
      } finally {
        if (active) setLoading(false);
      }
    })();
    return () => {
      active = false;
    };
  }, []);

  const saveSite = useCallback(async (next: SiteContent) => {
    setSaving(true);
    try {
      const saved = await saveSiteApi(next);
      setSite(saved);
      return;
    } finally {
      setSaving(false);
    }
  }, []);

  const saveSiteContent = useCallback(async (next: SiteContent) => {
    setSaving(true);
    try {
      const saved = await saveSiteContentApi(next);
      setSite(saved);
    } finally {
      setSaving(false);
    }
  }, []);

  const resetSite = useCallback(async () => {
    setSaving(true);
    try {
      const fresh = await resetSiteApi();
      setSite(fresh);
    } finally {
      setSaving(false);
    }
  }, []);

  const uploadMedia = useCallback(async (file: File) => {
    const uploaded = await uploadMediaApi(file);
    await refreshMedia();
    return uploaded.publicUrl || uploaded.url;
  }, [refreshMedia]);

  const value = useMemo(() => ({
    site,
    loading,
    saving,
    media,
    authenticated,
    adminUser,
    permissions,
    refreshSite,
    saveSite,
    saveSiteContent,
    resetSite,
    refreshMedia,
    uploadMedia,
    refreshSession,
  }), [adminUser, authenticated, loading, media, permissions, refreshMedia, refreshSession, refreshSite, resetSite, saveSite, saveSiteContent, site, uploadMedia, saving]);

  return <SiteContext.Provider value={value}>{children}</SiteContext.Provider>;
}

export function useSite() {
  const context = useContext(SiteContext);
  if (!context) throw new Error('useSite requires SiteProvider');
  return context;
}
