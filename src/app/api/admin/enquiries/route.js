import { getAdminContext } from "@/lib/supabase/admin";

export async function GET(request) {
  const admin = await getAdminContext();
  if (!admin.authorized) return Response.json({ error: admin.configured ? "Administrator sign-in required." : "Supabase admin configuration is incomplete." }, { status: admin.configured ? 401 : 503 });
  const params = new URL(request.url).searchParams;
  const page = Math.max(1, Math.min(10000, Number(params.get("page")) || 1));
  const pageSize = Math.max(5, Math.min(50, Number(params.get("pageSize")) || 10));
  const source = ["contact", "quote"].includes(params.get("source")) ? params.get("source") : "all";
  const status = ["new", "in_progress", "resolved"].includes(params.get("status")) ? params.get("status") : "all";
  const from = params.get("from"); const to = params.get("to");
  const search = (params.get("search") || "").replace(/[%,()]/g, " ").trim().slice(0, 80);
  let query = admin.supabase.from("enquiries").select("id,reference,source,status,full_name,company_name,email,telephone,subject,message,internal_notes,created_at,updated_at", { count: "exact" });
  if (source !== "all") query = query.eq("source", source);
  if (status !== "all") query = query.eq("status", status);
  if (from && /^\d{4}-\d{2}-\d{2}$/.test(from)) query = query.gte("created_at", `${from}T00:00:00.000Z`);
  if (to && /^\d{4}-\d{2}-\d{2}$/.test(to)) query = query.lte("created_at", `${to}T23:59:59.999Z`);
  if (search) query = query.or(`full_name.ilike.%${search}%,email.ilike.%${search}%,company_name.ilike.%${search}%,reference.ilike.%${search}%`);
  const { data, count, error } = await query.order("created_at", { ascending: params.get("sort") === "oldest" }).range((page - 1) * pageSize, page * pageSize - 1);
  if (error) return Response.json({ error: "Could not load enquiries." }, { status: 500 });
  const ids = (data || []).map((row) => row.id);
  let quoteDetails = []; let attachments = [];
  if (ids.length) {
    const [quoteResult, attachmentResult] = await Promise.all([
      admin.supabase.from("quote_details").select("*").in("enquiry_id", ids),
      admin.supabase.from("quote_attachments").select("id,enquiry_id,file_name,file_size_bytes,content_type,created_at").in("enquiry_id", ids),
    ]);
    if (quoteResult.error || attachmentResult.error) return Response.json({ error: "Could not load enquiry details." }, { status: 500 });
    quoteDetails = quoteResult.data || []; attachments = attachmentResult.data || [];
  }
  const map = new Map(quoteDetails.map((item) => [item.enquiry_id, item]));
  const counts = {};
  for (const [key, filter] of Object.entries({ total: null, contact: "contact", quote: "quote", new: "new", in_progress: "in_progress", resolved: "resolved" })) {
    let countQuery = admin.supabase.from("enquiries").select("id", { count: "exact", head: true });
    if (["contact", "quote"].includes(filter)) countQuery = countQuery.eq("source", filter);
    else if (filter) countQuery = countQuery.eq("status", filter);
    const result = await countQuery;
    if (result.error) return Response.json({ error: "Could not load dashboard totals." }, { status: 500 });
    counts[key] = result.count || 0;
  }
  return Response.json({ rows: (data || []).map((row) => ({ ...row, quote: map.get(row.id) || null, attachments: attachments.filter((item) => item.enquiry_id === row.id) })), count: count || 0, page, pageSize, pages: Math.max(1, Math.ceil((count || 0) / pageSize)), counts });
}
