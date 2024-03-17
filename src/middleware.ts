import { NextRequest, NextResponse } from 'next/server';
import supabaseServer from './lib/supabase/supabase-server';

// Redirect the user to the log in page if they have not signed in
export async function middleware(req: NextRequest) {
  const res = NextResponse.next();
  const supabase = supabaseServer();

  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (req.nextUrl.pathname.startsWith('/dashboard')) {
    if (!session) {
      return NextResponse.redirect(new URL('/login', req.url));
    }
  }

  if (['/login'].includes(req.nextUrl.pathname)) {
    if (session) {
      return NextResponse.redirect(new URL('/dashboard', req.url));
    }
  }
  return res;
}
