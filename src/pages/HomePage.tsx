import { ArrowUpRight, CheckCircle2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { company } from '../data/company';
import { useCatalog } from '../context/CatalogContext';
import { news } from '../data/news';
import { useLanguage } from '../i18n/useLanguage';
import { PrimaryButton, SecondaryButton } from '../components/Button';
import { LocalImage } from '../components/Media';
import { ProductCard } from '../components/ProductCard';
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
  const {products}=catalog;
  const zh=language==='zh';
  const reveal=useScrollReveal<HTMLDivElement>();
  const heroTitleParts=zh?t.home.title.split('-'):null;
  const advantages = zh
    ? ['源头织布工厂，业务沟通更直接','常规在机现货，便于快速寄样和报价','支持来样定织，适配混纺与交织开发','面向海内外采购商，产品层级简洁清楚']
    : ['Source weaving factory with direct communication','Regular running stock for faster samples and quotes','Sample-based custom weaving for blended and interwoven fabrics','Simple product hierarchy for domestic and overseas buyers'];

  return <>
    <Seo title={{zh:'首页',en:'Home'}} description={{zh:'丰泰永晟织造工厂官网，展示现货面料、来样定织、工厂实景和在线询盘。',en:'Official website of Fengtai Yongsheng weaving factory, showing ready-stock fabrics, custom weaving, factory scenes, and online inquiry.'}}/>

    <section className="relative min-h-[100svh] overflow-hidden bg-ink text-white">
      <video src="/videos/factory-hero.mp4" poster="/images/hero-poster.jpg" autoPlay muted loop playsInline className="absolute inset-0 size-full object-cover object-bottom" aria-label={zh?'工厂生产场景视频':'Factory production video'}>Your browser does not support video.</video>
      <div className="absolute inset-0 bg-black/40"/>
      <div className="relative z-10 mx-auto flex min-h-[100svh] w-[min(calc(100%-2rem),115rem)] items-center pb-8 pt-28 sm:pb-0 sm:pt-32">
        <div className="max-w-[60rem]">
          <p className="mb-4 text-xs font-bold text-white sm:mb-7 sm:text-base">{t.home.eyebrow}</p>
          <h1 className="max-w-[50rem] text-[2.35rem] font-medium leading-[1.06] tracking-normal sm:text-6xl sm:leading-[1.12] lg:text-[4.25rem] xl:text-[4.75rem]">
            {heroTitleParts&&heroTitleParts.length===2?<>{heroTitleParts[0]}-<br/>{heroTitleParts[1]}</>:t.home.title}
          </h1>
          <p className="mt-5 max-w-2xl text-[0.95rem] leading-7 text-white/85 sm:mt-7 sm:text-base sm:leading-8 md:text-lg">{t.home.desc}</p>
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
          <LocalImage src="/images/factory-exterior.jpg" alt={zh?'丰泰永晟工厂外景':'Fengtai Yongsheng factory exterior'} className="aspect-[4/3] w-full object-cover"/>
          <div className="absolute -bottom-5 right-0 bg-accent px-6 py-5 text-white md:right-[-1rem]"><strong>{zh?company.location:company.locationEn}</strong><span className="block text-xs opacity-80">{zh?'办公与生产协同':'Office and production coordination'}</span></div>
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

    <section className="section-pad">
      <div className="container-shell">
        <div className="flex flex-col gap-7 md:flex-row md:items-end md:justify-between">
          <SectionHeading eyebrow={zh?'主力面料':'Main Fabrics'} title={zh?'按采购用途找到合适面料':'Find fabrics by sourcing need'} description={zh?'先选择常规现货或来样定织，再按床品、服装、混纺与交织方向查看产品。':'Start with available fabrics or custom weaving, then browse bedding, apparel, blended, and interwoven options.'}/>
          <SecondaryButton to="/products">{zh?'查看全部产品':'View All Products'}</SecondaryButton>
        </div>
        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">{products.slice(0,6).map(product=><ProductCard key={product.id} product={product}/>)}</div>
      </div>
    </section>

    <FeatureShowcase/>

    <section className="section-pad bg-white">
      <div className="container-shell grid gap-10 lg:grid-cols-2 lg:items-center">
        <div>
          <SectionHeading eyebrow={zh?'工厂实拍':'Factory Visuals'} title={zh?'看得见的生产、品控与仓储':'Production, quality, and storage you can see'} description={zh?'通过织造现场、面料细节、工厂外景和出货记录，了解订单如何从样品走向交付。':'See how an order moves from sample to delivery through weaving, fabric details, factory views, and shipment records.'}/>
          <PrimaryButton to="/company#factory-sites" className="mt-8">{zh?'查看工厂实景':'View Factory Sites'}</PrimaryButton>
        </div>
        <VideoBlock src="/videos/factory-tour.mp4" poster="/images/factory-interior.jpg" title={zh?'工厂参观视频':'Factory tour video'}/>
      </div>
    </section>

    <section className="grid min-h-[34rem] lg:grid-cols-2">
      {[['/images/warehouse.jpg',zh?'常规在机现货产品':'Available & Running Fabrics',zh?'床品面料、服装面料等常规方向，适合快速看样、确认规格和推进报价。':'Bedding and apparel fabrics for sample review, specification confirmation, and quotation.','/products#ready-stock'],['/images/quality-control.jpg',zh?'定制织造产品':'Custom Weaving from Sample',zh?'根据来样、成分、组织和用途评估混纺、交织等定织方案。':'We review samples, composition, construction, and end use before confirming a custom-weaving plan.','/products#custom-weaving']].map(([image,title,description,to])=><Link to={to} key={to} className="group relative flex min-h-80 items-end overflow-hidden p-8 text-white md:p-12">
        <LocalImage src={image} alt={title} className="absolute inset-0 size-full object-cover transition duration-700 group-hover:scale-105"/>
        <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/55 to-transparent"/>
        <div className="relative max-w-lg"><h2 className="text-3xl font-bold md:text-4xl">{title}</h2><p className="mt-4 leading-7 text-slate-200">{description}</p><span className="mt-7 inline-flex items-center gap-1 border-b border-amber-400 pb-1 font-semibold">{t.common.learnMore}<ArrowUpRight size={16}/></span></div>
      </Link>)}
    </section>

    <section className="section-pad">
      <div className="container-shell">
        <div className="flex flex-col gap-7 md:flex-row md:items-end md:justify-between">
          <SectionHeading eyebrow={zh?'公司活动':'Company Activities'} title={zh?'现场见面，持续合作':'Meet in person. Keep business moving.'}/>
          <SecondaryButton to="/activity">{zh?'查看全部活动':'View All Activities'}</SecondaryButton>
        </div>
        <div className="mt-12 grid gap-6 md:grid-cols-3">{news.slice(0,3).map(article=><NewsCard key={article.id} article={article}/>)}</div>
      </div>
    </section>
    <QuoteCTA/>
  </>;
}
