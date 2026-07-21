import { company } from '../data/company';import { useLanguage } from '../i18n/useLanguage';
export function StatsSection(){const{language}=useLanguage();const zh=language==='zh';const stats=[
  [zh?company.establishedYear:company.establishedYearEn,zh?'企业定位':'Company Focus'],
  [zh?company.factoryArea:company.factoryAreaEn,zh?'协同布局':'Locations'],
  [zh?company.employeeCount:company.employeeCountEn,zh?'协作团队':'Teams'],
  [zh?company.monthlyCapacity:company.monthlyCapacityEn,zh?'供货方式':'Supply Modes'],
];return <div className="grid border-y border-line bg-white sm:grid-cols-2 lg:grid-cols-4">{stats.map(([v,l])=><div key={l} className="border-b border-line p-7 last:border-b-0 sm:border-r lg:border-b-0"><strong className="block text-2xl text-ink">{v}</strong><span className="mt-2 block text-sm text-muted">{l}</span></div>)}</div>}
