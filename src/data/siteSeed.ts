import { company as baseCompany } from './company';
import { navigation as baseNavigation } from './navigation';
import { news as baseNews } from './news';
import { featureShowcaseItems as baseFeatures } from './features';
import { exportSteps as baseExportSteps, marketRegions as baseMarketRegions } from './export';
import { domesticSteps as baseDomesticSteps } from './domestic';
import { faqs as baseFaqs } from './faqs';
import { products as baseProducts } from './products';
import { productCategories as baseCategories } from './productCategories';
import type { LocalizedPair } from '../types/site';
import type { SiteContent } from '../types/site';

const company = {
  ...baseCompany,
  logo: '/images/logo.png',
};

export const siteSeed: SiteContent = {
  company,
  navigation: baseNavigation,
  news: baseNews,
  features: baseFeatures,
  exportSteps: baseExportSteps as LocalizedPair[],
  marketRegions: baseMarketRegions,
  domesticSteps: baseDomesticSteps as LocalizedPair[],
  faqs: baseFaqs as LocalizedPair[],
  copy: {
    home: {
      hero: {
        eyebrowZh: '源头织布工厂 · 面向海内外采购商',
        eyebrowEn: 'Source weaving factory · For global buyers',
        titleZh: '现货供应-也可根据样品定制编织',
        titleEn: 'Ready stock plus custom weaving from samples',
        descZh: '丰泰永晟聚焦床品面料、服装面料、混纺与交织定制，帮助外贸采购商快速确认规格、样品、交期与合作方案。',
        descEn: 'Fengtai Yongsheng focuses on bedding fabrics, apparel fabrics, blended fabrics, and interwoven custom products, helping buyers confirm specs, samples, lead time, and cooperation plans quickly.',
        video: '/videos/home-hero.mp4',
        poster: '/images/hero-poster.jpg',
      },
      advantagesZh: [
        '源头织布工厂，业务沟通更直接',
        '常规在机现货，便于快速寄样和报价',
        '支持来样定织，适配混纺与交织开发',
        '面向海内外采购商，产品层级简洁清楚',
      ],
      advantagesEn: [
        'Source weaving factory with direct communication',
        'Regular running stock for faster samples and quotes',
        'Sample-based custom weaving for blended and interwoven fabrics',
        'Simple product hierarchy for domestic and overseas buyers',
      ],
      about: {
        image: '/images/factory-exterior.jpg',
        locationZh: '办公与生产协同',
        locationEn: 'Office and production coordination',
      },
      mainFabrics: {
        eyebrowZh: '主力面料',
        eyebrowEn: 'Main Fabrics',
        titleZh: '按采购用途找到合适面料',
        titleEn: 'Find fabrics by sourcing need',
        descriptionZh: '先选择常规现货或来样定织，再按床品、服装、混纺与交织方向查看产品。',
        descriptionEn: 'Start with available fabrics or custom weaving, then browse bedding, apparel, blended, and interwoven options.',
      },
      factoryVisuals: {
        eyebrowZh: '工厂实拍',
        eyebrowEn: 'Factory Visuals',
        titleZh: '看得见的生产、品控与仓储',
        titleEn: 'Production, quality, and storage you can see',
        descriptionZh: '通过织造现场、面料细节、工厂外景和出货记录，了解订单如何从样品走向交付。',
        descriptionEn: 'See how an order moves from sample to delivery through weaving, fabric details, factory views, and shipment records.',
        video: '/videos/factory-tour.mp4',
        poster: '/images/factory-interior.jpg',
      },
      splitCards: [
        {
          image: '/images/warehouse.jpg',
          titleZh: '常规在机现货产品',
          titleEn: 'Available & Running Fabrics',
          descriptionZh: '床品面料、服装面料等常规方向，适合快速看样、确认规格和推进报价。',
          descriptionEn: 'Bedding and apparel fabrics for sample review, specification confirmation, and quotation.',
          to: '/products#ready-stock',
        },
        {
          image: '/images/quality-control.jpg',
          titleZh: '定制织造产品',
          titleEn: 'Custom Weaving from Sample',
          descriptionZh: '根据来样、成分、组织和用途评估混纺、交织等定织方案。',
          descriptionEn: 'We review samples, composition, construction, and end use before confirming a custom-weaving plan.',
          to: '/products#custom-weaving',
        },
      ],
      activity: {
        eyebrowZh: '公司活动',
        eyebrowEn: 'Company Activities',
        titleZh: '现场见面，持续合作',
        titleEn: 'Meet in person. Keep business moving.',
      },
    },
    company: {
      hero: {
        eyebrowZh: '公司简介',
        eyebrowEn: 'Company Profile',
        titleZh: '源头织布工厂，面向海内外采购需求',
        titleEn: 'A source weaving factory for domestic and overseas buyers',
        descriptionZh: '网站内容以采购商快速判断合作可行性为目标，突出常规现货和来样定织两条业务主线。',
        descriptionEn: 'The website helps buyers evaluate cooperation quickly by emphasizing regular stock and custom weaving from samples.',
        image: '/images/factory-exterior.jpg',
      },
      overview: [
        {
          titleZh: '源头织布工厂',
          titleEn: 'Source Weaving Factory',
          descriptionZh: '围绕床品面料、服装面料及定制织造需求，为采购商提供从面料沟通到样品确认的前端支持。',
          descriptionEn: 'Supporting buyers from fabric discussion to sample confirmation across bedding, apparel, and custom weaving needs.',
        },
        {
          titleZh: '现货与定织并重',
          titleEn: 'Stock and Custom Weaving',
          descriptionZh: '常规在机现货便于快速筛选，来样定织适配混纺、交织和特殊规格开发。',
          descriptionEn: 'Regular in-stock items support quick screening, while sample-based weaving fits blended, interwoven, and special specs.',
        },
        {
          titleZh: '多地业务与生产协同',
          titleEn: 'Multi-site Coordination',
          descriptionZh: '石家庄办公区、喀什工厂和宁夏织造基地共同承接业务沟通、生产排期与交付协作。',
          descriptionEn: 'The Shijiazhuang office, Kashgar factory, and Ningxia weaving base coordinate sales communication, production scheduling, and delivery.',
        },
      ],
      sites: [
        {
          image: '/images/factory-exterior.jpg',
          titleZh: '石家庄办公区',
          titleEn: 'Shijiazhuang Office',
          descZh: '用于客户接待、样品沟通、业务对接与订单资料整理。',
          descEn: 'For buyer reception, sample discussion, sales coordination, and order documentation.',
        },
        {
          image: '',
          titleZh: '新疆喀什工厂',
          titleEn: 'Kashgar Factory',
          descZh: '承接织造生产、工厂实景展示和生产流程背书。',
          descEn: 'Supports weaving production, factory scene display, and production workflow proof.',
        },
        {
          image: '',
          titleZh: '宁夏织造基地',
          titleEn: 'Ningxia Weaving Base',
          descZh: '用于补充织造产能、现货整理和定织排产协同。',
          descEn: 'Adds weaving capacity, stock organization, and custom production coordination.',
        },
      ],
      team: [
        {
          titleZh: '外贸业务团队',
          titleEn: 'Export Sales Team',
          descriptionZh: '负责海外询盘、英文沟通、样品寄送和贸易条款确认。',
          descriptionEn: 'Handles overseas inquiries, English communication, sample delivery, and trade term confirmation.',
        },
        {
          titleZh: '生产与排单团队',
          titleEn: 'Production Planning Team',
          descriptionZh: '根据现货、来样定织、交期和数量评估生产可行性。',
          descriptionEn: 'Evaluates production feasibility by stock, custom samples, lead time, and quantity.',
        },
        {
          titleZh: '品控与仓储团队',
          titleEn: 'Quality and Warehouse Team',
          descriptionZh: '配合样品确认、出货前检查、包装和仓储发货。',
          descriptionEn: 'Supports sample confirmation, pre-shipment checks, packing, warehousing, and delivery.',
        },
      ],
    },
    contact: {
      hero: {
        eyebrowZh: '联系我们',
        eyebrowEn: 'Contact Us',
        titleZh: '如需询价、寄样或来样定织，请提供面料规格、数量、用途和交付要求。',
        titleEn: 'For quotations, samples, or custom weaving, please include fabric specifications, quantity, end use, and delivery requirements.',
        descriptionZh: '如需询价、寄样或来样定织，请提供面料规格、数量、用途和交付要求。',
        descriptionEn: 'For quotations, samples, or custom weaving, please include fabric specifications, quantity, end use, and delivery requirements.',
        image: '/images/factory-exterior.jpg',
      },
      addresses: [
        {
          titleZh: '石家庄总部',
          titleEn: 'Shijiazhuang Headquarters',
          nameZh: company.headOfficeName,
          nameEn: company.headOfficeName,
          addressZh: company.headOfficeAddress,
          addressEn: company.headOfficeAddress,
        },
        {
          titleZh: '新疆喀什厂区',
          titleEn: 'Kashgar Factory',
          nameZh: company.xinjiangFactoryName,
          nameEn: company.xinjiangFactoryName,
          addressZh: company.xinjiangFactoryAddress,
          addressEn: company.xinjiangFactoryAddress,
        },
        {
          titleZh: '宁夏生产基地',
          titleEn: 'Ningxia Production Base',
          nameZh: company.ningxiaFactoryName,
          nameEn: company.ningxiaFactoryName,
          addressZh: company.ningxiaFactoryAddress,
          addressEn: company.ningxiaFactoryAddress,
        },
      ],
      channels: [
        { titleZh: '联系人', titleEn: 'Contact', value: `${company.contactPerson} · ${company.contactTitle}` },
        { titleZh: '手机号', titleEn: 'Mobile', value: company.phone, href: `tel:${company.phone}` },
        { titleZh: '企业邮箱', titleEn: 'Business Email', value: company.email, href: `mailto:${company.email}` },
        { titleZh: 'WeChat / WhatsApp', titleEn: 'WeChat / WhatsApp', value: `${company.wechat} / ${company.whatsapp}` },
        { titleZh: '服务时间', titleEn: 'Business Hours', value: company.businessHours },
        { titleZh: '办公地址', titleEn: 'Office Address', value: company.headOfficeAddress },
        { titleZh: '工厂位置', titleEn: 'Factory Locations', value: company.location },
      ],
      inquiry: {
        eyebrowZh: '询价与寄样',
        eyebrowEn: 'Inquiry & samples',
        titleZh: '把手头有的资料发来，剩下的我们一起确认',
        titleEn: 'Send what you have. We’ll confirm the rest together.',
        descriptionZh: '产品名称、规格表、图片或实物样，手头有什么就先提供什么。缺少的规格，业务会在后续沟通中逐项确认。',
        descriptionEn: 'A product name, specification sheet, photo, or physical sample is enough to get started. Our team will confirm any missing details with you.',
      },
    },
    products: {
      hero: {
        eyebrowZh: '工厂面料样册',
        eyebrowEn: 'Factory fabric range',
        titleZh: '公司产品',
        titleEn: 'Products',
        descriptionZh: '先按用途看床品、服装等常备方向；手里有实物样或明确参数，再进入混纺、交织定织。',
        descriptionEn: 'Browse regular bedding and apparel fabrics by end use. If you have a physical sample or defined specification, move on to blended or interwoven custom weaving.',
        image: '/images/products/product-01.jpg',
      },
      sourcing: {
        eyebrowZh: '从哪里开始',
        eyebrowEn: 'Where to begin',
        titleZh: '先看你手里有什么',
        titleEn: 'Start with what you already have',
        descriptionZh: '有明确用途，可以先翻现有样册；有实物样或技术参数，就直接谈定织。库存、价格和排期仍以当次询盘为准。',
        descriptionEn: 'If the end use is clear, start with the current range. If you have a sample or technical specification, move directly to custom weaving. Stock, price, and scheduling are confirmed with each inquiry.',
      },
      buyerNotes: {
        eyebrowZh: '采购资料',
        eyebrowEn: 'Buyer notes',
        titleZh: '询价不用一次写全',
        titleEn: 'You do not need every detail to start',
        descriptionZh: '先把手头已有的规格、图片或样品发来。缺少的项目，业务会在确认时逐项补齐。',
        descriptionEn: 'Send the specifications, images, or sample you already have. Our sales team will help complete the missing details.',
      },
      sourcingDesk: {
        eyebrowZh: '从哪里开始',
        eyebrowEn: 'Where to begin',
        titleZh: '先看你手里有什么',
        titleEn: 'Start with what you already have',
        descriptionZh: '有明确用途，可以先翻现有样册；有实物样或技术参数，就直接谈定织。库存、价格和排期仍以当次询盘为准。',
        descriptionEn: 'If the end use is clear, start with the current range. If you have a sample or technical specification, move directly to custom weaving. Stock, price, and scheduling are confirmed with each inquiry.',
        paths: [
          {
            id: 'ready-stock',
            conditionZh: '已经知道用途或面料类别',
            conditionEn: 'You know the end use or fabric category',
            titleZh: '先看现有面料',
            titleEn: 'Review the current range',
            descriptionZh: '从床品和服装面料中找接近的方向，再确认样品、批次规格和交期。',
            descriptionEn: 'Start with bedding or apparel fabrics, then check samples, lot specifications, and lead time.',
            fitsZh: ['床品与服装面料', '先看样，再谈规格', '可直接带产品名称询盘'],
            fitsEn: ['Bedding and apparel', 'Sample first, specifications next', 'Inquire with a product name'],
          },
          {
            id: 'custom-weaving',
            conditionZh: '手里有实物样或明确参数',
            conditionEn: 'You have a sample or defined specifications',
            titleZh: '评估来样定织',
            titleEn: 'Evaluate custom weaving',
            descriptionZh: '把样品、成分、组织和用途发来，先判断能否打样，再谈批量生产。',
            descriptionEn: 'Share the sample, composition, construction, and end use. We will review sampling before bulk production.',
            fitsZh: ['混纺与交织方向', '特殊组织或手感', '打样后确认批量'],
            fitsEn: ['Blended and interwoven fabrics', 'Special construction or hand-feel', 'Bulk review after sampling'],
          },
        ],
      },
    },
    export: {
      hero: {
        eyebrowZh: '国际业务',
        eyebrowEn: 'International Business',
        titleZh: '定制织造产品',
        titleEn: 'Custom Weaving Products',
        descriptionZh: '从需求确认、打样、生产到检验与出货，为国际客户建立清晰、可追踪的合作流程。',
        descriptionEn: 'A clear, traceable workflow from requirement confirmation and sampling to production, inspection, and shipment.',
        image: '/images/export-banner.jpg',
      },
      trade: {
        titleZh: '采购决策所需关键信息',
        titleEn: 'Key information for purchasing decisions',
      },
    },
    domestic: {
      hero: {
        eyebrowZh: '国内业务',
        eyebrowEn: 'Domestic Business',
        titleZh: '常规在机现货产品',
        titleEn: 'Regular In-stock Products',
        descriptionZh: '服务品牌方、经销商、工程项目、电商与企业采购，支持按真实需求评估合作方案。',
        descriptionEn: 'Supporting brands, distributors, projects, e-commerce, and corporate buyers with requirement-based evaluation.',
        image: '/images/domestic-banner.jpg',
      },
      servicesTitleZh: '能力清单，按实际情况启用',
      servicesTitleEn: 'A service checklist to confirm before use',
      processTitleZh: '从提交需求到售后跟进',
      processTitleEn: 'From requirements to after-sales follow-up',
    },
    activity: {
      hero: {
        eyebrowZh: '公司活动',
        eyebrowEn: 'Company Activities',
        titleZh: '现场见面，持续合作',
        titleEn: 'Meet in person. Keep business moving.',
        descriptionZh: '记录参展、来访与工厂日常，方便采购商了解我们最近在做什么。',
        descriptionEn: 'Trade shows, buyer visits, and day-to-day factory work, kept in one place.',
        image: '/images/factory-exterior.jpg',
      },
    },
    orders: {
      hero: {
        eyebrowZh: '订单需求',
        eyebrowEn: 'Order Requirements',
        titleZh: '在线业务询盘',
        titleEn: 'Online Inquiry',
        descriptionZh: '请提供产品、数量、材料、定制、包装与交期信息，以便进行可行性评估。',
        descriptionEn: 'Provide product, quantity, material, customization, packaging, and delivery details for evaluation.',
        image: '/images/order-banner.jpg',
      },
      process: {
        titleZh: '提交之后会发生什么',
        titleEn: 'What happens after submission',
      },
      faq: {
        titleZh: '下单前的常见问题',
        titleEn: 'Common questions before ordering',
      },
    },
    quoteCTA: {
      titleZh: '告诉我们需要什么面料',
      titleEn: 'Tell us what fabric you need',
      descriptionZh: '发送面料类别、成分、幅宽、密度或克重、数量和用途，我们将根据现货与生产情况协助确认。',
      descriptionEn: 'Share the fabric type, composition, width, construction or weight, quantity, and end use. We will check available stock and production options.',
    },
  },
  catalog: {
    products: baseProducts,
    categories: baseCategories,
  },
};
