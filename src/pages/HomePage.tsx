import { ArrowUpRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useCatalog } from '../context/CatalogContext';
import { useSite } from '../context/SiteContext';
import { useLanguage } from '../i18n/useLanguage';
import { SecondaryButton } from '../components/Button';
import { LocalImage } from '../components/Media';
import { NewsCard } from '../components/NewsCard';
import { SectionHeading } from '../components/SectionHeading';
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
    companyIntro?: { titleZh: string; titleEn: string; paragraphsZh: string[]; paragraphsEn: string[]; ctaZh: string; ctaEn: string; ctaTo: string; backgroundImage: string };
    mainFabrics: { eyebrowZh: string; eyebrowEn: string; titleZh: string; titleEn: string; descriptionZh: string; descriptionEn: string };
    activity: { eyebrowZh: string; eyebrowEn: string; titleZh: string; titleEn: string };
  };
  const fallbackIntroductionZh = [
    '丰泰永晟集团成立于1999年，是一家以纺织为核心，融合汽贸、金融、酒店的多元化企业。集团深耕纺织业25年，依托新疆、宁夏两大生产基地的1500余台喷气织机，构建了从棉花到纱线、坯布的完整产业链，年产高档服装及家纺面料超1亿米。',
    '我们以“好棉花—纺好纱—织好布”为核心模式，通过规模化生产与金融资本整合，实现出色的产品性价比；严格把控“万能坯”品质，保障产品足支足密、包漂包染；并在江苏、浙江、广东设立现货前置仓，库存超300万米，支持24小时快速配送。',
    '丰泰永晟始终以优质产品与高效服务携手客户共创价值，践行企业社会责任。',
  ];
  const fallbackIntroductionEn = [
    'Fengtai Yongsheng Group, founded in 1999, is a diversified enterprise with core operations in textiles, complemented by automotive trade, finance, and hotel management. With over 1,500 air-jet looms across production bases in Xinjiang and Ningxia, the group has built an integrated supply chain from cotton to yarn and greige fabric, producing more than 100 million meters of high-quality apparel and home-textile fabric annually.',
    'Guided by the “Quality Cotton—Premium Yarn—Superior Fabric” principle, the company combines scaled production with financial resources to deliver outstanding value. Rigorous controls ensure full yarn count, density, and meterage, with fabrics suitable for bleaching and dyeing. Forward warehouses in Jiangsu, Zhejiang, and Guangdong hold more than 3 million meters of stock and support dispatch within 24 hours.',
    'Fengtai Yongsheng delivers reliable quality and rapid service to partners worldwide while remaining committed to sustainability and corporate social responsibility.',
  ];
  const introduction = zh ? home.companyIntro?.paragraphsZh || fallbackIntroductionZh : home.companyIntro?.paragraphsEn || fallbackIntroductionEn;
  const introductionTitle = zh ? home.companyIntro?.titleZh || '公司简介' : home.companyIntro?.titleEn || 'Company Introduction';
  const introductionCta = zh ? home.companyIntro?.ctaZh || '了解更多公司信息' : home.companyIntro?.ctaEn || 'Learn more about the company';
  const introductionLink = home.companyIntro?.ctaTo || '/company';
  const introductionBg = home.companyIntro?.backgroundImage || '/images/company-introduction-bg-v2.png';
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

    <section id="about" className="relative isolate scroll-mt-28 overflow-hidden bg-[#F4EFE4] py-20 sm:py-24 lg:min-h-[50rem] lg:py-28">
      <LocalImage loading="lazy" src={introductionBg} alt="" className="absolute inset-0 -z-20 size-full object-cover object-[72%_50%]"/>
      <div className="absolute inset-0 -z-10 bg-[linear-gradient(90deg,rgba(250,247,239,.97)_0%,rgba(250,247,239,.91)_54%,rgba(250,247,239,.38)_100%)]"/>
      <div ref={reveal} className="container-shell reveal">
        <div className="max-w-5xl">
          <h2 className="text-5xl font-medium leading-none tracking-[-.05em] text-[#8A3F0A] sm:text-6xl lg:text-7xl">{introductionTitle}</h2>
          <div className="mt-10 max-w-4xl space-y-6 text-base leading-8 text-[#6F3B18] sm:text-lg sm:leading-9">
            {introduction.map(paragraph=><p key={paragraph}>{paragraph}</p>)}
          </div>
          <Link to={introductionLink} className="mt-10 inline-flex min-h-12 items-center gap-2 border-b border-[#8A3F0A] text-sm font-bold text-[#8A3F0A] transition-colors hover:border-ink hover:text-ink">{introductionCta}<ArrowUpRight size={16}/></Link>
        </div>
      </div>
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
