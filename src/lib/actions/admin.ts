"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { isAdmin } from "@/lib/admin";

async function requireAdmin() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user || !isAdmin(user.email)) throw new Error("Unauthorized");
  return { supabase, user };
}

async function uploadCoverImage(supabase: ReturnType<typeof Object>, file: File, folder: string): Promise<string> {
  const ext = file.name.split(".").pop();
  const path = `admin/${folder}/${crypto.randomUUID()}.${ext}`;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { error } = await (supabase as any).storage
    .from("posts")
    .upload(path, file, { contentType: file.type });

  if (error) throw new Error("이미지 업로드에 실패했습니다.");

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data } = (supabase as any).storage.from("posts").getPublicUrl(path);
  return data.publicUrl;
}

// ===== CONTENT IMAGE UPLOAD =====

export async function uploadContentImage(formData: FormData): Promise<string> {
  const { supabase } = await requireAdmin();

  const file = formData.get("file") as File | null;
  if (!file || file.size === 0) throw new Error("파일을 선택해주세요.");

  const ext = file.name.split(".").pop();
  const path = `admin/content/${crypto.randomUUID()}.${ext}`;

  const { error } = await supabase.storage
    .from("posts")
    .upload(path, file, { contentType: file.type });

  if (error) throw new Error("이미지 업로드에 실패했습니다.");

  const { data } = supabase.storage.from("posts").getPublicUrl(path);
  return data.publicUrl;
}

// ===== STYLE ARTICLES =====

export async function createStyleArticle(formData: FormData) {
  const { supabase } = await requireAdmin();

  const title = (formData.get("title") as string)?.trim();
  const summary = (formData.get("summary") as string)?.trim() || null;
  const body = (formData.get("body") as string)?.trim() || "";
  const category = formData.get("category") as string;
  const isFeatured = formData.get("is_featured") === "true";
  const displayOrder = Number(formData.get("display_order") ?? 0);
  const imageFile = formData.get("cover_image") as File | null;

  if (!title || !category) throw new Error("제목과 카테고리는 필수입니다.");

  let coverImageUrl = "";
  if (imageFile && imageFile.size > 0) {
    coverImageUrl = await uploadCoverImage(supabase, imageFile, "style");
  } else {
    const urlValue = formData.get("cover_image_url") as string;
    if (urlValue) coverImageUrl = urlValue;
  }

  if (!coverImageUrl) throw new Error("커버 이미지는 필수입니다.");

  const { error } = await supabase.from("style_articles").insert({
    title,
    summary,
    body,
    cover_image_url: coverImageUrl,
    category,
    is_featured: isFeatured,
    display_order: displayOrder,
  });

  if (error) throw new Error("글 작성에 실패했습니다.");
  revalidatePath("/style");
  revalidatePath("/admin/style");
}

export async function updateStyleArticle(id: number, formData: FormData) {
  const { supabase } = await requireAdmin();

  const title = (formData.get("title") as string)?.trim();
  const summary = (formData.get("summary") as string)?.trim() || null;
  const body = (formData.get("body") as string)?.trim() || "";
  const category = formData.get("category") as string;
  const isFeatured = formData.get("is_featured") === "true";
  const displayOrder = Number(formData.get("display_order") ?? 0);
  const imageFile = formData.get("cover_image") as File | null;

  if (!title || !category) throw new Error("제목과 카테고리는 필수입니다.");

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const update: Record<string, any> = {
    title,
    summary,
    body,
    category,
    is_featured: isFeatured,
    display_order: displayOrder,
    updated_at: new Date().toISOString(),
  };

  if (imageFile && imageFile.size > 0) {
    update.cover_image_url = await uploadCoverImage(supabase, imageFile, "style");
  }

  const { error } = await supabase
    .from("style_articles")
    .update(update)
    .eq("id", id);

  if (error) throw new Error("글 수정에 실패했습니다.");
  revalidatePath("/style");
  revalidatePath("/admin/style");
}

