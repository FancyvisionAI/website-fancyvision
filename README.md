# Sapiens-IA

Sapiens-IA est une plateforme de conseil et de formation en intelligence artificielle, reconstruite avec Next.js 15, React 19, TypeScript, PostgreSQL et Prisma. Le site public et le CMS partagent une source de vérité unique : tout contenu publié est lu depuis PostgreSQL et les modifications sont visibles immédiatement, sans reconstruction ni redéploiement.

## Fonctionnalités

- Site public éditorial premium, responsive de 320 px aux écrans ultra-larges
- Pages services, formations, cabinet, équipe, cas clients, blog, catégories, recherche, contact, rendez-vous et pages légales
- SEO dynamique : metadata, canonical, OpenGraph, Twitter Card, JSON-LD, sitemap, robots et image OG
- CMS protégé : pages, services, formations, blog, équipe, cas clients, FAQ, témoignages, médias, menus, paramètres, SEO et utilisateurs
- Éditeur TipTap, brouillons, publication, planification, ordre et visibilité
- Boîtes de réception contact/rendez-vous, newsletter, exports CSV et journal d’audit
- Auth.js avec sessions JWT, rôles et permissions en base
- UploadThing pour les médias et Nodemailer pour les notifications
- Validation Zod, React Hook Form, rate limiting, honeypots et accès admin protégé
- Architecture prête pour `fr`, `en` et `ar` grâce au champ `locale` des contenus

## Démarrage local

Prérequis : Node.js 20+, npm et PostgreSQL 16+ (ou Docker).

```bash
cp .env.example .env
docker compose up -d
npm install
npm run db:deploy
npm run db:seed
npm run dev


## in case .next error
Remove-Item -Recurse -Force .next
npm run build
npm run start
```

Sous PowerShell :

```powershell
Copy-Item .env.example .env
docker compose up -d
npm install
npm run db:deploy
npm run db:seed
npm run dev
```

Ouvrez `http://localhost:3000`. Le CMS se trouve sur `http://localhost:3000/admin`.

Compte de démonstration initial :

- Email : `admin@fancyvision.fr`
- Mot de passe : `ChangeMe!2026`

Changez ce mot de passe dès la première connexion en production.

## Variables d’environnement

| Variable                                               | Obligatoire      | Usage                                   |
| ------------------------------------------------------ | ---------------- | --------------------------------------- |
| `DATABASE_URL`                                         | Oui              | Connexion PostgreSQL                    |
| `AUTH_SECRET`                                          | Oui              | Secret Auth.js de 32 caractères minimum |
| `AUTH_TRUST_HOST`                                      | Vercel           | Autorise le host de déploiement         |
| `NEXT_PUBLIC_SITE_URL`                                 | Oui              | URL canonique publique                  |
| `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASSWORD` | Production       | Notifications email                     |
| `SMTP_FROM`                                            | Production       | Expéditeur des messages                 |
| `UPLOADTHING_TOKEN`                                    | Pour les uploads | Jeton UploadThing                       |
| `NEXT_PUBLIC_GA_ID`                                    | Optionnel        | Identifiant de mesure                   |

Générez un secret sûr avec `openssl rand -base64 32`.

## Base de données

Le schéma Prisma est dans [`prisma/schema.prisma`](./prisma/schema.prisma), la migration SQL initiale dans [`prisma/migrations/0001_init/migration.sql`](./prisma/migrations/0001_init/migration.sql) et le contenu de démonstration dans [`prisma/seed.ts`](./prisma/seed.ts).

Commandes utiles :

```bash
npm run db:generate
npm run db:migrate
npm run db:deploy
npm run db:seed
```

Le seed est idempotent sur les contenus principaux. Il initialise les rôles, permissions, pages, sections de l’accueil, services, formations, articles, cas clients, équipe, témoignage, FAQ, menus et paramètres.

## Structure

```text
app/
  (public)/                 Routes publiques et layouts
  admin/                    Dashboard protégé
  api/                      Formulaires, CMS, auth, exports et uploads
components/
  public/                   Système visuel et sections publiques
  admin/                    CMS, éditeur et navigation
  ui/                       Primitives Shadcn
lib/
  repositories/            Accès typé au contenu
  db.ts                     Client Prisma
  validators.ts             Schémas Zod
prisma/
  migrations/               SQL versionné
  schema.prisma             Modèle PostgreSQL
  seed.ts                   Contenu FancyVision
docs/
  ERD.md                    Diagramme de données
  VERCEL.md                 Guide de déploiement
  PRODUCTION_CHECKLIST.md   Checklist de mise en production
```

## Qualité

```bash
npm run typecheck
npm run lint
npm run format:check
npm run build
```

Le build est server-rendered à la demande pour les pages éditables. Les images utilisent `next/image`, les animations sont limitées aux composants clients Framer Motion, et le contenu principal reste rendu côté serveur.

## Sécurité

- Prisma paramètre toutes les requêtes SQL.
- Zod valide toutes les entrées publiques et CMS.
- Les routes CMS revérifient la session côté serveur.
- Les formulaires publics utilisent une limite par IP et un champ honeypot.
- Les uploads exigent une session admin.
- Chaque mutation CMS crée un `AuditLog`.
- Les secrets ne sont jamais exposés au navigateur.

Avant production, exécutez `npm audit --omit=dev` depuis un environnement autorisé à transmettre le manifeste de dépendances à npm, puis évaluez chaque avis sans appliquer de mise à niveau majeure automatique.

## Contenu et publication

Les routes publiques utilisent `force-dynamic` et interrogent PostgreSQL à chaque requête. Une publication ou modification depuis le CMS est donc visible immédiatement. Pour une charge élevée, ajoutez ensuite une invalidation ciblée avec `revalidateTag` sans changer le modèle de contenu.

## Licence et originalité

Le code, le contenu FancyVision et l’illustration générée sont originaux. Le projet s’inspire d’une hiérarchie éditoriale premium sans copier les fichiers, marques ou contenus propriétaires du site de référence.
