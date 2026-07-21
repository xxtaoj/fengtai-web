import { Award, Building2, Factory, Network, ShieldCheck, UsersRound, type LucideIcon } from 'lucide-react';
import { company } from '../data/company';
import { useLanguage } from '../i18n/useLanguage';
import { PageHero } from '../components/PageHero';
import { SectionHeading } from '../components/SectionHeading';
import { StatsSection } from '../components/StatsSection';
import { LocalImage } from '../components/Media';
import { Seo } from '../components/Seo';
import { InternationalCertifications } from '../components/InternationalCertifications';

type InfoCard = {
  icon: LucideIcon;
  titleZh: string;
  titleEn: string;
  descriptionZh: string;
  descriptionEn: string;
};

export function CompanyPage(){
  const {language,t}=useLanguage();
  const zh=language==='zh';
  const overview:InfoCard[] = [
    {icon:Factory,titleZh:'源头织布工厂',titleEn:'Source Weaving Factory',descriptionZh:'围绕床品面料、服装面料及定制织造需求，为采购商提供从面料沟通到样品确认的前端支持。',descriptionEn:'Supporting buyers from fabric discussion to sample confirmation across bedding, apparel, and custom weaving needs.'},
    {icon:ShieldCheck,titleZh:'现货与定织并重',titleEn:'Stock and Custom Weaving',descriptionZh:'常规在机现货便于快速筛选，来样定织适配混纺、交织和特殊规格开发。',descriptionEn:'Regular in-stock items support quick screening, while sample-based weaving fits blended, interwoven, and special specs.'},
    {icon:Building2,titleZh:'多地业务与生产协同',titleEn:'Multi-site Coordination',descriptionZh:'石家庄办公区、喀什工厂和宁夏织造基地共同承接业务沟通、生产排期与交付协作。',descriptionEn:'The Shijiazhuang office, Kashgar factory, and Ningxia weaving base coordinate sales communication, production scheduling, and delivery.'},
  ];
  const sites = [
    {image:'/images/factory-exterior.jpg',titleZh:'石家庄办公区',titleEn:'Shijiazhuang Office',descZh:'用于客户接待、样品沟通、业务对接与订单资料整理。',descEn:'For buyer reception, sample discussion, sales coordination, and order documentation.'},
    {image:'',titleZh:'新疆喀什工厂',titleEn:'Kashgar Factory',descZh:'承接织造生产、工厂实景展示和生产流程背书。',descEn:'Supports weaving production, factory scene display, and production workflow proof.'},
    {image:'',titleZh:'宁夏织造基地',titleEn:'Ningxia Weaving Base',descZh:'用于补充织造产能、现货整理和定织排产协同。',descEn:'Adds weaving capacity, stock organization, and custom production coordination.'},
  ];
  const teams:InfoCard[] = [
    {icon:UsersRound,titleZh:'外贸业务团队',titleEn:'Export Sales Team',descriptionZh:'负责海外询盘、英文沟通、样品寄送和贸易条款确认。',descriptionEn:'Handles overseas inquiries, English communication, sample delivery, and trade term confirmation.'},
    {icon:Network,titleZh:'生产与排单团队',titleEn:'Production Planning Team',descriptionZh:'根据现货、来样定织、交期和数量评估生产可行性。',descriptionEn:'Evaluates production feasibility by stock, custom samples, lead time, and quantity.'},
    {icon:Award,titleZh:'品控与仓储团队',titleEn:'Quality and Warehouse Team',descriptionZh:'配合样品确认、出货前检查、包装和仓储发货。',descriptionEn:'Supports sample confirmation, pre-shipment checks, packing, warehousing, and delivery.'},
  ];

  return <>
    <Seo title={{zh:'公司简介',en:'Company Profile'}} description={{zh:'丰泰永晟公司简介、发展历程、资质证书、工厂实景和团队介绍。',en:'Fengtai Yongsheng company profile, history, certificates, factory sites, and team overview.'}}/>
    <PageHero image="/images/factory-exterior.jpg" eyebrow={zh?'公司简介':'Company Profile'} title={t.pages.company} description={zh?'了解源头织布工厂的企业概况、发展历程、资质荣誉、生产工厂实景和核心业务团队。':'Explore the source weaving factory profile, history, certificates, factory sites, and core business team.'}/>

    <main>
      <section id="overview" className="section-pad scroll-mt-28 bg-white">
        <div className="container-shell">
          <SectionHeading eyebrow={zh?'企业概况':'Company Overview'} title={zh?'源头织布工厂，面向海内外采购需求':'A source weaving factory for domestic and overseas buyers'} description={zh?'网站内容以采购商快速判断合作可行性为目标，突出常规现货和来样定织两条业务主线。':'The website helps buyers evaluate cooperation quickly by emphasizing regular stock and custom weaving from samples.'}/>
          <div className="mt-10 grid gap-5 md:grid-cols-3">
            {overview.map(({icon:Icon,titleZh,titleEn,descriptionZh,descriptionEn})=><article key={titleZh} className="border border-line bg-white p-6 shadow-sm">
              <Icon className="text-accent" size={28}/>
              <h3 className="mt-5 text-xl font-bold text-ink">{zh?titleZh:titleEn}</h3>
              <p className="mt-3 text-sm leading-6 text-muted">{zh?descriptionZh:descriptionEn}</p>
            </article>)}
          </div>
          <div className="mt-12"><StatsSection/></div>
        </div>
      </section>

      <InternationalCertifications/>

      <section id="factory-sites" className="section-pad scroll-mt-28">
        <div className="container-shell">
          <SectionHeading eyebrow={zh?'生产工厂实景':'Factory Sites'} title={zh?'石家庄办公区、喀什工厂、宁夏织造基地':'Shijiazhuang office, Kashgar factory, and Ningxia weaving base'} description={zh?'通过真实照片展示办公接待、生产现场、仓储与发货能力。':'Use real photos to show office reception, production scenes, warehousing, and delivery capability.'}/>
          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {sites.map(site=><article key={site.titleZh} className="bg-white shadow-sm">
              {site.image&&<LocalImage loading="lazy" src={site.image} alt={zh?site.titleZh:site.titleEn} className="aspect-[4/3] w-full object-cover"/>}
              <div className={`border border-line p-6 ${site.image?'border-t-0':''}`}>
                <h3 className="text-xl font-bold text-ink">{zh?site.titleZh:site.titleEn}</h3>
                <p className="mt-3 text-sm leading-6 text-muted">{zh?site.descZh:site.descEn}</p>
              </div>
            </article>)}
          </div>
        </div>
      </section>

      <section id="team" className="section-pad scroll-mt-28 bg-white">
        <div className="container-shell grid gap-12 lg:grid-cols-[.7fr_1.3fr]">
          <SectionHeading eyebrow={zh?'组织架构或核心业务团队':'Core Business Team'} title={zh?'让询盘、寄样、定织和出货有人跟进':'Clear ownership for inquiry, samples, custom weaving, and shipment'} description={zh?'团队介绍聚焦采购商关心的协作角色，而不是泛泛展示。':'The team section focuses on collaboration roles that matter to buyers.'}/>
          <div className="grid gap-5 md:grid-cols-3">
            {teams.map(({icon:Icon,titleZh,titleEn,descriptionZh,descriptionEn})=><article key={titleZh} className="border-t border-line pt-5">
              <Icon className="text-accent" size={28}/>
              <h3 className="mt-5 text-lg font-bold text-ink">{zh?titleZh:titleEn}</h3>
              <p className="mt-3 text-sm leading-6 text-muted">{zh?descriptionZh:descriptionEn}</p>
            </article>)}
          </div>
        </div>
      </section>
    </main>
  </>;
}
