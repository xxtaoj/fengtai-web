import { ArrowDownRight, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useCatalog } from '../context/CatalogContext';
import { useLanguage } from '../i18n/useLanguage';
import type { ProductCategory } from '../types/catalog';
import { LocalImage } from '../components/Media';
import { ProductCard } from '../components/ProductCard';
import { Seo } from '../components/Seo';
import { SourcingDesk } from '../components/SourcingDesk';

type InquiryField = {
  code:string;
  zhLabel:string;
  enLabel:string;
  zhHint:string;
  enHint:string;
};

const inquiryFields:InquiryField[] = [
  {code:'USE',zhLabel:'面料用途',enLabel:'Fabric application',zhHint:'床品、服装、工装或其他用途',enHint:'Bedding, apparel, workwear, or another end use'},
  {code:'COMPOSITION',zhLabel:'成分比例',enLabel:'Composition',zhHint:'例如全棉、涤棉或指定混纺比例',enHint:'Cotton, poly-cotton, or a specified blend'},
  {code:'CONSTRUCTION',zhLabel:'纱支、密度、门幅或克重',enLabel:'Construction, width, or weight',zhHint:'有规格表可直接附上',enHint:'Attach your specification sheet if available'},
  {code:'FINISH',zhLabel:'颜色、后整理和包装',enLabel:'Color, finishing, and packing',zhHint:'白坯、染色及包装方式均可说明',enHint:'Greige, dyed, finishing, and packing requirements'},
  {code:'QTY / DATE',zhLabel:'采购数量和计划交期',enLabel:'Quantity and target date',zhHint:'可先提供预估数量与到货时间',enHint:'An estimated quantity and delivery date are enough'},
  {code:'SAMPLE',zhLabel:'寄样或来样定织需求',enLabel:'Sample or custom weaving',zhHint:'有实物样时，先发清晰照片也可以',enHint:'A clear photo is enough to start'},
];

