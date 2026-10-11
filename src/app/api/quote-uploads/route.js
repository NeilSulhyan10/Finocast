import { createHash, randomBytes, randomUUID } from "node:crypto";
import { createSupabaseServiceClient } from "@/lib/supabase/server";
import { supabaseBucket } from "@/lib/supabase/config";

const MAX_FILES = 5;
const MAX_FILE_BYTES = 10 * 1024 * 1024;
const MAX_TOTAL_BYTES = 25 * 1024 * 1024;
const uploadAttempts = new Map();
const accepted = {
  pdf: "application/pdf", jpg: "image/jpeg", jpeg: "image/jpeg", png: "image/png", webp: "image/webp", tif: "image/tiff", tiff: "image/tiff",
  dxf: "application/dxf", dwg: "application/octet-stream", step: "application/octet-stream", stp: "application/octet-stream", iges: "application/octet-stream", igs: "application/octet-stream",
};
const hashToken = (token) => createHash("sha256").update(token).digest("hex");

export async function POST(request) {
  const ip = request.headers.get("x-forwarded-for")?.split(",")[0].trim() || request.headers.get("x-real-ip") || "unknown";
  const now = Date.now();
  const recent = (uploadAttempts.get(ip) || []).filter((time) => now - time < 60_000);
  if (recent.length >= 5) return Response.json({ error: "Too many upload attempts. Please wait before trying again." }, { status: 429 });
  recent.push(now); uploadAttempts.set(ip, recent);
  let supabase; let batchId;
  try {
    const body = await request.json();
    const files = body.files;
    if (!Array.isArray(files) || files.length < 1 || files.length > MAX_FILES || files.some((file) => !file || typeof file !== "object")) return Response.json({ error: `Choose between 1 and ${MAX_FILES} files.` }, { status: 400 });
    let total = 0;
    const validated = [];
    for (const file of files) {
      const name = String(file.name || "").replace(/[\x00-\x1f\x7f]/g, "").trim();
      const size = Number(file.size);
      const ext = name.split(".").pop()?.toLowerCase();
      if (!name || name.length > 255 || !Number.isSafeInteger(size) || size < 1 || size > MAX_FILE_BYTES || !accepted[ext]) return Response.json({ error: `“${name || "File"}” has an unsupported type or exceeds 10 MB.` }, { status: 400 });
      total += size;
      validated.push({ name, size, ext, contentType: accepted[ext] });
    }
    if (total > MAX_TOTAL_BYTES) return Response.json({ error: "The combined attachment size must be 25 MB or less." }, { status: 400 });

    supabase = createSupabaseServiceClient();
    const token = randomBytes(32).toString("base64url");
    const { data: batch, error: batchError } = await supabase.from("quote_upload_batches").insert({ token_hash: hashToken(token), expires_at: new Date(Date.now() + 30 * 60 * 1000).toISOString() }).select("id").single();
    if (batchError) throw batchError;
    batchId = batch.id;
    const reserved = [];
    for (const file of validated) {
      const id = randomUUID();
      const path = `${batch.id}/${id}.${file.ext}`;
      const { error: rowError } = await supabase.from("quote_attachments").insert({ upload_batch_id: batch.id, storage_path: path, file_name: file.name, content_type: file.contentType, file_size_bytes: file.size });
      if (rowError) throw rowError;
      const { data, error } = await supabase.storage.from(supabaseBucket).createSignedUploadUrl(path, { upsert: false });
      if (error) throw error;
      reserved.push({ path, token: data.token });
    }
    return Response.json({ uploadToken: token, files: reserved }, { status: 201 });
  } catch (error) {
    if (supabase && batchId) {
      const { data: staged } = await supabase.from("quote_attachments").select("storage_path").eq("upload_batch_id", batchId);
      if (staged?.length) await supabase.storage.from(supabaseBucket).remove(staged.map((file) => file.storage_path));
      await supabase.from("quote_upload_batches").delete().eq("id", batchId);
    }
    console.error("Quote upload reservation failed", error);
    return Response.json({ error: "Unable to prepare secure uploads. Please try again." }, { status: 503 });
  }
}
