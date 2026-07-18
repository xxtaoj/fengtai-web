import { Link, useParams } from 'react-router-dom';
import { ChevronLeft, ChevronRight, Share2 } from 'lucide-react';
import { news } from '../data/news';
import { useLanguage } from '../i18n/useLanguage';
import { Breadcrumbs } from '../components/Breadcrumbs';
import { ErrorState } from '../components/ErrorState';
import { NewsCard } from '../components/NewsCard';
import { QuoteCTA } from '../components/QuoteCTA';
import { Seo } from '../components/Seo';
import { LocalImage } from '../components/Media';

export function NewsDetailPage(){
  const {slug}=useParams();
  const {language}=useLanguage();
  const zh=language==='zh';
  const i=news.findIndex(n=>n.slug===slug);
  if(i<0)return <main className="section-pad pt-40"><ErrorState title={zh?'活动未找到':'Activity not found'} message={zh?'该链接不存在或内容已被移动。':'This activity does not exist or has moved.'}/></main>;
  const article=news[i];
  const prev=news[i-1];
  const next=news[i+1];
  return <>
    <Seo title={{zh:article.titleZh,en:article.titleEn}} description={{zh:article.summaryZh,en:article.summaryEn}}/>
    <main className="bg-white pb-24 pt-32">
      <div className="container-shell">
        <Breadcrumbs items={[{label:zh?'公司活动':'Company Activities',to:'/activity'},{label:zh?article.titleZh:article.titleEn}]}/>
        <div className="mx-auto mt-14 max-w-4xl">
          <div className="flex flex-wrap items-center gap-4 text-sm">
            <span className="font-bold text-accent">{zh?article.categoryZh:article.categoryEn}</span>
            <time className="text-muted">{article.date}</time>
            <button className="ml-auto inline-flex min-h-11 items-center gap-2 text-sm font-semibold text-muted" title={zh?'分享功能待接入':'Share integration placeholder'}><Share2 size={17}/>{zh?'分享':'Share'}</button>
          </div>
          <h1 className="mt-6 text-4xl font-bold leading-tight tracking-tight text-ink md:text-6xl">{zh?article.titleZh:article.titleEn}</h1>
          <p className="mt-6 text-xl leading-8 text-muted">{zh?article.summaryZh:article.summaryEn}</p>
          <LocalImage src={article.image} alt={zh?`${article.titleZh}活动封面图`:`Cover image for ${article.titleEn}`} className="mt-10 aspect-[16/9] w-full object-cover"/>
          <article className="prose-factory mt-10 text-lg text-body">{(zh?article.contentZh:article.contentEn).map((paragraph,index)=><p key={index}>{paragraph}</p>)}</article>
          <nav className="mt-16 grid gap-3 border-y border-line py-6 sm:grid-cols-2">
            {prev?<Link to={`/activity/${prev.slug}`} className="flex items-center gap-3"><ChevronLeft/><span><small className="text-muted">{zh?'上一篇':'Previous'}</small><strong className="block text-ink">{zh?prev.titleZh:prev.titleEn}</strong></span></Link>:<span/>}
            {next&&<Link to={`/activity/${next.slug}`} className="flex items-center justify-end gap-3 text-right"><span><small className="text-muted">{zh?'下一篇':'Next'}</small><strong className="block text-ink">{zh?next.titleZh:next.titleEn}</strong></span><ChevronRight/></Link>}
          </nav>
        </div>
        <section className="mt-20">
          <h2 className="text-2xl font-bold text-ink">{zh?'相关活动':'Related Activities'}</h2>
          <div className="mt-8 grid gap-6 md:grid-cols-3">{news.filter(n=>n.id!==article.id).slice(0,3).map(n=><NewsCard key={n.id} article={n}/>)}</div>
        </section>
      </div>
    </main>
    <QuoteCTA/>
  </>;
}
