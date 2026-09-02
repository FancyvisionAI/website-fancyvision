import { getLocale } from "next-intl/server";

import { redirect } from "@/i18n/navigation";

export default async function ConsultingAlias({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const locale = await getLocale();
  const { slug } = await params;
  redirect({ href: `/services/${slug}`, locale });
}
