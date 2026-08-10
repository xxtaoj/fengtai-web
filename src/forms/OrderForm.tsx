import { useState, type FormEvent, type ReactNode } from 'react';
import { CheckCircle2 } from 'lucide-react';
import { useLanguage } from '../i18n/useLanguage';
import { FileUpload } from '../components/FileUpload';
import { FormField, SelectInput, TextArea, TextInput } from '../components/FormField';
import { submitInquiry } from '../lib/siteApi';

export function OrderForm() {
  const { language, t } = useLanguage();
  const zh = language === 'zh';
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [success, setSuccess] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const formTop = form.offsetTop;
    const fd = new FormData(form);
    const next: Record<string, string> = {};
    ['name', 'email', 'product', 'quantity', 'message', 'consent'].forEach(key => {
      if (!fd.get(key)) next[key] = t.common.required;
    });
    const email = String(fd.get('email') || '');
    if (email && !/^\S+@\S+\.\S+$/.test(email)) next.email = t.common.invalidEmail;
    setErrors(next);
    setSubmitError('');
    if (Object.keys(next).length) return;

    const detailRows = [
      ['客户类型', fd.get('customerType')],
      ['产品分类', fd.get('category')],
      ['产品型号', fd.get('model')],
      ['单位', fd.get('unit')],
      ['目标价格', fd.get('price')],
      ['材料 / 颜色 / 尺寸', fd.get('material')],
      ['Logo 与包装要求', fd.get('packaging')],
      ['定制要求', fd.get('customization')],
      ['订单类型', fd.get('orderType')],
      ['目的国家 / 城市', fd.get('destination')],
      ['目的港', fd.get('port')],
      ['要求交期', fd.get('date')],
      ['运输方式', fd.get('shipping')],
      ['Incoterm', fd.get('incoterm')],
      ['是否需要样品', fd.get('sample')],
      ['检验 / 认证要求', fd.get('inspection')],
      ['客户留言', fd.get('message')]
    ]
      .map(([label, value]) => [label, String(value || '').trim()])
      .filter(([, value]) => value)
      .map(([label, value]) => `${label}: ${value}`)
      .join('\n');

    setSubmitting(true);
    try {
      await submitInquiry({
        type: 'order',
        name: String(fd.get('name') || ''),
        company: String(fd.get('company') || ''),
        country: String(fd.get('country') || ''),
        email,
        phone: String(fd.get('phone') || fd.get('messenger') || ''),
        product: String(fd.get('product') || ''),
        quantity: String(fd.get('quantity') || ''),
        application: String(fd.get('category') || fd.get('material') || ''),
        targetDate: String(fd.get('date') || ''),
        message: detailRows || String(fd.get('message') || '')
      });
      setSuccess(true);
      form.reset();
      window.scrollTo({ top: formTop - 100, behavior: 'smooth' });
    } catch (error) {
      setSubmitError(error instanceof Error ? error.message : (zh ? '提交失败，请稍后再试。' : 'Submission failed. Please try again later.'));
    } finally {
      setSubmitting(false);
    }
  }

  if (success) {
    return <div className="border border-green-200 bg-green-50 p-12 text-center text-success">
      <CheckCircle2 className="mx-auto" size={40}/>
      <h2 className="mt-4 text-2xl font-bold">{zh ? '订单需求已提交' : 'Order requirements submitted'}</h2>
      <p className="mt-3">{t.common.success}</p>
      <button onClick={() => setSuccess(false)} className="mt-6 font-semibold underline">{zh ? '返回表单' : 'Return to form'}</button>
    </div>;
  }

  const section = (title: string, children: ReactNode) => <fieldset className="border-t border-line pt-7 md:col-span-2">
    <legend className="pr-5 text-xl font-bold text-ink">{title}</legend>
    <div className="mt-6 grid gap-5 md:grid-cols-2">{children}</div>
  </fieldset>;

  return <form onSubmit={submit} noValidate className="grid gap-8 bg-white p-5 shadow-sm md:grid-cols-2 md:p-10">
    {section(zh ? '客户信息' : 'Customer Information', <>
      <FormField label={zh ? '客户类型' : 'Customer Type'}><SelectInput name="customerType"><option>{zh ? '品牌客户' : 'Brand'}</option><option>{zh ? '经销商' : 'Distributor'}</option><option>{zh ? '企业采购' : 'Corporate'}</option><option>{zh ? '其他' : 'Other'}</option></SelectInput></FormField>
      <FormField label={zh ? '姓名' : 'Full Name'} required error={errors.name}><TextInput name="name"/></FormField>
      <FormField label={zh ? '公司名称' : 'Company Name'}><TextInput name="company"/></FormField>
      <FormField label={zh ? '国家或地区' : 'Country or Region'}><TextInput name="country"/></FormField>
      <FormField label={zh ? '联系电话' : 'Phone'}><TextInput name="phone"/></FormField>
      <FormField label="WhatsApp / WeChat"><TextInput name="messenger"/></FormField>
      <FormField label={zh ? '邮箱' : 'Email'} required error={errors.email}><TextInput name="email" type="email"/></FormField>
    </>)}
    {section(zh ? '产品信息' : 'Product Information', <>
      <FormField label={zh ? '产品分类' : 'Product Category'}><TextInput name="category"/></FormField>
      <FormField label={zh ? '产品名称' : 'Product Name'} required error={errors.product}><TextInput name="product"/></FormField>
      <FormField label={zh ? '产品型号' : 'Product Model'}><TextInput name="model"/></FormField>
      <FormField label={zh ? '预估数量' : 'Estimated Quantity'} required error={errors.quantity}><TextInput name="quantity" type="number" min="1"/></FormField>
      <FormField label={zh ? '单位' : 'Unit'}><TextInput name="unit"/></FormField>
      <FormField label={zh ? '目标价格' : 'Target Price'}><TextInput name="price"/></FormField>
      <FormField label={zh ? '材料 / 颜色 / 尺寸' : 'Material / Color / Size'}><TextInput name="material"/></FormField>
      <FormField label={zh ? 'Logo 与包装要求' : 'Logo & Packaging'}><TextInput name="packaging"/></FormField>
      <div className="md:col-span-2"><FormField label={zh ? '定制要求' : 'Customization Requirements'}><TextArea name="customization"/></FormField></div>
    </>)}
    {section(zh ? '交付信息' : 'Delivery Information', <>
      <FormField label={zh ? '订单类型' : 'Order Type'}><SelectInput name="orderType"><option>{zh ? '国内订单' : 'Domestic order'}</option><option>{zh ? '出口订单' : 'Export order'}</option></SelectInput></FormField>
      <FormField label={zh ? '目的国家 / 城市' : 'Destination Country / City'}><TextInput name="destination"/></FormField>
      <FormField label={zh ? '目的港' : 'Destination Port'}><TextInput name="port"/></FormField>
      <FormField label={zh ? '要求交期' : 'Required Delivery Date'}><TextInput name="date" type="date"/></FormField>
      <FormField label={zh ? '运输方式' : 'Shipping Method'}><TextInput name="shipping"/></FormField>
      <FormField label="Incoterm"><TextInput name="incoterm"/></FormField>
    </>)}
    <fieldset className="border-t border-line pt-7 md:col-span-2">
      <legend className="pr-5 text-xl font-bold text-ink">{zh ? '附件' : 'Files'}</legend>
      <div className="mt-6"><FileUpload maxMb={20}/></div>
    </fieldset>
    {section(zh ? '补充信息' : 'Additional Information', <>
      <FormField label={zh ? '是否需要样品' : 'Sample Required'}><SelectInput name="sample"><option>{zh ? '待确认' : 'To be confirmed'}</option><option>{zh ? '是' : 'Yes'}</option><option>{zh ? '否' : 'No'}</option></SelectInput></FormField>
      <FormField label={zh ? '检验 / 认证要求' : 'Inspection / Certification'}><TextInput name="inspection"/></FormField>
      <div className="md:col-span-2"><FormField label={zh ? '留言' : 'Message'} required error={errors.message}><TextArea name="message"/></FormField></div>
      <label className="flex gap-3 text-sm text-muted md:col-span-2"><input type="checkbox" name="consent" value="yes" className="mt-1 size-4 accent-amber-600"/><span>{zh ? '我同意将以上信息用于本次订单评估。' : 'I consent to use of this information for order evaluation.'}</span></label>
      {errors.consent && <p className="text-xs text-red-700 md:col-span-2">{errors.consent}</p>}
    </>)}
    {submitError && <p className="text-sm font-semibold text-red-700 md:col-span-2">{submitError}</p>}
    <button disabled={submitting} className="min-h-14 bg-accent px-8 font-bold text-white hover:bg-accent-hover disabled:opacity-60 md:col-span-2">{submitting ? (zh ? '提交中...' : 'Submitting...') : (zh ? '提交订单需求' : 'Submit Order Requirements')}</button>
  </form>;
}
