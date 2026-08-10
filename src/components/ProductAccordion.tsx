import { ArrowUpRight, ChevronDown } from 'lucide-react';
import { Link } from 'react-router-dom';
import type { Product } from '../types/product';
import { useLanguage } from '../i18n/useLanguage';

export function ProductAccordion({ product, open, onToggle }: { product: Product; open: boolean; onToggle: () => void }) {
  const { language } = useLanguage();
  const zh = language === 'zh';
  const detailUrl = `/products/${product.slug}`;

  return <article className="border-b border-slate-300">
    <button type="button" onClick={onToggle} aria-expanded={open} className="grid w-full gap-4 py-5 text-left transition-colors hover:text-accent sm:grid-cols-[4.5rem_1fr_auto] sm:items-center">
      <span className="font-mono text-xs font-bold uppercase tracking-[.16em] text-accent">P-{String(product.id).padStart(2, '0')}</span>
      <span>
        <span className="block text-xl font-bold tracking-tight text-ink">{zh ? product.nameZh : product.nameEn}</span>
        <span className="mt-1 block text-xs font-bold uppercase tracking-[.12em] text-muted">{zh ? product.categoryZh : product.categoryEn}</span>
      </span>
      <ChevronDown className={`transition-transform ${open ? 'rotate-180' : ''}`} size={18}/>
    </button>

    {open && <div className="pb-7 sm:pl-[4.5rem]">
      <p className="max-w-2xl text-sm leading-7 text-muted">{zh ? product.summaryZh : product.summaryEn}</p>

      <div className="mt-6 flex flex-wrap gap-4 text-sm font-bold">
        <Link to={detailUrl} className="inline-flex min-h-11 items-center gap-2 border-b border-ink text-ink transition-colors hover:border-accent hover:text-accent">{zh ? '查看产品详情' : 'View product details'}<ArrowUpRight size={16}/></Link>
        <Link to={`/contact?intent=product&product=${encodeURIComponent(zh ? product.nameZh : product.nameEn)}&productId=${product.id}#inquiry`} className="inline-flex min-h-11 items-center gap-2 text-accent hover:text-accent-hover">{zh ? '询问此面料' : 'Inquire'}<ArrowUpRight size={16}/></Link>
      </div>
    </div>}
  </article>;
}
