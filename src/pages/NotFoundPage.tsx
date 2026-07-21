import { ArrowLeft, ArrowUpRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Seo } from '../components/Seo';
import { useLanguage } from '../i18n/useLanguage';

export function NotFoundPage(){
  const {language}=useLanguage();
  const zh=language==='zh';
  return <main className="grid min-h-[82vh] place-items-center overflow-hidden bg-ink px-5 pb-20 pt-36 text-white">
    <Seo title={{zh:'页面未找到',en:'Page Not Found'}} description={{zh:'这根线没有织到目标页面。',en:'This thread did not lead to a page.'}}/>
    <section className="broken-thread relative w-full max-w-5xl border-y border-white/15 py-20 text-center sm:py-28" aria-labelledby="not-found-title">
      <div className="relative z-10 mx-auto max-w-2xl bg-ink px-5 sm:px-12">
        <p className="font-mono text-xs font-bold uppercase tracking-[.24em] text-amber-400">{zh?'断纱记录':'Broken thread'}</p>
        <p className="mt-5 font-mono text-[clamp(6rem,20vw,13rem)] font-bold leading-none tracking-[-.08em] text-white">404</p>
        <h1 id="not-found-title" className="mt-4 text-2xl font-bold sm:text-3xl">{zh?'这根线没有织到目标页面。':'This thread did not lead to a page.'}</h1>
        <p className="mx-auto mt-4 max-w-lg text-sm leading-7 text-slate-400">{zh?'链接可能已经调整。你可以回到首页，或继续查看面料产品。':'The link may have changed. Return home or continue to the fabric catalogue.'}</p>
        <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
          <Link to="/" className="inline-flex min-h-12 items-center justify-center gap-2 bg-accent px-6 text-sm font-bold text-white transition-colors hover:bg-accent-hover"><ArrowLeft size={17}/>{zh?'返回首页':'Back to home'}</Link>
          <Link to="/products" className="inline-flex min-h-12 items-center justify-center gap-2 border border-white/30 px-6 text-sm font-bold text-white transition-colors hover:border-amber-400 hover:text-amber-400">{zh?'查看产品中心':'View products'}<ArrowUpRight size={17}/></Link>
        </div>
      </div>
    </section>
  </main>;
}
