import { Clock, Mail, MapPin, MessageCircle, Phone, Send, Warehouse } from 'lucide-react';
import { company } from '../data/company';
import { useLanguage } from '../i18n/useLanguage';
import { ContactForm } from '../forms/ContactForm';
import { PageHero } from '../components/PageHero';
import { SectionHeading } from '../components/SectionHeading';
import { ContactCard } from '../components/ContactCard';
import { Seo } from '../components/Seo';

const addresses = [
  {titleZh:'石家庄总部',titleEn:'Shijiazhuang Headquarters',nameZh:company.headOfficeName,nameEn:company.headOfficeName,addressZh:company.headOfficeAddress,addressEn:company.headOfficeAddress},
  {titleZh:'新疆喀什厂区',titleEn:'Kashgar Factory',nameZh:company.xinjiangFactoryName,nameEn:company.xinjiangFactoryName,addressZh:company.xinjiangFactoryAddress,addressEn:company.xinjiangFactoryAddress},
  {titleZh:'宁夏生产基地',titleEn:'Ningxia Production Base',nameZh:company.ningxiaFactoryName,nameEn:company.ningxiaFactoryName,addressZh:company.ningxiaFactoryAddress,addressEn:company.ningxiaFactoryAddress},
];

const inquiryFormat = [
  ['产品分类','Product category','床品面料 / 服装面料 / 混纺面料 / 交织面料','Bedding fabrics / apparel fabrics / blended fabrics / interwoven fabrics'],
  ['面料规格','Fabric specs','成分、纱支、密度、门幅、克重、组织结构','Composition, yarn count, density, width, weight, and weave structure'],
  ['采购数量','Quantity','米数、公斤数、柜量或预计批量','Meters, kilograms, container volume, or estimated order quantity'],
  ['样品需求','Sample request','寄样、来样定织、样品照片或样布信息','Sample delivery, custom weaving from samples, sample photos, or swatch details'],
  ['交付信息','Delivery details','目的国家、目的港、目标交期、贸易条款','Destination country, destination port, target lead time, and trade terms'],
  ['联系方式','Contact details','手机号、企业邮箱、微信或 WhatsApp','Mobile number, business email, WeChat, or WhatsApp'],
];

export function ContactPage(){
  const {language,t}=useLanguage();
  const zh=language==='zh';
  return <>
    <Seo title={{zh:'联系我们',en:'Contact Us'}} description={{zh:'丰泰永晟办公及工厂地址、客服联络方式和在线业务询盘格式表。',en:'Fengtai Yongsheng office and factory addresses, service contacts, and online inquiry format.'}}/>
    <PageHero image="/images/contact-banner.jpg" eyebrow={zh?'联系我们':'Contact Us'} title={t.pages.contact} description={zh?'如需询价、寄样或来样定织，请提供面料规格、数量、用途和交付要求。':'For quotations, samples, or custom weaving, please include fabric specifications, quantity, end use, and delivery requirements.'}/>

    <main>
      <section id="addresses" className="section-pad scroll-mt-28 bg-white">
        <div className="container-shell">
          <SectionHeading eyebrow={zh?'办公及工厂详细地址':'Office & Factory Addresses'} title={zh?'石家庄总部、新疆喀什厂区、宁夏生产基地':'Shijiazhuang headquarters, Kashgar factory, and Ningxia production base'} description={zh?'以下地址已按名片信息整理，可直接用于到访、地图和业务联系。':'The addresses below are extracted from the card and ready for visit, map, and business use.'}/>
          <div className="mt-10 grid gap-5 md:grid-cols-3">
            {addresses.map(site=><article key={site.titleZh} className="border border-line bg-canvas p-6">
              <Warehouse className="text-accent" size={28}/>
              <h3 className="mt-5 text-xl font-bold text-ink">{zh?site.titleZh:site.titleEn}</h3>
              <p className="mt-3 text-sm font-semibold text-ink">{zh?site.nameZh:site.nameEn}</p>
              <p className="mt-3 text-sm leading-6 text-muted">{zh?site.addressZh:site.addressEn}</p>
            </article>)}
          </div>
        </div>
      </section>

      <section id="channels" className="section-pad scroll-mt-28">
        <div className="container-shell">
          <SectionHeading eyebrow={zh?'客服联络方式':'Service Contacts'} title={zh?'选择最快的业务对接方式':'Choose the fastest business contact path'} description={zh?'用于产品询盘、寄样申请、来样定织、工厂到访和外贸采购沟通。':'For product inquiries, sample requests, custom weaving from samples, factory visits, and export sourcing communication.'}/>
          <div className="mt-10 grid gap-3 md:grid-cols-2 md:items-start">
            <div className="grid gap-3">
              <ContactCard icon={Send} label={zh?'联系人':'Contact'} value={`${company.contactPerson} · ${company.contactTitle}`}/>
              <ContactCard icon={Phone} label={zh?'手机号':'Mobile'} value={company.phone} href={`tel:${company.phone}`}/>
              <ContactCard icon={Mail} label={zh?'企业邮箱':'Business Email'} value={company.email} href={`mailto:${company.email}`}/>
              <ContactCard icon={MessageCircle} label="WeChat / WhatsApp" value={`${company.wechat} / ${company.whatsapp}`}/>
            </div>
            <div className="grid gap-3">
              <ContactCard icon={Clock} label={zh?'服务时间':'Business Hours'} value={zh?company.businessHours:company.businessHoursEn}/>
              <ContactCard icon={MapPin} label={zh?'办公地址':'Office Address'} value={company.headOfficeAddress}/>
              <ContactCard icon={Warehouse} label={zh?'工厂位置':'Factory Locations'} value={zh?company.location:company.locationEn}/>
            </div>
          </div>
        </div>
      </section>

      <section id="inquiry" className="section-pad scroll-mt-28 bg-white">
        <div className="container-shell grid gap-12 lg:grid-cols-[.8fr_1.2fr]">
          <div>
            <SectionHeading eyebrow={zh?'在线业务询盘格式表':'Online Inquiry Form'} title={zh?'按面料采购格式提交，沟通更高效':'Submit in a fabric sourcing format for faster communication'} description={zh?'下方表单为前端演示，正式上线前可接入企业邮箱、CRM 或后台。':'The form below is a front-end demo. Connect it to business email, CRM, or a backend before launch.'}/>
            <div className="mt-8 grid gap-3">
              {inquiryFormat.map(([zhLabel,enLabel,zhExample,enExample])=><div key={zhLabel} className="border-t border-line pt-4">
                <dt className="text-xs font-semibold uppercase text-muted">{zh?zhLabel:enLabel}</dt>
                <dd className="mt-1 font-semibold text-ink">{zh?zhExample:enExample}</dd>
              </div>)}
            </div>
          </div>
          <ContactForm/>
        </div>
      </section>
    </main>
  </>;
}
