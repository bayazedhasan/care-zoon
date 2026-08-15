import { settingsSchema } from '@/lib/validators';
import {
  logActivity,
  notFound,
  ok,
  parseBody,
  requirePermission,
  withError,
} from '@/lib/api';
import { prisma } from '@/lib/prisma';

export const GET = withError(async (request) => {
  await requirePermission(request, 'settings');
  const { searchParams } = new URL(request.url);
  const group = searchParams.get('group');

  const where = group ? { group } : {};
  const settings = await prisma.setting.findMany({ where, orderBy: { group: 'asc' } });

  return ok({ settings });
});

export const POST = withError(async (request) => {
  const user = await requirePermission(request, 'settings', 'edit');
  const data = await parseBody(request, settingsSchema);

  const setting = await prisma.setting.upsert({
    where: { key: data.key },
    update: { value: data.value, group: data.group || 'general' },
    create: { key: data.key, value: data.value, group: data.group || 'general' },
  });

  await logActivity({ userId: user.id, action: 'edit', module: 'settings', targetId: data.key });
  return ok({ setting });
});

export const PATCH = withError(async (request) => {
  const user = await requirePermission(request, 'settings', 'edit');
  const { searchParams } = new URL(request.url);
  const key = searchParams.get('key');
  if (!key) return notFound();

  const data = await parseBody(request, settingsSchema);
  const setting = await prisma.setting.upsert({
    where: { key },
    update: { value: data.value, group: data.group || undefined },
    create: { key, value: data.value, group: data.group || 'general' },
  });

  await logActivity({ userId: user.id, action: 'edit', module: 'settings', targetId: key });
  return ok({ setting });
});
