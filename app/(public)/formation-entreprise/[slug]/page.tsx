import { redirect } from "next/navigation";

export default async function CorporateTrainingDetailAlias({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  redirect(`/formations/${(await params).slug}`);
}
