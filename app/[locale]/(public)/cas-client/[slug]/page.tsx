import { redirect } from "next/navigation";

export default async function CaseStudyAlias({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  redirect(`/etudes-de-cas/${(await params).slug}`);
}
