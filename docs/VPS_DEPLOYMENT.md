# Déploiement sur VPS — Sapiens-IA

Ce document décrit la procédure de déploiement sur un VPS Ubuntu (référence : 2 vCPU / 4 Go RAM / 50 Go stockage), avec PostgreSQL en Docker, PM2 pour le process Node.js, et Nginx en reverse proxy HTTPS.

⚠️ Ce document est une préparation. Aucune valeur de secret réelle n'y figure — chaque `<...>` doit être remplacé au moment du déploiement effectif, jamais avant, et jamais committé dans le dépôt.

## 1. Vue d'ensemble des fichiers concernés

| Fichier                      | Rôle                                                    |
| ---------------------------- | ------------------------------------------------------- |
| `ecosystem.config.js`        | Configuration PM2 (instance unique, mode fork)          |
| `docker-compose.prod.yml`    | PostgreSQL en Docker, port lié à `127.0.0.1` uniquement |
| `deploy/nginx.conf.example`  | Modèle de reverse proxy Nginx + HTTPS                   |
| `scripts/backup-postgres.sh` | Sauvegarde quotidienne de la base                       |
| `scripts/setup-swap.sh`      | Swap de sécurité pour le build (usage ponctuel)         |

Le fichier `docker-compose.yml` existant (développement local) n'est pas modifié et reste utilisé uniquement en local.

## 2. Variables d'environnement à définir sur le VPS

Créer un fichier `.env` à la racine du projet sur le VPS (jamais commité — déjà couvert par `.gitignore`), avec des valeurs **entièrement nouvelles**, distinctes de celles utilisées en local :

| Variable                                                            | Obligatoire              | Note                                                                                                                                 |
| ------------------------------------------------------------------- | ------------------------ | ------------------------------------------------------------------------------------------------------------------------------------ |
| `DATABASE_URL`                                                      | Oui                      | Doit pointer vers `127.0.0.1:5432` (le port publié par `docker-compose.prod.yml`), pas vers `localhost:5433` (valeur de dev Windows) |
| `AUTH_SECRET`                                                       | Oui                      | Nouvelle valeur générée sur le VPS — `openssl rand -base64 32`                                                                       |
| `AUTH_TRUST_HOST`                                                   | Oui                      | `"true"` — nécessaire derrière Nginx                                                                                                 |
| `NEXT_PUBLIC_SITE_URL`                                              | Oui                      | URL HTTPS finale du domaine                                                                                                          |
| `NEXT_PUBLIC_RASA_URL`                                              | Optionnel                | Le chatbot Rasa reste en mode draft (`CHATBOT_STATUS`) — voir point 8                                                                |
| `CHATBOT_STATUS`                                                    | Non modifié              | Conserver la valeur actuelle (`"draft"`) tant que la bascule vers Rasa n'est pas explicitement décidée — voir contrainte ci-dessous  |
| `UPLOADTHING_TOKEN`                                                 | Pour les uploads médias  | Jeton du compte UploadThing de production                                                                                            |
| `NEXT_PUBLIC_GA_ID`                                                 | Optionnel                | Analytics                                                                                                                            |
| `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASSWORD`, `SMTP_FROM` | Recommandé               | Sans ces valeurs, les notifications email restent silencieusement désactivées (comportement déjà existant, sans erreur)              |
| `POSTGRES_DB`, `POSTGRES_USER`, `POSTGRES_PASSWORD`                 | Oui                      | Nouvelles valeurs, jamais celles du `.env` de développement                                                                          |
| `ADMIN_PASSWORD`                                                    | Oui pour le premier seed | Nouvelle valeur forte et unique — voir procédure de rotation déjà validée en Phase 1                                                 |

⚠️ **Contrainte explicite de cette phase : ne pas modifier `CHATBOT_STATUS` ni le comportement Rasa/WhatsApp.** Cette variable doit être reportée telle quelle depuis la configuration actuelle, sans décision prise ici sur une éventuelle activation future.

## 3. PostgreSQL — exposition du port

`docker-compose.prod.yml` publie le port sur `127.0.0.1:5432:5432` (jamais sur `0.0.0.0`) : PostgreSQL n'est joignable que depuis le VPS lui-même, jamais depuis l'extérieur. Vérification après démarrage :

