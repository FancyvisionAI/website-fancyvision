#!/usr/bin/env bash
# Crée un fichier de swap de sécurité sur le VPS avant le premier build.
#
# Contexte : `npm run build` compile TypeScript, exécute Webpack et la
# dépendance native `sharp` sur une machine à seulement 4 Go de RAM et
# 2 vCPU. Un swap de secours évite qu'un pic mémoire pendant le build ne
# déclenche l'OOM killer et ne tue le process en plein build. Ce n'est pas
# une garantie de performance (le swap est lent), uniquement un filet de
# sécurité pour terminer le build sans échec.
#
# À exécuter une seule fois, manuellement, avec les droits root (sudo),
# AVANT `npm run build` sur le VPS. Sans effet sur l'application elle-même.
#
# Usage : sudo ./scripts/setup-swap.sh [taille_en_Go]  (défaut : 2)

set -euo pipefail

SWAP_SIZE_GB="${1:-2}"
SWAP_FILE="/swapfile"

if [ "$(id -u)" -ne 0 ]; then
  echo "Ce script doit être exécuté avec sudo/root." >&2
  exit 1
fi

if swapon --show | grep -q "$SWAP_FILE"; then
  echo "Un swap est déjà actif sur $SWAP_FILE — rien à faire."
  exit 0
fi

fallocate -l "${SWAP_SIZE_GB}G" "$SWAP_FILE"
chmod 600 "$SWAP_FILE"
mkswap "$SWAP_FILE"
swapon "$SWAP_FILE"

# Persistance au redémarrage.
if ! grep -q "$SWAP_FILE" /etc/fstab; then
  echo "$SWAP_FILE none swap sw 0 0" >> /etc/fstab
fi

echo "Swap de ${SWAP_SIZE_GB} Go activé sur $SWAP_FILE et persisté dans /etc/fstab."
swapon --show
