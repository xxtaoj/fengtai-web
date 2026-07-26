import { ArrowRight, ArrowUpRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import type { Product } from '../types/product';
import { useLanguage } from '../i18n/useLanguage';
import { LocalImage } from './Media';

export function ProductCard({product,variant='default'}:{product:Product;variant?:'default'|'catalog'}){
  const {language,t}=useLanguage();
  const zh=language==='zh';
  const detailUrl=`/products/${product.slug}`;

  if(variant==='catalog')return <article className="group border-t border-slate-300 pt-4">
    <Link to={detailUrl} className="relative block aspect-[4/3] overflow-hidden bg-canvas">
      <LocalImage src={product.image} alt={zh?`${product.nameZh}产品图片`:`${product.nameEn} product image`} className="size-full object-cover transition duration-500 ease-out group-hover:scale-[1.018]"/>
      <span className="absolute bottom-0 left-0 bg-white px-3 py-2 font-mono text-[10px] font-bold uppercase tracking-[.14em] text-ink">P-{String(product.id).padStart(2,'0')}</span>
    </Link>
    <div className="pt-5">
      <p className="text-[11px] font-bold uppercase tracking-[.14em] text-accent">{zh?product.categoryZh:product.categoryEn}</p>
      <h3 className="mt-2 text-2xl font-bold leading-tight tracking-tight text-ink">
        <Link to={detailUrl} className="transition-colors hover:text-accent">{zh?product.nameZh:product.nameEn}</Link>
      </h3>
      <p className="mt-3 text-sm leading-7 text-muted">{zh?product.summaryZh:product.summaryEn}</p>
      <p className="mt-4 text-xs leading-6 text-body">{(zh?product.specsZh:product.specsEn).slice(0,2).join(' / ')}</p>
      <div className="mt-5 flex items-center justify-between gap-4 border-t border-slate-200 pt-4 text-sm font-bold">
        <Link to={detailUrl} className="inline-flex min-h-11 items-center gap-2 text-ink transition-colors hover:text-accent">{zh?'查看规格':'View specifications'}<ArrowRight size={15}/></Link>
        <Link to={`/contact?intent=product&product=${encodeURIComponent(zh?product.nameZh:product.nameEn)}&productId=${product.id}#inquiry`} className="inline-flex min-h-11 items-center gap-1 text-accent hover:text-accent-hover">{zh?'询问此面料':'Inquire'}<ArrowUpRight size={15}/></Link>
      </div>
    </div>
  </article>;

  return <article className="group overflow-hidden border border-line bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-lift">
    <Link to={detailUrl} className="block aspect-[4/3] overflow-hidden"><LocalImage src={product.image} alt={zh?`${product.nameZh}产品图片`:`${product.nameEn} product image`} className="size-full object-cover transition duration-500 group-hover:scale-105"/></Link>
    <div className="p-6">
      <p className="text-xs font-bold uppercase tracking-wider text-accent">{zh?product.categoryZh:product.categoryEn}</p>
      <h3 className="mt-3 text-xl font-bold text-ink">{zh?product.nameZh:product.nameEn}</h3>
      <p className="mt-2 text-sm leading-6 text-muted">{zh?product.summaryZh:product.summaryEn}</p>
      <div className="mt-5 flex items-center justify-between border-t border-line pt-4 text-sm font-semibold">
        <Link to={detailUrl} className="flex items-center gap-1 text-ink hover:text-accent">{t.common.viewDetails}<ArrowUpRight size={16}/></Link>
        <Link to="/contact#inquiry" className="text-accent">{t.common.quote}</Link>
      </div>
    </div>
  </article>;
}
