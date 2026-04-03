import { createClient, SupabaseClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";

let _supabase: SupabaseClient | null = null;

export const supabase = (() => {
  // Lazy init — only create client when URL is available (runtime, not build time)
  if (!_supabase && supabaseUrl) {
    _supabase = createClient(supabaseUrl, supabaseAnonKey);
  }
  // Return a proxy that guards against build-time access
  return new Proxy({} as SupabaseClient, {
    get(_target, prop) {
      if (!supabaseUrl) {
        // During build/SSG, return no-op functions
        return () => ({ data: null, error: null });
      }
      if (!_supabase) {
        _supabase = createClient(supabaseUrl, supabaseAnonKey);
      }
      return (_supabase as any)[prop];
    },
  });
})();
