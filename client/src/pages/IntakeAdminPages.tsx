import { cloneElement, FormEvent, isValidElement, useEffect, useState } from "react";
import { Link, useLocation } from "wouter";
import { ArrowRight, Download, LockKeyhole, RefreshCw } from "lucide-react";
import { company } from "@/content/siteData";
import { Breadcrumbs, PageIntro, SectionLabel } from "@/components/SiteShell";

const experienceAreas = ["Sales", "Production", "Editorial", "Accounts", "DTP & Designing", "HR"] as const;
const MAX_RESUME_BYTES = 5 * 1024 * 1024;

type FieldErrors = Record<string, string>;
async function apiError(response: Response): Promise<{ message: string; fields: FieldErrors }> {
  let payload: any = {};
  try { payload = await response.json(); } catch { /* use generic message */ }
  const rawFields = payload.fieldErrors ?? payload.errors ?? {};
  const fields: FieldErrors = Array.isArray(rawFields)
    ? Object.fromEntries(rawFields.filter((item: any) => item?.field).map((item: any) => [item.field, String(item.message ?? "Please check this field.")]))
    : Object.fromEntries(Object.entries(rawFields).map(([key, value]) => [key, typeof value === "string" ? value : String((value as any)?.message ?? "Please check this field.")]));
  return { message: payload.message ?? payload.error ?? "We could not complete the request. Please try again.", fields };
}
function useProductContext() {
  const [context, setContext] = useState<{ productSlug: string; subject: string }>({ productSlug: "", subject: "" });
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const slug = params.get("productSlug") ?? "";
    setContext({ productSlug: slug, subject: slug ? `Product enquiry: ${slug}` : "" });
  }, []);
  return context;
}

export function EnquiryForm() {
  const initial = useProductContext();
  const [values, setValues] = useState({ name: "", email: "", mobile: "", subject: "", message: "", website: "" });
  const [consent, setConsent] = useState(false);
  const [busy, setBusy] = useState(false);
  const [notice, setNotice] = useState("");
  const [noticeKind, setNoticeKind] = useState<"error" | "success" | null>(null);
  const [errors, setErrors] = useState<FieldErrors>({});
  useEffect(() => { if (initial.subject) setValues((v) => ({ ...v, subject: initial.subject })); }, [initial.subject]);
  const set = (key: keyof typeof values, value: string) => setValues((v) => ({ ...v, [key]: value }));
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (busy) return;
    setNotice(""); setNoticeKind(null); setErrors({});
    const validation: FieldErrors = {};
    for (const key of ["name", "email", "mobile", "subject", "message"] as const) if (!values[key].trim()) validation[key] = "This field is required.";
    if (values.email && !/^\S+@\S+\.\S+$/.test(values.email)) validation.email = "Enter a valid email address.";
    if (!consent) validation.consent = "Please review the privacy notice and confirm consent to submit.";
    if (Object.keys(validation).length) { setErrors(validation); setNoticeKind("error"); setNotice("Please correct the highlighted fields."); return; }
    setBusy(true);
    try {
      const response = await fetch("/api/public/enquiries", { method: "POST", headers: { "Content-Type": "application/json" }, credentials: "same-origin", body: JSON.stringify({ name: values.name.trim(), email: values.email.trim(), mobile: values.mobile.trim(), subject: values.subject.trim(), message: values.message.trim(), ...(initial.productSlug ? { productSlug: initial.productSlug } : {}), consent: true, website: values.website }) });
      if (!response.ok) { const problem = await apiError(response); setErrors(problem.fields); setNoticeKind("error"); setNotice(problem.message); return; }
      setValues({ name: "", email: "", mobile: "", subject: "", message: "", website: "" }); setConsent(false);
      setNoticeKind("success");
      setNotice("Your enquiry has been stored. Email acknowledgement is not configured, so no confirmation email was sent.");
    } catch { setNoticeKind("error"); setNotice("We could not reach the submission service. Please try again later."); }
    finally { setBusy(false); }
  }
  return <form className="intake-form" onSubmit={submit} noValidate aria-busy={busy}>
    <FormFeedback notice={notice} kind={noticeKind} errors={errors} />
    <div className="form-grid"><FormField id="enq-name" label="Name" error={errors.name}><input id="enq-name" name="name" autoComplete="name" maxLength={120} required value={values.name} onChange={(e) => set("name", e.target.value)} /></FormField>
      <FormField id="enq-email" label="Email" error={errors.email}><input id="enq-email" name="email" type="email" autoComplete="email" maxLength={254} required value={values.email} onChange={(e) => set("email", e.target.value)} /></FormField>
      <FormField id="enq-mobile" label="Mobile" error={errors.mobile}><input id="enq-mobile" name="mobile" type="tel" autoComplete="tel" maxLength={30} required value={values.mobile} onChange={(e) => set("mobile", e.target.value)} /></FormField>
      <FormField id="enq-subject" label="Subject" error={errors.subject}><input id="enq-subject" name="subject" maxLength={180} required value={values.subject} onChange={(e) => set("subject", e.target.value)} /></FormField>
      <FormField id="enq-message" label="Message" error={errors.message} wide><textarea id="enq-message" name="message" rows={6} maxLength={5000} required value={values.message} onChange={(e) => set("message", e.target.value)} /></FormField>
    </div>
    <label className="honeypot" aria-hidden="true">Leave this field empty<input name="website" tabIndex={-1} autoComplete="off" value={values.website} onChange={(e) => set("website", e.target.value)} /></label>
    <Consent id="enquiry-consent" checked={consent} onChange={setConsent} error={errors.consent} />
    <p className="submission-note">Submissions are stored for Kiran Automation to review. Email acknowledgement is not configured.</p>
    <button className="button button-red" type="submit" disabled={busy}>{busy ? "Submitting…" : "Submit enquiry"}</button>
  </form>;
}

