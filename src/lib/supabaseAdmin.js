import { createClient } from '@supabase/supabase-js';

// Server-only. The secret key bypasses RLS — never import this from a
// client component or anything in the browser bundle.
if (typeof window !== 'undefined') {
  throw new Error('lib/supabaseAdmin.js must only be used on the server');
}

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseSecretKey = process.env.SUPABASE_SECRET_KEY;

if (!supabaseUrl || !supabaseSecretKey) {
  throw new Error('Missing SUPABASE_URL or SUPABASE_SECRET_KEY');
}

export const supabaseAdmin = createClient(supabaseUrl, supabaseSecretKey, {
  auth: {
    persistSession: false,
    autoRefreshToken: false,
  },
});
