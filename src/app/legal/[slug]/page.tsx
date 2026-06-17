// STUB (CH-05 skeleton) — real Legal/Privacy content arrives in CH-10 (fetchPageBySlug).
import { PageStub } from "@/components/PageStub";

export default async function LegalPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  return <PageStub title={`Legal: ${slug}`} chunk="CH-10" />;
}
