import { z } from 'zod';

export const loginSchema = z.object({
  email: z.string().email().max(255),
  password: z.string().min(6).max(128),
});

export const refreshSchema = z.object({
  refreshToken: z.string().optional(),
});

export const registerSchema = z.object({
  name: z.string().min(2).max(100),
  email: z.string().email().max(255),
  password: z.string().min(6).max(128),
});

export const productSchema = z.object({
  name: z.string().min(1).max(255),
  slug: z.string().optional(),
  sku: z.string().min(1).max(64),
  shortDescription: z.string().max(500).optional().nullable(),
  description: z.string().optional().nullable(),
  price: z.coerce.number().positive(),
  originalPrice: z.coerce.number().nonnegative().optional().nullable(),
  costPrice: z.coerce.number().nonnegative().optional().nullable(),
  stock: z.coerce.number().int().nonnegative().default(0),
  lowStockThreshold: z.coerce.number().int().nonnegative().default(5),
  status: z.enum(['ACTIVE', 'DRAFT', 'ARCHIVED']).default('DRAFT'),
  images: z.array(z.string().url()).default([]),
  features: z.array(z.string()).default([]),
  specifications: z.record(z.string(), z.string()).optional().nullable(),
  colors: z.array(z.object({ name: z.string(), hex: z.string() })).default([]),
  sizes: z.array(z.string()).default([]),
  tags: z.array(z.string()).default([]),
  metaTitle: z.string().max(255).optional().nullable(),
  metaDescription: z.string().max(500).optional().nullable(),
  isNew: z.boolean().default(false),
  isBestSeller: z.boolean().default(false),
  isFeatured: z.boolean().default(false),
  isFlashDeal: z.boolean().default(false),
  claimedPercentage: z.coerce.number().int().min(0).max(100).default(0),
  categoryId: z.string().optional().nullable(),
  brandId: z.string().optional().nullable(),
  variants: z
    .array(
      z.object({
        id: z.string().optional(),
        name: z.string().min(1),
        sku: z.string().optional().nullable(),
        price: z.coerce.number().nonnegative().optional().nullable(),
        stock: z.coerce.number().int().nonnegative().default(0),
        options: z.record(z.string(), z.string()).optional().nullable(),
      })
    )
    .default([]),
});

export const categorySchema = z.object({
  name: z.string().min(1).max(120),
  slug: z.string().optional(),
  description: z.string().max(500).optional().nullable(),
  image: z.string().url().optional().nullable(),
  icon: z.string().optional().nullable(),
  sortOrder: z.coerce.number().int().default(0),
  featured: z.boolean().default(false),
  parentId: z.string().optional().nullable(),
});

export const brandSchema = z.object({
  name: z.string().min(1).max(120),
  slug: z.string().optional(),
  description: z.string().max(500).optional().nullable(),
  image: z.string().url().optional().nullable(),
});

export const couponSchema = z.object({
  code: z.string().min(3).max(50).toUpperCase(),
  type: z.enum(['FIXED', 'PERCENTAGE']),
  value: z.coerce.number().positive(),
  minSpend: z.coerce.number().nonnegative().optional().nullable(),
  usageLimit: z.coerce.number().int().nonnegative().optional().nullable(),
  startsAt: z.string().optional().nullable(),
  expiresAt: z.string().optional().nullable(),
  active: z.boolean().default(true),
});

export const settingsSchema = z.object({
  key: z.string().min(1),
  value: z.unknown(),
  group: z.string().optional(),
});

export const orderStatusSchema = z.object({
  status: z.enum(['PENDING', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED', 'REFUNDED']),
  note: z.string().max(500).optional().nullable(),
  trackingNumber: z.string().max(200).optional().nullable(),
});

export const reviewModerationSchema = z.object({
  status: z.enum(['PENDING', 'APPROVED', 'REJECTED']),
  reply: z.string().max(1000).optional().nullable(),
});

export const customerUpdateSchema = z.object({
  name: z.string().min(1).optional(),
  phone: z.string().optional().nullable(),
  status: z.enum(['active', 'blocked']).optional(),
  notes: z.string().optional().nullable(),
  tags: z.array(z.string()).optional(),
});
