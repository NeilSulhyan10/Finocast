export const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
export const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
export const supabaseBucket = "quote-attachments";

export function hasPublicSupabaseConfig() {
  return Boolean(supabaseUrl && supabaseAnonKey);
}

export function hasAdminSupabaseConfig() {
  return hasPublicSupabaseConfig() && Boolean(process.env.SUPABASE_SERVICE_ROLE_KEY);
}