export function ProductsPage(){
  const {language,t}=useLanguage();
  const {catalog}=useCatalog();
  const {products,categories}=catalog;
  const zh=language==='zh';
  const readyCategories=categories.filter(category=>category.group==='ready-stock');
  const customCategories=categories.filter(category=>category.group==='custom-weaving');

  function renderCategory(category:ProductCategory){
    const items=products.filter(product=>product.subcategory===category.id);
    return <section id={category.id} key={category.id} className="scroll-mt-28 border-t border-slate-300 py-10 first:mt-0">
      <div className="grid gap-8 lg:grid-cols-[15rem_1fr] lg:gap-12">
        <header>
          <p className="font-mono text-[11px] font-bold uppercase tracking-[.14em] text-accent">{zh?(category.group==='ready-stock'?'现货 / 在机':'来样 / 定织'):(category.group==='ready-stock'?'Stock / running':'Sample / custom')}</p>
          <h3 className="mt-3 text-2xl font-bold tracking-tight text-ink">{zh?category.titleZh:category.titleEn}</h3>
          <p className="mt-3 text-sm leading-7 text-muted">{zh?category.descriptionZh:category.descriptionEn}</p>
          <a href="/contact#inquiry" className="mt-5 inline-flex min-h-11 items-center gap-2 border-b border-ink text-sm font-bold text-ink transition-colors hover:border-accent hover:text-accent">{zh?'询问这类面料':'Ask about this category'}<ArrowRight size={15}/></a>
        </header>
        <div className={`grid gap-x-7 gap-y-10 ${items.length>1?'md:grid-cols-2':''}`}>
          {items.map(product=><ProductCard key={product.id} product={product} variant="catalog"/>)}
        </div>
      </div>
    </section>;
  }

  return <>
    <Seo title={{zh:'公司产品',en:'Products'}} description={{zh:'查看床品、服装、混纺与交织面料，按现有产品或来样定织两种方式发起询盘。',en:'Review bedding, apparel, blended, and interwoven fabrics, then inquire from the current range or a buyer sample.'}}/>

    <section className="bg-ink pt-28 text-white">
      <div className="container-shell grid min-h-[38rem] lg:grid-cols-[.84fr_1.16fr]">
        <div className="flex flex-col justify-end py-16 pr-0 lg:py-20 lg:pr-14">
          <p className="font-mono text-xs font-bold uppercase tracking-[.18em] text-amber-400">{zh?'工厂面料样册':'Factory fabric range'}</p>
          <h1 className="mt-5 text-5xl font-bold leading-[1.02] tracking-[-.045em] sm:text-6xl lg:text-7xl">{t.pages.products}</h1>
          <p className="mt-6 max-w-xl text-base leading-8 text-slate-300 md:text-lg">{zh?'先按用途看床品、服装等常备方向；手里有实物样或明确参数，再进入混纺、交织定织。':'Browse regular bedding and apparel fabrics by end use. If you have a physical sample or defined specification, move on to blended or interwoven custom weaving.'}</p>
          <div className="mt-10 grid border-y border-white/20 sm:grid-cols-2">
            <a href="#ready-stock" className="flex min-h-16 items-center justify-between gap-3 py-4 pr-5 text-sm font-bold transition-colors hover:text-amber-400 sm:border-r sm:border-white/20">{zh?'查看现有面料':'Review current range'}<ArrowDownRight size={17}/></a>
            <a href="#custom-weaving" className="flex min-h-16 items-center justify-between gap-3 border-t border-white/20 py-4 pr-5 text-sm font-bold transition-colors hover:text-amber-400 sm:border-t-0 sm:pl-5">{zh?'评估来样定织':'Evaluate custom weaving'}<ArrowDownRight size={17}/></a>
          </div>
        </div>

        <div className="relative min-h-[25rem] border-t border-white/15 bg-[#EEE8DC] lg:min-h-full lg:border-l lg:border-t-0">
          <LocalImage src="/images/products/product-01.jpg" alt={zh?'床品面料规格与应用样册':'Bedding fabric specification and application sheet'} className="absolute inset-y-0 left-7 h-full w-[calc(100%-1.75rem)] object-cover object-[10%_50%]"/>
          <div className="product-selvedge absolute inset-y-0 left-0 w-7" aria-hidden="true"/>
          <div className="absolute bottom-0 left-7 right-0 flex flex-wrap justify-between gap-3 bg-white px-5 py-4 text-[11px] font-bold uppercase tracking-[.12em] text-ink">
            <span>{zh?'床品 · 服装 · 混纺 · 交织':'Bedding · Apparel · Blended · Interwoven'}</span>
            <span className="font-mono text-muted">FENGTAI / FABRIC BOOK</span>
          </div>
        </div>
      </div>
    </section>

    <main>
      <SourcingDesk/>

      <section id="ready-stock" className="scroll-mt-28 bg-canvas py-20 md:py-28">
        <div className="container-shell">
          <header className="grid gap-6 pb-12 lg:grid-cols-[.72fr_1.28fr] lg:items-end">
            <div>
              <p className="font-mono text-xs font-bold uppercase tracking-[.16em] text-accent">{zh?'现货与在机':'Stock and running'}</p>
              <h2 className="mt-4 text-4xl font-bold leading-tight tracking-tight text-ink sm:text-5xl">{zh?'先从常做的面料看起':'Start with the regular range'}</h2>
            </div>
            <p className="max-w-2xl text-base leading-8 text-muted">{zh?'这里列的是床品和服装面料方向。看中接近的产品后，可继续确认样品、当批规格、成包米码数和交期。':'This section covers bedding and apparel directions. Once a product is close to your need, ask about samples, current lot specifications, packed metres or yards, and lead time.'}</p>
          </header>
          <div>{readyCategories.map(renderCategory)}</div>
        </div>
      </section>

      <section id="custom-weaving" className="scroll-mt-28 bg-white py-20 md:py-28">
        <div className="container-shell">
          <header className="grid gap-6 pb-12 lg:grid-cols-[.72fr_1.28fr] lg:items-end">
            <div>
              <p className="font-mono text-xs font-bold uppercase tracking-[.16em] text-accent">{zh?'来样定织':'Custom weaving'}</p>
              <h2 className="mt-4 text-4xl font-bold leading-tight tracking-tight text-ink sm:text-5xl">{zh?'拿样品和参数来谈':'Bring the sample and specifications'}</h2>
            </div>
            <p className="max-w-2xl text-base leading-8 text-muted">{zh?'混纺、交织或特殊组织，不先写成现成能力。收到实物样、成分和用途后，再判断打样与批量生产是否可行。':'Blends, interwoven fabrics, and special constructions are reviewed case by case. Sampling and bulk feasibility are checked after we receive the physical sample, composition, and end use.'}</p>
          </header>
          <div>{customCategories.map(renderCategory)}</div>
        </div>
      </section>

      <section className="bg-[#D8D2C6] py-10 md:py-14">
        <div className="container-shell">
          <div className="grid overflow-hidden rounded-[2rem] border border-ink/10 bg-[#EEEAE1] lg:min-h-[36rem] lg:grid-cols-[.78fr_1.22fr]">
            <div className="flex flex-col bg-[#D8D2C6] p-8 text-ink sm:p-10 lg:p-12">
              <p className="font-mono text-xs font-bold uppercase tracking-[.16em] text-accent">{zh?'采购资料 / BUYER NOTES':'Buyer notes / 采购资料'}</p>
              <h2 className="mt-6 max-w-lg text-3xl font-bold leading-tight tracking-tight sm:text-4xl">{zh?'询价不用一次写全':'You do not need every detail to start'}</h2>
              <p className="mt-5 max-w-md text-sm leading-7 text-body">{zh?'先把手头已有的规格、图片或样品发来。缺少的项目，业务会在确认时逐项补齐。':'Send the specifications, images, or sample you already have. Our sales team will help complete the missing details.'}</p>
              <div className="mt-auto pt-10">
                <p className="mb-5 text-xs leading-6 text-muted">{zh?'资料不齐也可以先问，我们会告诉你下一步需要什么。':'It is fine to ask first. We will tell you what is needed next.'}</p>
                <Link to="/contact#inquiry" className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-[#0B4AA2] px-7 text-sm font-bold text-white shadow-[0_14px_30px_-20px_rgba(11,74,162,.9)] transition duration-300 hover:-translate-y-0.5 hover:bg-[#0D56BA] active:translate-y-0">{zh?'发资料询价':'Send details'}<ArrowRight size={16}/></Link>
              </div>
            </div>

            <div className="relative bg-[#F3F0E9] text-ink">
              <div className="product-selvedge absolute inset-y-0 left-0 w-7" aria-hidden="true"/>
              <div className="flex h-full flex-col px-7 py-8 pl-14 sm:px-10 sm:py-10 sm:pl-16 lg:px-12 lg:py-12 lg:pl-20">
                <header className="flex flex-col gap-4 border-b border-ink/20 pb-7 sm:flex-row sm:items-end sm:justify-between">
                  <div>
                    <p className="font-mono text-[10px] font-bold uppercase tracking-[.16em] text-accent">FENGTAI / BUYER'S SPEC SHEET</p>
                    <h3 className="mt-3 text-2xl font-bold tracking-tight">{zh?'手头有哪项，就先发哪项':'Send whichever details you have'}</h3>
                  </div>
                  <p className="font-mono text-[10px] uppercase tracking-[.12em] text-muted">{zh?'未知项可后补':'Unknowns can follow'}</p>
                </header>

                <dl className="grid flex-1 gap-x-10 sm:grid-cols-2 sm:grid-rows-3">
                  {inquiryFields.map(field=><div key={field.code} className="flex flex-col justify-center border-b border-ink/15 py-5">
                    <dt className="font-mono text-[10px] font-bold uppercase tracking-[.13em] text-accent">{field.code}</dt>
                    <dd className="mt-2">
                      <span className="block text-sm font-bold leading-6">{zh?field.zhLabel:field.enLabel}</span>
                      <span className="mt-1 block text-xs leading-5 text-muted">{zh?field.zhHint:field.enHint}</span>
                    </dd>
                  </div>)}
                </dl>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  </>;
}
