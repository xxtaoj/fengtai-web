import { useState } from 'react';
import { ArrowUpRight } from 'lucide-react';
import { useLanguage } from '../i18n/useLanguage';
import { LocalImage } from './Media';

type Certification = {
  id: string;
  standard: string;
  nameZh: string;
  nameEn: string;
  holderZh: string;
  holderEn: string;
  registration: string;
  scopeZh: string;
  scopeEn: string;
  validityZh: string;
  validityEn: string;
  issuerZh: string;
  issuerEn: string;
  pdf: string;
  pdfZh: string;
  pdfEn: string;
  zhPage: number;
  enPage: number;
  imageZh: string;
  imageEn: string;
};

const certifications: Certification[] = [
  {
    id: 'iso-9001',
    standard: 'ISO 9001:2015',
    nameZh: '质量管理体系认证',
    nameEn: 'Quality Management System',
    holderZh: '宁夏丰泰永晟纺织科技有限公司',
    holderEn: 'Ningxia Fengtai Yongsheng Textile Technology Co., Ltd.',
    registration: '02126Q00540R001',
    scopeZh: '棉本色布的织造加工',
    scopeEn: 'Weaving and processing of cotton natural color cloth',
    validityZh: '2026 年 5 月 7 日至 2029 年 5 月 6 日',
    validityEn: '7 May 2026 - 6 May 2029',
    issuerZh: '华夏认证中心有限公司',
    issuerEn: 'Huaxia Certification Center, Inc.',
    pdf: '/certificates/iso-management-systems.pdf',
    pdfZh: '/certificates/iso-9001-zh.pdf',
    pdfEn: '/certificates/iso-9001-en.pdf',
    zhPage: 1,
    enPage: 2,
    imageZh: '/certificates/iso-9001-zh.jpg',
    imageEn: '/certificates/iso-9001-en.jpg',
  },
  {
    id: 'iso-14001',
    standard: 'ISO 14001:2015',
    nameZh: '环境管理体系认证',
    nameEn: 'Environmental Management System',
    holderZh: '宁夏丰泰永晟纺织科技有限公司',
    holderEn: 'Ningxia Fengtai Yongsheng Textile Technology Co., Ltd.',
    registration: '02126E00258R001',
    scopeZh: '棉本色布的织造加工及相关管理活动',
    scopeEn: 'Weaving and processing of cotton natural color cloth and related management activities',
    validityZh: '2026 年 5 月 7 日至 2029 年 5 月 6 日',
    validityEn: '7 May 2026 - 6 May 2029',
    issuerZh: '华夏认证中心有限公司',
    issuerEn: 'Huaxia Certification Center, Inc.',
    pdf: '/certificates/iso-management-systems.pdf',
    pdfZh: '/certificates/iso-14001-zh.pdf',
    pdfEn: '/certificates/iso-14001-en.pdf',
    zhPage: 5,
    enPage: 6,
    imageZh: '/certificates/iso-14001-zh.jpg',
    imageEn: '/certificates/iso-14001-en.jpg',
  },
  {
    id: 'iso-45001',
    standard: 'ISO 45001:2018',
    nameZh: '职业健康安全管理体系认证',
    nameEn: 'Occupational Health & Safety Management System',
    holderZh: '宁夏丰泰永晟纺织科技有限公司',
    holderEn: 'Ningxia Fengtai Yongsheng Textile Technology Co., Ltd.',
    registration: '02126S00241R001',
    scopeZh: '棉本色布的织造加工及相关管理活动',
    scopeEn: 'Weaving and processing of cotton natural color cloth and related management activities',
    validityZh: '2026 年 5 月 7 日至 2029 年 5 月 6 日',
    validityEn: '7 May 2026 - 6 May 2029',
    issuerZh: '华夏认证中心有限公司',
    issuerEn: 'Huaxia Certification Center, Inc.',
    pdf: '/certificates/iso-management-systems.pdf',
    pdfZh: '/certificates/iso-45001-zh.pdf',
    pdfEn: '/certificates/iso-45001-en.pdf',
    zhPage: 3,
    enPage: 4,
    imageZh: '/certificates/iso-45001-zh.jpg',
    imageEn: '/certificates/iso-45001-en.jpg',
  },
  {
    id: 'oeko-tex',
    standard: 'OEKO-TEX® STANDARD 100',
    nameZh: '纺织品有害物质检验认证',
    nameEn: 'Tested for Harmful Substances',
    holderZh: '丰泰永晟国际贸易有限公司',
    holderEn: 'Fonter Yosh International Trading Co., Ltd.',
    registration: 'BJ015 275597',
    scopeZh: '适用于证书列明的棉、棉氨、涤棉、涤粘及相关混纺机织面料；产品级别 I（婴幼儿用品）',
    scopeEn: 'Specified cotton, cotton/spandex, polyester/cotton, polyester/viscose and related woven fabrics; Product Class I (baby articles)',
    validityZh: '有效期至 2026 年 12 月 31 日',
    validityEn: 'Valid until 31 December 2026',
    issuerZh: 'TESTEX AG 瑞士纺织检验机构',
    issuerEn: 'TESTEX AG, Swiss Textile Testing Institute',
    pdf: '/certificates/oeko-tex-standard-100.pdf',
    pdfZh: '/certificates/oeko-tex-zh.pdf',
    pdfEn: '/certificates/oeko-tex-en.pdf',
    zhPage: 2,
    enPage: 1,
    imageZh: '/certificates/oeko-tex-zh.jpg',
    imageEn: '/certificates/oeko-tex-en.jpg',
  },
];

