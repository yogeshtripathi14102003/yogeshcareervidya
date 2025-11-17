import { NextResponse } from "next/server";

export function middleware(req) {
  const token = req.cookies.get("token")?.value;
  const adminToken = req.cookies.get("admintoken")?.value;

  const pathname = req.nextUrl.pathname;

  // 🔥 Protect admin routes → Return 404 if not logged in
  if (pathname.startsWith("/admin")) {
    if (!adminToken) {
      return NextResponse.rewrite(new URL("/404", req.url));
    }
  }

  // 🔥 Protect user dashboard routes → Return 404
  if (pathname.startsWith("/user_dashbord")) {
    if (!token) {
      return NextResponse.rewrite(new URL("/404", req.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/admin/:path*",
    "/user_dashbordy/:path*",
  ],
};
