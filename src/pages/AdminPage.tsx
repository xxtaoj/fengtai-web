import { useEffect, useMemo, useState, type ChangeEvent, type DragEvent, type FormEvent, type PointerEvent as ReactPointerEvent, type ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { Activity, BarChart3, Check, Database, Download, ExternalLink, FileText, GripVertical, ImagePlus, Inbox, LayoutDashboard, LogOut, RotateCcw, Save, Shield, UserPlus, Users } from 'lucide-react';
import { useSite } from '../context/SiteContext';
import { staticMediaFiles } from '../data/staticMediaManifest';
import {
  createUser,
  listAdminSessions,
  listInquiries,
  listOperationLogs,
  listRequestLogs,
  listUsers,
  loadAnalyticsSummary,
  loadPageAnalytics,
  loadProductAnalytics,
  loginAdmin,
  logoutAdmin,
  revokeAdminSession,
  updateInquiry,
  updateUser,
  type AdminLog,
  type AdminRole,
  type AdminSessionRecord,
  type AdminUser,
  type AnalyticsSummary,
  type InquiryRecord,
  type InquiryStatus,
  type PageAnalytics,
  type Permission,
  type ProductAnalytics
} from '../lib/siteApi';
import type { BeddingSpecification, Product, ProductSpecification, StockSpecification } from '../types/product';
import type { ProductCategory } from '../types/catalog';
import type { FeatureShowcaseItem, SiteContent } from '../types/site';
import type { NewsArticle, NewsContentBlock } from '../types/news';

type Tab = 'overview' | 'content' | 'products' | 'inquiries' | 'media' | 'users' | 'analytics' | 'logs' | 'data';
const defaultPassword = 'admin123';
const defaultUsername = 'admin';
const roleLabels: Record<AdminRole, string> = {
  owner: '站主',
  admin: '管理员',
  editor: '内容编辑',
  viewer: '只读查看'
};
const actionLabels: Record<string, string> = {
  login: '登录',
  logout: '退出',
  create: '创建',
  update: '更新',
  upload: '上传',
  reset: '恢复初始内容'
};
const targetLabels: Record<string, string> = {
  auth: '认证',
  user: '用户',
  media: '媒体文件',
  inquiry: '客户询盘',
  'site-content': '整站内容'
};

const inquiryStatusLabels: Record<InquiryStatus, string> = {
  new: '新询盘',
  contacting: '联系中',
  done: '已完成',
  archived: '已归档'
};

const inquiryTypeLabels: Record<string, string> = {
  product: '产品询价',
  sample: '寄送样品',
  'custom-weaving': '来样定织',
  visit: '预约看厂',
  contact: '综合询盘',
  domestic: '内销询盘',
  export: '外贸询盘',
  order: '订单需求'
};

function downloadJson(filename: string, data: unknown) {
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
}

function AdminLogin({ onLogin }: { onLogin: () => Promise<void> }) {
  const [username, setUsername] = useState(defaultUsername);
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function submit(event: FormEvent) {
    event.preventDefault();
    setLoading(true);
    setError('');
    try {
      await loginAdmin(username, password);
      await onLogin();
    } catch {
      setError('账号或密码不正确');
    } finally {
      setLoading(false);
    }
  }

  return <main className="flex min-h-screen items-center justify-center bg-ink px-5 py-12">
    <form onSubmit={submit} className="w-full max-w-md border border-white/10 bg-white p-8 shadow-2xl">
      <div className="flex items-center gap-3 text-ink">
        <div className="flex size-11 items-center justify-center bg-accent text-white"><LayoutDashboard size={22}/></div>
        <div>
          <p className="text-xs font-bold uppercase tracking-[.18em] text-accent">Fengtai CMS</p>
          <h1 className="text-2xl font-bold">后台管理入口</h1>
        </div>
      </div>
      <p className="mt-8 text-sm leading-6 text-muted">登录后可编辑内容、管理用户、查看日志和商品访问量。</p>
      <label className="mt-7 block text-sm font-semibold text-ink">
        管理员账号
        <input autoFocus type="text" value={username} onChange={event=>setUsername(event.target.value)} className="mt-2 min-h-12 w-full border border-line px-4 py-3 outline-none focus:border-accent focus:ring-2 focus:ring-orange-100" placeholder={defaultUsername}/>
      </label>
      <label className="mt-5 block text-sm font-semibold text-ink">
        管理员密码
        <input type="password" value={password} onChange={event=>setPassword(event.target.value)} className="mt-2 min-h-12 w-full border border-line px-4 py-3 outline-none focus:border-accent focus:ring-2 focus:ring-orange-100" placeholder={defaultPassword}/>
      </label>
      {error&&<p className="mt-3 text-sm text-red-700" role="alert">{error}</p>}
      <button type="submit" disabled={loading} className="mt-6 inline-flex min-h-12 w-full items-center justify-center gap-2 bg-accent px-5 py-3 font-bold text-white hover:bg-accent-hover disabled:opacity-60">
        <Check size={18}/>{loading?'登录中':'进入后台'}
      </button>
      <Link to="/" className="mt-5 inline-flex text-sm font-semibold text-muted hover:text-accent">返回网站首页</Link>
    </form>
  </main>;
}

function Stat({ label, value }: { label: string; value: number | string }) {
  return <div className="border border-slate-200 bg-white p-5">
    <p className="text-xs font-bold uppercase tracking-[.16em] text-muted">{label}</p>
    <p className="mt-3 text-3xl font-bold text-ink">{value}</p>
  </div>;
}

function MediaItem({ item }: { item: { url: string; kind: string; name: string; updatedAt: string; source?: string } }) {
  return <article className="border border-slate-200 bg-white p-4">
    {item.kind === 'image'
      ? <img src={item.url} alt={item.name} className="aspect-video w-full object-cover"/>
      : item.kind === 'video'
        ? <video src={item.url} className="aspect-video w-full object-cover" controls muted/>
        : <div className="flex aspect-video items-center justify-center bg-slate-100 text-sm font-semibold text-muted">{item.kind.toUpperCase()}</div>}
    <div className="mt-3">
      <p className="truncate text-sm font-semibold text-ink">{item.name}</p>
      <p className="mt-1 text-xs text-muted">{item.updatedAt}</p>
      {item.source&&<p className="mt-1 line-clamp-2 text-xs leading-5 text-slate-400">{item.source}</p>}
      <a className="mt-2 inline-flex text-xs font-semibold text-accent" href={item.url} target="_blank" rel="noreferrer">打开文件</a>
    </div>
  </article>;
}

function TextLibraryItem({ item }: { item: SiteTextItem }) {
  return <article className="border border-slate-200 bg-white p-4">
    <div className="flex items-start justify-between gap-3">
      <div>
        <p className="text-xs font-bold uppercase tracking-[.12em] text-muted">{item.label}</p>
        <p className="mt-1 line-clamp-2 text-xs leading-5 text-slate-400">{item.source}</p>
      </div>
      <button type="button" onClick={() => void navigator.clipboard?.writeText(item.value)} className="shrink-0 border border-line px-3 py-2 text-xs font-bold text-ink hover:border-accent hover:text-accent">复制</button>
    </div>
    <p className="mt-3 line-clamp-5 text-sm leading-6 text-body">{item.value}</p>
  </article>;
}

function can(permissions: Permission[], permission: Permission) {
  return permissions.includes(permission);
}

function cloneProduct(product: Product): Product {
  return ensureProductSpecifications(JSON.parse(JSON.stringify(product)) as Product);
}

function slugify(value: string) {
  return value.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') || `product-${Date.now()}`;
}

function nextProductId(products: Product[]) {
  return products.reduce((max, product) => Math.max(max, product.id), 0) + 1;
}

function createBlankProduct(id: number): Product {
  return {
    id,
    slug: `product-${id}`,
    image: '/images/products/fabric-sample.jpg',
    group: 'ready-stock',
    subcategory: 'bedding-fabric',
    nameZh: '新产品',
    nameEn: `New Product ${id}`,
    categoryZh: '床品面料',
    categoryEn: 'Bedding fabric',
    summaryZh: '请在这里填写产品中文简介。',
    summaryEn: 'Please enter the English product summary here.',
    specsZh: [],
    specsEn: [],
    gallery: [],
    specifications: [
      { id: 'composition', labelZh: '成分', labelEn: 'Composition', valueZh: '', valueEn: '' },
      { id: 'weight', labelZh: '克重', labelEn: 'Weight', valueZh: '', valueEn: '' },
      { id: 'width', labelZh: '门幅', labelEn: 'Width', valueZh: '', valueEn: '' },
      { id: 'application', labelZh: '适用用途', labelEn: 'Application', valueZh: '', valueEn: '' }
    ],
    beddingSpecifications: [
      { labelZh: '成分', labelEn: 'Composition', valueZh: '', valueEn: '' },
      { labelZh: '克重', labelEn: 'Weight', valueZh: '', valueEn: '' },
      { labelZh: '门幅', labelEn: 'Width', valueZh: '', valueEn: '' },
      { labelZh: '适用用途', labelEn: 'Application', valueZh: '', valueEn: '' }
    ],
    stockSpecifications: [createStockSpecification()]
  };
}

function cloneCategory(category: ProductCategory): ProductCategoryDraft {
  return { ...JSON.parse(JSON.stringify(category)) as ProductCategory, originalId: category.id };
}

function categoryLabel(category: ProductCategory) {
  return `${category.group === 'ready-stock' ? '常规在机现货' : '定制织造'} / ${category.titleZh}`;
}

function categoryLabelEn(category: ProductCategory) {
  return `${category.group === 'ready-stock' ? 'Regular In-stock' : 'Custom Weaving'} / ${category.titleEn}`;
}

function isBeddingCategory(category?: ProductCategory | null) {
  if (!category) return false;
  return /床品|bedding/i.test(`${category.id} ${category.titleZh} ${category.titleEn}`);
}

const productSpecificationPresets: Array<{ id: ProductSpecification['id']; labelZh: string; labelEn: string }> = [
  { id: 'composition', labelZh: '成分', labelEn: 'Composition' },
  { id: 'weight', labelZh: '克重', labelEn: 'Weight' },
  { id: 'width', labelZh: '门幅', labelEn: 'Width' },
  { id: 'weave', labelZh: '组织结构', labelEn: 'Weave' },
  { id: 'finish', labelZh: '后整理', labelEn: 'Finish' },
  { id: 'application', labelZh: '适用用途', labelEn: 'Application' },
  { id: 'supply-type', labelZh: '供货方式', labelEn: 'Supply type' },
  { id: 'color-pattern', labelZh: '颜色 / 花型', labelEn: 'Color / pattern' }
];

function createProductSpecification(id: ProductSpecification['id'] = 'composition'): ProductSpecification {
  const preset = productSpecificationPresets.find(item => item.id === id) || productSpecificationPresets[0];
  return { id: preset.id, labelZh: preset.labelZh, labelEn: preset.labelEn, valueZh: '', valueEn: '' };
}

function createBeddingSpecification(): BeddingSpecification {
  return { labelZh: '', labelEn: '', valueZh: '', valueEn: '' };
}

function createStockSpecification(): StockSpecification {
  return { no: '', composition: '', yarnCount: '', density: '', width: '', weave: '', pkg: '' };
}

function splitSpecificationLine(line: string, fallbackLabel: string) {
  const [label, ...rest] = line.split(/[：:]/);
  const value = rest.join(':').trim();
  return value ? { label: label.trim(), value } : { label: fallbackLabel, value: line.trim() };
}

function ensureProductSpecifications(product: Product): Product {
  if (product.specifications?.length) return product;
  const maxRows = Math.max(product.specsZh.length, product.specsEn.length);
  if (!maxRows) return { ...product, specifications: [] };

  return {
    ...product,
    specifications: Array.from({ length: maxRows }).map((_, index) => {
      const zhSpec = splitSpecificationLine(product.specsZh[index] || '', `规格 ${index + 1}`);
      const enSpec = splitSpecificationLine(product.specsEn[index] || '', `Spec ${index + 1}`);
      return {
        id: 'application' as ProductSpecification['id'],
        labelZh: zhSpec.label,
        labelEn: enSpec.label,
        valueZh: zhSpec.value,
        valueEn: enSpec.value
      };
    }).filter(item => item.valueZh || item.valueEn)
  };
}

function ProductEditorField({ label, children }: { label: string; children: ReactNode }) {
  return <label className="block text-sm font-semibold text-ink">
    {label}
    <div className="mt-2">{children}</div>
  </label>;
}

function ProductImageDropzone({ label, value, alt, uploading, mediaLibrary, onFile, onSelect }: { label: string; value: string; alt: string; uploading: boolean; mediaLibrary?: MediaLibraryItem[]; onFile: (file: File) => void | Promise<void>; onSelect: (value: string) => void }) {
  const [dragging, setDragging] = useState(false);

  function acceptFile(file: File | undefined) {
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      window.alert('这里只能上传图片文件');
      return;
    }
    void onFile(file);
  }

  function handleDrop(event: DragEvent<HTMLLabelElement>) {
    event.preventDefault();
    setDragging(false);
    acceptFile(event.dataTransfer.files[0]);
  }

  return <div>
    <label
      onDragEnter={event => { event.preventDefault(); setDragging(true); }}
      onDragOver={event => event.preventDefault()}
      onDragLeave={event => { event.preventDefault(); setDragging(false); }}
      onDrop={handleDrop}
      className={`block cursor-pointer border-2 border-dashed p-3 transition ${dragging ? 'border-accent bg-orange-50' : 'border-slate-300 bg-slate-50 hover:border-accent hover:bg-orange-50/60'}`}
    >
      <p className="mb-2 text-sm font-semibold text-ink">{label}</p>
      {value
        ? <img src={value} alt={alt} className="aspect-video w-full object-cover"/>
        : <div className="flex aspect-video items-center justify-center bg-white text-center text-sm leading-6 text-muted">将图片拖到这里</div>}
      <p className="mt-3 text-center text-xs font-semibold text-muted">{uploading ? '上传中...' : '拖拽本地图片到这里，或点击选择图片'}</p>
      <input type="file" accept="image/*" className="sr-only" onChange={event => { acceptFile(event.target.files?.[0]); event.target.value = ''; }}/>
    </label>
    <MediaLibrarySelect value={value} kind="image" mediaLibrary={mediaLibrary} onChange={onSelect}/>
  </div>;
}

type PathPart = string | number;
type ContentModule = {
  id: string;
  title: string;
  description: string;
  path: PathPart[];
};
type UploadMediaFn = ReturnType<typeof useSite>['uploadMedia'];
type SiteMediaItem = {
  url: string;
  kind: string;
  name: string;
  originalName: string;
  size: number;
  updatedAt: string;
  source?: string;
};
type SiteTextItem = {
  id: string;
  label: string;
  value: string;
  source: string;
};
type MediaLibraryItem = Pick<SiteMediaItem, 'url' | 'kind' | 'name' | 'source'>;
type ProductCategoryDraft = ProductCategory & {
  originalId?: string;
};

