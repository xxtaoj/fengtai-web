export type NavigationChild = {
  href: string;
  zh: string;
  en: string;
  children?: NavigationChild[];
};

export type NavigationItem = {
  to: string;
  zh: string;
  en: string;
  eyebrowZh: string;
  eyebrowEn: string;
  children?: NavigationChild[];
};

export const navigation: NavigationItem[] = [
  { to: '/', zh: '首页', en: 'Home', eyebrowZh: '网站入口', eyebrowEn: 'Entry' },
  {
    to: '/company',
    zh: '公司简介',
    en: 'Company Profile',
    eyebrowZh: '企业介绍',
    eyebrowEn: 'About',
    children: [
      { href: '/company#overview', zh: '企业概况', en: 'Company Overview' },
      { href: '/company#history', zh: '发展历程', en: 'Development History' },
      { href: '/company#certificates', zh: '资质与荣誉证书', en: 'Certificates & Honors' },
      { href: '/company#factory-sites', zh: '生产工厂实景', en: 'Factory Sites' },
      { href: '/company#team', zh: '组织架构或核心业务团队', en: 'Core Business Team' },
    ],
  },
  {
    to: '/activity',
    zh: '公司活动',
    en: 'Company Activities',
    eyebrowZh: '实力背书',
    eyebrowEn: 'Proof',
    children: [
      { href: '/activity#exhibitions', zh: '国内外展会参展动态', en: 'Trade Shows' },
      { href: '/activity#visits', zh: '海内外客户来访考察纪实', en: 'Customer Visits' },
      { href: '/activity#news-insights', zh: '企业新闻与行业资讯', en: 'Company & Industry News' },
      { href: '/activity#culture', zh: '内部团建、业务培训等企业文化动态', en: 'Culture & Training' },
    ],
  },
  {
    to: '/products',
    zh: '公司产品',
    en: 'Products',
    eyebrowZh: '面料分类',
    eyebrowEn: 'Fabrics',
    children: [
      {
        href: '/products#ready-stock',
        zh: '常规在机现货产品',
        en: 'Regular In-stock Products',
        children: [
          { href: '/products#bedding-fabric', zh: '床品面料', en: 'Bedding Fabric' },
          { href: '/products#apparel-fabric', zh: '服装面料', en: 'Apparel Fabric' },
        ],
      },
      {
        href: '/products#custom-weaving',
        zh: '定制织造产品',
        en: 'Custom Weaving Products',
        children: [
          { href: '/products#blended-fabric', zh: '混纺面料', en: 'Blended Fabric' },
          { href: '/products#interwoven-fabric', zh: '交织面料', en: 'Interwoven Fabric' },
        ],
      },
    ],
  },
  {
    to: '/contact',
    zh: '联系我们',
    en: 'Contact Us',
    eyebrowZh: '询盘寄样',
    eyebrowEn: 'Inquiry',
    children: [
      { href: '/contact#addresses', zh: '办公及工厂详细地址', en: 'Office & Factory Addresses' },
      { href: '/contact#channels', zh: '客服联络方式', en: 'Service Contacts' },
      { href: '/contact#inquiry', zh: '在线业务询盘格式表', en: 'Online Inquiry Form' },
    ],
  },
];

export type CapsuleMenuItem = {
  href: string;
  labelZh: string;
  labelEn: string;
  eyebrowZh: string;
  eyebrowEn: string;
  children?: NavigationChild[];
};

export const capsuleMenuItems: CapsuleMenuItem[] = navigation.map(item => ({
  href: item.to,
  labelZh: item.zh,
  labelEn: item.en,
  eyebrowZh: item.eyebrowZh,
  eyebrowEn: item.eyebrowEn,
  children: item.children,
}));
