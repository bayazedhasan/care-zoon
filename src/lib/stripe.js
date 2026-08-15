import Stripe from 'stripe';
import { prisma } from './prisma';

let cachedStripe = null;

export async function getStripe() {
  const secretKey = process.env.STRIPE_SECRET_KEY || (await getSettingKey('payments', 'stripe.secretKey'));
  if (!secretKey) return null;
  if (!cachedStripe) cachedStripe = new Stripe(secretKey);
  return cachedStripe;
}

async function getSettingKey(settingKey, dottedPath) {
  try {
    const setting = await prisma.setting.findUnique({ where: { key: settingKey } });
    const value = setting?.value;
    const parts = dottedPath.split('.');
    let cursor = value;
    for (const part of parts) {
      cursor = cursor?.[part];
    }
    return typeof cursor === 'string' ? cursor : null;
  } catch {
    return null;
  }
}
