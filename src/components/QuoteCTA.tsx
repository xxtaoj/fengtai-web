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
      <div className="flex flex-wrap gap-3">
        <PrimaryButton to="/contact#inquiry" className="rounded-md">{zh?'发送面料询盘':'Send Fabric Inquiry'}</PrimaryButton>
        <SecondaryButton to="/products">{zh?'查看产品':'View Products'}</SecondaryButton>
      </div>
    </div>
  </section>;
}
