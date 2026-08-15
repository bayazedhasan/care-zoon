'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Plus, Trash2, ArrowLeft } from 'lucide-react';
import { apiFetch } from '@/lib/admin-api';
import { Card, PrimaryButton, SecondaryButton } from '@/components/admin/ui';
import { useToast } from '@/context/ToastContext';

const inputCls =
  'w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 placeholder-slate-400 outline-none transition-colors focus:border-sky-500 focus:ring-2 focus:ring-sky-500/20 dark:border-slate-700 dark:bg-slate-900 dark:text-white';

const labelCls = 'mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500';

function Field({ label, children, hint }) {
  return (
    <div>
      <label className={labelCls}>{label}</label>
      {children}
      {hint && <p className="mt-1 text-xs text-slate-400">{hint}</p>}
    </div>
  );
}

export default function ProductForm({ productId }) {
  const router = useRouter();
  const { addToast } = useToast();
  const isEdit = !!productId;
  const [loading, setLoading] = useState(isEdit);
  const [saving, setSaving] = useState(false);
  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);

  const [form, setForm] = useState({
    name: '',
    sku: '',
    shortDescription: '',
    description: '',
    price: '',
    originalPrice: '',
    costPrice: '',
    stock: 0,
    lowStockThreshold: 5,
    status: 'DRAFT',
    images: [''],
    features: [''],
    specifications: {},
    colors: [],
    sizes: [],
    tags: [],
    isNew: false,
    isBestSeller: false,
    isFeatured: false,
    isFlashDeal: false,
    categoryId: '',
    brandId: '',
    variants: [],
  });

  useEffect(() => {
    Promise.all([
      apiFetch('/categories').then((d) => d.categories),
      apiFetch('/brands').then((d) => d.brands),
    ]).then(([cats, brs]) => {
      setCategories(cats);
      setBrands(brs);
    }).catch(() => {});

    if (isEdit) {
      apiFetch(`/products/${productId}`)
        .then((d) => {
          const p = d.product;
          setForm({
            name: p.name || '',
            sku: p.sku || '',
            shortDescription: p.shortDescription || '',
            description: p.description || '',
            price: p.price != null ? String(p.price) : '',
            originalPrice: p.originalPrice != null ? String(p.originalPrice) : '',
            costPrice: p.costPrice != null ? String(p.costPrice) : '',
            stock: p.stock ?? 0,
            lowStockThreshold: p.lowStockThreshold ?? 5,
            status: p.status || 'DRAFT',
            images: p.images?.length ? p.images : [''],
            features: p.features?.length ? p.features : [''],
            specifications: p.specifications || {},
            colors: p.colors || [],
            sizes: p.sizes || [],
            tags: p.tags || [],
            isNew: p.isNew || false,
            isBestSeller: p.isBestSeller || false,
            isFeatured: p.isFeatured || false,
            isFlashDeal: p.isFlashDeal || false,
            categoryId: p.categoryId || '',
            brandId: p.brandId || '',
            variants: p.variants?.map((v) => ({
              id: v.id,
              name: v.name,
              sku: v.sku || '',
              price: v.price != null ? String(v.price) : '',
              stock: v.stock ?? 0,
              options: v.options || {},
            })) || [],
          });
        })
        .catch((err) => addToast(err.message, 'error'))
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, [isEdit, productId, addToast]);

  const set = (key, value) => setForm((prev) => ({ ...prev, [key]: value }));

  const updateArray = (key, index, value) => {
    setForm((prev) => {
      const arr = [...prev[key]];
      arr[index] = value;
      return { ...prev, [key]: arr };
    });
  };

  const addArrayItem = (key) => setForm((prev) => ({ ...prev, [key]: [...prev[key], ''] }));
  const removeArrayItem = (key, index) =>
    setForm((prev) => ({ ...prev, [key]: prev[key].filter((_, i) => i !== index) }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const payload = {
        ...form,
        images: form.images.filter((x) => x.trim()),
        features: form.features.filter((x) => x.trim()),
        price: Number(form.price),
        originalPrice: form.originalPrice ? Number(form.originalPrice) : null,
        costPrice: form.costPrice ? Number(form.costPrice) : null,
        stock: Number(form.stock) || 0,
        lowStockThreshold: Number(form.lowStockThreshold) || 5,
        colors: form.colors,
        sizes: form.sizes.filter((x) => x.trim()),
        tags: form.tags,
        categoryId: form.categoryId || null,
        brandId: form.brandId || null,
        variants: form.variants.map((v) => ({
          id: v.id,
          name: v.name,
          sku: v.sku || null,
          price: v.price ? Number(v.price) : null,
          stock: Number(v.stock) || 0,
          options: v.options,
        })),
      };

      if (isEdit) {
        await apiFetch(`/products/${productId}`, { method: 'PATCH', body: JSON.stringify(payload) });
        addToast('Product updated', 'success');
      } else {
        await apiFetch('/products', { method: 'POST', body: JSON.stringify(payload) });
        addToast('Product created', 'success');
      }
      router.push('/admin/products');
    } catch (err) {
      addToast(err.message, 'error');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center text-sm text-slate-400">
        <span className="mr-3 h-5 w-5 animate-spin rounded-full border-2 border-slate-300 border-t-sky-500" /> Loading…
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={() => router.push('/admin/products')}
          className="flex items-center gap-1.5 text-sm font-medium text-slate-500 hover:text-sky-600 dark:hover:text-sky-400"
        >
          <ArrowLeft size={16} /> Back to products
        </button>
        <PrimaryButton type="submit" disabled={saving}>
          {saving ? 'Saving…' : isEdit ? 'Save Changes' : 'Create Product'}
        </PrimaryButton>
      </div>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
        <div className="space-y-6 xl:col-span-2">
          <Card className="p-6">
            <h2 className="mb-4 font-heading text-base font-bold text-slate-900 dark:text-white">Basic Information</h2>
            <div className="space-y-4">
              <Field label="Product name">
                <input required className={inputCls} value={form.name} onChange={(e) => set('name', e.target.value)} placeholder="e.g. AuraStudio Pro ANC Headphones" />
              </Field>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <Field label="SKU">
                  <input required className={inputCls} value={form.sku} onChange={(e) => set('sku', e.target.value)} placeholder="AUR-HP-901" />
                </Field>
                <Field label="Status">
                  <select className={inputCls} value={form.status} onChange={(e) => set('status', e.target.value)}>
                    <option value="ACTIVE">Active</option>
                    <option value="DRAFT">Draft</option>
                    <option value="ARCHIVED">Archived</option>
                  </select>
                </Field>
              </div>
              <Field label="Short description">
                <textarea rows={2} className={inputCls} value={form.shortDescription} onChange={(e) => set('shortDescription', e.target.value)} placeholder="One-line summary for cards and search results." />
              </Field>
              <Field label="Description">
                <textarea rows={5} className={inputCls} value={form.description} onChange={(e) => set('description', e.target.value)} placeholder="Full product description." />
              </Field>
            </div>
          </Card>

          <Card className="p-6">
            <h2 className="mb-4 font-heading text-base font-bold text-slate-900 dark:text-white">Pricing & Inventory</h2>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <Field label="Price ($)">
                <input required type="number" step="0.01" min="0" className={inputCls} value={form.price} onChange={(e) => set('price', e.target.value)} placeholder="149.99" />
              </Field>
              <Field label="Compare-at price ($)">
                <input type="number" step="0.01" min="0" className={inputCls} value={form.originalPrice} onChange={(e) => set('originalPrice', e.target.value)} placeholder="199.99" />
              </Field>
              <Field label="Cost price ($)">
                <input type="number" step="0.01" min="0" className={inputCls} value={form.costPrice} onChange={(e) => set('costPrice', e.target.value)} placeholder="89.00" />
              </Field>
              <div className="grid grid-cols-2 gap-4">
                <Field label="Stock">
                  <input type="number" min="0" className={inputCls} value={form.stock} onChange={(e) => set('stock', Number(e.target.value))} />
                </Field>
                <Field label="Low-stock alert">
                  <input type="number" min="0" className={inputCls} value={form.lowStockThreshold} onChange={(e) => set('lowStockThreshold', Number(e.target.value))} />
                </Field>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <h2 className="mb-4 font-heading text-base font-bold text-slate-900 dark:text-white">Images</h2>
            <div className="space-y-3">
              {form.images.map((img, i) => (
                <div key={i} className="flex items-center gap-3">
                  <input className={inputCls} value={img} onChange={(e) => updateArray('images', i, e.target.value)} placeholder="https://…image-url" />
                  <button type="button" onClick={() => removeArrayItem('images', i)} className="shrink-0 rounded-md p-2 text-slate-400 hover:text-red-500" aria-label="Remove image">
                    <Trash2 size={16} />
                  </button>
                </div>
              ))}
              <SecondaryButton type="button" onClick={() => addArrayItem('images')}>
                <Plus size={15} /> Add image
              </SecondaryButton>
            </div>
          </Card>

          <Card className="p-6">
            <h2 className="mb-4 font-heading text-base font-bold text-slate-900 dark:text-white">Features</h2>
            <div className="space-y-3">
              {form.features.map((f, i) => (
                <div key={i} className="flex items-center gap-3">
                  <input className={inputCls} value={f} onChange={(e) => updateArray('features', i, e.target.value)} placeholder="Key selling point" />
                  <button type="button" onClick={() => removeArrayItem('features', i)} className="shrink-0 rounded-md p-2 text-slate-400 hover:text-red-500" aria-label="Remove feature">
                    <Trash2 size={16} />
                  </button>
                </div>
              ))}
              <SecondaryButton type="button" onClick={() => addArrayItem('features')}>
                <Plus size={15} /> Add feature
              </SecondaryButton>
            </div>
          </Card>

          <Card className="p-6">
            <h2 className="mb-4 font-heading text-base font-bold text-slate-900 dark:text-white">Variants</h2>
            {form.variants.length === 0 ? (
              <p className="mb-3 text-sm text-slate-400">No variants — this product is sold as a single option.</p>
            ) : (
              <div className="space-y-4">
                {form.variants.map((v, i) => (
                  <div key={v.id || i} className="grid grid-cols-1 gap-3 rounded-lg border border-slate-200 p-3 sm:grid-cols-2 lg:grid-cols-5 dark:border-slate-700">
                    <div className="lg:col-span-1">
                      <input className={inputCls} placeholder="Name" value={v.name} onChange={(e) => setForm((prev) => {
                        const arr = [...prev.variants]; arr[i] = { ...arr[i], name: e.target.value }; return { ...prev, variants: arr };
                      })} />
                    </div>
                    <input className={inputCls} placeholder="SKU" value={v.sku} onChange={(e) => setForm((prev) => {
                      const arr = [...prev.variants]; arr[i] = { ...arr[i], sku: e.target.value }; return { ...prev, variants: arr };
                    })} />
                    <input className={inputCls} placeholder="Price" value={v.price} onChange={(e) => setForm((prev) => {
                      const arr = [...prev.variants]; arr[i] = { ...arr[i], price: e.target.value }; return { ...prev, variants: arr };
                    })} />
                    <input type="number" className={inputCls} placeholder="Stock" value={v.stock} onChange={(e) => setForm((prev) => {
                      const arr = [...prev.variants]; arr[i] = { ...arr[i], stock: Number(e.target.value) }; return { ...prev, variants: arr };
                    })} />
                    <button type="button" onClick={() => setForm((prev) => ({ ...prev, variants: prev.variants.filter((_, idx) => idx !== i) }))} className="rounded-md p-2 text-slate-400 hover:text-red-500" aria-label="Remove variant">
                      <Trash2 size={16} />
                    </button>
                  </div>
                ))}
              </div>
            )}
            <SecondaryButton type="button" onClick={() => setForm((prev) => ({ ...prev, variants: [...prev.variants, { name: '', sku: '', price: '', stock: 0, options: {} }] }))}>
              <Plus size={15} /> Add variant
            </SecondaryButton>
          </Card>
        </div>

        <div className="space-y-6">
          <Card className="p-6">
            <h2 className="mb-4 font-heading text-base font-bold text-slate-900 dark:text-white">Organization</h2>
            <div className="space-y-4">
              <Field label="Category">
                <select className={inputCls} value={form.categoryId} onChange={(e) => set('categoryId', e.target.value)}>
                  <option value="">No category</option>
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
              </Field>
              <Field label="Brand">
                <select className={inputCls} value={form.brandId} onChange={(e) => set('brandId', e.target.value)}>
                  <option value="">No brand</option>
                  {brands.map((b) => (
                    <option key={b.id} value={b.id}>{b.name}</option>
                  ))}
                </select>
              </Field>
              <Field label="Tags">
                <input className={inputCls} value={form.tags.join(', ')} onChange={(e) => set('tags', e.target.value.split(',').map((t) => t.trim()).filter(Boolean))} placeholder="comma, separated" />
              </Field>
              <Field label="Sizes">
                <input className={inputCls} value={form.sizes.join(', ')} onChange={(e) => set('sizes', e.target.value.split(',').map((t) => t.trim()).filter(Boolean))} placeholder="S, M, L" />
              </Field>
              <Field label="Colors (name:hex)">
                <textarea rows={3} className={inputCls} value={form.colors.map((c) => `${c.name}:${c.hex}`).join('\n')} onChange={(e) => set('colors', e.target.value.split('\n').map((l) => { const [name, hex] = l.split(':'); return name ? { name: name.trim(), hex: (hex || '').trim() } : null; }).filter(Boolean))} placeholder="Midnight Black:#0f172a" />
              </Field>
            </div>
          </Card>

          <Card className="p-6">
            <h2 className="mb-4 font-heading text-base font-bold text-slate-900 dark:text-white">Visibility</h2>
            <div className="space-y-3">
              {[
                { key: 'isNew', label: 'New arrival badge' },
                { key: 'isBestSeller', label: 'Best seller badge' },
                { key: 'isFeatured', label: 'Featured on homepage' },
                { key: 'isFlashDeal', label: 'Flash deal' },
              ].map((opt) => (
                <label key={opt.key} className="flex cursor-pointer items-center justify-between">
                  <span className="text-sm text-slate-700 dark:text-slate-200">{opt.label}</span>
                  <input
                    type="checkbox"
                    checked={form[opt.key]}
                    onChange={(e) => set(opt.key, e.target.checked)}
                    className="h-4 w-4 rounded border-slate-300 text-sky-500 focus:ring-sky-500"
                  />
                </label>
              ))}
            </div>
          </Card>

          <Card className="p-6">
            <h2 className="mb-4 font-heading text-base font-bold text-slate-900 dark:text-white">SEO</h2>
            <div className="space-y-4">
              <Field label="Meta title">
                <input className={inputCls} value={form.metaTitle || ''} onChange={(e) => set('metaTitle', e.target.value)} />
              </Field>
              <Field label="Meta description">
                <textarea rows={3} className={inputCls} value={form.metaDescription || ''} onChange={(e) => set('metaDescription', e.target.value)} />
              </Field>
            </div>
          </Card>
        </div>
      </div>
    </form>
  );
}
