import { Link } from 'react-router-dom';
import { ArrowUpRight, Factory, Mail, MapPin, Phone } from 'lucide-react';
import { company } from '../data/company';
import { navigation } from '../data/navigation';
import { useCatalog } from '../context/CatalogContext';
import { useLanguage } from '../i18n/useLanguage';
import { PrimaryButton, SecondaryButton } from './Button';

function WhatsAppIcon(){
  return <svg aria-hidden="true" viewBox="0 0 32 32" className="h-full w-full fill-current">
    <path d="M16.02 3.2A12.73 12.73 0 0 0 5.1 22.48L3.2 29.4l7.08-1.86a12.74 12.74 0 1 0 5.74-24.34Zm0 23.16c-1.9 0-3.76-.52-5.38-1.5l-.4-.24-4.2 1.1 1.12-4.1-.27-.42a10.42 10.42 0 1 1 9.13 5.16Zm5.72-7.8c-.31-.16-1.85-.91-2.14-1.02-.29-.1-.5-.16-.71.16-.21.31-.81 1.02-1 1.23-.18.2-.36.23-.67.08-.31-.16-1.32-.49-2.51-1.55a9.43 9.43 0 0 1-1.74-2.16c-.18-.31-.02-.48.14-.64.14-.14.31-.36.47-.55.16-.18.21-.31.31-.52.11-.21.05-.39-.02-.55-.08-.16-.71-1.72-.98-2.35-.26-.62-.52-.54-.71-.55h-.61c-.21 0-.55.08-.84.39-.29.31-1.11 1.09-1.11 2.66s1.14 3.08 1.3 3.29c.16.21 2.24 3.42 5.43 4.8.76.33 1.35.52 1.81.67.76.24 1.45.21 2 .13.61-.09 1.85-.76 2.11-1.49.26-.73.26-1.36.18-1.49-.08-.13-.29-.21-.6-.36Z"/>
  </svg>;
}

function FacebookIcon(){
  return <svg aria-hidden="true" viewBox="0 0 32 32" className="h-full w-full fill-current">
    <path d="M29 16.08C29 8.85 23.18 3 16 3S3 8.85 3 16.08c0 6.53 4.75 11.94 10.97 12.92v-9.14h-3.3v-3.78h3.3V13.2c0-3.28 1.94-5.09 4.91-5.09 1.42 0 2.91.26 2.91.26v3.22h-1.64c-1.61 0-2.12 1.01-2.12 2.04v2.45h3.61l-.58 3.78h-3.03V29C24.25 28.02 29 22.61 29 16.08Z"/>
  </svg>;
}

function LinkedInIcon(){
  return <svg aria-hidden="true" viewBox="0 0 32 32" className="h-full w-full fill-current">
    <path d="M7.19 4.5A2.7 2.7 0 1 1 7.2 9.9a2.7 2.7 0 0 1-.01-5.4ZM4.86 11.93h4.65V27.5H4.86V11.93Zm7.54 0h4.46v2.13h.06c.62-1.18 2.14-2.42 4.4-2.42 4.71 0 5.58 3.12 5.58 7.17v8.69h-4.64v-7.71c0-1.84-.03-4.2-2.55-4.2-2.56 0-2.95 2-2.95 4.07v7.84H12.4V11.93Z"/>
  </svg>;
}

const socialChannels = [
  {label:'WhatsApp',href:company.socialLinks.whatsapp,Icon:WhatsAppIcon},
  {label:'Facebook',href:company.socialLinks.facebook,Icon:FacebookIcon},
  {label:'LinkedIn',href:company.socialLinks.linkedin,Icon:LinkedInIcon},
];

