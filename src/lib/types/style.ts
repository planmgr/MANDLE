export interface StyleArticle {
  id: number;
  title: string;
  summary: string | null;
  body: string;
  cover_image_url: string;
  category: string;
  is_featured: boolean;
  display_order: number;
  created_at: string;
}

export type StyleCategory =
  | "MINIMAL"
  | "STREET"
  | "GENTLEMAN"
  | "BUSINESS"
  | "FITNESS"
  | "BEARD"
  | "GLASSES"
  | "FRAGRANCE";
