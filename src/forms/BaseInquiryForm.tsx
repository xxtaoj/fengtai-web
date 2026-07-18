import { useState,type FormEvent } from 'react';
import { CheckCircle2 } from 'lucide-react';
import { useLanguage } from '../i18n/useLanguage';
import { FormField,SelectInput,TextArea,TextInput } from '../components/FormField';
import { FileUpload } from '../components/FileUpload';

type Kind='export'|'domestic'|'contact';

export function BaseInquiryForm({kind}:{kind:Kind}){
  const {language,t}=useLanguage();
  const zh=language==='zh';
  const [errors,setErrors]=useState<Record<string,string>>({});
  const [success,setSuccess]=useState(false);

  function submit(e:FormEvent<HTMLFormElement>){
    e.preventDefault();
    const fd=new FormData(e.currentTarget);
    const next:Record<string,string>={};
    ['name','email','product','message'].forEach(k=>{if(!String(fd.get(k)||'').trim())next[k]=t.common.required});
    const email=String(fd.get('email')||'');
    if(email&&!/^\S+@\S+\.\S+$/.test(email))next.email=t.common.invalidEmail;
    setErrors(next);
    if(!Object.keys(next).length){
      setSuccess(true);
      e.currentTarget.reset();
      /* Connect the real CRM, email service, or backend API here. */
    }
  }

  if(success) return <div className="border border-green-200 bg-green-50 p-10 text-center text-success" role="status"><CheckCircle2 className="mx-auto" size={36}/><h3 className="mt-4 text-xl font-bold">{zh?'演示提交完成':'Demo submission complete'}</h3><p className="mt-2 text-sm">{t.common.success}</p><button className="mt-5 text-sm font-semibold underline" onClick={()=>setSuccess(false)}>{zh?'继续填写':'Send another'}</button></div>;

  return <form onSubmit={submit} noValidate className="grid gap-5 rounded-sm border border-line bg-white p-5 shadow-sm md:grid-cols-2 md:p-8">
    <FormField label={zh?'姓名':'Name'} required error={errors.name}><TextInput name="name" autoComplete="name"/></FormField>
    <FormField label={zh?'公司名称':'Company'}><TextInput name="company" autoComplete="organization"/></FormField>
    {(kind==='export'||kind==='contact')&&<FormField label={zh?'国家或地区':'Country / Region'}><TextInput name="country" autoComplete="country-name"/></FormField>}
    {kind==='contact'&&<FormField label={zh?'电话':'Phone'}><TextInput name="phone" type="tel" autoComplete="tel"/></FormField>}
    <FormField label={zh?'邮箱':'Email'} required error={errors.email}><TextInput name="email" type="email" autoComplete="email"/></FormField>
    {kind!=='contact'&&<FormField label={kind==='domestic'?(zh?'微信':'WeChat'):'WhatsApp'}><TextInput name="messenger"/></FormField>}
    {kind==='contact'&&<FormField label={zh?'询盘类型':'Inquiry Type'}><SelectInput name="type"><option>{zh?'常规现货询盘':'Regular stock inquiry'}</option><option>{zh?'来样定织':'Custom weaving from sample'}</option><option>{zh?'寄样申请':'Sample request'}</option><option>{zh?'工厂考察':'Factory visit'}</option><option>{zh?'外贸采购合作':'Export sourcing cooperation'}</option><option>{zh?'其他':'Other'}</option></SelectInput></FormField>}
    <FormField label={zh?'产品 / 面料类别':'Product / Fabric Category'} required error={errors.product}><TextInput name="product" placeholder={zh?'床品面料 / 服装面料 / 混纺或交织定制':'Bedding / Apparel / Blended or interwoven custom fabric'}/></FormField>
    {kind==='contact'&&<>
      <FormField label={zh?'预计数量':'Estimated Quantity'}><TextInput name="quantity" placeholder={zh?'米数、公斤数或柜量':'Meters, kilograms, or container quantity'}/></FormField>
      <FormField label={zh?'目标市场 / 用途':'Target Market / Application'}><TextInput name="application" placeholder={zh?'国家、渠道、家纺或服装用途':'Country, channel, home textile or apparel use'}/></FormField>
    </>}
    {kind==='export'&&<>
      <FormField label={zh?'订单数量':'Order Quantity'}><TextInput name="quantity"/></FormField>
      <FormField label={zh?'目的港':'Destination Port'}><TextInput name="port"/></FormField>
      <FormField label="Incoterm"><TextInput name="incoterm" placeholder="[Incoterm]"/></FormField>
      <FormField label={zh?'要求交期':'Required Delivery Date'}><TextInput name="date" type="date"/></FormField>
    </>}
    <div className="md:col-span-2"><FormField label={zh?'询盘内容与面料规格':'Inquiry Message & Fabric Specifications'} required error={errors.message}><TextArea name="message" placeholder={zh?'请填写成分、纱支、密度、门幅、克重、颜色、后整理、包装、交期或来样信息。':'Add composition, yarn count, density, width, weight, color, finishing, packing, lead time, or buyer sample details.'}/></FormField></div>
    <div className="md:col-span-2"><FileUpload/></div>
    <label className="flex items-start gap-3 text-sm text-muted md:col-span-2"><input type="checkbox" required className="mt-1 size-4 accent-amber-600"/><span>{zh?'我同意将以上信息用于本次业务联系。':'I consent to the use of this information for this business inquiry.'}</span></label>
    <button className="min-h-12 bg-accent px-6 font-semibold text-white hover:bg-accent-hover md:col-span-2" type="submit">{t.common.submit}</button>
  </form>;
}
