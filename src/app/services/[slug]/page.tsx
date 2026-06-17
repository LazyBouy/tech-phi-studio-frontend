// STUB (CH-05 skeleton) — real Service detail arrives in CH-10 (fetchPageBySlug).
import { PageStub } from "@/components/PageStub";

export default async function ServiceDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  return <PageStub title={`Service: ${slug}`} chunk="CH-10" />;
}
