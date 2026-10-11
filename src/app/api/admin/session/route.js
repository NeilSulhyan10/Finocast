import { getAdminContext } from "@/lib/supabase/admin";

export async function GET() {
  const admin = await getAdminContext();
  if (admin.authorized) return Response.json({ authenticated: true, authorized: true });
  if (!admin.configured) return Response.json({ authenticated: false, authorized: false, stage: "server-config" }, { status: 503 });
  if (admin.reason === "no-session" || admin.reason === "server-session-error") {
    return Response.json({ authenticated: false, authorized: false, stage: "server-session" }, { status: 401 });
  }
  if (admin.reason === "membership-not-found") {
    return Response.json({ authenticated: true, authorized: false, stage: "membership" }, { status: 403 });
  }
  return Response.json({ authenticated: true, authorized: false, stage: "membership-query" }, { status: 503 });
}
