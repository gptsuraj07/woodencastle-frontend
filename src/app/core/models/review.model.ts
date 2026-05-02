export interface Review {
  product_id?: string;
  name: string;
  rating: number;
  comment: string;
  images: string[];
  created_at?: string;
}