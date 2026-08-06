import { ArrowDownRight, ArrowUpRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useSite } from '../context/SiteContext';
import { useLanguage } from '../i18n/useLanguage';
import type { ProductGroup } from '../types/product';

type SourcingPath = {
  id: ProductGroup;
  conditionZh: string;
  conditionEn: string;
  titleZh: string;
  titleEn: string;
  descriptionZh: string;
  descriptionEn: string;
  fitsZh: string[];
  fitsEn: string[];
};

export function SourcingDesk(){
  const {language}=useLanguage();
  const zh=language==='zh';
  const {site}=useSite();
  const copy = site.copy.products as {
    sourcingDesk: {
      eyebrowZh: string;
      eyebrowEn: string;
      titleZh: string;
      titleEn: string;
      descriptionZh: string;
      descriptionEn: string;
      paths: Array<{
        id: ProductGroup;
        conditionZh: string;
        conditionEn: string;
        titleZh: string;
        titleEn: string;
        descriptionZh: string;
        descriptionEn: string;
        fitsZh: string[];
        fitsEn: string[];
      }>;
    };
  };
  const sourcingPaths = copy.sourcingDesk.paths;

  return <section aria-labelledby="sourcing-desk-title" className="bg-white py-16 md:py-20">
    <div className="container-shell">
      <header className="grid gap-5 border-b border-slate-300 pb-8 lg:grid-cols-[.72fr_1.28fr] lg:items-end">
        <div>
          <p className="font-mono text-xs font-bold uppercase tracking-[.16em] text-accent">{zh?copy.sourcingDesk.eyebrowZh:copy.sourcingDesk.eyebrowEn}</p>
          <h2 id="sourcing-desk-title" className="mt-3 text-3xl font-bold leading-tight tracking-tight text-ink sm:text-4xl">{zh?copy.sourcingDesk.titleZh:copy.sourcingDesk.titleEn}</h2>
        </div>
        <p className="max-w-2xl text-sm leading-7 text-muted md:text-base">{zh?copy.sourcingDesk.descriptionZh:copy.sourcingDesk.descriptionEn}</p>
      </header>

      <div className="divide-y divide-slate-300 border-b border-slate-300">
        {sourcingPaths.map(path=><article key={path.id} className="grid gap-6 py-8 lg:grid-cols-[.68fr_1.1fr_auto] lg:items-center lg:gap-10">
          <div>
            <p className="text-xs font-semibold leading-5 text-accent">{zh?path.conditionZh:path.conditionEn}</p>
            <h3 className="mt-2 text-2xl font-bold tracking-tight text-ink">{zh?path.titleZh:path.titleEn}</h3>
          </div>
          <div>
            <p className="max-w-2xl text-sm leading-7 text-muted">{zh?path.descriptionZh:path.descriptionEn}</p>
            <p className="mt-3 flex flex-wrap gap-x-5 gap-y-2 text-xs font-semibold text-body">
              {(zh?path.fitsZh:path.fitsEn).map(item=><span key={item} className="before:mr-2 before:text-accent before:content-['/']">{item}</span>)}
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-5 lg:justify-end">
            <a href={`#${path.id}`} className="inline-flex min-h-11 items-center gap-2 border-b border-ink text-sm font-bold text-ink transition-colors hover:border-accent hover:text-accent">{zh?'看对应面料':'View fabrics'}<ArrowDownRight size={16}/></a>
            {path.id==='custom-weaving'&&<Link to="/contact?intent=custom-weaving#inquiry" className="inline-flex min-h-11 items-center gap-2 text-sm font-bold text-muted transition-colors hover:text-accent">{zh?'发送样品信息':'Send sample details'}<ArrowUpRight size={16}/></Link>}
          </div>
        </article>)}
      </div>
    </div>
  </section>;
}
