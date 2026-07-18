import { useLanguage } from '../i18n/useLanguage';
import { PrimaryButton, SecondaryButton } from './Button';

export function QuoteCTA(){
  const {language}=useLanguage();
  const zh=language==='zh';
  return <section className="bg-accent-soft py-16">
    <div className="container-shell flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
      <div>
        <h2 className="text-3xl font-bold text-ink">{zh?'需要现货面料或来样定织？':'Need stock fabric or custom weaving?'}</h2>
        <p className="mt-3 max-w-2xl leading-7 text-muted">{zh?'提交面料类别、规格、数量、用途和样品需求，我们将协助匹配现货或评估定织可行性。':'Send fabric category, specs, quantity, application, and sample needs. We will help match stock or evaluate custom weaving feasibility.'}</p>
      </div>
      <div className="flex flex-wrap gap-3">
        <PrimaryButton to="/contact#inquiry">{zh?'发送询盘':'Send Inquiry'}</PrimaryButton>
        <SecondaryButton to="/products">{zh?'查看产品':'View Products'}</SecondaryButton>
      </div>
    </div>
  </section>;
}
