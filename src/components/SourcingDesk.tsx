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

  return <section aria-label={zh?'面料采购路径':'Fabric sourcing paths'} className="bg-white py-12 md:py-16">
    <div className="container-shell">
      <div className="divide-y divide-slate-300 border-y border-slate-300">
        {sourcingPaths.map(path=><article key={path.id} className="grid gap-6 py-8 lg:grid-cols-[minmax(17rem,.72fr)_minmax(0,1.1fr)_minmax(18rem,.82fr)] lg:items-center lg:gap-8">
          <div>
            <h3 className="text-2xl font-bold tracking-tight text-ink">{zh?path.titleZh:path.titleEn}</h3>
          </div>
          <div>
            <p className="max-w-2xl text-sm leading-7 text-muted">{zh?path.descriptionZh:path.descriptionEn}</p>
          </div>
          <div className="flex flex-wrap items-center gap-5 lg:justify-start">
            <a href={`#${path.id}`} className="inline-flex min-h-11 items-center gap-2 border-b border-ink text-sm font-bold text-ink transition-colors hover:border-accent hover:text-accent">{zh?'看对应面料':'View fabrics'}<ArrowDownRight size={16}/></a>
            {path.id==='custom-weaving'&&<Link to="/contact?intent=custom-weaving#inquiry" className="inline-flex min-h-11 items-center gap-2 text-sm font-bold text-muted transition-colors hover:text-accent">{zh?'发送样品信息':'Send sample details'}<ArrowUpRight size={16}/></Link>}
          </div>
        </article>)}
      </div>
    </div>
  </section>;
}
