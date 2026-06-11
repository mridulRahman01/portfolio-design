import 'server-only';
import { getServerSession } from 'next-auth';
import { authOptions, type AppRole } from '@/lib/auth';

/** Role capabilities (RBAC):
 *  SUPER_ADMIN — everything, including users, SEO, settings
 *  EDITOR      — all content (blogs, sections, media, leads)
 *  AUTHOR      — blogs and media only
 */
const CAPABILITIES: Record<string, AppRole[]> = {
  'blogs:manage':   ['SUPER_ADMIN', 'EDITOR', 'AUTHOR'],
  'media:manage':   ['SUPER_ADMIN', 'EDITOR', 'AUTHOR'],
  'content:manage': ['SUPER_ADMIN', 'EDITOR'],
  'leads:manage':   ['SUPER_ADMIN', 'EDITOR'],
  'seo:manage':     ['SUPER_ADMIN'],
  'users:manage':   ['SUPER_ADMIN'],
  'activity:view':  ['SUPER_ADMIN', 'EDITOR'],
};

export type Capability = keyof typeof CAPABILITIES;

export async function getSessionUser() {
  const session = await getServerSession(authOptions);
  return session?.user ?? null;
}

export function can(role: AppRole, capability: Capability): boolean {
  return CAPABILITIES[capability]?.includes(role) ?? false;
}

/** Throws if there is no session or the role lacks the capability. */
export async function requireCapability(capability: Capability) {
  const user = await getSessionUser();
  if (!user) throw new Error('Unauthorized');
  if (!can(user.role, capability)) throw new Error('Forbidden');
  return user;
}
