import { useMemo, useState } from 'react';
import { ArrowUpRight, Search } from 'lucide-react';
import { Link } from 'react-router-dom';
import { news } from '../data/news';
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
    <Seo title={{zh:'公司活动',en:'Company Activities'}} description={{zh:'展会参展、客户来访、企业新闻、行业资讯、团建和业务培训记录。',en:'Trade shows, buyer visits, company updates, industry notes, and training records.'}}/>
    <PageHero image="/images/factory-exterior.jpg" eyebrow={zh?'公司活动':'Company Activities'} title={t.pages.activity} description={zh?'按时间查阅展会交流、客户来访、企业动态和团队培训记录。':'Browse trade shows, buyer visits, company updates, and team training in chronological order.'}/>

    <main className="bg-white">
      <section className="section-pad">
        <div className="container-shell">
          <header className="grid gap-8 border-b border-slate-300 pb-10 lg:grid-cols-[minmax(0,.72fr)_minmax(0,1.28fr)] lg:items-end">
            <div>
              <p className="text-xs font-bold uppercase tracking-[.2em] text-accent">{zh?'工厂工作日志':'Factory journal'}</p>
              <h2 className="mt-4 max-w-xl text-4xl font-bold leading-[1.08] tracking-tight text-ink sm:text-5xl">{zh?'把每次沟通与现场进展留下来':'A working record of factory and business activity'}</h2>
            </div>
            <div className="lg:pb-1">
              <p className="max-w-2xl text-base leading-8 text-muted">{zh?'按日期保留参展、来访、业务沟通和团队协作记录。所有信息只展示当前已有内容。':'Entries are organized by date across exhibitions, visits, sourcing communication, and team coordination. Only available information is shown.'}</p>
              <p className="mt-5 font-mono text-xs font-bold uppercase tracking-[.14em] text-muted">{zh?`共 ${news.length} 条记录`:`${news.length} records in the archive`}</p>
            </div>
          </header>

          <section aria-label={zh?'活动筛选':'Activity filters'} className="border-b border-slate-300">
            <div className="grid gap-5 py-6 lg:grid-cols-[minmax(0,1fr)_20rem] lg:items-end">
              <div>
                <p className="mb-2 text-[11px] font-bold uppercase tracking-[.16em] text-muted">{zh?'时间索引':'Time index'}</p>
                <div className="flex flex-wrap gap-x-6" aria-label={zh?'按年份筛选':'Filter by year'}>
                  {['all',...years].map(item=>{const selected=year===item;return <button key={item} type="button" aria-pressed={selected} onClick={()=>setYear(item)} className={`min-h-11 border-b-2 px-0.5 text-sm font-bold transition-colors ${selected?'border-accent text-accent':'border-transparent text-muted hover:text-ink'}`}>{item==='all'?(zh?'全部年份':'All years'):item}</button>})}
                </div>
              </div>
              <label className="relative block">
                <span className="sr-only">{zh?'搜索公司活动':'Search activities'}</span>
                <Search className="pointer-events-none absolute left-0 top-3.5 text-muted" size={18}/>
                <input value={query} onChange={event=>setQuery(event.target.value)} className="min-h-12 w-full border-0 border-b border-slate-400 bg-transparent pl-7 pr-2 text-sm text-ink outline-none transition placeholder:text-slate-400 focus:border-accent focus:ring-0" placeholder={zh?'搜索标题或内容':'Search the journal'}/>
              </label>
            </div>

            <div className="activity-filter-scroll flex flex-nowrap gap-x-1 overflow-x-auto" aria-label={zh?'按活动类型筛选':'Filter by activity type'}>
              <button type="button" aria-pressed={category==='all'} onClick={()=>setCategory('all')} className={`min-h-12 shrink-0 whitespace-nowrap border-b-2 px-4 text-sm font-semibold transition-colors ${category==='all'?'border-accent text-accent':'border-transparent text-muted hover:text-ink'}`}>{t.common.all}</button>
              {categories.map(item=><button key={item.id} type="button" aria-pressed={category===item.id} onClick={()=>setCategory(item.id)} className={`min-h-12 shrink-0 whitespace-nowrap border-b-2 px-4 text-sm font-semibold transition-colors ${category===item.id?'border-accent text-accent':'border-transparent text-muted hover:text-ink'}`}>{item.label}</button>)}
            </div>
          </section>

          {featured?<div className="mt-10">
            <article className="grid overflow-hidden bg-ink text-white lg:grid-cols-[minmax(17rem,.62fr)_minmax(0,1.38fr)]">
              {featured.image?<Link to={`/activity/${featured.slug}`} className="group block min-h-72 overflow-hidden bg-graphite focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-accent">
                <LocalImage loading="eager" src={featured.image} alt={zh?`${featured.titleZh}活动现场`:`Field image for ${featured.titleEn}`} className="size-full min-h-72 object-cover opacity-90 transition duration-500 group-hover:scale-[1.025]"/>
              </Link>:<div className="industrial-grid flex min-h-64 flex-col justify-between border-b border-white/15 p-7 lg:min-h-[28rem] lg:border-b-0 lg:border-r lg:p-10">
                <span className="font-mono text-xs font-bold uppercase tracking-[.18em] text-amber-400">{zh?'重点记录':'Featured record'}</span>
                <div>
                  <span className="block font-mono text-[clamp(5rem,9vw,8rem)] font-bold leading-none tracking-[-.08em] text-white/12">01</span>
                  <time className="mt-4 block font-mono text-sm text-slate-300">{featured.date}</time>
                </div>
              </div>}
              <div className="flex flex-col justify-between p-7 sm:p-10 lg:p-14">
                <div>
                  <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/15 pb-5">
                    <span className="text-xs font-bold uppercase tracking-[.16em] text-amber-400">{zh?featured.categoryZh:featured.categoryEn}</span>
                    {featured.image&&<time className="font-mono text-xs text-slate-400">{featured.date}</time>}
                  </div>
                  <h3 className="mt-8 max-w-3xl text-3xl font-bold leading-tight tracking-tight sm:text-4xl lg:text-5xl"><Link to={`/activity/${featured.slug}`} className="transition-colors hover:text-amber-400">{zh?featured.titleZh:featured.titleEn}</Link></h3>
                  <p className="mt-6 max-w-2xl text-base leading-8 text-slate-300">{zh?featured.summaryZh:featured.summaryEn}</p>
                </div>
                <Link to={`/activity/${featured.slug}`} className="mt-10 inline-flex min-h-11 items-center gap-2 self-start border-b border-white/50 text-sm font-bold text-white transition-colors hover:border-amber-400 hover:text-amber-400">{t.common.readMore}<ArrowUpRight size={16}/></Link>
              </div>
            </article>

            {filtered.length>1&&<ol className="border-b border-slate-300">
              {filtered.slice(1).map((article,index)=><li key={article.id}>
                <article className="group grid grid-cols-[2.25rem_minmax(0,1fr)_2.75rem] items-start gap-3 border-t border-slate-200 py-7 first:border-t-0 sm:grid-cols-[4rem_minmax(0,1fr)_3rem] sm:items-center sm:gap-5 lg:grid-cols-[5rem_minmax(0,1fr)_3rem] lg:py-8">
                  <span className="font-mono text-sm font-bold text-accent">{String(index+2).padStart(2,'0')}</span>
                  <div className="min-w-0 sm:grid sm:grid-cols-[8rem_minmax(0,1fr)] sm:gap-6 lg:grid-cols-[10rem_minmax(0,1fr)]">
                    <div><time className="font-mono text-xs text-muted">{article.date}</time><p className="mt-1 text-[10px] font-bold uppercase tracking-[.12em] text-muted sm:hidden">{zh?article.categoryZh:article.categoryEn}</p></div>
                    <div className="mt-3 min-w-0 sm:mt-0">
                      <p className="hidden text-[11px] font-bold uppercase tracking-[.14em] text-muted sm:block">{zh?article.categoryZh:article.categoryEn}</p>
                      <h3 className="mt-1 text-lg font-bold leading-snug text-ink sm:text-xl"><Link to={`/activity/${article.slug}`} className="transition-colors group-hover:text-accent">{zh?article.titleZh:article.titleEn}</Link></h3>
                      <p className="mt-2 line-clamp-2 max-w-4xl text-sm leading-6 text-muted">{zh?article.summaryZh:article.summaryEn}</p>
                    </div>
                  </div>
                  <Link to={`/activity/${article.slug}`} aria-label={`${t.common.readMore}: ${zh?article.titleZh:article.titleEn}`} className="inline-flex size-11 items-center justify-center border border-slate-300 text-ink transition-colors group-hover:border-accent group-hover:text-accent"><ArrowUpRight size={17}/></Link>
                </article>
              </li>)}
            </ol>}
          </div>:<div className="mt-10"><EmptyState message={zh?'没有匹配的活动，请更换关键词、年份或分类。':'No matching activities. Try another keyword, year, or category.'}/></div>}
        </div>
      </section>
    </main>
  </>;
}
