import { useParams } from 'react-router-dom';
import { Check, PackageSearch } from 'lucide-react';
import { products } from '../data/products';
import { company } from '../data/company';
import { useLanguage } from '../i18n/useLanguage';
import { Breadcrumbs } from '../components/Breadcrumbs';
import { ErrorState } from '../components/ErrorState';
import { LocalImage } from '../components/Media';
import { PrimaryButton, SecondaryButton } from '../components/Button';
import { ProductCard } from '../components/ProductCard';
import { Seo } from '../components/Seo';

export function ProductDetailPage(){
  const {slug}=useParams();
  const {language}=useLanguage();
  const zh=language==='zh';
  const p=products.find(x=>x.slug===slug);
  if(!p)return <main className="section-pad pt-40"><ErrorState title={zh?'产品未找到':'Product not found'} message={zh?'该产品链接无效。':'This product link is invalid.'}/></main>;
  const businessPath=zh?(p.group==='ready-stock'?'常规在机现货产品':'定制织造产品'):(p.group==='ready-stock'?'Regular In-stock Product':'Custom Weaving Product');
  const specs=[
    [zh?'产品分类':'Category',zh?p.categoryZh:p.categoryEn],
    [zh?'业务路径':'Business Path',businessPath],
    [zh?'起订与排产':'MOQ & Scheduling',company.moq],
    [zh?'交期':'Lead Time',company.leadTime],
    [zh?'样品方式':'Sample Method',zh?'可寄样、看样或来样评估':'Sample delivery, sample review, or buyer sample evaluation'],
    [zh?'询盘建议':'Inquiry Suggestion',zh?'请提供成分、纱支、密度、门幅、克重、数量和用途':'Provide composition, yarn count, density, width, weight, quantity, and application'],
  ];
  const related=products.filter(x=>x.id!==p.id&&(x.subcategory===p.subcategory||x.group===p.group)).slice(0,3);
  return <>
    <Seo title={{zh:p.nameZh,en:p.nameEn}} description={{zh:p.summaryZh,en:p.summaryEn}}/>
    <main className="pb-24 pt-32">
      <div className="container-shell">
        <Breadcrumbs items={[{label:zh?'公司产品':'Products',to:'/products'},{label:zh?p.nameZh:p.nameEn}]}/>
        <section className="mt-10 grid gap-12 lg:grid-cols-2">
          <LocalImage src={p.image} alt={zh?`${p.nameZh}产品主图`:`Main image of ${p.nameEn}`} className="aspect-square w-full object-cover"/>
          <div className="py-4">
            <p className="text-xs font-bold uppercase tracking-[.22em] text-accent">{zh?p.categoryZh:p.categoryEn}</p>
            <h1 className="mt-5 text-4xl font-bold text-ink md:text-6xl">{zh?p.nameZh:p.nameEn}</h1>
            <p className="mt-6 text-lg leading-8 text-muted">{zh?p.summaryZh:p.summaryEn}</p>
            <div className="mt-8 flex flex-wrap gap-3">
              <PrimaryButton to="/contact#inquiry">{zh?'询盘此面料':'Inquire This Fabric'}</PrimaryButton>
              <SecondaryButton to="/products">{zh?'返回产品分类':'Back to Products'}</SecondaryButton>
            </div>
            <dl className="mt-10 grid border-l border-t border-line sm:grid-cols-2">{specs.map(([k,v])=><div key={k} className="border-b border-r border-line p-5"><dt className="text-xs text-muted">{k}</dt><dd className="mt-1 font-bold text-ink">{v}</dd></div>)}</dl>
          </div>
        </section>
        <section className="section-pad grid gap-12 lg:grid-cols-[.7fr_1.3fr]">
          <div><PackageSearch className="text-accent" size={36}/><h2 className="mt-5 text-3xl font-bold text-ink">{zh?'产品说明':'Product Details'}</h2></div>
          <div className="grid gap-4 sm:grid-cols-2">{(zh?p.specsZh:p.specsEn).map(item=><div key={item} className="flex gap-3 border-t border-line pt-5"><Check className="shrink-0 text-success" size={20}/><span className="font-semibold text-ink">{item}</span></div>)}</div>
        </section>
        <section>
          <h2 className="text-2xl font-bold text-ink">{zh?'相关产品':'Related Products'}</h2>
          <div className="mt-8 grid gap-6 md:grid-cols-3">{related.map(x=><ProductCard key={x.id} product={x}/>)}</div>
        </section>
      </div>
    </main>
  </>;
}
