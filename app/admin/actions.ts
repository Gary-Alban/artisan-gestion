"use server";

import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/admin";
import { createAdminClient } from "@/lib/supabase/admin";

export async function updateUserActive(profileId: string, isActive: boolean) {
  const { supabase, user } = await requireAdmin();

  if (profileId === user.id && !isActive) {
    return {
      ok: false,
      message: "Impossible de desactiver votre propre compte administrateur.",
    };
  }

  const { error } = await supabase
    .from("profiles")
    .update({ is_active: isActive })
    .eq("id", profileId);

  if (error) {
    return { ok: false, message: error.message };
  }

  revalidatePath("/admin/users");
  revalidatePath("/admin");
  return {
    ok: true,
    message: isActive ? "Utilisateur active." : "Utilisateur desactive.",
  };
}

export async function deleteUserAccount(profileId: string) {
  const { supabase, user } = await requireAdmin();

  if (!profileId) {
    return { ok: false, message: "Utilisateur introuvable." };
  }

  if (profileId === user.id) {
    return {
      ok: false,
      message: "Impossible de supprimer votre propre compte administrateur.",
    };
  }

  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("id, email, is_admin")
    .eq("id", profileId)
    .maybeSingle();

  if (profileError) {
    return { ok: false, message: profileError.message };
  }

  if (!profile) {
    return { ok: false, message: "Utilisateur introuvable." };
  }

  if (profile.is_admin) {
    return {
      ok: false,
      message: "Impossible de supprimer un compte administrateur depuis ce panneau.",
    };
  }

  let adminSupabase: ReturnType<typeof createAdminClient>;
  try {
    adminSupabase = createAdminClient();
  } catch (error) {
    return {
      ok: false,
      message: error instanceof Error ? error.message : "Configuration Supabase admin invalide.",
    };
  }

  const { error } = await adminSupabase.auth.admin.deleteUser(profileId);

  if (error) {
    return { ok: false, message: error.message };
  }

  revalidatePath("/admin/users");
  revalidatePath("/admin/audits");
  revalidatePath("/admin");

  return {
    ok: true,
    message: `Utilisateur ${profile.email} supprime avec ses audits.`,
  };
}
