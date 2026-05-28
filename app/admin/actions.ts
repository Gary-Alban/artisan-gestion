"use server";

import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/admin";

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
