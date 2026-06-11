'use client';

import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Field, inputCls, Btn } from '@/components/admin/ui';

const loginSchema = z.object({
  email: z.string().email('Enter a valid email'),
  password: z.string().min(1, 'Password is required'),
});
type LoginInput = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const router = useRouter();
  const params = useSearchParams();
  const [error, setError] = useState<string | null>(null);
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginInput) => {
    setError(null);
    const res = await signIn('credentials', { ...data, redirect: false });
    if (res?.error) {
      setError(res.error === 'CredentialsSignin' ? 'Invalid email or password' : res.error);
      return;
    }
    router.push(params.get('callbackUrl') ?? '/admin');
    router.refresh();
  };

  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="mb-8 text-center">
          <span className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-2xl border border-[#00F5B8]/30 font-mono text-sm font-bold text-[#00F5B8]">
            AH
          </span>
          <h1 className="text-xl font-extrabold text-white">Portfolio CMS</h1>
          <p className="mt-1 text-sm text-white/40">Sign in to manage your site</p>
        </div>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="space-y-4 rounded-2xl border border-white/8 bg-white/[0.03] p-6 backdrop-blur-md"
        >
          <Field label="Email" error={errors.email?.message}>
            <input className={inputCls} type="email" autoComplete="email" {...register('email')} />
          </Field>
          <Field label="Password" error={errors.password?.message}>
            <input className={inputCls} type="password" autoComplete="current-password" {...register('password')} />
          </Field>
          {error && <p className="text-sm text-red-400">{error}</p>}
          <Btn type="submit" disabled={isSubmitting} className="w-full justify-center">
            {isSubmitting ? 'Signing in…' : 'Sign In'}
          </Btn>
        </form>
      </div>
    </div>
  );
}
