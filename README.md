# Levend Graf

> Een heel leven, om te bezoeken.

Een premium web- en (later) mobiele app waarin mensen tijdens hun leven een
digitale nalatenschap opbouwen — herinneringen, stemmen, verhalen, brieven en
een AI-interview. Na overlijden blijft dit bestaan als een waardige,
interactieve herinnering voor familie en vrienden.

**Kernprincipe:** het systeem doet **nooit** alsof iemand nog leeft. Het is
altijd duidelijk een AI, opgebouwd uit wat de persoon zelf heeft vastgelegd, en
zegt eerlijk wanneer iets onbekend is.

---

## Designtaal — "Nachtelijke Natuursteen (Bij Kaarslicht)"

Een handgehouwen monument bij nacht, verlicht door één kaars. Warm bijna-zwart
natuursteen, schaars antiek goud, gegraveerde typografie, veel rust en stilte.

| Rol | Waarde |
| --- | --- |
| Achtergrond (steen) | `#0B0C0E` |
| Oppervlak / slab | `#141619` · `#1C1F23` |
| Tekst (inkt) | `#EDE6D8` (AA 15.8:1) · muted `#A7A093` |
| Goud (schaars) | `#C9A15A` · amber (stem/leven) `#E0B876` |
| Display-font | **Fraunces** — namen, data, titels |
| Leesfont | **Newsreader** — verhalen, brieven, transcripten |
| Meta-font | **Inter** — alleen kleine labels |

Signatuur-interacties: een kaarslicht dat de cursor volgt, een naam die van
onscherp naar scherp oplost en zichzelf verguldt, en een gouden sluitlijn die
zich tekent. Alle animatie respecteert `prefers-reduced-motion`.

Ontwerptokens staan in [`src/app/globals.css`](src/app/globals.css) (Tailwind v4
`@theme`). Iconen: altijd SVG (lucide-react), **nooit emoji**.

---

## Stack

- **Next.js 16** (App Router, Turbopack) · **React 19** · **TypeScript**
- **Tailwind CSS v4** · **shadcn/ui**-conventies · **Framer Motion**
- **Supabase** (Postgres, Auth, Storage, RLS) · **Drizzle ORM**
- **React Query** · **Zod** (typed env)
- AI: OpenAI / Claude + pgvector (RAG) — laag voorbereid, nog niet live
- Betalingen: Mollie — voorbereid, nog niet live

---

## Aan de slag

```bash
npm install
npm run dev            # http://localhost:3000
```

De publieke site draait **zonder** configuratie. De app-, database- en
AI-functies activeren zodra de bijbehorende secrets zijn ingevuld.

### Scripts

| Script | Doel |
| --- | --- |
| `npm run dev` | Dev-server |
| `npm run build` | Productiebuild |
| `npm run typecheck` | TypeScript-controle |
| `npm run db:generate` | SQL-migratie genereren uit het schema |
| `npm run db:push` | Schema naar de database pushen |
| `npm run db:studio` | Drizzle Studio |

---

## Backend opzetten (Supabase)

1. Maak een Supabase-project en kopieer `.env.example` → `.env.local`; vul
   `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`,
   `SUPABASE_SERVICE_ROLE_KEY` en `DATABASE_URL` in.
2. Draai eerst de extensies: voer
   [`supabase/01_extensions.sql`](supabase/01_extensions.sql) uit
   (pgcrypto + pgvector — nodig vóór het schema).
3. Push het schema: `npm run db:push`.
4. Draai het beveiligingsscript:
   [`supabase/02_policies.sql`](supabase/02_policies.sql) — foreign key naar
   `auth.users`, de nieuwe-gebruiker-trigger, toegangs-helpers, **Row Level
   Security** op alle tabellen, en de pgvector-index.
5. (Optioneel) Genereer types:
   `npx supabase gen types typescript --project-id <ref> > src/lib/supabase/types.ts`.

> **Secrets die je nog moet aanleveren:** Supabase-keys + `DATABASE_URL` (voor de
> database), `OPENAI_API_KEY` / `ANTHROPIC_API_KEY` (AI-laag), `MOLLIE_API_KEY`
> (betalingen). Deze horen in Vercel/`.env.local`, niet in de tool-config.

