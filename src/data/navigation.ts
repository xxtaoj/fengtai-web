export const navigation = [
  {to:'/', zh:'首页', en:'Home'}, {to:'/news', zh:'新闻', en:'News'}, {to:'/export', zh:'外贸', en:'Export'},
  {to:'/domestic', zh:'内销', en:'Domestic Sales'}, {to:'/orders', zh:'订单', en:'Orders'}, {to:'/contact', zh:'联系我们', en:'Contact Us'}
];

export type CapsuleMenuItem = {
  href: string;
  labelZh: string;
  labelEn: string;
  eyebrowZh: string;
  eyebrowEn: string;
};

export const capsuleMenuItems: CapsuleMenuItem[] = [
  { href: '/#features', labelZh: '功能展示', labelEn: 'Features', eyebrowZh: '制造能力', eyebrowEn: 'Capabilities' },
  { href: '/#about', labelZh: '关于工厂', labelEn: 'About', eyebrowZh: '企业介绍', eyebrowEn: 'Company' },
  { href: '/orders#faq', labelZh: '常见问题', labelEn: 'FAQ', eyebrowZh: '采购帮助', eyebrowEn: 'Buyer Help' },
  { href: '/news', labelZh: '新闻动态', labelEn: 'News', eyebrowZh: '最新资讯', eyebrowEn: 'Updates' },
  { href: '/export', labelZh: '外贸服务', labelEn: 'Export', eyebrowZh: '国际业务', eyebrowEn: 'Global Business' },
  { href: '/contact', labelZh: '联系我们', labelEn: 'Contact', eyebrowZh: '业务对接', eyebrowEn: 'Get in Touch' },
];
