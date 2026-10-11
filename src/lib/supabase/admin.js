import { createSupabaseServerClient, createSupabaseServiceClient } from "@/lib/supabase/server";

function diagnostic(stage, errorCode) {
  if (process.env.NODE_ENV !== "production") {
    console.info("[finocast-admin-auth]", { stage, errorCode: errorCode || null });
  }
}

export async function getAdminContext() {
  let sessionClient;
  let serviceClient;
  try {
    sessionClient = await createSupabaseServerClient();
    serviceClient = createSupabaseServiceClient();
  } catch (error) {
    if (process.env.NODE_ENV !== "production") {
      console.info("[finocast-admin-auth]", {
        stage: "server-configuration",
        errorName: error?.name || "configuration_error",
        hasProjectUrl: Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL),
        hasPublishableKey: Boolean(process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY),
        hasServiceRoleKey: Boolean(process.env.SUPABASE_SERVICE_ROLE_KEY),
      });
    }
    return { authorized: false, configured: false, reason: "server-config-missing" };
  }

  const { data: { user }, error: authError } = await sessionClient.auth.getUser();
  if (authError) {
    diagnostic("server-get-user", authError.code || authError.name);
    return { authorized: false, configured: true, reason: "server-session-error" };
  }
  if (!user) {
    diagnostic("server-session", "no-user");
    return { authorized: false, configured: true, reason: "no-session" };
  }

  const { data: membership, error: membershipError } = await serviceClient
    .from("admin_users")
    .select("user_id")
    .eq("user_id", user.id)
    .maybeSingle();

  if (membershipError) {
    diagnostic("admin-membership-query", membershipError.code || membershipError.name);
    return { authorized: false, configured: true, reason: "membership-query-error" };
  }
  if (!membership) {
    diagnostic("admin-membership", "membership-not-found");
    return { authorized: false, configured: true, reason: "membership-not-found" };
  }
  return { authorized: true, configured: true, user, supabase: serviceClient };
}
