# 双语制造企业官网

基于 React、Vite、TypeScript、Tailwind CSS、React Router DOM 与 lucide-react 的多页面企业官网。

## 启动

```bash
npm install
npm run dev
```

生产构建：

```bash
npm run build
```

## 依赖

- `react`、`react-dom`
- `react-router-dom`
- `lucide-react`
- `vite`、`@vitejs/plugin-react`
- `typescript`
- `tailwindcss`、`postcss`、`autoprefixer`

## 替换企业资料

所有公司资料集中在 `src/data/company.ts`。替换方括号中的占位值即可，不需要修改页面组件。

## 替换图片和视频

保持文件名不变，直接替换 `public/images` 与 `public/videos` 中的占位素材。图片建议使用压缩后的 JPG/PNG，横幅建议 1600×900 或更大；产品图建议统一为 4:3；视频建议 H.264 MP4。

现有媒体均明确标注为本地占位素材，不代表真实工厂、产品或生产能力。

## 更新双语内容

全站公共文案位于 `src/i18n/zh.ts` 和 `src/i18n/en.ts`。页面专用双语内容与本地数据分别位于 `src/pages` 和 `src/data`。同一条内容请同步维护中英文版本。

## 添加产品

在 `src/data/products.ts` 中新增一条唯一 `slug` 的产品记录，并将图片放入 `public/images/products`。产品详情路由会自动生成：`/products/:slug`。

## 添加新闻

在 `src/data/news.ts` 中新增一条唯一 `slug` 的新闻记录，并将封面放入 `public/images/news`。列表、搜索、分类与详情路由会自动使用新数据。

## 接入真实后端

表单目前只做浏览器端校验，并明确显示“未发送到服务器”。在以下文件的提交函数注释位置接入真实 API、CRM、邮件服务或无服务器函数：

- `src/forms/BaseInquiryForm.tsx`
- `src/forms/OrderForm.tsx`

接入时应增加服务端验证、垃圾信息防护、文件存储、隐私同意记录、错误重试与成功回执。不要把邮件服务密钥写入前端代码。

## 启用结构化数据

`src/data/structuredData.ts` 提供 Organization、Product 与 NewsArticle 模板。占位企业资料未确认前不会注入页面；补齐真实名称、正式网址、图片和日期后，再通过 `Seo` 组件输出 JSON-LD。

## 主要文件树

```text
src/
  components/   共享导航、媒体、卡片、SEO、流程与状态组件
  data/         公司、产品、新闻、流程、FAQ 与导航数据
  forms/        外贸、内销、订单与联系表单
  hooks/        减少动态效果与滚动出现效果
  i18n/         中英文公共翻译与语言上下文
  pages/        首页、新闻、外贸、内销、订单、联系、详情与 404
  types/        数据与表单类型
public/
  images/       Logo、横幅、工厂、产品与新闻图片
  videos/       首页、参观与生产流程视频
```
