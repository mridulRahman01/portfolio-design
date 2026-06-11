'use server';

import { headers } from 'next/headers';
import { sb } from '@/lib/db';
import { rateLimit } from '@/lib/rate-limit';
import { contactSchema, type ContactInput } from '@/lib/validations';

export type ContactResult = { ok: true } | { ok: false; error: string };

export async function submitContact(input: ContactInput): Promise<ContactResult> {
  const parsed = contactSchema.safeParse(input);
  if (!parsed.success) {
    return { ok: false, error: parsed.error.issues[0]?.message ?? 'Invalid input' };
  }
  // Honeypot filled → silently accept (don't tip off the bot)
  if (parsed.data.website) return { ok: true };

  const ip = headers().get('x-forwarded-for')?.split(',')[0] ?? 'local';
  if (!rateLimit(`contact:${ip}`, 3, 10 * 60_000)) {
    return { ok: false, error: 'Too many messages — please try again later.' };
  }

  try {
    const { error } = await sb().from('contact_messages').insert({
      name: parsed.data.name,
      email: parsed.data.email,
      subject: parsed.data.subject || null,
      message: parsed.data.message,
    });
    if (error) throw new Error(error.message);
  } catch {
    return { ok: false, error: 'Could not save your message. Please email me directly.' };
  }

  // Optional email notification via Resend (set RESEND_API_KEY + LEAD_NOTIFY_EMAIL)
  if (process.env.RESEND_API_KEY && process.env.LEAD_NOTIFY_EMAIL) {
    try {
      await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          from: 'Portfolio <onboarding@resend.dev>',
          to: [process.env.LEAD_NOTIFY_EMAIL],
          subject: `New lead: ${parsed.data.name}`,
          text: `${parsed.data.name} <${parsed.data.email}>\n${parsed.data.subject ?? ''}\n\n${parsed.data.message}`,
        }),
      });
    } catch {
      // Notification failure must not fail the submission.
    }
  }

  return { ok: true };
}
