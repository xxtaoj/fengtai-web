import { useMemo, useState, type FormEvent } from 'react';
import { Check, Copy, Factory, Layers3, Mail, Package, Paperclip, Search, type LucideIcon } from 'lucide-react';
import { useSearchParams } from 'react-router-dom';
import { company } from '../data/company';
import { useLanguage } from '../i18n/useLanguage';
import { FileUpload } from './FileUpload';
import { FormField, SelectInput, TextArea, TextInput } from './FormField';

type InquiryIntent = 'product' | 'sample' | 'custom-weaving' | 'visit';
type InquiryField = 'name' | 'company' | 'country' | 'email' | 'phone' | 'product' | 'quantity' | 'application' | 'composition' | 'weight' | 'width' | 'hasSample' | 'targetDate' | 'visitDate' | 'visitors' | 'site' | 'message';
type InquiryValues = Record<InquiryField,string>;
type InquiryErrors = Partial<Record<InquiryField,string>>;

type IntentOption = {
  id: InquiryIntent;
  icon: LucideIcon;
  labelZh: string;
  labelEn: string;
  noteZh: string;
  noteEn: string;
};

const intentOptions:IntentOption[]=[
  {id:'product',icon:Search,labelZh:'产品询价',labelEn:'Product inquiry',noteZh:'有名称、编号或大致品类',noteEn:'You have a name, code, or category'},
  {id:'sample',icon:Package,labelZh:'寄送样品',labelEn:'Sample request',noteZh:'想先确认实物、手感或组织',noteEn:'Check the fabric, hand feel, or weave'},
  {id:'custom-weaving',icon:Layers3,labelZh:'来样定织',labelEn:'Custom weaving',noteZh:'手里已有样品或目标参数',noteEn:'You have a sample or target specs'},
  {id:'visit',icon:Factory,labelZh:'预约看厂',labelEn:'Factory visit',noteZh:'已有大致日期和到访人数',noteEn:'You have a date and visitor count'},
];

const emptyValues:InquiryValues={name:'',company:'',country:'',email:'',phone:'',product:'',quantity:'',application:'',composition:'',weight:'',width:'',hasSample:'',targetDate:'',visitDate:'',visitors:'',site:'',message:''};

function isIntent(value:string|null):value is InquiryIntent{
  return intentOptions.some(option=>option.id===value);
}

