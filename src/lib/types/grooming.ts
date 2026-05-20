export interface GroomingArticle {
  id: number;
  title: string;
  summary: string | null;
  body: string;
  cover_image_url: string;
  category: string;
  read_time: string | null;
  is_featured: boolean;
  display_order: number;
  created_at: string;
}

export type GroomingCategory =
  | "BEARD"
  | "SHAVING"
  | "SKINCARE"
  | "FITNESS"
  | "BARBERSHOP";
