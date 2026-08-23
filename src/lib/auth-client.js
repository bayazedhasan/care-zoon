import { supabase } from './supabaseClient';
import { ApiError, apiFetch } from './admin-api';

// Signs up with Supabase Auth, then creates the matching Prisma User row
// (role, activityLogs, etc. live there) via /api/v1/auth/sync.
export async function signUp({ email, password, name, role }) {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: { data: { name, role } },
  });

  if (error) throw new ApiError(error.message, error.status || 400);
  if (!data.user) throw new ApiError('Signup failed — no user returned', 400);

  // Sync the auth user into our Prisma User table.
  const user = await apiFetch('/auth/sync', {
    method: 'POST',
    body: JSON.stringify({ name, role }),
  });

  return { authUser: data.user, user };
}

export async function login({ email, password }) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) throw new ApiError(error.message, error.status || 401);
  if (!data.user) throw new ApiError('Login failed — no user returned', 401);

  // Make sure a Prisma User row exists (e.g. first login after migration).
  let user;
  try {
    user = await apiFetch('/auth/me');
  } catch {
    user = await apiFetch('/auth/sync', {
      method: 'POST',
      body: JSON.stringify({}),
    });
  }

  return { session: data.session, user };
}

export async function logout() {
  await supabase.auth.signOut();
}
