import { createClient } from "@/lib/supabase/server";
import type { StyleArticle } from "@/lib/types/style";

export async function getStyleArticles(
  category?: string,
  limit: number = 20
): Promise<StyleArticle[]> {
  const supabase = await createClient();

  let query = supabase
    .from("style_articles")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(limit);

  if (category) {
    query = query.eq("category", category);
  }

  const { data } = await query;
  return (data as StyleArticle[]) ?? [];
}

export async function getFeaturedStyleArticles(
  limit: number = 6
): Promise<StyleArticle[]> {
  const supabase = await createClient();

  const { data } = await supabase
    .from("style_articles")
    .select("*")
    .eq("is_featured", true)
    .order("display_order", { ascending: true })
    .limit(limit);

  return (data as StyleArticle[]) ?? [];
}

export async function getStyleArticleById(
  id: number
): Promise<StyleArticle | null> {
  const supabase = await createClient();

  const { data } = await supabase
    .from("style_articles")
    .select("*")
    .eq("id", id)
    .single();

  return (data as StyleArticle) ?? null;
}

export async function getStyleArticleCountByCategory(): Promise<
  Record<string, number>
> {
  const supabase = await createClient();

  const { data } = await supabase
    .from("style_articles")
    .select("category");

  if (!data) return {};

  const counts: Record<string, number> = {};
  for (const row of data) {
    counts[row.category] = (counts[row.category] ?? 0) + 1;
  }
  return counts;
}
