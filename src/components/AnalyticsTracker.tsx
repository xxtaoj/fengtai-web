import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useCatalog } from '../context/CatalogContext';
import { useLanguage } from '../i18n/useLanguage';
import { trackPageView } from '../lib/siteApi';

const sessionKey = 'fengtai_analytics_session';

function getSessionId() {
  const existing = window.localStorage.getItem(sessionKey);
  if (existing) return existing;
  const next = typeof crypto.randomUUID === 'function'
    ? crypto.randomUUID()
    : `session-${Date.now()}-${Math.random().toString(36).slice(2, 12)}`;
  window.localStorage.setItem(sessionKey, next);
  return next;
}

export function AnalyticsTracker() {
  const location = useLocation();
  const { catalog } = useCatalog();
  const { language } = useLanguage();

  useEffect(() => {
    const productMatch = location.pathname.match(/^\/products\/([^/]+)$/);
    const productSlug = productMatch?.[1];
    const product = productSlug ? catalog.products.find(item => item.slug === productSlug) : undefined;
    const productName = product ? (language === 'zh' ? product.nameZh : product.nameEn) : undefined;

    trackPageView({
      sessionId: getSessionId(),
      path: `${location.pathname}${location.search}${location.hash}`,
      title: document.title,
      referrer: document.referrer,
      productSlug,
      productName
    });
  }, [catalog.products, language, location.hash, location.pathname, location.search]);

  return null;
}
