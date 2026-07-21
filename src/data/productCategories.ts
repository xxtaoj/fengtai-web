import type { ProductCategory } from '../types/catalog';

export const productCategories: ProductCategory[] = [
  { id: 'bedding-fabric', group: 'ready-stock', titleZh: '床品面料', titleEn: 'Bedding Fabric', descriptionZh: '适配床单、被套、枕套、酒店及家纺渠道采购。', descriptionEn: 'For sheets, duvet covers, pillowcases, hotel, and home textile sourcing.' },
  { id: 'apparel-fabric', group: 'ready-stock', titleZh: '服装面料', titleEn: 'Apparel Fabric', descriptionZh: '适配衬衫、休闲服、制服、工装等服装面料订单。', descriptionEn: 'For shirts, casualwear, uniforms, workwear, and apparel fabric orders.' },
  { id: 'blended-fabric', group: 'custom-weaving', titleZh: '混纺面料', titleEn: 'Blended Fabric', descriptionZh: '按成分比例、手感、用途和样品要求评估定织。', descriptionEn: 'Custom evaluated by blend ratio, hand-feel, application, and buyer samples.' },
  { id: 'interwoven-fabric', group: 'custom-weaving', titleZh: '交织面料', titleEn: 'Interwoven Fabric', descriptionZh: '适合经纬不同原料、组织结构或特殊性能面料开发。', descriptionEn: 'For warp and weft material differences, structures, or special performance development.' },
];
