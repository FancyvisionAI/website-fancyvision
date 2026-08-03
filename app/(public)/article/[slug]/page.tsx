import { redirect } from "next/navigation";

export default async function ArticleAlias({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  redirect(`/blog/${(await params).slug}`);
}
