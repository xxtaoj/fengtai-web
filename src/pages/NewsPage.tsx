import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useSite } from '../context/SiteContext';
import { useLanguage } from '../i18n/useLanguage';
import { PageHero } from '../components/PageHero';
import { Seo } from '../components/Seo';

export function NewsPage(){
  const {language}=useLanguage();
  const zh=language==='zh';
  const {site}=useSite();
  const copy = site.copy.activity as {
    hero: { eyebrowZh: string; eyebrowEn: string; titleZh: string; titleEn: string; descriptionZh: string; descriptionEn: string; image: string };
  };
  const sortedNews=[...site.news].sort((a,b)=>b.date.localeCompare(a.date));
  const dateFormatter=new Intl.DateTimeFormat(zh?'zh-CN':'en-US',{
    year:'numeric',
    month:zh?'2-digit':'short',
    day:'2-digit',
    timeZone:'UTC',
  });

  return <>
    <Seo title={{zh:'公司活动',en:'Company Activities'}} description={{zh:copy.hero.descriptionZh,en:copy.hero.descriptionEn}}/>
    <PageHero image={copy.hero.image} eyebrow={zh?copy.hero.eyebrowZh:copy.hero.eyebrowEn} title={zh?copy.hero.titleZh:copy.hero.titleEn} description={zh?copy.hero.descriptionZh:copy.hero.descriptionEn}/>

    <main className="bg-white">
      <section className="section-pad">
        <div className="container-shell">
          <header className="grid gap-5 pb-10 lg:grid-cols-[minmax(14rem,.55fr)_minmax(0,1.45fr)] lg:items-end lg:gap-16 lg:pb-14">
            <h2 className="text-4xl font-bold tracking-[-.04em] text-ink sm:text-5xl">{zh?'新闻动态':'News'}</h2>
            <p className="max-w-2xl text-sm leading-7 text-muted md:text-base">{zh?'记录展会交流、客户到访、样品整理和企业动态。点击任意新闻可查看完整内容。':'Updates from exhibitions, buyer visits, sample-room work, and the company. Select any item to read the full story.'}</p>
          </header>

          <div className="border-t border-slate-300">
            {sortedNews.map(article=><article key={article.id} className="group border-b border-slate-300">
              <Link to={`/activity/${article.slug}`} className="grid min-h-32 gap-4 py-7 transition-colors hover:bg-slate-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent sm:grid-cols-[10rem_minmax(0,1fr)_3.25rem] sm:items-center sm:gap-7 sm:px-3 lg:min-h-40 lg:grid-cols-[13rem_minmax(0,1fr)_3.25rem] lg:gap-10 lg:px-5">
                <time dateTime={article.date} className="text-sm font-medium text-body sm:self-start sm:pt-1 lg:text-base">{dateFormatter.format(new Date(`${article.date}T00:00:00Z`))}</time>

                <div className="min-w-0">
                  <span className="inline-flex min-h-8 items-center border border-[#0B4AA2]/45 px-3 text-xs font-medium text-[#0B4AA2]">{zh?article.categoryZh:article.categoryEn}</span>
                  <h3 className="mt-3 text-xl font-medium leading-snug text-[#0B4AA2] transition-colors group-hover:text-accent sm:text-2xl">{zh?article.titleZh:article.titleEn}</h3>
                  <p className="mt-2 line-clamp-2 max-w-4xl text-sm leading-6 text-muted">{zh?article.summaryZh:article.summaryEn}</p>
                </div>

                <span className="inline-flex size-12 items-center justify-center justify-self-end border border-slate-300 text-ink transition-colors group-hover:border-[#0B4AA2] group-hover:bg-[#0B4AA2] group-hover:text-white" aria-hidden="true"><ArrowRight size={18}/></span>
              </Link>
            </article>)}

            {sortedNews.length===0&&<p className="border-b border-slate-300 py-14 text-sm text-muted">{zh?'暂时没有新闻内容。':'No news has been published yet.'}</p>}
          </div>
        </div>
      </section>
    </main>
  </>;
}
