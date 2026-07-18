import { Clock, Mail, MapPin, MessageCircle, Phone, Plane, TrainFront, type LucideIcon } from 'lucide-react';
import { company } from '../data/company';
import { useLanguage } from '../i18n/useLanguage';
import { ContactForm } from '../forms/ContactForm';
import { PageHero } from '../components/PageHero';
import { SectionHeading } from '../components/SectionHeading';
import { ContactCard } from '../components/ContactCard';
import { Seo } from '../components/Seo';

export function ContactPage(){
  const {language,t}=useLanguage();
  const zh=language==='zh';
  const visitDetails:Array<[LucideIcon,string,string]> = [
    [MapPin,zh?'工厂地址':'Factory Address',company.address],
    [Plane,zh?'附近机场':'Nearby Airport','[待补充 / To be provided]'],
    [TrainFront,zh?'附近火车站':'Nearby Railway Station','[待补充 / To be provided]'],
    [Clock,zh?'参观时间':'Visit Hours','[待补充 / To be provided]'],
    [MessageCircle,zh?'预约要求':'Appointment','[请提前预约 / Appointment required]'],
    [Phone,zh?'联系人':'Contact Person',company.contactPerson],
  ];
  return <>
    <Seo title={{zh:'联系我们',en:'Contact Us'}} description={{zh:'联系工厂获取报价、下单、合作或预约参观。',en:'Contact the factory for quotes, orders, cooperation, or a factory visit.'}}/>
    <PageHero image="/images/contact-banner.jpg" eyebrow={zh?'业务联系':'Business Contact'} title={t.pages.contact} description={zh?'欢迎就产品报价、订单合作、国内外业务与工厂参观联系我们。':'Contact us about quotations, orders, export or domestic cooperation, and factory visits.'}/>
    <section className="section-pad bg-white"><div className="container-shell grid gap-12 lg:grid-cols-[.85fr_1.15fr]">
      <div><SectionHeading eyebrow={zh?'联系信息':'Contact Information'} title={zh?'找到合适的联系渠道':'Choose the right way to reach us'}/><div className="mt-8 grid gap-3">
        <ContactCard icon={Phone} label={zh?'联系电话':'Phone'} value={company.phone} href={`tel:${company.phone}`}/>
        <ContactCard icon={Mail} label={zh?'联系邮箱':'Email'} value={company.email} href={`mailto:${company.email}`}/>
        <ContactCard icon={MessageCircle} label="WhatsApp / WeChat" value={`${company.whatsapp} / ${company.wechat}`}/>
        <ContactCard icon={MapPin} label={zh?'工厂地址':'Factory Address'} value={company.address}/>
        <ContactCard icon={Clock} label={zh?'营业时间':'Business Hours'} value={company.businessHours}/>
      </div></div><ContactForm/>
    </div></section>
    <section className="section-pad"><div className="container-shell"><SectionHeading eyebrow={zh?'工厂位置':'Factory Location'} title={zh?'地图位置待准确地址确认':'Map pending verified location'} description={zh?'为避免展示错误位置，此处不嵌入地图。确认地址后可接入百度地图、高德地图、Google Maps 或 iframe。':'No map is embedded until the address is verified. Add Baidu Map, Amap, Google Maps, or an iframe afterward.'}/><div className="industrial-grid mt-10 grid min-h-96 place-items-center bg-ink p-8 text-center text-white"><div><MapPin className="mx-auto text-amber-400" size={42}/><h3 className="mt-5 text-xl font-bold">{company.address}</h3><p className="mt-2 text-sm text-slate-400">{/* Insert verified map embed code here. */}{zh?'地图组件占位':'Map integration placeholder'}</p></div></div></div></section>
    <section className="section-pad bg-white"><div className="container-shell grid gap-12 lg:grid-cols-2"><SectionHeading eyebrow={zh?'预约参观':'Factory Visit'} title={zh?'到访前请提前预约':'Please make an appointment before visiting'} description={zh?'确认到访人数、时间与参观目的后，我们将安排对接。':'After confirming the group size, time, and purpose, the team can coordinate your visit.'}/><dl className="grid gap-4 sm:grid-cols-2">{visitDetails.map(([Icon,label,value])=><div key={label} className="border-t border-line pt-4"><Icon className="text-accent" size={20}/><dt className="mt-3 text-xs font-semibold uppercase text-muted">{label}</dt><dd className="mt-1 font-semibold text-ink">{value}</dd></div>)}</dl></div></section>
  </>;
}
