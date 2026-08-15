import { brandSchema } from '@/lib/validators';
import {
  logActivity,
  notFound,
  ok,
  parseBody,
  requirePermission,
  slugify,
  withError,
} from '@/lib/api';
import { prisma } from '@/lib/prisma';

export const GET = withError(async (request) => {
  await requirePermission(request, 'products');
  const brands = await prisma.brand.findMany({
    orderBy: { name: 'asc' },
    include: { _count: { select: { products: true } } },
  });
  return ok({ brands });
});

export const POST = withError(async (request) => {
  const user = await requirePermission(request, 'products', 'create');
  const data = await parseBody(request, brandSchema);
  if (!data.slug) data.slug = slugify(data.name);

  const brand = await prisma.brand.create({
    data: {
      name: data.name,
      slug: data.slug,
      description: data.description ?? null,
      image: data.image ?? null,
    },
  });

  await logActivity({ userId: user.id, action: 'create', module: 'products', targetId: brand.id });
  return ok({ brand }, 201);
});

export const PATCH = withError(async (request) => {
  const user = await requirePermission(request, 'products', 'edit');
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');
  if (!id) return notFound();

  const data = await parseBody(request, brandSchema);
  const brand = await prisma.brand.update({
    where: { id },
    data: {
      name: data.name,
      slug: data.slug ? slugify(data.slug) : undefined,
      description: data.description ?? undefined,
      image: data.image ?? undefined,
    },
  });

  await logActivity({ userId: user.id, action: 'edit', module: 'products', targetId: id });
  return ok({ brand });
});

export const DELETE = withError(async (request) => {
  const user = await requirePermission(request, 'products', 'delete');
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');
  if (!id) return notFound();

  await prisma.brand.delete({ where: { id } });
  await logActivity({ userId: user.id, action: 'delete', module: 'products', targetId: id });
  return ok({ message: 'Brand deleted' });
});
