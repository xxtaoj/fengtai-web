import type { Product } from '../types/product';
export const products: Product[] = Array.from({ length: 6 }, (_, i) => ({
  id:i+1, slug:`product-${String(i+1).padStart(2,'0')}`, image:`/images/products/product-${String(i+1).padStart(2,'0')}.jpg`,
  nameZh:`[产品名称 ${i+1}]`, nameEn:`[Product Name ${i+1}]`, categoryZh:'[产品分类]', categoryEn:'[Product Category]',
  summaryZh:'[请填写产品材质、规格、用途与可定制信息。]', summaryEn:'[Add material, specification, application, and customization details.]'
}));
