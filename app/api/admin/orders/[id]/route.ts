import { NextRequest, NextResponse } from 'next/server';
import { checkAdminPasscode } from '@/lib/adminAuth';
import { getOrder, isOrderStoreConfigured } from '@/lib/orderStore';

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