const keyLabels: Record<string, string> = {
  about: '关于模块',
  activity: '活动模块',
  address: '地址',
  addresses: '地址列表',
  advantagesEn: '英文优势',
  advantagesZh: '中文优势',
  brandName: '品牌名称',
  businessHours: '营业时间',
  businessHoursEn: '英文营业时间',
  category: '分类 ID',
  categoryEn: '英文分类',
  categoryZh: '中文分类',
  certifications: '认证',
  channels: '联系方式',
  chineseName: '中文公司名',
  company: '公司页面',
  companyIntro: '首页公司简介板块',
  conditionEn: '英文条件',
  conditionZh: '中文条件',
  contact: '联系页面',
  contactPerson: '联系人',
  contactTitle: '联系人职位',
  contentEn: '英文正文',
  contentZh: '中文正文',
  copy: '页面文案',
  date: '日期',
  description: '说明',
  descriptionEn: '英文说明',
  descriptionZh: '中文说明',
  descEn: '英文描述',
  descZh: '中文描述',
  domestic: '国内业务页面',
  domesticContact: '国内联系人',
  domesticMarkets: '国内市场',
  domesticMarketsEn: '英文国内市场',
  email: '邮箱',
  employeeCount: '员工数量',
  employeeCountEn: '英文员工数量',
  englishName: '英文公司名',
  establishedYear: '成立年份',
  establishedYearEn: '英文成立年份',
  export: '国际业务页面',
  exportContact: '外贸联系人',
  exportMarkets: '出口市场',
  exportMarketsEn: '英文出口市场',
  exportPort: '出口港',
  exportPortEn: '英文出口港',
  exportSteps: '出口流程',
  eyebrowEn: '英文眉标',
  eyebrowZh: '中文眉标',
  facebook: 'Facebook 链接',
  factoryArea: '工厂面积',
  factoryAreaEn: '英文工厂面积',
  factoryVisuals: '工厂实拍模块',
  faqs: '常见问题',
  feature: '特色模块',
  features: '特色展示',
  fitsEn: '英文适用情况',
  fitsZh: '中文适用情况',
  followUp: '后续跟进',
  gallery: '图库',
  headOfficeAddress: '总部地址',
  headOfficeName: '总部名称',
  hero: '页面头图',
  home: '首页',
  href: '跳转链接',
  id: 'ID',
  image: '图片',
  inquiry: '询盘模块',
  incoterms: '贸易条款',
  linkedin: 'LinkedIn 链接',
  location: '位置',
  locationEn: '英文位置',
  locationZh: '中文位置',
  logo: 'Logo',
  mainFabrics: '主力面料模块',
  mainProducts: '主营产品',
  mainProductsEn: '英文主营产品',
  marketRegions: '市场区域',
  monthlyCapacity: '月产能',
  monthlyCapacityEn: '英文月产能',
  moq: '起订量',
  moqEn: '英文起订量',
  nameEn: '英文名称',
  nameZh: '中文名称',
  navTitleEn: '英文导航标题',
  navTitleZh: '中文导航标题',
  navigation: '导航',
  news: '公司活动/新闻',
  ningxiaFactoryAddress: '宁夏基地地址',
  ningxiaFactoryName: '宁夏基地名称',
  orders: '订单需求页面',
  overview: '概览',
  participants: '参与人员',
  paths: '路径卡片',
  payment: '付款方式',
  paymentEn: '英文付款方式',
  phone: '电话',
  poster: '视频封面',
  paragraphsEn: '英文段落',
  paragraphsZh: '中文段落',
  products: '产品页文案',
  process: '流程模块',
  quoteCTA: '询价 CTA',
  relatedProducts: '相关产品',
  servicesTitleEn: '英文服务标题',
  servicesTitleZh: '中文服务标题',
  sites: '办公/工厂地点',
  slug: '链接 slug',
  videoPosition: '视频显示位置',
  videoZoom: '视频显示缩放',
  socialLinks: '社交链接',
  sourcing: '采购说明',
  sourcingDesk: '采购路径',
  splitCards: '首页分栏卡片',
  summaryEn: '英文摘要',
  summaryZh: '中文摘要',
  tag: '标签',
  team: '团队模块',
  title: '标题',
  titleEn: '英文标题',
  titleZh: '中文标题',
  to: '站内链接',
  ctaEn: '英文按钮文字',
  ctaTo: '按钮跳转链接',
  ctaZh: '中文按钮文字',
  backgroundImage: '背景图片',
  topics: '主题',
  trade: '贸易信息',
  value: '内容',
  video: '视频',
  wechat: '微信',
  wechatQr: '微信公众号二维码',
  whatsapp: 'WhatsApp',
  xiaohongshu: '小红书链接',
  xinjiangFactoryAddress: '新疆工厂地址',
  xinjiangFactoryName: '新疆工厂名称',
  zh: '中文',
  en: '英文'
};

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function cloneValue<T>(value: T): T {
  return JSON.parse(JSON.stringify(value)) as T;
}

function getAtPath(value: unknown, path: PathPart[]) {
  return path.reduce<unknown>((current, part) => {
    if (current == null) return undefined;
    return (current as Record<string, unknown>)[String(part)];
  }, value);
}

function setAtPath<T>(source: T, path: PathPart[], nextValue: unknown): T {
  const next = cloneValue(source);
  let current: unknown = next;
  path.forEach((part, index) => {
    if (index === path.length - 1) {
      (current as Record<string, unknown>)[String(part)] = nextValue;
      return;
    }
    current = (current as Record<string, unknown>)[String(part)];
  });
  return next;
}

function labelForKey(key: string) {
  return keyLabels[key] || key.replace(/([A-Z])/g, ' $1').trim();
}

function describeArrayItem(item: unknown, index: number) {
  if (isRecord(item)) {
    const title = item.titleZh || item.titleEn || item.nameZh || item.nameEn || item.slug || item.id;
    if (title) return String(title);
  }
  return `第 ${index + 1} 项`;
}

function makeEmptyFromTemplate(value: unknown): unknown {
  if (Array.isArray(value)) return value.map(makeEmptyFromTemplate);
  if (isRecord(value)) {
    return Object.fromEntries(Object.entries(value).map(([key, item]) => {
      if (key === 'id') return [key, Date.now()];
      if (key === 'slug') return [key, `new-item-${Date.now()}`];
      if (key === 'date') return [key, new Date().toISOString().slice(0, 10)];
      return [key, makeEmptyFromTemplate(item)];
    }));
  }
  if (typeof value === 'number') return 0;
  if (typeof value === 'boolean') return false;
  return '';
}

function isMediaKey(key: string) {
  return /image|logo|poster|video|qr|wechatQr/i.test(key) && !/(position|zoom)$/i.test(key);
}

function isImageUploadKey(key: string) {
  return /image|logo|poster|qr|wechatQr|gallery/i.test(key) && !/(video|position|zoom)/i.test(key);
}

function isVideoUploadKey(key: string) {
  return /video/i.test(key) && !/(position|zoom)$/i.test(key);
}

function isUploadMediaKey(key: string) {
  return isImageUploadKey(key) || isVideoUploadKey(key);
}

function isLongTextKey(key: string) {
  return /description|summary|content|address|products|markets|hours|payment|title/i.test(key);
}

function isMediaUrl(value: string, key = '') {
  return isMediaKey(key)
    || /^\/(images|videos|uploads)\//.test(value)
    || /\.(jpg|jpeg|png|webp|gif|avif|svg|mp4|webm|mov|m4v)(\?.*)?$/i.test(value);
}

