import { ArrowUpRight, CheckCircle2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useCatalog } from '../context/CatalogContext';
import { useSite } from '../context/SiteContext';
import { useLanguage } from '../i18n/useLanguage';
import { PrimaryButton, SecondaryButton } from '../components/Button';
import { LocalImage } from '../components/Media';
import { NewsCard } from '../components/NewsCard';
import { SectionHeading } from '../components/SectionHeading';
import { StatsSection } from '../components/StatsSection';
import { VideoBlock } from '../components/VideoBlock';
import { QuoteCTA } from '../components/QuoteCTA';
import { Seo } from '../components/Seo';
import { FeatureShowcase } from '../components/FeatureShowcase';
import { useScrollReveal } from '../hooks/useScrollReveal';

export function HomePage(){
  const {language,t}=useLanguage();
  const {catalog}=useCatalog();
  const {site}=useSite();
  const {products,categories}=catalog;
  const zh=language==='zh';
  const reveal=useScrollReveal<HTMLDivElement>();
  const home = site.copy.home as {
    hero: { eyebrowZh: string; eyebrowEn: string; titleZh: string; titleEn: string; descZh: string; descEn: string; video: string; poster: string };
    advantagesZh: string[];
    advantagesEn: string[];
    about: { image: string; locationZh: string; locationEn: string };
    mainFabrics: { eyebrowZh: string; eyebrowEn: string; titleZh: string; titleEn: string; descriptionZh: string; descriptionEn: string };
    factoryVisuals: { eyebrowZh: string; eyebrowEn: string; titleZh: string; titleEn: string; descriptionZh: string; descriptionEn: string; video: string; poster: string };
    splitCards: Array<{ image: string; titleZh: string; titleEn: string; descriptionZh: string; descriptionEn: string; to: string }>;
    activity: { eyebrowZh: string; eyebrowEn: string; titleZh: string; titleEn: string };
  };
  const advantages = zh ? home.advantagesZh : home.advantagesEn;
  const fabricCategoryCards = [
    {
      id:'bedding-fabric',
      fallbackImage:'/images/products/product-01.jpg',
      fallbackTitleZh:'床品面料',
      fallbackTitleEn:'Bedding Fabric',
      fallbackDescriptionZh:'查看床单、被套、枕套、酒店及家纺渠道相关面料。',
      fallbackDescriptionEn:'Explore fabrics for sheets, duvet covers, pillowcases, hotels, and home textiles.',
    },
    {
      id:'apparel-fabric',
      fallbackImage:'/images/products/product-03.jpg',
      fallbackTitleZh:'服装面料',
      fallbackTitleEn:'Apparel Fabric',
      fallbackDescriptionZh:'查看衬衫、休闲服、制服及工装相关面料。',
      fallbackDescriptionEn:'Explore fabrics for shirts, casualwear, uniforms, and workwear.',
    },
  ].map(card=>{
    const category=categories.find(item=>item.id===card.id);
    const representative=products.find(item=>item.subcategory===card.id);
    return {
      ...card,
      image:representative?.image||card.fallbackImage,
      titleZh:category?.titleZh||card.fallbackTitleZh,
      titleEn:category?.titleEn||card.fallbackTitleEn,
      descriptionZh:category?.descriptionZh||card.fallbackDescriptionZh,
      descriptionEn:category?.descriptionEn||card.fallbackDescriptionEn,
    };
  });

  return <>
    <Seo title={{zh:'首页',en:'Home'}} description={{zh:home.hero.descZh,en:home.hero.descEn}}/>

    <section className="relative min-h-[100svh] overflow-hidden bg-ink text-white">
      <video src={home.hero.video} poster={home.hero.poster} autoPlay muted loop playsInline className="absolute inset-0 size-full origin-center scale-[1.34] object-cover object-[50%_48%]" aria-label={zh?'工厂生产场景视频':'Factory production video'}>Your browser does not support video.</video>
      <div className="absolute inset-0 bg-black/40"/>
      <div className="relative z-10 mx-auto flex min-h-[100svh] w-[min(calc(100%-2rem),115rem)] items-center pb-8 pt-28 sm:pb-0 sm:pt-32">
        <div className="max-w-[60rem]">
          <p className="mb-4 text-xs font-bold text-white sm:mb-7 sm:text-base">{zh?home.hero.eyebrowZh:home.hero.eyebrowEn}</p>
          <h1 className="max-w-[50rem] text-[2.35rem] font-medium leading-[1.06] tracking-normal sm:text-6xl sm:leading-[1.12] lg:text-[4.25rem] xl:text-[4.75rem]">{zh?home.hero.titleZh:home.hero.titleEn}</h1>
          <p className="mt-5 max-w-2xl text-[0.95rem] leading-7 text-white/85 sm:mt-7 sm:text-base sm:leading-8 md:text-lg">{zh?home.hero.descZh:home.hero.descEn}</p>
          <div className="mt-7 flex flex-wrap gap-3 sm:mt-9 sm:gap-4">
            <Link to="/contact#inquiry" className="inline-flex min-h-11 items-center justify-center gap-2 rounded-md bg-accent px-5 py-2.5 text-sm font-bold text-white transition hover:bg-accent-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/70 focus-visible:ring-offset-2 focus-visible:ring-offset-transparent sm:min-h-12 sm:px-6 sm:py-3">
              {t.common.quote}
              <ArrowUpRight size={17}/>
            </Link>
            <SecondaryButton to="/products" className="min-h-11 border-white/80 bg-white/90 px-5 py-2.5 sm:min-h-12 sm:px-6 sm:py-3">{zh?'查看面料分类':'View Fabric Categories'}</SecondaryButton>
          </div>
        </div>
      </div>
    </section>

    <section id="about" className="section-pad scroll-mt-28 bg-white">
      <div ref={reveal} className="container-shell reveal grid gap-12 lg:grid-cols-[1fr_1fr] lg:items-center">
        <div className="relative">
          <LocalImage src={home.about.image} alt={zh?'丰泰永晟工厂外景':'Fengtai Yongsheng factory exterior'} className="aspect-[4/3] w-full object-cover"/>
          <div className="absolute -bottom-5 right-0 bg-accent px-6 py-5 text-white md:right-[-1rem]"><strong>{zh?site.company.location:site.company.locationEn}</strong><span className="block text-xs opacity-80">{zh?home.about.locationZh:home.about.locationEn}</span></div>
        </div>
        <div>
          <SectionHeading eyebrow={zh?'企业核心优势':'Core Advantages'} title={zh?'现货、定织与交付，一次看清':'Stock, custom weaving, and delivery at a glance'} description={zh?'从常规在机现货到来样定织，采购商可根据用途、规格和交期选择对应的合作方式。':'From available fabrics to sample-based custom weaving, buyers can choose a path by application, specification, and delivery needs.'}/>
          <div className="mt-8 grid gap-3">
            {advantages.map(item=><div key={item} className="flex items-start gap-3 border-t border-line pt-4">
              <CheckCircle2 className="mt-1 shrink-0 text-success" size={20}/>
              <span className="font-semibold text-ink">{item}</span>
            </div>)}
          </div>
        </div>
      </div>
      <div className="container-shell mt-16"><StatsSection/></div>
    </section>

    <section className="section-pad bg-ink text-white">
      <div className="container-shell">
        <div className="flex flex-col gap-7 md:flex-row md:items-end md:justify-between">
          <SectionHeading eyebrow={zh?home.mainFabrics.eyebrowZh:home.mainFabrics.eyebrowEn} title={zh?home.mainFabrics.titleZh:home.mainFabrics.titleEn} description={zh?home.mainFabrics.descriptionZh:home.mainFabrics.descriptionEn}/>
          <Link to="/products" className="inline-flex min-h-11 shrink-0 items-center gap-2 self-start border-b border-amber-400 pb-1 text-sm font-bold text-white transition-colors hover:text-amber-400 md:self-auto">{zh?'查看全部产品':'View All Products'}<ArrowUpRight size={16}/></Link>
        </div>
        <div className="mt-12 grid gap-px overflow-hidden border border-white/15 bg-white/15 lg:grid-cols-2">
          {fabricCategoryCards.map((card,index)=><Link to={`/products#${card.id}`} key={card.id} className="group relative flex min-h-[27rem] items-end overflow-hidden bg-ink p-7 text-white sm:min-h-[32rem] sm:p-10 lg:p-12">
            <LocalImage src={card.image} alt={zh?`${card.titleZh}分类入口`:`${card.titleEn} category`} className="absolute inset-0 size-full object-cover transition duration-700 ease-out group-hover:scale-[1.035]"/>
            <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/55 to-ink/10 transition-colors duration-500 group-hover:via-ink/45"/>
            <span className="absolute right-6 top-6 text-xs font-bold tracking-[.16em] text-white/70">0{index+1}</span>
            <div className="relative max-w-xl">
              <p className="text-xs font-bold uppercase tracking-[.16em] text-amber-400">{zh?'常规在机现货':'Regular running stock'}</p>
              <h3 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">{zh?card.titleZh:card.titleEn}</h3>
              <p className="mt-4 max-w-lg text-sm leading-7 text-slate-200 sm:text-base">{zh?card.descriptionZh:card.descriptionEn}</p>
              <span className="mt-7 inline-flex min-h-11 items-center gap-2 border-b border-amber-400 pb-1 text-sm font-bold">{zh?'查看该类全部产品':'View all in this category'}<ArrowUpRight className="transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1" size={16}/></span>
            </div>
          </Link>)}
        </div>
      </div>
    </section>

    <FeatureShowcase/>

    <section className="section-pad bg-white">
      <div className="container-shell grid gap-10 lg:grid-cols-2 lg:items-center">
        <div>
          <SectionHeading eyebrow={zh?home.factoryVisuals.eyebrowZh:home.factoryVisuals.eyebrowEn} title={zh?home.factoryVisuals.titleZh:home.factoryVisuals.titleEn} description={zh?home.factoryVisuals.descriptionZh:home.factoryVisuals.descriptionEn}/>
          <PrimaryButton to="/company#factory-sites" className="mt-8">{zh?'查看工厂实景':'View Factory Sites'}</PrimaryButton>
        </div>
        <VideoBlock src={home.factoryVisuals.video} poster={home.factoryVisuals.poster} title={zh?'工厂参观视频':'Factory tour video'}/>
      </div>
    </section>

    <section className="grid min-h-[34rem] lg:grid-cols-2">
      {home.splitCards.map(card=><Link to={card.to} key={card.to} className="group relative flex min-h-80 items-end overflow-hidden p-8 text-white md:p-12">
        <LocalImage src={card.image} alt={zh?card.titleZh:card.titleEn} className="absolute inset-0 size-full object-cover transition duration-700 group-hover:scale-105"/>
        <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/55 to-transparent"/>
        <div className="relative max-w-lg"><h2 className="text-3xl font-bold md:text-4xl">{zh?card.titleZh:card.titleEn}</h2><p className="mt-4 leading-7 text-slate-200">{zh?card.descriptionZh:card.descriptionEn}</p><span className="mt-7 inline-flex items-center gap-1 border-b border-amber-400 pb-1 font-semibold">{t.common.learnMore}<ArrowUpRight size={16}/></span></div>
      </Link>)}
    </section>

    <section className="section-pad">
      <div className="container-shell">
        <div className="flex flex-col gap-7 md:flex-row md:items-end md:justify-between">
          <SectionHeading eyebrow={zh?home.activity.eyebrowZh:home.activity.eyebrowEn} title={zh?home.activity.titleZh:home.activity.titleEn}/>
          <SecondaryButton to="/activity">{zh?'查看全部活动':'View All Activities'}</SecondaryButton>
        </div>
        <div className="mt-12 grid gap-6 md:grid-cols-3">{site.news.slice(0,3).map(article=><NewsCard key={article.id} article={article}/>)}</div>
      </div>
    </section>
    <QuoteCTA/>
  </>;
}
