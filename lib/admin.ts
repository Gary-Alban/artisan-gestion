import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import type { Profile } from "@/lib/types";

export async function getAdminContext() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { supabase, user: null, profile: null };
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  return {
    supabase,
    user,
    profile: profile as Profile | null,
  };
}

export async function requireAdmin() {
  const context = await getAdminContext();

  if (!context.user) redirect("/login?redirect=/admin");
  if (!context.profile?.is_admin) redirect("/dashboard");

  return {
    supabase: context.supabase,
    user: context.user,
    profile: context.profile,
  };
}
