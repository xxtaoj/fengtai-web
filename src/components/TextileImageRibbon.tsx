type RibbonImage = {
  src: string;
  alt: string;
  position?: string;
};

type TextileImageRibbonProps = {
  images: RibbonImage[];
  dark?: boolean;
  className?: string;
  variant?: 'layered' | 'single';
};

export function TextileImageRibbon({ images, dark = false, className = '', variant = 'layered' }: TextileImageRibbonProps) {
  const primaryImage = images[0];

  if (!primaryImage) return null;

  if (variant === 'single') {
    return <div className={`relative isolate overflow-hidden bg-slate-200 ${className}`}>
      <img
        src={primaryImage.src}
        alt={primaryImage.alt}
        loading="lazy"
        decoding="async"
        className="absolute inset-0 size-full scale-[1.01] object-cover"
        style={{ objectPosition: primaryImage.position || '50% 50%' }}
      />
      {dark&&<span className="absolute inset-0 bg-ink/15" aria-hidden="true"/>}
      <span className={`absolute inset-0 bg-gradient-to-r ${dark ? 'from-ink/60 via-ink/15 to-transparent' : 'from-white/35 via-white/5 to-transparent'}`} aria-hidden="true"/>
      <span className="absolute inset-x-0 bottom-0 h-px bg-white/25" aria-hidden="true"/>
    </div>;
  }

  return <div className={`relative isolate overflow-hidden bg-slate-200 ${className}`}>
    <img
      src={primaryImage.src}
      alt={primaryImage.alt}
      loading="lazy"
      decoding="async"
      className="absolute inset-0 size-full scale-[1.015] object-cover"
      style={{ objectPosition: primaryImage.position || '50% 50%' }}
    />
    <span className="absolute inset-0 bg-white/24" aria-hidden="true"/>
    <span className="absolute inset-0 bg-gradient-to-br from-white/30 via-transparent to-ink/10" aria-hidden="true"/>

    {images[1]&&<div className="absolute right-[5%] top-[9%] z-10 h-[57%] w-[58%] rotate-[1.25deg] overflow-hidden border border-white/75 bg-white/35 shadow-[0_24px_55px_-28px_rgba(15,23,42,.5)] backdrop-blur-[1px] sm:right-[6%] sm:h-[60%] sm:w-[46%]" aria-hidden="true">
      <img
        src={images[1].src}
        alt=""
        loading="lazy"
        decoding="async"
        className="size-full object-cover"
        style={{ objectPosition: images[1].position || '50% 50%', opacity: 0.46 }}
      />
      <span className="absolute inset-0 bg-gradient-to-br from-white/20 via-transparent to-white/10" aria-hidden="true"/>
    </div>}

    {images[2]&&<div className="absolute bottom-[8%] left-[7%] z-20 hidden h-[48%] w-[42%] -rotate-[1.5deg] overflow-hidden border border-white/70 bg-white/30 shadow-[0_26px_58px_-30px_rgba(15,23,42,.55)] backdrop-blur-[1px] sm:block" aria-hidden="true">
      <img
        src={images[2].src}
        alt=""
        loading="lazy"
        decoding="async"
        className="size-full object-cover"
        style={{ objectPosition: images[2].position || '50% 50%', opacity: 0.34 }}
      />
      <span className="absolute inset-0 bg-gradient-to-tr from-white/15 via-transparent to-white/20" aria-hidden="true"/>
    </div>}

    <span className="absolute inset-0 z-30 bg-gradient-to-r from-[#EEF2F7]/60 via-white/5 to-transparent" aria-hidden="true"/>
  </div>;
}
