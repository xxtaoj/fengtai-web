export type FeatureShowcaseItem = {
  id: string;
  tag: 'STOCK' | 'CUSTOM' | 'DELIVERY';
  navTitleZh: string;
  navTitleEn: string;
  titleZh: string;
  titleEn: string;
  descriptionZh: string;
  descriptionEn: string;
  video?: string;
  poster: string;
  videoPosition?: string;
  videoZoom?: number;
};

export const featureShowcaseItems: FeatureShowcaseItem[] = [
  {
    id: 'production-visibility',
    tag: 'STOCK',
    navTitleZh: '常规现货与在机面料',
    navTitleEn: 'Available & Running Fabrics',
    titleZh: '常规现货与在机面料',
    titleEn: 'Available & Running Fabrics',
    descriptionZh: '查看床品和服装面料的常规规格，确认现货、在机情况、样品及报价信息。',
    descriptionEn: 'Review available and in-production bedding and apparel fabrics, then confirm samples, specifications, and quotation details.',
    video: '/videos/factory-hero.mp4',
    poster: '/images/hero-poster.jpg',
    videoPosition: '50% 48%',
    videoZoom: 1.34,
  },
  {
    id: 'factory-tour',
    tag: 'CUSTOM',
    navTitleZh: '来样定织',
    navTitleEn: 'Custom Weaving from Sample',
    titleZh: '按样品评估定织方案',
    titleEn: 'Custom Weaving from Your Sample',
    descriptionZh: '提供实物样品或目标规格，我们将结合成分、组织结构、手感、用途和数量评估打样与生产方案。',
    descriptionEn: 'Send us a fabric sample or target specification. We will review the composition, construction, hand feel, end use, and order quantity.',
    video: '/videos/factory-tour.mp4',
    poster: '/images/factory-interior.jpg',
    videoPosition: '50% 50%',
    videoZoom: 1,
  },
  {
    id: 'process-control',
    tag: 'DELIVERY',
    navTitleZh: '品控与出货',
    navTitleEn: 'Quality & Shipment',
    titleZh: '生产跟进、品控与出货',
    titleEn: 'Quality Checks & Shipment',
    descriptionZh: '从样品确认到生产跟进、出货检查和包装沟通，协助采购订单稳定推进。',
    descriptionEn: 'We follow the order from sample approval through production, pre-shipment checks, packing, and delivery coordination.',
    video: '/videos/production-process.mp4',
    poster: '/images/quality-control.jpg',
    videoPosition: '50% 50%',
    videoZoom: 1,
  },
];
