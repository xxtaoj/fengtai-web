import { Link, useParams } from 'react-router-dom';
import { ArrowUpRight, ChevronLeft, ChevronRight } from 'lucide-react';
import { useSite } from '../context/SiteContext';
import { useLanguage } from '../i18n/useLanguage';
import { Breadcrumbs } from '../components/Breadcrumbs';
import { ErrorState } from '../components/ErrorState';
import { QuoteCTA } from '../components/QuoteCTA';
import { Seo } from '../components/Seo';
import { LocalImage } from '../components/Media';

type FieldNote = {
  label: string;
  value: string;
};

export function NewsDetailPage(){
  const {slug}=useParams();
  const {language}=useLanguage();
  const zh=language==='zh';
  const {site}=useSite();
  const news=site.news;
  const i=news.findIndex(item=>item.slug===slug);
  if(i<0)return <main className="section-pad pt-40"><ErrorState title={zh?'活动未找到':'Activity not found'} message={zh?'该链接不存在或内容已被移动。':'This activity does not exist or has moved.'}/></main>;
  const article=news[i];
  const prev=news[i-1];
  const next=news[i+1];
  const optionalNotes:FieldNote[]=[
    article.location&&{label:zh?'地点':'Location',value:zh?article.location.zh:article.location.en},
    article.participants&&{label:zh?'参与人员或部门':'Participants',value:zh?article.participants.zh:article.participants.en},
    article.relatedProducts&&{label:zh?'涉及产品':'Related products',value:zh?article.relatedProducts.zh:article.relatedProducts.en},
    article.topics&&{label:zh?'沟通事项':'Topics',value:zh?article.topics.zh:article.topics.en},
    article.followUp&&{label:zh?'后续安排':'Follow-up',value:zh?article.followUp.zh:article.followUp.en},
  ].filter((item):item is FieldNote=>Boolean(item));
  const notes:FieldNote[]=[
    {label:zh?'记录日期':'Date',value:article.date},
    {label:zh?'记录分类':'Category',value:zh?article.categoryZh:article.categoryEn},
    ...optionalNotes,
  ];

  return <>
    <Seo title={{zh:article.titleZh,en:article.titleEn}} description={{zh:article.summaryZh,en:article.summaryEn}}/>
    <main className="bg-white pb-24 pt-32">
      <div className="container-shell">
        <Breadcrumbs items={[{label:zh?'公司活动':'Company Activities',to:'/activity'},{label:zh?article.titleZh:article.titleEn}]}/>
        <article className="mt-14">
          <header className="grid gap-10 border-b border-slate-300 pb-10 lg:grid-cols-[1fr_18rem] lg:items-end">
            <div>
              <p className="text-xs font-bold uppercase tracking-[.18em] text-accent">{zh?article.categoryZh:article.categoryEn}</p>
              <h1 className="mt-5 max-w-5xl text-[2rem] font-bold leading-[1.2] tracking-tight text-ink md:text-6xl">{zh?article.titleZh:article.titleEn}</h1>
              <p className="mt-6 max-w-3xl text-lg leading-8 text-muted">{zh?article.summaryZh:article.summaryEn}</p>
            </div>
            <div className="activity-detail-stamp border-l-2 border-accent py-2 pl-5">
              <p className="text-xs font-bold tracking-[.12em] text-muted">{zh?'记录日期':'DATE FILED'}</p>
              <time className="mt-3 block text-2xl font-bold text-ink">{article.date}</time>
            </div>
          </header>

          {article.image&&<LocalImage loading="eager" src={article.image} alt={zh?`${article.titleZh}活动现场`:`Field image for ${article.titleEn}`} className="mt-10 aspect-[16/8] w-full object-cover"/>}

          <div className="mt-10 grid gap-10 border-b border-slate-300 pb-14 lg:grid-cols-[18rem_minmax(0,1fr)] lg:gap-20 lg:pb-20">
            <aside aria-labelledby="field-notes-title" className="self-start border-t border-slate-400 lg:sticky lg:top-28">
              <h2 id="field-notes-title" className="border-b border-slate-300 py-4 text-xs font-bold tracking-[.14em] text-accent">{zh?(optionalNotes.length?'现场信息':'活动信息'):(optionalNotes.length?'Field notes':'Activity details')}</h2>
              <dl>
                {notes.map(note=><div key={note.label} className="border-b border-slate-200 py-4">
                  <dt className="text-[11px] font-bold uppercase tracking-[.1em] text-muted">{note.label}</dt>
                  <dd className="mt-2 text-sm font-semibold leading-6 text-ink">{note.value}</dd>
                </div>)}
              </dl>
            </aside>
            <div>
              <div className="mb-7 flex items-center gap-4 border-b border-slate-200 pb-4">
                <span className="h-px w-9 bg-accent" aria-hidden="true"/>
                <h2 className="text-xs font-bold tracking-[.14em] text-muted">{zh?'记录内容':'WHAT HAPPENED'}</h2>
              </div>
              <div className="prose-factory max-w-3xl text-lg text-body">{(zh?article.contentZh:article.contentEn).map((paragraph,index)=><p key={index}>{paragraph}</p>)}</div>
              {article.gallery?.length?<div className="mt-12 grid gap-4 sm:grid-cols-2">
                {article.gallery.map((image,index)=><LocalImage key={image} loading="lazy" src={image} alt={zh?`${article.titleZh}现场图片 ${index+1}`:`${article.titleEn} field image ${index+1}`} className="aspect-[4/3] w-full object-cover"/>)}
              </div>:null}
            </div>
          </div>
        </article>

        <nav aria-label={zh?'相邻活动':'Adjacent activities'} className="mx-auto mt-16 grid max-w-4xl gap-3 border-y border-line py-6 sm:grid-cols-2">
          {prev?<Link to={`/activity/${prev.slug}`} className="flex min-h-14 items-center gap-3 text-sm transition-colors hover:text-accent"><ChevronLeft/><span><small className="text-muted">{zh?'上一篇':'Previous'}</small><strong className="block text-ink">{zh?prev.titleZh:prev.titleEn}</strong></span></Link>:<span/>}
          {next&&<Link to={`/activity/${next.slug}`} className="flex min-h-14 items-center justify-end gap-3 text-right text-sm transition-colors hover:text-accent"><span><small className="text-muted">{zh?'下一篇':'Next'}</small><strong className="block text-ink">{zh?next.titleZh:next.titleEn}</strong></span><ChevronRight/></Link>}
        </nav>

        <section className="mt-20">
          <div className="flex items-end justify-between gap-4">
            <h2 className="text-2xl font-bold text-ink">{zh?'相关活动':'Related activities'}</h2>
            <Link to="/activity" className="inline-flex min-h-11 items-center gap-2 text-sm font-bold text-ink hover:text-accent">{zh?'返回工作日志':'Back to journal'}<ArrowUpRight size={16}/></Link>
          </div>
          <div className="mt-8 border-y border-slate-300">{news.filter(item=>item.id!==article.id).slice(0,3).map(item=><article key={item.id} className="group grid gap-4 border-t border-slate-200 py-6 first:border-t-0 sm:grid-cols-[8rem_minmax(0,1fr)_3rem] sm:items-center">
            <time className="font-mono text-xs text-muted">{item.date}</time>
            <div><p className="text-[10px] font-bold uppercase tracking-[.12em] text-muted">{zh?item.categoryZh:item.categoryEn}</p><h3 className="mt-1 text-lg font-bold leading-snug text-ink"><Link to={`/activity/${item.slug}`} className="transition-colors group-hover:text-accent">{zh?item.titleZh:item.titleEn}</Link></h3></div>
            <Link to={`/activity/${item.slug}`} aria-label={`${zh?'阅读':'Read'}: ${zh?item.titleZh:item.titleEn}`} className="inline-flex size-11 items-center justify-center border border-slate-300 text-ink transition-colors group-hover:border-accent group-hover:text-accent"><ArrowUpRight size={16}/></Link>
          </article>)}</div>
        </section>
      </div>
    </main>
    <QuoteCTA/>
  </>;
}
