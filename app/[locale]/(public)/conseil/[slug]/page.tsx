import { redirect } from "next/navigation";

export default async function ConsultingAlias({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  redirect(`/services/${(await params).slug}`);
}