export function CareerForm() {
  const [values, setValues] = useState({ name: "", email: "", address: "", mobile: "", experienceArea: "", website: "" });
  const [resume, setResume] = useState<File | null>(null);
  const [consent, setConsent] = useState(false);
  const [ready, setReady] = useState<boolean | null>(null);
  const [busy, setBusy] = useState(false);
  const [notice, setNotice] = useState("");
  const [noticeKind, setNoticeKind] = useState<"error" | "success" | null>(null);
  const [errors, setErrors] = useState<FieldErrors>({});
  useEffect(() => { let active = true; fetch("/api/public/form-status", { credentials: "same-origin" }).then((r) => { if (!r.ok) throw new Error(); return r.json(); }).then((data) => { if (active) setReady(data.careerUploadsReady === true); }).catch(() => { if (active) setReady(false); }); return () => { active = false; }; }, []);
  const set = (key: keyof typeof values, value: string) => setValues((v) => ({ ...v, [key]: value }));
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); if (busy || ready !== true) return;
    setNotice(""); setNoticeKind(null); setErrors({}); const validation: FieldErrors = {};
    for (const key of ["name", "email", "address", "mobile", "experienceArea"] as const) if (!values[key].trim()) validation[key] = "This field is required.";
    if (values.email && !/^\S+@\S+\.\S+$/.test(values.email)) validation.email = "Enter a valid email address.";
    if (!resume) validation.resume = "Choose a resume file.";
    else if (!/\.(pdf|doc|docx)$/i.test(resume.name) || resume.size > MAX_RESUME_BYTES) validation.resume = "Choose a PDF, DOC or DOCX file no larger than 5 MiB.";
    if (!consent) validation.consent = "Please review the privacy notice and confirm consent to submit.";
    if (Object.keys(validation).length) { setErrors(validation); setNoticeKind("error"); setNotice("Please correct the highlighted fields."); return; }
    const data = new FormData();
    data.append("name", values.name.trim()); data.append("email", values.email.trim()); data.append("address", values.address.trim()); data.append("mobile", values.mobile.trim()); data.append("experienceArea", values.experienceArea); data.append("consent", "true"); data.append("resume", resume!); data.append("website", values.website);
    setBusy(true);
    try { const response = await fetch("/api/public/careers", { method: "POST", credentials: "same-origin", body: data });
      if (!response.ok) { const problem = await apiError(response); setErrors(problem.fields); setNoticeKind("error"); setNotice(problem.message); return; }
      setValues({ name: "", email: "", address: "", mobile: "", experienceArea: "", website: "" }); setResume(null); setConsent(false);
      const fileInput = document.getElementById("career-resume") as HTMLInputElement | null; if (fileInput) fileInput.value = "";
      setNoticeKind("success");
      setNotice("Your application has been stored. Email acknowledgement is not configured, so no confirmation email was sent.");
    } catch { setNoticeKind("error"); setNotice("We could not reach the application service. Please try again later."); }
    finally { setBusy(false); }
  }
  return <form className="intake-form" onSubmit={submit} noValidate aria-busy={busy}>
    {ready === false && <div className="availability-alert" role="status"><strong>Resume storage is not available.</strong> Applications cannot be submitted until private CV storage is configured.</div>}
    {ready === null && <p role="status">Checking private resume-storage availability…</p>}
    <FormFeedback notice={notice} kind={noticeKind} errors={errors} />
    <div className="form-grid"><FormField id="career-name" label="Name" error={errors.name}><input id="career-name" name="name" autoComplete="name" maxLength={120} required value={values.name} onChange={(e) => set("name", e.target.value)} /></FormField>
      <FormField id="career-email" label="Email" error={errors.email}><input id="career-email" name="email" type="email" autoComplete="email" maxLength={254} required value={values.email} onChange={(e) => set("email", e.target.value)} /></FormField>
      <FormField id="career-address" label="Address" error={errors.address}><textarea id="career-address" name="address" autoComplete="street-address" rows={3} maxLength={500} required value={values.address} onChange={(e) => set("address", e.target.value)} /></FormField>
      <FormField id="career-mobile" label="Mobile" error={errors.mobile}><input id="career-mobile" name="mobile" type="tel" autoComplete="tel" maxLength={30} required value={values.mobile} onChange={(e) => set("mobile", e.target.value)} /></FormField>
      <FormField id="career-area" label="Area of experience" error={errors.experienceArea}><select id="career-area" name="experienceArea" required value={values.experienceArea} onChange={(e) => set("experienceArea", e.target.value)}><option value="">Select an area</option>{experienceAreas.map((area) => <option key={area} value={area}>{area}</option>)}</select></FormField>
      <FormField id="career-resume" label="Resume (PDF, DOC or DOCX; maximum 5 MiB)" error={errors.resume} wide><input id="career-resume" name="resume" type="file" accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document" required onChange={(e) => setResume(e.target.files?.[0] ?? null)} /></FormField></div>
    <label className="honeypot" aria-hidden="true">Leave this field empty<input name="website" tabIndex={-1} autoComplete="off" value={values.website} onChange={(e) => set("website", e.target.value)} /></label>
    <Consent id="career-consent" checked={consent} onChange={setConsent} error={errors.consent} />
    <p className="submission-note">Applications are stored for review. Email acknowledgement is not configured.</p>
    <button className="button button-red" type="submit" disabled={busy || ready !== true}>{busy ? "Submitting…" : ready === true ? "Submit application" : "Application unavailable"}</button>
  </form>;
}

