import { useMemo, useState } from 'react';
import { ArrowUpRight, Search } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useSite } from '../context/SiteContext';
import { useLanguage } from '../i18n/useLanguage';
import { EmptyState } from '../components/EmptyState';
import { LocalImage } from '../components/Media';
import { PageHero } from '../components/PageHero';
import { Seo } from '../components/Seo';

type ActivityFilter = {
  id: string;
  label: string;
};

export function NewsPage(){
  const {language,t}=useLanguage();
  const zh=language==='zh';
  const {site}=useSite();
  const news=site.news;
  const copy = site.copy.activity as {
    hero: { eyebrowZh: string; eyebrowEn: string; titleZh: string; titleEn: string; descriptionZh: string; descriptionEn: string; image: string };
  };
  const [query,setQuery]=useState('');
  const [category,setCategory]=useState('all');
  const [year,setYear]=useState('all');
  const categories:ActivityFilter[]=[...new Map(news.map(item=>[item.category,zh?item.categoryZh:item.categoryEn])).entries()].map(([id,label])=>({id,label}));
  const years=[...new Set(news.map(item=>item.date.slice(0,4)))].sort((a,b)=>b.localeCompare(a));
  const filtered=useMemo(()=>news
    .filter(item=>(category==='all'||item.category===category)
      &&(year==='all'||item.date.startsWith(year))
      &&`${item.titleZh} ${item.titleEn} ${item.summaryZh} ${item.summaryEn}`.toLowerCase().includes(query.trim().toLowerCase()))
    .sort((a,b)=>b.date.localeCompare(a.date)),[category,query,year]);
  const featured=filtered[0];

  return <>
    <Seo title={{zh:'公司活动',en:'Company Activities'}} description={{zh:copy.hero.descriptionZh,en:copy.hero.descriptionEn}}/>
    <PageHero image={copy.hero.image} eyebrow={zh?copy.hero.eyebrowZh:copy.hero.eyebrowEn} title={zh?copy.hero.titleZh:copy.hero.titleEn} description={zh?copy.hero.descriptionZh:copy.hero.descriptionEn}/>

    <main className="bg-white">
      <section className="section-pad">
        <div className="container-shell">
          <header className="grid gap-8 lg:grid-cols-[minmax(0,.76fr)_minmax(0,1.24fr)] lg:items-end">
            <div>
              <p className="text-xs font-bold tracking-[.16em] text-accent">{zh?'工厂近况':'FROM THE FACTORY FLOOR'}</p>
              <h2 className="mt-4 max-w-xl text-4xl font-bold leading-[1.08] tracking-tight text-ink sm:text-5xl">{zh?'最近在做什么':'Recent work, on record'}</h2>
            </div>
            <div className="lg:pb-1">
              <p className="max-w-2xl text-base leading-8 text-muted">{zh?'展会、客户到访、样品整理和业务培训，都按发生时间记在这里。':'Exhibitions, buyer visits, sample-room work, and team training are filed here by date.'}</p>
              <p className="mt-4 font-mono text-xs text-muted">{zh?'最近更新':'Last updated'} · {news[0]?.date}</p>
            </div>
          </header>

          <section aria-label={zh?'活动筛选':'Activity filters'} className="mt-10 border-y border-slate-300">
            <div className="grid gap-5 py-5 lg:grid-cols-[minmax(0,1fr)_20rem] lg:items-end">
              <div className="flex flex-wrap items-end gap-x-7 gap-y-2">
                <span className="min-h-11 py-3 text-[11px] font-bold tracking-[.14em] text-muted">{zh?'年份':'YEAR'}</span>
                {['all',...years].map(item=>{const selected=year===item;return <button key={item} type="button" aria-pressed={selected} onClick={()=>setYear(item)} className={`min-h-11 border-b-2 px-0.5 text-sm font-bold transition-colors ${selected?'border-accent text-accent':'border-transparent text-muted hover:text-ink'}`}>{item==='all'?(zh?'全部':'All'):item}</button>})}
              </div>
              <label className="relative block">
                <span className="sr-only">{zh?'搜索公司活动':'Search activities'}</span>
                <Search className="pointer-events-none absolute left-0 top-3.5 text-muted" size={18}/>
                <input value={query} onChange={event=>setQuery(event.target.value)} className="min-h-12 w-full border-0 border-b border-slate-400 bg-transparent pl-7 pr-2 text-sm text-ink outline-none transition placeholder:text-slate-400 focus:border-accent focus:ring-0" placeholder={zh?'搜索活动':'Search activities'}/>
              </label>
            </div>

            <div className="activity-filter-scroll flex flex-nowrap gap-x-1 overflow-x-auto" aria-label={zh?'按活动类型筛选':'Filter by activity type'}>
              <button type="button" aria-pressed={category==='all'} onClick={()=>setCategory('all')} className={`min-h-12 shrink-0 whitespace-nowrap border-b-2 px-4 text-sm font-semibold transition-colors ${category==='all'?'border-accent text-accent':'border-transparent text-muted hover:text-ink'}`}>{t.common.all}</button>
              {categories.map(item=><button key={item.id} type="button" aria-pressed={category===item.id} onClick={()=>setCategory(item.id)} className={`min-h-12 shrink-0 whitespace-nowrap border-b-2 px-4 text-sm font-semibold transition-colors ${category===item.id?'border-accent text-accent':'border-transparent text-muted hover:text-ink'}`}>{item.label}</button>)}
            </div>
          </section>

          {featured?<div className="mt-12">
            <article className="activity-lead grid overflow-hidden border-y border-[#CFC8BA] bg-[#F5F4F0] lg:grid-cols-[minmax(0,1.35fr)_minmax(18rem,.65fr)]">
              <div className="flex flex-col justify-between p-7 sm:p-10 lg:p-14">
                <div>
                  <div className="flex flex-wrap items-center gap-4">
                    <span className="h-px w-10 bg-accent" aria-hidden="true"/>
                    <span className="text-xs font-bold tracking-[.14em] text-accent">{zh?'最近一条':'LATEST NOTE'}</span>
                    <span className="text-xs text-muted">{zh?featured.categoryZh:featured.categoryEn}</span>
                  </div>
                  <h3 className="mt-8 max-w-3xl text-3xl font-bold leading-tight tracking-tight text-ink sm:text-4xl lg:text-5xl"><Link to={`/activity/${featured.slug}`} className="transition-colors hover:text-accent">{zh?featured.titleZh:featured.titleEn}</Link></h3>
                  <p className="mt-6 max-w-2xl text-base leading-8 text-muted">{zh?featured.summaryZh:featured.summaryEn}</p>
                </div>
                <Link to={`/activity/${featured.slug}`} className="mt-10 inline-flex min-h-11 items-center gap-2 self-start border-b border-ink/60 text-sm font-bold text-ink transition-colors hover:border-accent hover:text-accent">{zh?'打开记录':'Open note'}<ArrowUpRight size={16}/></Link>
              </div>

              {featured.image?<Link to={`/activity/${featured.slug}`} className="group order-first block min-h-64 overflow-hidden bg-graphite focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-accent lg:order-none">
                <LocalImage loading="eager" src={featured.image} alt={zh?`${featured.titleZh}活动现场`:`Field image for ${featured.titleEn}`} className="size-full min-h-64 object-cover transition duration-500 group-hover:scale-[1.025]"/>
              </Link>:<div className="activity-swatch order-first flex min-h-64 items-end p-7 lg:order-none lg:min-h-[29rem] lg:p-10">
                <time dateTime={featured.date} className="block border-l-4 border-accent bg-[#F5F4F0]/95 px-5 py-4 text-ink shadow-[0_10px_30px_-24px_rgba(17,24,39,.55)]">
                  <span className="block font-mono text-xs tracking-[.14em] text-muted">{featured.date.slice(0,4)}</span>
                  <strong className="mt-1 block font-mono text-3xl font-semibold tracking-tight">{featured.date.slice(5,7)} · {featured.date.slice(8,10)}</strong>
                </time>
              </div>}
            </article>

            {filtered.length>1&&<section className="mt-14" aria-labelledby="earlier-activity-title">
              <div className="flex items-end justify-between gap-4 border-b border-slate-400 pb-4">
                <h3 id="earlier-activity-title" className="text-xl font-bold text-ink">{zh?'更多记录':'Earlier notes'}</h3>
                <span className="text-xs text-muted">{filtered.length-1} {zh?'条':'more'}</span>
              </div>
              <ul>
                {filtered.slice(1).map(article=><li key={article.id}>
                  <article className="group grid grid-cols-[4.5rem_minmax(0,1fr)_2.75rem] items-start gap-3 border-b border-slate-200 py-7 sm:grid-cols-[7.5rem_minmax(0,1fr)_3rem] sm:items-center sm:gap-6 lg:grid-cols-[10rem_minmax(0,1fr)_3rem] lg:py-8">
                    <time dateTime={article.date} className="font-mono text-ink"><strong className="block text-xl font-semibold sm:text-2xl">{article.date.slice(5,7)}.{article.date.slice(8,10)}</strong><span className="mt-1 block text-[11px] text-muted">{article.date.slice(0,4)}</span></time>
                    <div className="min-w-0">
                      <p className="text-[11px] font-bold tracking-[.1em] text-muted">{zh?article.categoryZh:article.categoryEn}</p>
                      <h4 className="mt-2 text-lg font-bold leading-snug text-ink sm:text-xl"><Link to={`/activity/${article.slug}`} className="transition-colors group-hover:text-accent">{zh?article.titleZh:article.titleEn}</Link></h4>
                      <p className="mt-2 line-clamp-2 max-w-4xl text-sm leading-6 text-muted">{zh?article.summaryZh:article.summaryEn}</p>
                    </div>
                    <Link to={`/activity/${article.slug}`} aria-label={`${zh?'打开记录':'Open note'}: ${zh?article.titleZh:article.titleEn}`} className="inline-flex size-11 items-center justify-center border border-slate-300 text-ink transition-colors group-hover:border-accent group-hover:text-accent"><ArrowUpRight size={17}/></Link>
                  </article>
                </li>)}
              </ul>
            </section>}
          </div>:<div className="mt-10"><EmptyState message={zh?'没有找到相关活动，可以换个年份、分类或关键词。':'No matching activities. Try another year, category, or keyword.'}/></div>}
        </div>
      </section>
    </main>
  </>;
}
