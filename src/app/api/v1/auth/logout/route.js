import { cookies } from 'next/headers';
import { ok, withError } from '@/lib/api';

export const POST = withError(async () => {
  const cookieStore = await cookies();
  cookieStore.delete('carezoon_access');
  cookieStore.delete('carezoon_refresh');
  return ok({ message: 'Logged out' });
});