function FormField({ id, label, error, wide, children }: { id: string; label: string; error?: string; wide?: boolean; children: React.ReactNode }) {
  const field = isValidElement(children) ? cloneElement(children as React.ReactElement<any>, { "aria-invalid": error ? true : undefined, "aria-describedby": error ? `${id}-error` : undefined }) : children;
  return <div className={`form-field${wide ? " form-field-wide" : ""}`}><label htmlFor={id}>{label}<span aria-hidden="true"> *</span></label>{field}{error && <span className="field-error" id={`${id}-error`}>{error}</span>}</div>;
}
function Consent({ id, checked, onChange, error }: { id: string; checked: boolean; onChange: (checked: boolean) => void; error?: string }) {
  return <div className="consent-block"><div className="consent-label"><input id={id} type="checkbox" checked={checked} onChange={(e) => onChange(e.target.checked)} aria-labelledby={`${id}-label`} aria-invalid={error ? true : undefined} aria-describedby={error ? `${id}-error` : undefined} /><span id={`${id}-label`}>I have read the <Link to="/privacy">privacy notice</Link> and consent to submit these details for review.</span></div>{error && <p className="field-error" id={`${id}-error`}>{error}</p>}</div>;
}
function FormFeedback({ notice, kind, errors }: { notice: string; kind: "error" | "success" | null; errors: FieldErrors }) {
  const fields = Object.entries(errors).filter(([key]) => key !== "consent");
  const isError = kind === "error";
  return <div className="form-feedback" aria-live={isError ? "assertive" : "polite"} aria-atomic="true">{notice && <div className={isError ? "error-summary" : kind === "success" ? "success-summary" : ""} role={isError ? "alert" : "status"}><strong>{isError ? "There is a problem" : kind === "success" ? "Submission status" : "Request status"}</strong><p>{notice}</p>{fields.length > 0 && <ul>{fields.map(([field, message]) => <li key={field}>{field}: {message}</li>)}</ul>}</div>}</div>;
}

