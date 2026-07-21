import { products as seedProducts } from '../data/products';
import { productCategories as seedCategories } from '../data/productCategories';
import type { Catalog } from '../types/catalog';
import type { Product } from '../types/product';

export const catalogStorageKey = 'fengtai-catalog-v1';

export const defaultCatalog: Catalog = {
  products: seedProducts,
  categories: seedCategories,
};

function isProduct(value: unknown): value is Product {
  if (!value || typeof value !== 'object') return false;
  const product = value as Partial<Product>;
  return typeof product.id === 'number'
    && typeof product.slug === 'string'
    && typeof product.image === 'string'
    && typeof product.group === 'string'
    && typeof product.subcategory === 'string'
    && typeof product.nameZh === 'string'
    && typeof product.nameEn === 'string'
    && typeof product.categoryZh === 'string'
    && typeof product.categoryEn === 'string'
    && typeof product.summaryZh === 'string'
    && typeof product.summaryEn === 'string'
    && Array.isArray(product.specsZh)
    && Array.isArray(product.specsEn);
}

function isCatalog(value: unknown): value is Catalog {
  if (!value || typeof value !== 'object') return false;
  const catalog = value as Partial<Catalog>;
  return Array.isArray(catalog.products)
    && catalog.products.every(isProduct)
    && Array.isArray(catalog.categories)
    && catalog.categories.every(category => {
      if (!category || typeof category !== 'object') return false;
      const item = category as Record<string, unknown>;
      return ['id', 'group', 'titleZh', 'titleEn', 'descriptionZh', 'descriptionEn']
        .every(key => typeof item[key] === 'string');
    });
}

export function cloneDefaultCatalog(): Catalog {
  return JSON.parse(JSON.stringify(defaultCatalog)) as Catalog;
}

export function loadCatalog(): Catalog {
  if (typeof window === 'undefined') return cloneDefaultCatalog();
  try {
    const raw = window.localStorage.getItem(catalogStorageKey);
    if (!raw) return cloneDefaultCatalog();
    const parsed: unknown = JSON.parse(raw);
    return isCatalog(parsed) ? parsed : cloneDefaultCatalog();
  } catch {
    return cloneDefaultCatalog();
  }
}

export function saveCatalog(catalog: Catalog): void {
  if (typeof window === 'undefined') return;
  window.localStorage.setItem(catalogStorageKey, JSON.stringify(catalog));
}

export function resetCatalog(): Catalog {
  const fresh = cloneDefaultCatalog();
  if (typeof window !== 'undefined') window.localStorage.removeItem(catalogStorageKey);
  return fresh;
}

export function downloadCatalog(catalog: Catalog): void {
  if (typeof document === 'undefined') return;
  const blob = new Blob([JSON.stringify(catalog, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `fengtai-catalog-${new Date().toISOString().slice(0, 10)}.json`;
  link.click();
  URL.revokeObjectURL(url);
}

export function readCatalogFile(file: File): Promise<Catalog> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const parsed: unknown = JSON.parse(String(reader.result));
        if (!isCatalog(parsed)) throw new Error('Invalid catalog');
        resolve(parsed);
      } catch {
        reject(new Error('Invalid catalog'));
      }
    };
    reader.onerror = () => reject(new Error('Could not read file'));
    reader.readAsText(file);
  });
}

export function readImageFile(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    if (!file.type.startsWith('image/')) {
      reject(new Error('Image files only'));
      return;
    }
    if (file.size > 3 * 1024 * 1024) {
      reject(new Error('Image must be 3MB or smaller'));
      return;
    }
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = () => reject(new Error('Could not read image'));
    reader.readAsDataURL(file);
  });
}
