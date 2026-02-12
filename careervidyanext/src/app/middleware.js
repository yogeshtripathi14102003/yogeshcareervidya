

// import { NextResponse } from "next/server";

// export function middleware(req) {
//   const userToken = req.cookies.get("usertoken")?.value;
//   const adminToken = req.cookies.get("admintoken")?.value;
//   const pathname = req.nextUrl.pathname;

//   // 1. Admin Protection
//   if (pathname.startsWith("/admin")) {
//     if (!adminToken) {
//       return NextResponse.redirect(new URL("/login", req.url));
//     }
//   }

//   // 2. User Protection (/user या /dashboard दोनों के लिए)
//   if (pathname.startsWith("/user") || pathname.startsWith("/dashboard")) {
//     if (!userToken) {
//       return NextResponse.redirect(new URL("/login", req.url));
//     }
//   }

//   // 3. Login Page Loop Protection
//   // अगर लॉगिन है तो वापस लॉगिन पेज न खुले
//   if (pathname === "/login") {
//     if (adminToken) return NextResponse.redirect(new URL("/admin", req.url));
//     if (userToken) return NextResponse.redirect(new URL("/user", req.url));
//   }

//   return NextResponse.next();
// }

// export const config = {
//   matcher: ["/admin/:path*", "/user/:path*", "/dashboard/:path*"],
// };

import { NextResponse } from "next/server";

export function middleware(req) {
  const userToken = req.cookies.get("usertoken")?.value;
  const adminToken = req.cookies.get("admintoken")?.value;
  const lastActivity = req.cookies.get("last_admin_activity")?.value;
  const pathname = req.nextUrl.pathname;

  const NOW = Date.now();
  const FIFTEEN_MINUTES = 15 * 60 * 1000;

  // --- 1. Admin Protection & Auto-Logout ---
  if (pathname.startsWith("/admin")) {
    if (!adminToken) {
      return NextResponse.redirect(new URL("/login", req.url));
    }

    // Check for Inactivity
    if (lastActivity && NOW - parseInt(lastActivity) > FIFTEEN_MINUTES) {
      const response = NextResponse.redirect(new URL("/login?message=session_expired", req.url));
      response.cookies.delete("admintoken");
      response.cookies.delete("last_admin_activity");
      return response;
    }

    // Update Activity Timestamp on every valid admin request
    const response = NextResponse.next();
    response.cookies.set("last_admin_activity", NOW.toString());
    return response;
  }

  // --- 2. User Protection ---
  if (pathname.startsWith("/user") || pathname.startsWith("/dashboard")) {
    if (!userToken) {
      return NextResponse.redirect(new URL("/login", req.url));
    }
  }

  // --- 3. Login Page Loop Protection ---
  if (pathname === "/login") {
    if (adminToken) return NextResponse.redirect(new URL("/admin", req.url));
    if (userToken) return NextResponse.redirect(new URL("/user", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/user/:path*", "/dashboard/:path*", "/login"],
};