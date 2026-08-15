import { categorySchema } from '@/lib/validators';
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
  const { searchParams } = new URL(request.url);
  const includeProducts = searchParams.get('includeProducts') === '1';

  const categories = await prisma.category.findMany({
    orderBy: [{ sortOrder: 'asc' }, { name: 'asc' }],
    include: {
      parent: { select: { id: true, name: true } },
      _count: includeProducts ? { select: { products: true } } : false,
      children: {
        orderBy: { name: 'asc' },
        include: { _count: includeProducts ? { select: { products: true } } : false },
      },
    },
  });

  return ok({ categories });
});

export const POST = withError(async (request) => {
  const user = await requirePermission(request, 'products', 'create');
  const data = await parseBody(request, categorySchema);
  if (!data.slug) data.slug = slugify(data.name);

  const existing = await prisma.category.findUnique({ where: { slug: data.slug } });
  if (existing) {
    const category = await prisma.category.update({
      where: { slug: data.slug },
      data: {
        name: data.name,
        description: data.description ?? undefined,
        image: data.image ?? undefined,
        icon: data.icon ?? undefined,
        sortOrder: data.sortOrder,
        featured: data.featured,
        parentId: data.parentId ?? null,
      },
    });
    await logActivity({ userId: user.id, action: 'edit', module: 'products', targetId: category.id });
    return ok({ category });
  }

  const category = await prisma.category.create({
    data: {
      name: data.name,
      slug: data.slug,
      description: data.description ?? null,
      image: data.image ?? null,
      icon: data.icon ?? null,
      sortOrder: data.sortOrder,
      featured: data.featured,
      parentId: data.parentId ?? null,
    },
  });

  await logActivity({ userId: user.id, action: 'create', module: 'products', targetId: category.id });
  return ok({ category }, 201);
});

export const PATCH = withError(async (request) => {
  const user = await requirePermission(request, 'products', 'edit');
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');
  if (!id) return notFound();

  const data = await parseBody(request, categorySchema);
  const category = await prisma.category.update({
    where: { id },
    data: {
      name: data.name,
      slug: data.slug ? slugify(data.slug) : undefined,
      description: data.description ?? undefined,
      image: data.image ?? undefined,
      icon: data.icon ?? undefined,
      sortOrder: data.sortOrder,
      featured: data.featured,
      parentId: data.parentId ?? null,
    },
  });

  await logActivity({ userId: user.id, action: 'edit', module: 'products', targetId: id });
  return ok({ category });
});

export const DELETE = withError(async (request) => {
  const user = await requirePermission(request, 'products', 'delete');
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');
  if (!id) return notFound();

  const hasChildren = await prisma.category.count({ where: { parentId: id } });
  if (hasChildren > 0) {
    return ok({ message: 'Category has subcategories; cannot delete', hasChildren: true }, 400);
  }

  await prisma.category.delete({ where: { id } });
  await logActivity({ userId: user.id, action: 'delete', module: 'products', targetId: id });
  return ok({ message: 'Category deleted' });
});
