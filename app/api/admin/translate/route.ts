import { after, NextResponse } from "next/server";

import { auth } from "@/auth";
import {
  beginServiceTranslation,
  finishServiceTranslation,
} from "@/lib/translation/service-translator";
import {
  beginTrainingTranslation,
  finishTrainingTranslation,
} from "@/lib/translation/training-translator";

/**
 * Déclenchement manuel explicite ("Régénérer") — prototypes Service (P2)
 * et Training (P3) UNIQUEMENT. Aucun autre module n'est accepté ici,
 * volontairement : la généralisation à Article/Page/CaseStudy/Faq/Event
 * est hors périmètre, même si le code le permettrait techniquement.
 */
export async function POST(request: Request) {
  const session = await auth();
  if (!session?.user?.id)
    return NextResponse.json({ error: "Non autorisé." }, { status: 401 });

  const body = (await request.json().catch(() => null)) as {
    module?: string;
    id?: string;
  } | null;
  if (!body?.id)
    return NextResponse.json(
      { error: "Paramètres manquants." },
      { status: 400 },
    );

  if (body.module === "services") {
    const result = await beginServiceTranslation(body.id, { force: true });
    if (!result.proceed)
      return NextResponse.json({ error: result.reason }, { status: 409 });
    after(() =>
      finishServiceTranslation(body.id!, result.enId, session.user.id),
    );
    return NextResponse.json({ started: true, enId: result.enId });
  }

  if (body.module === "trainings") {
    const result = await beginTrainingTranslation(body.id, { force: true });
    if (!result.proceed)
      return NextResponse.json({ error: result.reason }, { status: 409 });
    after(() =>
      finishTrainingTranslation(body.id!, result.enId, session.user.id),
    );
    return NextResponse.json({ started: true, enId: result.enId });
  }

  return NextResponse.json(
    {
      error: "Ce prototype ne gère que les modules 'services' et 'trainings'.",
    },
    { status: 400 },
  );
}