function mediaKindFromUrl(url: string) {
  if (/\.(mp4|webm|mov|m4v)(\?.*)?$/i.test(url) || /^\/videos\//.test(url)) return 'video';
  if (/\.(jpg|jpeg|png|webp|gif|avif|svg)(\?.*)?$/i.test(url) || /^\/images\//.test(url)) return 'image';
  return 'file';
}

function mergeMediaLibrary(uploadedMedia: MediaLibraryItem[], siteMedia: MediaLibraryItem[]) {
  const map = new Map<string, MediaLibraryItem>();
  [...uploadedMedia, ...siteMedia].forEach(item => {
    if (!item.url) return;
    map.set(item.url, {
      ...item,
      name: item.name || basenameFromUrl(item.url),
      source: item.source || '媒体库上传文件'
    });
  });
  return Array.from(map.values()).sort((a, b) => `${a.kind}-${a.name}`.localeCompare(`${b.kind}-${b.name}`));
}

function MediaLibrarySelect({ value, kind, mediaLibrary, onChange }: { value: string; kind: 'image' | 'video'; mediaLibrary?: MediaLibraryItem[]; onChange: (value: string) => void }) {
  const choices = (mediaLibrary || []).filter(item => item.kind === kind);
  if (!choices.length) return null;
  const selectedValue = choices.some(item => item.url === value) ? value : '';
  return <div className="mt-3">
    <label className="block text-xs font-bold text-muted">
      从媒体库选择
      <select value={selectedValue} onChange={event => { if (event.target.value) onChange(event.target.value); }} className="mt-2 min-h-10 w-full border border-line bg-white px-3 text-sm font-semibold text-ink outline-none focus:border-accent">
        <option value="">选择已有{kind === 'video' ? '视频' : '图片'}</option>
        {choices.map(item => <option key={item.url} value={item.url}>{item.name}{item.source ? ` · ${item.source}` : ''}</option>)}
      </select>
    </label>
  </div>;
}

function basenameFromUrl(url: string) {
  const filename = url.split('?')[0].split('/').filter(Boolean).pop() || url;
  try {
    return decodeURIComponent(filename);
  } catch {
    // Keep malformed legacy URLs usable in the media library.
    return filename;
  }
}

function sourceLabel(path: PathPart[]) {
  return path.map(part => typeof part === 'number' ? `第 ${part + 1} 项` : labelForKey(part)).join(' / ');
}

function isTextContentKey(key: string) {
  if (isMediaKey(key)) return false;
  if (['id', 'slug', 'href', 'to', 'tag', 'category', 'imagePosition', 'imageZoom', 'videoPosition', 'videoZoom'].includes(key)) return false;
  if (/(position|zoom)$/i.test(key)) return false;
  return true;
}

function extractSiteLibrary(site: SiteContent) {
  const mediaMap = new Map<string, SiteMediaItem>();
  const texts: SiteTextItem[] = [];

  function walk(value: unknown, path: PathPart[] = []) {
    const key = String(path[path.length - 1] || '');
    if (typeof value === 'string') {
      const trimmed = value.trim();
      if (!trimmed) return;
      if (isMediaUrl(trimmed, key)) {
        if (!mediaMap.has(trimmed)) {
          mediaMap.set(trimmed, {
            url: trimmed,
            kind: mediaKindFromUrl(trimmed),
            name: basenameFromUrl(trimmed),
            originalName: basenameFromUrl(trimmed),
            size: 0,
            updatedAt: '站点内容',
            source: sourceLabel(path)
          });
        }
        return;
      }
      if (isTextContentKey(key)) {
        texts.push({
          id: `${path.join('.')}-${texts.length}`,
          label: labelForKey(key),
          value: trimmed,
          source: sourceLabel(path)
        });
      }
      return;
    }
    if (Array.isArray(value)) {
      value.forEach((item, index) => walk(item, [...path, index]));
      return;
    }
    if (isRecord(value)) {
      Object.entries(value).forEach(([childKey, item]) => walk(item, [...path, childKey]));
    }
  }

  walk(site);
  staticMediaFiles.forEach(url => {
    if (mediaMap.has(url)) return;
    mediaMap.set(url, {
      url,
      kind: mediaKindFromUrl(url),
      name: basenameFromUrl(url),
      originalName: basenameFromUrl(url),
      size: 0,
      updatedAt: '项目静态文件',
      source: 'public 目录已有文件'
    });
  });
  return {
    media: Array.from(mediaMap.values()).sort((a, b) => a.name.localeCompare(b.name)),
    texts
  };
}

function ContentMediaDropzone({ label, value, fieldKey, uploadMedia, mediaLibrary, onChange }: { label: string; value: string; fieldKey: string; uploadMedia?: UploadMediaFn; mediaLibrary?: MediaLibraryItem[]; onChange: (value: string) => void }) {
  const [dragging, setDragging] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState('');
  const videoField = isVideoUploadKey(fieldKey);
  const mediaLabel = videoField ? '视频' : '图片';
  const accept = videoField ? 'video/*' : 'image/*';

  async function acceptFile(file: File | undefined) {
    if (!file || !uploadMedia) return;
    if (videoField ? !file.type.startsWith('video/') : !file.type.startsWith('image/')) {
      window.alert(`这里只能上传${mediaLabel}文件`);
      return;
    }
    setUploading(true);
    setMessage('');
    try {
      const url = await uploadMedia(file);
      onChange(url);
      setMessage(`${mediaLabel}已上传，保存当前模块后生效`);
    } catch (error) {
      setMessage(error instanceof Error ? error.message : `${mediaLabel}上传失败`);
    } finally {
      setUploading(false);
    }
  }

  function handleDrop(event: DragEvent<HTMLLabelElement>) {
    event.preventDefault();
    setDragging(false);
    void acceptFile(event.dataTransfer.files[0]);
  }

  return <div className="mt-3">
    <label
      onDragEnter={event => { event.preventDefault(); setDragging(true); }}
      onDragOver={event => event.preventDefault()}
      onDragLeave={event => { event.preventDefault(); setDragging(false); }}
      onDrop={handleDrop}
      className={`block cursor-pointer border-2 border-dashed p-3 transition ${dragging ? 'border-accent bg-orange-50' : 'border-slate-300 bg-slate-50 hover:border-accent hover:bg-orange-50/60'}`}
    >
      {value
        ? videoField
          ? <video src={value} className="aspect-video w-full bg-black object-contain" controls muted/>
          : <img src={value} alt={label} className="max-h-64 w-full object-contain bg-white p-2"/>
        : <div className="flex min-h-40 items-center justify-center bg-white text-center text-sm leading-6 text-muted">将{mediaLabel}拖到这里</div>}
      <p className="mt-3 text-center text-xs font-semibold text-muted">{uploading ? '上传中...' : `拖拽本地${mediaLabel}到这里，或点击选择${mediaLabel}`}</p>
      {message&&<p className="mt-2 text-center text-xs font-semibold text-accent">{message}</p>}
      <input type="file" accept={accept} className="sr-only" onChange={event => { void acceptFile(event.target.files?.[0]); event.target.value = ''; }}/>
    </label>
    <MediaLibrarySelect value={value} kind={videoField ? 'video' : 'image'} mediaLibrary={mediaLibrary} onChange={onChange}/>
  </div>;
}

function EditableField({ label, value, onChange, fieldKey, uploadMedia, mediaLibrary }: { label: string; value: string | number | boolean; onChange: (value: string | number | boolean) => void; fieldKey: string; uploadMedia?: UploadMediaFn; mediaLibrary?: MediaLibraryItem[] }) {
  if (typeof value === 'boolean') {
    return <label className="flex min-h-11 items-center gap-3 border border-line px-3 text-sm font-semibold text-ink">
      <input type="checkbox" checked={value} onChange={event => onChange(event.target.checked)} className="size-4 accent-orange-600"/>
      {label}
    </label>;
  }

  const textValue = String(value ?? '');
  const numeric = typeof value === 'number';
  const longText = textValue.length > 80 || textValue.includes('\n') || isLongTextKey(fieldKey);
  const inputClass = "min-h-11 w-full border border-line px-3 text-sm outline-none focus:border-accent";
  const textareaClass = "min-h-28 w-full border border-line p-3 text-sm leading-6 outline-none focus:border-accent";

  return <ProductEditorField label={label}>
    {typeof value === 'string' && uploadMedia && isUploadMediaKey(fieldKey) && <ContentMediaDropzone label={label} value={textValue} fieldKey={fieldKey} uploadMedia={uploadMedia} mediaLibrary={mediaLibrary} onChange={next => onChange(next)}/>}
    {longText
      ? <textarea value={textValue} onChange={event => onChange(numeric ? Number(event.target.value) : event.target.value)} className={textareaClass}/>
      : <input type={numeric ? 'number' : 'text'} value={textValue} onChange={event => onChange(numeric ? Number(event.target.value) : event.target.value)} className={inputClass}/>}
    {typeof value === 'string' && isMediaKey(fieldKey) && textValue && !isUploadMediaKey(fieldKey) && <MediaPreview value={textValue} fieldKey={fieldKey}/>}
  </ProductEditorField>;
}

function MediaPreview({ value, fieldKey }: { value: string; fieldKey: string }) {
  const isVideo = /video/i.test(fieldKey) || /\.(mp4|webm|mov)$/i.test(value);
  return <div className="mt-3 overflow-hidden border border-slate-200 bg-slate-50">
    {isVideo
      ? <video src={value} className="aspect-video w-full object-cover" controls muted/>
      : <img src={value} alt="" className="max-h-64 w-full object-contain p-3"/>}
  </div>;
}

function EditableValue({ value, onChange, fieldKey = 'content', depth = 0, uploadMedia, mediaLibrary }: { value: unknown; onChange: (value: unknown) => void; fieldKey?: string; depth?: number; uploadMedia?: UploadMediaFn; mediaLibrary?: MediaLibraryItem[] }) {
  if (typeof value === 'string' || typeof value === 'number' || typeof value === 'boolean') {
    return <EditableField label={labelForKey(fieldKey)} value={value} onChange={onChange} fieldKey={fieldKey} uploadMedia={uploadMedia} mediaLibrary={mediaLibrary}/>;
  }

  if (Array.isArray(value)) {
    const allStrings = value.every(item => typeof item === 'string');
    const allPairs = value.every(item => Array.isArray(item) && item.length === 2 && item.every(part => typeof part === 'string'));
    if (allStrings) {
      if (uploadMedia && isImageUploadKey(fieldKey)) {
        return <div>
          <div className="mb-3 flex items-center justify-between gap-3">
            <h3 className="text-sm font-bold text-ink">{labelForKey(fieldKey)}</h3>
            <button type="button" onClick={() => onChange([...value, ''])} className="border border-line px-3 py-2 text-xs font-bold hover:border-accent hover:text-accent">新增图片位置</button>
          </div>
          <div className="grid gap-4 lg:grid-cols-2">
            {value.map((item, index) => <div key={`${index}-${item}`} className="border border-slate-200 p-4">
              <div className="mb-3 flex items-center justify-between gap-3">
                <p className="text-xs font-bold uppercase tracking-[.12em] text-muted">第 {index + 1} 张</p>
                <button type="button" onClick={() => onChange(value.filter((_, itemIndex) => itemIndex !== index))} className="text-xs font-bold text-red-700">删除</button>
              </div>
              <EditableField
                label="图片"
                value={item}
                fieldKey="image"
                uploadMedia={uploadMedia}
                mediaLibrary={mediaLibrary}
                onChange={next => onChange(value.map((row, rowIndex) => rowIndex === index ? String(next) : row))}
              />
            </div>)}
          </div>
        </div>;
      }
      return <ProductEditorField label={`${labelForKey(fieldKey)}，每行一条`}>
        <textarea value={value.join('\n')} onChange={event => onChange(event.target.value.split('\n').map(item => item.trim()).filter(Boolean))} className="min-h-36 w-full border border-line p-3 text-sm leading-6 outline-none focus:border-accent"/>
      </ProductEditorField>;
    }
    if (allPairs) {
      return <div>
        <div className="mb-3 flex items-center justify-between gap-3">
          <h3 className="text-sm font-bold text-ink">{labelForKey(fieldKey)}</h3>
          <button type="button" onClick={() => onChange([...value, ['', '']])} className="border border-line px-3 py-2 text-xs font-bold hover:border-accent hover:text-accent">新增</button>
        </div>
        <div className="grid gap-3">
          {value.map((item, index) => <div key={index} className="border border-slate-200 p-4">
            <div className="flex items-center justify-between gap-3">
              <p className="text-xs font-bold uppercase tracking-[.12em] text-muted">第 {index + 1} 项</p>
              <button type="button" onClick={() => onChange(value.filter((_, itemIndex) => itemIndex !== index))} className="text-xs font-bold text-red-700">删除</button>
            </div>
            <div className="mt-4 grid gap-4 lg:grid-cols-2">
              <EditableField label="中文" value={item[0]} fieldKey="zh" uploadMedia={uploadMedia} mediaLibrary={mediaLibrary} onChange={next => onChange(value.map((row, rowIndex) => rowIndex === index ? [next, row[1]] : row))}/>
              <EditableField label="英文" value={item[1]} fieldKey="en" uploadMedia={uploadMedia} mediaLibrary={mediaLibrary} onChange={next => onChange(value.map((row, rowIndex) => rowIndex === index ? [row[0], next] : row))}/>
            </div>
          </div>)}
        </div>
      </div>;
    }

    const template = value[0] ?? '';
    return <div>
      <div className="mb-3 flex items-center justify-between gap-3">
        <h3 className="text-sm font-bold text-ink">{labelForKey(fieldKey)}</h3>
        <button type="button" onClick={() => onChange([...value, makeEmptyFromTemplate(template)])} className="border border-line px-3 py-2 text-xs font-bold hover:border-accent hover:text-accent">新增</button>
      </div>
      <div className="grid gap-4">
        {value.map((item, index) => <div key={index} className="border border-slate-200 bg-white p-4">
          <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-xs font-bold uppercase tracking-[.12em] text-muted">第 {index + 1} 项</p>
              <h3 className="mt-1 font-bold text-ink">{describeArrayItem(item, index)}</h3>
            </div>
            <div className="flex gap-2">
              <button type="button" onClick={() => onChange([...value.slice(0, index + 1), cloneValue(item), ...value.slice(index + 1)])} className="border border-line px-3 py-2 text-xs font-bold hover:border-accent hover:text-accent">复制</button>
              <button type="button" onClick={() => onChange(value.filter((_, itemIndex) => itemIndex !== index))} className="border border-red-200 px-3 py-2 text-xs font-bold text-red-700 hover:bg-red-50">删除</button>
            </div>
          </div>
          <EditableValue value={item} fieldKey={`${fieldKey}-${index + 1}`} depth={depth + 1} uploadMedia={uploadMedia} mediaLibrary={mediaLibrary} onChange={next => onChange(value.map((row, rowIndex) => rowIndex === index ? next : row))}/>
        </div>)}
      </div>
    </div>;
  }

  if (isRecord(value)) {
    const entries = Object.entries(value);
    return <div className={`grid gap-5 ${depth < 1 ? 'lg:grid-cols-2' : ''}`}>
      {entries.map(([key, item]) => <div key={key} className={isRecord(item) || Array.isArray(item) ? 'lg:col-span-2' : ''}>
        {isRecord(item) || Array.isArray(item)
          ? <div className="border border-slate-200 p-4">
              <h2 className="mb-4 text-base font-bold text-ink">{labelForKey(key)}</h2>
              <EditableValue value={item} fieldKey={key} depth={depth + 1} uploadMedia={uploadMedia} mediaLibrary={mediaLibrary} onChange={next => onChange({ ...value, [key]: next })}/>
            </div>
          : <EditableValue value={item} fieldKey={key} depth={depth + 1} uploadMedia={uploadMedia} mediaLibrary={mediaLibrary} onChange={next => onChange({ ...value, [key]: next })}/>}
      </div>)}
    </div>;
  }

  return <ProductEditorField label={labelForKey(fieldKey)}>
    <input value={value == null ? '' : String(value)} onChange={event => onChange(event.target.value)} className="min-h-11 w-full border border-line px-3 text-sm outline-none focus:border-accent"/>
  </ProductEditorField>;
}

function buildContentModules(site: SiteContent): ContentModule[] {
  const copy = isRecord(site.copy) ? site.copy : {};
  const copyTitles: Record<string, string> = {
    home: '首页内容（与前台同步）',
    company: '公司页面内容',
    contact: '联系页面内容',
    products: '产品页文案',
    export: '国际业务页面',
    domestic: '国内业务页面',
    activity: '活动页面内容',
    orders: '订单需求页面',
    quoteCTA: '全站询价 CTA'
  };
  return [
    { id: 'company', title: '公司信息', description: 'Logo、公司名称、地址、联系方式和社交链接。', path: ['company'] },
    ...Object.keys(copy).map(key => ({
      id: `copy.${key}`,
      title: copyTitles[key] || `${labelForKey(key)}内容`,
      description: '页面里的标题、说明、图片、视频、卡片和链接。',
      path: ['copy', key]
    })),
    { id: 'navigation', title: '导航菜单', description: '顶部导航和下拉菜单的中英文文字与跳转链接。', path: ['navigation'] },
    { id: 'news', title: '公司活动/新闻', description: '活动新闻列表、详情正文、封面图和图库。', path: ['news'] },
    { id: 'features', title: '首页特色展示', description: '现货、定织、交付等特色模块的图片、视频和文案。', path: ['features'] },
    { id: 'exportSteps', title: '出口流程', description: '国际业务流程步骤的中英文内容。', path: ['exportSteps'] },
    { id: 'domesticSteps', title: '国内流程', description: '国内业务流程步骤的中英文内容。', path: ['domesticSteps'] },
    { id: 'faqs', title: '常见问题', description: '网站 FAQ 的中英文问答。', path: ['faqs'] },
    { id: 'marketRegions', title: '市场区域', description: '出口市场区域列表。', path: ['marketRegions'] }
  ];
}

const homeFrontendKeys = ['hero', 'companyIntro', 'mainFabrics', 'activity'];

function homeContentForEditor(value: unknown) {
  if (!isRecord(value)) return {};
  return Object.fromEntries(homeFrontendKeys
    .filter(key => key in value)
    .map(key => [key, value[key]]));
}

function newsBlocksForEditor(article: NewsArticle): NewsContentBlock[] {
  if (article.contentBlocks?.length) return cloneValue(article.contentBlocks);
  return [
    ...article.contentZh.map((textZh, index) => ({ type: 'text' as const, textZh, textEn: article.contentEn[index] || '' })),
    ...(article.gallery || []).map(image => ({ type: 'image' as const, image }))
  ];
}

function NewsInput({ label, value, onChange, textarea = false }: { label: string; value: string; onChange: (value: string) => void; textarea?: boolean }) {
  return <label className="block">
    <span className="mb-2 block text-xs font-bold text-muted">{label}</span>
    {textarea
      ? <textarea value={value} onChange={event => onChange(event.target.value)} className="min-h-28 w-full border border-line p-3 text-sm leading-6 outline-none focus:border-accent"/>
      : <input value={value} onChange={event => onChange(event.target.value)} className="min-h-11 w-full border border-line px-3 text-sm outline-none focus:border-accent"/>}
  </label>;
}

function CoverCropEditor({ value, position, zoom, uploadMedia, mediaLibrary, onChange, onPositionChange, onZoomChange }: { value: string; position?: string; zoom?: number; uploadMedia: UploadMediaFn; mediaLibrary: MediaLibraryItem[]; onChange: (value: string) => void; onPositionChange: (value: string) => void; onZoomChange: (value: number) => void }) {
  const objectPosition = position || '50% 50%';
  const imageZoom = Math.min(3, Math.max(1, zoom || 1));

  function setPosition(event: ReactPointerEvent<HTMLDivElement>) {
    if (!value) return;
    const bounds = event.currentTarget.getBoundingClientRect();
    const x = Math.round(Math.min(100, Math.max(0, ((event.clientX - bounds.left) / bounds.width) * 100)));
    const y = Math.round(Math.min(100, Math.max(0, ((event.clientY - bounds.top) / bounds.height) * 100)));
    onPositionChange(`${x}% ${y}%`);
  }

  return <div className="mt-3">
    <div className="relative aspect-[16/10] w-full overflow-hidden border-2 border-dashed border-accent bg-slate-100" onPointerDown={setPosition} onPointerMove={event => { if (event.buttons === 1) setPosition(event); }} title="拖动或点击图片，设置网页显示位置">
      {value
        ? <img src={value} alt="封面裁剪预览" style={{ objectPosition, transform: `scale(${imageZoom})` }} className="size-full select-none object-cover" draggable={false}/>
        : <div className="flex size-full items-center justify-center text-sm text-muted">先上传或选择封面图片</div>}
      <div className="pointer-events-none absolute inset-0 border border-white/80 shadow-[inset_0_0_0_1px_rgba(15,23,42,.25)]"/>
      <span className="pointer-events-none absolute left-2 top-2 bg-ink/75 px-2 py-1 text-[11px] font-bold text-white">网页显示范围 · 16:10</span>
      {value&&<span className="pointer-events-none absolute bottom-2 right-2 bg-white/90 px-2 py-1 text-[11px] font-semibold text-ink">拖动图片调整位置</span>}
    </div>
    <ContentMediaDropzone label="封面图片" value={value} fieldKey="image" uploadMedia={uploadMedia} mediaLibrary={mediaLibrary} onChange={onChange}/>
    <div className="mt-3 border border-slate-200 bg-slate-50 p-3">
      <div className="flex items-center justify-between gap-3 text-xs font-bold text-muted"><span>图片缩放</span><span>{imageZoom.toFixed(1)}x</span></div>
      <div className="mt-2 flex items-center gap-3">
        <button type="button" onClick={() => onZoomChange(Math.max(1, Number((imageZoom - 0.1).toFixed(1))))} aria-label="缩小" title="缩小" className="grid size-9 place-items-center border border-line bg-white text-lg font-bold text-ink hover:border-accent hover:text-accent">−</button>
        <input type="range" min="1" max="3" step="0.1" value={imageZoom} onChange={event => onZoomChange(Number(event.target.value))} aria-label="封面图片缩放" className="w-full accent-orange-600"/>
        <button type="button" onClick={() => onZoomChange(Math.min(3, Number((imageZoom + 0.1).toFixed(1))))} aria-label="放大" title="放大" className="grid size-9 place-items-center border border-line bg-white text-lg font-bold text-ink hover:border-accent hover:text-accent">+</button>
      </div>
      <div className="mt-2 flex items-center justify-between gap-3 text-xs text-muted">
        <span>位置：{objectPosition}</span>
        <button type="button" onClick={() => { onPositionChange('50% 50%'); onZoomChange(1); }} className="font-bold text-accent hover:text-accent-hover">恢复默认</button>
      </div>
    </div>
  </div>;
}

function FeatureVideoEditor({ value, poster, position, zoom, uploadMedia, mediaLibrary, onChange, onPosterChange, onPositionChange, onZoomChange }: { value: string; poster: string; position?: string; zoom?: number; uploadMedia: UploadMediaFn; mediaLibrary: MediaLibraryItem[]; onChange: (value: string) => void; onPosterChange: (value: string) => void; onPositionChange: (value: string) => void; onZoomChange: (value: number) => void }) {
  const previewPosition = position || '50% 50%';
  const previewZoom = Math.min(3, Math.max(1, zoom || 1));

  function setPosition(event: ReactPointerEvent<HTMLDivElement>) {
    if (!value) return;
    const bounds = event.currentTarget.getBoundingClientRect();
    const x = Math.round(Math.min(100, Math.max(0, ((event.clientX - bounds.left) / bounds.width) * 100)));
    const y = Math.round(Math.min(100, Math.max(0, ((event.clientY - bounds.top) / bounds.height) * 100)));
    onPositionChange(`${x}% ${y}%`);
  }

  return <div className="grid gap-5">
    <div className="grid gap-5 lg:grid-cols-2">
      <ContentMediaDropzone label="视频" value={value} fieldKey="video" uploadMedia={uploadMedia} mediaLibrary={mediaLibrary} onChange={onChange}/>
      <ContentMediaDropzone label="视频封面" value={poster} fieldKey="poster" uploadMedia={uploadMedia} mediaLibrary={mediaLibrary} onChange={onPosterChange}/>
    </div>
    <div className="border border-dashed border-slate-300 bg-slate-50 p-3">
      <div className="relative aspect-video w-full overflow-hidden bg-black" onPointerDown={setPosition} onPointerMove={event => { if (event.buttons === 1) setPosition(event); }} title="拖动或点击视频预览，设置网页显示位置">
        {value
          ? <video
              src={value}
              poster={poster}
              autoPlay
              muted
              loop
              playsInline
              style={{ objectPosition: previewPosition, transform: `scale(${previewZoom})` }}
              className="size-full object-cover"
            >
              Your browser does not support video playback.
            </video>
          : <div className="flex size-full items-center justify-center text-sm text-white/70">先上传或选择视频</div>}
        <div className="pointer-events-none absolute inset-0 border border-white/40"/>
        <span className="pointer-events-none absolute left-2 top-2 bg-ink/75 px-2 py-1 text-[11px] font-bold text-white">网页显示范围 · 16:9</span>
        {value&&<span className="pointer-events-none absolute bottom-2 right-2 bg-white/90 px-2 py-1 text-[11px] font-semibold text-ink">拖动视频调整位置</span>}
      </div>
      <div className="mt-3 border border-slate-200 bg-white p-3">
        <div className="flex items-center justify-between gap-3 text-xs font-bold text-muted"><span>视频缩放</span><span>{previewZoom.toFixed(1)}x</span></div>
        <div className="mt-2 flex items-center gap-3">
          <button type="button" onClick={() => onZoomChange(Math.max(1, Number((previewZoom - 0.1).toFixed(1))))} aria-label="缩小" title="缩小" className="grid size-9 place-items-center border border-line bg-white text-lg font-bold text-ink hover:border-accent hover:text-accent">−</button>
          <input type="range" min="1" max="3" step="0.1" value={previewZoom} onChange={event => onZoomChange(Number(event.target.value))} aria-label="视频显示缩放" className="w-full accent-orange-600"/>
          <button type="button" onClick={() => onZoomChange(Math.min(3, Number((previewZoom + 0.1).toFixed(1))))} aria-label="放大" title="放大" className="grid size-9 place-items-center border border-line bg-white text-lg font-bold text-ink hover:border-accent hover:text-accent">+</button>
        </div>
        <div className="mt-2 flex items-center justify-between gap-3 text-xs text-muted">
          <span>位置：{previewPosition}</span>
          <button type="button" onClick={() => { onPositionChange('50% 50%'); onZoomChange(1); }} className="font-bold text-accent hover:text-accent-hover">恢复默认</button>
        </div>
      </div>
    </div>
  </div>;
}

function createBlankFeatureItem(index: number): FeatureShowcaseItem {
  return {
    id: `feature-${Date.now()}-${index + 1}`,
    tag: 'STOCK',
    navTitleZh: '',
    navTitleEn: '',
    titleZh: '',
    titleEn: '',
    descriptionZh: '',
    descriptionEn: '',
    video: '',
    poster: '',
    videoPosition: '50% 50%',
    videoZoom: 1
  };
}

function FeatureShowcaseEditor({ items, uploadMedia, mediaLibrary, onChange }: { items: FeatureShowcaseItem[]; uploadMedia: UploadMediaFn; mediaLibrary: MediaLibraryItem[]; onChange: (items: FeatureShowcaseItem[]) => void }) {
  function updateItem(index: number, patch: Partial<FeatureShowcaseItem>) {
    onChange(items.map((item, itemIndex) => itemIndex === index ? { ...item, ...patch } : item));
  }

  function addItem() {
    onChange([...items, createBlankFeatureItem(items.length)]);
  }

  function duplicateItem(index: number) {
    const item = items[index];
    if (!item) return;
    onChange([...items.slice(0, index + 1), { ...cloneValue(item), id: `feature-${Date.now()}-${index + 1}` }, ...items.slice(index + 1)]);
  }

  function removeItem(index: number) {
    onChange(items.filter((_, itemIndex) => itemIndex !== index));
  }

  return <div className="grid gap-5">
    <div className="flex flex-wrap items-end justify-between gap-3">
      <div>
        <p className="text-xs font-bold uppercase tracking-[.14em] text-muted">首页特色展示</p>
        <p className="mt-1 text-sm text-muted">每一项都可以单独调整视频显示范围，拖动预览画面即可改变网页里的显示位置。</p>
      </div>
      <button type="button" onClick={addItem} className="inline-flex min-h-11 items-center gap-2 border border-line bg-white px-4 py-3 text-sm font-bold text-ink hover:border-accent hover:text-accent">新增展示项</button>
    </div>
    <div className="grid gap-5">
      {items.map((item, index) => <div key={item.id || index} className="border border-slate-200 bg-slate-50 p-5">
        <div className="mb-5 flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 pb-4">
          <div>
            <p className="text-xs font-bold uppercase tracking-[.12em] text-muted">第 {index + 1} 项</p>
            <h3 className="mt-1 text-lg font-bold text-ink">{item.titleZh || item.titleEn || item.navTitleZh || item.navTitleEn || item.id}</h3>
          </div>
          <div className="flex flex-wrap gap-2">
            <button type="button" onClick={() => duplicateItem(index)} className="border border-line bg-white px-3 py-2 text-xs font-bold hover:border-accent hover:text-accent">复制</button>
            <button type="button" onClick={() => removeItem(index)} className="border border-red-200 bg-white px-3 py-2 text-xs font-bold text-red-700 hover:bg-red-50">删除</button>
          </div>
        </div>

        <div className="grid gap-5">
          <div className="grid gap-4 lg:grid-cols-2">
            <label className="block">
              <span className="mb-2 block text-xs font-bold text-muted">标签</span>
              <select value={item.tag} onChange={event => updateItem(index, { tag: event.target.value as FeatureShowcaseItem['tag'] })} className="min-h-11 w-full border border-line bg-white px-3 text-sm outline-none focus:border-accent">
                <option value="STOCK">STOCK</option>
                <option value="CUSTOM">CUSTOM</option>
                <option value="DELIVERY">DELIVERY</option>
              </select>
            </label>
            <NewsInput label="ID" value={item.id} onChange={value => updateItem(index, { id: value })}/>
            <NewsInput label="中文导航标题" value={item.navTitleZh} onChange={value => updateItem(index, { navTitleZh: value })}/>
            <NewsInput label="英文导航标题" value={item.navTitleEn} onChange={value => updateItem(index, { navTitleEn: value })}/>
            <NewsInput label="中文标题" value={item.titleZh} onChange={value => updateItem(index, { titleZh: value })}/>
            <NewsInput label="英文标题" value={item.titleEn} onChange={value => updateItem(index, { titleEn: value })}/>
            <NewsInput label="中文说明" value={item.descriptionZh} onChange={value => updateItem(index, { descriptionZh: value })} textarea/>
            <NewsInput label="英文说明" value={item.descriptionEn} onChange={value => updateItem(index, { descriptionEn: value })} textarea/>
          </div>
          <FeatureVideoEditor
            value={item.video || ''}
            poster={item.poster}
            position={item.videoPosition}
            zoom={item.videoZoom}
            uploadMedia={uploadMedia}
            mediaLibrary={mediaLibrary}
            onChange={value => updateItem(index, { video: value })}
            onPosterChange={value => updateItem(index, { poster: value })}
            onPositionChange={value => updateItem(index, { videoPosition: value })}
            onZoomChange={value => updateItem(index, { videoZoom: value })}
          />
        </div>
      </div>)}
    </div>
  </div>;
}

function NewsEditor({ article, uploadMedia, mediaLibrary, onChange }: { article: NewsArticle; uploadMedia: UploadMediaFn; mediaLibrary: MediaLibraryItem[]; onChange: (article: NewsArticle) => void }) {
  const blocks = newsBlocksForEditor(article);
  const [draggedBlockIndex, setDraggedBlockIndex] = useState<number | null>(null);
  const [dropTargetIndex, setDropTargetIndex] = useState<number | null>(null);

  function updateArticle(patch: Partial<NewsArticle>) {
    onChange({ ...article, ...patch });
  }

  function updateBlocks(nextBlocks: NewsContentBlock[]) {
    onChange({
      ...article,
      contentBlocks: nextBlocks,
      contentZh: nextBlocks.filter(block => block.type === 'text').map(block => block.textZh),
      contentEn: nextBlocks.filter(block => block.type === 'text').map(block => block.textEn),
      gallery: nextBlocks.filter(block => block.type === 'image').map(block => block.image).filter(Boolean)
    });
  }

  function updateBlock(index: number, patch: Partial<NewsContentBlock>) {
    updateBlocks(blocks.map((block, blockIndex) => blockIndex === index ? { ...block, ...patch } as NewsContentBlock : block));
  }

  function moveBlock(index: number, direction: -1 | 1) {
    const target = index + direction;
    if (target < 0 || target >= blocks.length) return;
    const next = [...blocks];
    [next[index], next[target]] = [next[target], next[index]];
    updateBlocks(next);
  }

  function moveBlockTo(from: number, to: number) {
    if (from === to) return;
    const next = [...blocks];
    const [moved] = next.splice(from, 1);
    next.splice(to, 0, moved);
    updateBlocks(next);
  }

  function addTextBlock() {
    updateBlocks([...blocks, { type: 'text', textZh: '', textEn: '' }]);
  }

  function addImageBlock() {
    updateBlocks([...blocks, { type: 'image', image: '' }]);
  }

  function addHeadingBlock() {
    updateBlocks([...blocks, { type: 'heading', titleZh: '', titleEn: '' }]);
  }

  return <div className="grid gap-8">
    <div className="border border-slate-200 p-5">
      <div className="mb-5 flex items-center justify-between gap-3 border-b border-slate-200 pb-4">
        <div><p className="text-xs font-bold uppercase tracking-[.12em] text-accent">新闻基本信息</p><h3 className="mt-1 text-lg font-bold text-ink">顶部标题和摘要</h3></div>
        <span className="text-xs text-muted">这里的标题就是前台详情页头部标题</span>
      </div>
      <div className="grid gap-5 lg:grid-cols-2">
        <NewsInput label="标题（中文）" value={article.titleZh} onChange={value => updateArticle({ titleZh: value })}/>
        <NewsInput label="标题（英文）" value={article.titleEn} onChange={value => updateArticle({ titleEn: value })}/>
        <NewsInput label="分类（中文）" value={article.categoryZh} onChange={value => updateArticle({ categoryZh: value })}/>
        <NewsInput label="分类（英文）" value={article.categoryEn} onChange={value => updateArticle({ categoryEn: value })}/>
        <NewsInput label="分类 ID" value={article.category} onChange={value => updateArticle({ category: value })}/>
        <NewsInput label="日期" value={article.date} onChange={value => updateArticle({ date: value })}/>
        <NewsInput label="链接 slug" value={article.slug} onChange={value => updateArticle({ slug: value })}/>
        <NewsInput label="摘要（中文）" value={article.summaryZh} onChange={value => updateArticle({ summaryZh: value })} textarea/>
        <NewsInput label="摘要（英文）" value={article.summaryEn} onChange={value => updateArticle({ summaryEn: value })} textarea/>
      </div>
      <div className="mt-5 max-w-xl">
        <p className="text-xs font-bold text-muted">封面图片</p>
        <CoverCropEditor value={article.image} position={article.imagePosition} zoom={article.imageZoom} uploadMedia={uploadMedia} mediaLibrary={mediaLibrary} onChange={value => updateArticle({ image: value })} onPositionChange={value => updateArticle({ imagePosition: value })} onZoomChange={value => updateArticle({ imageZoom: value })}/>
      </div>
    </div>

    <div className="border border-slate-200 p-5">
      <div className="mb-5 flex flex-wrap items-end justify-between gap-3 border-b border-slate-200 pb-4">
        <div><p className="text-xs font-bold uppercase tracking-[.12em] text-accent">详情内容</p><h3 className="mt-1 text-lg font-bold text-ink">文字和图片自由排序</h3><p className="mt-1 text-sm text-muted">前台会按照这里从上到下的顺序显示。</p></div>
        <div className="flex flex-wrap gap-2">
          <button type="button" onClick={addTextBlock} className="border border-line px-3 py-2 text-xs font-bold hover:border-accent hover:text-accent">新增文字</button>
          <button type="button" onClick={addImageBlock} className="border border-line px-3 py-2 text-xs font-bold hover:border-accent hover:text-accent">新增图片</button>
          <button type="button" onClick={addHeadingBlock} className="border border-line px-3 py-2 text-xs font-bold hover:border-accent hover:text-accent">新增小标题</button>
        </div>
      </div>
      <div className="grid gap-4">
        {blocks.map((block, index) => <div key={index} onDragOver={event => { event.preventDefault(); if (draggedBlockIndex !== null && draggedBlockIndex !== index) setDropTargetIndex(index); }} onDragLeave={() => setDropTargetIndex(current => current === index ? null : current)} onDrop={event => { event.preventDefault(); if (draggedBlockIndex !== null) moveBlockTo(draggedBlockIndex, index); setDraggedBlockIndex(null); setDropTargetIndex(null); }} className={`border bg-slate-50 p-4 transition ${dropTargetIndex === index ? 'border-accent ring-2 ring-orange-200' : 'border-slate-200'}`}>
          <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <button type="button" draggable onDragStart={event => { event.dataTransfer.effectAllowed = 'move'; setDraggedBlockIndex(index); }} onDragEnd={() => { setDraggedBlockIndex(null); setDropTargetIndex(null); }} title="拖拽排序" aria-label="拖拽排序" className="cursor-grab touch-none text-muted hover:text-accent active:cursor-grabbing"><GripVertical size={18}/></button>
              <p className="text-xs font-bold uppercase tracking-[.12em] text-muted">第 {index + 1} 段 · {block.type === 'text' ? '文字' : block.type === 'heading' ? '小标题' : '图片'}</p>
            </div>
            <div className="flex flex-wrap gap-2">
              <button type="button" disabled={index === 0} onClick={() => moveBlock(index, -1)} className="border border-line px-2 py-1 text-xs font-bold disabled:opacity-40">上移</button>
              <button type="button" disabled={index === blocks.length - 1} onClick={() => moveBlock(index, 1)} className="border border-line px-2 py-1 text-xs font-bold disabled:opacity-40">下移</button>
              <button type="button" onClick={() => updateBlocks(blocks.filter((_, blockIndex) => blockIndex !== index))} className="border border-red-200 px-2 py-1 text-xs font-bold text-red-700">删除</button>
            </div>
          </div>
          {block.type === 'text'
            ? <div className="grid gap-4 lg:grid-cols-2">
                <NewsInput label="文字（中文）" value={block.textZh} onChange={value => updateBlock(index, { textZh: value })} textarea/>
                <NewsInput label="文字（英文）" value={block.textEn} onChange={value => updateBlock(index, { textEn: value })} textarea/>
              </div>
            : block.type === 'heading'
              ? <div className="grid gap-4 lg:grid-cols-2">
                  <NewsInput label="小标题（中文）" value={block.titleZh} onChange={value => updateBlock(index, { titleZh: value })}/>
                  <NewsInput label="小标题（英文）" value={block.titleEn} onChange={value => updateBlock(index, { titleEn: value })}/>
                </div>
              : <div className="grid gap-4 lg:grid-cols-2"><div><p className="mb-2 text-xs font-bold text-muted">图片</p><ContentMediaDropzone label={`第 ${index + 1} 段图片`} value={block.image} fieldKey="image" uploadMedia={uploadMedia} mediaLibrary={mediaLibrary} onChange={value => updateBlock(index, { image: value })}/></div><div className="grid content-start gap-4"><NewsInput label="中文替代文字" value={block.altZh || ''} onChange={value => updateBlock(index, { altZh: value })}/><NewsInput label="英文替代文字" value={block.altEn || ''} onChange={value => updateBlock(index, { altEn: value })}/></div></div>}
        </div>)}
        {!blocks.length && <p className="border border-dashed border-slate-300 py-10 text-center text-sm text-muted">还没有内容，请新增文字或图片。</p>}
      </div>
    </div>
  </div>;
}

function createBlankNews(id: number): NewsArticle {
  return {
    id,
    slug: `new-news-${id}`,
    category: 'news-insights',
    categoryZh: '企业新闻与行业资讯',
    categoryEn: 'Company & Industry News',
    date: new Date().toISOString().slice(0, 10),
    image: '',
    titleZh: '',
    titleEn: '',
    summaryZh: '',
    summaryEn: '',
    contentZh: [],
    contentEn: [],
    contentBlocks: []
  };
}

function NewsCollectionEditor({ articles, uploadMedia, mediaLibrary, onChange }: { articles: NewsArticle[]; uploadMedia: UploadMediaFn; mediaLibrary: MediaLibraryItem[]; onChange: (articles: NewsArticle[]) => void }) {
  const [selectedIndex, setSelectedIndex] = useState(articles.length ? 0 : -1);
  useEffect(() => {
    if (selectedIndex >= articles.length) setSelectedIndex(Math.max(articles.length - 1, -1));
  }, [articles.length, selectedIndex]);

  function addNews() {
    const next = [...articles, createBlankNews(Date.now())];
    onChange(next);
    setSelectedIndex(next.length - 1);
  }

  function removeNews(index: number) {
    const next = articles.filter((_, itemIndex) => itemIndex !== index);
    onChange(next);
    setSelectedIndex(Math.min(index, next.length - 1));
  }

  function copyNews(index: number) {
    const source = articles[index];
    const copy = { ...cloneValue(source), id: Date.now(), slug: `${source.slug}-copy` };
    const next = [...articles.slice(0, index + 1), copy, ...articles.slice(index + 1)];
    onChange(next);
    setSelectedIndex(index + 1);
  }

  const selectedArticle = selectedIndex >= 0 ? articles[selectedIndex] : null;
  return <div className="grid gap-6 xl:grid-cols-[18rem_1fr]">
    <aside className="h-fit border border-slate-200 bg-white p-3 xl:sticky xl:top-24">
      <div className="mb-3 flex items-center justify-between gap-2 px-2">
        <p className="text-xs font-bold uppercase tracking-[.16em] text-muted">新闻列表</p>
        <button type="button" onClick={addNews} className="border border-line px-2 py-1 text-xs font-bold hover:border-accent hover:text-accent">新增</button>
      </div>
      <div className="grid gap-1">
        {articles.map((article, index) => <button key={`${article.id}-${index}`} type="button" onClick={() => setSelectedIndex(index)} className={`px-3 py-3 text-left text-sm ${selectedIndex === index ? 'bg-accent text-white' : 'hover:bg-orange-50'}`}>
          <span className="block text-xs font-bold opacity-70">第 {index + 1} 项</span>
          <span className="mt-1 block font-bold">{article.titleZh || article.titleEn || '未命名新闻'}</span>
        </button>)}
        {!articles.length && <p className="px-2 py-8 text-center text-sm text-muted">暂无新闻，请点击新增。</p>}
      </div>
    </aside>
    <div>
      {selectedArticle
        ? <>
            <div className="mb-4 flex flex-wrap justify-end gap-2">
              <button type="button" onClick={() => copyNews(selectedIndex)} className="border border-line px-3 py-2 text-xs font-bold hover:border-accent hover:text-accent">复制当前新闻</button>
              <button type="button" onClick={() => removeNews(selectedIndex)} className="border border-red-200 px-3 py-2 text-xs font-bold text-red-700">删除当前新闻</button>
            </div>
            <NewsEditor article={selectedArticle} uploadMedia={uploadMedia} mediaLibrary={mediaLibrary} onChange={next => onChange(articles.map((item, index) => index === selectedIndex ? next : item))}/>
          </>
        : <div className="border border-dashed border-slate-300 py-16 text-center text-sm text-muted">请选择或新增一条新闻。</div>}
    </div>
  </div>;
}

function ContentPanel({ site, saveSiteContent, uploadMedia, mediaLibrary, saving }: { site: SiteContent; saveSiteContent: ReturnType<typeof useSite>['saveSiteContent']; uploadMedia: UploadMediaFn; mediaLibrary: MediaLibraryItem[]; saving: boolean }) {
  const modules = useMemo(() => buildContentModules(site), [site]);
  const [selectedId, setSelectedId] = useState(() => modules[0]?.id || 'company');
  const selected = modules.find(module => module.id === selectedId) || modules[0];
  const [draft, setDraft] = useState<unknown>(() => selected ? selected.id === 'copy.home' ? homeContentForEditor(getAtPath(site, selected.path)) : cloneValue(getAtPath(site, selected.path)) : {});
  const [notice, setNotice] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    const nextSelected = modules.find(module => module.id === selectedId) || modules[0];
    if (!nextSelected) return;
    setSelectedId(nextSelected.id);
    setDraft(nextSelected.id === 'copy.home' ? homeContentForEditor(getAtPath(site, nextSelected.path)) : cloneValue(getAtPath(site, nextSelected.path)));
  }, [modules, selectedId, site]);

  async function saveModule() {
    if (!selected) return;
    setNotice('');
    setError('');
    try {
      await saveSiteContent(setAtPath(site, selected.path, draft));
      setNotice(`${selected.title}已保存`);
    } catch (error) {
      setError(error instanceof Error ? error.message : '保存失败');
    }
  }

  return <section>
    <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
      <div><p className="text-xs font-bold uppercase tracking-[.18em] text-accent">整站内容</p><h1 className="mt-2 text-3xl font-bold text-ink">按模块编辑图片和文字</h1><p className="mt-2 text-sm text-muted">产品增删请继续使用“产品管理”，这里管理其他页面模块、新闻、导航、FAQ 和联系方式。</p></div>
      <div className="flex flex-wrap gap-3">
        <button onClick={() => downloadJson(`fengtai-site-${new Date().toISOString().slice(0, 10)}.json`, site)} className="inline-flex min-h-11 items-center gap-2 border border-line bg-white px-4 py-3 text-sm font-bold text-ink hover:border-accent hover:text-accent"><Download size={17}/>导出</button>
        <button onClick={saveModule} disabled={saving} className="inline-flex min-h-11 items-center gap-2 bg-accent px-4 py-3 text-sm font-bold text-white hover:bg-accent-hover disabled:opacity-60"><Save size={17}/>{saving?'保存中':'保存当前模块'}</button>
      </div>
    </div>
    {notice&&<div className="mt-5 border border-green-200 bg-green-50 px-4 py-3 text-sm font-semibold text-green-800">{notice}</div>}
    {error&&<div className="mt-5 border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-800">{error}</div>}

    <div className="mt-6 grid gap-6 xl:grid-cols-[18rem_1fr]">
      <aside className="h-fit border border-slate-200 bg-white p-3 xl:sticky xl:top-24">
        <p className="px-2 pb-3 text-xs font-bold uppercase tracking-[.16em] text-muted">内容模块</p>
        <div className="grid max-h-[44rem] gap-1 overflow-auto">
          {modules.map(module => <button key={module.id} onClick={() => { setSelectedId(module.id); setDraft(module.id === 'copy.home' ? homeContentForEditor(getAtPath(site, module.path)) : cloneValue(getAtPath(site, module.path))); setNotice(''); setError(''); }} className={`px-3 py-3 text-left text-sm transition ${selected?.id===module.id?'bg-accent text-white':'hover:bg-orange-50'}`}>
            <span className="block font-bold">{module.title}</span>
            <span className={`mt-1 block text-xs leading-5 ${selected?.id===module.id?'text-white/75':'text-muted'}`}>{module.description}</span>
          </button>)}
        </div>
      </aside>

      <div className="border border-slate-200 bg-white p-5">
        {selected&&<div className="mb-6 border-b border-slate-200 pb-4">
          <p className="text-xs font-bold uppercase tracking-[.14em] text-muted">{selected.id}</p>
          <h2 className="mt-1 text-2xl font-bold text-ink">{selected.title}</h2>
          <p className="mt-2 text-sm text-muted">{selected.description}</p>
        </div>}
        {selected?.id === 'news' && Array.isArray(draft)
          ? <NewsCollectionEditor articles={draft as NewsArticle[]} uploadMedia={uploadMedia} mediaLibrary={mediaLibrary} onChange={next => setDraft(next)}/>
          : selected?.id === 'features' && Array.isArray(draft)
            ? <FeatureShowcaseEditor items={draft as FeatureShowcaseItem[]} uploadMedia={uploadMedia} mediaLibrary={mediaLibrary} onChange={next => setDraft(next)}/>
          : <EditableValue value={draft} onChange={setDraft} fieldKey={selected?.id || 'content'} uploadMedia={uploadMedia} mediaLibrary={mediaLibrary}/>}
        <div className="mt-6 flex justify-end">
          <button onClick={saveModule} disabled={saving} className="inline-flex min-h-11 items-center gap-2 bg-accent px-5 py-3 text-sm font-bold text-white hover:bg-accent-hover disabled:opacity-60"><Save size={17}/>{saving?'保存中':'保存当前模块'}</button>
        </div>
      </div>
    </div>
  </section>;
}

