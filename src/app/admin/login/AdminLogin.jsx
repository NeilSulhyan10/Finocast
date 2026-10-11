"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createSupabaseBrowserClient } from "@/lib/supabase/browser";

function logAuthDiagnostic(stage, error) {
  if (process.env.NODE_ENV !== "production") {
    console.info("[finocast-admin-login]", {
      stage,
      errorName: error?.name || null,
      errorCode: error?.code || null,
      status: error?.status || null,
    });
  }
}

export default function AdminLogin() {
  const router = useRouter();
  const [email, setEmail] = useState(""); const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false); const [error, setError] = useState("");
  async function submit(event) {
    event.preventDefault(); setBusy(true); setError("");
    let stage = "browser-client";
    try {
      const supabase = createSupabaseBrowserClient();
      stage = "password-authentication";
      const { data: signIn, error: signInError } = await supabase.auth.signInWithPassword({ email, password });
      if (signInError) {
        logAuthDiagnostic(stage, signInError);
        setError(signInError.code === "email_not_confirmed" ? "Supabase Auth has not confirmed this email address yet." : "Password sign-in failed. Check the password and Supabase Auth settings.");
        return;
      }
      if (!signIn.user || !signIn.session) {
        logAuthDiagnostic(stage, { name: "MissingAuthSession", code: "no-session" });
        setError("Supabase accepted the request but did not return an authenticated session.");
        return;
      }

      stage = "browser-session-persistence";
      const { data: persisted, error: sessionError } = await supabase.auth.getSession();
      if (sessionError || !persisted.session) {
        logAuthDiagnostic(stage, sessionError || { name: "MissingPersistedSession", code: "no-session" });
        setError("Sign-in succeeded, but the browser session was not available after sign-in. Check browser cookie and storage settings.");
        return;
      }

      stage = "browser-user-verification";
      const { data: verified, error: userError } = await supabase.auth.getUser();
      if (userError || !verified.user || verified.user.id !== signIn.user.id) {
        logAuthDiagnostic(stage, userError || { name: "UserVerificationFailed", code: "user-mismatch" });
        setError("Sign-in succeeded, but Supabase could not verify the signed-in user.");
        return;
      }

      stage = "server-session-and-admin-membership";
      const response = await fetch("/api/admin/session", { cache: "no-store", credentials: "same-origin" });
      const result = await response.json().catch(() => ({}));
      if (!response.ok || !result.authorized) {
        logAuthDiagnostic(result.stage || stage, { name: "AdminAccessCheckFailed", code: result.stage || response.status, status: response.status });
        if (result.stage === "server-session") setError("Password sign-in succeeded, but the server did not receive or validate the session cookie. Check the Supabase proxy and cookie configuration.");
        else if (result.stage === "membership") setError("You are signed in, but this Auth user is not listed in public.admin_users.");
        else if (result.stage === "membership-query") setError("You are signed in, but the server could not query admin_users. Check the database migration and server Supabase configuration.");
        else setError("You are signed in, but server-side Supabase configuration is incomplete.");
        return;
      }

      router.replace("/admin"); router.refresh();
    } catch (issue) {
      logAuthDiagnostic(stage, issue);
      setError(stage === "browser-client"
        ? "Supabase browser configuration is missing. Check NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY."
        : "The sign-in request could not be completed. Check the development console for the failed authentication stage.");
    } finally { setBusy(false); }
  }
  return <main className="admin-auth-page"><div className="admin-auth-panel"><p className="eyebrow">Finocast · Administration</p><h1>Sign in</h1><p>Use an authorized Finocast administrator account.</p><form onSubmit={submit} className="admin-login-form"><label>Email<input type="email" required autoComplete="username" value={email} onChange={(event) => setEmail(event.target.value)}/></label><label>Password<input type="password" required autoComplete="current-password" value={password} onChange={(event) => setPassword(event.target.value)}/></label>{error && <p role="alert" className="form-error">{error}</p>}<button className="button button-copper" disabled={busy}>{busy ? "Signing in…" : "Sign in"}<span aria-hidden="true">↗</span></button></form></div></main>;
}