```bash
docker compose -f docker-compose.prod.yml up -d
ss -tlnp | grep 5432   # doit afficher 127.0.0.1:5432, jamais 0.0.0.0:5432
```

En complément, un pare-feu (`ufw`) doit rester actif et ne jamais ouvrir le port 5432 :

```bash
sudo ufw allow OpenSSH
sudo ufw allow "Nginx Full"   # ports 80/443 uniquement
sudo ufw enable
sudo ufw status
```

## 4. Procédure de build sur Linux

⚠️ Ne jamais transférer le dossier `.next` généré sous Windows — les dépendances natives (`sharp`, `@prisma/client`) sont compilées pour l'OS courant. Le build doit être refait entièrement sur le VPS :

```bash
git clone <url-du-depot> /opt/sapiens-ia
cd /opt/sapiens-ia
git checkout main   # ou la branche de déploiement retenue

cp .env.example .env
# éditer .env avec les valeurs de production (jamais celles de dev)

sudo ./scripts/setup-swap.sh 2     # une seule fois, avant le premier build

npm ci                              # installe les dépendances (postinstall exécute `prisma generate`)
npm run db:deploy                   # applique les migrations Prisma (jamais `db:migrate`, réservé au dev)
npm run db:seed                     # crée/actualise l'administrateur avec ADMIN_PASSWORD défini dans .env
npm run build                       # build de production
```

## 5. Démarrage avec PM2

```bash
npm install -g pm2       # une seule fois sur le VPS
pm2 start ecosystem.config.js
pm2 save                 # persiste la liste des process
pm2 startup              # génère la commande à exécuter pour le redémarrage automatique au boot (suivre l'instruction affichée)
```

Commandes utiles :

```bash
pm2 status
pm2 logs sapiens-ia
pm2 restart sapiens-ia   # après un nouveau build (npm run build && pm2 restart sapiens-ia)
```

## 6. Nginx et HTTPS

```bash
sudo apt install nginx certbot python3-certbot-nginx
sudo cp deploy/nginx.conf.example /etc/nginx/sites-available/sapiens-ia
# remplacer your-domain.example par le domaine réel dans ce fichier
sudo ln -s /etc/nginx/sites-available/sapiens-ia /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx

# Émission du certificat (certbot édite automatiquement le fichier Nginx
# pour ajouter les chemins ssl_certificate corrects) :
sudo certbot --nginx -d your-domain.example -d www.your-domain.example
```

Le renouvellement automatique est configuré par défaut par le paquet `certbot` (timer systemd) — vérifier avec `sudo certbot renew --dry-run`.

## 7. Sauvegardes PostgreSQL

```bash
chmod +x scripts/backup-postgres.sh
sudo crontab -e
# ajouter :
0 3 * * * set -a && . /opt/sapiens-ia/.env && set +a && /opt/sapiens-ia/scripts/backup-postgres.sh >> /opt/sapiens-ia/backups/backup.log 2>&1
```

Restauration (à tester au moins une fois avant mise en production réelle) :

```bash
docker exec -i <container> pg_restore -U "$POSTGRES_USER" -d "$POSTGRES_DB" --clean --if-exists < backup.dump
```

## 8. Éléments explicitement non concernés par cette phase

- **Rasa** : reste tel quel, non déployé/modifié dans le cadre de cette préparation.
- **Bouton WhatsApp / `CHATBOT_STATUS=draft`** : comportement conservé à l'identique ; ce document se limite à reporter la variable existante, sans changer sa valeur ni le composant `components/public/floating-contact.tsx`.
- **CMS et corrections visuelles validées** : aucun fichier applicatif concerné par les phases précédentes n'est touché par cette préparation d'infrastructure.

## 9. Ce qui reste à faire avant un déploiement réel (hors périmètre de cette phase)

- Provisionner le VPS réel et son DNS.
- Générer les valeurs définitives des secrets (uniquement avec votre accord explicite).
- Exécuter réellement les commandes ci-dessus sur le VPS (cette phase ne fait que les préparer et les documenter).
