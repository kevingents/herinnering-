-- Levend Graf — run AFTER `npm run db:push`.
-- Foreign key to auth.users, the new-user → profile trigger, access-helper
-- functions, Row Level Security policies, and the pgvector index.
-- Safe to re-run (idempotent).

-- ── profiles ↔ auth.users ───────────────────────────────────────────────────
do $$ begin
  if not exists (select 1 from pg_constraint where conname = 'profiles_id_fkey') then
    alter table public.profiles
      add constraint profiles_id_fkey
      foreign key (id) references auth.users (id) on delete cascade;
  end if;
end $$;

create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into public.profiles (id, email, full_name, avatar_url)
  values (
    new.id,
    new.email,
    new.raw_user_meta_data ->> 'full_name',
    new.raw_user_meta_data ->> 'avatar_url'
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ── Access-helper functions (security definer to read across tables) ─────────
create or replace function public.is_legacy_owner(p_legacy uuid)
returns boolean language sql stable security definer set search_path = public as $$
  select exists (
    select 1 from public.legacies l
    where l.id = p_legacy and l.owner_id = auth.uid()
  );
$$;

create or replace function public.has_legacy_access(p_legacy uuid)
returns boolean language sql stable security definer set search_path = public as $$
  select exists (
    select 1 from public.legacies l
    where l.id = p_legacy and (l.owner_id = auth.uid() or l.is_public)
  ) or exists (
    select 1 from public.legacy_members m
    where m.legacy_id = p_legacy and m.user_id = auth.uid() and m.status = 'active'
  );
$$;

create or replace function public.can_edit_legacy(p_legacy uuid)
returns boolean language sql stable security definer set search_path = public as $$
  select exists (
    select 1 from public.legacies l
    where l.id = p_legacy and l.owner_id = auth.uid()
  ) or exists (
    select 1 from public.legacy_members m
    where m.legacy_id = p_legacy and m.user_id = auth.uid()
      and m.status = 'active' and m.role in ('contributor', 'admin', 'owner')
  );
$$;

-- ── profiles ────────────────────────────────────────────────────────────────
alter table public.profiles enable row level security;
drop policy if exists "profiles_select_self" on public.profiles;
create policy "profiles_select_self" on public.profiles
  for select using (id = auth.uid());
drop policy if exists "profiles_update_self" on public.profiles;
create policy "profiles_update_self" on public.profiles
  for update using (id = auth.uid()) with check (id = auth.uid());

-- ── legacies ──────────────────────────────────────────────────────────────
alter table public.legacies enable row level security;
drop policy if exists "legacies_select" on public.legacies;
create policy "legacies_select" on public.legacies
  for select using (owner_id = auth.uid() or is_public or public.has_legacy_access(id));
drop policy if exists "legacies_insert" on public.legacies;
create policy "legacies_insert" on public.legacies
  for insert with check (owner_id = auth.uid());
drop policy if exists "legacies_update" on public.legacies;
create policy "legacies_update" on public.legacies
  for update using (public.can_edit_legacy(id)) with check (public.can_edit_legacy(id));
drop policy if exists "legacies_delete" on public.legacies;
create policy "legacies_delete" on public.legacies
  for delete using (owner_id = auth.uid());

-- ── legacy_members ──────────────────────────────────────────────────────────
alter table public.legacy_members enable row level security;
drop policy if exists "members_select" on public.legacy_members;
create policy "members_select" on public.legacy_members
  for select using (user_id = auth.uid() or public.has_legacy_access(legacy_id));
drop policy if exists "members_write" on public.legacy_members;
create policy "members_write" on public.legacy_members
  for all using (public.is_legacy_owner(legacy_id))
  with check (public.is_legacy_owner(legacy_id));

-- ── Content tables keyed directly by legacy_id ──────────────────────────────
do $$
declare t text;
begin
  foreach t in array array[
    'media_assets', 'memories', 'life_events', 'people', 'interview_answers',
    'voice_samples', 'time_capsules', 'knowledge_chunks', 'grave_markers',
    'personality_profiles', 'family_links'
  ] loop
    execute format('alter table public.%I enable row level security;', t);
    execute format('drop policy if exists "%1$s_select" on public.%1$I;', t);
    execute format(
      'create policy "%1$s_select" on public.%1$I for select using (public.has_legacy_access(legacy_id));', t);
    execute format('drop policy if exists "%1$s_modify" on public.%1$I;', t);
    execute format(
      'create policy "%1$s_modify" on public.%1$I for all using (public.can_edit_legacy(legacy_id)) with check (public.can_edit_legacy(legacy_id));', t);
  end loop;
end $$;

-- ── Join tables (access via their parent) ────────────────────────────────────
alter table public.memory_media enable row level security;
drop policy if exists "memory_media_select" on public.memory_media;
create policy "memory_media_select" on public.memory_media for select using (
  exists (select 1 from public.memories m where m.id = memory_id and public.has_legacy_access(m.legacy_id)));
drop policy if exists "memory_media_modify" on public.memory_media;
create policy "memory_media_modify" on public.memory_media for all using (
  exists (select 1 from public.memories m where m.id = memory_id and public.can_edit_legacy(m.legacy_id)))
  with check (
  exists (select 1 from public.memories m where m.id = memory_id and public.can_edit_legacy(m.legacy_id)));

alter table public.memory_people enable row level security;
drop policy if exists "memory_people_select" on public.memory_people;
create policy "memory_people_select" on public.memory_people for select using (
  exists (select 1 from public.memories m where m.id = memory_id and public.has_legacy_access(m.legacy_id)));
drop policy if exists "memory_people_modify" on public.memory_people;
create policy "memory_people_modify" on public.memory_people for all using (
  exists (select 1 from public.memories m where m.id = memory_id and public.can_edit_legacy(m.legacy_id)))
  with check (
  exists (select 1 from public.memories m where m.id = memory_id and public.can_edit_legacy(m.legacy_id)));

alter table public.event_memories enable row level security;
drop policy if exists "event_memories_select" on public.event_memories;
create policy "event_memories_select" on public.event_memories for select using (
  exists (select 1 from public.life_events e where e.id = event_id and public.has_legacy_access(e.legacy_id)));
drop policy if exists "event_memories_modify" on public.event_memories;
create policy "event_memories_modify" on public.event_memories for all using (
  exists (select 1 from public.life_events e where e.id = event_id and public.can_edit_legacy(e.legacy_id)))
  with check (
  exists (select 1 from public.life_events e where e.id = event_id and public.can_edit_legacy(e.legacy_id)));

-- ── AI chat: any user with access to the legacy may converse ────────────────
alter table public.conversations enable row level security;
drop policy if exists "conversations_select" on public.conversations;
create policy "conversations_select" on public.conversations
  for select using (public.has_legacy_access(legacy_id));
drop policy if exists "conversations_insert" on public.conversations;
create policy "conversations_insert" on public.conversations
  for insert with check (public.has_legacy_access(legacy_id) and user_id = auth.uid());
drop policy if exists "conversations_delete" on public.conversations;
create policy "conversations_delete" on public.conversations
  for delete using (user_id = auth.uid() or public.is_legacy_owner(legacy_id));

alter table public.messages enable row level security;
drop policy if exists "messages_select" on public.messages;
create policy "messages_select" on public.messages for select using (
  exists (select 1 from public.conversations c where c.id = conversation_id and public.has_legacy_access(c.legacy_id)));
drop policy if exists "messages_insert" on public.messages;
create policy "messages_insert" on public.messages for insert with check (
  exists (select 1 from public.conversations c where c.id = conversation_id and public.has_legacy_access(c.legacy_id)));

-- ── Interview question bank (shared, read-only for users) ───────────────────
alter table public.interview_questions enable row level security;
drop policy if exists "interview_questions_read" on public.interview_questions;
create policy "interview_questions_read" on public.interview_questions
  for select using (auth.uid() is not null);

-- ── Billing & privacy (self-scoped; writes go through the service role) ─────
alter table public.subscriptions enable row level security;
drop policy if exists "subscriptions_select_self" on public.subscriptions;
create policy "subscriptions_select_self" on public.subscriptions
  for select using (user_id = auth.uid());

alter table public.privacy_requests enable row level security;
drop policy if exists "privacy_select_self" on public.privacy_requests;
create policy "privacy_select_self" on public.privacy_requests
  for select using (user_id = auth.uid());
drop policy if exists "privacy_insert_self" on public.privacy_requests;
create policy "privacy_insert_self" on public.privacy_requests
  for insert with check (user_id = auth.uid());

-- ── Audit logs: no direct client access (service role only) ─────────────────
alter table public.audit_logs enable row level security;

-- ── pgvector similarity index for RAG retrieval ─────────────────────────────
create index if not exists knowledge_chunks_embedding_hnsw
  on public.knowledge_chunks using hnsw (embedding vector_cosine_ops);