export function PrivacyPage() {
  return <><Breadcrumbs items={[{ label: "Privacy" }]} /><PageIntro eyebrow="Privacy" title="Privacy notice" description="Draft — owner review required before production" /><section className="section privacy-section"><div className="container privacy-copy"><div className="draft-banner" role="note"><strong>Draft — owner review required before production</strong><p>This notice is a plain-language draft for this fresh-lead demo. It is not a legal determination.</p></div><h2>Information submitted</h2><p>The enquiry form collects your name, email, mobile number, subject and message. The careers form collects your name, email, address, mobile number, selected area of experience and an uploaded resume. Product context may be attached to a product enquiry.</p><h2>Why the information is used</h2><p>Submissions are stored so Kiran Automation staff can review and respond to the enquiry or application. Email acknowledgements are not configured; submitting a form does not send a confirmation email.</p><h2>Access, storage and choices</h2><p>Lead records are intended to be available only to authorized administrators. Resume files are intended to use private storage and authorized download access. The owner must review the actual storage, retention, access/deletion process, contact identity and applicable legal language before production. For a privacy request, contact <a href={`mailto:${company.email}`}>{company.email}</a> while the owner confirms the appropriate process.</p><h2>Security and updates</h2><p>Do not submit information that is not needed for the application or enquiry. This draft may change after owner review.</p></div></section></>;
}

export function RegisterCompatibilityPage() { return <><Breadcrumbs items={[{ label: "Registration" }]} /><PageIntro eyebrow="Account access" title="Customer registration is not available." description="This fresh-lead demo does not include public customer accounts or registration." /><section className="section compatibility-section"><div className="container compatibility-card"><p>To contact Kiran Automation about a product, application or business request, use the enquiry form.</p><Link className="button button-red" to="/enquiry">Make an enquiry <ArrowRight size={16} /></Link></div></section></>; }
export function LoginCompatibilityPage() { return <><Breadcrumbs items={[{ label: "Sign-in" }]} /><PageIntro eyebrow="Account access" title="This sign-in is for staff only." description="Customer accounts are not part of this fresh-lead demo." /><section className="section compatibility-section"><div className="container compatibility-card"><p>Authorized Kiran Automation administrators can continue to the private staff sign-in. Customers can submit a business enquiry without creating an account.</p><Link className="button button-red" to="/admin/login">Staff sign-in <ArrowRight size={16} /></Link><p><Link to="/enquiry" className="text-link">Submit an enquiry</Link></p></div></section></>; }
export function ForgotCompatibilityPage() { return <><Breadcrumbs items={[{ label: "Password recovery" }]} /><PageIntro eyebrow="Staff account recovery" title="Email password reset is unavailable." description="Email service is not configured, so password-reset messages cannot be sent." /><section className="section compatibility-section"><div className="container compatibility-card"><p>For administrator recovery, use the owner-approved private recovery/bootstrap process configured for the deployment. Do not share recovery secrets in this site or by email.</p><Link to="/admin/login" className="text-link">Return to staff sign-in <ArrowRight size={16} /></Link></div></section></>; }

