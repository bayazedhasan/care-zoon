import { getStripe } from '@/lib/stripe';
import { fail, ok, withError } from '@/lib/api';
import { prisma } from '@/lib/prisma';

export const POST = withError(async (request) => {
  const stripe = await getStripe();
  if (!stripe) return fail('Stripe not configured', 500);

  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!webhookSecret) return fail('STRIPE_WEBHOOK_SECRET not configured', 500);

  const signature = request.headers.get('stripe-signature');
  const body = await request.text();

  let event;
  try {
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
  } catch (err) {
    return fail(`Webhook signature verification failed: ${err.message}`, 400);
  }

  switch (event.type) {
    case 'checkout.session.completed': {
      const session = event.data.object;
      const orderId = session.metadata?.orderId;
      if (orderId) {
        await prisma.$transaction([
          prisma.order.update({
            where: { id: orderId },
            data: { paymentStatus: 'PAID', paymentMethod: 'CARD' },
          }),
          prisma.transaction.updateMany({
            where: { orderId, gateway: 'stripe', gatewayRef: session.id },
            data: { status: 'SUCCEEDED', gatewayRef: session.payment_intent || session.id },
          }),
          prisma.orderTimeline.create({
            data: {
              orderId,
              status: 'PENDING',
              note: `Payment received via Stripe (${session.payment_status})`,
            },
          }),
        ]);
      }
      break;
    }
    case 'checkout.session.expired': {
      const session = event.data.object;
      const orderId = session.metadata?.orderId;
      if (orderId) {
        await prisma.transaction.updateMany({
          where: { orderId, gateway: 'stripe', gatewayRef: session.id },
          data: { status: 'FAILED' },
        });
      }
      break;
    }
    default:
      break;
  }

  return ok({ received: true });
});
