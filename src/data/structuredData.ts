/**
 * JSON-LD templates are intentionally not injected into the live page while
 * company, product, and article values are placeholders. Enable only after
 * every required value has been verified to avoid inaccurate structured data.
 */
export const structuredDataTemplates = {
  organization: { '@context':'https://schema.org', '@type':'Organization', name:'[真实企业名称]', url:'[正式网站 URL]', logo:'[正式 Logo URL]' },
  product: { '@context':'https://schema.org', '@type':'Product', name:'[真实产品名称]', image:'[真实产品图片 URL]', description:'[真实产品描述]' },
  newsArticle: { '@context':'https://schema.org', '@type':'NewsArticle', headline:'[真实新闻标题]', datePublished:'[ISO 日期]', image:'[真实新闻图片 URL]' },
} as const;
