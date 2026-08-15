import { productSchema } from '@/lib/validators';
import {
  fail,
  logActivity,
  notFound,
  ok,
  parseBody,
  requirePermission,
  slugify,
  withError,
} from '@/lib/api';
import { prisma } from '@/lib/prisma';

async function findProduct(id) {
  return prisma.product.findUnique({
    where: { id },
    include: { category: true, brand: true, variants: true, reviews: { orderBy: { createdAt: 'desc' }, take: 20 } },
  });
}

export const GET = withError(async (request, { params }) => {
  await requirePermission(request, 'products');
  const { id } = await params;
  const product = await findProduct(id);
  if (!product) return notFound('Product not found');
  return ok({ product });
});

export const PATCH = withError(async (request, { params }) => {
  const user = await requirePermission(request, 'products', 'edit');
  const { id } = await params;
  const existing = await prisma.product.findUnique({ where: { id } });
  if (!existing) return notFound('Product not found');

  const data = await parseBody(request, productSchema);
  if (data.slug && data.slug !== existing.slug) {
    data.slug = slugify(data.slug);
  }

  const { variants, ...productData } = data;

  const stockChanged = Number(data.stock) !== existing.stock;

  const product = await prisma.$transaction(async (tx) => {
    const updated = await tx.product.update({
      where: { id },
      data: {
        ...productData,
        price: Number(data.price),
        originalPrice: data.originalPrice != null ? Number(data.originalPrice) : null,
        costPrice: data.costPrice != null ? Number(data.costPrice) : null,
        discountPercentage: data.discountPercentage != null ? Number(data.discountPercentage) : null,
        specifications: data.specifications ?? undefined,
        colors: data.colors ?? undefined,
      },
      include: { variants: true },
    });

    const incomingIds = variants.filter((v) => v.id).map((v) => v.id);
    for (const oldVariant of updated.variants) {
      if (!incomingIds.includes(oldVariant.id)) {
        await tx.productVariant.delete({ where: { id: oldVariant.id } });
      }
    }

    for (const v of variants) {
      const dataVariant = {
        name: v.name,
        sku: v.sku || null,
        price: v.price != null ? Number(v.price) : null,
        stock: v.stock || 0,
        options: v.options ?? undefined,
      };
      if (v.id) {
        await tx.productVariant.update({ where: { id: v.id }, data: dataVariant });
      } else {
        await tx.productVariant.create({ data: { productId: id, ...dataVariant } });
      }
    }

    if (stockChanged) {
      const diff = Number(data.stock) - existing.stock;
      await tx.inventoryLog.create({
        data: {
          productId: id,
          quantity: diff,
          type: diff > 0 ? 'IN' : 'OUT',
          reason: 'Stock adjusted from product edit',
          userId: user.id,
        },
      });
    }

    return updated;
  });

  await logActivity({ userId: user.id, action: 'edit', module: 'products', targetId: id });

  const fresh = await findProduct(id);
  return ok({ product: fresh });
});

export const DELETE = withError(async (request, { params }) => {
  const user = await requirePermission(request, 'products', 'delete');
  const { id } = await params;
  const existing = await prisma.product.findUnique({ where: { id } });
  if (!existing) return notFound('Product not found');

  await prisma.product.update({ where: { id }, data: { status: 'ARCHIVED' } });
  await logActivity({ userId: user.id, action: 'delete', module: 'products', targetId: id });
  return ok({ message: 'Product archived' });
});
