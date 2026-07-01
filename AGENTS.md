<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# Everloom — projectregels

Zie [README.md](README.md) voor de volledige context, stack en backend-setup.

## Merk & twee identiteiten
- Product heet **Everloom** ("Jouw verhaal. Voor altijd dichtbij.").
- **Marketingsite** (`/`, `src/components/everloom/*`): warm/licht — tokens
  `bg-cream`, `text-cream-ink`, `text-forest-deep`, `bg-forest`, `text-bronze`,
  `border-sand`, `text-moss`; body `font-meta` (Inter), koppen `font-display`
  (Fraunces). Tree-logo via `EverloomLogo`/`EverloomMark`.
- **App** (dashboard/legacy/grafmodus): donker "Nachtelijke Natuursteen".

## Sfeer & design (app)
- Designtaal: **"Nachtelijke Natuursteen"** — warm bijna-zwart natuursteen,
  schaars antiek goud, rust, waardigheid. Doel: kippenvel, geen "tech-app".
- Gebruik de tokens uit [`src/app/globals.css`](src/app/globals.css)
  (Tailwind v4 `@theme`): `bg-background`, `text-foreground`,
  `text-foreground-muted`, `text-gold`, `bg-amber`, `slab`, `seam`,
  `text-gilded`, `text-meta`. Verzin geen losse hex-waarden in componenten.
- Fonts: `font-display` (Fraunces = namen/titels), `font-body` (Newsreader =
  proza), `font-meta`/`text-meta` (Inter = alleen kleine labels).
- **Iconen: altijd SVG** (lucide-react). **Nooit emoji** — niet in nieuwe code,
  niet bij het aanpassen van bestaande code.
- App is **dark-only** en de **UI-taal is Nederlands**.
- Alle animatie respecteert `prefers-reduced-motion` (zie `src/lib/motion.ts`).
- Kernprincipe in copy: nooit doen alsof iemand nog leeft; eerlijk over wat een
  AI is en wat niet is vastgelegd.

## Architectuur
- **Config in de tool, niet in Vercel**, tenzij het een echt secret is
  (API-keys, tokens, `DATABASE_URL`). Drempels, lijsten, feature-flags e.d. horen
  als instelbare data in de app, niet als env-var.
- Datamodel-bron van waarheid: [`src/lib/db/schema`](src/lib/db/schema)
  (Drizzle). Een **legacy** is het onderwerp; toegang loopt via `legacy_members`.
- Supabase-toegang via `src/lib/supabase/{client,server}.ts`; RLS in
  `supabase/02_policies.sql`. Nooit de service-role key naar de client.
- Env alleen via `src/lib/env.ts` (typed, lazy). Voeg nieuwe vars daar toe.

## Werkwijze
- Draai `npm run build` of `npm run typecheck` voordat je iets afrondt.
- Nieuwe UI-componenten: primitives in `components/ui`, merk-specifiek in
  `components/brand`, pagina-secties in `components/marketing` (of per feature).
