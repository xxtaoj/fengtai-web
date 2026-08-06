import { useEffect, useMemo, useState, type ChangeEvent, type DragEvent, type FormEvent, type ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { Activity, BarChart3, Check, Database, Download, ExternalLink, FileText, ImagePlus, LayoutDashboard, LogOut, RotateCcw, Save, Shield, UserPlus, Users } from 'lucide-react';
import { useSite } from '../context/SiteContext';
import { staticMediaFiles } from '../data/staticMediaManifest';
import {
  createUser,
  listOperationLogs,
  listRequestLogs,
  listUsers,
  loadAnalyticsSummary,
  loadPageAnalytics,
  loadProductAnalytics,
  loginAdmin,
  logoutAdmin,
  updateUser,
  type AdminLog,
  type AdminRole,
  type AdminUser,
  type AnalyticsSummary,
  type PageAnalytics,
  type Permission,
  type ProductAnalytics
} from '../lib/siteApi';
import type { Product } from '../types/product';
import type { SiteContent } from '../types/site';

type Tab = 'overview' | 'content' | 'products' | 'media' | 'users' | 'analytics' | 'logs' | 'data';
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
  'site-content': '整站内容'
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
  return JSON.parse(JSON.stringify(product)) as Product;
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
    specifications: []
  };
}

function ProductEditorField({ label, children }: { label: string; children: ReactNode }) {
  return <label className="block text-sm font-semibold text-ink">
    {label}
    <div className="mt-2">{children}</div>
  </label>;
}

function ProductImageDropzone({ label, value, alt, uploading, onFile }: { label: string; value: string; alt: string; uploading: boolean; onFile: (file: File) => void | Promise<void> }) {
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

  return <label
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
  </label>;
}

type PathPart = string | number;
type ContentModule = {
  id: string;
  title: string;
  description: string;
  path: PathPart[];
};
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
  products: '产品页文案',
  process: '流程模块',
  quoteCTA: '询价 CTA',
  relatedProducts: '相关产品',
  servicesTitleEn: '英文服务标题',
  servicesTitleZh: '中文服务标题',
  sites: '办公/工厂地点',
  slug: '链接 slug',
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
  return /image|logo|poster|video|qr|wechatQr/i.test(key);
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

function basenameFromUrl(url: string) {
  return decodeURIComponent(url.split('?')[0].split('/').filter(Boolean).pop() || url);
}

function sourceLabel(path: PathPart[]) {
  return path.map(part => typeof part === 'number' ? `第 ${part + 1} 项` : labelForKey(part)).join(' / ');
}

