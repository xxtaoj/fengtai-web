import { Clock, Mail, MapPin, MessageCircle, Phone, Send, Warehouse } from 'lucide-react';
import { company } from '../data/company';
import { useLanguage } from '../i18n/useLanguage';
import { PageHero } from '../components/PageHero';
import { SectionHeading } from '../components/SectionHeading';
import { ContactCard } from '../components/ContactCard';
import { Seo } from '../components/Seo';
import { InquiryComposer } from '../components/InquiryComposer';

const addresses = [
  {titleZh:'石家庄总部',titleEn:'Shijiazhuang Headquarters',nameZh:company.headOfficeName,nameEn:company.headOfficeName,addressZh:company.headOfficeAddress,addressEn:company.headOfficeAddress},
  {titleZh:'新疆喀什厂区',titleEn:'Kashgar Factory',nameZh:company.xinjiangFactoryName,nameEn:company.xinjiangFactoryName,addressZh:company.xinjiangFactoryAddress,addressEn:company.xinjiangFactoryAddress},
  {titleZh:'宁夏生产基地',titleEn:'Ningxia Production Base',nameZh:company.ningxiaFactoryName,nameEn:company.ningxiaFactoryName,addressZh:company.ningxiaFactoryAddress,addressEn:company.ningxiaFactoryAddress},
];

export function ContactPage(){
  const {language,t}=useLanguage();
  const zh=language==='zh';
  return <>
    <Seo title={{zh:'联系我们',en:'Contact Us'}} description={{zh:'丰泰永晟办公及工厂地址、客服联络方式和在线业务询盘格式表。',en:'Fengtai Yongsheng office and factory addresses, service contacts, and online inquiry format.'}}/>
    <PageHero image="/images/factory-exterior.jpg" eyebrow={zh?'联系我们':'Contact Us'} title={t.pages.contact} description={zh?'如需询价、寄样或来样定织，请提供面料规格、数量、用途和交付要求。':'For quotations, samples, or custom weaving, please include fabric specifications, quantity, end use, and delivery requirements.'}/>

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
        <div className="container-shell">
          <header className="grid gap-6 lg:grid-cols-[minmax(0,1.25fr)_minmax(18rem,.75fr)] lg:items-end">
            <div>
              <p className="text-xs font-bold uppercase tracking-[.22em] text-accent">{zh?'询价与寄样':'Inquiry & samples'}</p>
              <h2 className="mt-4 max-w-4xl text-4xl font-bold leading-[1.08] tracking-[-.035em] text-ink md:text-5xl">{zh?'把手头有的资料发来，剩下的我们一起确认':'Send what you have. We’ll confirm the rest together.'}</h2>
            </div>
            <p className="max-w-xl text-base leading-8 text-muted">{zh?'产品名称、规格表、图片或实物样，手头有什么就先提供什么。缺少的规格，业务会在后续沟通中逐项确认。':'A product name, specification sheet, photo, or physical sample is enough to get started. Our team will confirm any missing details with you.'}</p>
          </header>
          <div className="mt-10 lg:mt-12"><InquiryComposer/></div>
        </div>
      </section>
    </main>
  </>;
}
