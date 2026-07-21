import { createContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import { zh } from './zh'; import { en } from './en'; import type { Language } from '../types/common';
type Dictionary = typeof zh;
type Context = { language:Language; setLanguage:(l:Language)=>void; t:Dictionary };
export const LanguageContext = createContext<Context | null>(null);
const languageStorageKey='factory-language-preference';
export function LanguageProvider({children}:{children:ReactNode}) {
  const [language,setLanguage] = useState<Language>(()=>localStorage.getItem(languageStorageKey)==='zh'?'zh':'en');
  useEffect(()=>{ localStorage.setItem(languageStorageKey,language); document.documentElement.lang=language==='zh'?'zh-CN':'en'; },[language]);
  const value=useMemo(()=>({language,setLanguage,t:language==='zh'?zh:en as Dictionary}),[language]);
  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}
