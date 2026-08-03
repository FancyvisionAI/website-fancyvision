# Déploiement Vercel

## 1. Préparer PostgreSQL

Créez une base PostgreSQL managée (Vercel Postgres/Neon, Supabase, Railway ou RDS). Copiez son URL avec SSL dans `DATABASE_URL`.

## 2. Créer le projet Vercel

Importez le dépôt dans Vercel. Le framework Next.js est détecté automatiquement.

Build command :

```text
npm run build
```

Install command :

```text
npm install
```

## 3. Configurer les secrets

Ajoutez toutes les variables de `.env.example` dans Project Settings → Environment Variables, au minimum :

- `DATABASE_URL`
- `AUTH_SECRET`
- `AUTH_TRUST_HOST=true`
- `NEXT_PUBLIC_SITE_URL=https://votre-domaine.fr`
- `UPLOADTHING_TOKEN`
- les variables SMTP

Séparez les bases Preview et Production afin qu’une branche de test ne modifie jamais les contenus publics.

## 4. Déployer la base

Depuis une machine autorisée à joindre la base de production :

```bash
DATABASE_URL="..." npm run db:deploy
DATABASE_URL="..." npm run db:seed
```

Le seed ne doit être exécuté qu’à l’initialisation. Connectez-vous ensuite au CMS et remplacez immédiatement le mot de passe initial.

## 5. Domaine et emails

Ajoutez le domaine dans Vercel, configurez les enregistrements DNS, puis validez l’expéditeur SMTP (SPF, DKIM et DMARC). Mettez à jour `NEXT_PUBLIC_SITE_URL` après activation du domaine.

## 6. UploadThing

Créez une application UploadThing, ajoutez `UPLOADTHING_TOKEN`, puis limitez les domaines autorisés au domaine de production et aux previews nécessaires.

## 7. Vérifications

- `/robots.txt` référence le bon sitemap.
- `/sitemap.xml` contient les contenus publiés.
- `/opengraph-image` retourne une image.
- `/admin` redirige vers `/connexion` hors session.
- contact, rendez-vous et newsletter écrivent en base.
- les emails de notification arrivent et ne sont pas classés en spam.
- les uploads apparaissent dans la médiathèque.

Les pages publiques sont rendues dynamiquement : une modification CMS est visible immédiatement, sans redeploy.
