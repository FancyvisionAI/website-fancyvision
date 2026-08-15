import { getLocale } from "next-intl/server";

import { redirect } from "@/i18n/navigation";

export default async function PrivateTrainingAlias() {
  const locale = await getLocale();
  redirect({ href: "/formations", locale });
}
