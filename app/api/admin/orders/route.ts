import { NextRequest, NextResponse } from 'next/server';
import { checkAdminPasscode } from '@/lib/adminAuth';
import { listOrders, isOrderStoreConfigured } from '@/lib/orderStore';

export async function GET(request: NextRequest) {
  const authError = checkAdminPasscode(request);
  if (authError) return authError;

  if (!isOrderStoreConfigured()) {
    return NextResponse.json(
      { success: false, message: 'Order storage is not configured yet (UPSTASH_REDIS_REST_URL / UPSTASH_REDIS_REST_TOKEN).' },
      { status: 503 },
    );
  }

  try {
    const orders = await listOrders(30);
    return NextResponse.json({ success: true, orders });
  } catch (error) {
    console.error('admin/orders GET error:', error);
    return NextResponse.json({ success: false, message: 'Something went wrong' }, { status: 500 });
  }
}
