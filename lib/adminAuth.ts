import { NextRequest, NextResponse } from 'next/server';

/**
 * Checks the passcode sent in the X-Admin-Passcode header against
 * ADMIN_PASSCODE (server-only env var). Returns an error response to return
 * immediately if the check fails, or null if it passed.
 */
export function checkAdminPasscode(request: NextRequest): NextResponse | null {
  const expected = process.env.ADMIN_PASSCODE;
  if (!expected) {
    return NextResponse.json(
      { success: false, message: 'ADMIN_PASSCODE is not configured in Vercel env vars yet.' },
      { status: 503 },
    );
  }
  const provided = request.headers.get('x-admin-passcode');
  if (!provided || provided !== expected) {
    return NextResponse.json({ success: false, message: 'Incorrect passcode.' }, { status: 401 });
  }
  return null;
}
