import { NextResponse } from "next/server";

export function middleware(req) {
  const token = req.cookies.get("token")?.value;
  const adminToken = req.cookies.get("admintoken")?.value;

  const pathname = req.nextUrl.pathname;

  // 🔥 Protect admin routes (only admins)
  if (pathname.startsWith("/admin")) {
    if (!adminToken) {
      return NextResponse.redirect(new URL("/login", req.url));
    }
  }

  // 🔥 Protect user dashboard routes (only users)
  if (pathname.startsWith("/userdashbord")) {
    if (!token) {
      return NextResponse.redirect(new URL("/login", req.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/admin/:path*",
    "/userdashbord/:path*", // ✅ FIXED spelling
  ],
};
