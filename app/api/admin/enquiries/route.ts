import { NextRequest, NextResponse } from 'next/server';
import { checkAdminPasscode } from '@/lib/adminAuth';
import { listEnquiries, isEnquiryStoreConfigured } from '@/lib/enquiryStore';

export async function GET(request: NextRequest) {
  const authError = checkAdminPasscode(request);
  if (authError) return authError;

  if (!isEnquiryStoreConfigured()) {
    return NextResponse.json(
      { success: false, message: 'Enquiry storage is not configured yet (UPSTASH_REDIS_REST_URL / UPSTASH_REDIS_REST_TOKEN).' },
      { status: 503 },
    );
  }

  try {
    const enquiries = await listEnquiries(50);
    return NextResponse.json({ success: true, enquiries });
  } catch (error) {
    console.error('admin/enquiries GET error:', error);
    return NextResponse.json({ success: false, message: 'Something went wrong' }, { status: 500 });
  }
}
