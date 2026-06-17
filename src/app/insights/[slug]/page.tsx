// STUB (CH-05 skeleton) — real Insight detail arrives in CH-10 (fetchPageBySlug).
import { PageStub } from "@/components/PageStub";

export default async function InsightDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  return <PageStub title={`Insight: ${slug}`} chunk="CH-10" />;
}