export function AdminLoginPage() {
  const [, navigate] = useLocation(); const [email, setEmail] = useState(""); const [password, setPassword] = useState(""); const [busy, setBusy] = useState(false); const [error, setError] = useState("");
  async function submit(event: FormEvent<HTMLFormElement>) { event.preventDefault(); if (busy) return; setBusy(true); setError(""); try { const response = await fetch("/api/admin/login", { method: "POST", headers: { "Content-Type": "application/json" }, credentials: "same-origin", body: JSON.stringify({ email: email.trim(), password }) }); if (!response.ok) { const problem = await apiError(response); setError(problem.message); return; } setPassword(""); navigate("/admin"); } catch { setError("Unable to reach staff sign-in. Please try again."); } finally { setBusy(false); } }
  return <><Breadcrumbs items={[{ label: "Staff sign-in" }]} /><PageIntro eyebrow="Private administrator access" title="Staff sign-in" description="Administrator access only. There is no customer account or public registration." /><section className="section admin-login-section"><div className="container admin-login-card"><div className="admin-icon"><LockKeyhole aria-hidden="true" /></div><h2>Sign in to lead management</h2>{error && <div className="error-summary" role="alert" aria-live="polite">{error}</div>}<form className="intake-form" onSubmit={submit}><FormField id="admin-email" label="Administrator email"><input id="admin-email" type="email" autoComplete="username" required value={email} onChange={(e) => setEmail(e.target.value)} /></FormField><FormField id="admin-password" label="Password"><input id="admin-password" type="password" autoComplete="current-password" required value={password} onChange={(e) => setPassword(e.target.value)} /></FormField><button className="button button-red" type="submit" disabled={busy}>{busy ? "Signing in…" : "Sign in"}</button></form><Link to="/forgot" className="text-link">Forgot password? <ArrowRight size={15} /></Link></div></section></>;
}

type Lead = Record<string, any>;
function recordLabel(record: Lead, key: string) { const value = record[key]; if (value === null || value === undefined || typeof value === "object") return ""; return String(value); }
function safeEntries(record: Lead) { const hidden = /password|resume|cv|file|url|token|secret|cookie/i; return Object.entries(record).filter(([key, value]) => !hidden.test(key) && (typeof value === "string" || typeof value === "number" || typeof value === "boolean")); }