export async function deleteStyleArticle(id: number) {
  const { supabase } = await requireAdmin();

  const { error } = await supabase.from("style_articles").delete().eq("id", id);
  if (error) throw new Error("삭제에 실패했습니다.");
  revalidatePath("/style");
  revalidatePath("/admin/style");
}

// ===== GROOMING ARTICLES =====

export async function createGroomingArticle(formData: FormData) {
  const { supabase } = await requireAdmin();

  const title = (formData.get("title") as string)?.trim();
  const summary = (formData.get("summary") as string)?.trim() || null;
  const body = (formData.get("body") as string)?.trim() || "";
  const category = formData.get("category") as string;
  const readTime = (formData.get("read_time") as string)?.trim() || null;
  const isFeatured = formData.get("is_featured") === "true";
  const displayOrder = Number(formData.get("display_order") ?? 0);
  const imageFile = formData.get("cover_image") as File | null;

  if (!title || !category) throw new Error("제목과 카테고리는 필수입니다.");

  let coverImageUrl = "";
  if (imageFile && imageFile.size > 0) {
    coverImageUrl = await uploadCoverImage(supabase, imageFile, "grooming");
  } else {
    const urlValue = formData.get("cover_image_url") as string;
    if (urlValue) coverImageUrl = urlValue;
  }

  if (!coverImageUrl) throw new Error("커버 이미지는 필수입니다.");

  const { error } = await supabase.from("grooming_articles").insert({
    title,
    summary,
    body,
    cover_image_url: coverImageUrl,
    category,
    read_time: readTime,
    is_featured: isFeatured,
    display_order: displayOrder,
  });

  if (error) throw new Error("글 작성에 실패했습니다.");
  revalidatePath("/grooming");
  revalidatePath("/admin/grooming");
}

export async function updateGroomingArticle(id: number, formData: FormData) {
  const { supabase } = await requireAdmin();

  const title = (formData.get("title") as string)?.trim();
  const summary = (formData.get("summary") as string)?.trim() || null;
  const body = (formData.get("body") as string)?.trim() || "";
  const category = formData.get("category") as string;
  const readTime = (formData.get("read_time") as string)?.trim() || null;
  const isFeatured = formData.get("is_featured") === "true";
  const displayOrder = Number(formData.get("display_order") ?? 0);
  const imageFile = formData.get("cover_image") as File | null;

  if (!title || !category) throw new Error("제목과 카테고리는 필수입니다.");

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const update: Record<string, any> = {
    title,
    summary,
    body,
    category,
    read_time: readTime,
    is_featured: isFeatured,
    display_order: displayOrder,
    updated_at: new Date().toISOString(),
  };

  if (imageFile && imageFile.size > 0) {
    update.cover_image_url = await uploadCoverImage(supabase, imageFile, "grooming");
  }

  const { error } = await supabase
    .from("grooming_articles")
    .update(update)
    .eq("id", id);

  if (error) throw new Error("글 수정에 실패했습니다.");
  revalidatePath("/grooming");
  revalidatePath("/admin/grooming");
}

export async function deleteGroomingArticle(id: number) {
  const { supabase } = await requireAdmin();

  const { error } = await supabase.from("grooming_articles").delete().eq("id", id);
  if (error) throw new Error("삭제에 실패했습니다.");
  revalidatePath("/grooming");
  revalidatePath("/admin/grooming");
}

// ===== FEATURED MEMBERS =====