function CertificatePreview({ image, label, href, alt }: { image: string; label: string; href: string; alt: string }) {
  return <a href={href} target="_blank" rel="noreferrer" className="group block min-w-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-4">
    <span className="mb-2 flex items-center justify-between gap-2 text-[11px] font-bold uppercase tracking-[.16em] text-body">
      {label}<ArrowUpRight size={14} className="shrink-0 text-accent transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
    </span>
    <div className="overflow-hidden border border-slate-300 bg-white shadow-[0_18px_35px_-25px_rgba(15,23,42,.45)] transition duration-300 group-hover:-translate-y-1 group-hover:shadow-lift">
      <LocalImage src={image} alt={alt} loading="lazy" className="aspect-[210/297] w-full object-cover object-top" />
    </div>
  </a>;
}

export function InternationalCertifications() {
  const { language } = useLanguage();
  const zh = language === 'zh';
  const [activeId, setActiveId] = useState(certifications[0].id);
  const active = certifications.find((item) => item.id === activeId) ?? certifications[0];

  return <section id="certificates" className="section-pad scroll-mt-28 bg-white">
    <div className="container-shell grid gap-12 lg:grid-cols-[minmax(0,1.08fr)_minmax(23rem,.92fr)] lg:items-start lg:gap-16">
      <div className="lg:sticky lg:top-28">
        <div className="flex items-end justify-between gap-5 border-b border-slate-300 pb-4">
          <div>
            <p className="text-xs font-bold tracking-[.16em] text-accent">{zh ? '证书档案' : 'CERTIFICATE ARCHIVE'}</p>
            <p className="mt-2 text-sm font-semibold text-ink">{active.standard} · {zh ? active.nameZh : active.nameEn}</p>
          </div>
          <span className="shrink-0 font-mono text-xs text-muted">{zh ? '4 项认证' : '4 RECORDS'}</span>
        </div>

        <div id="certificate-panel" aria-live="polite" className="mt-5 bg-[#EEF1F3] p-4 sm:p-7">
          <div key={active.id} className="grid grid-cols-2 items-start gap-3 sm:gap-6">
            <CertificatePreview image={active.imageZh} label={zh ? '中文原件' : 'Chinese original'} href={active.pdfZh} alt={`${active.standard} 中文证书`} />
            <CertificatePreview image={active.imageEn} label={zh ? '英文原件' : 'English original'} href={active.pdfEn} alt={`${active.standard} English certificate`} />
          </div>
          <a href={`${active.pdf}#page=${zh ? active.zhPage : active.enPage}`} target="_blank" rel="noreferrer" className="mt-6 inline-flex min-h-11 items-center gap-2 border-b border-ink pb-1 text-sm font-bold text-ink transition-colors hover:border-accent hover:text-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-4 focus-visible:ring-offset-[#EEF1F3]">
            {zh ? '打开完整 PDF 原件' : 'Open the complete PDF'}<ArrowUpRight size={16} />
          </a>
        </div>
      </div>

      <div>
        <p className="text-sm font-bold text-accent">{zh ? '国际认证' : 'International certifications'}</p>
        <h2 className="mt-4 text-3xl font-bold leading-tight tracking-tight text-ink sm:text-4xl lg:text-[2.75rem]">{zh ? '管理体系与产品安全认证' : 'Management systems and product safety certificates'}</h2>
        <p className="mt-5 max-w-xl text-base leading-8 text-muted">{zh ? '以下信息按证书原件整理。选择认证名称，可查看对应的中英文证书、持证主体、认证范围和有效期。' : 'The information below is taken from the original certificates. Select a standard to review its Chinese and English documents, certificate holder, certified scope, and validity.'}</p>

        <div aria-label={zh ? '选择认证资料' : 'Select a certification record'} className="mt-10 border-t border-slate-300">
          {certifications.map((item) => {
            const selected = item.id === active.id;
            return <button
              key={item.id}
              type="button"
              aria-pressed={selected}
              aria-controls="certificate-panel"
              onClick={() => setActiveId(item.id)}
              className="group block min-h-20 w-full border-b border-slate-300 py-4 text-left transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-accent"
            >
              <span>
                <strong className={`block font-mono text-base tracking-tight transition-colors sm:text-lg ${selected ? 'text-accent' : 'text-body group-hover:text-ink'}`}>{item.standard}</strong>
                <span className="mt-1 block text-sm leading-5 text-muted">{zh ? item.nameZh : item.nameEn}</span>
              </span>
            </button>;
          })}
        </div>

        <dl className="mt-9 border-y border-slate-300">
          {[
            [zh ? '证书持有人' : 'Certificate holder', zh ? active.holderZh : active.holderEn],
            [zh ? '证书编号' : 'Certificate number', active.registration],
            [zh ? '认证范围' : 'Certified scope', zh ? active.scopeZh : active.scopeEn],
            [zh ? '有效期' : 'Validity', zh ? active.validityZh : active.validityEn],
            [zh ? '发证机构' : 'Certification body', zh ? active.issuerZh : active.issuerEn],
          ].map(([label, value]) => <div key={label} className="grid gap-2 border-b border-slate-200 py-4 last:border-b-0 sm:grid-cols-[7.5rem_1fr] sm:gap-5">
            <dt className="text-xs font-bold uppercase tracking-[.08em] text-muted">{label}</dt>
            <dd className={`text-sm leading-6 text-ink ${label === (zh ? '证书编号' : 'Certificate number') ? 'font-mono' : ''}`}>{value}</dd>
          </div>)}
        </dl>
        <p className="mt-5 text-xs leading-5 text-muted">{zh ? '证书主体、范围和有效期以 PDF 原件为准。' : 'Certificate holder, scope, and validity are subject to the original PDF.'}</p>
      </div>
    </div>
  </section>;
}