function isTextContentKey(key: string) {
  if (isMediaKey(key)) return false;
  if (['id', 'slug', 'href', 'to', 'tag', 'category'].includes(key)) return false;
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

function EditableField({ label, value, onChange, fieldKey }: { label: string; value: string | number | boolean; onChange: (value: string | number | boolean) => void; fieldKey: string }) {
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
    {longText
      ? <textarea value={textValue} onChange={event => onChange(numeric ? Number(event.target.value) : event.target.value)} className={textareaClass}/>
      : <input type={numeric ? 'number' : 'text'} value={textValue} onChange={event => onChange(numeric ? Number(event.target.value) : event.target.value)} className={inputClass}/>}
    {typeof value === 'string' && isMediaKey(fieldKey) && textValue && <MediaPreview value={textValue} fieldKey={fieldKey}/>}
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

function EditableValue({ value, onChange, fieldKey = 'content', depth = 0 }: { value: unknown; onChange: (value: unknown) => void; fieldKey?: string; depth?: number }) {
  if (typeof value === 'string' || typeof value === 'number' || typeof value === 'boolean') {
    return <EditableField label={labelForKey(fieldKey)} value={value} onChange={onChange} fieldKey={fieldKey}/>;
  }

  if (Array.isArray(value)) {
    const allStrings = value.every(item => typeof item === 'string');
    const allPairs = value.every(item => Array.isArray(item) && item.length === 2 && item.every(part => typeof part === 'string'));
    if (allStrings) {
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
              <EditableField label="中文" value={item[0]} fieldKey="zh" onChange={next => onChange(value.map((row, rowIndex) => rowIndex === index ? [next, row[1]] : row))}/>
              <EditableField label="英文" value={item[1]} fieldKey="en" onChange={next => onChange(value.map((row, rowIndex) => rowIndex === index ? [row[0], next] : row))}/>
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
          <EditableValue value={item} fieldKey={`${fieldKey}-${index + 1}`} depth={depth + 1} onChange={next => onChange(value.map((row, rowIndex) => rowIndex === index ? next : row))}/>
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
              <EditableValue value={item} fieldKey={key} depth={depth + 1} onChange={next => onChange({ ...value, [key]: next })}/>
            </div>
          : <EditableValue value={item} fieldKey={key} depth={depth + 1} onChange={next => onChange({ ...value, [key]: next })}/>}
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
    home: '首页内容',
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

function ContentPanel({ site, saveSiteContent, saving }: { site: SiteContent; saveSiteContent: ReturnType<typeof useSite>['saveSiteContent']; saving: boolean }) {
  const modules = useMemo(() => buildContentModules(site), [site]);
  const [selectedId, setSelectedId] = useState(() => modules[0]?.id || 'company');
  const selected = modules.find(module => module.id === selectedId) || modules[0];
  const [draft, setDraft] = useState<unknown>(() => selected ? cloneValue(getAtPath(site, selected.path)) : {});
  const [notice, setNotice] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    const nextSelected = modules.find(module => module.id === selectedId) || modules[0];
    if (!nextSelected) return;
    setSelectedId(nextSelected.id);
    setDraft(cloneValue(getAtPath(site, nextSelected.path)));
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
          {modules.map(module => <button key={module.id} onClick={() => { setSelectedId(module.id); setDraft(cloneValue(getAtPath(site, module.path))); setNotice(''); setError(''); }} className={`px-3 py-3 text-left text-sm transition ${selected?.id===module.id?'bg-accent text-white':'hover:bg-orange-50'}`}>
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
        <EditableValue value={draft} onChange={setDraft} fieldKey={selected?.id || 'content'}/>
        <div className="mt-6 flex justify-end">
          <button onClick={saveModule} disabled={saving} className="inline-flex min-h-11 items-center gap-2 bg-accent px-5 py-3 text-sm font-bold text-white hover:bg-accent-hover disabled:opacity-60"><Save size={17}/>{saving?'保存中':'保存当前模块'}</button>
        </div>
      </div>
    </div>
  </section>;
}

function ProductPanel({ site, saveSite, uploadMedia, saving }: { site: ReturnType<typeof useSite>['site']; saveSite: ReturnType<typeof useSite>['saveSite']; uploadMedia: ReturnType<typeof useSite>['uploadMedia']; saving: boolean }) {
  const products = site.catalog.products;
  const [selectedId, setSelectedId] = useState<number | null>(() => products[0]?.id ?? null);
  const [draft, setDraft] = useState<Product | null>(() => products[0] ? cloneProduct(products[0]) : createBlankProduct(1));
  const [notice, setNotice] = useState('');
  const [error, setError] = useState('');
  const [uploadingImage, setUploadingImage] = useState('');

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

  function updateDraft(patch: Partial<Product>) {
    setDraft(current => current ? { ...current, ...patch } : current);
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
    const normalized = { ...draft, slug: slugify(draft.slug || draft.nameEn) };
    const duplicate = products.find(product => product.slug === normalized.slug && product.id !== normalized.id);
    if (duplicate) {
      setError('产品链接 slug 已存在，请换一个');
      return;
    }
    const exists = products.some(product => product.id === normalized.id);
    const nextProducts = exists
      ? products.map(product => product.id === normalized.id ? normalized : product)
      : [...products, normalized];
    await saveSite({ ...site, catalog: { ...site.catalog, products: nextProducts } });
    setSelectedId(normalized.id);
    setNotice('产品已保存');
  }

  function addProduct() {
    const product = createBlankProduct(nextProductId(products));
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

    <div className="mt-6 grid gap-6 xl:grid-cols-[18rem_1fr]">
      <aside className="h-fit border border-slate-200 bg-white p-3">
        <p className="px-2 pb-3 text-xs font-bold uppercase tracking-[.16em] text-muted">产品列表</p>
        <div className="grid max-h-[44rem] gap-1 overflow-auto">
          {products.map(product => <button key={product.id} onClick={() => { setSelectedId(product.id); setDraft(cloneProduct(product)); setNotice(''); setError(''); }} className={`px-3 py-3 text-left text-sm transition ${draft?.id===product.id?'bg-accent text-white':'hover:bg-orange-50'}`}>
            <span className="block font-bold">{product.nameZh}</span>
            <span className={`mt-1 block text-xs ${draft?.id===product.id?'text-white/75':'text-muted'}`}>P-{String(product.id).padStart(2,'0')} · {product.slug}</span>
          </button>)}
        </div>
      </aside>

      {draft&&<div className="border border-slate-200 bg-white p-5">
        <div className="grid gap-5 lg:grid-cols-2">
          <ProductEditorField label="中文名称"><input value={draft.nameZh} onChange={event=>updateDraft({nameZh:event.target.value})} className="min-h-11 w-full border border-line px-3 outline-none focus:border-accent"/></ProductEditorField>
          <ProductEditorField label="英文名称"><input value={draft.nameEn} onChange={event=>updateDraft({nameEn:event.target.value})} className="min-h-11 w-full border border-line px-3 outline-none focus:border-accent"/></ProductEditorField>
          <ProductEditorField label="产品链接 slug"><input value={draft.slug} onChange={event=>updateDraft({slug:event.target.value})} className="min-h-11 w-full border border-line px-3 font-mono text-sm outline-none focus:border-accent"/></ProductEditorField>
          <ProductEditorField label="供货类型"><select value={draft.group} onChange={event=>updateDraft({group:event.target.value as Product['group']})} className="min-h-11 w-full border border-line px-3 outline-none focus:border-accent"><option value="ready-stock">常规在机现货</option><option value="custom-weaving">来样定织</option></select></ProductEditorField>
          <ProductEditorField label="中文分类"><input value={draft.categoryZh} onChange={event=>updateDraft({categoryZh:event.target.value})} className="min-h-11 w-full border border-line px-3 outline-none focus:border-accent"/></ProductEditorField>
          <ProductEditorField label="英文分类"><input value={draft.categoryEn} onChange={event=>updateDraft({categoryEn:event.target.value})} className="min-h-11 w-full border border-line px-3 outline-none focus:border-accent"/></ProductEditorField>
          <ProductEditorField label="子分类 ID"><input value={draft.subcategory} onChange={event=>updateDraft({subcategory:event.target.value})} className="min-h-11 w-full border border-line px-3 font-mono text-sm outline-none focus:border-accent"/></ProductEditorField>
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
              onFile={file => replaceProductImage(file, 'main')}
            />
            {(draft.gallery || []).map((image, index) => <div key={`${index}-${image}`} className="relative">
              <ProductImageDropzone
                label={`图库图片 ${index + 1}`}
                value={image}
                alt={`${draft.nameZh} 图片 ${index + 1}`}
                uploading={uploadingImage === `gallery-${index}`}
                onFile={file => replaceProductImage(file, index)}
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

function UsersPanel() {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [form, setForm] = useState({ username: '', displayName: '', password: '', role: 'editor' as AdminRole });
  const [notice, setNotice] = useState('');
  const [error, setError] = useState('');

  async function refresh() {
    setUsers(await listUsers());
  }

  useEffect(() => {
    void refresh().catch(error => setError(error instanceof Error ? error.message : '用户加载失败'));
  }, []);

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
  }

  const manageableUsers = users.filter(user => user.role !== 'owner');

  return <section>
    <div><p className="text-xs font-bold uppercase tracking-[.18em] text-accent">权限管理</p><h1 className="mt-2 text-3xl font-bold text-ink">用户与权限</h1><p className="mt-2 text-sm text-muted">站主账号不在列表中显示。这里管理管理员、内容编辑和只读查看账号。</p></div>
    {notice&&<div className="mt-5 border border-green-200 bg-green-50 px-4 py-3 text-sm font-semibold text-green-800">{notice}</div>}
    {error&&<div className="mt-5 border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-800">{error}</div>}
    <form onSubmit={submit} className="mt-6 grid gap-3 border border-slate-200 bg-white p-5 lg:grid-cols-[1fr_1fr_1fr_10rem_auto]">
      <input value={form.username} onChange={event=>setForm({...form,username:event.target.value})} className="min-h-11 border border-line px-3 text-sm outline-none focus:border-accent" placeholder="账号"/>
      <input value={form.displayName} onChange={event=>setForm({...form,displayName:event.target.value})} className="min-h-11 border border-line px-3 text-sm outline-none focus:border-accent" placeholder="显示名称"/>
      <input value={form.password} onChange={event=>setForm({...form,password:event.target.value})} className="min-h-11 border border-line px-3 text-sm outline-none focus:border-accent" placeholder="初始密码，至少 8 位" type="password"/>
      <select value={form.role} onChange={event=>setForm({...form,role:event.target.value as AdminRole})} className="min-h-11 border border-line px-3 text-sm outline-none focus:border-accent">
        {(['admin','editor','viewer'] as AdminRole[]).map(role=><option key={role} value={role}>{roleLabels[role]}</option>)}
      </select>
      <button className="inline-flex min-h-11 items-center justify-center gap-2 bg-accent px-4 text-sm font-bold text-white hover:bg-accent-hover"><UserPlus size={17}/>创建</button>
    </form>
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
  </section>;
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

  const navItems = ([
    ['overview', '总览', 'overview'],
    ['content', '整站内容', 'site-content:write'],
    ['products', '产品管理', 'content:write'],
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
              {id==='users'?<Users size={17}/>:id==='analytics'?<BarChart3 size={17}/>:id==='logs'?<Activity size={17}/>:id==='data'?<FileText size={17}/>:id==='content'||id==='products'?<Shield size={17}/>:<Database size={17}/>}
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
        {tab==='content'&&<ContentPanel site={site} saveSiteContent={saveSiteContent} saving={saving}/>}
        {tab==='products'&&<ProductPanel site={site} saveSite={saveSite} uploadMedia={uploadMedia} saving={saving}/>}
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
        {tab==='users'&&<UsersPanel/>}
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
