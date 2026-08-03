# Checklist de production

## Identité et contenu

- [ ] Remplacer l’adresse, le téléphone, l’email et les réseaux dans Paramètres
- [ ] Valider toutes les pages et sections de l’accueil
- [ ] Ajouter les portraits, logos autorisés, PDF et textes alternatifs
- [ ] Relire les mentions légales, la confidentialité et les conditions avec un juriste
- [ ] Vérifier qu’aucun contenu n’est resté en brouillon par erreur

## Sécurité

- [ ] Remplacer le mot de passe administrateur initial
- [ ] Générer un `AUTH_SECRET` unique
- [ ] Créer un compte nominatif par membre de l’équipe
- [ ] Appliquer le principe du moindre privilège aux rôles
- [ ] Vérifier les règles UploadThing et les types/taille de fichiers
- [ ] Activer sauvegardes automatiques et restauration point-in-time PostgreSQL
- [ ] Exécuter `npm audit --omit=dev` depuis un environnement autorisé
- [ ] Configurer une politique CSP adaptée aux domaines réellement utilisés
- [ ] Tester les limites de débit via la plateforme edge ou un KV partagé

## Données

- [ ] Exécuter `npm run db:deploy`
- [ ] Vérifier les index et les temps de requête sur données réalistes
- [ ] Séparer bases Preview et Production
- [ ] Définir une politique de rétention contacts, rendez-vous et logs
- [ ] Tester les exports CSV et les demandes RGPD

## SEO et performance

- [ ] Définir `NEXT_PUBLIC_SITE_URL`
- [ ] Vérifier canonicals, OG, Twitter et JSON-LD
- [ ] Soumettre le sitemap à Google Search Console et Bing Webmaster Tools
- [ ] Convertir les images finales en formats optimisés
- [ ] Tester Lighthouse mobile et desktop sur le domaine final
- [ ] Vérifier l’absence de changement de mise en page (CLS)
- [ ] Configurer analytics avec consentement

## Emails et formulaires

- [ ] Configurer SMTP, SPF, DKIM et DMARC
- [ ] Tester contact, rendez-vous, newsletter et désinscription
- [ ] Vérifier les notifications du dashboard
- [ ] Ajouter une protection de débit distribuée (Vercel KV/Upstash) à grande échelle
- [ ] Configurer les règles anti-spam de production

## Exploitation

- [ ] Configurer alertes Vercel et base de données
- [ ] Activer journalisation et suivi d’erreurs
- [ ] Documenter la procédure d’incident
- [ ] Tester une restauration de sauvegarde
- [ ] Définir un responsable de publication et un responsable sécurité
