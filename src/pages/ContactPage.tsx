import { Clock, Mail, MapPin, Send, Warehouse, Phone, MessageCircle, Video } from 'lucide-react';
import { useSite } from '../context/SiteContext';
import { useLanguage } from '../i18n/useLanguage';
import { PageHero } from '../components/PageHero';
import { SectionHeading } from '../components/SectionHeading';
import { ContactCard } from '../components/ContactCard';
import { Seo } from '../components/Seo';
import { InquiryComposer } from '../components/InquiryComposer';

export function ContactPage(){
  const {language}=useLanguage();
  const zh=language==='zh';
  const {site}=useSite();
  const contact = site.copy.contact as {
    hero: { eyebrowZh: string; eyebrowEn: string; titleZh: string; titleEn: string; descriptionZh: string; descriptionEn: string; image: string };
    addresses: Array<{ titleZh: string; titleEn: string; nameZh: string; nameEn: string; addressZh: string; addressEn: string }>;
    channels: Array<{ titleZh: string; titleEn: string; value: string; href?: string }>;
    inquiry: { eyebrowZh: string; eyebrowEn: string; titleZh: string; titleEn: string; descriptionZh: string; descriptionEn: string };
  };

  return <>
    <Seo title={{zh:'联系我们',en:'Contact Us'}} description={{zh:'丰泰永晟办公及工厂地址、客服联络方式和在线业务询盘格式表。',en:'Fengtai Yongsheng office and factory addresses, service contacts, and online inquiry format.'}}/>
    <PageHero image={contact.hero.image} eyebrow={zh?contact.hero.eyebrowZh:contact.hero.eyebrowEn} title={zh?contact.hero.titleZh:contact.hero.titleEn} description={zh?contact.hero.descriptionZh:contact.hero.descriptionEn}/>

    <main>
      <section id="addresses" className="section-pad scroll-mt-28 bg-white">
        <div className="container-shell">
          <SectionHeading eyebrow={zh?'办公及工厂详细地址':'Office & Factory Addresses'} title={zh?'石家庄总部、新疆喀什厂区、宁夏生产基地':'Shijiazhuang headquarters, Kashgar factory, and Ningxia production base'} description={zh?'以下地址已按名片信息整理，可直接用于到访、地图和业务联系。':'The addresses below are extracted from the card and ready for visit, map, and business use.'}/>
          <div className="mt-10 grid gap-5 md:grid-cols-3">
            {contact.addresses.map(site=><article key={site.titleZh} className="border border-line bg-canvas p-6">
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
              {contact.channels.filter(item=>!['服务时间','办公地址','工厂位置'].includes(item.titleZh)).map(item => {
                const icon = item.titleZh === '联系人' ? Send : item.titleZh === '企业邮箱' ? Mail : item.titleZh.startsWith('FaceTime') ? Video : item.titleZh === 'WeChat / WhatsApp' ? MessageCircle : Phone;
                return <ContactCard key={item.titleZh} icon={icon} label={zh?item.titleZh:item.titleEn} value={item.value} href={item.href}/>;
              })}
            </div>
            <div className="grid gap-3">
              <ContactCard icon={Clock} label={zh?'服务时间':'Business Hours'} value={zh?site.company.businessHours:site.company.businessHoursEn}/>
              <ContactCard icon={MapPin} label={zh?'办公地址':'Office Address'} value={site.company.headOfficeAddress}/>
              <ContactCard icon={Warehouse} label={zh?'工厂位置':'Factory Locations'} value={zh?site.company.location:site.company.locationEn}/>
            </div>
          </div>
        </div>
      </section>

      <section id="inquiry" className="section-pad scroll-mt-28 bg-white">
        <div className="container-shell">
          <header className="grid gap-6 lg:grid-cols-[minmax(0,1.25fr)_minmax(18rem,.75fr)] lg:items-end">
            <div>
              <p className="text-xs font-bold uppercase tracking-[.22em] text-accent">{zh?contact.inquiry.eyebrowZh:contact.inquiry.eyebrowEn}</p>
              <h2 className="mt-4 max-w-4xl text-4xl font-bold leading-[1.08] tracking-[-.035em] text-ink md:text-5xl">{zh?contact.inquiry.titleZh:contact.inquiry.titleEn}</h2>
            </div>
            <p className="max-w-xl text-base leading-8 text-muted">{zh?contact.inquiry.descriptionZh:contact.inquiry.descriptionEn}</p>
          </header>
          <div className="mt-10 lg:mt-12"><InquiryComposer/></div>
        </div>
      </section>
    </main>
  </>;
}