function ProductPanel({ site, saveSite, uploadMedia, mediaLibrary, saving }: { site: ReturnType<typeof useSite>['site']; saveSite: ReturnType<typeof useSite>['saveSite']; uploadMedia: ReturnType<typeof useSite>['uploadMedia']; mediaLibrary: MediaLibraryItem[]; saving: boolean }) {
  const products = site.catalog.products;
  const categories = site.catalog.categories;
  const [selectedId, setSelectedId] = useState<number | null>(() => products[0]?.id ?? null);
  const [draft, setDraft] = useState<Product | null>(() => products[0] ? cloneProduct(products[0]) : createBlankProduct(1));
  const [notice, setNotice] = useState('');
  const [error, setError] = useState('');
  const [uploadingImage, setUploadingImage] = useState('');
  const [stockSpecificationPaste, setStockSpecificationPaste] = useState('');
  const [categoryDrafts, setCategoryDrafts] = useState<ProductCategoryDraft[]>(() => categories.map(cloneCategory));

  useEffect(() => {
    if (selectedId === null) {
      setDraft(current => current || createBlankProduct(nextProductId(products)));
      return;
    }
    if (!products.length) {
      setSelectedId(null);
      setDraft(createBlankProduct(1));
      return;
    }
    const selected = products.find(product => product.id === selectedId) || products[0];
    setSelectedId(selected.id);
    setDraft(cloneProduct(selected));
  }, [products, selectedId]);

  useEffect(() => {
    setCategoryDrafts(categories.map(cloneCategory));
  }, [categories]);

  function updateDraft(patch: Partial<Product>) {
    setDraft(current => current ? { ...current, ...patch } : current);
  }

  function updateCategoryDraft(index: number, patch: Partial<ProductCategory>) {
    setCategoryDrafts(current => current.map((category, itemIndex) => itemIndex === index ? { ...category, ...patch } : category));
  }

  function addCategory() {
    const nextId = slugify(`category-${Date.now()}`);
    setCategoryDrafts(current => [
      ...current,
      {
        id: nextId,
        originalId: undefined,
        group: 'ready-stock',
        titleZh: '新产品大类',
        titleEn: 'New Product Category',
        descriptionZh: '请填写这个大类的中文说明。',
        descriptionEn: 'Please enter the English description for this category.'
      }
    ]);
    setNotice('已新增大类草稿，填写后点击“保存大类设置”');
    setError('');
  }

  function removeCategoryDraft(index: number) {
    const category = categoryDrafts[index];
    if (category?.originalId && products.some(product => product.subcategory === category.originalId)) {
      setError(`大类「${category.titleZh}」下面还有商品，请先把商品移动到其他大类或删除商品。`);
      setNotice('');
      return;
    }
    setCategoryDrafts(current => current.filter((_, itemIndex) => itemIndex !== index));
    setNotice('大类已从草稿中移除，点击“保存大类设置”后生效');
    setError('');
  }

  async function saveCategories() {
    setError('');
    setNotice('');
    const normalized: ProductCategory[] = categoryDrafts.map((category, index) => ({
      id: slugify(category.id || category.titleEn || category.titleZh || `category-${index + 1}`),
      group: category.group,
      titleZh: category.titleZh.trim(),
      titleEn: category.titleEn.trim(),
      descriptionZh: category.descriptionZh.trim(),
      descriptionEn: category.descriptionEn.trim()
    }));
    if (normalized.some(category => !category.titleZh || !category.titleEn || !category.id)) {
      setError('每个大类都需要填写中文名称、英文名称和大类 ID');
      return;
    }
    if (new Set(normalized.map(category => category.id)).size !== normalized.length) {
      setError('大类 ID 不能重复');
      return;
    }
    const removedCategory = categories.find(category => !categoryDrafts.some(next => next.originalId === category.id));
    if (removedCategory && products.some(product => product.subcategory === removedCategory.id)) {
      setError(`大类「${removedCategory.titleZh}」下面还有商品，请先把商品移动到其他大类或删除商品。`);
      return;
    }
    const idMap = new Map<string, ProductCategory>();
    categoryDrafts.forEach((draftCategory, index) => {
      const next = normalized[index];
      if (next && draftCategory.originalId) idMap.set(draftCategory.originalId, next);
    });
    const nextProducts = products.map(product => {
      const nextCategory = idMap.get(product.subcategory) || normalized.find(category => category.id === product.subcategory);
      if (!nextCategory) return product;
      return {
        ...product,
        group: nextCategory.group,
        subcategory: nextCategory.id,
        categoryZh: categoryLabel(nextCategory),
        categoryEn: categoryLabelEn(nextCategory)
      };
    });
    await saveSite({ ...site, catalog: { ...site.catalog, categories: normalized, products: nextProducts } });
    setNotice('大类设置已保存');
  }

  function selectCategory(subcategory: string) {
    const category = categories.find(item => item.id === subcategory);
    if (!category) {
      updateDraft({ subcategory });
      return;
    }
    updateDraft({
      group: category.group,
      subcategory: category.id,
      categoryZh: categoryLabel(category),
      categoryEn: categoryLabelEn(category)
    });
  }

  function selectGroup(group: Product['group']) {
    const nextCategory = categories.find(category => category.group === group);
    updateDraft({ group });
    if (nextCategory) selectCategory(nextCategory.id);
  }

  function updateSpecification(index: number, patch: Partial<ProductSpecification>) {
    setDraft(current => {
      if (!current) return current;
      const specifications = [...(current.specifications || [])];
      const next = { ...(specifications[index] || createProductSpecification()), ...patch };
      if (patch.id) {
        const preset = productSpecificationPresets.find(item => item.id === patch.id);
        if (preset) {
          next.labelZh = preset.labelZh;
          next.labelEn = preset.labelEn;
        }
      }
      specifications[index] = next;
      return { ...current, specifications };
    });
  }

  function addSpecification() {
    setDraft(current => current ? { ...current, specifications: [...(current.specifications || []), createProductSpecification()] } : current);
  }

  function removeSpecification(index: number) {
    setDraft(current => current ? { ...current, specifications: (current.specifications || []).filter((_, itemIndex) => itemIndex !== index) } : current);
  }

  function updateBeddingSpecification(index: number, patch: Partial<BeddingSpecification>) {
    setDraft(current => {
      if (!current) return current;
      const beddingSpecifications = [...(current.beddingSpecifications || [])];
      beddingSpecifications[index] = { ...(beddingSpecifications[index] || createBeddingSpecification()), ...patch };
      return { ...current, beddingSpecifications };
    });
  }

  function addBeddingSpecification() {
    setDraft(current => current ? { ...current, beddingSpecifications: [...(current.beddingSpecifications || []), createBeddingSpecification()] } : current);
  }

  function removeBeddingSpecification(index: number) {
    setDraft(current => current ? { ...current, beddingSpecifications: (current.beddingSpecifications || []).filter((_, itemIndex) => itemIndex !== index) } : current);
  }

  function updateStockSpecification(index: number, patch: Partial<StockSpecification>) {
    setDraft(current => {
      if (!current) return current;
      const stockSpecifications = [...(current.stockSpecifications || [])];
      stockSpecifications[index] = { ...(stockSpecifications[index] || createStockSpecification()), ...patch };
      return { ...current, stockSpecifications };
    });
  }

  function addStockSpecification() {
    setDraft(current => current ? { ...current, stockSpecifications: [...(current.stockSpecifications || []), createStockSpecification()] } : current);
  }

  function removeStockSpecification(index: number) {
    setDraft(current => current ? { ...current, stockSpecifications: (current.stockSpecifications || []).filter((_, itemIndex) => itemIndex !== index) } : current);
  }

  function importStockSpecifications() {
    const rows = stockSpecificationPaste
      .split(/\r?\n/)
      .map(line => line.trim())
      .filter(Boolean)
      .map(line => line.split(/\t| {2,}/).map(value => value.trim()))
      .map(columns => ({
        no: columns[0] || '',
        composition: columns[1] || '',
        yarnCount: columns[2] || '',
        density: columns[3] || '',
        width: columns[4] || '',
        weave: columns[5] || '',
        pkg: columns[6] || ''
      }))
      .filter(row => Object.values(row).some(Boolean));
    if (!rows.length) {
      setError('没有识别到可导入的规格行，请使用制表符分列后再粘贴。');
      return;
    }
    setDraft(current => current ? { ...current, stockSpecifications: rows } : current);
    setStockSpecificationPaste('');
    setError('');
    setNotice(`已导入 ${rows.length} 条批量规格，点击“保存产品”后生效`);
  }

  async function replaceProductImage(file: File, target: 'main' | number) {
    if (!draft) return;
    const uploadTarget = target === 'main' ? 'main' : `gallery-${target}`;
    setUploadingImage(uploadTarget);
    setError('');
    setNotice('');
    try {
      const url = await uploadMedia(file);
      if (target === 'main') {
        updateDraft({ image: url });
      } else {
        const gallery = [...(draft.gallery || [])];
        gallery[target] = url;
        updateDraft({ gallery });
      }
      setNotice('图片已上传到媒体库，保存产品后生效');
    } catch (error) {
      setError(error instanceof Error ? error.message : '图片上传失败');
    } finally {
      setUploadingImage('');
    }
  }

  function addGalleryImage() {
    setDraft(current => current ? { ...current, gallery: [...(current.gallery || []), ''] } : current);
    setNotice('');
    setError('');
  }

  function selectProductImage(url: string, target: 'main' | number) {
    if (target === 'main') {
      updateDraft({ image: url });
    } else {
      setDraft(current => {
        if (!current) return current;
        const gallery = [...(current.gallery || [])];
        gallery[target] = url;
        return { ...current, gallery };
      });
    }
    setNotice('已从媒体库选择图片，保存产品后生效');
    setError('');
  }

  function removeGalleryImage(index: number) {
    setDraft(current => current ? { ...current, gallery: (current.gallery || []).filter((_, itemIndex) => itemIndex !== index) } : current);
  }

  async function saveDraft() {
    if (!draft) return;
    setError('');
    setNotice('');
    if (!draft.nameZh.trim() || !draft.nameEn.trim()) {
      setError('产品中英文名称不能为空');
      return;
    }
    if (!Number.isInteger(draft.id) || draft.id < 1) {
      setError('产品编号必须是大于 0 的整数');
      return;
    }
    const normalized = {
      ...draft,
      slug: slugify(draft.slug || draft.nameEn),
      specsZh: draft.specsZh.map(item => item.trim()).filter(Boolean),
      specsEn: draft.specsEn.map(item => item.trim()).filter(Boolean),
      gallery: (draft.gallery || []).filter(Boolean),
      specifications: (draft.specifications || []).filter(item => item.valueZh.trim() || item.valueEn.trim()),
      beddingSpecifications: (draft.beddingSpecifications || []).filter(item => item.labelZh.trim() || item.labelEn.trim() || item.valueZh.trim() || item.valueEn.trim()),
      stockSpecifications: (draft.stockSpecifications || []).filter(item => Object.values(item).some(value => value.trim()))
    };
    const duplicate = products.find(product => product.slug === normalized.slug && product.id !== selectedId);
    if (duplicate) {
      setError('产品链接 slug 已存在，请换一个');
      return;
    }
    const duplicateId = products.find(product => product.id === normalized.id && product.id !== selectedId);
    if (duplicateId) {
      setError(`产品编号 ${normalized.id} 已存在，请换一个`);
      return;
    }
    const exists = selectedId !== null && products.some(product => product.id === selectedId);
    const nextProducts = exists
      ? products.map(product => product.id === selectedId ? normalized : product)
      : [...products, normalized];
    await saveSite({ ...site, catalog: { ...site.catalog, products: nextProducts } });
    setSelectedId(normalized.id);
    setNotice('产品已保存');
  }

  function addProduct() {
    const category = categories[0];
    const product = category
      ? {
          ...createBlankProduct(nextProductId(products)),
          group: category.group,
          subcategory: category.id,
          categoryZh: categoryLabel(category),
          categoryEn: categoryLabelEn(category)
        }
      : createBlankProduct(nextProductId(products));
    setSelectedId(null);
    setDraft(product);
    setNotice('');
    setError('');
  }

  function copyProduct() {
    if (!draft) return;
    const id = nextProductId(products);
    const product = {
      ...cloneProduct(draft),
      id,
      slug: `${slugify(draft.slug)}-${id}`,
      nameZh: `${draft.nameZh} 副本`,
      nameEn: `${draft.nameEn} Copy`
    };
    setSelectedId(null);
    setDraft(product);
    setNotice('已复制为新产品，保存后生效');
    setError('');
  }

  async function deleteProduct() {
    if (!draft) return;
    if (!products.some(product => product.id === draft.id)) {
      setSelectedId(products[0]?.id ?? null);
      setDraft(products[0] ? cloneProduct(products[0]) : createBlankProduct(1));
      setNotice('未保存的新产品已取消');
      return;
    }
    if (!window.confirm(`确定删除产品「${draft.nameZh}」吗？`)) return;
    const nextProducts = products.filter(product => product.id !== draft.id);
    await saveSite({ ...site, catalog: { ...site.catalog, products: nextProducts } });
    const next = nextProducts[0] || createBlankProduct(1);
    setSelectedId(nextProducts[0]?.id ?? null);
    setDraft(cloneProduct(next));
    setNotice('产品已删除');
  }

  const specZhText = draft?.specsZh.join('\n') ?? '';
  const specEnText = draft?.specsEn.join('\n') ?? '';
  const groupedProducts = categories.map(category => ({
    category,
    products: products.filter(product => product.subcategory === category.id)
  }));
  const uncategorizedProducts = products.filter(product => !categories.some(category => category.id === product.subcategory));
  const selectedCategory = draft ? categories.find(category => category.id === draft.subcategory) : null;

  return <section>
    <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
      <div><p className="text-xs font-bold uppercase tracking-[.18em] text-accent">产品管理</p><h1 className="mt-2 text-3xl font-bold text-ink">增删与编辑产品</h1><p className="mt-2 text-sm text-muted">这里编辑的是前台产品列表和产品详情页数据。</p></div>
      <div className="flex flex-wrap gap-3">
        <button onClick={addProduct} className="inline-flex min-h-11 items-center gap-2 bg-accent px-4 py-3 text-sm font-bold text-white hover:bg-accent-hover"><UserPlus size={17}/>新增产品</button>
        <button onClick={copyProduct} className="inline-flex min-h-11 items-center gap-2 border border-line bg-white px-4 py-3 text-sm font-bold text-ink hover:border-accent hover:text-accent">复制当前产品</button>
      </div>
    </div>
    {notice&&<div className="mt-5 border border-green-200 bg-green-50 px-4 py-3 text-sm font-semibold text-green-800">{notice}</div>}
    {error&&<div className="mt-5 border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-800">{error}</div>}

    <div className="mt-6 border border-slate-200 bg-white p-5">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <p className="text-xs font-bold uppercase tracking-[.16em] text-accent">产品大类</p>
          <h2 className="mt-2 text-xl font-bold text-ink">大类增删与前台分组</h2>
          <p className="mt-1 text-sm leading-6 text-muted">这里管理前台产品页的大类，例如床品面料、服装面料。每个商品在下方选择所属大类。</p>
        </div>
        <div className="flex flex-wrap gap-3">
          <button type="button" onClick={addCategory} className="inline-flex min-h-10 items-center gap-2 border border-line bg-white px-4 text-sm font-bold text-ink hover:border-accent hover:text-accent">新增大类</button>
          <button type="button" onClick={() => void saveCategories()} disabled={saving} className="inline-flex min-h-10 items-center gap-2 bg-accent px-4 text-sm font-bold text-white hover:bg-accent-hover disabled:opacity-60"><Save size={16}/>{saving?'保存中':'保存大类设置'}</button>
        </div>
      </div>
      <div className="mt-5 grid gap-4">
        {categoryDrafts.map((category, index) => {
          const productCount = category.originalId ? products.filter(product => product.subcategory === category.originalId).length : 0;
          return <div key={`${category.id}-${index}`} className="grid gap-3 border border-slate-200 bg-slate-50 p-4 xl:grid-cols-[9rem_10rem_1fr_1fr_auto]">
            <label className="text-xs font-bold text-muted">
              大类 ID
              <input value={category.id} onChange={event=>updateCategoryDraft(index, { id: slugify(event.target.value) })} className="mt-2 min-h-10 w-full border border-line bg-white px-3 font-mono text-xs text-ink outline-none focus:border-accent"/>
            </label>
            <label className="text-xs font-bold text-muted">
              前台路径
              <select value={category.group} onChange={event=>updateCategoryDraft(index, { group: event.target.value as ProductCategory['group'] })} className="mt-2 min-h-10 w-full border border-line bg-white px-3 text-sm text-ink outline-none focus:border-accent">
                <option value="ready-stock">常规现货</option>
                <option value="custom-weaving">定制织造</option>
              </select>
            </label>
            <div className="grid gap-3 sm:grid-cols-2">
              <label className="text-xs font-bold text-muted">
                中文大类名
                <input value={category.titleZh} onChange={event=>updateCategoryDraft(index, { titleZh: event.target.value })} className="mt-2 min-h-10 w-full border border-line bg-white px-3 text-sm text-ink outline-none focus:border-accent"/>
              </label>
              <label className="text-xs font-bold text-muted">
                英文大类名
                <input value={category.titleEn} onChange={event=>updateCategoryDraft(index, { titleEn: event.target.value })} className="mt-2 min-h-10 w-full border border-line bg-white px-3 text-sm text-ink outline-none focus:border-accent"/>
              </label>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              <label className="text-xs font-bold text-muted">
                中文说明
                <textarea value={category.descriptionZh} onChange={event=>updateCategoryDraft(index, { descriptionZh: event.target.value })} className="mt-2 min-h-20 w-full border border-line bg-white p-3 text-sm text-ink outline-none focus:border-accent"/>
              </label>
              <label className="text-xs font-bold text-muted">
                英文说明
                <textarea value={category.descriptionEn} onChange={event=>updateCategoryDraft(index, { descriptionEn: event.target.value })} className="mt-2 min-h-20 w-full border border-line bg-white p-3 text-sm text-ink outline-none focus:border-accent"/>
              </label>
            </div>
            <div className="flex flex-row items-center justify-between gap-3 xl:flex-col xl:items-end">
              <span className="text-xs font-semibold text-muted">{productCount} 个商品</span>
              <button type="button" onClick={()=>removeCategoryDraft(index)} className="text-xs font-bold text-red-700 hover:text-red-900">删除大类</button>
            </div>
          </div>;
        })}
        {!categoryDrafts.length&&<div className="border border-dashed border-slate-300 bg-slate-50 px-4 py-6 text-sm font-semibold text-muted">暂无产品大类，请先新增大类。</div>}
      </div>
    </div>

    <div className="mt-6 grid gap-6 xl:grid-cols-[20rem_1fr]">
      <aside className="h-fit border border-slate-200 bg-white p-3">
        <p className="px-2 pb-3 text-xs font-bold uppercase tracking-[.16em] text-muted">产品列表</p>
        <div className="grid max-h-[44rem] gap-1 overflow-auto">
          {groupedProducts.map(group => <div key={group.category.id} className="border-t border-slate-100 pt-2 first:border-t-0 first:pt-0">
            <p className="px-2 py-2 text-[11px] font-bold text-muted">{group.category.group === 'ready-stock' ? '常规在机现货' : '定制织造'} · {group.category.titleZh}</p>
            {group.products.length ? group.products.map(product => <button key={product.id} onClick={() => { setSelectedId(product.id); setDraft(cloneProduct(product)); setNotice(''); setError(''); }} className={`w-full px-3 py-3 text-left text-sm transition ${draft?.id===product.id?'bg-accent text-white':'hover:bg-orange-50'}`}>
              <span className="block font-bold">{product.nameZh}</span>
              <span className={`mt-1 block text-xs ${draft?.id===product.id?'text-white/75':'text-muted'}`}>P-{String(product.id).padStart(2,'0')} · {product.slug}</span>
            </button>) : <p className="px-3 py-3 text-xs text-muted">这个大类下暂无商品</p>}
          </div>)}
          {uncategorizedProducts.map(product => <button key={product.id} onClick={() => { setSelectedId(product.id); setDraft(cloneProduct(product)); setNotice(''); setError(''); }} className={`px-3 py-3 text-left text-sm transition ${draft?.id===product.id?'bg-accent text-white':'hover:bg-orange-50'}`}>
            <span className="block font-bold">{product.nameZh}</span>
            <span className={`mt-1 block text-xs ${draft?.id===product.id?'text-white/75':'text-muted'}`}>未归类 · {product.slug}</span>
          </button>)}
        </div>
      </aside>

      {draft&&<div className="border border-slate-200 bg-white p-5">
        <div className="mb-6 grid gap-4 border-b border-slate-200 pb-5 lg:grid-cols-[13rem_1fr]">
          <div className="aspect-[4/3] overflow-hidden bg-slate-100">
            {draft.image?<img src={draft.image} alt={draft.nameZh} className="size-full object-cover"/>:<div className="flex size-full items-center justify-center text-sm text-muted">暂无主图</div>}
          </div>
          <div className="flex flex-col justify-between gap-4">
            <div>
              <p className="font-mono text-xs font-bold uppercase tracking-[.16em] text-accent">Fabric passport · P-{String(draft.id).padStart(2,'0')}</p>
              <h2 className="mt-2 text-2xl font-bold text-ink">{draft.nameZh || '未命名产品'}</h2>
              <p className="mt-2 text-sm leading-6 text-muted">{selectedCategory ? `${selectedCategory.group === 'ready-stock' ? '常规在机现货' : '定制织造'} / ${selectedCategory.titleZh}` : '未匹配前台分区'}</p>
            </div>
            <div className="grid gap-2 text-xs text-muted sm:grid-cols-3">
              <span className="border border-line px-3 py-2">列表：折叠条目</span>
              <span className="border border-line px-3 py-2">详情：面料护照</span>
              <span className="border border-line px-3 py-2">补充规格：可编辑</span>
            </div>
          </div>
        </div>

        <div className="grid gap-5 lg:grid-cols-2">
          <ProductEditorField label="产品编号"><input type="number" min="1" step="1" value={draft.id} onChange={event=>updateDraft({id: Number(event.target.value)})} className="min-h-11 w-full border border-line px-3 font-mono outline-none focus:border-accent"/></ProductEditorField>
          <ProductEditorField label="中文名称"><input value={draft.nameZh} onChange={event=>updateDraft({nameZh:event.target.value})} className="min-h-11 w-full border border-line px-3 outline-none focus:border-accent"/></ProductEditorField>
          <ProductEditorField label="英文名称"><input value={draft.nameEn} onChange={event=>updateDraft({nameEn:event.target.value})} className="min-h-11 w-full border border-line px-3 outline-none focus:border-accent"/></ProductEditorField>
          <ProductEditorField label="产品链接 slug"><input value={draft.slug} onChange={event=>updateDraft({slug:event.target.value})} className="min-h-11 w-full border border-line px-3 font-mono text-sm outline-none focus:border-accent"/></ProductEditorField>
          <ProductEditorField label="前台业务路径"><select value={draft.group} onChange={event=>selectGroup(event.target.value as Product['group'])} className="min-h-11 w-full border border-line px-3 outline-none focus:border-accent"><option value="ready-stock">常规在机现货</option><option value="custom-weaving">来样定织</option></select></ProductEditorField>
          <ProductEditorField label="前台产品分区"><select value={draft.subcategory} onChange={event=>selectCategory(event.target.value)} className="min-h-11 w-full border border-line px-3 outline-none focus:border-accent">{categories.map(category=><option key={category.id} value={category.id}>{category.group === 'ready-stock' ? '现货' : '定织'} · {category.titleZh}</option>)}</select></ProductEditorField>
          <ProductEditorField label="详情页分类显示"><input value={draft.categoryZh} onChange={event=>updateDraft({categoryZh:event.target.value})} className="min-h-11 w-full border border-line px-3 outline-none focus:border-accent"/></ProductEditorField>
          <ProductEditorField label="详情页英文分类"><input value={draft.categoryEn} onChange={event=>updateDraft({categoryEn:event.target.value})} className="min-h-11 w-full border border-line px-3 outline-none focus:border-accent"/></ProductEditorField>
        </div>

        <div className="mt-5 grid gap-5 lg:grid-cols-2">
          <ProductEditorField label="中文简介"><textarea value={draft.summaryZh} onChange={event=>updateDraft({summaryZh:event.target.value})} className="min-h-28 w-full border border-line p-3 outline-none focus:border-accent"/></ProductEditorField>
          <ProductEditorField label="英文简介"><textarea value={draft.summaryEn} onChange={event=>updateDraft({summaryEn:event.target.value})} className="min-h-28 w-full border border-line p-3 outline-none focus:border-accent"/></ProductEditorField>
          <ProductEditorField label="中文规格，每行一条"><textarea value={specZhText} onChange={event=>updateDraft({specsZh:event.target.value.split('\n').map(item=>item.trim()).filter(Boolean)})} className="min-h-36 w-full border border-line p-3 outline-none focus:border-accent"/></ProductEditorField>
          <ProductEditorField label="英文规格，每行一条"><textarea value={specEnText} onChange={event=>updateDraft({specsEn:event.target.value.split('\n').map(item=>item.trim()).filter(Boolean)})} className="min-h-36 w-full border border-line p-3 outline-none focus:border-accent"/></ProductEditorField>
        </div>

        <div className="mt-6 border-t border-line pt-6">
          <div className="flex flex-wrap items-end justify-between gap-3">
            <div>
              <p className="text-sm font-bold text-ink">补充规格表</p>
              <p className="mt-1 text-xs leading-5 text-muted">这里可为任何产品增加额外规格表，例如服装面料的克重、门幅、成分、适用服装、后整理等。</p>
            </div>
            <button type="button" onClick={addBeddingSpecification} className="border border-line px-3 py-2 text-xs font-bold text-ink hover:border-accent hover:text-accent">新增补充规格</button>
          </div>
          <div className="mt-4 grid gap-4">
            {(draft.beddingSpecifications || []).map((specification, index) => <div key={index} className="grid gap-3 border border-slate-200 bg-slate-50 p-3 lg:grid-cols-[.75fr_.75fr_1.3fr_1.3fr_auto]">
              <input value={specification.labelZh} onChange={event=>updateBeddingSpecification(index, { labelZh: event.target.value })} placeholder="中文标签" className="min-h-11 border border-line bg-white px-3 text-sm outline-none focus:border-accent"/>
              <input value={specification.labelEn} onChange={event=>updateBeddingSpecification(index, { labelEn: event.target.value })} placeholder="英文标签" className="min-h-11 border border-line bg-white px-3 text-sm outline-none focus:border-accent"/>
              <textarea value={specification.valueZh} onChange={event=>updateBeddingSpecification(index, { valueZh: event.target.value })} placeholder="中文规格值" className="min-h-24 border border-line bg-white p-3 text-sm outline-none focus:border-accent"/>
              <textarea value={specification.valueEn} onChange={event=>updateBeddingSpecification(index, { valueEn: event.target.value })} placeholder="英文规格值" className="min-h-24 border border-line bg-white p-3 text-sm outline-none focus:border-accent"/>
              <button type="button" onClick={()=>removeBeddingSpecification(index)} className="self-start text-xs font-bold text-red-700 hover:text-red-900">删除</button>
            </div>)}
            {!(draft.beddingSpecifications || []).length&&<p className="border border-dashed border-slate-300 bg-slate-50 px-4 py-5 text-sm text-muted">暂无补充规格，详情页不会显示补充规格表。</p>}
          </div>
        </div>

        <div className="mt-6 border-t border-line pt-6">
          <div className="flex flex-wrap items-end justify-between gap-3">
            <div>
              <p className="text-sm font-bold text-ink">批量规格表</p>
              <p className="mt-1 text-xs leading-5 text-muted">适合录入多条现货或在机规格。列与客户常用表格一致：No.、Comp.、Yarn count、Density、Width、Weave、Pkg。</p>
            </div>
            <button type="button" onClick={addStockSpecification} className="border border-line px-3 py-2 text-xs font-bold text-ink hover:border-accent hover:text-accent">新增规格行</button>
          </div>
          <div className="mt-4 border border-slate-200 bg-slate-50 p-4">
            <label className="block text-xs font-bold text-ink">
              批量粘贴导入
              <textarea value={stockSpecificationPaste} onChange={event=>setStockSpecificationPaste(event.target.value)} placeholder={'每行一条，按 No.、Comp.、Yarn count、Density、Width、Weave、Pkg 的顺序粘贴。\n例如：1\t100%C\tOE16*OE12\t108*56\t63"\t3/1\t400M'} className="mt-2 min-h-32 w-full border border-line bg-white p-3 font-mono text-xs leading-6 outline-none focus:border-accent"/>
            </label>
            <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
              <p className="text-xs leading-5 text-muted">支持从 Excel、WPS 或聊天记录直接粘贴。导入会替换当前表格中的全部行。</p>
              <button type="button" onClick={importStockSpecifications} className="border border-line bg-white px-3 py-2 text-xs font-bold text-ink hover:border-accent hover:text-accent">导入并替换表格</button>
            </div>
          </div>
          <div className="mt-4 overflow-x-auto border border-slate-200">
            {(draft.stockSpecifications || []).length ? <table className="min-w-[970px] w-full border-collapse text-sm">
              <thead className="bg-slate-100 text-left text-xs font-bold uppercase tracking-[.06em] text-muted">
                <tr>
                  <th className="border-b border-slate-200 px-3 py-3">No.</th>
                  <th className="border-b border-slate-200 px-3 py-3">Comp.</th>
                  <th className="border-b border-slate-200 px-3 py-3">Yarn count</th>
                  <th className="border-b border-slate-200 px-3 py-3">Density</th>
                  <th className="border-b border-slate-200 px-3 py-3">Width</th>
                  <th className="border-b border-slate-200 px-3 py-3">Weave</th>
                  <th className="border-b border-slate-200 px-3 py-3">Pkg</th>
                  <th className="border-b border-slate-200 px-3 py-3">操作</th>
                </tr>
              </thead>
              <tbody>
                {(draft.stockSpecifications || []).map((specification, index) => <tr key={index} className="bg-white">
                  <td className="border-b border-slate-200 p-2"><input value={specification.no} onChange={event=>updateStockSpecification(index, { no: event.target.value })} placeholder="1" className="min-h-10 w-16 border border-line px-2 outline-none focus:border-accent"/></td>
                  <td className="border-b border-slate-200 p-2"><input value={specification.composition} onChange={event=>updateStockSpecification(index, { composition: event.target.value })} placeholder="100%C" className="min-h-10 w-28 border border-line px-2 outline-none focus:border-accent"/></td>
                  <td className="border-b border-slate-200 p-2"><input value={specification.yarnCount} onChange={event=>updateStockSpecification(index, { yarnCount: event.target.value })} placeholder="OE16*OE12" className="min-h-10 w-36 border border-line px-2 outline-none focus:border-accent"/></td>
                  <td className="border-b border-slate-200 p-2"><input value={specification.density} onChange={event=>updateStockSpecification(index, { density: event.target.value })} placeholder="108*56" className="min-h-10 w-28 border border-line px-2 outline-none focus:border-accent"/></td>
                  <td className="border-b border-slate-200 p-2"><input value={specification.width} onChange={event=>updateStockSpecification(index, { width: event.target.value })} placeholder={'63"'} className="min-h-10 w-24 border border-line px-2 outline-none focus:border-accent"/></td>
                  <td className="border-b border-slate-200 p-2"><input value={specification.weave} onChange={event=>updateStockSpecification(index, { weave: event.target.value })} placeholder="3/1" className="min-h-10 w-24 border border-line px-2 outline-none focus:border-accent"/></td>
                  <td className="border-b border-slate-200 p-2"><input value={specification.pkg} onChange={event=>updateStockSpecification(index, { pkg: event.target.value })} placeholder="400M" className="min-h-10 w-28 border border-line px-2 outline-none focus:border-accent"/></td>
                  <td className="border-b border-slate-200 p-2"><button type="button" onClick={()=>removeStockSpecification(index)} className="text-xs font-bold text-red-700 hover:text-red-900">删除</button></td>
                </tr>)}
              </tbody>
            </table> : <p className="px-4 py-5 text-sm text-muted">暂无批量规格，详情页不会显示此表。</p>}
          </div>
        </div>

        <div className="mt-6 border-t border-line pt-6">
          <div className="flex flex-wrap items-end justify-between gap-3">
            <div>
              <p className="text-sm font-bold text-ink">产品图片</p>
              <p className="mt-1 text-xs leading-5 text-muted">把本地图片拖到对应位置即可替换；上传完成后点击“保存产品”。</p>
            </div>
            <button type="button" onClick={addGalleryImage} className="border border-line px-3 py-2 text-xs font-bold text-ink hover:border-accent hover:text-accent">新增图库位置</button>
          </div>
          <div className="mt-4 grid gap-5 lg:grid-cols-2">
            <ProductImageDropzone
              label="产品主图"
              value={draft.image}
              alt={draft.nameZh}
              uploading={uploadingImage === 'main'}
              mediaLibrary={mediaLibrary}
              onFile={file => replaceProductImage(file, 'main')}
              onSelect={url => selectProductImage(url, 'main')}
            />
            {(draft.gallery || []).map((image, index) => <div key={`${index}-${image}`} className="relative">
              <ProductImageDropzone
                label={`图库图片 ${index + 1}`}
                value={image}
                alt={`${draft.nameZh} 图片 ${index + 1}`}
                uploading={uploadingImage === `gallery-${index}`}
                mediaLibrary={mediaLibrary}
                onFile={file => replaceProductImage(file, index)}
                onSelect={url => selectProductImage(url, index)}
              />
              <button type="button" onClick={() => removeGalleryImage(index)} className="mt-2 text-xs font-bold text-red-700 hover:text-red-900">删除这个图库位置</button>
            </div>)}
          </div>
        </div>

        <div className="mt-6 flex flex-wrap justify-between gap-3">
          <button onClick={deleteProduct} className="inline-flex min-h-11 items-center gap-2 border border-red-300 bg-white px-4 py-3 text-sm font-bold text-red-800 hover:bg-red-100"><RotateCcw size={17}/>删除产品</button>
          <button onClick={saveDraft} disabled={saving} className="inline-flex min-h-11 items-center gap-2 bg-accent px-5 py-3 text-sm font-bold text-white hover:bg-accent-hover disabled:opacity-60"><Save size={17}/>{saving?'保存中':'保存产品'}</button>
        </div>
      </div>}
    </div>
  </section>;
}

