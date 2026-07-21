export type LocalizedText = {
  zh: string;
  en: string;
};

export type NewsArticle = {
  id: number;
  slug: string;
  category: string;
  categoryZh: string;
  categoryEn: string;
  date: string;
  image: string;
  titleZh: string;
  titleEn: string;
  summaryZh: string;
  summaryEn: string;
  contentZh: string[];
  contentEn: string[];
  location?: LocalizedText;
  participants?: LocalizedText;
  relatedProducts?: LocalizedText;
  topics?: LocalizedText;
  followUp?: LocalizedText;
  gallery?: string[];
};
