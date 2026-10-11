import { createHash } from "node:crypto";
import { createSupabaseServiceClient } from "@/lib/supabase/server";
import { supabaseBucket } from "@/lib/supabase/config";

const hashToken = (token) => createHash("sha256").update(token).digest("hex");

export async function DELETE(request) {
  try {
    const { uploadToken } = await request.json();
    if (typeof uploadToken !== "string" || uploadToken.length < 30) return Response.json({ error: "Invalid upload session." }, { status: 400 });
    const supabase = createSupabaseServiceClient();
    const { data: batch } = await supabase.from("quote_upload_batches").select("id").eq("token_hash", hashToken(uploadToken)).maybeSingle();
    if (!batch) return Response.json({ success: true });
    const { data: files } = await supabase.from("quote_attachments").select("storage_path").eq("upload_batch_id", batch.id);
    if (files?.length) {
      const { error } = await supabase.storage.from(supabaseBucket).remove(files.map((file) => file.storage_path));
      if (error) throw error;
    }
    const { error } = await supabase.from("quote_upload_batches").delete().eq("id", batch.id);
    if (error) throw error;
    return Response.json({ success: true });
  } catch (error) {
    console.error("Quote upload cleanup failed", error);
    return Response.json({ error: "Upload cleanup failed. Please contact Finocast if you retry." }, { status: 503 });
  }
}
