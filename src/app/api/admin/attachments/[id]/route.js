import { getAdminContext } from "@/lib/supabase/admin";
import { supabaseBucket } from "@/lib/supabase/config";

export async function GET(_request, { params }) {
  const admin = await getAdminContext();
  if (!admin.authorized) return Response.json({ error: "Administrator sign-in required." }, { status: 401 });
  const { id } = await params;
  const { data: attachment, error } = await admin.supabase.from("quote_attachments").select("storage_path,file_name").eq("id", id).not("enquiry_id", "is", null).maybeSingle();
  if (error || !attachment) return Response.json({ error: "Attachment not found." }, { status: 404 });
  const { data, error: signedError } = await admin.supabase.storage.from(supabaseBucket).createSignedUrl(attachment.storage_path, 60, { download: attachment.file_name });
  if (signedError || !data?.signedUrl) return Response.json({ error: "Could not create secure download link." }, { status: 500 });
  return Response.redirect(data.signedUrl, 302);
}
