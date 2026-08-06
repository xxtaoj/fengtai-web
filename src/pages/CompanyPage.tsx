import { Award, Building2, Factory, Network, ShieldCheck, UsersRound } from 'lucide-react';
import { useSite } from '../context/SiteContext';
import { useLanguage } from '../i18n/useLanguage';
import { PageHero } from '../components/PageHero';
import { SectionHeading } from '../components/SectionHeading';
import { StatsSection } from '../components/StatsSection';
import { LocalImage } from '../components/Media';
import { Seo } from '../components/Seo';
import { InternationalCertifications } from '../components/InternationalCertifications';

export function CompanyPage(){
  const {language}=useLanguage();
  const zh=language==='zh';
  const {site}=useSite();
  const company = site.copy.company as {
    hero: { eyebrowZh: string; eyebrowEn: string; titleZh: string; titleEn: string; descriptionZh: string; descriptionEn: string; image: string };
    overview: Array<{ titleZh: string; titleEn: string; descriptionZh: string; descriptionEn: string }>;
    sites: Array<{ image: string; titleZh: string; titleEn: string; descZh: string; descEn: string }>;
    team: Array<{ titleZh: string; titleEn: string; descriptionZh: string; descriptionEn: string }>;
  };

  const icons = [Factory, ShieldCheck, Building2];
  const teamIcons = [UsersRound, Network, Award];

  return <>
    <Seo title={{zh:'公司简介',en:'Company Profile'}} description={{zh:'丰泰永晟公司简介、发展历程、资质证书、工厂实景和团队介绍。',en:'Fengtai Yongsheng company profile, history, certificates, factory sites, and team overview.'}}/>
    <PageHero image={company.hero.image} eyebrow={zh?company.hero.eyebrowZh:company.hero.eyebrowEn} title={zh?company.hero.titleZh:company.hero.titleEn} description={zh?company.hero.descriptionZh:company.hero.descriptionEn}/>

    <main>
      <section id="overview" className="section-pad scroll-mt-28 bg-white">
        <div className="container-shell">
          <SectionHeading eyebrow={zh?'企业概况':'Company Overview'} title={zh?'源头织布工厂，面向海内外采购需求':'A source weaving factory for domestic and overseas buyers'} description={zh?'网站内容以采购商快速判断合作可行性为目标，突出常规现货和来样定织两条业务主线。':'The website helps buyers evaluate cooperation quickly by emphasizing regular stock and custom weaving from samples.'}/>
          <div className="mt-10 grid gap-5 md:grid-cols-3">
            {company.overview.map(({titleZh,titleEn,descriptionZh,descriptionEn},index)=><article key={titleZh} className="border border-line bg-white p-6 shadow-sm">
              {(() => { const Icon = icons[index] ?? Factory; return <Icon className="text-accent" size={28}/>; })()}
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
            {company.sites.map(site=><article key={site.titleZh} className="bg-white shadow-sm">
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
            {company.team.map(({titleZh,titleEn,descriptionZh,descriptionEn},index)=><article key={titleZh} className="border-t border-line pt-5">
              {(() => { const Icon = teamIcons[index] ?? UsersRound; return <Icon className="text-accent" size={28}/>; })()}
              <h3 className="mt-5 text-lg font-bold text-ink">{zh?titleZh:titleEn}</h3>
              <p className="mt-3 text-sm leading-6 text-muted">{zh?descriptionZh:descriptionEn}</p>
            </article>)}
          </div>
        </div>
      </section>
    </main>
  </>;
}
