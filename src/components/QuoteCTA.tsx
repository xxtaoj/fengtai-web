import { ArrowUpRight } from 'lucide-react';
import { useLanguage } from '../i18n/useLanguage';
import { PrimaryButton, SecondaryButton } from './Button';
import { TextileImageRibbon } from './TextileImageRibbon';

export function QuoteCTA(){
  const {language}=useLanguage();
  const zh=language==='zh';
  const ribbonImages = [
    {src:'/images/products/product-01.jpg',alt:zh?'床品面料与家纺应用':'Bedding fabrics and home textile applications',position:'72% 68%'},
    {src:'/images/products/product-03.jpg',alt:zh?'轻薄服装面料':'Lightweight apparel fabric',position:'62% 50%'},
    {src:'/images/products/product-05.jpg',alt:zh?'现货面料与服装应用':'Stock fabrics and apparel applications',position:'52% 50%'},
  ];
  return <section className="overflow-hidden border-y border-slate-200 bg-[#EEF2F7]">
    <div className="container-shell grid lg:min-h-[25rem] lg:grid-cols-[.84fr_1.16fr]">
      <div className="relative z-20 flex flex-col justify-center py-14 pr-0 lg:py-16 lg:pr-12">
        <p className="text-xs font-bold uppercase tracking-[.18em] text-accent">{zh?'面料询盘':'Fabric inquiry'}</p>
        <h2 className="mt-4 max-w-xl text-3xl font-bold leading-tight tracking-[-.025em] text-ink sm:text-4xl">{zh?'告诉我们需要什么面料':'Tell us what fabric you need'}</h2>
        <p className="mt-4 max-w-2xl leading-7 text-muted">{zh?'发送面料类别、成分、幅宽、密度或克重、数量和用途，我们将根据现货与生产情况协助确认。':'Share the fabric type, composition, width, construction or weight, quantity, and end use. We will check available stock and production options.'}</p>
        <div className="mt-7 flex w-full flex-col gap-2 sm:w-auto sm:flex-row sm:gap-3">
          <PrimaryButton to="/contact#inquiry" className="group min-h-12 w-full rounded-full !px-2 shadow-[0_10px_24px_-16px_rgba(180,83,9,.9)] hover:-translate-y-0.5 sm:w-auto">
            <span className="pl-4">{zh?'发送面料询盘':'Send Fabric Inquiry'}</span>
            <span className="ml-1 grid size-8 place-items-center rounded-full bg-white/15 transition-transform duration-300 group-hover:rotate-6" aria-hidden="true"><ArrowUpRight size={16}/></span>
          </PrimaryButton>
          <SecondaryButton to="/products" className="min-h-12 w-full rounded-full !border-slate-300 !bg-transparent px-6 hover:!border-ink hover:!bg-white hover:!text-ink sm:w-auto">{zh?'查看产品':'View Products'}</SecondaryButton>
        </div>
      </div>
      <TextileImageRibbon images={ribbonImages} variant="layered" className="-mx-4 min-h-64 sm:mx-0 lg:-mr-[max(1rem,calc((100vw-80rem)/2))] lg:min-h-full"/>
    </div>
  </section>;
}