function UsersPanel({ permissions, adminUser }: { permissions: Permission[]; adminUser: AdminUser | null }) {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [sessions, setSessions] = useState<AdminSessionRecord[]>([]);
  const [form, setForm] = useState({ username: '', displayName: '', password: '', role: 'editor' as AdminRole });
  const [notice, setNotice] = useState('');
  const [error, setError] = useState('');
  const isOwner = adminUser?.role === 'owner';

  async function refresh() {
    setUsers(await listUsers());
    if (isOwner) {
      setSessions(await listAdminSessions());
    } else {
      setSessions([]);
    }
  }

  useEffect(() => {
    void refresh().catch(error => setError(error instanceof Error ? error.message : '用户加载失败'));
  }, [isOwner]);

  async function submit(event: FormEvent) {
    event.preventDefault();
    setError('');
    setNotice('');
    try {
      await createUser(form);
      setForm({ username: '', displayName: '', password: '', role: 'editor' });
      await refresh();
      setNotice('用户已创建');
    } catch (error) {
      setError(error instanceof Error ? error.message : '创建失败');
    }
  }

  async function changeUser(user: AdminUser, patch: Partial<Pick<AdminUser, 'active' | 'role' | 'displayName'>>) {
    setError('');
    const updated = await updateUser(user.id, patch);
    setUsers(current => current.map(item => item.id === updated.id ? updated : item));
    if (isOwner) await refresh();
  }

  async function forceLogout(session: AdminSessionRecord) {
    if (!window.confirm(`确定下线「${session.displayName || session.username}」这个在线设备吗？`)) return;
    setError('');
    setNotice('');
    try {
      await revokeAdminSession(session.id);
      await refresh();
      setNotice('在线设备已强制下线');
    } catch (error) {
      setError(error instanceof Error ? error.message : '强制下线失败');
    }
  }

  const manageableUsers = users.filter(user => user.role !== 'owner');
  const canCreateUsers = can(permissions, 'users:create');

  return <section>
    <div><p className="text-xs font-bold uppercase tracking-[.18em] text-accent">权限管理</p><h1 className="mt-2 text-3xl font-bold text-ink">用户与权限</h1></div>
    {notice&&<div className="mt-5 border border-green-200 bg-green-50 px-4 py-3 text-sm font-semibold text-green-800">{notice}</div>}
    {error&&<div className="mt-5 border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-800">{error}</div>}
    {canCreateUsers&&<form onSubmit={submit} className="mt-6 grid gap-3 border border-slate-200 bg-white p-5 lg:grid-cols-[1fr_1fr_1fr_10rem_auto]">
      <input value={form.username} onChange={event=>setForm({...form,username:event.target.value})} className="min-h-11 border border-line px-3 text-sm outline-none focus:border-accent" placeholder="账号"/>
      <input value={form.displayName} onChange={event=>setForm({...form,displayName:event.target.value})} className="min-h-11 border border-line px-3 text-sm outline-none focus:border-accent" placeholder="显示名称"/>
      <input value={form.password} onChange={event=>setForm({...form,password:event.target.value})} className="min-h-11 border border-line px-3 text-sm outline-none focus:border-accent" placeholder="初始密码，至少 8 位" type="password"/>
      <select value={form.role} onChange={event=>setForm({...form,role:event.target.value as AdminRole})} className="min-h-11 border border-line px-3 text-sm outline-none focus:border-accent">
        {isOwner&&<option value="owner">{roleLabels.owner}</option>}
        {(['admin','editor','viewer'] as AdminRole[]).map(role=><option key={role} value={role}>{roleLabels[role]}</option>)}
      </select>
      <button className="inline-flex min-h-11 items-center justify-center gap-2 bg-accent px-4 text-sm font-bold text-white hover:bg-accent-hover"><UserPlus size={17}/>创建</button>
    </form>}
    <div className="mt-6 overflow-x-auto border border-slate-200 bg-white">
      <table className="min-w-full text-left text-sm">
        <thead className="bg-slate-50 text-xs font-bold uppercase tracking-[.12em] text-muted"><tr><th className="px-4 py-3">用户</th><th className="px-4 py-3">角色</th><th className="px-4 py-3">状态</th><th className="px-4 py-3">最近登录</th><th className="px-4 py-3">操作</th></tr></thead>
        <tbody>{manageableUsers.map(user=><tr key={user.id} className="border-t border-slate-200">
          <td className="px-4 py-3"><p className="font-bold text-ink">{user.displayName}</p><p className="text-xs text-muted">{user.username}</p></td>
          <td className="px-4 py-3"><select value={user.role} onChange={event=>void changeUser(user,{role:event.target.value as AdminRole})} className="border border-line px-2 py-2 text-sm"><option value="admin">{roleLabels.admin}</option><option value="editor">{roleLabels.editor}</option><option value="viewer">{roleLabels.viewer}</option></select></td>
          <td className="px-4 py-3">{user.active?'启用':'停用'}</td>
          <td className="px-4 py-3 text-xs text-muted">{user.lastLoginAt || '-'}</td>
          <td className="px-4 py-3"><button onClick={()=>void changeUser(user,{active:!user.active})} className="border border-line px-3 py-2 text-xs font-bold hover:border-accent hover:text-accent">{user.active?'停用':'启用'}</button></td>
        </tr>)}</tbody>
      </table>
      {!manageableUsers.length&&<div className="border-t border-slate-200 px-4 py-8 text-sm font-semibold text-muted">暂无可管理用户。</div>}
    </div>
    {isOwner&&<div className="mt-8 border border-slate-200 bg-white">
      <div className="border-b border-slate-200 px-5 py-4">
        <h2 className="text-xl font-bold text-ink">当前在线设备</h2>
        <p className="mt-1 text-sm text-muted">同一个账号只允许一个设备在线；新登录会自动踢掉旧设备。</p>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full text-left text-sm">
          <thead className="bg-slate-50 text-xs font-bold uppercase tracking-[.12em] text-muted"><tr><th className="px-4 py-3">用户</th><th className="px-4 py-3">登录 IP</th><th className="px-4 py-3">设备</th><th className="px-4 py-3">最近在线</th><th className="px-4 py-3">过期时间</th><th className="px-4 py-3">操作</th></tr></thead>
          <tbody>{sessions.map(session=><tr key={session.id} className="border-t border-slate-200">
            <td className="px-4 py-3"><p className="font-bold text-ink">{session.displayName}</p><p className="text-xs text-muted">{session.username} · {roleLabels[session.role]}</p></td>
            <td className="px-4 py-3 text-xs text-muted">{session.ip || '-'}</td>
            <td className="max-w-md px-4 py-3"><p className="line-clamp-2 text-xs leading-5 text-muted">{session.userAgent || '-'}</p></td>
            <td className="px-4 py-3 text-xs text-muted">{session.lastSeenAt}</td>
            <td className="px-4 py-3 text-xs text-muted">{session.expiresAt}</td>
            <td className="px-4 py-3"><button onClick={()=>void forceLogout(session)} className="border border-red-200 px-3 py-2 text-xs font-bold text-red-700 hover:bg-red-50">强制下线</button></td>
          </tr>)}</tbody>
        </table>
        {!sessions.length&&<div className="border-t border-slate-200 px-4 py-8 text-sm font-semibold text-muted">暂无在线设备。</div>}
      </div>
    </div>}
  </section>;
}

