export type ProductGroup = 'ready-stock' | 'custom-weaving';
export type ProductSubcategory = string;

export type ProductSpecification = {
  id: 'composition' | 'weight' | 'width' | 'weave' | 'finish' | 'application' | 'supply-type' | 'color-pattern';
  labelZh: string;
  labelEn: string;
  valueZh: string;
  valueEn: string;
};

export type BeddingSpecification = {
  labelZh: string;
  labelEn: string;
  valueZh: string;
  valueEn: string;
};

export type StockSpecification = {
  no: string;
  composition: string;
  yarnCount: string;
  density: string;
  width: string;
  weave: string;
  pkg: string;
};

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
  gallery?: string[];
  specifications?: ProductSpecification[];
  beddingSpecifications?: BeddingSpecification[];
  stockSpecifications?: StockSpecification[];
};
