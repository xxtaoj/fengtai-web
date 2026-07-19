import { useMemo, useState } from 'react';
import { Search } from 'lucide-react';
import { news } from '../data/news';
import { useLanguage } from '../i18n/useLanguage';
import { PageHero } from '../components/PageHero';
import { NewsCard } from '../components/NewsCard';
import { EmptyState } from '../components/EmptyState';
import { SectionHeading } from '../components/SectionHeading';
import { Seo } from '../components/Seo';

const activitySections = [
  {id:'exhibitions',category:'exhibition',titleZh:'国内外展会参展动态',titleEn:'Domestic and Overseas Trade Shows',descZh:'记录亚欧博览会、上海面料展及海外专业纺织展等参展动态。',descEn:'Updates from the Asia-Europe Expo, Shanghai fabric fairs, and overseas textile exhibitions.'},
  {id:'visits',category:'visit',titleZh:'海内外客户来访考察纪实',titleEn:'Domestic and Overseas Customer Visits',descZh:'展示客户到访、样品沟通、工厂考察和后续业务对接。',descEn:'Buyer visits, sample discussions, factory tours, and follow-up cooperation.'},
  {id:'news-insights',category:'news-insights',titleZh:'企业新闻与行业资讯',titleEn:'Company News and Industry Insights',descZh:'涵盖产能协同、新品研发、样品间更新和外贸政策相关内容。',descEn:'Capacity coordination, new product development, sample room updates, and export policy notes.'},
  {id:'culture',category:'culture',titleZh:'内部团建、业务培训等企业文化动态',titleEn:'Team Building, Sales Training, and Culture',descZh:'展示团队稳定性、业务培训和跨部门协作能力。',descEn:'Team stability, sales training, and cross-department collaboration.'},
];

export function NewsPage(){
  const {language,t}=useLanguage();
  const zh=language==='zh';
  const [query,setQuery]=useState('');
  const [category,setCategory]=useState('all');
  const cats=Array.from(new Map(news.map(n=>[n.category,zh?n.categoryZh:n.categoryEn])).entries());
  const filtered=useMemo(()=>news.filter(n=>(category==='all'||n.category===category)&&`${n.titleZh} ${n.titleEn} ${n.summaryZh} ${n.summaryEn}`.toLowerCase().includes(query.toLowerCase())),[category,query]);
  const sectionMode=category==='all'&&!query.trim();

  return <>
    <Seo title={{zh:'公司活动',en:'Company Activities'}} description={{zh:'展会参展、客户来访、企业新闻、行业资讯、团建和业务培训动态。',en:'Trade shows, customer visits, company news, industry insights, team building, and training updates.'}}/>
    <PageHero image="/images/news-banner.jpg" eyebrow={zh?'公司活动':'Company Activities'} title={t.pages.activity} description={zh?'查看展会交流、客户来访、企业动态和团队培训记录，了解我们的产品沟通与日常协作。':'See trade-show conversations, buyer visits, company updates, and team training records.'}/>
    <main className="section-pad">
      <div className="container-shell">
        <article className="mb-14 grid overflow-hidden border border-line bg-white lg:grid-cols-2">
          <img src={news[0].image} alt={zh?news[0].titleZh:news[0].titleEn} className="aspect-[16/10] size-full object-cover"/>
          <div className="flex flex-col justify-center p-8 md:p-12">
            <span className="text-xs font-bold uppercase tracking-widest text-accent">{zh?'焦点活动':'Featured Activity'}</span>
            <h2 className="mt-4 text-3xl font-bold text-ink">{zh?news[0].titleZh:news[0].titleEn}</h2>
            <p className="mt-4 leading-7 text-muted">{zh?news[0].summaryZh:news[0].summaryEn}</p>
          </div>
        </article>

        <div className="flex flex-col gap-5 border-y border-line py-6 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex flex-wrap gap-2">
            <button onClick={()=>setCategory('all')} className={`min-h-11 px-4 text-sm font-semibold ${category==='all'?'bg-ink text-white':'bg-white text-body'}`}>{t.common.all}</button>
            {cats.map(([key,label])=><button key={key} onClick={()=>setCategory(key)} className={`min-h-11 px-4 text-sm font-semibold ${category===key?'bg-ink text-white':'bg-white text-body'}`}>{label}</button>)}
          </div>
          <label className="relative block min-w-64">
            <span className="sr-only">{zh?'搜索公司活动':'Search activities'}</span>
            <Search className="absolute left-4 top-3.5 text-muted" size={18}/>
            <input value={query} onChange={e=>setQuery(e.target.value)} className="min-h-12 w-full border border-slate-300 bg-white pl-11 pr-4" placeholder={zh?'搜索标题或内容':'Search title or content'}/>
          </label>
        </div>

        {sectionMode ? <div className="mt-12 grid gap-16">
          {activitySections.map(section=>{
            const items=news.filter(article=>article.category===section.category);
            return <section id={section.id} key={section.id} className="scroll-mt-28">
              <SectionHeading eyebrow={zh?'二级栏目':'Subcategory'} title={zh?section.titleZh:section.titleEn} description={zh?section.descZh:section.descEn}/>
              <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">{items.map(article=><NewsCard key={article.id} article={article}/>)}</div>
            </section>;
          })}
        </div> : <>
          <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">{filtered.map(article=><NewsCard key={article.id} article={article}/>)}</div>
          {!filtered.length&&<div className="mt-10"><EmptyState message={zh?'没有匹配的活动，请更换关键词或分类。':'No matching activities. Try another keyword or category.'}/></div>}
        </>}
      </div>
    </main>
  </>;
}
