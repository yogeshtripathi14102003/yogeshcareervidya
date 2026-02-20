
// import { NextResponse } from "next/server";

// export function middleware(req) {
//   const userToken = req.cookies.get("usertoken")?.value;
//   const adminToken = req.cookies.get("admintoken")?.value;
//   const lastActivity = req.cookies.get("last_admin_activity")?.value;
//   const pathname = req.nextUrl.pathname;

//   const NOW = Date.now();
//   const FIFTEEN_MINUTES = 15 * 60 * 1000;

//   // --- 1. Admin Protection & Auto-Logout ---
//   if (pathname.startsWith("/admin")) {
//     if (!adminToken) {
//       return NextResponse.redirect(new URL("/login", req.url));
//     }

//     // Check for Inactivity
//     if (lastActivity && NOW - parseInt(lastActivity) > FIFTEEN_MINUTES) {
//       const response = NextResponse.redirect(new URL("/login?message=session_expired", req.url));
//       response.cookies.delete("admintoken");
//       response.cookies.delete("last_admin_activity");
//       return response;
//     }

//     // Update Activity Timestamp on every valid admin request
//     const response = NextResponse.next();
//     response.cookies.set("last_admin_activity", NOW.toString());
//     return response;
//   }

//   // --- 2. User Protection ---
//   if (pathname.startsWith("/user") || pathname.startsWith("/dashboard")) {
//     if (!userToken) {
//       return NextResponse.redirect(new URL("/login", req.url));
//     }
//   }

//   // --- 3. Login Page Loop Protection ---
//   if (pathname === "/login") {
//     if (adminToken) return NextResponse.redirect(new URL("/admin", req.url));
//     if (userToken) return NextResponse.redirect(new URL("/user", req.url));
//   }

//   return NextResponse.next();
// }

// export const config = {
//   matcher: ["/admin/:path*", "/user/:path*", "/dashboard/:path*", "/login"],
// };
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