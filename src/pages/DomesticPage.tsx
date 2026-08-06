import { BriefcaseBusiness, Building2, Package, ShoppingBag, Store, Warehouse, Mail, Phone, MessageCircle } from 'lucide-react';
import { useSite } from '../context/SiteContext';
import { useLanguage } from '../i18n/useLanguage';
import { DomesticInquiryForm } from '../forms/DomesticInquiryForm';
import { PageHero } from '../components/PageHero';
import { SectionHeading } from '../components/SectionHeading';
import { ProcessStep } from '../components/ProcessStep';
import { ServiceCard } from '../components/ServiceCard';
import { ContactCard } from '../components/ContactCard';
import { PrimaryButton } from '../components/Button';
import { Seo } from '../components/Seo';

export function DomesticPage(){
  const {language}=useLanguage();
  const zh=language==='zh';
  const {site}=useSite();
  const copy = site.copy.domestic as {
    hero: { eyebrowZh: string; eyebrowEn: string; titleZh: string; titleEn: string; descriptionZh: string; descriptionEn: string; image: string };
    servicesTitleZh: string;
    servicesTitleEn: string;
    processTitleZh: string;
    processTitleEn: string;
  };
  const customers=[[Building2,zh?'品牌客户':'Brand Customers'],[Store,zh?'经销商':'Distributors'],[Warehouse,zh?'批发客户':'Wholesalers'],[BriefcaseBusiness,zh?'工程项目':'Engineering Projects'],[ShoppingBag,zh?'电商客户':'E-commerce Sellers'],[Package,zh?'企业采购':'Corporate Procurement']];
  const services=['产品定制','来样加工','来图加工','小批量试单','批量生产','品牌代工','包装定制','物流配送','发票支持','售后服务'];

  return <>
    <Seo title={{zh:'内销服务',en:'Domestic Sales'}} description={{zh:'服务国内品牌、经销商、项目与企业采购。',en:'Manufacturing support for brands, distributors, projects, and corporate procurement in China.'}}/>
    <PageHero image={copy.hero.image} eyebrow={zh?copy.hero.eyebrowZh:copy.hero.eyebrowEn} title={zh?copy.hero.titleZh:copy.hero.titleEn} description={zh?copy.hero.descriptionZh:copy.hero.descriptionEn}/>
    <section className="section-pad bg-white"><div className="container-shell"><SectionHeading eyebrow={zh?'客户类型':'Customer Types'} title={zh?'面向不同采购场景':'Built around different purchasing scenarios'}/><div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">{customers.map(([Icon,title])=><ServiceCard key={String(title)} icon={Icon as typeof Store} title={String(title)} description={zh?'[请填写对应客户的合作方式与服务边界]':'[Add engagement model and service scope for this customer type]'}/>)}</div></div></section>
    <section className="section-pad"><div className="container-shell grid gap-12 lg:grid-cols-[.7fr_1.3fr]"><SectionHeading eyebrow={zh?copy.servicesTitleZh:copy.servicesTitleEn} title={zh?copy.servicesTitleZh:copy.servicesTitleEn} description={zh?'未确认服务均明确标记，不作为事实陈述。':'Unconfirmed services remain clearly marked and are not factual claims.'}/><div className="grid gap-3 sm:grid-cols-2">{services.map((s,i)=><div key={s} className="border border-line bg-white p-5"><span className="text-xs font-bold text-accent">{String(i+1).padStart(2,'0')}</span><h3 className="mt-2 font-bold text-ink">{zh?s:`[English: ${s}]`}</h3><p className="mt-2 text-xs text-muted">{zh?'状态：待确认':'Status: To be confirmed'}</p></div>)}</div></div></section>
    <section className="section-pad bg-white"><div className="container-shell"><SectionHeading eyebrow={zh?copy.processTitleZh:copy.processTitleEn} title={zh?copy.processTitleZh:copy.processTitleEn}/><div className="mt-12 grid gap-x-8 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">{site.domesticSteps.map((s,i)=><ProcessStep key={i} number={i+1} title={zh?s[0]:s[1]} description={zh?'[节点说明待补充]':'[Add milestone details]'}/>)}</div></div></section>
    <section className="section-pad"><div className="container-shell grid gap-12 lg:grid-cols-2"><div><SectionHeading eyebrow={zh?'内销联系':'Domestic Sales Contact'} title={zh?'直接联系国内业务团队':'Contact the domestic sales team'}/><div className="mt-8 grid gap-3 sm:grid-cols-2"><ContactCard icon={Phone} label={zh?'电话':'Phone'} value={site.company.phone} href={`tel:${site.company.phone}`}/><ContactCard icon={MessageCircle} label="WeChat" value={site.company.wechat}/><ContactCard icon={Mail} label={zh?'邮箱':'Email'} value={site.company.email} href={`mailto:${site.company.email}`}/><ContactCard icon={BriefcaseBusiness} label={zh?'业务经理':'Sales Manager'} value={site.company.domesticContact}/></div><div className="mt-6 flex flex-wrap gap-3"><PrimaryButton to="/orders">{zh?'提交订单':'Submit Order'}</PrimaryButton></div></div><DomesticInquiryForm/></div></section>
  </>;
}
