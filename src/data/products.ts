import type { AlternativeProduct, ProductRecommendation } from "@/types";

import alternativesSeed from "./product-alternatives.json";
import productsSeed from "./products.json";

const products: ProductRecommendation[] = productsSeed as ProductRecommendation[];
const alternatives: AlternativeProduct[] = alternativesSeed as AlternativeProduct[];

export function getProducts(): ProductRecommendation[] {
  return products;
}

export function getProductById(id: string): ProductRecommendation | undefined {
  return products.find((product) => product.id === id);
}

/** The "Best match" product — only tab with real content built so far (see ProductRecommendationsScreen). */
export function getFeaturedProduct(): ProductRecommendation {
  return products[0];
}

export function getAlternativeProducts(): AlternativeProduct[] {
  return alternatives;
}
