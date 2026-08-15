import { productSchema } from '@/lib/validators';
import {
  fail,
  logActivity,
  ok,
  parseBody,
  requirePermission,
  slugify,
  getPagination,
  withPagination,
  withError,
} from '@/lib/api';
import { prisma } from '@/lib/prisma';

export const GET = withError(async (request) => {
  await requirePermission(request, 'products');

  const { searchParams } = new URL(request.url);
  const { page, limit, skip, sort, order } = getPagination(searchParams);

  const where = {};

  const search = searchParams.get('q');
  if (search) {
    where.OR = [
      { name: { contains: search, mode: 'insensitive' } },
      { sku: { contains: search, mode: 'insensitive' } },
    ];
  }

  const category = searchParams.get('category');
  if (category) where.categoryId = category;

  const brand = searchParams.get('brand');
  if (brand) where.brandId = brand;

  const status = searchParams.get('status');
  if (status) where.status = status;

  const stockFilter = searchParams.get('stock');
  if (stockFilter === 'low') {
    const lowStockIds = await prisma.$queryRaw`
      SELECT id FROM "Product" WHERE stock > 0 AND stock <= "lowStockThreshold"
    `;
    where.id = { in: lowStockIds.map((r) => r.id) };
  }
  if (stockFilter === 'out') where.stock = 0;
  if (stockFilter === 'in') where.stock = { gt: 0 };

  const minPrice = searchParams.get('minPrice');
  const maxPrice = searchParams.get('maxPrice');
  if (minPrice || maxPrice) {
    where.price = {};
    if (minPrice) where.price.gte = Number(minPrice);
    if (maxPrice) where.price.lte = Number(maxPrice);
  }

  const sortMap = {
    createdAt: 'createdAt',
    price: 'price',
    stock: 'stock',
    name: 'name',
  };
  const orderBy = { [sortMap[sort] || 'createdAt']: order };

  const [total, items] = await Promise.all([
    prisma.product.count({ where }),
    prisma.product.findMany({
      where,
      orderBy,
      skip,
      take: limit,
      include: { category: { select: { id: true, name: true, slug: true } }, brand: { select: { id: true, name: true } } },
    }),
  ]);

  return ok(withPagination(total, items, page, limit));
});

export const POST = withError(async (request) => {
  const user = await requirePermission(request, 'products', 'create');
  const data = await parseBody(request, productSchema);

  if (!data.slug) data.slug = slugify(data.name);

  const discountPercentage =
    data.discountPercentage ??
    (data.originalPrice && data.originalPrice > data.price
      ? Math.round((1 - data.price / data.originalPrice) * 100)
      : 0);

  const { variants, ...productData } = data;

  const product = await prisma.product.create({
    data: {
      ...productData,
      price: Number(data.price),
      originalPrice: data.originalPrice != null ? Number(data.originalPrice) : null,
      costPrice: data.costPrice != null ? Number(data.costPrice) : null,
      discountPercentage: discountPercentage != null ? Number(discountPercentage) : null,
      specifications: data.specifications ?? undefined,
      colors: data.colors ?? undefined,
      variants: variants?.length
        ? {
            create: variants.map((v) => ({
              name: v.name,
              sku: v.sku || null,
              price: v.price != null ? Number(v.price) : null,
              stock: v.stock || 0,
              options: v.options ?? undefined,
            })),
          }
        : undefined,
    },
    include: { category: true, brand: true, variants: true },
  });

  if (data.stock > 0) {
    await prisma.inventoryLog.create({
      data: {
        productId: product.id,
        quantity: data.stock,
        type: 'IN',
        reason: 'Initial stock',
        userId: user.id,
      },
    });
  }

  await logActivity({ userId: user.id, action: 'create', module: 'products', targetId: product.id });
  return ok({ product }, 201);
});
