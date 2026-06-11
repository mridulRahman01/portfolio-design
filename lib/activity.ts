import { sb } from '@/lib/db';

/** Fire-and-forget audit logging — never blocks or fails the main operation. */
export async function logActivity(userId: string | null, action: string, detail?: string) {
  try {
    await sb().from('activity_logs').insert({ userId, action, detail: detail ?? null });
  } catch {
    // Audit logging must never take down the request path.
  }
}
