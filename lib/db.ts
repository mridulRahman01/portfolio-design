import 'server-only';
import { createClient, type SupabaseClient } from '@supabase/supabase-js';

/**
 * Server-side Supabase client using the SERVICE ROLE key.
 * All tables have RLS enabled with zero policies, so this key is the only
 * way to read/write — never expose it to the browser.
 */
let client: SupabaseClient | null = null;

export function sb(): SupabaseClient {
  if (client) return client;
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) {
    throw new Error(
      'Supabase is not configured — set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in .env',
    );
  }
  client = createClient(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
  return client;
}

/** Unwraps a supabase-js response that must return data; throws otherwise. */
export function must<T>(res: { data: T; error: { message: string } | null }): NonNullable<T> {
  if (res.error) throw new Error(res.error.message);
  if (res.data == null) throw new Error('Record not found');
  return res.data as NonNullable<T>;
}

/** Throws on error for writes that return no data (insert/delete without .select()). */
export function ok(res: { error: { message: string } | null }): void {
  if (res.error) throw new Error(res.error.message);
}

export const nowIso = () => new Date().toISOString();
