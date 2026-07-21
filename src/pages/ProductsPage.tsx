import { ArrowUpRight, CheckCircle2, PackageSearch, Ruler, Scissors } from 'lucide-react';
import { useCatalog } from '../context/CatalogContext';
import { useLanguage } from '../i18n/useLanguage';
import type { ProductGroup } from '../types/product';
import type { ProductCategory } from '../types/catalog';
import { PageHero } from '../components/PageHero';
import { SectionHeading } from '../components/SectionHeading';
import { ProductCard } from '../components/ProductCard';
import { PrimaryButton, SecondaryButton } from '../components/Button';
import { Seo } from '../components/Seo';

const inquiryTips = [
  ['面料用途','Fabric application'],
  ['成分比例','Composition'],
  ['纱支 / 密度 / 门幅 / 克重','Yarn count / Density / Width / Weight'],
  ['颜色、后整理、包装要求','Color, finishing, and packing'],
  ['采购数量与目标交期','Quantity and target lead time'],
  ['是否需要寄样或来样定织','Sample request or custom weaving sample'],
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
    return <section id={category.id} key={category.id} className="scroll-mt-28 border-t border-line pt-10">
      <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-xs font-bold uppercase tracking-[.18em] text-accent">{zh?(category.group==='ready-stock'?'常规在机现货产品':'定制织造产品'):(category.group==='ready-stock'?'Regular In-stock Products':'Custom Weaving Products')}</p>
          <h3 className="mt-2 text-2xl font-bold text-ink">{zh?category.titleZh:category.titleEn}</h3>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-muted">{zh?category.descriptionZh:category.descriptionEn}</p>
        </div>
        <SecondaryButton to="/contact#inquiry">{t.common.quote}</SecondaryButton>
      </div>
      <div className="grid gap-6 md:grid-cols-2">
        {items.map(product=><ProductCard key={product.id} product={product}/>)}
      </div>
    </section>;
  }

  return <>
    <Seo title={{zh:'公司产品',en:'Products'}} description={{zh:'常规在机现货产品和定制织造产品，覆盖床品面料、服装面料、混纺面料和交织面料。',en:'Regular in-stock products and custom weaving products, covering bedding, apparel, blended, and interwoven fabrics.'}}/>
    <PageHero image="/images/production-line.jpg" eyebrow={zh?'公司产品':'Products'} title={t.pages.products} description={zh?'产品分类优先适配海外采购商浏览习惯，按现货与定织两条路径快速找到所需面料。':'Product categories are organized around overseas sourcing habits, helping buyers find fabrics by stock or custom weaving path.'}/>

    <main>
      <section className="section-pad bg-white">
        <div className="container-shell grid gap-10 lg:grid-cols-[.75fr_1.25fr]">
          <SectionHeading eyebrow={zh?'采购路径':'Sourcing Paths'} title={zh?'先判断现货，或进入来样定织':'Start with stock, or move into custom weaving'} description={zh?'首页和产品页都围绕“现货充足、可来样定织”两个核心卖点组织。':'The home and product pages are organized around two selling points: ready stock and sample-based custom weaving.'}/>
          <div className="grid gap-4 md:grid-cols-2">
            <a href="#ready-stock" className="group border border-line bg-canvas p-6 hover:border-accent">
              <PackageSearch className="text-accent" size={30}/>
              <h3 className="mt-5 text-xl font-bold text-ink">{zh?'常规在机现货产品':'Regular In-stock Products'}</h3>
              <p className="mt-3 text-sm leading-6 text-muted">{zh?'优先匹配床品面料、服装面料等常规规格，便于快速看样与报价。':'Prioritize regular bedding and apparel fabric specs for fast sampling and quotation.'}</p>
              <span className="mt-5 inline-flex items-center gap-1 text-sm font-semibold text-accent">{t.common.learnMore}<ArrowUpRight size={16}/></span>
            </a>
            <a href="#custom-weaving" className="group border border-line bg-canvas p-6 hover:border-accent">
              <Scissors className="text-accent" size={30}/>
              <h3 className="mt-5 text-xl font-bold text-ink">{zh?'定制织造产品':'Custom Weaving Products'}</h3>
              <p className="mt-3 text-sm leading-6 text-muted">{zh?'根据客户来样、目标成分和技术指标，评估混纺或交织面料开发方案。':'Evaluate blended or interwoven fabric development by buyer samples, target composition, and technical specs.'}</p>
              <span className="mt-5 inline-flex items-center gap-1 text-sm font-semibold text-accent">{t.common.learnMore}<ArrowUpRight size={16}/></span>
            </a>
          </div>
        </div>
      </section>

      <section id="ready-stock" className="section-pad scroll-mt-28">
        <div className="container-shell">
          <SectionHeading eyebrow={zh?'二级菜单 1':'Category 1'} title={zh?'常规在机现货产品':'Regular In-stock Products'} description={zh?'用于海外客户快速查看常规在机和现货方向，减少初次沟通成本。':'For overseas buyers to quickly review regular running and stock product directions.'}/>
          <div className="mt-12 grid gap-12">
            {readyCategories.map(renderCategory)}
          </div>
        </div>
      </section>

      <section id="custom-weaving" className="section-pad scroll-mt-28 bg-white">
        <div className="container-shell">
          <SectionHeading eyebrow={zh?'二级菜单 2':'Category 2'} title={zh?'定制织造产品':'Custom Weaving Products'} description={zh?'适合有样品、明确规格、特殊成分或复购需求的采购项目。':'For sourcing projects with samples, clear specs, special composition, or repeat demand.'}/>
          <div className="mt-12 grid gap-12">
            {customCategories.map(renderCategory)}
          </div>
        </div>
      </section>

      <section className="section-pad">
        <div className="container-shell grid gap-12 lg:grid-cols-[.75fr_1.25fr]">
          <div>
            <Ruler className="text-accent" size={36}/>
            <SectionHeading eyebrow={zh?'询盘信息':'Inquiry Details'} title={zh?'把面料规格写清楚，报价会更快':'Clear fabric details make quotation faster'} description={zh?'提交询盘或寄样申请时，建议尽量补齐以下信息。':'When sending an inquiry or sample request, include as many of these details as possible.'}/>
            <PrimaryButton to="/contact#inquiry" className="mt-8">{t.common.quote}</PrimaryButton>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            {inquiryTips.map(([zhLabel,enLabel])=><div key={zhLabel} className="flex items-start gap-3 border border-line bg-white p-5">
              <CheckCircle2 className="mt-1 shrink-0 text-success" size={20}/>
              <span className="font-semibold text-ink">{zh?zhLabel:enLabel}</span>
            </div>)}
          </div>
        </div>
      </section>
    </main>
  </>;
}