export function InquiryComposer(){
  const {language}=useLanguage();
  const zh=language==='zh';
  const [searchParams]=useSearchParams();
  const requestedIntent=searchParams.get('intent');
  const [intent,setIntent]=useState<InquiryIntent>(isIntent(requestedIntent)?requestedIntent:'product');
  const [values,setValues]=useState<InquiryValues>(()=>({...emptyValues,product:searchParams.get('product')??''}));
  const [errors,setErrors]=useState<InquiryErrors>({});
  const [status,setStatus]=useState<'idle'|'ready'|'copied'|'copy-error'>('idle');
  const selectedIntent=intentOptions.find(option=>option.id===intent)??intentOptions[0];

  function update(field:InquiryField,value:string){
    setValues(current=>({...current,[field]:value}));
    setErrors(current=>({...current,[field]:undefined}));
    setStatus('idle');
  }

  const summaryRows=useMemo(()=>{
    const labels:Record<InquiryField,[string,string]>={
      name:['姓名','Name'],company:['公司','Company'],country:['国家或地区','Country / region'],email:['邮箱','Email'],phone:['电话','Phone'],product:['产品或面料','Product / fabric'],quantity:['预计数量','Estimated quantity'],application:['用途','Application'],composition:['已知成分','Known composition'],weight:['克重','Weight'],width:['幅宽','Width'],hasSample:['实物样品','Physical sample'],targetDate:['期望时间','Target date'],visitDate:['计划到访日期','Planned visit date'],visitors:['到访人数','Visitors'],site:['厂区或业务方向','Site or business area'],message:['补充说明','Notes'],
    };
    return (Object.entries(values) as [InquiryField,string][]).filter(([,value])=>value.trim()).map(([field,value])=>({label:zh?labels[field][0]:labels[field][1],value}));
  },[values,zh]);

  const summaryText=useMemo(()=>[
    `${zh?'联系目的':'Inquiry purpose'}: ${zh?selectedIntent.labelZh:selectedIntent.labelEn}`,
    ...summaryRows.map(row=>`${row.label}: ${row.value}`),
  ].join('\n'),[selectedIntent,summaryRows,zh]);

  function validate(){
    const next:InquiryErrors={};
    const required:InquiryField[]=['name','email','message'];
    if(intent==='product')required.push('product');
    required.forEach(field=>{if(!values[field].trim())next[field]=zh?'这项还没填写。':'Please complete this field.'});
    if(values.email&&!/^\S+@\S+\.\S+$/.test(values.email))next.email=zh?'邮箱格式似乎不对，请检查一下。':'Please check the email address.';
    setErrors(next);
    return Object.keys(next).length===0;
  }

  function prepare(event:FormEvent<HTMLFormElement>){
    event.preventDefault();
    if(validate())setStatus('ready');
  }

  async function copySummary(){
    if(!validate())return;
    try{
      await navigator.clipboard.writeText(summaryText);
      setStatus('copied');
    }catch{
      setStatus('copy-error');
    }
  }

  const mailHref=`mailto:${company.email}?subject=${encodeURIComponent(`${zh?'面料询盘':'Fabric inquiry'} · ${values.product||selectedIntent.labelEn}`)}&body=${encodeURIComponent(summaryText)}`;

  return <section aria-labelledby="inquiry-composer-title" className="overflow-hidden rounded-[1.75rem] border border-slate-200 bg-[#F1EEE7]">
    <div className="border-b border-slate-200 px-5 py-6 sm:px-8 sm:py-7">
      <div className="flex flex-col gap-5 xl:flex-row xl:items-end xl:justify-between">
        <div className="max-w-sm">
          <p className="text-xs font-bold uppercase tracking-[.18em] text-accent">{zh?'本次联系事项':'What would you like to discuss?'}</p>
          <h3 id="inquiry-composer-title" className="mt-2 text-2xl font-bold tracking-tight text-ink">{zh?'这次想先聊什么？':'What can we help with?'}</h3>
        </div>
        <div className="grid gap-2 min-[380px]:grid-cols-2 xl:w-[48rem] xl:grid-cols-4" role="radiogroup" aria-label={zh?'联系事项':'Inquiry type'}>
          {intentOptions.map(option=>{
            const selected=intent===option.id;
            const Icon=option.icon;
            return <button key={option.id} type="button" role="radio" aria-checked={selected} onClick={()=>{setIntent(option.id);setStatus('idle')}} className={`min-h-24 rounded-2xl border px-4 py-3 text-left transition-[background-color,border-color,color,transform] duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 ${selected?'border-[#0B4AA2] bg-[#0B4AA2] text-white':'border-slate-200 bg-white/70 text-ink hover:-translate-y-0.5 hover:border-slate-300 hover:bg-white'}`}>
              <span className="flex items-center gap-2"><Icon size={17} strokeWidth={1.8}/><strong className="text-sm">{zh?option.labelZh:option.labelEn}</strong></span>
              <span className={`mt-2 block text-xs leading-5 ${selected?'text-white/70':'text-muted'}`}>{zh?option.noteZh:option.noteEn}</span>
            </button>;
          })}
        </div>
      </div>
    </div>

    <div className="grid xl:grid-cols-[minmax(0,1fr)_21rem]">
      <form onSubmit={prepare} noValidate className="grid content-start gap-x-6 gap-y-5 bg-white px-5 py-8 sm:px-8 md:grid-cols-2 lg:px-10 lg:py-10 [&_input]:rounded-xl [&_input]:bg-[#FBFAF7] [&_select]:rounded-xl [&_select]:bg-[#FBFAF7] [&_textarea]:rounded-xl [&_textarea]:bg-[#FBFAF7]">
          <div className="flex flex-col gap-3 border-b border-slate-200 pb-6 md:col-span-2 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-[.18em] text-accent">{zh?'采购信息':'Sourcing details'}</p>
              <h3 className="mt-2 text-2xl font-bold tracking-tight text-ink">{zh?selectedIntent.labelZh:selectedIntent.labelEn}</h3>
            </div>
            <p className="text-xs leading-5 text-muted">{zh?'带 * 的内容需要填写':'Fields marked * are required'}</p>
          </div>
          <FormField label={zh?'姓名':'Name'} required error={errors.name}><TextInput name="name" value={values.name} onChange={event=>update('name',event.target.value)} autoComplete="name" aria-invalid={Boolean(errors.name)}/></FormField>
          <FormField label={zh?'公司名称':'Company'}><TextInput name="company" value={values.company} onChange={event=>update('company',event.target.value)} autoComplete="organization"/></FormField>
          <FormField label={zh?'国家或地区':'Country / region'}><TextInput name="country" value={values.country} onChange={event=>update('country',event.target.value)} autoComplete="country-name"/></FormField>
          <FormField label={zh?'邮箱':'Email'} required error={errors.email}><TextInput name="email" type="email" value={values.email} onChange={event=>update('email',event.target.value)} autoComplete="email" aria-invalid={Boolean(errors.email)}/></FormField>
          <FormField label={zh?'电话':'Phone'}><TextInput name="phone" type="tel" value={values.phone} onChange={event=>update('phone',event.target.value)} autoComplete="tel"/></FormField>

          {intent!=='visit'&&<FormField label={zh?'产品或面料类别':'Product / fabric'} required={intent==='product'} error={errors.product}><TextInput name="product" value={values.product} onChange={event=>update('product',event.target.value)} placeholder={zh?'产品名称、编号或面料类别':'Product name, record number, or fabric category'} aria-invalid={Boolean(errors.product)}/></FormField>}

          {intent==='product'&&<>
            <FormField label={zh?'预计采购数量':'Estimated quantity'}><TextInput name="quantity" value={values.quantity} onChange={event=>update('quantity',event.target.value)}/></FormField>
            <FormField label={zh?'目标用途':'Application'}><TextInput name="application" value={values.application} onChange={event=>update('application',event.target.value)}/></FormField>
          </>}

          {(intent==='sample'||intent==='custom-weaving')&&<>
            <FormField label={zh?'面料用途':'Fabric application'}><TextInput name="application" value={values.application} onChange={event=>update('application',event.target.value)}/></FormField>
            <FormField label={zh?'已知成分':'Known composition'}><TextInput name="composition" value={values.composition} onChange={event=>update('composition',event.target.value)}/></FormField>
            <FormField label={zh?'克重':'Weight'}><TextInput name="weight" value={values.weight} onChange={event=>update('weight',event.target.value)}/></FormField>
            <FormField label={zh?'幅宽':'Width'}><TextInput name="width" value={values.width} onChange={event=>update('width',event.target.value)}/></FormField>
            <FormField label={zh?'是否有实物样品':'Physical sample available'}><SelectInput name="hasSample" value={values.hasSample} onChange={event=>update('hasSample',event.target.value)}><option value="">{zh?'请选择':'Select'}</option><option value={zh?'有':'Yes'}>{zh?'有':'Yes'}</option><option value={zh?'没有':'No'}>{zh?'没有':'No'}</option></SelectInput></FormField>
            <FormField label={zh?'期望时间':'Target date'}><TextInput name="targetDate" type="date" value={values.targetDate} onChange={event=>update('targetDate',event.target.value)}/></FormField>
          </>}

          {intent==='visit'&&<>
            <FormField label={zh?'计划到访日期':'Planned visit date'}><TextInput name="visitDate" type="date" value={values.visitDate} onChange={event=>update('visitDate',event.target.value)}/></FormField>
            <FormField label={zh?'到访人数':'Number of visitors'}><TextInput name="visitors" type="number" min="1" value={values.visitors} onChange={event=>update('visitors',event.target.value)}/></FormField>
            <div className="md:col-span-2"><FormField label={zh?'希望参观的厂区或业务方向':'Site or business area'}><TextInput name="site" value={values.site} onChange={event=>update('site',event.target.value)}/></FormField></div>
          </>}

          <div className="md:col-span-2"><FormField label={zh?'补充说明':'Additional notes'} required error={errors.message}><TextArea name="message" value={values.message} onChange={event=>update('message',event.target.value)} placeholder={zh?'请写明需要确认的问题、规格或安排。':'Add the specifications, questions, or arrangements to confirm.'} aria-invalid={Boolean(errors.message)}/></FormField></div>
          {(intent==='sample'||intent==='custom-weaving')&&<div className="md:col-span-2 [&>div>label]:rounded-xl [&>div>label]:border-slate-300 [&>div>label]:bg-[#FBFAF7]"><FileUpload/></div>}
          <div className="flex flex-col gap-3 border-t border-slate-200 pt-6 sm:flex-row sm:items-center sm:justify-between md:col-span-2">
            <p className="max-w-md text-xs leading-5 text-muted">{zh?'不确定的规格可以先留空，业务会根据用途继续确认。':'Leave uncertain specifications blank; our team will confirm them with you.'}</p>
            <button type="submit" className="inline-flex min-h-12 items-center justify-center rounded-full bg-[#0B4AA2] px-7 text-sm font-bold text-white transition-colors hover:bg-[#083B82]">{zh?'整理成邮件':'Prepare email'}</button>
          </div>
        </form>

        <aside aria-live="polite" className="relative overflow-hidden border-t border-slate-300 bg-[#E7E1D6] px-7 py-8 xl:border-l xl:border-t-0 xl:px-8 xl:py-10">
          <span className="product-selvedge absolute inset-y-0 left-0 w-4" aria-hidden="true"/>
          <div className="xl:sticky xl:top-28">
            <p className="text-xs font-bold uppercase tracking-[.18em] text-accent">{zh?'邮件内容预览':'Email preview'}</p>
            <h3 className="mt-2 text-xl font-bold tracking-tight text-ink">{zh?'发出前，再看一遍':'Review before sending'}</h3>
            <p className="mt-3 text-sm leading-6 text-muted">{zh?'这里只整理你已经填写的内容，确认后再复制或打开邮箱。':'Only completed fields appear here. Review them before copying or opening your email.'}</p>
            <dl className="mt-6 divide-y divide-slate-400/40 border-y border-slate-400/40">
              <div className="py-3"><dt className="text-[11px] font-bold text-muted">{zh?'联系事项':'Purpose'}</dt><dd className="mt-1 text-sm font-semibold text-ink">{zh?selectedIntent.labelZh:selectedIntent.labelEn}</dd></div>
              {summaryRows.map(row=><div key={row.label} className="py-3"><dt className="text-[11px] font-bold text-muted">{row.label}</dt><dd className="mt-1 break-words text-sm leading-5 text-ink">{row.value}</dd></div>)}
            </dl>
            {!summaryRows.length&&<p className="mt-5 text-sm leading-6 text-muted">{zh?'填好左侧后，邮件内容会在这里整理出来。':'Complete the form and the email content will appear here.'}</p>}
            {status==='ready'&&<p className="mt-5 flex gap-2 text-sm font-semibold text-success"><Check size={17}/>{zh?'内容已整理好，可以复制或打开邮箱。':'The email content is ready to copy or send.'}</p>}
            {status==='copied'&&<p className="mt-5 flex gap-2 text-sm font-semibold text-success"><Check size={17}/>{zh?'邮件内容已复制。':'Email content copied.'}</p>}
            {status==='copy-error'&&<p className="mt-5 text-sm font-semibold text-red-700">{zh?'暂时无法自动复制，请手动选择文字。':'Copy was unavailable. Please select the text manually.'}</p>}
            <div className="mt-6 grid gap-3">
              <button type="button" onClick={copySummary} className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full border border-slate-500/60 bg-white/65 px-4 text-sm font-bold text-ink transition-colors hover:border-[#0B4AA2] hover:text-[#0B4AA2]"><Copy size={16}/>{zh?'复制邮件内容':'Copy email content'}</button>
              <a href={mailHref} className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full bg-[#0B4AA2] px-4 text-sm font-bold text-white transition-colors hover:bg-[#083B82]"><Mail size={16}/>{zh?'打开邮箱':'Open email'}</a>
            </div>
            <p className="mt-5 flex gap-2 text-xs leading-5 text-muted"><Paperclip size={15} className="mt-0.5 shrink-0"/>{zh?'规格表、图片或样品照片可在邮件中作为附件发送。':'Attach specification sheets, product photos, or sample photos in the email.'}</p>
          </div>
        </aside>
    </div>
  </section>;
}
