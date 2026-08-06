import { z } from 'zod';

const localizedPairSchema = z.tuple([z.string(), z.string()]);

const navigationLeafSchema: z.ZodType<any> = z.lazy(() =>
  z.object({
    href: z.string(),
    zh: z.string(),
    en: z.string(),
    children: z.array(navigationLeafSchema).optional(),
  }),
);

const navigationEntrySchema = z.object({
  to: z.string(),
  zh: z.string(),
  en: z.string(),
  eyebrowZh: z.string(),
  eyebrowEn: z.string(),
  children: z.array(navigationLeafSchema).optional(),
});

const featureSchema = z.object({
  id: z.string(),
  tag: z.enum(['STOCK', 'CUSTOM', 'DELIVERY']),
  navTitleZh: z.string(),
  navTitleEn: z.string(),
  titleZh: z.string(),
  titleEn: z.string(),
  descriptionZh: z.string(),
  descriptionEn: z.string(),
  video: z.string().optional(),
  poster: z.string(),
});

const companySchema = z.object({
  logo: z.string(),
  chineseName: z.string(),
  englishName: z.string(),
  brandName: z.string(),
  mainProducts: z.string(),
  mainProductsEn: z.string(),
  establishedYear: z.string(),
  establishedYearEn: z.string(),
  location: z.string(),
  locationEn: z.string(),
  address: z.string(),
  headOfficeName: z.string(),
  headOfficeAddress: z.string(),
  xinjiangFactoryName: z.string(),
  xinjiangFactoryAddress: z.string(),
  ningxiaFactoryName: z.string(),
  ningxiaFactoryAddress: z.string(),
  factoryArea: z.string(),
  factoryAreaEn: z.string(),
  employeeCount: z.string(),
  employeeCountEn: z.string(),
  monthlyCapacity: z.string(),
  monthlyCapacityEn: z.string(),
  exportMarkets: z.string(),
  exportMarketsEn: z.string(),
  domesticMarkets: z.string(),
  domesticMarketsEn: z.string(),
  certifications: z.array(z.string()),
  moq: z.string(),
  leadTime: z.string(),
  contactPerson: z.string(),
  contactTitle: z.string(),
  exportContact: z.string(),
  domesticContact: z.string(),
  phone: z.string(),
  whatsapp: z.string(),
  socialLinks: z.object({
    whatsapp: z.string(),
    facebook: z.string(),
    linkedin: z.string(),
    xiaohongshu: z.string(),
    wechatQr: z.string(),
  }),
  wechat: z.string(),
  email: z.string(),
  businessHours: z.string(),
  businessHoursEn: z.string(),
  exportPort: z.string(),
  exportPortEn: z.string(),
  incoterms: z.string(),
  payment: z.string(),
  paymentEn: z.string(),
  moqEn: z.string(),
  leadTimeEn: z.string(),
});

const productSpecificationSchema = z.object({
  id: z.string(),
  labelZh: z.string(),
  labelEn: z.string(),
  valueZh: z.string(),
  valueEn: z.string(),
});

const beddingSpecificationSchema = z.object({
  labelZh: z.string(),
  labelEn: z.string(),
  valueZh: z.string(),
  valueEn: z.string(),
});

const productSchema = z.object({
  id: z.number(),
  slug: z.string(),
  image: z.string(),
  group: z.enum(['ready-stock', 'custom-weaving']),
  subcategory: z.string(),
  nameZh: z.string(),
  nameEn: z.string(),
  categoryZh: z.string(),
  categoryEn: z.string(),
  summaryZh: z.string(),
  summaryEn: z.string(),
  specsZh: z.array(z.string()),
  specsEn: z.array(z.string()),
  gallery: z.array(z.string()).optional(),
  specifications: z.array(productSpecificationSchema).optional(),
  beddingSpecifications: z.array(beddingSpecificationSchema).optional(),
});

const categorySchema = z.object({
  id: z.string(),
  group: z.enum(['ready-stock', 'custom-weaving']),
  titleZh: z.string(),
  titleEn: z.string(),
  descriptionZh: z.string(),
  descriptionEn: z.string(),
});

const newsSchema = z.object({
  id: z.number(),
  slug: z.string(),
  category: z.string(),
  categoryZh: z.string(),
  categoryEn: z.string(),
  date: z.string(),
  image: z.string(),
  titleZh: z.string(),
  titleEn: z.string(),
  summaryZh: z.string(),
  summaryEn: z.string(),
  contentZh: z.array(z.string()),
  contentEn: z.array(z.string()),
  location: z.object({ zh: z.string(), en: z.string() }).optional(),
  participants: z.object({ zh: z.string(), en: z.string() }).optional(),
  relatedProducts: z.object({ zh: z.string(), en: z.string() }).optional(),
  topics: z.object({ zh: z.string(), en: z.string() }).optional(),
  followUp: z.object({ zh: z.string(), en: z.string() }).optional(),
  gallery: z.array(z.string()).optional(),
});

export const siteSchema = z.object({
  company: companySchema,
  navigation: z.array(navigationEntrySchema),
  news: z.array(newsSchema),
  features: z.array(featureSchema),
  exportSteps: z.array(localizedPairSchema),
  marketRegions: z.array(z.string()),
  domesticSteps: z.array(localizedPairSchema),
  faqs: z.array(localizedPairSchema),
  copy: z.record(z.string(), z.unknown()),
  catalog: z.object({
    products: z.array(productSchema),
    categories: z.array(categorySchema),
  }),
});

export const mediaSchema = z.object({
  url: z.string(),
  kind: z.enum(['image', 'video', 'file']),
  name: z.string(),
  originalName: z.string(),
  size: z.number(),
  updatedAt: z.string(),
});

export type SiteRecord = z.infer<typeof siteSchema>;
