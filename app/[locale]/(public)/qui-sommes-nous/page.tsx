import { getLocale } from "next-intl/server";

import { redirect } from "@/i18n/navigation";

export default async function AboutAlias() {
  const locale = await getLocale();
  redirect({ href: "/a-propos", locale });
}
