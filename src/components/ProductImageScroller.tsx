import type { Product } from '../types/product';
import { LocalImage } from './Media';

function productImages(product: Product) {
  return [product.image, ...(product.gallery || [])].filter((image, index, images) => image && images.indexOf(image) === index);
}

export function ProductImageScroller({ product, alt, className = 'aspect-[4/3]', imageClassName = 'object-cover', loading = 'lazy' }: { product: Product; alt: string; className?: string; imageClassName?: string; loading?: 'lazy' | 'eager' }) {
  const images = productImages(product);
  if (images.length <= 1) {
    return <LocalImage loading={loading} decoding="async" src={images[0] || product.image} alt={alt} className={`${className} w-full bg-canvas ${imageClassName}`}/>;
  }

  return <div className={`relative overflow-hidden bg-canvas ${className}`}>
    <div className="flex size-full snap-x snap-mandatory overflow-x-auto scroll-smooth [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
      {images.map((image, index) => <LocalImage
        key={image}
        loading={index === 0 ? loading : 'lazy'}
        decoding="async"
        src={image}
        alt={`${alt} ${index + 1}`}
        className={`size-full shrink-0 snap-center ${imageClassName}`}
      />)}
    </div>
    <div className="pointer-events-none absolute bottom-3 left-3 flex gap-1.5">
      {images.map((image, index) => <span key={image} className="size-1.5 rounded-full bg-white/85 shadow-sm" aria-label={`Image ${index + 1}`}/>)}
    </div>
  </div>;
}
