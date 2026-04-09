import { supabase } from "@/src/infrastructure/supabaseClient";

export async function updateUserProfile(displayName: string, photoUrl: string) {

  await supabase.auth.updateUser({
    data: {
      display_name: displayName,
      photo_url: photoUrl
    }
  });
}