function InquiriesPanel({ permissions }: { permissions: Permission[] }) {
  const [inquiries, setInquiries] = useState<InquiryRecord[]>([]);
  const [status, setStatus] = useState<InquiryStatus | 'all'>('all');
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [noteDraft, setNoteDraft] = useState('');
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');
  const canManage = can(permissions, 'inquiries:manage');

  async function refresh(nextStatus = status) {
    const rows = await listInquiries(nextStatus, 200);
    setInquiries(rows);
    setSelectedId(current => current && rows.some(row => row.id === current) ? current : rows[0]?.id ?? null);
  }

  useEffect(() => {
    void refresh().catch(error => setError(error instanceof Error ? error.message : '询盘加载失败'));
  }, [status]);

  const selected = inquiries.find(item => item.id === selectedId) || null;

  useEffect(() => {
    setNoteDraft(selected?.note || '');
  }, [selected?.id, selected?.note]);

  async function changeStatus(inquiry: InquiryRecord, nextStatus: InquiryStatus) {
    if (!canManage) return;
    setError('');
    setNotice('');
    try {
      const updated = await updateInquiry(inquiry.id, { status: nextStatus, note: inquiry.note });
      setInquiries(current => current.map(item => item.id === updated.id ? updated : item));
      setNotice('询盘状态已更新');
    } catch (error) {
      setError(error instanceof Error ? error.message : '状态更新失败');
    }
  }

  async function saveNote() {
    if (!selected || !canManage) return;
    setError('');
    setNotice('');
    try {
      const updated = await updateInquiry(selected.id, { status: selected.status, note: noteDraft });
      setInquiries(current => current.map(item => item.id === updated.id ? updated : item));
      setNotice('处理备注已保存');
    } catch (error) {
      setError(error instanceof Error ? error.message : '备注保存失败');
    }
  }

  function payloadRows(inquiry: InquiryRecord) {
    const labels: Record<string, string> = {
      application: '用途',
      composition: '成分',
      weight: '克重',
      width: '幅宽',
      hasSample: '实物样品',
      targetDate: '期望时间',
      visitDate: '到访日期',
      visitors: '到访人数',
      site: '厂区或业务方向'
    };
    return Object.entries(labels)
      .map(([key, label]) => ({ label, value: String(inquiry.payload[key] || '') }))
      .filter(row => row.value.trim());
  }

  const newCount = inquiries.filter(item => item.status === 'new').length;

  return <section>
    <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
      <div><p className="text-xs font-bold uppercase tracking-[.18em] text-accent">客户询盘</p><h1 className="mt-2 text-3xl font-bold text-ink">客户联系方式与询价记录</h1><p className="mt-2 text-sm text-muted">客户在联系页提交后，会保存到服务器数据库，并显示在这里。</p></div>
      <button onClick={() => void refresh()} className="inline-flex min-h-11 items-center justify-center gap-2 border border-line bg-white px-4 text-sm font-bold text-ink hover:border-accent hover:text-accent">刷新</button>
    </div>
    {notice&&<div className="mt-5 border border-green-200 bg-green-50 px-4 py-3 text-sm font-semibold text-green-800">{notice}</div>}
    {error&&<div className="mt-5 border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-800">{error}</div>}

    <div className="mt-6 grid gap-4 sm:grid-cols-4">
      <Stat label="当前列表" value={inquiries.length}/>
      <Stat label="新询盘" value={newCount}/>
      <Stat label="联系中" value={inquiries.filter(item=>item.status==='contacting').length}/>
      <Stat label="已完成" value={inquiries.filter(item=>item.status==='done').length}/>
    </div>

    <div className="mt-6 flex flex-wrap gap-2">
      {(['all','new','contacting','done','archived'] as Array<InquiryStatus | 'all'>).map(item=><button key={item} onClick={()=>setStatus(item)} className={`min-h-10 border px-4 text-sm font-bold ${status===item?'border-accent bg-accent text-white':'border-line bg-white text-ink hover:border-accent hover:text-accent'}`}>{item==='all'?'全部':inquiryStatusLabels[item]}</button>)}
    </div>

    <div className="mt-6 grid gap-6 xl:grid-cols-[24rem_1fr]">
      <aside className="max-h-[48rem] overflow-auto border border-slate-200 bg-white">
        {inquiries.map(inquiry=><button key={inquiry.id} type="button" onClick={()=>setSelectedId(inquiry.id)} className={`block w-full border-b border-slate-100 px-4 py-4 text-left transition last:border-b-0 ${selectedId===inquiry.id?'bg-orange-50':'hover:bg-slate-50'}`}>
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-sm font-bold text-ink">{inquiry.name}</p>
              <p className="mt-1 text-xs text-muted">{inquiry.company || inquiry.email}</p>
            </div>
            <span className={`shrink-0 px-2 py-1 text-[11px] font-bold ${inquiry.status==='new'?'bg-red-50 text-red-700':inquiry.status==='contacting'?'bg-blue-50 text-blue-700':inquiry.status==='done'?'bg-green-50 text-green-700':'bg-slate-100 text-slate-600'}`}>{inquiryStatusLabels[inquiry.status]}</span>
          </div>
          <p className="mt-2 line-clamp-2 text-xs leading-5 text-body">{inquiry.product || inquiry.message}</p>
          <p className="mt-2 text-[11px] text-slate-400">{inquiryTypeLabels[inquiry.type] || inquiry.type} · {inquiry.createdAt}</p>
        </button>)}
        {!inquiries.length&&<div className="px-4 py-10 text-sm font-semibold text-muted">暂无询盘记录。</div>}
      </aside>

      {selected?<article className="border border-slate-200 bg-white p-5">
        <div className="flex flex-col justify-between gap-4 border-b border-slate-200 pb-5 lg:flex-row lg:items-start">
          <div>
            <p className="text-xs font-bold uppercase tracking-[.16em] text-accent">{inquiryTypeLabels[selected.type] || selected.type} · #{selected.id}</p>
            <h2 className="mt-2 text-2xl font-bold text-ink">{selected.name}</h2>
            <p className="mt-2 text-sm text-muted">{selected.createdAt}</p>
          </div>
          <select disabled={!canManage} value={selected.status} onChange={event=>void changeStatus(selected, event.target.value as InquiryStatus)} className="min-h-11 border border-line px-3 text-sm font-bold outline-none focus:border-accent disabled:opacity-60">
            {(['new','contacting','done','archived'] as InquiryStatus[]).map(item=><option key={item} value={item}>{inquiryStatusLabels[item]}</option>)}
          </select>
        </div>

        <div className="mt-5 grid gap-4 lg:grid-cols-2">
          <InfoRow label="邮箱" value={selected.email} href={`mailto:${selected.email}`}/>
          <InfoRow label="电话" value={selected.phone || '-'} href={selected.phone ? `tel:${selected.phone.replace(/[^\d+]/g,'')}` : undefined}/>
          <InfoRow label="公司" value={selected.company || '-'}/>
          <InfoRow label="国家/地区" value={selected.country || '-'}/>
          <InfoRow label="产品/面料" value={selected.product || '-'}/>
          <InfoRow label="预计数量" value={selected.quantity || '-'}/>
        </div>

        <div className="mt-5 border-t border-slate-200 pt-5">
          <h3 className="text-sm font-bold text-ink">客户留言</h3>
          <p className="mt-2 whitespace-pre-line text-sm leading-7 text-body">{selected.message}</p>
        </div>

        {payloadRows(selected).length>0&&<div className="mt-5 border-t border-slate-200 pt-5">
          <h3 className="text-sm font-bold text-ink">补充字段</h3>
          <dl className="mt-3 grid gap-3 lg:grid-cols-2">{payloadRows(selected).map(row=><div key={row.label} className="border border-slate-100 bg-slate-50 px-3 py-2"><dt className="text-[11px] font-bold text-muted">{row.label}</dt><dd className="mt-1 text-sm font-semibold text-ink">{row.value}</dd></div>)}</dl>
        </div>}

        <div className="mt-5 border-t border-slate-200 pt-5">
          <h3 className="text-sm font-bold text-ink">处理备注</h3>
          <textarea disabled={!canManage} value={noteDraft} onChange={event=>setNoteDraft(event.target.value)} className="mt-2 min-h-28 w-full border border-line p-3 text-sm outline-none focus:border-accent disabled:bg-slate-50" placeholder="记录联系进度、报价情况或后续安排"/>
          <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
            <p className="text-xs text-muted">来源 IP：{selected.ip || '-'}　最近处理：{selected.handledByUsername || '-'}</p>
            {canManage&&<button onClick={()=>void saveNote()} className="inline-flex min-h-10 items-center gap-2 bg-accent px-4 text-sm font-bold text-white hover:bg-accent-hover"><Save size={15}/>保存备注</button>}
          </div>
        </div>
      </article>:<div className="border border-dashed border-slate-300 bg-white px-5 py-10 text-sm font-semibold text-muted">请选择一条询盘。</div>}
    </div>
  </section>;
}

