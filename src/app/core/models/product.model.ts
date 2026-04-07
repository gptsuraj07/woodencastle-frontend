export interface Variant {
  type: string;
  dimensions: string;
  price: number;
}

export interface Product {
  id: string;
  name: string;
  category: string;
  description: string;
  images: string[];

  variants: Variant[];
}