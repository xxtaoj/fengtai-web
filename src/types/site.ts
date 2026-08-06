import type { Catalog } from './catalog';
import type { NewsArticle } from './news';

export type LocalizedPair = [string, string];

export type NavigationLeaf = {
  href: string;
  zh: string;
  en: string;
  children?: NavigationLeaf[];
};

export type NavigationEntry = {
  to: string;
  zh: string;
  en: string;
  eyebrowZh: string;
  eyebrowEn: string;
  children?: NavigationLeaf[];
};

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
};

export type CompanyContent = {
  logo: string;
  chineseName: string;
  englishName: string;
  brandName: string;
  mainProducts: string;
  mainProductsEn: string;
  establishedYear: string;
  establishedYearEn: string;
  location: string;
  locationEn: string;
  address: string;
  headOfficeName: string;
  headOfficeAddress: string;
  xinjiangFactoryName: string;
  xinjiangFactoryAddress: string;
  ningxiaFactoryName: string;
  ningxiaFactoryAddress: string;
  factoryArea: string;
  factoryAreaEn: string;
  employeeCount: string;
  employeeCountEn: string;
  monthlyCapacity: string;
  monthlyCapacityEn: string;
  exportMarkets: string;
  exportMarketsEn: string;
  domesticMarkets: string;
  domesticMarketsEn: string;
  certifications: string[];
  moq: string;
  leadTime: string;
  contactPerson: string;
  contactTitle: string;
  exportContact: string;
  domesticContact: string;
  phone: string;
  whatsapp: string;
  socialLinks: {
    whatsapp: string;
    facebook: string;
    linkedin: string;
    xiaohongshu: string;
    wechatQr: string;
  };
  wechat: string;
  email: string;
  businessHours: string;
  businessHoursEn: string;
  exportPort: string;
  exportPortEn: string;
  incoterms: string;
  payment: string;
  paymentEn: string;
  moqEn: string;
  leadTimeEn: string;
};

export type SiteContent = {
  company: CompanyContent;
  navigation: NavigationEntry[];
  news: NewsArticle[];
  features: FeatureShowcaseItem[];
  exportSteps: LocalizedPair[];
  marketRegions: string[];
  domesticSteps: LocalizedPair[];
  faqs: LocalizedPair[];
  copy: Record<string, unknown>;
  catalog: Catalog;
};