---

## Datamodel

Een **legacy** (de persoon wiens leven wordt vastgelegd) staat centraal — niet
per se een ingelogde gebruiker, zodat nabestaanden ook een nalatenschap voor een
overledene kunnen bouwen. Toegang loopt via `legacy_members` (rollen: viewer /
contributor / admin / owner). Zie [`src/lib/db/schema`](src/lib/db/schema):

`profiles` · `legacies` · `legacy_members` · `media_assets` · `memories` ·
`life_events` · `people` · `interview_answers` · `voice_samples` ·
`time_capsules` · `personality_profiles` · `knowledge_chunks` (RAG) ·
`conversations` · `messages` · `subscriptions` · `grave_markers` ·
`family_links` · `audit_logs` · `privacy_requests`.

---

## Projectstructuur

```
src/
  app/                     # routes (App Router) + globals.css (design tokens)
  components/
    atmosphere/            # grain-overlay, candlelight
    brand/                 # inscribed-name, reveal, waveform, ai-disclaimer, section
    marketing/             # landingssecties (hero, timeline, presence, ...)
    ui/                    # primitives (button, slab, seam)
  lib/
    db/schema/             # Drizzle-schema (bron van waarheid)
    supabase/              # browser/server clients + session-proxy
    env.ts                 # typed, lazy environment access
    motion.ts, utils.ts
  providers/               # React Query
  proxy.ts                 # Next 16 proxy (auth-sessie verversen)
supabase/                  # 01_extensions.sql, 02_policies.sql
```

---

## Authenticatie

Supabase Auth via `@supabase/ssr`. Routes: `/login` (magic link + Google/Apple/
Microsoft), `/auth/callback` (OAuth PKCE), `/auth/confirm` (magic-link OTP).
`/dashboard` is beschermd (server-side `getUser` → redirect naar `/login`).

**Supabase-config die nog nodig is** (dashboard → Authentication → URL config):
- Site URL: `http://localhost:3000` (en later je productie-URL)
- Redirect URLs: `http://localhost:3000/auth/callback`, `.../auth/confirm`
- OAuth: Google/Apple/Azure providers aanzetten + client-secrets invullen
  (magic link werkt direct; de OAuth-knoppen werken zodra de provider is gezet).

## Mobiel — App Store via Codemagic

De app wordt met **Capacitor** in een native iOS/Android-shell verpakt en met
**Codemagic** naar de App Store gepubliceerd. Omdat de app SSR/middleware
gebruikt laadt de shell de live site via `server.url` (zie
[capacitor.config.ts](capacitor.config.ts)). De iOS-pipeline staat in
[codemagic.yaml](codemagic.yaml).

Nog nodig: een Apple Developer-account, een **bundle ID** (nu `nl.levendgraf.app`),
een App Store Connect API-key als Codemagic-integratie, en de env-groep
`levendgraf_ios` (zie de comments boven in `codemagic.yaml`). De `ios/`-map wordt
in CI gegenereerd (`cap add ios`).

## AI

Anthropic-client in [src/lib/ai/anthropic.ts](src/lib/ai/anthropic.ts):
`askMemory()` antwoordt uitsluitend op basis van vastgelegde context (RAG-klaar)
en is eerlijk over wat niet bekend is. Vul `ANTHROPIC_API_KEY` in `.env.local` in
om het te activeren (model via `ANTHROPIC_MODEL`, standaard `claude-sonnet-5`).

## Status

- ✅ Fundament + design system + emotionele landingspagina
- ✅ Backend **live** op Supabase (23 tabellen, RLS, pgvector)
- ✅ Auth-flow (magic link + OAuth) + beschermd dashboard + eerste `legacy` aanmaken
- ✅ AI-client (Anthropic) + Codemagic/Capacitor-pipeline (scaffolding)
- ⏳ OAuth-providers + redirect-URLs instellen in Supabase
- ⏳ App Store: bundle ID bevestigen + Apple-account/secrets in Codemagic
- ⏳ Features: levenslijn, AI-interview, stem, grafmodus, familieboom, tijdcapsules
