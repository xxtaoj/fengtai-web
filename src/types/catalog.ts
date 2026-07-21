import type { ProductGroup, Product } from './product';

export type ProductCategory = {
  id: string;
  group: ProductGroup;
  titleZh: string;
  titleEn: string;
  descriptionZh: string;
  descriptionEn: string;
};

export type Catalog = {
  products: Product[];
  categories: ProductCategory[];
};
