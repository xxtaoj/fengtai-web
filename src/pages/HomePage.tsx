import { ArrowDown } from 'lucide-react';
import { Link } from 'react-router-dom';
import { company } from '../data/company';
import { products } from '../data/products';
import { news } from '../data/news';
import { useLanguage } from '../i18n/useLanguage';
import { PrimaryButton,SecondaryButton } from '../components/Button';
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
  const zh=language==='zh';
  const reveal=useScrollReveal<HTMLDivElement>();

  return <>
    <Seo title={{zh:'首页',en:'Home'}} description={{zh:'[工厂中文名称]专业制造官网。',en:'Official manufacturing website of [English Company Name].'}}/>

    <section className="relative flex min-h-[92vh] items-end overflow-hidden bg-ink pb-20 pt-32 text-white">
      <video src="/videos/factory-hero.mp4" poster="/images/hero-poster.jpg" autoPlay muted loop playsInline className="absolute inset-0 size-full object-cover" aria-label={zh?'工厂生产场景视频':'Factory production video'}>Your browser does not support video.</video>
      <div className="absolute inset-0 bg-gradient-to-r from-ink via-ink/75 to-ink/20"/>
      <div className="industrial-grid absolute inset-0"/>
      <div className="container-shell relative grid items-end gap-12 lg:grid-cols-[1fr_17rem]">
        <div className="max-w-5xl">
          <p className="mb-6 text-xs font-bold uppercase tracking-[.25em] text-amber-400">{t.home.eyebrow}</p>
          <h1 className="display font-bold">{t.home.title}</h1>
          <p className="mt-7 max-w-2xl text-base leading-8 text-slate-200 md:text-lg">{t.home.desc}</p>
          <div className="mt-9 flex flex-wrap gap-3"><PrimaryButton to="/orders">{t.common.quote}</PrimaryButton><SecondaryButton to="/contact">{zh?'了解我们的工厂':'Explore Our Factory'}</SecondaryButton></div>
        </div>
        <div className="hidden border-l border-white/25 pl-6 text-sm text-slate-300 lg:block"><p>{zh?'滚动了解制造能力':'Scroll to explore our capabilities'}</p><ArrowDown className="mt-5 animate-bounce text-amber-400"/></div>
      </div>
    </section>

    <section id="about" className="section-pad scroll-mt-28 bg-white">
      <div ref={reveal} className="container-shell reveal grid gap-12 lg:grid-cols-[1fr_1fr] lg:items-center">
        <div className="relative"><LocalImage src="/images/factory-exterior.jpg" alt={zh?'[工厂中文名称]厂区外景':'Exterior of [English Company Name]'} className="aspect-[4/3] w-full object-cover"/><div className="absolute -bottom-5 right-0 bg-accent px-6 py-5 text-white md:right-[-1rem]"><strong>{company.location}</strong><span className="block text-xs opacity-80">{zh?'工厂所在地':'Factory location'}</span></div></div>
        <div><SectionHeading eyebrow={zh?'关于工厂':'About the Factory'} title={zh?'稳定制造，清晰协作':'Stable production. Clear collaboration.'} description={zh?'[请填写工厂发展历程、生产基础、团队经验和服务理念。所有占位信息发布前均需替换。]':'[Add the factory history, production foundation, team experience, and service philosophy. Replace all placeholders before publishing.]'}/><dl className="mt-8 grid gap-4 sm:grid-cols-2">{[[zh?'主营产品':'Main Products',company.mainProducts],[zh?'出口市场':'Export Markets',company.exportMarkets],[zh?'国内市场':'Domestic Markets',company.domesticMarkets],[zh?'工厂认证':'Certifications',company.certifications.join(' · ')]].map(([key,value])=><div key={key} className="border-t border-line pt-4"><dt className="text-xs font-semibold uppercase tracking-wide text-muted">{key}</dt><dd className="mt-2 font-semibold text-ink">{value}</dd></div>)}</dl></div>
      </div>
      <div className="container-shell mt-16"><StatsSection/></div>
    </section>

    <section className="section-pad">
      <div className="container-shell">
        <div className="flex flex-col gap-7 md:flex-row md:items-end md:justify-between"><SectionHeading eyebrow={zh?'产品中心':'Products'} title={zh?'面向真实采购需求的产品呈现':'Products organized for real buying decisions'} description={zh?'产品名称、参数和图片均使用可编辑本地数据。':'Names, specifications, and images are managed as editable local data.'}/><SecondaryButton to="/orders">{t.common.quote}</SecondaryButton></div>
        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">{products.map(product=><ProductCard key={product.id} product={product}/>)}</div>
      </div>
    </section>

    <FeatureShowcase/>

    <section className="section-pad bg-white">
      <div className="container-shell grid gap-10 lg:grid-cols-2 lg:items-center"><div><SectionHeading eyebrow={zh?'工厂视频':'Factory Video'} title={zh?'走进生产现场':'Step inside the production floor'} description={zh?'请用真实工厂视频替换本地文件，展示厂区、设备、生产流程和质量管理。':'Replace the local file with authentic footage showing facilities, equipment, workflow, and quality control.'}/><PrimaryButton to="/contact" className="mt-8">{zh?'预约参观工厂':'Arrange a Factory Visit'}</PrimaryButton></div><VideoBlock src="/videos/factory-tour.mp4" poster="/images/factory-interior.jpg" title={zh?'工厂参观视频':'Factory tour video'}/></div>
    </section>

    <section className="grid min-h-[34rem] lg:grid-cols-2">
      {[["/images/export-banner.jpg",zh?'外贸业务':'Export Services',zh?'为海外客户提供产品开发、报价、生产、验货、报关及出货支持。':'Supporting international customers from product development and quotation to production, inspection, customs documentation, and shipment.','/export'],['/images/domestic-banner.jpg',zh?'内销业务':'Domestic Sales',zh?'服务国内经销商、品牌方、工程项目及企业采购客户。':'Serving domestic distributors, brands, engineering projects, and corporate buyers.','/domestic']].map(([image,title,description,to])=><Link to={to} key={to} className="group relative flex min-h-80 items-end overflow-hidden p-8 text-white md:p-12"><LocalImage src={image} alt={title} className="absolute inset-0 size-full object-cover transition duration-700 group-hover:scale-105"/><div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/55 to-transparent"/><div className="relative max-w-lg"><h2 className="text-3xl font-bold md:text-4xl">{title}</h2><p className="mt-4 leading-7 text-slate-200">{description}</p><span className="mt-7 inline-block border-b border-amber-400 pb-1 font-semibold">{t.common.learnMore}</span></div></Link>)}
    </section>

    <section className="section-pad"><div className="container-shell"><div className="flex flex-col gap-7 md:flex-row md:items-end md:justify-between"><SectionHeading eyebrow={zh?'最新动态':'Latest News'} title={zh?'来自工厂与行业的一线信息':'Updates from the factory and the industry'}/><SecondaryButton to="/news">{zh?'查看全部新闻':'View All News'}</SecondaryButton></div><div className="mt-12 grid gap-6 md:grid-cols-3">{news.slice(0,3).map(article=><NewsCard key={article.id} article={article}/>)}</div></div></section>
    <QuoteCTA/>
  </>;
}
