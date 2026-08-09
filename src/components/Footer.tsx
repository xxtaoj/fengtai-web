import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ArrowUpRight, Clock3, Factory, Mail, MapPin, MessageCircle, Phone, Video } from 'lucide-react';
import { company } from '../data/company';
import { navigation } from '../data/navigation';
import { useCatalog } from '../context/CatalogContext';
import { useLanguage } from '../i18n/useLanguage';
import { PrimaryButton, SecondaryButton } from './Button';
import { ImageModal } from './ImageModal';
import { TextileImageRibbon } from './TextileImageRibbon';

function WhatsAppIcon(){
  return <svg aria-hidden="true" viewBox="0 0 32 32" className="h-8 w-8 fill-current">
    <path d="M16.02 3.2A12.73 12.73 0 0 0 5.1 22.48L3.2 29.4l7.08-1.86a12.74 12.74 0 1 0 5.74-24.34Zm0 23.16c-1.9 0-3.76-.52-5.38-1.5l-.4-.24-4.2 1.1 1.12-4.1-.27-.42a10.42 10.42 0 1 1 9.13 5.16Zm5.72-7.8c-.31-.16-1.85-.91-2.14-1.02-.29-.1-.5-.16-.71.16-.21.31-.81 1.02-1 1.23-.18.2-.36.23-.67.08-.31-.16-1.32-.49-2.51-1.55a9.43 9.43 0 0 1-1.74-2.16c-.18-.31-.02-.48.14-.64.14-.14.31-.36.47-.55.16-.18.21-.31.31-.52.11-.21.05-.39-.02-.55-.08-.16-.71-1.72-.98-2.35-.26-.62-.52-.54-.71-.55h-.61c-.21 0-.55.08-.84.39-.29.31-1.11 1.09-1.11 2.66s1.14 3.08 1.3 3.29c.16.21 2.24 3.42 5.43 4.8.76.33 1.35.52 1.81.67.76.24 1.45.21 2 .13.61-.09 1.85-.76 2.11-1.49.26-.73.26-1.36.18-1.49-.08-.13-.29-.21-.6-.36Z"/>
  </svg>;
}

function FacebookIcon(){
  return <svg aria-hidden="true" viewBox="0 0 32 32" className="h-8 w-8 fill-current">
    <path d="M29 16.08C29 8.85 23.18 3 16 3S3 8.85 3 16.08c0 6.53 4.75 11.94 10.97 12.92v-9.14h-3.3v-3.78h3.3V13.2c0-3.28 1.94-5.09 4.91-5.09 1.42 0 2.91.26 2.91.26v3.22h-1.64c-1.61 0-2.12 1.01-2.12 2.04v2.45h3.61l-.58 3.78h-3.03V29C24.25 28.02 29 22.61 29 16.08Z"/>
  </svg>;
}

function LinkedInIcon(){
  return <svg aria-hidden="true" viewBox="0 0 32 32" className="h-8 w-8 fill-current">
    <path d="M7.19 4.5A2.7 2.7 0 1 1 7.2 9.9a2.7 2.7 0 0 1-.01-5.4ZM4.86 11.93h4.65V27.5H4.86V11.93Zm7.54 0h4.46v2.13h.06c.62-1.18 2.14-2.42 4.4-2.42 4.71 0 5.58 3.12 5.58 7.17v8.69h-4.64v-7.71c0-1.84-.03-4.2-2.55-4.2-2.56 0-2.95 2-2.95 4.07v7.84H12.4V11.93Z"/>
  </svg>;
}

function XiaohongshuIcon(){
  return <img aria-hidden="true" src="/images/social/xiaohongshu-icon.png" alt="" className="h-10 w-10 shrink-0 object-contain" draggable={false}/>;
}

function WeChatIcon(){
  return <img aria-hidden="true" src="/images/social/wechat-icon.png" alt="" className="h-10 w-10 shrink-0 object-contain" draggable={false}/>;
}

const socialChannels = [
  {label:'WhatsApp',href:company.socialLinks.whatsapp,Icon:WhatsAppIcon},
  {label:'Facebook',href:company.socialLinks.facebook,Icon:FacebookIcon},
  {label:'LinkedIn',href:company.socialLinks.linkedin,Icon:LinkedInIcon},
  {label:'小红书',href:company.socialLinks.xiaohongshu,Icon:XiaohongshuIcon},
  {label:'微信公众号',qr:company.socialLinks.wechatQr,Icon:WeChatIcon},
];

