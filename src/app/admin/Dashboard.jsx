"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createSupabaseBrowserClient } from "@/lib/supabase/browser";

const statusNames = { new: "New", in_progress: "In progress", resolved: "Resolved" };
const sizeLabel = (bytes) => bytes < 1024 * 1024 ? `${Math.ceil(bytes / 1024)} KB` : `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
const dateLabel = (date) => new Intl.DateTimeFormat("en-IN", { dateStyle: "medium", timeStyle: "short" }).format(new Date(date));

export default function Dashboard() {
  const router = useRouter();
  const [filters, setFilters] = useState({ search: "", source: "all", status: "all", from: "", to: "", sort: "newest", page: 1 });
  const [data, setData] = useState(null); const [selected, setSelected] = useState(null); const [loading, setLoading] = useState(true); const [error, setError] = useState(""); const [feedback, setFeedback] = useState(""); const [saving, setSaving] = useState(false); const [noteDraft, setNoteDraft] = useState("");
  const load = useCallback(async () => {
    setLoading(true); setError("");
    try {
      const params = new URLSearchParams({ ...filters, pageSize: "10" });
      const response = await fetch(`/api/admin/enquiries?${params}`, { cache: "no-store" }); const result = await response.json();
      if (response.status === 401) { router.replace("/admin/login"); return; }
      if (!response.ok) throw new Error(result.error || "Could not load enquiries.");
      setData(result);
    } catch (issue) { setError(issue.message); }
    finally { setLoading(false); }
  }, [filters, router]);
  useEffect(() => { const timer = setTimeout(load, 180); return () => clearTimeout(timer); }, [load]);
  async function openDetail(id) {
    setFeedback("");
    try { const response = await fetch(`/api/admin/enquiries/${id}`, { cache: "no-store" }); const result = await response.json(); if (!response.ok) throw new Error(result.error); setSelected(result.enquiry); setNoteDraft(result.enquiry.internal_notes || ""); }
    catch (issue) { setError(issue.message || "Could not open enquiry."); }
  }
  async function saveChanges(patch) {
    if (!selected) return; setSaving(true); setFeedback("");
    try { const response = await fetch(`/api/admin/enquiries/${selected.id}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify(patch) }); const result = await response.json(); if (!response.ok) throw new Error(result.error); setSelected({ ...selected, ...result.enquiry }); setNoteDraft(result.enquiry.internal_notes ?? noteDraft); setFeedback("Changes saved."); await load(); }
    catch (issue) { setFeedback(issue.message || "Could not save changes."); }
    finally { setSaving(false); }
  }
  async function signOut() { await createSupabaseBrowserClient().auth.signOut(); router.replace("/admin/login"); router.refresh(); }
  function change(key, value) { setFilters((current) => ({ ...current, [key]: value, page: 1 })); }
  const counts = data?.counts || {};
  return <main className="admin-page"><div className="admin-wrap"><header className="admin-heading"><div><p className="eyebrow">Finocast · Administration</p><h1>Enquiries</h1><p>Review incoming contact messages and quotation requests.</p></div><button className="button button-dark" onClick={signOut}>Sign out</button></header>
    <section className="admin-metrics" aria-label="Enquiry overview">{[["Total enquiries", counts.total], ["Contact", counts.contact], ["Quote requests", counts.quote], ["New", counts.new], ["In progress", counts.in_progress], ["Resolved", counts.resolved]].map(([label, value]) => <article key={label}><span>{label}</span><strong>{value ?? "—"}</strong></article>)}</section>
    <section className="admin-list-panel"><div className="admin-list-heading"><div><p className="eyebrow">Inbox</p><h2>Recent submissions</h2></div><span>{data?.count ?? 0} records</span></div>
      <div className="admin-filters"><label>Search<input placeholder="Name, email, company, reference" value={filters.search} onChange={(event) => change("search", event.target.value)}/></label><label>Source<select value={filters.source} onChange={(event) => change("source", event.target.value)}><option value="all">All sources</option><option value="contact">Contact</option><option value="quote">Quote request</option></select></label><label>Status<select value={filters.status} onChange={(event) => change("status", event.target.value)}><option value="all">All statuses</option>{Object.entries(statusNames).map(([key, label]) => <option key={key} value={key}>{label}</option>)}</select></label><label>From<input type="date" value={filters.from} onChange={(event) => change("from", event.target.value)}/></label><label>To<input type="date" value={filters.to} onChange={(event) => change("to", event.target.value)}/></label><label>Order<select value={filters.sort} onChange={(event) => change("sort", event.target.value)}><option value="newest">Newest first</option><option value="oldest">Oldest first</option></select></label></div>
      {error && <p className="form-error" role="alert">{error}</p>}
      {loading ? <p className="admin-state" role="status">Loading enquiries…</p> : data?.rows?.length ? <div className="admin-table-scroll"><table className="admin-table"><thead><tr><th>Reference</th><th>Customer</th><th>Source</th><th>Status</th><th>Received</th><th></th></tr></thead><tbody>{data.rows.map((row) => <tr key={row.id}><td><strong>{row.reference}</strong></td><td>{row.full_name}<small>{row.company_name || row.email}</small></td><td>{row.source === "quote" ? "Quote request" : "Contact"}</td><td><span className={`status-pill status-${row.status}`}>{statusNames[row.status]}</span></td><td>{dateLabel(row.created_at)}</td><td><button className="admin-open" onClick={() => openDetail(row.id)}>View</button></td></tr>)}</tbody></table></div> : <p className="admin-state">{data?.count ? "No enquiries match these filters." : "No enquiries have been submitted yet."}</p>}
      <div className="admin-pagination"><span>Page {data?.page || 1} of {data?.pages || 1}</span><div><button disabled={!data || data.page <= 1 || loading} onClick={() => change("page", filters.page - 1)}>Previous</button><button disabled={!data || data.page >= data.pages || loading} onClick={() => change("page", filters.page + 1)}>Next</button></div></div>
    </section>
  </div>
  {selected && <div className="admin-modal-backdrop" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) setSelected(null); }}><section className="admin-detail" role="dialog" aria-modal="true" aria-labelledby="detail-title"><button className="admin-close" onClick={() => setSelected(null)} aria-label="Close enquiry details">×</button><p className="eyebrow">{selected.source === "quote" ? "Quote request" : "Contact enquiry"} · {selected.reference}</p><h2 id="detail-title">{selected.full_name}</h2><p className="admin-detail-meta">Received {dateLabel(selected.created_at)} · <a href={`mailto:${selected.email}`}>{selected.email}</a>{selected.telephone && <> · <a href={`tel:${selected.telephone}`}>{selected.telephone}</a></>}</p>{selected.company_name && <p><strong>Company:</strong> {selected.company_name}</p>}{selected.subject && <p><strong>Subject:</strong> {selected.subject}</p>}{selected.quote && <div className="admin-quote-fields"><p><strong>Component / application</strong><br/>{selected.quote.component_description}</p><p><strong>Material / alloy</strong><br/>{selected.quote.material_grade || "Not specified"}</p><p><strong>Approximate weight</strong><br/>{selected.quote.approximate_weight || "Not specified"}</p><p><strong>Quantity</strong><br/>{selected.quote.required_quantity || "Not specified"}</p></div>}<div className="admin-message"><strong>{selected.source === "quote" ? "Additional requirements" : "Message"}</strong><p>{selected.source === "quote" ? selected.quote?.additional_requirements || "Not provided" : selected.message}</p></div>{selected.attachments?.length > 0 && <div className="admin-attachments"><h3>Attachments</h3><ul>{selected.attachments.map((file) => <li key={file.id}><span>{file.file_name}<small>{sizeLabel(file.file_size_bytes)}</small></span><a className="admin-open" href={`/api/admin/attachments/${file.id}`}>Secure download ↗</a></li>)}</ul></div>}<div className="admin-edit"><label>Status<select value={selected.status} onChange={(event) => saveChanges({ status: event.target.value })} disabled={saving}>{Object.entries(statusNames).map(([key, label]) => <option key={key} value={key}>{label}</option>)}</select></label><label>Internal notes<textarea rows="4" maxLength="10000" value={noteDraft} onChange={(event) => setNoteDraft(event.target.value)}/></label><button className="button button-copper" onClick={() => saveChanges({ internal_notes: noteDraft })} disabled={saving}>{saving ? "Saving…" : "Save notes"}</button>{feedback && <p role="status" className={feedback.includes("Could not") ? "form-error" : "form-success"}>{feedback}</p>}</div></section></div>}
  </main>;
}
