#!/usr/bin/env bash
# Sauvegarde quotidienne de la base PostgreSQL de production (Sapiens-IA).
#
# Ne contient aucun identifiant : POSTGRES_DB/POSTGRES_USER doivent être
# exportés dans l'environnement avant exécution (ex. via
# `set -a; source /opt/sapiens-ia/.env; set +a` dans le crontab), jamais
# codés en dur ici.
#
# Exemple de planification (crontab -e), tous les jours à 3h du matin :
#   0 3 * * * set -a && . /opt/sapiens-ia/.env && set +a && /opt/sapiens-ia/scripts/backup-postgres.sh >> /opt/sapiens-ia/backups/backup.log 2>&1
#
# Restauration :
#   docker exec -i <container> pg_restore -U "$POSTGRES_USER" -d "$POSTGRES_DB" --clean --if-exists < backup.dump

set -euo pipefail

: "${POSTGRES_DB:?POSTGRES_DB must be set in the environment}"
: "${POSTGRES_USER:?POSTGRES_USER must be set in the environment}"

# Nom du conteneur tel que défini dans docker-compose.prod.yml
# (docker compose nomme le service <projet>-postgres-1 par défaut ;
# ajuster si un nom explicite `container_name` est utilisé).
CONTAINER_NAME="${POSTGRES_CONTAINER_NAME:-website-fancyvision-postgres-1}"
BACKUP_DIR="${BACKUP_DIR:-/opt/sapiens-ia/backups}"
RETENTION_DAYS="${BACKUP_RETENTION_DAYS:-14}"
TIMESTAMP=$(date +%Y%m%d_%H%M%S)
DEST="${BACKUP_DIR}/fancyvision_${TIMESTAMP}.dump"

mkdir -p "$BACKUP_DIR"

docker exec "$CONTAINER_NAME" \
  pg_dump -U "$POSTGRES_USER" -d "$POSTGRES_DB" --format=custom \
  > "$DEST"

# Supprime les sauvegardes plus anciennes que la période de rétention.
find "$BACKUP_DIR" -name "fancyvision_*.dump" -mtime "+${RETENTION_DAYS}" -delete

echo "Sauvegarde PostgreSQL créée : $DEST"
