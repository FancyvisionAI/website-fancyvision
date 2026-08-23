import { after, NextResponse } from "next/server";

import { auth } from "@/auth";
import {
  beginServiceTranslation,
  finishServiceTranslation,
} from "@/lib/translation/service-translator";

/**
 * Déclenchement manuel explicite ("Régénérer") — prototype Service
 * UNIQUEMENT. Aucun autre module n'est accepté ici, volontairement :
 * la généralisation à Training/Article/Page/CaseStudy est hors périmètre
 * de cette phase (P2), même si le code le permettrait techniquement.
 */
export async function POST(request: Request) {
  const session = await auth();
  if (!session?.user?.id)
    return NextResponse.json({ error: "Non autorisé." }, { status: 401 });

  const body = (await request.json().catch(() => null)) as {
    module?: string;
    id?: string;
  } | null;
  if (body?.module !== "services" || !body.id)
    return NextResponse.json(
      { error: "Ce prototype ne gère que le module 'services'." },
      { status: 400 },
    );

  const result = await beginServiceTranslation(body.id, { force: true });
  if (!result.proceed)
    return NextResponse.json({ error: result.reason }, { status: 409 });

  after(() => finishServiceTranslation(body.id!, result.enId, session.user.id));
  return NextResponse.json({ started: true, enId: result.enId });
}