export function AdminDashboardPage() {
  const [, navigate] = useLocation(); const [auth, setAuth] = useState<"checking" | "yes" | "no">("checking"); const [adminName, setAdminName] = useState(""); const [kind, setKind] = useState<"enquiry" | "career">("enquiry"); const [status, setStatus] = useState(""); const [page, setPage] = useState(1); const [items, setItems] = useState<Lead[]>([]); const [totalPages, setTotalPages] = useState(1); const [selected, setSelected] = useState<Lead | null>(null); const [busy, setBusy] = useState(false); const [message, setMessage] = useState(""); const [currentPassword, setCurrentPassword] = useState(""); const [newPassword, setNewPassword] = useState(""); const [changingPassword, setChangingPassword] = useState(false);
  useEffect(() => { let active = true; fetch("/api/admin/session", { credentials: "same-origin" }).then((r) => { if (!r.ok) throw new Error(); return r.json(); }).then((d) => { if (!active) return; const allowed = d.authenticated === true || d.isAuthenticated === true || d.session?.authenticated === true || (d.ok === true && typeof d.admin?.email === "string"); setAuth(allowed ? "yes" : "no"); setAdminName(d.admin?.email ?? d.email ?? ""); }).catch(() => { if (active) setAuth("no"); }); return () => { active = false; }; }, []);
  async function loadLeads() { setBusy(true); setMessage(""); setSelected(null); try { const query = new URLSearchParams({ kind, page: String(page) }); if (status) query.set("status", status); const response = await fetch(`/api/admin/leads?${query}`, { credentials: "same-origin" }); if (response.status === 401) { setAuth("no"); return; } if (!response.ok) throw new Error((await apiError(response)).message); const data = await response.json(); setItems(Array.isArray(data) ? data : data.items ?? data.leads ?? []); setTotalPages(Math.max(1, Number(data.totalPages ?? data.pagination?.totalPages ?? data.pagination?.pages ?? 1))); } catch (e) { setMessage(e instanceof Error ? e.message : "Could not load leads."); setItems([]); } finally { setBusy(false); } }
  useEffect(() => { if (auth === "yes") void loadLeads(); }, [auth, kind, status, page]);
  async function openDetail(id: string) { setMessage(""); try { const response = await fetch(`/api/admin/leads/${kind}/${encodeURIComponent(id)}`, { credentials: "same-origin" }); if (response.status === 401) { setAuth("no"); return; } if (!response.ok) throw new Error((await apiError(response)).message); const data = await response.json(); setSelected(data.lead ?? data); } catch (e) { setMessage(e instanceof Error ? e.message : "Could not load lead details."); } }
  async function updateStatus(id: string, value: string) { setMessage(""); try { const response = await fetch(`/api/admin/leads/${kind}/${encodeURIComponent(id)}/status`, { method: "PATCH", headers: { "Content-Type": "application/json" }, credentials: "same-origin", body: JSON.stringify({ status: value }) }); if (!response.ok) throw new Error((await apiError(response)).message); setMessage("Lead status updated."); await loadLeads(); if (selected) await openDetail(id); } catch (e) { setMessage(e instanceof Error ? e.message : "Status update failed."); } }
  async function logout() { try { await fetch("/api/admin/logout", { method: "POST", credentials: "same-origin" }); } finally { setAuth("no"); setSelected(null); navigate("/admin/login"); } }
  async function changePassword(event: FormEvent<HTMLFormElement>) { event.preventDefault(); if (changingPassword) return; setChangingPassword(true); setMessage(""); try { const response = await fetch("/api/admin/password", { method: "POST", headers: { "Content-Type": "application/json" }, credentials: "same-origin", body: JSON.stringify({ currentPassword, newPassword }) }); if (!response.ok) throw new Error((await apiError(response)).message); setCurrentPassword(""); setNewPassword(""); setAuth("no"); navigate("/admin/login"); } catch (e) { setMessage(e instanceof Error ? e.message : "Password change failed."); } finally { setChangingPassword(false); } }
  async function downloadResume(id: string) { setMessage(""); try { const response = await fetch(`/api/admin/careers/${encodeURIComponent(id)}/resume`, { credentials: "same-origin" }); if (!response.ok) throw new Error((await apiError(response)).message); const data = await response.json(); if (typeof data.url !== "string" || !data.url.startsWith("https://")) throw new Error("The authorized resume link was not available."); const anchor = document.createElement("a"); anchor.href = data.url; anchor.target = "_blank"; anchor.rel = "noopener noreferrer"; anchor.click(); } catch (e) { setMessage(e instanceof Error ? e.message : "Resume download failed."); } }
  if (auth === "checking") return <section className="section admin-shell container"><p role="status">Checking administrator session…</p></section>;
  if (auth !== "yes") return <section className="section admin-shell container"><SectionLabel>Staff access</SectionLabel><h1>Administrator sign-in required.</h1><p>Lead records and resumes are available only to an authenticated administrator.</p><Link className="button button-red" to="/admin/login">Staff sign-in</Link></section>;
  return <><section className="section admin-shell container"><div className="admin-heading"><div><SectionLabel>Private lead management</SectionLabel><h1>Lead dashboard</h1>{adminName && <p>Signed in as {adminName}</p>}</div><button className="button button-dark" onClick={logout}>Sign out</button></div><div className="email-status" role="status"><strong>Email not configured—submissions are stored, notifications are not sent.</strong></div>{message && <p className="admin-message" role="status">{message}</p>}
    <div className="admin-toolbar"><label>Lead type<select value={kind} onChange={(e) => { setKind(e.target.value as "enquiry" | "career"); setPage(1); }}><option value="enquiry">Enquiries</option><option value="career">Careers</option></select></label><label>Status<select value={status} onChange={(e) => { setStatus(e.target.value); setPage(1); }}><option value="">All statuses</option><option value="new">New</option><option value="reviewing">Reviewing</option><option value="contacted">Contacted</option><option value="closed">Closed</option></select></label><a className="button button-dark" href="/api/admin/export.csv" download>Export CSV <Download size={15} /></a><button type="button" className="button button-outline" onClick={() => void loadLeads()} disabled={busy}><RefreshCw size={15} /> Refresh</button></div>
    <div className="admin-table-wrap"><table className="admin-table"><caption className="sr-only">{kind} leads</caption><thead><tr><th scope="col">Name</th><th scope="col">Email</th><th scope="col">Subject / area</th><th scope="col">Status</th><th scope="col">Details</th></tr></thead><tbody>{items.map((item, index) => { const id = String(item.id ?? item.leadId ?? index); return <tr key={id}><td>{recordLabel(item, "name") || "—"}</td><td>{recordLabel(item, "email") || "—"}</td><td>{recordLabel(item, "subject") || recordLabel(item, "experienceArea") || "—"}</td><td><select aria-label={`Status for lead ${id}`} value={recordLabel(item, "status") || "new"} onChange={(e) => void updateStatus(id, e.target.value)}><option value="new">New</option><option value="reviewing">Reviewing</option><option value="contacted">Contacted</option><option value="closed">Closed</option></select></td><td><button type="button" className="text-link" onClick={() => void openDetail(id)}>View</button></td></tr>; })}{!items.length && <tr><td colSpan={5}>{busy ? "Loading leads…" : "No leads found."}</td></tr>}</tbody></table></div>
    <div className="pagination-controls"><button className="button button-outline" type="button" disabled={page <= 1 || busy} onClick={() => setPage((p) => Math.max(1, p - 1))}>Previous</button><span>Page {page} of {totalPages}</span><button className="button button-outline" type="button" disabled={page >= totalPages || busy} onClick={() => setPage((p) => p + 1)}>Next</button></div>
    {selected && <section className="lead-detail" aria-labelledby="lead-detail-title"><div className="admin-heading"><h2 id="lead-detail-title">Lead details</h2><button type="button" className="button button-outline" onClick={() => setSelected(null)}>Close</button></div><dl>{safeEntries(selected).map(([key, value]) => <div key={key}><dt>{key.replace(/([A-Z])/g, " $1")}</dt><dd>{String(value)}</dd></div>)}</dl>{kind === "career" && <button className="button button-red" type="button" onClick={() => void downloadResume(String(selected.id ?? selected.leadId ?? ""))}>Download resume (authorized) <Download size={15} /></button>}</section>}
    <details className="password-change"><summary>Change administrator password</summary><form className="intake-form" onSubmit={changePassword}><FormField id="current-password" label="Current password"><input id="current-password" type="password" autoComplete="current-password" required value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} /></FormField><FormField id="new-password" label="New password"><input id="new-password" type="password" autoComplete="new-password" minLength={12} required value={newPassword} onChange={(e) => setNewPassword(e.target.value)} /></FormField><button className="button button-red" disabled={changingPassword}>{changingPassword ? "Updating…" : "Change password"}</button></form></details>
  </section></>;
}
