import { NextRequest, NextResponse } from 'next/server';
import { checkAdminPasscode } from '@/lib/adminAuth';
import { getEnquiry, deleteEnquiry, isEnquiryStoreConfigured } from '@/lib/enquiryStore';

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const authError = checkAdminPasscode(request);
  if (authError) return authError;

  if (!isEnquiryStoreConfigured()) {
    return NextResponse.json(
      { success: false, message: 'Enquiry storage is not configured yet (UPSTASH_REDIS_REST_URL / UPSTASH_REDIS_REST_TOKEN).' },
      { status: 503 },
    );
  }

  try {
    const { id } = await params;
    const enquiry = await getEnquiry(decodeURIComponent(id));
    if (!enquiry) {
      return NextResponse.json({ success: false, message: 'Enquiry not found.' }, { status: 404 });
    }
    return NextResponse.json({ success: true, enquiry });
  } catch (error) {
    console.error('admin/enquiries/[id] GET error:', error);
    return NextResponse.json({ success: false, message: 'Something went wrong' }, { status: 500 });
  }
}

/** Permanently removes a test/spam enquiry from the dashboard. */
export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const authError = checkAdminPasscode(request);
  if (authError) return authError;

  if (!isEnquiryStoreConfigured()) {
    return NextResponse.json(
      { success: false, message: 'Enquiry storage is not configured yet (UPSTASH_REDIS_REST_URL / UPSTASH_REDIS_REST_TOKEN).' },
      { status: 503 },
    );
  }

  try {
    const { id } = await params;
    await deleteEnquiry(decodeURIComponent(id));
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('admin/enquiries/[id] DELETE error:', error);
    return NextResponse.json({ success: false, message: 'Something went wrong' }, { status: 500 });
  }
}
