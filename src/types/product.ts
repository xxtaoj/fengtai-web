export type ProductGroup = 'ready-stock' | 'custom-weaving';
export type ProductSubcategory = 'bedding-fabric' | 'apparel-fabric' | 'blended-fabric' | 'interwoven-fabric';

export type Product = {
  id: number;
  slug: string;
  image: string;
  group: ProductGroup;
  subcategory: ProductSubcategory;
  nameZh: string;
  nameEn: string;
  categoryZh: string;
  categoryEn: string;
  summaryZh: string;
  summaryEn: string;
  specsZh: string[];
  specsEn: string[];
};
