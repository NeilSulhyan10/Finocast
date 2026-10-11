import { createSupabaseServiceClient } from "@/lib/supabase/server";
import { supabaseBucket } from "@/lib/supabase/config";

export async function POST(request) {
  const secret = process.env.CRON_SECRET;
  if (!secret || request.headers.get("authorization") !== `Bearer ${secret}`) return Response.json({ error: "Unauthorized." }, { status: 401 });
  try {
    const supabase = createSupabaseServiceClient();
    const { data: batches, error } = await supabase.from("quote_upload_batches").select("id").lt("expires_at", new Date().toISOString()).limit(100);
    if (error) throw error;
    let removed = 0;
    for (const batch of batches || []) {
      const { data: files, error: fileError } = await supabase.from("quote_attachments").select("storage_path").eq("upload_batch_id", batch.id);
      if (fileError) throw fileError;
      if (files?.length) {
        const { error: storageError } = await supabase.storage.from(supabaseBucket).remove(files.map((file) => file.storage_path));
        if (storageError) throw storageError;
      }
      const { error: deleteError } = await supabase.from("quote_upload_batches").delete().eq("id", batch.id);
      if (deleteError) throw deleteError;
      removed += files?.length || 0;
    }
    return Response.json({ success: true, batches: batches?.length || 0, files: removed });
  } catch (error) {
    console.error("Expired upload cleanup failed", error);
    return Response.json({ error: "Cleanup failed." }, { status: 500 });
  }
}
