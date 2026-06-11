'use server';

import { upsertUser, deleteUser } from '@/app/actions/users';

export async function upsertUserFromForm(id: string | null, data: Record<string, unknown>) {
  await upsertUser(id, {
    name: data.name,
    email: data.email,
    password: data.password || '',
    role: data.role,
    active: Boolean(data.active),
  });
}

export async function deleteUserById(id: string) {
  await deleteUser(id);
}
