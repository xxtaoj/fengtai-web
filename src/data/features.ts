export type FeatureShowcaseItem = {
  id: string;
  titleZh: string;
  titleEn: string;
  descriptionZh: string;
  descriptionEn: string;
  video: string;
  poster: string;
};

export const featureShowcaseItems: FeatureShowcaseItem[] = [
  {
    id: 'production-visibility',
    titleZh: '常规在机现货',
    titleEn: 'Regular Running Stock',
    descriptionZh: '围绕床品面料、服装面料等常规方向整理现货与在机规格，便于采购商快速看样和报价。',
    descriptionEn: 'Organize running and in-stock specs for bedding and apparel fabrics so buyers can sample and quote faster.',
    video: '/videos/factory-hero.mp4',
    poster: '/images/hero-poster.jpg',
  },
  {
    id: 'factory-tour',
    titleZh: '来样定织评估',
    titleEn: 'Custom Weaving Evaluation',
    descriptionZh: '根据客户来样、成分比例、组织结构、手感和用途，评估混纺或交织面料的打样路径。',
    descriptionEn: 'Evaluate blended or interwoven sampling paths by buyer samples, composition, structure, hand-feel, and application.',
    video: '/videos/factory-tour.mp4',
    poster: '/images/factory-interior.jpg',
  },
  {
    id: 'process-control',
    titleZh: '品控、仓储与出货',
    titleEn: 'Quality, Warehouse, and Shipment',
    descriptionZh: '通过样品确认、生产跟进、出货前检查和包装沟通，支持海外采购订单稳定推进。',
    descriptionEn: 'Support overseas orders through sample confirmation, production follow-up, pre-shipment checks, and packing communication.',
    video: '/videos/production-process.mp4',
    poster: '/images/quality-control.jpg',
  },
];
