import type { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { compare } from 'bcryptjs';
import { sb } from '@/lib/db';
import { rateLimit } from '@/lib/rate-limit';
import { logActivity } from '@/lib/activity';

export type AppRole = 'SUPER_ADMIN' | 'EDITOR' | 'AUTHOR';

declare module 'next-auth' {
  interface Session {
    user: { id: string; name: string; email: string; role: AppRole };
  }
  interface User {
    id: string;
    role: AppRole;
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    id: string;
    role: AppRole;
  }
}

export const authOptions: NextAuthOptions = {
  session: { strategy: 'jwt', maxAge: 60 * 60 * 8 }, // 8h sessions
  pages: { signIn: '/admin/login' },
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials, req) {
        const email = credentials?.email?.toLowerCase().trim();
        const password = credentials?.password;
        if (!email || !password) return null;

        // Brute-force protection: 5 attempts / 5 min per email+IP
        const ip = (req?.headers?.['x-forwarded-for'] as string)?.split(',')[0] ?? 'local';
        if (!rateLimit(`login:${email}:${ip}`, 5, 5 * 60_000)) {
          throw new Error('Too many attempts. Try again in a few minutes.');
        }

        const { data: user } = await sb()
          .from('users').select('*').eq('email', email).maybeSingle();
        if (!user || !user.active) return null;
        const valid = await compare(password, user.passwordHash);
        if (!valid) return null;

        await logActivity(user.id, 'auth.login', `Signed in from ${ip}`);
        return { id: user.id, name: user.name, email: user.email, role: user.role };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
      }
      return token;
    },
    async session({ session, token }) {
      session.user.id = token.id;
      session.user.role = token.role;
      return session;
    },
  },
};
