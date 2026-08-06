import { useEffect, useRef, useState } from 'react';
import { ArrowUpRight } from 'lucide-react';
import { type FeatureShowcaseItem } from '../types/site';
import { useLanguage } from '../i18n/useLanguage';
import { useReducedMotion } from '../hooks/useReducedMotion';
import { LocalImage } from './Media';
import { PrimaryButton } from './Button';
import { useSite } from '../context/SiteContext';

type FeatureCardElement = HTMLElement | null;
type VisibleFeatureIds = Set<FeatureShowcaseItem['id']>;

function FeatureVideo({item,alt}:{item:FeatureShowcaseItem;alt:string}){
  const reducedMotion=useReducedMotion();
  if(reducedMotion||!item.video){
    return <LocalImage src={item.poster} alt={alt} className="aspect-video w-full rounded-xl object-cover"/>;
  }
  return <video
    src={item.video}
    poster={item.poster}
    autoPlay
    muted
    loop
    playsInline
    className="aspect-video w-full rounded-xl object-cover"
    aria-label={alt}
  >Your browser does not support video playback.</video>;
}

export function FeatureShowcase(){
  const {language}=useLanguage();
  const zh=language==='zh';
  const {site}=useSite();
  const featureShowcaseItems=site.features;
  const reducedMotion=useReducedMotion();
  const cardRefs=useRef<FeatureCardElement[]>([]);
  const activeRatios=useRef<Map<FeatureShowcaseItem['id'],number>>(new Map());
  const [activeId,setActiveId]=useState<FeatureShowcaseItem['id']>(featureShowcaseItems[0].id);
  const [visibleIds,setVisibleIds]=useState<VisibleFeatureIds>(()=>reducedMotion?new Set(featureShowcaseItems.map(item=>item.id)):new Set());

  useEffect(()=>{
    if(reducedMotion){
      setVisibleIds(new Set(featureShowcaseItems.map(item=>item.id)));
      return;
    }
    const revealObserver=new IntersectionObserver((entries)=>{
      entries.forEach(entry=>{
        if(!entry.isIntersecting)return;
        const id=(entry.target as HTMLElement).dataset.featureId;
        if(id){
          setVisibleIds(current=>new Set(current).add(id));
          revealObserver.unobserve(entry.target);
        }
      });
    },{threshold:0.15});

    const activeObserver=new IntersectionObserver((entries)=>{
      entries.forEach(entry=>{
        const id=(entry.target as HTMLElement).dataset.featureId;
        if(id)activeRatios.current.set(id,entry.isIntersecting?entry.intersectionRatio:0);
      });
      const [id,ratio]=[...activeRatios.current.entries()].sort((a,b)=>b[1]-a[1])[0]??[];
      if(id&&ratio>=0.6)setActiveId(id);
    },{threshold:[0,0.15,0.3,0.45,0.6,0.75,0.9,1]});

    const cards=cardRefs.current.filter((card):card is HTMLElement=>Boolean(card));
    cards.forEach(card=>{revealObserver.observe(card);activeObserver.observe(card)});
    return()=>{revealObserver.disconnect();activeObserver.disconnect();activeRatios.current.clear()};
  },[reducedMotion]);

  function navigateToCard(index:number){
    cardRefs.current[index]?.scrollIntoView({behavior:reducedMotion?'auto':'smooth',block:'center'});
  }

  return <section
    id="features"
    className="relative isolate overflow-x-clip bg-fixed bg-cover bg-center text-white"
    style={{backgroundImage:"url('/images/production-line.jpg')"}}
  >
    <div className="absolute inset-0 -z-10 bg-ink/90"/>
    <div className="industrial-grid absolute inset-0 -z-10"/>
    <div className="container-shell grid gap-12 py-20 lg:grid-cols-[20rem_minmax(0,1fr)] lg:gap-16 lg:py-28">
      <aside className="lg:sticky lg:top-24 lg:flex lg:min-h-[calc(100vh-7rem)] lg:flex-col lg:self-start lg:py-10">
        <div>
          <p className="text-xs font-bold uppercase tracking-[.24em] text-amber-400">{zh?'面料采购服务':'Fabric Sourcing'}</p>
          <h2 className="mt-5 text-3xl font-bold leading-[1.1] tracking-[-.035em] sm:text-4xl">{zh?'从现货到定织，按需求选择合作方式':'Stock fabrics or custom weaving'}</h2>
          <p className="mt-6 leading-7 text-white/65">{zh?'查看常规面料、来样定织和品控出货安排，直接进入寄样、规格确认或询盘沟通。':'Check available fabrics, discuss a sample, or plan production and shipment with our team.'}</p>
        </div>

        <nav className="mt-10 hidden gap-2 lg:grid" aria-label={zh?'功能卡片导航':'Feature card navigation'}>
          {featureShowcaseItems.map((item,index)=>{
            const active=item.id===activeId;
            return <button
              key={item.id}
              type="button"
              onClick={()=>navigateToCard(index)}
              className={`relative flex min-h-14 items-center justify-between rounded-lg border-b border-white/10 px-4 text-left text-sm font-semibold transition-[background-color,color] duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400 focus-visible:ring-offset-2 focus-visible:ring-offset-ink ${active?'bg-white/[.08] text-white':'bg-transparent text-white/55 hover:bg-white/[.045] hover:text-white/80'}`}
              aria-current={active?'true':undefined}
            >
              <span aria-hidden="true" className={`absolute inset-y-3 left-0 w-0.5 bg-amber-400 transition-opacity duration-300 ${active?'opacity-100':'opacity-0'}`}/>
              <span>{zh?item.navTitleZh:item.navTitleEn}</span>
              <span className={`ml-4 text-[10px] font-bold tracking-[.14em] transition-opacity ${active?'text-amber-400 opacity-100':'opacity-40'}`}>{item.tag}</span>
            </button>;
          })}
        </nav>

        <div className="mt-auto hidden border-t border-white/15 pt-8 lg:block">
          <p className="mb-5 text-sm leading-6 text-white/65">{zh?'有面料规格或实物样品？':'Have a fabric specification or physical sample?'}</p>
          <PrimaryButton to="/contact#inquiry" className="group rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-300 focus-visible:ring-offset-2 focus-visible:ring-offset-ink">{zh?'提交面料需求':'Send Fabric Requirement'}<ArrowUpRight className="transition-transform duration-200 group-hover:translate-x-0.5" size={17}/></PrimaryButton>
        </div>
      </aside>

      <div className="grid gap-10 lg:gap-24">
        {featureShowcaseItems.map((item,index)=>{
          const visible=visibleIds.has(item.id);
          return <div key={item.id} className="flex lg:min-h-[78vh] lg:items-center">
            <article
              ref={element=>{cardRefs.current[index]=element}}
              data-feature-id={item.id}
              className={`w-full rounded-2xl border border-white/10 bg-ink/95 p-5 shadow-lg shadow-black/10 transition-[opacity,transform,border-color] duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] hover:border-white/20 sm:p-7 ${visible?'translate-x-0 opacity-100':'translate-x-16 opacity-0'}`}
            >
              <FeatureVideo item={item} alt={zh?`${item.titleZh}相关画面`:`Visual for ${item.titleEn}`}/>
              <div className="px-1 pb-2 pt-7 sm:px-2 sm:pt-9">
                <div className="flex flex-col items-start gap-3 sm:flex-row sm:gap-5">
                  <span className="text-[10px] font-bold tracking-[.16em] text-amber-400 sm:mt-1">{item.tag}</span>
                  <div><h3 className="text-2xl font-semibold tracking-tight sm:text-3xl">{zh?item.titleZh:item.titleEn}</h3><p className="mt-4 max-w-2xl text-pretty leading-7 text-white/65">{zh?item.descriptionZh:item.descriptionEn}</p></div>
                </div>
              </div>
            </article>
          </div>;
        })}
        <div className="lg:hidden"><PrimaryButton to="/contact#inquiry" className="group w-full rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-300 focus-visible:ring-offset-2 focus-visible:ring-offset-ink">{zh?'提交面料需求':'Send Fabric Requirement'}<ArrowUpRight className="transition-transform duration-200 group-hover:translate-x-0.5" size={17}/></PrimaryButton></div>
      </div>
    </div>
  </section>;
}
