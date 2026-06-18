"use client";

import { useEffect, useMemo, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Search, Trash2 } from "lucide-react";
import { deleteUserAccount, updateUserActive } from "@/app/admin/actions";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export type AdminUserRow = {
  id: string;
  email: string;
  created_at: string;
  is_active: boolean;
  is_admin: boolean;
  audit_count: number;
};

function formatDate(value: string) {
  return new Intl.DateTimeFormat("fr-FR", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(new Date(value));
}

export function UsersTable({ users }: { users: AdminUserRow[] }) {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [items, setItems] = useState(users);
  const [message, setMessage] = useState<string | null>(null);
  const [pendingId, setPendingId] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const filteredUsers = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    if (!normalized) return items;
    return items.filter((user) => user.email.toLowerCase().includes(normalized));
  }, [items, query]);

  useEffect(() => {
    setItems(users);
  }, [users]);

  function toggleUser(profileId: string, nextValue: boolean) {
    const previousItems = items;
    setItems((current) =>
      current.map((user) =>
        user.id === profileId ? { ...user, is_active: nextValue } : user,
      ),
    );
    setPendingId(profileId);
    setMessage(null);

    startTransition(async () => {
      const result = await updateUserActive(profileId, nextValue);
      if (!result.ok) {
        setItems(previousItems);
      }
      setMessage(result.message);
      setPendingId(null);
      if (result.ok) router.refresh();
    });
  }

  function deleteUser(profileId: string, email: string, isAdmin: boolean) {
    if (isAdmin) {
      setMessage("Impossible de supprimer un compte administrateur depuis ce panneau.");
      return;
    }

    const confirmed = window.confirm(
      `Supprimer definitivement ${email} ? Son compte et tous ses audits seront supprimes.`,
    );

    if (!confirmed) return;

    const previousItems = items;
    setItems((current) => current.filter((user) => user.id !== profileId));
    setPendingId(profileId);
    setMessage(null);

    startTransition(async () => {
      const result = await deleteUserAccount(profileId);

      if (!result.ok) {
        setItems(previousItems);
      }

      setMessage(result.message);
      setPendingId(null);
      if (result.ok) router.refresh();
    });
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <label className="relative block sm:w-80">
          <Search
            size={17}
            className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-secondary"
          />
          <Input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Rechercher par email"
            className="pl-9"
          />
        </label>
      </div>
      {message && (
        <div
          role="status"
          className="fixed bottom-5 right-5 z-50 rounded-md border border-primary/10 bg-white px-4 py-3 text-sm font-semibold text-primary shadow-lg"
        >
          {message}
        </div>
      )}

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Email</TableHead>
            <TableHead>Inscription</TableHead>
            <TableHead>Statut</TableHead>
            <TableHead className="text-center">Audits</TableHead>
            <TableHead className="text-right">Activation</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredUsers.map((user) => (
            <TableRow key={user.id}>
              <TableCell className="font-semibold text-primary">
                {user.email}
                {user.is_admin && (
                  <Badge variant="warning" className="ml-2">
                    Admin
                  </Badge>
                )}
              </TableCell>
              <TableCell>{formatDate(user.created_at)}</TableCell>
              <TableCell>
                <Badge variant={user.is_active ? "success" : "secondary"}>
                  {user.is_active ? "Actif" : "Inactif"}
                </Badge>
              </TableCell>
              <TableCell className="text-center">{user.audit_count}</TableCell>
              <TableCell className="text-right">
                <Switch
                  checked={user.is_active}
                  disabled={isPending && pendingId === user.id}
                  aria-label={`Activer ou desactiver ${user.email}`}
                  onCheckedChange={(checked) => toggleUser(user.id, checked)}
                />
              </TableCell>
              <TableCell className="text-right">
                <Button
                  variant="ghost"
                  disabled={user.is_admin || (isPending && pendingId === user.id)}
                  onClick={() => deleteUser(user.id, user.email, user.is_admin)}
                  className="min-h-9 px-3 text-red-700 hover:bg-red-50 hover:text-red-800"
                  title={
                    user.is_admin
                      ? "Les comptes administrateurs sont proteges"
                      : "Supprimer ce compte et ses audits"
                  }
                >
                  <Trash2 size={16} />
                  Supprimer
                </Button>
              </TableCell>
            </TableRow>
          ))}
          {filteredUsers.length === 0 && (
            <TableRow>
              <TableCell colSpan={6} className="text-center">
                Aucun utilisateur ne correspond a cette recherche.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
