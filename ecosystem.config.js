// Configuration PM2 pour le déploiement VPS de Sapiens-IA.
//
// Instance unique en mode "fork" (pas "cluster") : deux mécanismes du
// projet reposent sur un état en mémoire du process Node — le
// rate-limiting des formulaires publics et de /connexion (lib/rate-limit.ts)
// et le cache Prisma par requête (lib/db.ts). En mode cluster, chaque
// worker aurait son propre état, ce qui romprait silencieusement le
// rate-limiting (une limite de "5 tentatives/min" deviendrait en réalité
// "5 × nombre d'instances"). Sur un VPS à 2 vCPU, une instance unique est de
// toute façon cohérente avec le budget CPU/RAM disponible.
//
// Aucun secret n'est défini ici : Next.js charge automatiquement
// `.env` / `.env.production` depuis la racine du projet au démarrage de
// `next start`. Ce fichier ne doit contenir que de la configuration
// opérationnelle non sensible.
module.exports = {
  apps: [
    {
      name: "sapiens-ia",
      cwd: __dirname,
      // Appel direct du binaire Next.js (plutôt que `npm run start`) pour
      // que PM2 gère directement le process Node et ses signaux
      // (redémarrage, arrêt propre) sans process npm intermédiaire.
      script: "node_modules/next/dist/bin/next",
      args: "start",
      instances: 1,
      exec_mode: "fork",
      autorestart: true,
      watch: false,
      time: true,
      // Garde-fou : redémarre le process s'il dépasse cette limite mémoire
      // (fuite mémoire, pic anormal) plutôt que de risquer de saturer les
      // 4 Go RAM du VPS et d'affecter les autres services (Postgres, Nginx).
      max_memory_restart: "768M",
      env: {
        NODE_ENV: "production",
        PORT: "3000",
      },
      error_file: "logs/pm2-error.log",
      out_file: "logs/pm2-out.log",
      merge_logs: true,
    },
  ],
};
