drop policy if exists users_delete_own_audits on public.audits;
create policy users_delete_own_audits
on public.audits
for delete
using (auth.uid() = user_id);
