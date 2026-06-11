import { withAuth } from 'next-auth/middleware';

/**
 * Protects every /admin route (and admin APIs) at the edge.
 * Fine-grained RBAC happens server-side in lib/rbac.ts — this layer only
 * guarantees an authenticated session exists.
 */
export default withAuth({
  pages: { signIn: '/admin/login' },
  callbacks: {
    authorized: ({ req, token }) => {
      if (req.nextUrl.pathname.startsWith('/admin/login')) return true;
      return !!token;
    },
  },
});

export const config = {
  matcher: ['/admin/:path*', '/api/admin/:path*'],
};
