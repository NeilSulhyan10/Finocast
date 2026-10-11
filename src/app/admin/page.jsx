import { Suspense } from "react";
import { redirect } from "next/navigation";
import { connection } from "next/server";
import Dashboard from "./Dashboard";
import { getAdminContext } from "@/lib/supabase/admin";

export const metadata = { title: "Enquiry Admin | Finocast", robots: { index: false, follow: false } };
async function AdminContent() {
  // Admin authorization depends on the incoming session cookie. Defer the
  // Supabase auth work until a real request so SDK time checks are never run
  // while Next.js is building the prerendered shell.
  await connection();
  const admin = await getAdminContext();
  if (!admin.configured) return <main className="admin-auth-page"><section className="admin-auth-panel"><p className="eyebrow">Finocast · Administration</p><h1>Setup required</h1><p>Supabase configuration is incomplete. Check the project URL, publishable key and server-only service role key, then apply the database migration.</p></section></main>;
  if (!admin.authorized) redirect("/admin/login");
  return <Dashboard/>;
}
export default function AdminPage() {
  return <Suspense fallback={<main className="admin-auth-page"><p role="status">Checking administrator access…</p></main>}><AdminContent/></Suspense>;
}
