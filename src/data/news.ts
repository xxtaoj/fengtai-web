import type { NewsArticle } from '../types/news';
const categories = [['company','公司新闻','Company News'],['factory','工厂动态','Factory Updates'],['product','产品资讯','Product Updates'],['industry','行业资讯','Industry News'],['exhibition','展会信息','Exhibition News'],['export','外贸资讯','Export News']];
export const news: NewsArticle[] = categories.map((c,i)=>({
  id:i+1, slug:`news-${String(i+1).padStart(2,'0')}`, category:c[0], categoryZh:c[1], categoryEn:c[2], date:'[发布日期]', image:`/images/news/news-${String(i+1).padStart(2,'0')}.jpg`,
  titleZh:`[新闻标题 ${i+1}]`, titleEn:`[News Article Title ${i+1}]`, summaryZh:'[请在此填写新闻摘要。内容发布前请替换此占位信息。]', summaryEn:'[Add the news summary here. Replace this placeholder before publishing.]',
  contentZh:['[新闻正文第一段，请替换。]','[新闻正文第二段，请替换。]'], contentEn:['[News article paragraph one — replace before publishing.]','[News article paragraph two — replace before publishing.]']
}));
