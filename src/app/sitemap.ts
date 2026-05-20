import type { MetadataRoute } from "next";
import { createClient } from "@/lib/supabase/server";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = "https://mandle.kr";

  // Static pages
  const staticPages: MetadataRoute.Sitemap = [
    { url: baseUrl, changeFrequency: "daily", priority: 1 },
    { url: `${baseUrl}/style`, changeFrequency: "daily", priority: 0.9 },
    { url: `${baseUrl}/grooming`, changeFrequency: "daily", priority: 0.9 },
    { url: `${baseUrl}/members`, changeFrequency: "weekly", priority: 0.8 },
    { url: `${baseUrl}/community`, changeFrequency: "daily", priority: 0.8 },
    { url: `${baseUrl}/shop`, changeFrequency: "monthly", priority: 0.5 },
  ];

  const supabase = await createClient();

  // Style articles
  const { data: styleArticles } = await supabase
    .from("style_articles")
    .select("id, updated_at");

  const stylePages: MetadataRoute.Sitemap = (styleArticles ?? []).map((a) => ({
    url: `${baseUrl}/style/${a.id}`,
    lastModified: a.updated_at,
    changeFrequency: "weekly",
    priority: 0.7,
  }));

  // Grooming articles
  const { data: groomingArticles } = await supabase
    .from("grooming_articles")
    .select("id, updated_at");

  const groomingPages: MetadataRoute.Sitemap = (groomingArticles ?? []).map((a) => ({
    url: `${baseUrl}/grooming/${a.id}`,
    lastModified: a.updated_at,
    changeFrequency: "weekly",
    priority: 0.7,
  }));

  // Featured members
  const { data: members } = await supabase
    .from("featured_members")
    .select("user_id, created_at")
    .eq("is_active", true);

  const memberPages: MetadataRoute.Sitemap = (members ?? []).map((m) => ({
    url: `${baseUrl}/members/${m.user_id}`,
    lastModified: m.created_at,
    changeFrequency: "monthly",
    priority: 0.6,
  }));

  return [...staticPages, ...stylePages, ...groomingPages, ...memberPages];
}
