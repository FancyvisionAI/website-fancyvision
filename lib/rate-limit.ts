type Entry = { count: number; resetAt: number };

const entries = new Map<string, Entry>();

type HeaderReader = { get(name: string): string | null };

// Résout l'IP cliente pour le rate-limiting (audit sécurité, finding F4).
// Ordre de confiance :
// 1. `X-Real-IP` — sur le Nginx préparé pour le VPS (deploy/nginx.conf.example),
//    cette valeur est toujours réécrite par `proxy_set_header X-Real-IP
//    $remote_addr` : le client ne peut jamais la falsifier.
// 2. `X-Forwarded-For`, **dernier** élément de la liste — jamais le premier.
//    `$proxy_add_x_forwarded_for` (Nginx) et l'edge Vercel *ajoutent* l'IP
//    réellement observée à la fin de la valeur déjà présente ; un client qui
//    falsifie cet en-tête ne peut donc contrôler que les éléments de tête,
//    jamais le dernier.
// 3. "unknown" si aucun en-tête n'est présent (dev local sans proxy).
export function getClientIp(headers: HeaderReader): string {
  const realIp = headers.get("x-real-ip")?.trim();
  if (realIp) return realIp;
  const forwardedFor = headers.get("x-forwarded-for");
  if (forwardedFor) {
    const parts = forwardedFor
      .split(",")
      .map((part) => part.trim())
      .filter(Boolean);
    if (parts.length > 0) return parts[parts.length - 1];
  }
  return "unknown";
}

export function rateLimit(key: string, limit = 5, windowMs = 60_000) {
  const now = Date.now();
  const current = entries.get(key);
  if (!current || current.resetAt < now) {
    entries.set(key, { count: 1, resetAt: now + windowMs });
    return { allowed: true, remaining: limit - 1 };
  }
  current.count += 1;
  return {
    allowed: current.count <= limit,
    remaining: Math.max(0, limit - current.count),
  };
}
