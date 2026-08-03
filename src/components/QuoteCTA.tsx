import { ArrowUpRight } from 'lucide-react';
import { useLanguage } from '../i18n/useLanguage';
import { PrimaryButton, SecondaryButton } from './Button';

export function QuoteCTA(){
  const {language}=useLanguage();
  const zh=language==='zh';
  return <section className="bg-accent-soft py-16">
    <div className="container-shell flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
      <div>
        <h2 className="text-3xl font-bold text-ink">{zh?'告诉我们需要什么面料':'Tell us what fabric you need'}</h2>
        <p className="mt-3 max-w-2xl leading-7 text-muted">{zh?'发送面料类别、成分、幅宽、密度或克重、数量和用途，我们将根据现货与生产情况协助确认。':'Share the fabric type, composition, width, construction or weight, quantity, and end use. We will check available stock and production options.'}</p>
      </div>
      <div className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row sm:gap-3">
        <PrimaryButton to="/contact#inquiry" className="group min-h-12 w-full rounded-full !px-2 shadow-[0_10px_24px_-16px_rgba(180,83,9,.9)] hover:-translate-y-0.5 sm:w-auto">
          <span className="pl-4">{zh?'发送面料询盘':'Send Fabric Inquiry'}</span>
          <span className="ml-1 grid size-8 place-items-center rounded-full bg-white/15 transition-transform duration-300 group-hover:rotate-6" aria-hidden="true"><ArrowUpRight size={16}/></span>
        </PrimaryButton>
        <SecondaryButton to="/products" className="min-h-12 w-full rounded-full !border-slate-200 !bg-white px-6 shadow-[0_10px_24px_-20px_rgba(17,24,39,.55)] hover:!border-slate-300 hover:!bg-slate-50 hover:!text-ink sm:w-auto">{zh?'查看产品':'View Products'}</SecondaryButton>
      </div>
    </div>
  </section>;
}
