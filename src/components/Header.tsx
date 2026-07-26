import { useEffect, useRef, useState } from 'react';
import { ArrowUpRight, ChevronDown } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { company } from '../data/company';
import { navigation } from '../data/navigation';
import { useLanguage } from '../i18n/useLanguage';

export function Header(){
  const {language,setLanguage}=useLanguage();
  const zh=language==='zh';
  const location=useLocation();
  const [open,setOpen]=useState(false);
  const [languageOpen,setLanguageOpen]=useState(false);
  const navigationRef=useRef<HTMLElement>(null);
  const menuId='site-navigation-menu';
  const languageMenuId='site-language-menu';
  const headerNavigation=navigation.filter(item=>item.to!=='/');

  useEffect(()=>{setOpen(false);setLanguageOpen(false)},[location.pathname,location.hash]);
  useEffect(()=>{
    function handleKeyDown(event:KeyboardEvent){if(event.key==='Escape'){setOpen(false);setLanguageOpen(false)}}
    function handlePointerDown(event:PointerEvent){
      if((open||languageOpen)&&!navigationRef.current?.contains(event.target as Node)){
        setOpen(false);
        setLanguageOpen(false);
      }
    }
    document.addEventListener('keydown',handleKeyDown);
    document.addEventListener('pointerdown',handlePointerDown);
    return()=>{document.removeEventListener('keydown',handleKeyDown);document.removeEventListener('pointerdown',handlePointerDown)};
  },[open,languageOpen]);

  return <header
    ref={navigationRef}
    className="fixed left-1/2 top-2 z-50 w-[calc(100%-1rem)] -translate-x-1/2"
  >
    <div className="relative flex min-h-[4.5rem] items-center rounded-md border border-white/80 bg-white/95 px-3 shadow-[0_18px_48px_-28px_rgba(15,23,42,.55)] backdrop-blur-xl sm:px-5">
      <Link to="/" className="mr-6 flex h-16 w-36 shrink-0 items-center justify-start sm:w-40 lg:mr-8" aria-label={zh?'返回首页':'Back to home'}>
        <img
          src="/images/logo.png"
          alt={zh?company.chineseName:company.englishName}
          className="max-h-14 w-full object-contain object-left drop-shadow-[0_6px_12px_rgba(15,23,42,.12)]"
        />
      </Link>

      <nav className="hidden min-w-0 flex-1 items-center gap-6 lg:flex xl:gap-8" aria-label={zh?'主导航':'Main navigation'}>
        {headerNavigation.map(item=>{
          const active=location.pathname===item.to || (item.to!=='/'&&location.pathname.startsWith(`${item.to}/`));
          return <Link
            key={item.to}
            to={item.to}
            className={`whitespace-nowrap text-sm font-bold text-ink transition hover:text-accent xl:text-base ${active?'text-accent':''}`}
          >
            {zh?item.zh:item.en}
          </Link>;
        })}
      </nav>

      <div className="ml-auto hidden items-center gap-5 lg:flex">
        <Link to="/contact#inquiry" className="group inline-flex min-h-12 items-center gap-2 text-sm font-bold tracking-[.04em] text-[#0B4AA2] transition-colors hover:text-[#0D56BA] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0B4AA2]/35 focus-visible:ring-offset-2">
          <span>{zh?'业务咨询':'Contact sales'}</span>
          <span className="grid size-8 place-items-center rounded-full bg-[#E5EEF9] text-[#0B4AA2] transition duration-300 group-hover:translate-x-0.5 group-hover:bg-[#0B4AA2] group-hover:text-white">
            <ArrowUpRight size={16}/>
          </span>
        </Link>
        <div className="relative">
          <button
            type="button"
            onClick={()=>setLanguageOpen(current=>!current)}
            className="inline-flex min-h-12 items-center gap-1 rounded-md px-3 text-sm font-bold text-ink transition hover:bg-slate-100"
            aria-expanded={languageOpen}
            aria-controls={languageMenuId}
          >
            {zh?'中文':'English'}
            <ChevronDown size={16} className={`transition-transform ${languageOpen?'rotate-180':''}`}/>
          </button>
          <div
            id={languageMenuId}
            className={`absolute right-0 top-[calc(100%+.55rem)] w-32 overflow-hidden rounded-md border border-line bg-white p-1 shadow-[0_24px_56px_-28px_rgba(15,23,42,.55)] transition-[opacity,transform] ${languageOpen?'pointer-events-auto translate-y-0 opacity-100':'pointer-events-none -translate-y-1 opacity-0'}`}
          >
            <button type="button" onClick={()=>{setLanguage('zh');setLanguageOpen(false)}} className={`block min-h-10 w-full rounded px-3 text-left text-sm font-semibold ${zh?'bg-accent-soft text-accent':'text-body hover:bg-slate-50'}`}>中文</button>
            <button type="button" onClick={()=>{setLanguage('en');setLanguageOpen(false)}} className={`block min-h-10 w-full rounded px-3 text-left text-sm font-semibold ${!zh?'bg-accent-soft text-accent':'text-body hover:bg-slate-50'}`}>English</button>
          </div>
        </div>
      </div>

      <button
        type="button"
        onClick={()=>setOpen(current=>!current)}
        className="relative ml-auto grid size-11 shrink-0 place-items-center rounded-full bg-ink text-white transition-colors hover:bg-accent lg:hidden"
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
      className={`absolute inset-x-0 top-[calc(100%+.55rem)] max-h-[calc(100vh-7rem)] origin-top overflow-y-auto rounded-xl border border-line bg-white p-4 shadow-[0_30px_70px_-32px_rgba(15,23,42,.5)] transition-[opacity,transform] duration-300 ease-[cubic-bezier(0.77,0,0.175,1)] sm:p-6 lg:hidden ${open?'pointer-events-auto translate-y-0 scale-100 opacity-100 animate-fade-in-down':'pointer-events-none -translate-y-2 scale-[.97] opacity-0'}`}
      aria-hidden={!open}
    >
      <nav className="grid gap-3 sm:grid-cols-2" aria-label={zh?'站点导航':'Site navigation'}>
        {headerNavigation.map(item=><article
          key={item.to}
          className="rounded-lg bg-slate-50 p-4 transition-colors hover:bg-accent-soft"
        >
          <Link
            to={item.to}
            onClick={()=>setOpen(false)}
            className="group flex min-h-12 items-center justify-between"
            tabIndex={open?0:-1}
          >
            <span><small className="block text-[10px] font-bold uppercase tracking-[.16em] text-muted">{zh?item.eyebrowZh:item.eyebrowEn}</small><strong className="mt-1 block text-sm text-ink">{zh?item.zh:item.en}</strong></span>
            <ArrowUpRight size={17} className="text-muted transition group-hover:text-accent"/>
          </Link>
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
        <div className="flex items-center gap-2 text-sm font-semibold text-body">
          <button type="button" onClick={()=>setLanguage('zh')} tabIndex={open?0:-1} className={`min-h-10 rounded px-3 ${zh?'bg-accent-soft text-accent':'hover:bg-slate-50'}`} aria-pressed={zh}>中文</button>
          <button type="button" onClick={()=>setLanguage('en')} tabIndex={open?0:-1} className={`min-h-10 rounded px-3 ${!zh?'bg-accent-soft text-accent':'hover:bg-slate-50'}`} aria-pressed={!zh}>English</button>
        </div>
        <Link to="/contact#inquiry" onClick={()=>setOpen(false)} tabIndex={open?0:-1} className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full border border-[#0B4AA2]/15 bg-[#E5EEF9] px-5 text-sm font-bold text-[#0B4AA2] transition hover:bg-[#0B4AA2] hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0B4AA2]/35 focus-visible:ring-offset-2">{zh?'业务咨询':'Contact sales'}<ArrowUpRight size={16}/></Link>
      </div>
    </div>
  </header>;
}
