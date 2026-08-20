# chat-widget-src (vendoring temporaire)

Ce dossier contient une copie brute (TSX/TS/CSS, non compilée) du code source du
widget de chat, normalement maintenu dans le dépôt séparé
[`widget-fancyvision`](https://github.com/FancyvisionAI/widget-fancyvision)
(package `@fancyvision/chat-widget`).

## Pourquoi ce vendoring

Vercel ne clone que le dépôt `website-fancyvision` seul : il n'a pas accès au
dossier voisin `widget-fancyvision` référencé localement via
`"@fancyvision/chat-widget": "file:../widget-fancyvision"`. Ce vendoring
débloque le build Preview Vercel en attendant une vraie dépendance (git ou
npm privé) une fois que `widget-fancyvision` aura un pipeline de build
officiel (actuellement absent : pas de `dist/` commité, pas de script
`build`/`prepare`).

Le code est copié tel quel (pas de `dist/` compilé) pour que Next.js le
transpile lui-même, comme le faisait déjà `transpilePackages` avec la
dépendance `file:` — aucune étape de build intermédiaire (tsup a été testé
et abandonné : esbuild ne génère pas de mapping de classes pour les CSS
Modules, ce qui cassait silencieusement le style du widget).

## ⚠️ Contient des modifications non commitées côté `widget-fancyvision`

Au moment de ce vendoring, le dépôt `widget-fancyvision` avait des
modifications locales **non commitées et non poussées** sur son propre repo
GitHub, volontairement incluses ici pour qu'elles soient visibles sur la
Preview :

- `components/ChatWidget.tsx`
- `components/chat-widget.module.css`
- `lib/i18n.ts`

**À faire** : une fois ces changements validés, les committer et les pousser
séparément dans le dépôt `widget-fancyvision` (`FancyvisionAI/widget-fancyvision`),
pour que ce vendoring ne soit pas la seule trace de ce travail.

## TODO

- [ ] Ajouter un pipeline de build (`dist/` + script `prepare`) dans `widget-fancyvision`.
- [ ] Committer/pousser les 3 fichiers listés ci-dessus dans `widget-fancyvision`.
- [ ] Remplacer ce dossier par une vraie dépendance (git ou npm privé) et
      restaurer `transpilePackages` dans `next.config.ts` si nécessaire.
- [ ] Supprimer `lib/chat-widget-src/` une fois la vraie dépendance en place.
