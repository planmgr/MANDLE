"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { extractTags } from "@/lib/utils/tags";

export async function createPost(formData: FormData) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Unauthorized");

  const imageFile = formData.get("image") as File;
  const caption = formData.get("caption") as string;

  // Upload image
  const ext = imageFile.name.split(".").pop();
  const path = `${user.id}/${crypto.randomUUID()}.${ext}`;

  const { error: uploadError } = await supabase.storage
    .from("posts")
    .upload(path, imageFile, { contentType: imageFile.type });

  if (uploadError) throw new Error("이미지 업로드에 실패했습니다.");

  const { data: urlData } = supabase.storage.from("posts").getPublicUrl(path);

  // Create post
  const { data: post, error: postError } = await supabase
    .from("posts")
    .insert({ user_id: user.id, image_url: urlData.publicUrl, caption })
    .select()
    .single();

  if (postError) throw new Error("게시글 작성에 실패했습니다.");

  // Extract and create tags
  if (caption) {
    const tagNames = extractTags(caption);
    for (const name of tagNames) {
      const { data: tag } = await supabase
        .from("tags")
        .upsert({ name }, { onConflict: "name" })
        .select()
        .single();

      if (tag) {
        await supabase.from("post_tags").insert({ post_id: post.id, tag_id: tag.id });
      }
    }
  }

  revalidatePath("/community");
  return post;
}

export async function deletePost(postId: number) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Unauthorized");

  const { data: post } = await supabase
    .from("posts")
    .select("image_url")
    .eq("id", postId)
    .eq("user_id", user.id)
    .single();

  if (!post) throw new Error("게시글을 찾을 수 없습니다.");

  // Delete storage image
  const url = new URL(post.image_url);
  const storagePath = url.pathname.split("/storage/v1/object/public/posts/")[1];
  if (storagePath) {
    await supabase.storage.from("posts").remove([decodeURIComponent(storagePath)]);
  }

  await supabase.from("posts").delete().eq("id", postId);
  revalidatePath("/community");
}

export async function toggleLike(postId: number) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Unauthorized");

  const { data: existing } = await supabase
    .from("likes")
    .select()
    .eq("user_id", user.id)
    .eq("post_id", postId)
    .single();

  if (existing) {
    await supabase.from("likes").delete().eq("user_id", user.id).eq("post_id", postId);
    return { liked: false };
  } else {
    await supabase.from("likes").insert({ user_id: user.id, post_id: postId });
    return { liked: true };
  }
}

export async function addComment(postId: number, content: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Unauthorized");

  const { data, error } = await supabase
    .from("comments")
    .insert({ post_id: postId, user_id: user.id, content })
    .select("*, profiles!comments_user_id_profiles_fkey(*)")
    .single();

  if (error) throw new Error("댓글 작성에 실패했습니다.");
  return data;
}

export async function deleteComment(commentId: number) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Unauthorized");

  await supabase.from("comments").delete().eq("id", commentId).eq("user_id", user.id);
}

export async function toggleBookmark(postId: number) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Unauthorized");

  const { data: existing } = await supabase
    .from("bookmarks")
    .select()
    .eq("user_id", user.id)
    .eq("post_id", postId)
    .single();

  if (existing) {
    await supabase.from("bookmarks").delete().eq("user_id", user.id).eq("post_id", postId);
    return { bookmarked: false };
  } else {
    await supabase.from("bookmarks").insert({ user_id: user.id, post_id: postId });
    return { bookmarked: true };
  }
}

