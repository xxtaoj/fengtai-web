import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { ArrowUpRight, PackageSearch } from 'lucide-react';
import { useCatalog } from '../context/CatalogContext';
import { useLanguage } from '../i18n/useLanguage';
import { Breadcrumbs } from '../components/Breadcrumbs';
import { ErrorState } from '../components/ErrorState';
import { LocalImage } from '../components/Media';
import { PrimaryButton, SecondaryButton } from '../components/Button';
import { ProductCard } from '../components/ProductCard';
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
  const [activeImage,setActiveImage]=useState(0);
  if(!product)return <main className="section-pad pt-40"><ErrorState title={zh?'产品未找到':'Product not found'} message={zh?'该产品链接无效。':'This product link is invalid.'}/></main>;

  const isBedding=product.subcategory==='bedding-fabric';
  const businessPath=zh?(product.group==='ready-stock'?'常规产品':'来样定织'):(product.group==='ready-stock'?'Regular product':'Custom weaving');
  const passportRows:PassportRow[]=[
    {label:zh?'档案编号':'Record number',value:`P-${String(product.id).padStart(2,'0')}`,mono:true},
    {label:zh?'产品分类':'Category',value:zh?product.categoryZh:product.categoryEn},
    {label:zh?'供货路径':'Supply path',value:businessPath},
    ...(product.specifications??[]).map(specification=>({label:zh?specification.labelZh:specification.labelEn,value:zh?specification.valueZh:specification.valueEn})),
  ].filter(row=>row.value.trim());
  const images=[product.image,...(product.gallery??[]).filter(image=>image!==product.image)];
  const related=products.filter(item=>item.id!==product.id&&(item.subcategory===product.subcategory||item.group===product.group)).slice(0,3);
  const inquiryTarget=`/contact?intent=product&product=${encodeURIComponent(zh?product.nameZh:product.nameEn)}&productId=${product.id}#inquiry`;
  const confirmationNotes=[
    ...(zh?product.specsZh:product.specsEn),
    ...(isBedding?[zh?'成包米 / 码数按现货批次或订单要求确认':'Packed metres / yards confirmed by stock lot or order requirement']:[]),
  ];

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
              <LocalImage loading="eager" src={images[activeImage]} alt={zh?`${product.nameZh}面料图片 ${activeImage+1}`:`${product.nameEn} fabric image ${activeImage+1}`} className="aspect-[4/3] w-full bg-canvas object-cover"/>
              {images.length>1&&<div className="mt-4 grid grid-cols-4 gap-3" aria-label={zh?'选择产品图片':'Select a product image'}>
                {images.map((image,index)=><button key={image} type="button" aria-pressed={activeImage===index} onClick={()=>setActiveImage(index)} className={`min-h-11 border p-1 transition-colors ${activeImage===index?'border-accent':'border-slate-300 hover:border-ink'}`}><LocalImage loading="lazy" src={image} alt="" className="aspect-square w-full object-cover"/></button>)}
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

        <section className="section-pad grid gap-12 lg:grid-cols-[.7fr_1.3fr]">
          <div><PackageSearch className="text-accent" size={32}/><h2 className="mt-5 text-3xl font-bold text-ink">{zh?'询盘前确认':'Before inquiry'}</h2><p className="mt-4 max-w-sm text-sm leading-7 text-muted">{zh?'以下内容来自当前产品资料，具体规格仍需结合样品或询盘确认。':'The following notes come from the current product record. Final specifications still depend on the sample or inquiry review.'}</p></div>
          <div>
            <div className="grid gap-x-8 sm:grid-cols-2">{confirmationNotes.map((item,index)=><div key={item} className="grid grid-cols-[2rem_1fr] gap-2 border-t border-line py-5"><span className="font-mono text-xs text-accent">{String(index+1).padStart(2,'0')}</span><span className="font-semibold leading-6 text-ink">{item}</span></div>)}</div>

            {isBedding&&product.beddingSpecifications?.length&&<section aria-labelledby="bedding-specifications-title" className="mt-8 border-t-2 border-ink pt-5">
              <div className="flex flex-wrap items-baseline justify-between gap-2">
                <h3 id="bedding-specifications-title" className="text-lg font-bold text-ink">{zh?'床品面料规格':'Bedding fabric specifications'}</h3>
                <span className="font-mono text-[11px] uppercase tracking-[.12em] text-muted">{zh?'以实际批次为准':'Confirm against actual lot'}</span>
              </div>
              <dl className="mt-4 border-y border-line">
                {product.beddingSpecifications.map(specification=><div key={specification.labelEn} className="grid gap-2 border-b border-line py-4 last:border-b-0 sm:grid-cols-[9rem_1fr] sm:gap-6">
                  <dt className="text-xs font-bold uppercase tracking-[.08em] text-muted">{zh?specification.labelZh:specification.labelEn}</dt>
                  <dd className="whitespace-pre-line text-sm font-semibold leading-6 text-ink">{zh?specification.valueZh:specification.valueEn}</dd>
                </div>)}
              </dl>
            </section>}
          </div>
        </section>

        <section className="border-t border-slate-300 pt-10">
          <h2 className="text-2xl font-bold text-ink">{zh?'相关产品':'Related products'}</h2>
          <div className="mt-8 grid gap-6 md:grid-cols-3">{related.map(item=><ProductCard key={item.id} product={item}/>)}</div>
        </section>
      </div>
    </main>
  </>;
}
