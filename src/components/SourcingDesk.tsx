import { ArrowDownRight, ArrowUpRight } from 'lucide-react';
import { Link } from 'react-router-dom';
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
  anchor: string;
};

const sourcingPaths:SourcingPath[]=[
  {
    id:'ready-stock',
    conditionZh:'已经知道用途或面料类别',
    conditionEn:'You know the end use or fabric category',
    titleZh:'先看现有面料',
    titleEn:'Review the current range',
    descriptionZh:'从床品和服装面料中找接近的方向，再确认样品、批次规格和交期。',
    descriptionEn:'Start with bedding or apparel fabrics, then check samples, lot specifications, and lead time.',
    fitsZh:['床品与服装面料','先看样，再谈规格','可直接带产品名称询盘'],
    fitsEn:['Bedding and apparel','Sample first, specifications next','Inquire with a product name'],
    anchor:'ready-stock',
  },
  {
    id:'custom-weaving',
    conditionZh:'手里有实物样或明确参数',
    conditionEn:'You have a sample or defined specifications',
    titleZh:'评估来样定织',
    titleEn:'Evaluate custom weaving',
    descriptionZh:'把样品、成分、组织和用途发来，先判断能否打样，再谈批量生产。',
    descriptionEn:'Share the sample, composition, construction, and end use. We will review sampling before bulk production.',
    fitsZh:['混纺与交织方向','特殊组织或手感','打样后确认批量'],
    fitsEn:['Blended and interwoven fabrics','Special construction or hand-feel','Bulk review after sampling'],
    anchor:'custom-weaving',
  },
];

export function SourcingDesk(){
  const {language}=useLanguage();
  const zh=language==='zh';

  return <section aria-labelledby="sourcing-desk-title" className="bg-white py-16 md:py-20">
    <div className="container-shell">
      <header className="grid gap-5 border-b border-slate-300 pb-8 lg:grid-cols-[.72fr_1.28fr] lg:items-end">
        <div>
          <p className="font-mono text-xs font-bold uppercase tracking-[.16em] text-accent">{zh?'从哪里开始':'Where to begin'}</p>
          <h2 id="sourcing-desk-title" className="mt-3 text-3xl font-bold leading-tight tracking-tight text-ink sm:text-4xl">{zh?'先看你手里有什么':'Start with what you already have'}</h2>
        </div>
        <p className="max-w-2xl text-sm leading-7 text-muted md:text-base">{zh?'有明确用途，可以先翻现有样册；有实物样或技术参数，就直接谈定织。库存、价格和排期仍以当次询盘为准。':'If the end use is clear, start with the current range. If you have a sample or technical specification, move directly to custom weaving. Stock, price, and scheduling are confirmed with each inquiry.'}</p>
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
            <a href={`#${path.anchor}`} className="inline-flex min-h-11 items-center gap-2 border-b border-ink text-sm font-bold text-ink transition-colors hover:border-accent hover:text-accent">{zh?'看对应面料':'View fabrics'}<ArrowDownRight size={16}/></a>
            {path.id==='custom-weaving'&&<Link to="/contact?intent=custom-weaving#inquiry" className="inline-flex min-h-11 items-center gap-2 text-sm font-bold text-muted transition-colors hover:text-accent">{zh?'发送样品信息':'Send sample details'}<ArrowUpRight size={16}/></Link>}
          </div>
        </article>)}
      </div>
    </div>
  </section>;
}
