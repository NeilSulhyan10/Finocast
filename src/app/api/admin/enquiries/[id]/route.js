import { getAdminContext } from "@/lib/supabase/admin";

export async function GET(_request, { params }) {
  const admin = await getAdminContext();
  if (!admin.authorized) return Response.json({ error: "Administrator sign-in required." }, { status: 401 });
  const { id } = await params;
  const { data: enquiry, error } = await admin.supabase.from("enquiries").select("*").eq("id", id).maybeSingle();
  if (error || !enquiry) return Response.json({ error: "Enquiry not found." }, { status: 404 });
  const [quote, attachments] = await Promise.all([
    admin.supabase.from("quote_details").select("*").eq("enquiry_id", id).maybeSingle(),
    admin.supabase.from("quote_attachments").select("id,file_name,file_size_bytes,content_type,created_at").eq("enquiry_id", id),
  ]);
  if (quote.error || attachments.error) return Response.json({ error: "Could not load enquiry details." }, { status: 500 });
  return Response.json({ enquiry: { ...enquiry, quote: quote.data, attachments: attachments.data || [] } });
}
export async function PATCH(request, { params }) {
  const admin = await getAdminContext();
  if (!admin.authorized) return Response.json({ error: "Administrator sign-in required." }, { status: 401 });
  const { id } = await params;
  let body; try { body = await request.json(); } catch { return Response.json({ error: "Invalid request." }, { status: 400 }); }
  const update = {};
  if (Object.hasOwn(body, "status")) {
    if (!["new", "in_progress", "resolved"].includes(body.status)) return Response.json({ error: "Choose a valid status." }, { status: 400 });
    update.status = body.status;
  }
  if (Object.hasOwn(body, "internal_notes")) {
    if (typeof body.internal_notes !== "string" || body.internal_notes.length > 10000) return Response.json({ error: "Notes must be 10,000 characters or fewer." }, { status: 400 });
    update.internal_notes = body.internal_notes.trim();
  }
  if (!Object.keys(update).length) return Response.json({ error: "No valid changes supplied." }, { status: 400 });
  const { data, error } = await admin.supabase.from("enquiries").update(update).eq("id", id).select("id,status,internal_notes,updated_at").maybeSingle();
  if (error || !data) return Response.json({ error: "Could not save enquiry changes." }, { status: 500 });
  return Response.json({ enquiry: data });
}
