import { useContext } from 'react'; import { LanguageContext } from './LanguageContext';
export function useLanguage(){ const ctx=useContext(LanguageContext); if(!ctx) throw new Error('useLanguage requires LanguageProvider'); return ctx; }
