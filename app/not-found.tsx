import { ArrowLeft } from "lucide-react";
import { getTranslations } from "next-intl/server";

import { Button } from "@/components/ui/button";
import { Link } from "@/i18n/navigation";

export default async function NotFound() {
  const t = await getTranslations("NotFound");
  return (
    <main className="grid min-h-screen place-items-center bg-lime px-5">
      <div className="text-center">
        <p className="text-sm font-bold uppercase tracking-[0.16em]">
          {t("eyebrow")}
        </p>
        <h1 className="display-title mt-6 text-[clamp(7rem,28vw,20rem)]">
          {t("title")}
        </h1>
        <p className="text-ink/60 mx-auto mt-5 max-w-md text-lg">
          {t("description")}
        </p>
        <Button asChild className="mt-8">
          <Link href="/">
            <ArrowLeft className="mr-3 size-4" /> {t("backHome")}
          </Link>
        </Button>
      </div>
    </main>
  );
}
