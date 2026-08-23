import { PrismaClient } from '../src/generated/prisma/client.ts';
import { PrismaPg } from '@prisma/adapter-pg';
import { createClient } from '@supabase/supabase-js';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

function loadJson(rel) {
  return JSON.parse(fs.readFileSync(path.join(__dirname, '..', rel), 'utf-8'));
}

async function main() {
  console.log('Seeding database...');

  const categories = loadJson('src/data/categories.json');
  const brands = loadJson('src/data/brands.json');
  const products = loadJson('src/data/products.json');

  const adminEmail = process.env.SEED_ADMIN_EMAIL || 'admin@carezoon.com';
  const adminPassword = process.env.SEED_ADMIN_PASSWORD || 'admin123';

  // Credentials live in Supabase Auth; Prisma only stores the profile.
  const supabaseAdmin = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_SECRET_KEY,
    { auth: { persistSession: false, autoRefreshToken: false } }
  );

  const existingAdmin = await prisma.user.findUnique({ where: { email: adminEmail } });
  if (!existingAdmin) {
    const { data, error } = await supabaseAdmin.auth.admin.createUser({
      email: adminEmail,
      password: adminPassword,
      user_metadata: { name: 'Store Administrator' },
      email_confirm: true,
    });
    if (error || !data?.user) {
      throw new Error(`Failed to create Supabase auth user: ${error?.message}`);
    }

    await prisma.user.create({
      data: {
        id: data.user.id,
        name: 'Store Administrator',
        email: adminEmail,
        role: 'ADMIN',
      },
    });
    console.log(`Created admin user: ${adminEmail} / ${adminPassword}`);
  }

  const brandMap = {};
  for (const b of brands) {
    const created = await prisma.brand.upsert({
      where: { slug: b.slug || b.name.toLowerCase().replace(/\s+/g, '-') },
      update: { name: b.name, description: b.category || null },
      create: {
        name: b.name,
        slug: b.slug || b.name.toLowerCase().replace(/\s+/g, '-'),
        description: b.category || null,
      },
    });
    brandMap[b.name.toLowerCase()] = created;
  }

  const categoryMap = {};
  for (const c of categories) {
    const created = await prisma.category.upsert({
      where: { slug: c.slug },
      update: { name: c.name, description: c.description, image: c.image, icon: c.icon, featured: c.featured },
      create: {
        name: c.name,
        slug: c.slug,
        description: c.description,
        image: c.image,
        icon: c.icon,
        featured: c.featured,
      },
    });
    categoryMap[c.slug] = created;
  }

  for (const p of products) {
    const category = categoryMap[p.category];
    const brand = brandMap[p.brand?.toLowerCase()];

    const existing = await prisma.product.findUnique({ where: { slug: p.slug } });
    if (existing) continue;

    const price = Number(p.price);
    const originalPrice = p.originalPrice != null ? Number(p.originalPrice) : price;
    const discountPercentage =
      p.discountPercentage != null
        ? Number(p.discountPercentage)
        : originalPrice > price
          ? Math.round((1 - price / originalPrice) * 100)
          : 0;

    const createdProduct = await prisma.product.create({
      data: {
        name: p.name,
        slug: p.slug,
        sku: p.sku || `SKU-${p.id}`,
        shortDescription: p.shortDescription || null,
        description: p.description || null,
        price,
        originalPrice,
        costPrice: Math.round(price * 0.6 * 100) / 100,
        discountPercentage,
        stock: p.stock ?? 0,
        lowStockThreshold: 5,
        status: 'ACTIVE',
        images: p.images || [p.image],
        features: p.features || [],
        specifications: p.specifications || null,
        colors: p.colors || [],
        sizes: p.sizes || [],
        tags: [],
        isNew: p.isNew || false,
        isBestSeller: p.isBestSeller || false,
        isFeatured: p.isFeatured || false,
        isFlashDeal: p.isFlashDeal || false,
        claimedPercentage: p.claimedPercentage || 0,
        rating: p.rating != null ? Number(p.rating) : 0,
        reviewCount: p.reviewCount || 0,
        categoryId: category?.id || null,
        brandId: brand?.id || null,
      },
    });

    for (const [ci, color] of (p.colors || []).entries()) {
      const sizeLabel = p.sizes?.length ? p.sizes.join(' / ') : 'Standard';
      await prisma.productVariant.create({
        data: {
          productId: createdProduct.id,
          name: `${color.name} — ${sizeLabel}`,
          sku: `${p.sku}-${ci + 1}`,
          price,
          stock: p.stock ?? 0,
          options: { color: color.name, size: sizeLabel },
        },
      });
    }
  }

  const settings = [
    {
      key: 'store',
      group: 'general',
      value: {
        name: 'CareZoon',
        tagline: 'Premium Modern E-Commerce Store',
        logo: '',
        currency: 'USD',
        timezone: 'UTC',
        email: 'support@carezoon.com',
      },
    },
    {
      key: 'payments',
      group: 'payments',
      value: {
        stripe: { enabled: false, publishableKey: '', secretKey: '' },
        paypal: { enabled: false, clientId: '', secret: '' },
        cod: { enabled: true },
      },
    },
    {
      key: 'shipping',
      group: 'shipping',
      value: {
        freeShippingThreshold: 99,
        flatRate: 4.99,
        zones: [],
      },
    },
    {
      key: 'tax',
      group: 'tax',
      value: { defaultRate: 0 },
    },
  ];

  for (const s of settings) {
    await prisma.setting.upsert({
      where: { key: s.key },
      update: { value: s.value, group: s.group },
      create: s,
    });
  }

  console.log('Seed complete.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
