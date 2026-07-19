import { useEffect, useRef, useState } from 'react';
import { ArrowUpRight } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { company } from '../data/company';
import { capsuleMenuItems } from '../data/navigation';
import { useLanguage } from '../i18n/useLanguage';
import { LanguageSwitcher } from './LanguageSwitcher';

export function Header(){
  const {language}=useLanguage();
  const zh=language==='zh';
  const location=useLocation();
  const [open,setOpen]=useState(false);
  const navigationRef=useRef<HTMLElement>(null);
  const menuId='capsule-navigation-menu';

  useEffect(()=>setOpen(false),[location.pathname,location.hash]);
  useEffect(()=>{
    function handleKeyDown(event:KeyboardEvent){if(event.key==='Escape')setOpen(false)}
    function handlePointerDown(event:PointerEvent){
      if(open&&!navigationRef.current?.contains(event.target as Node))setOpen(false);
    }
    document.addEventListener('keydown',handleKeyDown);
    document.addEventListener('pointerdown',handlePointerDown);
    return()=>{document.removeEventListener('keydown',handleKeyDown);document.removeEventListener('pointerdown',handlePointerDown)};
  },[open]);

  return <header
    ref={navigationRef}
    className="fixed left-1/2 top-4 z-50 w-[min(calc(100%-2rem),70rem)] -translate-x-1/2"
  >
    <div className="relative flex min-h-16 items-center justify-between rounded-full border border-white/70 bg-white/95 px-4 shadow-[0_12px_36px_-18px_rgba(15,23,42,.4)] backdrop-blur-xl sm:px-6">
      <Link to="/" className="flex min-w-0 items-center gap-3" aria-label={zh?'返回首页':'Back to home'}>
        <span className="grid size-8 shrink-0 place-items-center rounded-full bg-ink text-[10px] font-bold tracking-widest text-white">{company.brandName.slice(0,2)}</span>
        <span className="truncate text-sm font-bold text-ink sm:text-base"><span className="sm:hidden">{zh?company.chineseName:'FENGTAI YONGSHENG'}</span><span className="hidden sm:inline">{zh?company.chineseName:company.englishName}</span></span>
      </Link>

      <button
        type="button"
        onClick={()=>setOpen(current=>!current)}
        className="relative grid size-11 shrink-0 place-items-center rounded-full bg-ink text-white transition-colors hover:bg-accent"
        aria-expanded={open}
        aria-controls={menuId}
        aria-label={open?(zh?'关闭导航菜单':'Close navigation menu'):(zh?'打开导航菜单':'Open navigation menu')}
      >
        <span className={`absolute left-1/2 top-1/2 h-[2px] w-5 -translate-x-1/2 bg-current transition-transform duration-300 ease-[cubic-bezier(0.77,0,0.175,1)] ${open?'rotate-45':'-translate-y-[4px]'}`}/>
        <span className={`absolute left-1/2 top-1/2 h-[2px] w-5 -translate-x-1/2 bg-current transition-transform duration-300 ease-[cubic-bezier(0.77,0,0.175,1)] ${open?'-rotate-45':'translate-y-[4px]'}`}/>
      </button>
    </div>

    <div
      id={menuId}
      className={`absolute inset-x-0 top-[calc(100%+.65rem)] max-h-[calc(100vh-7rem)] origin-top overflow-y-auto rounded-[1.5rem] border border-line bg-white p-4 shadow-[0_30px_70px_-32px_rgba(15,23,42,.5)] transition-[opacity,transform] duration-300 ease-[cubic-bezier(0.77,0,0.175,1)] sm:p-6 ${open?'pointer-events-auto translate-y-0 scale-100 opacity-100 animate-fade-in-down':'pointer-events-none -translate-y-2 scale-[.97] opacity-0'}`}
      aria-hidden={!open}
    >
      <nav className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3" aria-label={zh?'站点导航':'Site navigation'}>
        {capsuleMenuItems.map(item=><article
          key={item.href}
          className="rounded-xl bg-slate-50 p-4 transition-colors hover:bg-accent-soft"
        >
          <a
            href={item.href}
            onClick={()=>setOpen(false)}
            className="group flex min-h-12 items-center justify-between"
            tabIndex={open?0:-1}
          >
            <span><small className="block text-[10px] font-bold uppercase tracking-[.16em] text-muted">{zh?item.eyebrowZh:item.eyebrowEn}</small><strong className="mt-1 block text-sm text-ink">{zh?item.labelZh:item.labelEn}</strong></span>
            <ArrowUpRight size={17} className="text-muted transition group-hover:text-accent"/>
          </a>
          {item.children&&<div className="mt-3 grid gap-2 border-t border-line pt-3">
            {item.children.map(child=><div key={child.href}>
              <a href={child.href} onClick={()=>setOpen(false)} tabIndex={open?0:-1} className="block text-xs font-semibold leading-5 text-body hover:text-accent">{zh?child.zh:child.en}</a>
              {child.children&&<div className="mt-1 flex flex-wrap gap-1">
                {child.children.map(grandChild=><a key={grandChild.href} href={grandChild.href} onClick={()=>setOpen(false)} tabIndex={open?0:-1} className="bg-white px-2 py-1 text-[11px] font-semibold text-muted hover:text-accent">{zh?grandChild.zh:grandChild.en}</a>)}
              </div>}
            </div>)}
          </div>}
        </article>)}
      </nav>
      <div className="mt-4 flex flex-col gap-3 border-t border-line pt-4 sm:flex-row sm:items-center sm:justify-between">
        <LanguageSwitcher/>
        <Link to="/contact#inquiry" onClick={()=>setOpen(false)} tabIndex={open?0:-1} className="inline-flex min-h-11 items-center justify-center rounded-md bg-accent px-5 text-sm font-semibold text-white transition hover:bg-accent-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 focus-visible:ring-offset-2">{zh?'发送面料询盘':'Send Fabric Inquiry'}</Link>
      </div>
    </div>
  </header>;
}
