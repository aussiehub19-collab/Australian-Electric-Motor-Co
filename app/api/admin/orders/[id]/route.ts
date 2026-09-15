import { NextRequest, NextResponse } from 'next/server';
import { checkAdminPasscode } from '@/lib/adminAuth';
import { getOrder, deleteOrder, markOrderSent, isOrderStoreConfigured } from '@/lib/orderStore';

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const authError = checkAdminPasscode(request);
  if (authError) return authError;

  if (!isOrderStoreConfigured()) {
    return NextResponse.json(
      { success: false, message: 'Order storage is not configured yet (UPSTASH_REDIS_REST_URL / UPSTASH_REDIS_REST_TOKEN).' },
      { status: 503 },
    );
  }

  try {
    const { id } = await params;
    const order = await getOrder(decodeURIComponent(id));
    if (!order) {
      return NextResponse.json({ success: false, message: 'Order not found.' }, { status: 404 });
    }
    return NextResponse.json({ success: true, order });
  } catch (error) {
    console.error('admin/orders/[id] GET error:', error);
    return NextResponse.json({ success: false, message: 'Something went wrong' }, { status: 500 });
  }
}

/** Marks an order as payment-sent without emailing — used after the admin
 * sends payment details via WhatsApp instead (opening wa.me doesn't hit the
 * server, so there's no other point where "sent" would get recorded). */
export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const authError = checkAdminPasscode(request);
  if (authError) return authError;

  if (!isOrderStoreConfigured()) {
    return NextResponse.json(
      { success: false, message: 'Order storage is not configured yet (UPSTASH_REDIS_REST_URL / UPSTASH_REDIS_REST_TOKEN).' },
      { status: 503 },
    );
  }

  try {
    const { id } = await params;
    await markOrderSent(decodeURIComponent(id));
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('admin/orders/[id] PATCH error:', error);
    return NextResponse.json({ success: false, message: 'Something went wrong' }, { status: 500 });
  }
}

/** Permanently removes a test/spam order from the dashboard. */
export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const authError = checkAdminPasscode(request);
  if (authError) return authError;

  if (!isOrderStoreConfigured()) {
    return NextResponse.json(
      { success: false, message: 'Order storage is not configured yet (UPSTASH_REDIS_REST_URL / UPSTASH_REDIS_REST_TOKEN).' },
      { status: 503 },
    );
  }

  try {
    const { id } = await params;
    await deleteOrder(decodeURIComponent(id));
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('admin/orders/[id] DELETE error:', error);
    return NextResponse.json({ success: false, message: 'Something went wrong' }, { status: 500 });
  }
}