export async function updateProfile(formData: FormData) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Unauthorized");

  const nickname = (formData.get("nickname") as string)?.trim();
  const bio = (formData.get("bio") as string)?.trim() || null;
  const avatarFile = formData.get("avatar") as File | null;

  if (!nickname) throw new Error("닉네임을 입력해주세요.");

  let avatarUrl: string | undefined;

  // Upload avatar if provided
  if (avatarFile && avatarFile.size > 0) {
    const ext = avatarFile.name.split(".").pop();
    const path = `${user.id}/avatar.${ext}`;

    const { error: uploadError } = await supabase.storage
      .from("avatars")
      .upload(path, avatarFile, { contentType: avatarFile.type, upsert: true });

    if (uploadError) throw new Error("아바타 업로드에 실패했습니다.");

    const { data: urlData } = supabase.storage.from("avatars").getPublicUrl(path);
    avatarUrl = `${urlData.publicUrl}?t=${Date.now()}`;
  }

  // Update profiles table
  const profileUpdate: Record<string, unknown> = { nickname, bio, updated_at: new Date().toISOString(), nickname_set_by_user: true };
  if (avatarUrl) profileUpdate.avatar_url = avatarUrl;

  const { error: profileError } = await supabase
    .from("profiles")
    .update(profileUpdate)
    .eq("id", user.id);

  if (profileError) throw new Error("프로필 업데이트에 실패했습니다.");

  // Sync auth user_metadata
  const metadata: Record<string, string> = { nickname };
  if (avatarUrl) metadata.avatar_url = avatarUrl;

  await supabase.auth.updateUser({ data: metadata });

  revalidatePath("/my");
  return { success: true };
}

export async function toggleFollow(targetUserId: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Unauthorized");

  const { data: existing } = await supabase
    .from("follows")
    .select()
    .eq("follower_id", user.id)
    .eq("following_id", targetUserId)
    .single();

  if (existing) {
    await supabase.from("follows").delete().eq("follower_id", user.id).eq("following_id", targetUserId);
    return { following: false };
  } else {
    await supabase.from("follows").insert({ follower_id: user.id, following_id: targetUserId });
    return { following: true };
  }
}

// ===== BOARD ACTIONS =====

export async function createBoardPost(formData: FormData) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Unauthorized");

  const title = (formData.get("title") as string)?.trim();
  const body = (formData.get("body") as string)?.trim();
  const category = (formData.get("category") as string)?.trim() || "talk";
  const imageFile = formData.get("image") as File | null;

  if (!title || !body) throw new Error("제목과 본문을 입력해주세요.");

  let imageUrl: string | null = null;

  if (imageFile && imageFile.size > 0) {
    const ext = imageFile.name.split(".").pop();
    const path = `${user.id}/${crypto.randomUUID()}.${ext}`;

    const { error: uploadError } = await supabase.storage
      .from("posts")
      .upload(path, imageFile, { contentType: imageFile.type });

    if (uploadError) throw new Error("이미지 업로드에 실패했습니다.");

    const { data: urlData } = supabase.storage.from("posts").getPublicUrl(path);
    imageUrl = urlData.publicUrl;
  }

  const { error } = await supabase
    .from("board_posts")
    .insert({ user_id: user.id, title, body, image_url: imageUrl, category });

  if (error) throw new Error("글 작성에 실패했습니다.");

  revalidatePath("/community");
}

export async function deleteBoardPost(postId: number) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Unauthorized");

  const { data: post } = await supabase
    .from("board_posts")
    .select("image_url")
    .eq("id", postId)
    .eq("user_id", user.id)
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
}

export async function toggleBoardLike(postId: number) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Unauthorized");

  const { data: existing } = await supabase
    .from("board_likes")
    .select()
    .eq("user_id", user.id)
    .eq("board_post_id", postId)
    .single();

  if (existing) {
    await supabase.from("board_likes").delete().eq("user_id", user.id).eq("board_post_id", postId);
    return { liked: false };
  } else {
    await supabase.from("board_likes").insert({ user_id: user.id, board_post_id: postId });
    return { liked: true };
  }
}

export async function addBoardComment(postId: number, content: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Unauthorized");

  const { data, error } = await supabase
    .from("board_comments")
    .insert({ board_post_id: postId, user_id: user.id, content })
    .select("*, profiles!board_comments_user_id_fkey(*)")
    .single();

  if (error) throw new Error("댓글 작성에 실패했습니다.");
  return data;
}

export async function deleteBoardComment(commentId: number) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Unauthorized");

  await supabase.from("board_comments").delete().eq("id", commentId).eq("user_id", user.id);
}
