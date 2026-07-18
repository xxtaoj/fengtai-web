import { faqs } from '../data/faqs';
import { useLanguage } from '../i18n/useLanguage';
import { OrderForm } from '../forms/OrderForm';
import { PageHero } from '../components/PageHero';
import { SectionHeading } from '../components/SectionHeading';
import { ProcessStep } from '../components/ProcessStep';
import { Seo } from '../components/Seo';

export function OrdersPage(){
  const {language,t}=useLanguage();
  const zh=language==='zh';
  const process=zh
    ?['提交需求','工厂评估','业务联系','提供报价','样品确认','订单确认','生产制造','质量检验','安排发货']
    :['Submit Requirements','Factory Review','Sales Contact','Quotation','Sample Confirmation','Order Confirmation','Production','Inspection','Shipment'];

  return <>
    <Seo title={{zh:'提交订单',en:'Submit an Order'}} description={{zh:'提交产品、数量、定制、包装和交期要求。',en:'Submit product, quantity, customization, packaging, and delivery requirements.'}}/>
    <PageHero image="/images/order-banner.jpg" eyebrow={zh?'订单需求':'Order Requirements'} title={t.pages.orders} description={zh?'请提供产品、数量、材料、定制、包装与交期信息，以便进行可行性评估。':'Provide product, quantity, material, customization, packaging, and delivery details for evaluation.'}/>
    <section className="section-pad"><div className="container-shell"><OrderForm/></div></section>
    <section className="section-pad bg-white"><div className="container-shell"><SectionHeading eyebrow={zh?'订单流程':'Order Process'} title={zh?'提交之后会发生什么':'What happens after submission'}/><div className="mt-12 grid gap-x-8 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">{process.map((title,index)=><ProcessStep key={title} number={index+1} title={title} description={zh?'[具体时效与责任待确认]':'[Confirm timing and responsibilities]'}/>)}</div></div></section>
    <section id="faq" className="section-pad scroll-mt-28"><div className="container-shell"><SectionHeading eyebrow={zh?'常见问题':'FAQ'} title={zh?'下单前的常见问题':'Common questions before ordering'}/><div className="mt-10 grid gap-3 lg:grid-cols-2">{faqs.map((question,index)=><details key={index} className="group border border-line bg-white p-5"><summary className="cursor-pointer list-none font-bold text-ink">{zh?question[0]:question[1]}<span className="float-right text-accent transition-transform group-open:rotate-45">+</span></summary><p className="mt-4 border-t border-line pt-4 text-sm leading-6 text-muted">{zh?'[请根据工厂真实政策填写答案。]':'[Add an answer based on the factory’s actual policy.]'}</p></details>)}</div></div></section>
  </>;
}
