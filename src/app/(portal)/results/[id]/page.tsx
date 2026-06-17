// STUB (CH-05 skeleton) — real Quiz result (CSR, auth-gated) arrives in CH-13.
import { PageStub } from "@/components/PageStub";

export default async function ResultPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <PageStub title={`Result #${id}`} chunk="CH-13" />;
}
