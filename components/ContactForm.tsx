'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { contactSchema, type ContactInput } from '@/lib/validations';
import { submitContact } from '@/app/actions/contact';

export function ContactForm() {
  const [done, setDone] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);
  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm<ContactInput>({
    resolver: zodResolver(contactSchema),
  });

  const onSubmit = async (data: ContactInput) => {
    setServerError(null);
    const res = await submitContact(data);
    if (res.ok) {
      setDone(true);
      reset();
    } else {
      setServerError(res.error);
    }
  };

  if (done) {
    return (
      <div className="contact-success" role="status">
        <strong>Message sent! 🎉</strong>
        <p>Thanks for reaching out — I&apos;ll reply within 24 hours.</p>
        <button type="button" onClick={() => setDone(false)}>Send another</button>
      </div>
    );
  }

  return (
    <form className="contact-form" onSubmit={handleSubmit(onSubmit)} noValidate>
      <div className="cf-row">
        <div className="cf-field">
          <input placeholder="Your name" aria-label="Your name" autoComplete="name" {...register('name')} />
          {errors.name && <span className="cf-err">{errors.name.message}</span>}
        </div>
        <div className="cf-field">
          <input type="email" placeholder="you@email.com" aria-label="Your email" autoComplete="email" {...register('email')} />
          {errors.email && <span className="cf-err">{errors.email.message}</span>}
        </div>
      </div>
      <div className="cf-field">
        <input placeholder="Subject (optional)" aria-label="Subject" {...register('subject')} />
      </div>
      <div className="cf-field">
        <textarea placeholder="Tell me about your project…" aria-label="Message" rows={4} {...register('message')} />
        {errors.message && <span className="cf-err">{errors.message.message}</span>}
      </div>
      {/* Honeypot — hidden from humans, bots fill it */}
      <input type="text" tabIndex={-1} autoComplete="off" aria-hidden="true" className="cf-hp" {...register('website')} />
      {serverError && <p className="cf-err" role="alert">{serverError}</p>}
      <button type="submit" className="btn btn-primary" disabled={isSubmitting} style={{ justifyContent: 'center' }}>
        {isSubmitting ? 'Sending…' : 'Send Message'}
      </button>
    </form>
  );
}
