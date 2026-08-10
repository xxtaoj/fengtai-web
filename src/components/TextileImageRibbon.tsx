type RibbonImage = {
  src: string;
  alt: string;
  position?: string;
};

export function TextileImageRibbon({ images, dark = false, className = '' }: { images: RibbonImage[]; dark?: boolean; className?: string }) {
  return <div className={`relative overflow-hidden ${className}`}>
    <div className="grid h-full min-h-[inherit] grid-cols-3">
      {images.map((image, index) => <div key={`${image.src}-${index}`} className="relative min-h-64 overflow-hidden border-l border-white/15 first:border-l-0">
        <img
          src={image.src}
          alt={image.alt}
          loading="lazy"
          decoding="async"
          className="absolute inset-0 size-full object-cover"
          style={{ objectPosition: image.position || '50% 50%' }}
        />
        <span className={`absolute inset-0 ${dark ? 'bg-ink/42' : 'bg-white/10'}`} aria-hidden="true"/>
      </div>)}
    </div>
    <span className="product-selvedge absolute inset-y-0 left-0 w-7" aria-hidden="true"/>
  </div>;
}
