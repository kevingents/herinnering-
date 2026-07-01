-- Everlooms — lock down the partner_leads table. Run AFTER `npm run db:migrate`.
-- RLS on with NO policies → anon/authenticated cannot read or write directly;
-- only the service role (used by the server action) may insert/read leads.
alter table public.partner_leads enable row level security;
