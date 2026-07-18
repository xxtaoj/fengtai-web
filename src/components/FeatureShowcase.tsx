import { useEffect, useRef, useState } from 'react';
import { ArrowUpRight } from 'lucide-react';
import { featureShowcaseItems, type FeatureShowcaseItem } from '../data/features';
import { useLanguage } from '../i18n/useLanguage';
import { useReducedMotion } from '../hooks/useReducedMotion';
import { LocalImage } from './Media';
import { PrimaryButton } from './Button';

type FeatureCardElement = HTMLElement | null;
type VisibleFeatureIds = Set<FeatureShowcaseItem['id']>;

function FeatureVideo({item,alt}:{item:FeatureShowcaseItem;alt:string}){
  const reducedMotion=useReducedMotion();
  if(reducedMotion){
    return <LocalImage src={item.poster} alt={alt} className="aspect-video w-full rounded-2xl object-cover"/>;
  }
  return <video
    src={item.video}
    poster={item.poster}
    autoPlay
    muted
    loop
    playsInline
    className="aspect-video w-full rounded-2xl object-cover"
    aria-label={alt}
  >Your browser does not support video playback.</video>;
}

export function FeatureShowcase(){
  const {language}=useLanguage();
  const zh=language==='zh';
  const reducedMotion=useReducedMotion();
  const cardRefs=useRef<FeatureCardElement[]>([]);
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
      const visibleEntries=entries.filter(entry=>entry.isIntersecting).sort((a,b)=>b.intersectionRatio-a.intersectionRatio);
      const id=(visibleEntries[0]?.target as HTMLElement | undefined)?.dataset.featureId;
      if(id)setActiveId(id);
    },{threshold:0.6});

    const cards=cardRefs.current.filter((card):card is HTMLElement=>Boolean(card));
    cards.forEach(card=>{revealObserver.observe(card);activeObserver.observe(card)});
    return()=>{revealObserver.disconnect();activeObserver.disconnect()};
  },[reducedMotion]);

  function navigateToCard(index:number){
    cardRefs.current[index]?.scrollIntoView({behavior:reducedMotion?'auto':'smooth',block:'center'});
  }

  return <section
    id="features"
    className="relative isolate overflow-x-clip bg-fixed bg-cover bg-center text-white"
    style={{backgroundImage:"url('/images/production-line.jpg')"}}
  >
    <div className="absolute inset-0 -z-10 bg-ink/85"/>
    <div className="industrial-grid absolute inset-0 -z-10"/>
    <div className="container-shell grid gap-12 py-20 lg:grid-cols-[20rem_minmax(0,1fr)] lg:gap-16 lg:py-28">
      <aside className="lg:sticky lg:top-24 lg:flex lg:min-h-[calc(100vh-7rem)] lg:flex-col lg:self-start lg:py-10">
        <div>
          <p className="text-xs font-bold uppercase tracking-[.24em] text-amber-400">{zh?'制造能力':'Manufacturing Capability'}</p>
          <h2 className="mt-5 text-4xl font-bold leading-[1.08] tracking-[-.04em] sm:text-5xl">{zh?'让采购商看懂工厂能力':'Make factory capability clear for buyers'}</h2>
          <p className="mt-6 leading-7 text-white/65">{zh?'围绕现货、定织、品控和出货展示关键能力，帮助客户更快判断合作路径。':'Present stock, custom weaving, quality, and shipment capability so buyers can choose a cooperation path faster.'}</p>
        </div>

        <nav className="mt-10 hidden gap-2 lg:grid" aria-label={zh?'功能卡片导航':'Feature card navigation'}>
          {featureShowcaseItems.map((item,index)=>{
            const active=item.id===activeId;
            return <button
              key={item.id}
              type="button"
              onClick={()=>navigateToCard(index)}
              className={`flex min-h-14 items-center justify-between rounded-2xl px-4 text-left text-sm font-semibold transition-all duration-300 ${active?'bg-white/18 text-white shadow-sm':'bg-white/[.055] text-white/55 hover:bg-white/10 hover:text-white/80'}`}
              aria-current={active?'true':undefined}
            >
              <span>{zh?item.titleZh:item.titleEn}</span>
              <span className={`text-xs tabular-nums transition-opacity ${active?'opacity-100':'opacity-35'}`}>{String(index+1).padStart(2,'0')}</span>
            </button>;
          })}
        </nav>

        <div className="mt-auto hidden border-t border-white/15 pt-8 lg:block">
          <p className="mb-5 text-sm leading-6 text-white/65">{zh?'希望了解具体产品和定织可行性？':'Need to discuss a fabric or custom weaving plan?'}</p>
          <PrimaryButton to="/contact#inquiry">{zh?'发送询盘':'Send Inquiry'}<ArrowUpRight size={17}/></PrimaryButton>
        </div>
      </aside>

      <div className="grid gap-10 lg:gap-24">
        {featureShowcaseItems.map((item,index)=>{
          const visible=visibleIds.has(item.id);
          return <div key={item.id} className="flex lg:min-h-[78vh] lg:items-center">
            <article
              ref={element=>{cardRefs.current[index]=element}}
              data-feature-id={item.id}
              className={`w-full rounded-[1.75rem] border border-white/15 bg-black/30 p-5 shadow-2xl shadow-black/25 backdrop-blur-md transition-[opacity,transform] duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] sm:p-7 ${visible?'translate-x-0 opacity-100':'translate-x-16 opacity-0'}`}
            >
              <FeatureVideo item={item} alt={zh?`${item.titleZh}功能视频`:`${item.titleEn} feature video`}/>
              <div className="px-1 pb-2 pt-7 sm:px-2 sm:pt-9">
                <div className="flex items-start gap-5">
                  <span className="mt-1 text-xs font-bold tracking-[.2em] text-amber-400">{String(index+1).padStart(2,'0')}</span>
                  <div><h3 className="text-2xl font-bold tracking-tight sm:text-3xl">{zh?item.titleZh:item.titleEn}</h3><p className="mt-4 max-w-2xl leading-7 text-white/65">{zh?item.descriptionZh:item.descriptionEn}</p></div>
                </div>
              </div>
            </article>
          </div>;
        })}
        <div className="lg:hidden"><PrimaryButton to="/contact#inquiry" className="w-full">{zh?'发送询盘':'Send Inquiry'}<ArrowUpRight size={17}/></PrimaryButton></div>
      </div>
    </div>
  </section>;
}
