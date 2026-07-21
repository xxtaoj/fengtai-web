import { Link } from 'react-router-dom';
import { ArrowUpRight, Factory, Mail, MapPin, Phone } from 'lucide-react';
import { company } from '../data/company';
import { navigation } from '../data/navigation';
import { useCatalog } from '../context/CatalogContext';
import { useLanguage } from '../i18n/useLanguage';
import { PrimaryButton, SecondaryButton } from './Button';

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
    <div className="container-shell grid gap-10 py-16 md:grid-cols-2 lg:grid-cols-4">
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
          <span>WhatsApp: {company.whatsapp}</span>
          <span>WeChat: {company.wechat}</span>
          <span className="flex gap-2"><Mail size={17}/>{company.email}</span>
          <span>{zh?'服务时间':'Business Hours'}: {zh?company.businessHours:company.businessHoursEn}</span>
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
