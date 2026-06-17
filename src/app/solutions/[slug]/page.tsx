// STUB (CH-05 skeleton) — real Project detail arrives in CH-10 (fetchPageBySlug).
import { PageStub } from "@/components/PageStub";

export default async function ProjectDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  return <PageStub title={`Solution: ${slug}`} chunk="CH-10" />;
}
