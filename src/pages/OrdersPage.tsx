import { useSite } from '../context/SiteContext';
import { useLanguage } from '../i18n/useLanguage';
import { OrderForm } from '../forms/OrderForm';
import { PageHero } from '../components/PageHero';
import { SectionHeading } from '../components/SectionHeading';
import { ProcessStep } from '../components/ProcessStep';
import { Seo } from '../components/Seo';

export function OrdersPage(){
  const {language}=useLanguage();
  const zh=language==='zh';
  const {site}=useSite();
  const copy = site.copy.orders as {
    hero: { eyebrowZh: string; eyebrowEn: string; titleZh: string; titleEn: string; descriptionZh: string; descriptionEn: string; image: string };
    process: { titleZh: string; titleEn: string };
    faq: { titleZh: string; titleEn: string };
  };
  const process=zh
    ?['提交需求','工厂评估','业务联系','提供报价','样品确认','订单确认','生产制造','质量检验','安排发货']
    :['Submit Requirements','Factory Review','Sales Contact','Quotation','Sample Confirmation','Order Confirmation','Production','Inspection','Shipment'];

  return <>
    <Seo title={{zh:'提交订单',en:'Submit an Order'}} description={{zh:'提交产品、数量、定制、包装和交期要求。',en:'Submit product, quantity, customization, packaging, and delivery requirements.'}}/>
    <PageHero image={copy.hero.image} eyebrow={zh?copy.hero.eyebrowZh:copy.hero.eyebrowEn} title={zh?copy.hero.titleZh:copy.hero.titleEn} description={zh?copy.hero.descriptionZh:copy.hero.descriptionEn}/>
    <section className="section-pad"><div className="container-shell"><OrderForm/></div></section>
    <section className="section-pad bg-white"><div className="container-shell"><SectionHeading eyebrow={zh?'订单流程':'Order Process'} title={zh?copy.process.titleZh:copy.process.titleEn}/><div className="mt-12 grid gap-x-8 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">{process.map((title,index)=><ProcessStep key={title} number={index+1} title={title} description={zh?'[具体时效与责任待确认]':'[Confirm timing and responsibilities]'}/>)}</div></div></section>
    <section id="faq" className="section-pad scroll-mt-28"><div className="container-shell"><SectionHeading eyebrow={zh?'常见问题':'FAQ'} title={zh?copy.faq.titleZh:copy.faq.titleEn}/><div className="mt-10 grid gap-3 lg:grid-cols-2">{site.faqs.map((question,index)=><details key={index} className="group border border-line bg-white p-5"><summary className="cursor-pointer list-none font-bold text-ink">{zh?question[0]:question[1]}<span className="float-right text-accent transition-transform group-open:rotate-45">+</span></summary><p className="mt-4 border-t border-line pt-4 text-sm leading-6 text-muted">{zh?'[请根据工厂真实政策填写答案。]':'[Add an answer based on the factory’s actual policy.]'}</p></details>)}</div></div></section>
  </>;
}
