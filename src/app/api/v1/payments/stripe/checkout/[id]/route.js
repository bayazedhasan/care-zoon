import { getStripe } from '@/lib/stripe';
import { fail, notFound, ok, requirePermission, withError } from '@/lib/api';
import { prisma } from '@/lib/prisma';

export const POST = withError(async (request, { params }) => {
  const user = await requirePermission(request, 'payments', 'create');
  const { id } = await params;

  const order = await prisma.order.findUnique({
    where: { id },
    include: { items: true },
  });
  if (!order) return notFound('Order not found');

  const stripe = await getStripe();
  if (!stripe) return fail('Stripe is not configured. Add a secret key in Settings.', 400);

  const lineItems = order.items.map((item) => ({
    price_data: {
      currency: (order.currency || 'usd').toLowerCase(),
      product_data: { name: item.productName, description: item.variant || undefined },
      unit_amount: Math.round(Number(item.unitPrice) * 100),
    },
    quantity: item.quantity,
  }));

  const origin = request.headers.get('origin') || 'http://localhost:3000';

  const session = await stripe.checkout.sessions.create({
    mode: 'payment',
    line_items: lineItems,
    customer_email: order.email || undefined,
    client_reference_id: order.id,
    metadata: { orderId: order.id, orderNumber: order.orderNumber },
    success_url: `${origin}/checkout/success?session_id={CHECKOUT_SESSION_ID}&order=${order.orderNumber}`,
    cancel_url: `${origin}/admin/orders/${order.id}`,
  });

  await prisma.transaction.create({
    data: {
      orderId: order.id,
      customerId: order.customerId,
      gateway: 'stripe',
      gatewayRef: session.id,
      amount: order.total,
      type: 'PAYMENT',
      status: 'PENDING',
      metadata: { initiatedBy: user.id, checkoutUrl: session.url },
    },
  });

  return ok({ checkoutUrl: session.url, sessionId: session.id });
});
