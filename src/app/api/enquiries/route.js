import { createHash } from "node:crypto";
import { validateEnquiry, validateContact, sanitizeEnquiryInput, sanitizeString } from "@/lib/validation";
import { sendEnquiryEmail } from "@/lib/email";
import { createSupabaseServiceClient } from "@/lib/supabase/server";
import { supabaseBucket } from "@/lib/supabase/config";

const RATE_LIMIT_WINDOW = 60 * 1000;
const RATE_LIMIT_MAX = 5;
const submissions = new Map();
function checkRateLimit(ip) {
  const now = Date.now(); const recent = (submissions.get(ip) || []).filter((time) => now - time < RATE_LIMIT_WINDOW);
  if (recent.length >= RATE_LIMIT_MAX) return false;
  recent.push(now); submissions.set(ip, recent); return true;
}
function errorFields(result) {
  const fieldErrors = {};
  result.error.issues.forEach((issue) => { if (issue.path[0]) fieldErrors[issue.path[0]] = issue.message; });
  return fieldErrors;
}
function getClientIp(request) { return request.headers.get("x-forwarded-for")?.split(",")[0].trim() || request.headers.get("x-real-ip") || "unknown"; }
async function verifyAttachment(supabase, item) {
  const { data: blob, error } = await supabase.storage.from(supabaseBucket).download(item.storage_path);
  if (error || !blob || blob.size !== Number(item.file_size_bytes)) return false;
  const bytes = new Uint8Array(await blob.slice(0, 96).arrayBuffer());
  const text = new TextDecoder().decode(bytes).trimStart().toUpperCase();
  const ext = item.storage_path.split(".").pop().toLowerCase();
  if (ext === "pdf") return text.startsWith("%PDF-");
  if (ext === "jpg" || ext === "jpeg") return bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[2] === 0xff;
  if (ext === "png") return [137, 80, 78, 71, 13, 10, 26, 10].every((value, index) => bytes[index] === value);
  if (ext === "webp") return text.startsWith("RIFF") && text.slice(8, 12) === "WEBP";
  if (ext === "tif" || ext === "tiff") return (bytes[0] === 0x49 && bytes[1] === 0x49 && bytes[2] === 0x2a) || (bytes[0] === 0x4d && bytes[1] === 0x4d && bytes[3] === 0x2a);
  if (ext === "dwg") return text.startsWith("AC10");
  if (ext === "step" || ext === "stp") return text.startsWith("ISO-10303-21");
  if (ext === "dxf") return text.startsWith("0") && text.includes("SECTION");
  if (ext === "igs" || ext === "iges") return bytes.length >= 72 && (bytes[72] === 0x53 || text.includes("S      1"));
  return false;
}
async function notify(data, type) {
  try { const result = await sendEnquiryEmail(data, type); if (!result.success) console.warn("Enquiry stored; notification email is not configured."); }
  catch (error) { console.error("Enquiry stored; notification email failed", error); }
}

export async function POST(request) {
  if (!checkRateLimit(getClientIp(request))) return Response.json({ success: false, error: "Too many requests. Please wait before submitting again." }, { status: 429 });
  try {
    const body = await request.json();
    const supabase = createSupabaseServiceClient();
    if (body.type === "rfq") {
      const sanitized = sanitizeEnquiryInput(body);
      const result = validateEnquiry(sanitized);
      if (!result.success) return Response.json({ success: false, error: "Please review the highlighted fields.", fieldErrors: errorFields(result) }, { status: 400 });
      const uploadToken = typeof body.uploadToken === "string" ? body.uploadToken : null;
      const attachmentCount = Number(body.attachmentCount || 0);
      if (!Number.isInteger(attachmentCount) || attachmentCount < 0 || attachmentCount > 5 || (attachmentCount > 0 && !uploadToken) || (attachmentCount === 0 && uploadToken)) return Response.json({ success: false, error: "Attachment upload information is incomplete. Please select the files again." }, { status: 400 });
      if (uploadToken) {
        const tokenHash = createHash("sha256").update(uploadToken).digest("hex");
        const { data: batch, error: batchError } = await supabase.from("quote_upload_batches").select("id").eq("token_hash", tokenHash).gt("expires_at", new Date().toISOString()).maybeSingle();
        if (batchError || !batch) return Response.json({ success: false, error: "The secure upload session expired. Please attach your files again." }, { status: 400 });
        const { data: attachments, error: attachmentsError } = await supabase.from("quote_attachments").select("storage_path,file_size_bytes").eq("upload_batch_id", batch.id);
        if (attachmentsError || attachments?.length !== attachmentCount) return Response.json({ success: false, error: "The attached files could not be verified. Please try uploading them again." }, { status: 400 });
        for (const item of attachments) {
          if (!(await verifyAttachment(supabase, item))) return Response.json({ success: false, error: "One or more attachments are incomplete or do not match their selected file type. Please check the files and try again." }, { status: 400 });
        }
      }
      const { data: saved, error: saveError } = await supabase.rpc("finalize_quote_enquiry", {
        p_token_hash: uploadToken ? createHash("sha256").update(uploadToken).digest("hex") : null,
        p_fields: { full_name: sanitized.fullName, company_name: sanitized.companyName, email: sanitized.email, telephone: sanitized.telephone, component_description: sanitized.componentDescription, material_grade: sanitized.materialGrade, approximate_weight: sanitized.approximateWeight, required_quantity: sanitized.requiredQuantity, additional_requirements: sanitized.additionalRequirements, attachment_count: attachmentCount },
      });
      if (saveError) throw saveError;
      await notify({ ...sanitized, message: sanitized.additionalRequirements }, "rfq");
      return Response.json({ success: true, reference: saved.reference });
    }
    if (body.type === "contact") {
      const sanitized = { fullName: sanitizeString(body.fullName), companyName: sanitizeString(body.companyName), email: String(body.email || "").toLowerCase().trim(), telephone: sanitizeString(body.telephone), subject: sanitizeString(body.subject), message: sanitizeString(body.message) };
      const result = validateContact(sanitized);
      if (!result.success) return Response.json({ success: false, error: "Please review the highlighted fields.", fieldErrors: errorFields(result) }, { status: 400 });
      const { data: saved, error: saveError } = await supabase.from("enquiries").insert({ source: "contact", full_name: sanitized.fullName, company_name: sanitized.companyName || null, email: sanitized.email, telephone: sanitized.telephone || null, subject: sanitized.subject, message: sanitized.message }).select("reference").single();
      if (saveError) throw saveError;
      await notify(sanitized, "contact");
      return Response.json({ success: true, reference: saved.reference });
    }
    return Response.json({ success: false, error: "Invalid request type." }, { status: 400 });
  } catch (error) {
    console.error("Enquiry persistence error", error);
    const unavailable = error?.message?.includes("configuration is missing");
    return Response.json({ success: false, error: unavailable ? "The enquiry service is not configured yet. Please contact Finocast directly." : "The enquiry could not be saved. Please try again shortly." }, { status: unavailable ? 503 : 500 });
  }
}