export function Footer(){
  const {language,t}=useLanguage();
  const {catalog}=useCatalog();
  const {products}=catalog;
  const zh=language==='zh';
  return <footer className="bg-ink text-white">
    <section className="border-b border-white/10">
      <div className="container-shell grid gap-8 py-14 lg:grid-cols-[1fr_auto] lg:items-center">
        <div>
          <p className="mb-3 text-xs font-bold uppercase tracking-[.22em] text-amber-400">{zh?'询盘与寄样':'Inquiry and Samples'}</p>
          <h2 className="max-w-3xl text-2xl font-semibold leading-tight md:text-4xl">{zh?'告诉我们面料类别、规格、数量和用途，业务团队将协助匹配现货或评估来样定织。':'Send fabric category, specs, quantity, and application. The sales team will match stock or evaluate custom weaving.'}</h2>
        </div>
        <div className="flex flex-wrap gap-3">
          <PrimaryButton to="/contact#inquiry">{t.common.quote}<ArrowUpRight size={17}/></PrimaryButton>
          <SecondaryButton to="/products">{zh?'查看产品':'View Products'}</SecondaryButton>
        </div>
      </div>
    </section>
    <div className="container-shell grid gap-10 py-16 md:grid-cols-2 lg:grid-cols-[1fr_.75fr_.9fr_1.55fr]">
      <div>
        <h3 className="text-xl font-bold">{company.brandName}</h3>
        <p className="mt-4 text-sm leading-7 text-slate-400">{zh?'源头织布工厂，面向海内外外贸采购商，主营床品面料、服装面料，并支持混纺、交织等来样定织。':'A source weaving factory for domestic and overseas buyers, focused on bedding and apparel fabrics with blended and interwoven custom weaving support.'}</p>
        <p className="mt-4 text-sm text-slate-400">{company.chineseName}<br/>{company.englishName}</p>
      </div>
      <div>
        <h3 className="font-semibold">{zh?'网站导航':'Navigation'}</h3>
        <div className="mt-4 grid gap-3 text-sm text-slate-400">{navigation.map(n=><Link key={n.to} to={n.to} className="hover:text-white">{zh?n.zh:n.en}</Link>)}</div>
      </div>
      <div>
        <h3 className="font-semibold">{zh?'主营产品':'Main Products'}</h3>
        <div className="mt-4 grid gap-3 text-sm text-slate-400">{products.slice(0,4).map(p=><Link key={p.id} to={`/products/${p.slug}`} className="hover:text-white">{zh?p.nameZh:p.nameEn}</Link>)}</div>
      </div>
      <div>
        <h3 className="font-semibold">{zh?'联系工厂':'Contact Factory'}</h3>
        <div className="mt-4 grid gap-3 text-sm text-slate-400">
          <span className="flex gap-2"><MapPin className="shrink-0" size={17}/>{company.headOfficeAddress}</span>
          <span className="flex gap-2"><Factory className="shrink-0" size={17}/>{zh?company.location:company.locationEn}</span>
          <span className="flex gap-2"><span className="shrink-0">•</span>{company.contactPerson} · {company.contactTitle}</span>
          <span className="flex gap-2"><Phone size={17}/>{company.phone}</span>
          <span>WeChat: {company.wechat}</span>
          <span className="flex gap-2"><Mail size={17}/>{company.email}</span>
          <span>{zh?'服务时间':'Business Hours'}: {zh?company.businessHours:company.businessHoursEn}</span>
        </div>
        <div aria-label={zh?'社交媒体联系方式':'Social media contacts'} className="mt-6 flex w-full max-w-72 flex-col items-start gap-3">
          <Link
            to="/contact"
            className="inline-flex min-h-11 w-full items-center justify-center rounded-full bg-[#0B4AA2] px-5 text-sm font-bold tracking-[.08em] text-white shadow-[0_12px_28px_-18px_rgba(11,74,162,.95)] transition duration-300 hover:-translate-y-0.5 hover:bg-[#0D56BA] active:translate-y-0"
          >
            {t.common.contact}
          </Link>
          <div className="flex w-full items-center justify-between">
            {socialChannels.map(({label,href,Icon})=><a
              key={label}
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={zh?`在新窗口打开 ${label}`:`Open ${label} in a new tab`}
              title={label}
              className="flex h-12 w-12 items-center justify-center rounded-full p-2.5 text-white transition duration-300 hover:-translate-y-0.5 hover:bg-white/10 hover:text-[#7DB2F2] active:translate-y-0"
            ><Icon/></a>)}
          </div>
        </div>
      </div>
    </div>
    <div className="border-t border-white/10">
      <div className="container-shell flex flex-col gap-3 py-6 text-xs text-slate-500 md:flex-row md:justify-between">
        <span>© {new Date().getFullYear()} {company.englishName}. {zh?'版权所有。':'All rights reserved.'}</span>
        <span>{zh?'隐私政策 · 使用条款':'Privacy Policy · Terms of Use'}</span>
      </div>
    </div>
  </footer>;
}
