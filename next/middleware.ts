import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs';

import type { Database } from './types/supabase';

const ADMIN_PATH = '/admin';

export async function middleware(req: NextRequest) {
  const res = NextResponse.next();
  const supabase = createMiddlewareClient<Database>({ req, res });

  // Retrieve the current session (JWT stored in cookies)
  const {
    data: { session },
  } = await supabase.auth.getSession();

  const isAdminRoute = req.nextUrl.pathname.startsWith(ADMIN_PATH);

  if (!isAdminRoute) return res;

  // Not authenticated -> redirect to home (or login)
  if (!session?.user) {
    const redirectUrl = new URL('/', req.url);
    redirectUrl.searchParams.set('redirectedFrom', req.nextUrl.pathname);
    return NextResponse.redirect(redirectUrl);
  }

  // Check role from the profiles table
  const { data: profile, error } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', session.user.id)
    .single();

  if (error || profile?.role !== 'admin') {
    const redirectUrl = new URL('/', req.url);
    redirectUrl.searchParams.set('reason', 'forbidden');
    return NextResponse.redirect(redirectUrl);
  }

  return res;
}

// Only run middleware on admin routes (app/(admin)/... resolves to /admin/*)
export const config = {
  matcher: ['/admin/:path*'],
};