function InfoRow({ label, value, href }: { label: string; value: string; href?: string }) {
  const content = <><dt className="text-[11px] font-bold uppercase tracking-[.1em] text-muted">{label}</dt><dd className="mt-1 break-words text-sm font-semibold text-ink">{value}</dd></>;
  return href ? <a href={href} className="block border border-slate-100 bg-slate-50 px-3 py-3 hover:border-accent">{content}</a> : <dl className="border border-slate-100 bg-slate-50 px-3 py-3">{content}</dl>;
}

function AnalyticsPanel() {
  const [summary, setSummary] = useState<AnalyticsSummary | null>(null);
  const [pages, setPages] = useState<PageAnalytics[]>([]);
  const [products, setProducts] = useState<ProductAnalytics[]>([]);
  const [error, setError] = useState('');

  useEffect(() => {
    let active = true;
    (async () => {
      const errors: string[] = [];
      try {
        const summary = await loadAnalyticsSummary();
        if (active) setSummary(summary);
      } catch (error) {
        errors.push(`汇总数据：${error instanceof Error ? error.message : '加载失败'}`);
      }
      try {
        const products = await loadProductAnalytics();
        if (active) setProducts(products);
      } catch (error) {
        errors.push(`商品排行：${error instanceof Error ? error.message : '加载失败'}`);
      }
      try {
        const pages = await loadPageAnalytics();
        if (active) setPages(pages);
      } catch (error) {
        errors.push(`页面排行：${error instanceof Error ? error.message : '加载失败'}`);
      }
      if (active && errors.length) setError(errors.join('；'));
    })();
    return () => {
      active = false;
    };
  }, []);

  return <section>
    <div><p className="text-xs font-bold uppercase tracking-[.18em] text-accent">访问统计</p><h1 className="mt-2 text-3xl font-bold text-ink">网页与商品浏览监控</h1></div>
    {error&&<div className="mt-5 border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-800">{error}</div>}
    <div className="mt-7 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      <Stat label="总浏览量" value={summary?.totalViews ?? 0}/>
      <Stat label="访客数" value={summary?.uniqueVisitors ?? 0}/>
      <Stat label="商品浏览" value={summary?.productViews ?? 0}/>
      <Stat label="今日浏览" value={summary?.todayViews ?? 0}/>
    </div>
    <div className="mt-7 grid gap-6 xl:grid-cols-2">
      <AnalyticsTable title="商品浏览排行" rows={products.map(item=>[item.productName || item.productSlug, `${item.views}`, `${item.visitors}`, item.lastViewedAt])}/>
      <AnalyticsTable title="页面浏览排行" rows={pages.map(item=>[item.path, `${item.views}`, `${item.visitors}`, item.lastViewedAt])}/>
    </div>
  </section>;
}

