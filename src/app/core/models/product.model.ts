export interface Variant {
  label?: string;      // 👈 NEW
  type?: string;       // 👈 OLD (keep for backward compatibility)
  price: number;
  dimensions?: string;
}

export interface Product {
  id: string;
  name: string;
  category: string;
  description: string;
  images: string[];
price?:number;
  variants?: Variant[];
}