export function Footer(){
  const [wechatOpen,setWechatOpen]=useState(false);
  const {language,t}=useLanguage();
  const {pathname}=useLocation();
  const {catalog}=useCatalog();
  const {products}=catalog;
  const zh=language==='zh';
  const showInquiryPrompt=pathname!=='/products';
  const inquiryImages = [
    {src:'/images/hero-poster.jpg',alt:zh?'纺织工厂纱线生产现场':'Yarn production inside the textile factory',position:'48% 50%'},
    {src:'/images/factory-exterior.jpg',alt:zh?'丰泰永晟工厂与出货车辆':'Fengtai Yongsheng factory and outbound truck',position:'68% 48%'},
    {src:'/images/products/product-03.jpg',alt:zh?'服装面料应用与规格':'Apparel fabric application and specification',position:'62% 50%'},
  ];
  return <footer className="bg-ink text-white">
    {showInquiryPrompt&&<section className="overflow-hidden border-b border-white/10">
      <div className="container-shell grid lg:min-h-[22rem] lg:grid-cols-[1.08fr_.92fr]">
        <div className="relative z-20 flex flex-col justify-center py-12 pr-0 lg:py-14 lg:pr-12">
          <p className="mb-3 text-xs font-bold uppercase tracking-[.22em] text-amber-400">{zh?'询盘与寄样':'Inquiry and Samples'}</p>
          <h2 className="max-w-3xl text-2xl font-semibold leading-tight md:text-3xl">{zh?'有规格表、产品图片或实物样，直接发给业务团队。':'Send your specification sheet, product image, or physical sample directly to our sales team.'}</h2>
          <p className="mt-3 text-sm leading-6 text-slate-400">{zh?'我们会按现货或来样定织方向回复。':'We will reply with a stock or sample-based custom-weaving route.'}</p>
          <div className="mt-7 flex w-full flex-col gap-2 sm:w-auto sm:flex-row sm:gap-3">
            <PrimaryButton to="/contact#inquiry" className="group min-h-12 w-full rounded-full !px-2 shadow-[0_12px_28px_-18px_rgba(217,119,6,.9)] hover:-translate-y-0.5 sm:w-auto">
              <span className="pl-4">{t.common.quote}</span>
              <span className="ml-1 grid size-8 place-items-center rounded-full bg-white/15 transition-transform duration-300 group-hover:rotate-6" aria-hidden="true"><ArrowUpRight size={16}/></span>
            </PrimaryButton>
            <SecondaryButton to="/products" className="min-h-12 w-full rounded-full !border-transparent !bg-white !px-6 !text-ink hover:!border-transparent hover:!bg-slate-100 hover:!text-ink sm:w-auto">{zh?'查看产品':'View Products'}</SecondaryButton>
          </div>
        </div>
        <TextileImageRibbon images={inquiryImages} dark className="-mx-4 min-h-64 sm:mx-0 lg:-mr-[max(1rem,calc((100vw-80rem)/2))] lg:min-h-full"/>
      </div>
    </section>}
    <div className="container-shell py-14 md:py-16">
      <div className="grid gap-12 border-b border-white/10 pb-12 lg:grid-cols-[.72fr_1.28fr] lg:gap-16 lg:pb-14">
        <section>
          <p className="text-[11px] font-bold uppercase tracking-[.18em] text-amber-400">{zh?'源头织布工厂':'Source weaving factory'}</p>
          <h3 className="mt-5 text-4xl font-bold tracking-[-.035em]">{company.brandName}</h3>
          <p className="mt-5 max-w-md text-sm leading-7 text-slate-300">{zh?'主营床品和服装面料，也承接混纺、交织等来样定织。采购商可直接发送产品名称、规格或实物样信息。':'Bedding and apparel fabrics, plus sample-based custom weaving for blended and interwoven constructions. Buyers can send a product name, specification, or physical sample.'}</p>
          <p className="mt-7 text-xs leading-6 text-slate-500">{company.chineseName}<br/><span className="tracking-[.08em]">{company.englishName}</span></p>
        </section>

        <section aria-labelledby="footer-sales-heading">
          <div className="flex items-end justify-between gap-5 border-b border-white/15 pb-4">
            <h3 id="footer-sales-heading" className="text-sm font-bold tracking-[.08em]">{zh?'联系业务团队':'Contact the sales team'}</h3>
            <Link to="/contact#inquiry" className="inline-flex min-h-9 items-center gap-1 border-b border-amber-400 text-xs font-bold text-amber-400 transition-colors hover:border-white hover:text-white">{zh?'发送询盘':'Send inquiry'}<ArrowUpRight size={14}/></Link>
          </div>

          <div className="grid sm:grid-cols-2">
            <article className="border-b border-white/10 py-6 sm:border-r sm:pr-8">
              <p className="text-[10px] font-bold uppercase tracking-[.16em] text-slate-500">{company.contactTitle}</p>
              <h4 className="mt-2 text-xl font-semibold">{company.contactPerson}</h4>
              <div className="mt-4 grid gap-3 text-sm text-slate-300">
                <a href={`tel:${company.phone.replace(/[^\d+]/g,'')}`} className="flex min-h-7 items-center gap-3 transition-colors hover:text-white"><Phone className="shrink-0 text-amber-400" size={16}/><span>{company.phone}</span></a>
                <p className="flex min-h-7 items-center gap-3"><MessageCircle className="shrink-0 text-amber-400" size={16}/><span>WeChat: {company.wechat}</span></p>
                <a href={`mailto:${company.email}`} className="flex min-h-7 items-center gap-3 break-all transition-colors hover:text-white"><Mail className="shrink-0 text-amber-400" size={16}/><span>{company.email}</span></a>
              </div>
            </article>

            <article className="border-b border-white/10 py-6 sm:pl-8">
              <p className="text-[10px] font-bold uppercase tracking-[.16em] text-slate-500">{zh?'业务联系':'Business contact'}</p>
              <h4 className="mt-2 text-xl font-semibold">{company.wendyContact}</h4>
              <div className="mt-4 grid gap-3 text-sm text-slate-300">
                <a href={`tel:${company.wendyPhone.replace(/[^\d+]/g,'')}`} className="flex min-h-7 items-center gap-3 transition-colors hover:text-white"><Phone className="shrink-0 text-amber-400" size={16}/><span>{company.wendyPhone}</span></a>
                <a href={`facetime:${company.facetimePhone.replace(/\s/g,'')}`} className="flex min-h-7 items-center gap-3 transition-colors hover:text-white"><Video className="shrink-0 text-amber-400" size={16}/><span>FaceTime {zh?'（美国）':'(U.S.)'}: {company.facetimePhone}</span></a>
              </div>
            </article>
          </div>

          <div className="grid gap-6 border-b border-white/10 py-6 text-sm leading-6 text-slate-300 sm:grid-cols-2 sm:gap-8">
            <p className="flex gap-3"><MapPin className="mt-0.5 shrink-0 text-amber-400" size={16}/><span><strong className="mb-1 block text-xs text-white">{zh?'石家庄总部':'Shijiazhuang office'}</strong>{company.headOfficeAddress}</span></p>
            <p className="flex gap-3"><Factory className="mt-0.5 shrink-0 text-amber-400" size={16}/><span><strong className="mb-1 block text-xs text-white">{zh?'生产基地':'Production sites'}</strong>{zh?company.location:company.locationEn}</span></p>
          </div>

          <p className="flex min-h-12 items-center gap-3 pt-4 text-sm text-slate-400"><Clock3 className="shrink-0 text-amber-400" size={16}/><span>{zh?company.businessHours:company.businessHoursEn}</span></p>
        </section>
      </div>

      <div className="grid gap-8 border-b border-white/10 py-8 lg:grid-cols-[.9fr_1.1fr_auto] lg:items-start lg:gap-10">
        <nav aria-label={zh?'页脚网站导航':'Footer navigation'}>
          <h3 className="text-[10px] font-bold uppercase tracking-[.16em] text-slate-500">{zh?'网站导航':'Navigation'}</h3>
          <div className="mt-3 flex flex-wrap gap-x-6 gap-y-1 text-sm text-slate-300">{navigation.map(n=><Link key={n.to} to={n.to} className="inline-flex min-h-9 items-center transition-colors hover:text-amber-400">{zh?n.zh:n.en}</Link>)}</div>
        </nav>

        <nav aria-label={zh?'页脚主营产品':'Footer main products'}>
          <h3 className="text-[10px] font-bold uppercase tracking-[.16em] text-slate-500">{zh?'主营产品':'Main products'}</h3>
          <div className="mt-3 flex flex-wrap gap-x-6 gap-y-1 text-sm text-slate-300">{products.slice(0,4).map(p=><Link key={p.id} to={`/products/${p.slug}`} className="inline-flex min-h-9 items-center transition-colors hover:text-amber-400">{zh?p.nameZh:p.nameEn}</Link>)}</div>
        </nav>

        <div aria-label={zh?'社交媒体联系方式':'Social media contacts'} className="flex items-center gap-1 lg:justify-end">
          {socialChannels.map(({label,href,qr,Icon})=>qr
            ? <button
                key={label}
                type="button"
                onClick={()=>setWechatOpen(true)}
                aria-label={zh?'查看微信公众号二维码':'View WeChat Official Account QR code'}
                title={label}
                className="flex h-11 w-11 shrink-0 items-center justify-center text-white transition duration-300 hover:-translate-y-0.5 hover:bg-white/10 hover:text-[#7DB2F2] active:translate-y-0"
              ><Icon/></button>
            : <a
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={zh?`在新窗口打开 ${label}`:`Open ${label} in a new tab`}
                title={label}
                className="flex h-11 w-11 shrink-0 items-center justify-center text-white transition duration-300 hover:-translate-y-0.5 hover:bg-white/10 hover:text-[#7DB2F2] active:translate-y-0"
              ><Icon/></a>)}
        </div>
      </div>

      <div className="flex flex-col gap-3 pt-6 text-xs text-slate-500 md:flex-row md:justify-between">
        <span className="flex flex-wrap gap-x-2 gap-y-1"><span>© {new Date().getFullYear()} {company.englishName}</span><span>{zh?'版权所有。':'All rights reserved.'}</span></span>
        <span>{zh?'隐私政策 · 使用条款':'Privacy Policy · Terms of Use'}</span>
      </div>
    </div>
    {wechatOpen&&<ImageModal src={company.socialLinks.wechatQr} alt={zh?'微信公众号二维码':'WeChat Official Account QR code'} onClose={()=>setWechatOpen(false)}/>}
  </footer>;
}
