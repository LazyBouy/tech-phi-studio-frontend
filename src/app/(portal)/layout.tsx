// STUB (CH-05 skeleton) — portal route group.
// The server-side auth gate (cookies() → redirect('/login?next=…')) is added in
// CH-11 (routing/architecture.md → Portal Layout). For now it just renders children.
export default function PortalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
