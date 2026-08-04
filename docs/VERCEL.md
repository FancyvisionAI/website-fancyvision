# Déploiement Vercel

## 1. Préparer PostgreSQL

Créez une base PostgreSQL managée via une intégration Vercel Marketplace
(Prisma Postgres, Neon, Supabase, Railway ou équivalent). Dans Vercel, ajoutez
la chaîne de connexion distante et SSL fournie par ce service sous le nom exact
`DATABASE_URL`. L'hôte ne doit jamais être `localhost` ou `127.0.0.1`.

Pour les fonctions serverless, utilisez l'URL poolée/compatible serverless du
fournisseur lorsqu'elle est disponible. Si le fournisseur impose une URL directe
pour les migrations, exécutez `prisma migrate deploy` avec cette URL directe
injectée temporairement comme `DATABASE_URL`; ne la placez pas dans le dépôt.

## 2. Créer le projet Vercel

Importez le dépôt dans Vercel. Le framework Next.js est détecté automatiquement.
Conservez le preset **Next.js** et laissez les commandes Build, Install et Output
Directory sans override : Vercel utilise le lockfile npm et le script
`npm run build` automatiquement.

## 3. Configurer les secrets

Ajoutez toutes les variables de `.env.example` dans Project Settings → Environment Variables, au minimum :

- `DATABASE_URL`
- `AUTH_SECRET`
- `AUTH_TRUST_HOST=true`
- `NEXT_PUBLIC_SITE_URL=https://votre-domaine.fr`
- `UPLOADTHING_TOKEN`
- les variables SMTP

Séparez les bases Preview et Production afin qu’une branche de test ne modifie jamais les contenus publics.
Appliquez la variable de production à l'environnement **Production**, puis créez
une autre `DATABASE_URL` pointant vers une base séparée pour **Preview**. Après
toute modification d'une variable Vercel, déclenchez un nouveau déploiement.

## 4. Déployer la base

Depuis une machine autorisée à joindre la base de production, injectez l'URL
distante directement dans l'environnement du processus :

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