function AnalyticsTable({ title, rows }: { title: string; rows: string[][] }) {
  return <div className="overflow-hidden border border-slate-200 bg-white">
    <h2 className="border-b border-slate-200 px-4 py-3 text-sm font-bold text-ink">{title}</h2>
    <table className="min-w-full text-left text-sm">
      <thead className="bg-slate-50 text-xs font-bold uppercase tracking-[.12em] text-muted"><tr><th className="px-4 py-3">名称</th><th className="px-4 py-3">浏览量</th><th className="px-4 py-3">访客数</th><th className="px-4 py-3">最近访问</th></tr></thead>
      <tbody>{rows.map((row,index)=><tr key={`${row[0]}-${index}`} className="border-t border-slate-200">{row.map((cell,cellIndex)=><td key={cellIndex} className={`px-4 py-3 ${cellIndex===0?'max-w-xs truncate font-semibold text-ink':'text-xs text-muted'}`}>{cell}</td>)}</tr>)}</tbody>
    </table>
  </div>;
}

function LogsPanel() {
  const [operations, setOperations] = useState<AdminLog[]>([]);
  const [requests, setRequests] = useState<AdminLog[]>([]);
  const [error, setError] = useState('');

  useEffect(() => {
    Promise.all([listOperationLogs(), listRequestLogs()])
      .then(([operations, requests]) => {
        setOperations(operations);
        setRequests(requests);
      })
      .catch(error => setError(error instanceof Error ? error.message : '日志加载失败'));
  }, []);

  return <section>
    <div><p className="text-xs font-bold uppercase tracking-[.18em] text-accent">日志中心</p><h1 className="mt-2 text-3xl font-bold text-ink">操作日志与监控日志</h1></div>
    {error&&<div className="mt-5 border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-800">{error}</div>}
    <div className="mt-7 grid gap-6 xl:grid-cols-2">
      <LogList title="后台操作日志" rows={operations.map(item=>({title:`${item.username || '-'} ${actionLabels[item.action] || item.action} ${targetLabels[item.target] || item.target}`,meta:item.created_at,detail:item.detail || item.ip || ''}))}/>
      <LogList title="接口请求日志" rows={requests.map(item=>({title:`${item.method} ${item.path}`,meta:`${item.status} · ${item.duration_ms}毫秒 · ${item.created_at}`,detail:item.ip || ''}))}/>
    </div>
  </section>;
}

function LogList({ title, rows }: { title: string; rows: Array<{ title: string; meta: string; detail: string }> }) {
  return <div className="border border-slate-200 bg-white">
    <h2 className="border-b border-slate-200 px-4 py-3 text-sm font-bold text-ink">{title}</h2>
    <div className="max-h-[42rem] overflow-auto">{rows.map((row,index)=><article key={`${row.title}-${index}`} className="border-b border-slate-100 px-4 py-3 last:border-b-0">
      <p className="text-sm font-semibold text-ink">{row.title}</p>
      <p className="mt-1 text-xs text-muted">{row.meta}</p>
      {row.detail&&<p className="mt-1 truncate text-xs text-slate-400">{row.detail}</p>}
    </article>)}</div>
  </div>;
}

function AdminDashboard() {
  const {site, authenticated, adminUser, permissions, refreshSession, saveSite, saveSiteContent, resetSite, refreshMedia, uploadMedia, media, saving} = useSite();
  const [tab, setTab] = useState<Tab>('overview');
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    if (authenticated) refreshMedia();
  }, [authenticated, refreshMedia]);

  async function handleUpload(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      await uploadMedia(file);
      await refreshMedia();
    } finally {
      setUploading(false);
      event.target.value = '';
    }
  }

  async function logout() {
    await logoutAdmin();
    await refreshSession();
  }

  const statistics = useMemo(() => [
    { label: '产品数量', value: site.catalog.products.length },
    { label: '分类数量', value: site.catalog.categories.length },
    { label: '新闻数量', value: site.news.length },
    { label: '上传文件', value: media.length },
  ], [media.length, site.catalog.categories.length, site.catalog.products.length, site.news.length]);
  const siteLibrary = useMemo(() => extractSiteLibrary(site), [site]);
  const mediaLibrary = useMemo(() => mergeMediaLibrary(
    media.map(item => ({ url: item.url, kind: item.kind, name: item.originalName || item.name, source: '媒体库上传文件' })),
    siteLibrary.media
  ), [media, siteLibrary.media]);

  const navItems = ([
    ['overview', '总览', 'overview'],
    ['content', '整站内容', 'site-content:write'],
    ['products', '产品管理', 'content:write'],
    ['inquiries', '客户询盘', 'inquiries:read'],
    ['media', '媒体库', 'media:write'],
    ['users', '用户权限', 'users:manage'],
    ['analytics', '浏览统计', 'analytics:read'],
    ['logs', '监控日志', 'logs:read'],
    ['data', '导出与恢复', 'site-content:write'],
  ] as Array<[Tab, string, Permission | 'overview']>).filter(([, , permission]) => permission === 'overview' || can(permissions, permission));

  return <div className="min-h-screen bg-slate-100 text-body">
    <header className="border-b border-white/10 bg-ink text-white">
      <div className="container-shell flex min-h-16 items-center justify-between gap-4">
        <Link to="/admin" className="flex items-center gap-3">
          <div className="flex size-9 items-center justify-center bg-accent"><LayoutDashboard size={18}/></div>
          <span className="font-bold tracking-wide">FENGTAI CMS</span>
        </Link>
        <div className="flex items-center gap-2 text-sm">
          <span className="hidden px-3 py-2 text-slate-300 sm:inline-flex">{adminUser?.displayName || adminUser?.username} · {adminUser?.role ? roleLabels[adminUser.role] : ''}</span>
          <Link to="/" className="hidden items-center gap-1 px-3 py-2 text-slate-300 hover:text-white sm:inline-flex">查看网站<ExternalLink size={15}/></Link>
          <button onClick={logout} className="inline-flex items-center gap-1 px-3 py-2 text-slate-300 hover:text-white"><LogOut size={15}/>退出</button>
        </div>
      </div>
    </header>

    <div className="container-shell grid gap-6 py-6 lg:grid-cols-[14rem_1fr]">
      <aside className="h-fit border border-slate-200 bg-white p-2 lg:sticky lg:top-6">
        <p className="px-3 pb-2 pt-3 text-xs font-bold uppercase tracking-[.18em] text-muted">后台中心</p>
        <nav className="grid gap-1 sm:grid-cols-4 lg:grid-cols-1">
          {navItems.map(([id, label]) => (
            <button key={id} onClick={() => setTab(id)} className={`flex items-center gap-3 px-3 py-3 text-left text-sm font-semibold transition ${tab===id?'bg-accent text-white':'text-body hover:bg-orange-50 hover:text-accent'}`}>
              {id==='inquiries'?<Inbox size={17}/>:id==='users'?<Users size={17}/>:id==='analytics'?<BarChart3 size={17}/>:id==='logs'?<Activity size={17}/>:id==='data'?<FileText size={17}/>:id==='content'||id==='products'?<Shield size={17}/>:<Database size={17}/>}
              {label}
            </button>
          ))}
        </nav>
      </aside>

      <main className="min-w-0">
        {tab==='overview'&&<section>
          <div><p className="text-xs font-bold uppercase tracking-[.18em] text-accent">总览</p><h1 className="mt-2 text-3xl font-bold text-ink">站点总览</h1><p className="mt-2 text-sm text-muted">所有内容都从服务器读取，后台编辑后会直接保存到服务器数据库。</p></div>
          <div className="mt-7 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">{statistics.map(item=><Stat key={item.label} label={item.label} value={item.value}/>)}</div>
        </section>}
        {tab==='content'&&<ContentPanel site={site} saveSiteContent={saveSiteContent} uploadMedia={uploadMedia} mediaLibrary={mediaLibrary} saving={saving}/>}
        {tab==='products'&&<ProductPanel site={site} saveSite={saveSite} uploadMedia={uploadMedia} mediaLibrary={mediaLibrary} saving={saving}/>}
        {tab==='inquiries'&&<InquiriesPanel permissions={permissions}/>}
        {tab==='media'&&<section>
          <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
            <div><p className="text-xs font-bold uppercase tracking-[.18em] text-accent">媒体库</p><h1 className="mt-2 text-3xl font-bold text-ink">站点图片、视频和文字素材</h1><p className="mt-2 text-sm text-muted">这里会自动加载服务器上传文件，以及当前整站内容中已经使用的图片、视频和文字。</p></div>
            <label className="inline-flex min-h-11 cursor-pointer items-center gap-2 bg-accent px-4 py-3 text-sm font-bold text-white hover:bg-accent-hover">
              <ImagePlus size={17}/>{uploading?'上传中':'上传文件'}
              <input type="file" accept="image/*,video/*" className="sr-only" onChange={handleUpload}/>
            </label>
          </div>
          <div className="mt-6 grid gap-4 sm:grid-cols-3">
            <Stat label="上传文件" value={media.length}/>
            <Stat label="站点图片/视频" value={siteLibrary.media.length}/>
            <Stat label="站点文字" value={siteLibrary.texts.length}/>
          </div>

          <div className="mt-8">
            <div className="flex items-end justify-between gap-4">
              <div><h2 className="text-xl font-bold text-ink">上传文件</h2><p className="mt-1 text-sm text-muted">通过后台上传并保存在服务器 `/uploads` 的文件。</p></div>
            </div>
            {media.length
              ? <div className="mt-4 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">{media.map(item=><MediaItem key={item.url} item={{...item, source: '服务器上传文件'}}/>)}</div>
              : <div className="mt-4 border border-dashed border-slate-300 bg-white px-5 py-8 text-sm font-semibold text-muted">还没有后台上传文件。可以点击右上角上传图片或视频。</div>}
          </div>

          <div className="mt-8">
            <div><h2 className="text-xl font-bold text-ink">站点已有图片/视频</h2><p className="mt-1 text-sm text-muted">从首页、产品、公司介绍、新闻、联系页等现有内容中自动提取。</p></div>
            {siteLibrary.media.length
              ? <div className="mt-4 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">{siteLibrary.media.map(item=><MediaItem key={item.url} item={item}/>)}</div>
              : <div className="mt-4 border border-dashed border-slate-300 bg-white px-5 py-8 text-sm font-semibold text-muted">当前站点内容里没有识别到图片或视频。</div>}
          </div>

          <div className="mt-8">
            <div><h2 className="text-xl font-bold text-ink">站点已有文字</h2><p className="mt-1 text-sm text-muted">从整站内容字段中自动提取，可用于核对或复制。编辑文字请进入“整站内容”。</p></div>
            {siteLibrary.texts.length
              ? <div className="mt-4 grid gap-4 lg:grid-cols-2">{siteLibrary.texts.map(item=><TextLibraryItem key={item.id} item={item}/>)}</div>
              : <div className="mt-4 border border-dashed border-slate-300 bg-white px-5 py-8 text-sm font-semibold text-muted">当前站点内容里没有识别到文字素材。</div>}
          </div>
        </section>}
        {tab==='users'&&<UsersPanel permissions={permissions} adminUser={adminUser}/>}
        {tab==='analytics'&&<AnalyticsPanel/>}
        {tab==='logs'&&<LogsPanel/>}
        {tab==='data'&&<section>
          <p className="text-xs font-bold uppercase tracking-[.18em] text-accent">数据存储</p>
          <h1 className="mt-2 text-3xl font-bold text-ink">数据管理</h1>
          <p className="mt-2 max-w-3xl text-sm leading-6 text-muted">导出整站 JSON 备份，或者恢复到初始站点内容。</p>
          <div className="mt-6 flex flex-wrap gap-3">
            <button onClick={() => downloadJson(`fengtai-site-${new Date().toISOString().slice(0, 10)}.json`, site)} className="inline-flex min-h-11 items-center gap-2 bg-accent px-4 py-3 text-sm font-bold text-white hover:bg-accent-hover"><Download size={17}/>导出 JSON</button>
            <button onClick={async () => { if (window.confirm('确定恢复为初始站点内容吗？')) await resetSite(); }} className="inline-flex min-h-11 items-center gap-2 border border-red-300 bg-white px-4 py-3 text-sm font-bold text-red-800 hover:bg-red-100"><RotateCcw size={17}/>恢复初始内容</button>
          </div>
        </section>}
      </main>
    </div>
  </div>;
}

export function AdminPage() {
  const {authenticated, refreshSession} = useSite();
  return authenticated ? <AdminDashboard /> : <AdminLogin onLogin={refreshSession}/>;
}
