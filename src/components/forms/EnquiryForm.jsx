"use client";

import { useRef, useState } from "react";
import { createSupabaseBrowserClient } from "@/lib/supabase/browser";
import { company } from "@/data/company";

const initial = { fullName: "", companyName: "", email: "", telephone: "", subject: "", message: "", componentDescription: "", materialGrade: "", approximateWeight: "", requiredQuantity: "" };
const MAX_FILES = 5;
const MAX_FILE_BYTES = 10 * 1024 * 1024;
const MAX_TOTAL_BYTES = 25 * 1024 * 1024;
const allowedExtensions = new Set(["pdf", "jpg", "jpeg", "png", "webp", "tif", "tiff", "dwg", "dxf", "step", "stp", "iges", "igs"]);
const contentTypeFor = (name) => ({ pdf: "application/pdf", jpg: "image/jpeg", jpeg: "image/jpeg", png: "image/png", webp: "image/webp", tif: "image/tiff", tiff: "image/tiff", dxf: "application/dxf" }[name.split(".").pop().toLowerCase()] || "application/octet-stream");
const readableSize = (size) => size < 1024 * 1024 ? `${Math.max(1, Math.round(size / 1024))} KB` : `${(size / (1024 * 1024)).toFixed(1)} MB`;

export default function EnquiryForm({ type = "contact" }) {
  const isRfq = type === "rfq";
  const [values, setValues] = useState(initial);
  const [files, setFiles] = useState([]);
  const [status, setStatus] = useState("idle");
  const [progress, setProgress] = useState("");
  const [error, setError] = useState("");
  const [fileError, setFileError] = useState("");
  const [errors, setErrors] = useState({});
  const submitting = useRef(false);
  function update(event) { setValues({ ...values, [event.target.name]: event.target.value }); setErrors({ ...errors, [event.target.name]: "" }); }
  function addFiles(list) {
    const chosen = Array.from(list || []);
    if (!chosen.length) return;
    let next = [...files];
    let issue = "";
    for (const file of chosen) {
      const ext = file.name.split(".").pop().toLowerCase();
      if (!allowedExtensions.has(ext)) { issue = `${file.name}: file type not supported.`; continue; }
      if (file.size < 1 || file.size > MAX_FILE_BYTES) { issue = `${file.name}: each file must be 10 MB or smaller.`; continue; }
      if (next.some((item) => item.name === file.name && item.size === file.size)) continue;
      if (next.length >= MAX_FILES) { issue = `You can attach up to ${MAX_FILES} files.`; break; }
      if ([...next, file].reduce((sum, item) => sum + item.size, 0) > MAX_TOTAL_BYTES) { issue = "Combined file size must be 25 MB or less."; continue; }
      next.push(file);
    }
    setFiles(next); setFileError((current) => issue || current); if (issue) setError(issue);
  }
  async function cleanup(uploadToken) {
    if (!uploadToken) return true;
    try { const response = await fetch("/api/quote-uploads/cleanup", { method: "DELETE", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ uploadToken }) }); return response.ok; } catch { return false; }
  }
  async function submit(event) {
    event.preventDefault();
    if (submitting.current) return;
    if (isRfq && fileError) { setError(fileError); return; }
    const nextErrors = {};
    if (values.fullName.trim().length < 2) nextErrors.fullName = "Enter your name.";
    if (!/^\S+@\S+\.\S+$/.test(values.email)) nextErrors.email = "Enter a valid email address.";
    if (isRfq && values.componentDescription.trim().length < 10) nextErrors.componentDescription = "Please provide at least 10 characters about the component.";
    if (!isRfq && values.subject.trim().length < 5) nextErrors.subject = "Enter a subject (at least 5 characters).";
    if (!isRfq && values.message.trim().length < 20) nextErrors.message = "Please include at least 20 characters.";
    setErrors(nextErrors); if (Object.keys(nextErrors).length) return;
    submitting.current = true; setStatus("loading"); setError(""); setProgress("");
    let uploadToken;
    try {
      if (isRfq && files.length) {
        setProgress("Preparing secure file uploads…");
        const reservationResponse = await fetch("/api/quote-uploads", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ files: files.map(({ name, size }) => ({ name, size })) }) });
        const reservation = await reservationResponse.json();
        if (!reservationResponse.ok) throw new Error(reservation.error || "Could not prepare file uploads.");
        uploadToken = reservation.uploadToken;
        const supabase = createSupabaseBrowserClient();
        for (let index = 0; index < files.length; index += 1) {
          setProgress(`Uploading file ${index + 1} of ${files.length}…`);
          const { error: uploadError } = await supabase.storage.from("quote-attachments").uploadToSignedUrl(reservation.files[index].path, reservation.files[index].token, files[index], { contentType: contentTypeFor(files[index].name), upsert: false });
          if (uploadError) throw new Error(`Could not upload ${files[index].name}. ${uploadError.message}`);
        }
      }
      setProgress("Submitting your request…");
      const response = await fetch("/api/enquiries", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ ...values, type, uploadToken, attachmentCount: files.length }) });
      const result = await response.json();
      if (!response.ok || !result.success) { if (result.fieldErrors) setErrors(result.fieldErrors); throw new Error(result.error || "The enquiry could not be sent."); }
      uploadToken = undefined;
      setStatus("success"); setValues(initial); setFiles([]); setFileError(""); setProgress("");
    } catch (err) {
      const cleaned = await cleanup(uploadToken);
      setStatus("error"); setProgress(""); setError(`${err.message || "The enquiry could not be sent. Please contact Finocast directly."}${uploadToken && !cleaned ? " Temporary files could not be cleared immediately; the upload session will expire and can be removed by the scheduled cleanup." : ""}`);
    } finally { submitting.current = false; }
  }
  const field = (name, label, required = false, options = {}) => <label className={`form-field ${options.wide ? "field-wide" : ""}`} key={name}><span className="form-label-row"><span>{label}</span>{required && <span className="required-indicator" aria-hidden="true">*</span>}</span>{options.multiline ? <textarea name={name} value={values[name]} onChange={update} rows="4" required={required} aria-invalid={!!errors[name]} aria-describedby={errors[name] ? `${name}-error` : undefined} placeholder={options.placeholder || ""}/> : <input name={name} type={options.type || "text"} value={values[name]} onChange={update} required={required} aria-invalid={!!errors[name]} aria-describedby={errors[name] ? `${name}-error` : undefined} placeholder={options.placeholder || ""} />}{errors[name] && <small id={`${name}-error`} className="field-error">{errors[name]}</small>}</label>;
  return <form className="enquiry-form" onSubmit={submit} noValidate>
    <div className="form-grid">{field("fullName", "Full name", true)}{field("companyName", "Company")}{field("email", "Work email", true, { type: "email" })}{field("telephone", "Phone", false, { type: "tel" })}{isRfq ? <>{field("componentDescription", "Component / application", true, { multiline: true, wide: true, placeholder: "What does the part do? Include a drawing number if available." })}{field("materialGrade", "Material / alloy grade")}{field("approximateWeight", "Approx. component weight")}{field("requiredQuantity", "Estimated quantity")}{field("message", "Additional requirements", false, { multiline: true, wide: true })}</> : <>{field("subject", "Subject", true)}{field("message", "How can we help?", true, { multiline: true, wide: true })}</>}</div>
    {isRfq && <section className="upload-panel" aria-labelledby="upload-heading"><div><h3 id="upload-heading">Technical attachments <span>(optional)</span></h3><p>PDF, DWG, DXF, STEP, IGES, JPG, PNG, WEBP or TIFF · up to 5 files · 10 MB each · 25 MB total.</p></div><label className="upload-button">Add files<input type="file" multiple accept=".pdf,.dwg,.dxf,.step,.stp,.iges,.igs,.jpg,.jpeg,.png,.webp,.tif,.tiff" onChange={(event) => { addFiles(event.target.files); event.target.value = ""; }} disabled={status === "loading"}/></label>{fileError && <p className="field-error upload-error" role="alert">{fileError} <button type="button" onClick={() => { setFileError(""); setError(""); }}>Clear warning</button></p>}{files.length > 0 && <ul className="upload-list">{files.map((file, index) => <li key={`${file.name}-${file.size}-${index}`}><span>{file.name}<small>{readableSize(file.size)}</small></span><button type="button" onClick={() => { setFiles(files.filter((_, fileIndex) => fileIndex !== index)); setFileError(""); }} aria-label={`Remove ${file.name}`} disabled={status === "loading"}>Remove</button></li>)}</ul>}</section>}
    {status === "success" && <p className="form-success" role="status">Your {isRfq ? "quote request" : "enquiry"} has been received. The Finocast team will be in touch.</p>}{status === "error" && <p className="form-error" role="alert">{error} {error.includes("not configured") && <> Please contact {company.contact.emails.map((email, index)=><span key={email.address}>{index > 0 ? " or " : ""}<a href={`mailto:${email.address}`}>{email.address}</a></span>)} directly.</>}</p>}{status === "loading" && progress && <p className="upload-progress" role="status" aria-live="polite">{progress}</p>}
    <div className="form-submit"><button className="button button-copper" type="submit" disabled={status === "loading"}>{status === "loading" ? "Submitting…" : isRfq ? "Send quote request" : "Send enquiry"}<span aria-hidden="true">↗</span></button><span>Fields marked * are required.</span></div>
  </form>;
}
