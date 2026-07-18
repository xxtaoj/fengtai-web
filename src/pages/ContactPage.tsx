import { Clock, Mail, MapPin, MessageCircle, Phone, Send, Warehouse } from 'lucide-react';
import { company } from '../data/company';
import { useLanguage } from '../i18n/useLanguage';
import { ContactForm } from '../forms/ContactForm';
import { PageHero } from '../components/PageHero';
import { SectionHeading } from '../components/SectionHeading';
import { ContactCard } from '../components/ContactCard';
import { Seo } from '../components/Seo';

const addresses = [
  {titleZh:'石家庄总部',titleEn:'Shijiazhuang Headquarters',descZh:'业务接待、样品沟通、客户资料整理与外贸对接。',descEn:'Business reception, sample discussion, buyer documentation, and export coordination.'},
  {titleZh:'新疆喀什厂区',titleEn:'Kashgar Factory',descZh:'生产工厂实景、织造生产与订单执行协作。',descEn:'Factory scenes, weaving production, and order execution coordination.'},
  {titleZh:'宁夏生产基地',titleEn:'Ningxia Production Base',descZh:'织造产能补充、现货整理、仓储和排产协同。',descEn:'Additional weaving capacity, stock organization, warehousing, and scheduling.'},
];

const inquiryFormat = [
  ['产品分类','Product category','床品面料 / 服装面料 / 混纺面料 / 交织面料'],
  ['面料规格','Fabric specs','成分、纱支、密度、门幅、克重、组织结构'],
  ['采购数量','Quantity','米数、公斤数、柜量或预计批量'],
  ['样品需求','Sample request','寄样、来样定织、样品照片或样布信息'],
  ['交付信息','Delivery details','目的国家、目的港、目标交期、贸易条款'],
  ['联系方式','Contact details','手机号、企业邮箱、微信或 WhatsApp'],
];

export function ContactPage(){
  const {language,t}=useLanguage();
  const zh=language==='zh';
  return <>
    <Seo title={{zh:'联系我们',en:'Contact Us'}} description={{zh:'丰泰纺织办公及工厂地址、客服联络方式和在线业务询盘格式表。',en:'Fengtai Textile office and factory addresses, service contacts, and online inquiry format.'}}/>
    <PageHero image="/images/contact-banner.jpg" eyebrow={zh?'联系我们':'Contact Us'} title={t.pages.contact} description={zh?'联系板块重点服务询盘、寄样和来样定织转化，请尽量提供面料规格、数量、用途和交付要求。':'The contact section focuses on inquiry, sample delivery, and custom weaving conversion. Please include fabric specs, quantity, application, and delivery requirements.'}/>

    <main>
      <section id="addresses" className="section-pad scroll-mt-28 bg-white">
        <div className="container-shell">
          <SectionHeading eyebrow={zh?'办公及工厂详细地址':'Office & Factory Addresses'} title={zh?'石家庄总部、新疆喀什厂区、宁夏生产基地':'Shijiazhuang headquarters, Kashgar factory, and Ningxia production base'} description={zh?'详细门牌、导航定位和到访安排请在正式上线前补充确认。':'Detailed street address, map position, and visit arrangements should be verified before launch.'}/>
          <div className="mt-10 grid gap-5 md:grid-cols-3">
            {addresses.map(site=><article key={site.titleZh} className="border border-line bg-canvas p-6">
              <Warehouse className="text-accent" size={28}/>
              <h3 className="mt-5 text-xl font-bold text-ink">{zh?site.titleZh:site.titleEn}</h3>
              <p className="mt-3 text-sm leading-6 text-muted">{zh?site.descZh:site.descEn}</p>
              <p className="mt-5 border-t border-line pt-4 text-sm font-semibold text-ink">{zh?'详细地址待补充':'Detailed address to be provided'}</p>
            </article>)}
          </div>
        </div>
      </section>

      <section id="channels" className="section-pad scroll-mt-28">
        <div className="container-shell grid gap-12 lg:grid-cols-[.85fr_1.15fr]">
          <div>
            <SectionHeading eyebrow={zh?'客服联络方式':'Service Contacts'} title={zh?'选择最快的业务对接方式':'Choose the fastest business contact path'} description={zh?'用于产品询盘、寄样申请、来样定织、工厂到访和外贸采购沟通。':'For product inquiries, sample requests, custom weaving from samples, factory visits, and export sourcing communication.'}/>
            <div className="mt-8 grid gap-3">
              <ContactCard icon={Phone} label={zh?'手机号':'Mobile'} value={company.phone} href={`tel:${company.phone}`}/>
              <ContactCard icon={Mail} label={zh?'企业邮箱':'Business Email'} value={company.email} href={`mailto:${company.email}`}/>
              <ContactCard icon={MessageCircle} label="WeChat / WhatsApp" value={`${company.wechat} / ${company.whatsapp}`}/>
              <ContactCard icon={Clock} label={zh?'服务时间':'Business Hours'} value={company.businessHours}/>
              <ContactCard icon={MapPin} label={zh?'办公及工厂':'Office & Factories'} value={company.address}/>
            </div>
          </div>
          <div className="border border-line bg-white p-6 md:p-8">
            <Send className="text-accent" size={30}/>
            <h3 className="mt-5 text-2xl font-bold text-ink">{zh?'寄样与询盘建议':'Sample and inquiry notes'}</h3>
            <p className="mt-4 leading-7 text-muted">{zh?'如需寄样或来样定织，请先提供样品照片、目标规格、预估数量和目的市场。业务团队会根据现货或生产可行性反馈。':'For sample delivery or custom weaving, provide sample photos, target specs, estimated quantity, and target market first. The sales team will respond based on stock or production feasibility.'}</p>
          </div>
        </div>
      </section>

      <section id="inquiry" className="section-pad scroll-mt-28 bg-white">
        <div className="container-shell grid gap-12 lg:grid-cols-[.8fr_1.2fr]">
          <div>
            <SectionHeading eyebrow={zh?'在线业务询盘格式表':'Online Inquiry Form'} title={zh?'按面料采购格式提交，沟通更高效':'Submit in a fabric sourcing format for faster communication'} description={zh?'下方表单为前端演示，正式上线前可接入企业邮箱、CRM 或后台。':'The form below is a front-end demo. Connect it to business email, CRM, or a backend before launch.'}/>
            <div className="mt-8 grid gap-3">
              {inquiryFormat.map(([zhLabel,enLabel,example])=><div key={zhLabel} className="border-t border-line pt-4">
                <dt className="text-xs font-semibold uppercase text-muted">{zh?zhLabel:enLabel}</dt>
                <dd className="mt-1 font-semibold text-ink">{example}</dd>
              </div>)}
            </div>
          </div>
          <ContactForm/>
        </div>
      </section>
    </main>
  </>;
}
