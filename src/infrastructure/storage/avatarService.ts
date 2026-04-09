import { supabase } from "../supabaseClient";

export async function uploadAvatar(userId: string, file: File) {

  const fileName = `${userId}-${Date.now()}`;

  const { error } = await supabase.storage
    .from("avatars")
    .upload(fileName, file);

  if (error) throw error;

  const { data } = supabase
    .storage
    .from("avatars")
    .getPublicUrl(fileName);

  return data.publicUrl;
}