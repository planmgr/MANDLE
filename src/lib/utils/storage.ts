import { createClient } from "@/lib/supabase/client";

export async function uploadPostImage(file: File, userId: string): Promise<string> {
  const supabase = createClient();
  const ext = file.name.split(".").pop();
  const path = `${userId}/${crypto.randomUUID()}.${ext}`;

  const { error } = await supabase.storage
    .from("posts")
    .upload(path, file, { contentType: file.type, upsert: false });

  if (error) throw error;

  const { data } = supabase.storage.from("posts").getPublicUrl(path);
  return data.publicUrl;
}

export async function uploadAvatar(file: File, userId: string): Promise<string> {
  const supabase = createClient();
  const ext = file.name.split(".").pop();
  const path = `${userId}/avatar.${ext}`;

  const { error } = await supabase.storage
    .from("avatars")
    .upload(path, file, { contentType: file.type, upsert: true });

  if (error) throw error;

  const { data } = supabase.storage.from("avatars").getPublicUrl(path);
  return data.publicUrl;
}