export async function createFeaturedMember(formData: FormData) {
  const { supabase } = await requireAdmin();

  const userId = formData.get("user_id") as string;
  const interview = (formData.get("interview") as string)?.trim() || "";
  const tagline = (formData.get("tagline") as string)?.trim() || null;
  const displayOrder = Number(formData.get("display_order") ?? 0);
  const isActive = formData.get("is_active") !== "false";
  const imageFile = formData.get("cover_image") as File | null;

  if (!userId) throw new Error("유저를 선택해주세요.");

  let coverImageUrl: string | null = null;
  if (imageFile && imageFile.size > 0) {
    coverImageUrl = await uploadCoverImage(supabase, imageFile, "members");
  }

  const { error } = await supabase.from("featured_members").insert({
    user_id: userId,
    interview,
    cover_image_url: coverImageUrl,
    tagline,
    display_order: displayOrder,
    is_active: isActive,
  });

  if (error) {
    if (error.code === "23505") throw new Error("이미 등록된 멤버입니다.");
    throw new Error("멤버 추가에 실패했습니다.");
  }
  revalidatePath("/members");
  revalidatePath("/admin/members");
}

export async function updateFeaturedMember(id: number, formData: FormData) {
  const { supabase } = await requireAdmin();

  const interview = (formData.get("interview") as string)?.trim() || "";
  const tagline = (formData.get("tagline") as string)?.trim() || null;
  const displayOrder = Number(formData.get("display_order") ?? 0);
  const isActive = formData.get("is_active") !== "false";
  const imageFile = formData.get("cover_image") as File | null;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const update: Record<string, any> = {
    interview,
    tagline,
    display_order: displayOrder,
    is_active: isActive,
  };

  if (imageFile && imageFile.size > 0) {
    update.cover_image_url = await uploadCoverImage(supabase, imageFile, "members");
  }

  const { error } = await supabase
    .from("featured_members")
    .update(update)
    .eq("id", id);

  if (error) throw new Error("멤버 수정에 실패했습니다.");
  revalidatePath("/members");
  revalidatePath("/admin/members");
}

export async function deleteFeaturedMember(id: number) {
  const { supabase } = await requireAdmin();

  const { error } = await supabase.from("featured_members").delete().eq("id", id);
  if (error) throw new Error("삭제에 실패했습니다.");
  revalidatePath("/members");
  revalidatePath("/admin/members");
}

// ===== COMMUNITY MANAGEMENT =====

export async function adminDeletePost(postId: number) {
  const { supabase } = await requireAdmin();

  const { data: post } = await supabase
    .from("posts")
    .select("image_url")
    .eq("id", postId)
    .single();

  if (!post) throw new Error("게시글을 찾을 수 없습니다.");

  if (post.image_url) {
    const url = new URL(post.image_url);
    const storagePath = url.pathname.split("/storage/v1/object/public/posts/")[1];
    if (storagePath) {
      await supabase.storage.from("posts").remove([decodeURIComponent(storagePath)]);
    }
  }

  await supabase.from("posts").delete().eq("id", postId);
  revalidatePath("/community");
  revalidatePath("/admin/community");
}

export async function adminToggleBoardPostVisibility(postId: number, isHidden: boolean) {
  const { supabase } = await requireAdmin();

  const { error } = await supabase
    .from("board_posts")
    .update({ is_hidden: isHidden })
    .eq("id", postId);

  if (error) throw new Error("상태 변경에 실패했습니다.");
  revalidatePath("/community");
  revalidatePath("/admin/community");
  return { is_hidden: isHidden };
}

export async function adminDeleteBoardPost(postId: number) {
  const { supabase } = await requireAdmin();

  const { data: post } = await supabase
    .from("board_posts")
    .select("image_url")
    .eq("id", postId)
    .single();

  if (!post) throw new Error("글을 찾을 수 없습니다.");

  if (post.image_url) {
    const url = new URL(post.image_url);
    const storagePath = url.pathname.split("/storage/v1/object/public/posts/")[1];
    if (storagePath) {
      await supabase.storage.from("posts").remove([decodeURIComponent(storagePath)]);
    }
  }

  await supabase.from("board_posts").delete().eq("id", postId);
  revalidatePath("/community");
  revalidatePath("/admin/community");
}
