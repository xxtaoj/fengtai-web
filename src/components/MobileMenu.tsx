import { Mail, Phone, Video, X } from 'lucide-react';
import { NavLink } from 'react-router-dom';
import { useSite } from '../context/SiteContext';
import { useLanguage } from '../i18n/useLanguage';
import { LanguageSwitcher } from './LanguageSwitcher';
import { PrimaryButton } from './Button';

export function MobileMenu({open,onClose}:{open:boolean;onClose:()=>void}){
  const {language,t}=useLanguage();
  const zh=language==='zh';
  const {site}=useSite();
  return <div className={`fixed inset-0 z-[60] transition ${open?'pointer-events-auto opacity-100':'pointer-events-none opacity-0'}`} aria-hidden={!open}>
    <button className="absolute inset-0 bg-ink/70" aria-label="Close menu" onClick={onClose}/>
    <aside className={`absolute right-0 top-0 flex h-full w-[min(90vw,390px)] flex-col overflow-y-auto bg-white p-6 shadow-2xl transition-transform duration-300 ${open?'translate-x-0':'translate-x-full'}`} role="dialog" aria-modal="true" aria-label="Navigation">
      <div className="flex items-center justify-between border-b border-line pb-4">
        <strong className="text-ink">{zh?site.company.chineseName:site.company.englishName}</strong>
        <button onClick={onClose} className="grid size-11 place-items-center" aria-label="Close menu"><X/></button>
      </div>
      <nav className="mt-5 grid gap-1">
        {site.navigation.map(item=><div key={item.to} className="border-b border-line py-3">
          <NavLink to={item.to} end={item.to==='/'} onClick={onClose} className={({isActive})=>`block font-semibold ${isActive?'text-accent':'text-ink'}`}>{zh?item.zh:item.en}</NavLink>
          {item.children&&<div className="mt-3 grid gap-2 pl-3">
            {item.children.map(child=><div key={child.href}>
              <a href={child.href} onClick={onClose} className="text-sm font-semibold text-body hover:text-accent">{zh?child.zh:child.en}</a>
              {child.children&&<div className="mt-1 flex flex-wrap gap-1">
                {child.children.map(grandChild=><a key={grandChild.href} href={grandChild.href} onClick={onClose} className="bg-canvas px-2 py-1 text-xs text-muted hover:text-accent">{zh?grandChild.zh:grandChild.en}</a>)}
              </div>}
            </div>)}
          </div>}
        </div>)}
      </nav>
      <div className="mt-auto border-t border-line pt-5">
        <LanguageSwitcher/>
        <div className="mb-5 mt-4 grid gap-2 text-sm">
          <a href={`tel:${site.company.phone.replace(/[^\d+]/g,'')}`} className="flex gap-2"><Phone size={17}/>{site.company.phone}</a>
          <a href={`tel:${site.company.wendyPhone.replace(/[^\d+]/g,'')}`} className="flex gap-2"><Phone size={17}/>{site.company.wendyContact}: {site.company.wendyPhone}</a>
          <a href={`facetime:${site.company.facetimePhone.replace(/\s/g,'')}`} className="flex gap-2"><Video size={17}/>FaceTime {zh?'（美国）':'(U.S.)'}: {site.company.facetimePhone}</a>
          <span className="flex gap-2"><Mail size={17}/>{site.company.email}</span>
        </div>
        <PrimaryButton to="/contact#inquiry" className="w-full">{t.common.quote}</PrimaryButton>
      </div>
    </aside>
  </div>;
}
