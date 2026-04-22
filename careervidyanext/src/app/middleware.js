
import { NextResponse } from "next/server";

export function middleware(req) {
  const { pathname } = req.nextUrl;
  const refreshToken = req.cookies.get("refreshToken")?.value;
  const userRole = req.cookies.get("userRole")?.value;

  console.log(`Middleware -> Path: ${pathname} | Role: ${userRole}`);

  // 1. /login protection
  if (pathname === "/login") {
    if (refreshToken && userRole) {
      const dest = (userRole === "admin" || userRole === "subadmin") ? "/admin" : "/user";
      return NextResponse.redirect(new URL(dest, req.url));
    }
    return NextResponse.next();
  }

  // 2. /admin protection
  if (pathname.startsWith("/admin")) {
    if (!refreshToken || (userRole !== "admin" && userRole !== "subadmin")) {
      return NextResponse.redirect(new URL("/login", req.url));
    }
    return NextResponse.next();
  }

  // 3. /user protection
  if (pathname.startsWith("/user")) {
    if (!refreshToken || (userRole !== "user" && userRole !== "student")) {
      // Agar admin user area mein aaye, toh usey admin dashboard bhejo
      if (userRole === "admin") return NextResponse.redirect(new URL("/admin", req.url));
      return NextResponse.redirect(new URL("/login", req.url));
    }
    return NextResponse.next();
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/user/:path*", "/login"],
};  