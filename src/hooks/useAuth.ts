"use client";

import { useEffect, useState } from "react";
import { supabase } from "../infrastructure/supabaseClient";

export function useAuth() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkUser();

    const { data: listener } = supabase.auth.onAuthStateChange(
      (_, session) => {
        setUser(session?.user ?? null);
      }
    );

    return () => {
      listener.subscription.unsubscribe();
    };
  }, []);

  async function checkUser() {
  const { data } = await supabase.auth.getSession();

  setUser(data.session?.user ?? null);
  setLoading(false);
}

  return { user, loading };
}