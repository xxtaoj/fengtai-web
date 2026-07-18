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
    titleZh: '生产现场可视化',
    titleEn: 'Production Visibility',
    descriptionZh: '[请替换为真实功能说明：展示生产环境、关键设备与订单执行过程。]',
    descriptionEn: '[Replace with verified details about facilities, equipment, and order execution.]',
    video: '/videos/factory-hero.mp4',
    poster: '/images/hero-poster.jpg',
  },
  {
    id: 'factory-tour',
    titleZh: '工厂与团队展示',
    titleEn: 'Factory & Team Showcase',
    descriptionZh: '[请替换为真实功能说明：通过厂区参观内容建立对制造基础的直观了解。]',
    descriptionEn: '[Replace with verified details that help buyers understand the manufacturing foundation.]',
    video: '/videos/factory-tour.mp4',
    poster: '/images/factory-interior.jpg',
  },
  {
    id: 'process-control',
    titleZh: '生产流程与品质控制',
    titleEn: 'Process & Quality Control',
    descriptionZh: '[请替换为真实功能说明：说明生产节点、检验方式与交付前的质量管理。]',
    descriptionEn: '[Replace with verified production milestones, inspection methods, and quality controls.]',
    video: '/videos/production-process.mp4',
    poster: '/images/quality-control.jpg',
  },
];
