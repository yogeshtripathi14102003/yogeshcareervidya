import { NextResponse } from 'next/server';

export function middleware(request) {
  // ✅ Read token from cookies
  const adminToken = request.cookies.get('admintoken')?.value;

  // ✅ Protected routes (all under /admin)
  const adminProtectedRoutes = ['/admin'];

  // Check if the current route starts with "/admin"
  const isAdminRoute = adminProtectedRoutes.some((route) =>
    request.nextUrl.pathname.startsWith(route)
  );

  // If user tries to access admin route without token
  if (isAdminRoute && !adminToken) {
    const loginUrl = new URL('/', request.url); // redirect to login page
    return NextResponse.redirect(loginUrl);
  }

  // ✅ Allow request if everything is fine
  return NextResponse.next();
}

// ✅ Apply middleware to admin routes only
export const config = {
  matcher: ['/admin/:path*'],
};
