import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { Card } from "@/components/ui/card";

export default async function AccountPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  return (
    <main className="mx-auto max-w-3xl px-6 py-10">
      <Card>
        <h1 className="font-serif text-3xl text-primary">Compte</h1>
        <p className="mt-4 text-secondary">{user.email}</p>
      </Card>
    </main>
  );
}
