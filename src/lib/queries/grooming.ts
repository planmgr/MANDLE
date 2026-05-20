import { createClient } from "@/lib/supabase/server";
import type { GroomingArticle } from "@/lib/types/grooming";

export async function getGroomingArticles(
  category?: string,
  limit: number = 20
): Promise<GroomingArticle[]> {
  const supabase = await createClient();

  let query = supabase
    .from("grooming_articles")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(limit);

  if (category) {
    query = query.eq("category", category);
  }

  const { data } = await query;
  return (data as GroomingArticle[]) ?? [];
}

export async function getGroomingArticleById(
  id: number
): Promise<GroomingArticle | null> {
  const supabase = await createClient();

  const { data } = await supabase
    .from("grooming_articles")
    .select("*")
    .eq("id", id)
    .single();

  return (data as GroomingArticle) ?? null;
}
