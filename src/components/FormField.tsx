import type { InputHTMLAttributes,ReactNode,SelectHTMLAttributes,TextareaHTMLAttributes } from 'react';
const inputClass='mt-2 min-h-12 w-full border border-slate-300 bg-white px-4 py-3 text-sm text-ink outline-none transition placeholder:text-slate-400 focus:border-accent focus:ring-2 focus:ring-amber-100';
export function FormField({label,error,required,children}:{label:string;error?:string;required?:boolean;children:ReactNode}){return <label className="block text-sm font-semibold text-body">{label}{required&&<span className="ml-1 text-accent" aria-hidden="true">*</span>}{children}{error&&<span className="mt-2 block text-xs text-red-700" role="alert">{error}</span>}</label>}
export function TextInput(p:InputHTMLAttributes<HTMLInputElement>){return <input {...p} className={`${inputClass} ${p.className||''}`}/>}
export function TextArea(p:TextareaHTMLAttributes<HTMLTextAreaElement>){return <textarea {...p} className={`${inputClass} min-h-32 resize-y ${p.className||''}`}/>}
export function SelectInput(p:SelectHTMLAttributes<HTMLSelectElement>){return <select {...p} className={`${inputClass} ${p.className||''}`}/>} 
