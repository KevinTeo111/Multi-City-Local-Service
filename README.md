# Vecino: Latino business directory (UI preview)

Spanish-first, multi-city directory of local businesses. Next.js 16 (App Router, Cache Components), TypeScript, Tailwind CSS v4. Uses sample data; see `../ROADMAP.md` for the plan to connect Supabase.

```bash
npm install
npm run dev      # http://localhost:3000
npm run build && npm start
```

Scripts use `--webpack` because Turbopack crashes natively (0xC0000005) on this Windows machine, even on a blank app. Remove the flag on other machines if you like.

## Where things live

| What | File |
|---|---|
| Brand colors (change `brand-*` to re-theme) | `src/app/globals.css` |
| Brand name / tagline | `src/lib/site.ts` |
| Sample cities, categories, businesses | `src/lib/data.ts` |
| Data access (swap for Supabase here) | `src/lib/queries.ts` |
| Phone reveal / event tracking API | `src/app/api/negocios/[slug]/*` |
| Business card | `src/components/business-card.tsx` |
| Profile form (owner + admin) | `src/components/dashboard/profile-form.tsx` |

## Demo routes

- Public: `/`, `/buscar`, `/houston`, `/houston/plomeros`, `/servicios`, `/ciudades`, `/negocio/plomeria-garcia`
- Business: `/registro`, `/ingresar`, `/cuenta`, `/cuenta/perfil`
- Admin: `/admin`, `/admin/negocios`, `/admin/negocios/nuevo`, `/admin/catalogo`
