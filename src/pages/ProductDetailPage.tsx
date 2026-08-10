import { useParams } from 'react-router-dom';
import { ArrowUpRight } from 'lucide-react';
import { useCatalog } from '../context/CatalogContext';
import { useLanguage } from '../i18n/useLanguage';
import { Breadcrumbs } from '../components/Breadcrumbs';
import { ErrorState } from '../components/ErrorState';
import { LocalImage } from '../components/Media';
import { PrimaryButton, SecondaryButton } from '../components/Button';
import { ProductCard } from '../components/ProductCard';
import { ProductImageScroller } from '../components/ProductImageScroller';
import { Seo } from '../components/Seo';

type PassportRow = {
  label: string;
  value: string;
  mono?: boolean;
};

export function ProductDetailPage(){
  const {slug}=useParams();
  const {language}=useLanguage();
  const {catalog}=useCatalog();
  const {products}=catalog;
  const zh=language==='zh';
  const product=products.find(item=>item.slug===slug);
  if(!product)return <main className="section-pad pt-40"><ErrorState title={zh?'产品未找到':'Product not found'} message={zh?'该产品链接无效。':'This product link is invalid.'}/></main>;

  const hasSupplementalSpecifications=Boolean(product.beddingSpecifications?.length);
  const hasStockSpecifications=Boolean(product.stockSpecifications?.length);
  const businessPath=zh?(product.group==='ready-stock'?'常规产品':'来样定织'):(product.group==='ready-stock'?'Regular product':'Custom weaving');
  const passportRows:PassportRow[]=[
    {label:zh?'档案编号':'Record number',value:`P-${String(product.id).padStart(2,'0')}`,mono:true},
    {label:zh?'产品分类':'Category',value:zh?product.categoryZh:product.categoryEn},
    {label:zh?'供货路径':'Supply path',value:businessPath},
  ].filter(row=>row.value.trim());
  const images=[product.image,...(product.gallery??[]).filter(image=>image!==product.image)];
  const related=products.filter(item=>item.id!==product.id&&(item.subcategory===product.subcategory||item.group===product.group)).slice(0,3);
  const inquiryTarget=`/contact?intent=product&product=${encodeURIComponent(zh?product.nameZh:product.nameEn)}&productId=${product.id}#inquiry`;
  return <>
    <Seo title={{zh:product.nameZh,en:product.nameEn}} description={{zh:product.summaryZh,en:product.summaryEn}}/>
    <main className="bg-white pb-24 pt-32">
      <div className="container-shell">
        <Breadcrumbs items={[{label:zh?'公司产品':'Products',to:'/products'},{label:zh?product.nameZh:product.nameEn}]}/>

        <section aria-labelledby="fabric-passport-title" className="mt-10 border-y border-slate-300 py-8 lg:py-12">
          <div className="mb-8 flex flex-wrap items-end justify-between gap-4 border-b border-slate-300 pb-5">
            <div>
              <p className="font-mono text-xs font-bold uppercase tracking-[.18em] text-accent">{zh?'面料技术护照':'Fabric passport'} · P-{String(product.id).padStart(2,'0')}</p>
              <p className="mt-2 text-sm text-muted">{zh?'目录信息仅展示当前已确认字段':'Only currently available catalogue fields are shown'}</p>
            </div>
            <span className="font-mono text-xs text-muted">{businessPath}</span>
          </div>

          <div className="grid gap-12 lg:grid-cols-[1.08fr_.92fr] lg:gap-16">
            <div>
              <ProductImageScroller product={product} alt={zh?`${product.nameZh}面料图片`:`${product.nameEn} fabric image`} loading="eager"/>
              {images.length>1&&<div className="mt-4 grid grid-cols-4 gap-3" aria-label={zh?'选择产品图片':'Select a product image'}>
                {images.map((image,index)=><div key={image} className="min-h-11 border border-slate-300 p-1"><LocalImage loading="lazy" src={image} alt={zh?`${product.nameZh}缩略图 ${index+1}`:`${product.nameEn} thumbnail ${index+1}`} className="aspect-square w-full object-cover"/></div>)}
              </div>}
            </div>

            <div>
              <p className="text-xs font-bold uppercase tracking-[.16em] text-accent">{zh?product.categoryZh:product.categoryEn}</p>
              <h1 id="fabric-passport-title" className="mt-4 text-4xl font-bold leading-tight tracking-tight text-ink md:text-5xl">{zh?product.nameZh:product.nameEn}</h1>
              <p className="mt-5 text-base leading-8 text-muted">{zh?product.summaryZh:product.summaryEn}</p>

              <dl className="mt-8 border-t border-slate-400">
                {passportRows.map(row=><div key={row.label} className="grid gap-2 border-b border-slate-200 py-4 sm:grid-cols-[8rem_1fr] sm:gap-6">
                  <dt className="text-xs font-bold uppercase tracking-[.08em] text-muted">{row.label}</dt>
                  <dd className={`text-sm font-semibold leading-6 text-ink ${row.mono?'font-mono':''}`}>{row.value}</dd>
                </div>)}
              </dl>

              <div className="mt-8 flex flex-wrap gap-3">
                <PrimaryButton to={inquiryTarget}>{zh?'携带此产品发起询盘':'Start an inquiry with this product'}<ArrowUpRight size={16}/></PrimaryButton>
                <SecondaryButton to="/products">{zh?'返回产品分类':'Back to products'}</SecondaryButton>
              </div>
            </div>
          </div>
        </section>

        {hasSupplementalSpecifications&&product.beddingSpecifications&&<section aria-labelledby="supplemental-specifications-title" className="pb-14 md:pb-20">
          <div className="flex flex-wrap items-baseline justify-between gap-2 border-t-2 border-ink pt-5">
            <h2 id="supplemental-specifications-title" className="text-lg font-bold text-ink">{zh?'补充规格表':'Supplemental specifications'}</h2>
            <span className="font-mono text-[11px] uppercase tracking-[.12em] text-muted">{zh?'以实际批次为准':'Confirm against actual lot'}</span>
          </div>
          <dl className="mt-4 border-y border-line">
            {product.beddingSpecifications.map(specification=><div key={specification.labelEn} className="grid gap-2 border-b border-line py-4 last:border-b-0 sm:grid-cols-[9rem_1fr] sm:gap-6">
              <dt className="text-xs font-bold uppercase tracking-[.08em] text-muted">{zh?specification.labelZh:specification.labelEn}</dt>
              <dd className="whitespace-pre-line text-sm font-semibold leading-6 text-ink">{zh?specification.valueZh:specification.valueEn}</dd>
            </div>)}
          </dl>
        </section>}

        {hasStockSpecifications&&product.stockSpecifications&&<section aria-labelledby="stock-specifications-title" className="pb-14 md:pb-20">
          <div className="flex flex-wrap items-baseline justify-between gap-2 border-t-2 border-ink pt-5">
            <h2 id="stock-specifications-title" className="text-lg font-bold text-ink">{zh?'批量规格表':'Stock specification table'}</h2>
            <span className="font-mono text-[11px] uppercase tracking-[.12em] text-muted">{zh?'以实际批次为准':'Confirm against actual lot'}</span>
          </div>
          <div className="mt-4 overflow-x-auto border border-line">
            <table className="min-w-[760px] w-full border-collapse text-left text-sm">
              <thead className="bg-slate-100 text-xs font-bold uppercase tracking-[.06em] text-muted">
                <tr>
                  {['No.', 'Comp.', 'Yarn count', 'Density', 'Width', 'Weave', 'Pkg'].map(column=><th key={column} className="whitespace-nowrap border-b border-line px-4 py-3">{column}</th>)}
                </tr>
              </thead>
              <tbody>
                {product.stockSpecifications.map((specification, index)=><tr key={`${specification.no}-${index}`} className="odd:bg-white even:bg-slate-50/70">
                  <td className="whitespace-nowrap border-b border-line px-4 py-3 font-semibold text-ink">{specification.no}</td>
                  <td className="whitespace-nowrap border-b border-line px-4 py-3 text-ink">{specification.composition}</td>
                  <td className="whitespace-nowrap border-b border-line px-4 py-3 text-ink">{specification.yarnCount}</td>
                  <td className="whitespace-nowrap border-b border-line px-4 py-3 text-ink">{specification.density}</td>
                  <td className="whitespace-nowrap border-b border-line px-4 py-3 text-ink">{specification.width}</td>
                  <td className="whitespace-nowrap border-b border-line px-4 py-3 text-ink">{specification.weave}</td>
                  <td className="whitespace-nowrap border-b border-line px-4 py-3 text-ink">{specification.pkg}</td>
                </tr>)}
              </tbody>
            </table>
          </div>
        </section>}

        <section className="border-t border-slate-300 pt-10">
          <h2 className="text-2xl font-bold text-ink">{zh?'相关产品':'Related products'}</h2>
          <div className="mt-8 grid gap-6 md:grid-cols-3">{related.map(item=><ProductCard key={item.id} product={item}/>)}</div>
        </section>
      </div>
    </main>
  </>;
}
