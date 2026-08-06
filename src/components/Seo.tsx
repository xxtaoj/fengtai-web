import { useEffect } from 'react';
import { useSite } from '../context/SiteContext';
import { useLanguage } from '../i18n/useLanguage';
export function Seo({title,description}:{title:{zh:string;en:string};description:{zh:string;en:string}}){const{language}=useLanguage();const{site}=useSite();useEffect(()=>{const zh=language==='zh';document.title=`${zh?title.zh:title.en} | ${zh?site.company.chineseName:site.company.englishName}`;let meta=document.querySelector('meta[name="description"]');if(!meta){meta=document.createElement('meta');meta.setAttribute('name','description');document.head.appendChild(meta)}meta.setAttribute('content',zh?description.zh:description.en)},[language,title.zh,title.en,description.zh,description.en,site.company.chineseName,site.company.englishName]);return null}
