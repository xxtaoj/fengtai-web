import { BadgeCheck, FileText, Globe2, Languages, PackageCheck, Ship } from 'lucide-react';
import { useSite } from '../context/SiteContext';
import { useLanguage } from '../i18n/useLanguage';
import { ExportInquiryForm } from '../forms/ExportInquiryForm';
import { PageHero } from '../components/PageHero';
import { SectionHeading } from '../components/SectionHeading';
import { ProcessStep } from '../components/ProcessStep';
import { ServiceCard } from '../components/ServiceCard';
import { Seo } from '../components/Seo';

export function ExportPage(){
  const {language}=useLanguage();
  const zh=language==='zh';
  const {site}=useSite();
  const copy = site.copy.export as {
    hero: { eyebrowZh: string; eyebrowEn: string; titleZh: string; titleEn: string; descriptionZh: string; descriptionEn: string; image: string };
    trade: { titleZh: string; titleEn: string };
  };
  const adv=[[Languages,zh?'国际沟通':'International Communication'],[FileText,zh?'英文报价支持':'English Quotation Support'],[PackageCheck,zh?'出口包装':'Export Packaging'],[Ship,zh?'出货支持':'Shipment Support'],[BadgeCheck,zh?'第三方验货协调':'Third-party Inspection'],[Globe2,zh?'售后沟通':'After-sales Communication']];
  const trade=[
    [zh?'出口港口':'Export Port',zh?site.company.exportPort:site.company.exportPortEn],
    ['Incoterms',site.company.incoterms],
    [zh?'付款方式':'Payment Methods',zh?site.company.payment:site.company.paymentEn],
    [zh?'最小起订量':'MOQ',zh?site.company.moq:site.company.moqEn],
    [zh?'交货周期':'Lead Time',zh?site.company.leadTime:site.company.leadTimeEn],
    [zh?'可提供单据':'Documentation','[待确认 / To be confirmed]'],
  ];

  return <>
    <Seo title={{zh:'外贸服务',en:'Export Services'}} description={{zh:'面向海外客户的制造与出口支持。',en:'Manufacturing and export support for international buyers.'}}/>
    <PageHero image={copy.hero.image} eyebrow={zh?copy.hero.eyebrowZh:copy.hero.eyebrowEn} title={zh?copy.hero.titleZh:copy.hero.titleEn} description={zh?copy.hero.descriptionZh:copy.hero.descriptionEn}/>
    <main>
      <section className="section-pad bg-white"><div className="container-shell"><SectionHeading eyebrow={zh?'外贸流程':'Export Process'} title={zh?'十个关键节点，明确双方责任':'Ten clear milestones with shared accountability'} description={zh?'下列流程为可编辑框架，合同条款及具体责任请按真实业务确认。':'This editable framework must be aligned with actual terms and responsibilities.'}/><div className="mt-12 grid gap-x-8 gap-y-10 sm:grid-cols-2 lg:grid-cols-5">{site.exportSteps.map((s,i)=><ProcessStep key={i} number={i+1} title={zh?s[0]:s[1]} description={zh?'工厂责任：[待确认]；客户责任：[待确认]':'Factory: [confirm]; Customer: [confirm]'}/>)}</div></div></section>
      <section className="section-pad"><div className="container-shell grid gap-14 lg:grid-cols-[.8fr_1.2fr]"><SectionHeading eyebrow={zh?'市场区域':'Market Regions'} title={zh?'服务范围以实际出口记录为准':'Market coverage must reflect actual records'} description={zh?'以下地区仅作为后台可编辑分类，不代表工厂已出口到这些市场。':'These regions are editable categories only and do not claim existing export activity.'}/><div className="grid gap-3 sm:grid-cols-2">{site.marketRegions.map(x=><div key={x} className="flex items-center justify-between border border-line bg-white p-5"><span className="font-semibold text-ink">{x}</span><span className="text-xs text-accent">{zh?'待确认':'Unconfirmed'}</span></div>)}</div></div></section>
      <section className="section-pad bg-ink"><div className="container-shell"><SectionHeading eyebrow={zh?'外贸支持':'Export Support'} title={zh?'服务能力发布前逐项确认':'Confirm every capability before publishing'} description={zh?'页面不会把未确认的服务写成既定事实。':'Unconfirmed services are never presented as established facts.'}/><div className="mt-12 grid gap-px bg-white/10 sm:grid-cols-2 lg:grid-cols-3">{adv.map(([Icon,title])=><ServiceCard key={String(title)} icon={Icon as typeof Globe2} title={String(title)} description={zh?'[服务内容待确认]':'[Service details to be confirmed]'}/>)}</div></div></section>
      <section className="section-pad bg-white"><div className="container-shell"><SectionHeading eyebrow={zh?'贸易信息':'Trade Information'} title={zh?copy.trade.titleZh:copy.trade.titleEn}/><dl className="mt-10 grid border-l border-t border-line sm:grid-cols-2 lg:grid-cols-3">{trade.map(([k,v])=><div key={k} className="border-b border-r border-line p-6"><dt className="text-xs font-semibold uppercase tracking-wide text-muted">{k}</dt><dd className="mt-2 font-bold text-ink">{v}</dd></div>)}</dl></div></section>
      <section className="section-pad"><div className="container-shell grid gap-12 lg:grid-cols-[.7fr_1.3fr]"><SectionHeading eyebrow={zh?'发送询盘':'Send an Inquiry'} title={zh?'把产品与交付要求告诉我们':'Tell us what you need and where it needs to go'} description={zh?'当前表单仅演示前端校验，接入业务邮箱或 CRM 后方可正式使用。':'This form currently demonstrates browser validation only. Connect it to email or CRM before launch.'}/><ExportInquiryForm/></div></section>
    </main>
  </>;
}
