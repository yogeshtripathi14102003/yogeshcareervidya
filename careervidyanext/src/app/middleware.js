// import { NextResponse } from "next/server";

// export function middleware(req) {
//   const token = req.cookies.get("token")?.value;
//   const adminToken = req.cookies.get("admintoken")?.value;

//   const pathname = req.nextUrl.pathname;

//   // 🔥 Protect admin routes (only admins)
//   if (pathname.startsWith("/admin")) {
//     if (!adminToken) {
//       return NextResponse.redirect(new URL("/login", req.url));
//     }
//   }

//   // 🔥 Protect user dashboard routes (only users)
//   if (pathname.startsWith("/user")) {
//     if (!token) {
//       return NextResponse.redirect(new URL("/login", req.url));
//     }
//   }

//   return NextResponse.next();
// }

// export const config = {
//   matcher: [
//     "/admin/:path*",
//     "/user/:path*", // ✅ FIXED spelling
//   ],
// };


import { NextResponse } from "next/server";

export function middleware(req) {
  const userToken = req.cookies.get("usertoken")?.value;
  const adminToken = req.cookies.get("admintoken")?.value;
  const pathname = req.nextUrl.pathname;

  // 1. Admin Protection
  if (pathname.startsWith("/admin")) {
    if (!adminToken) {
      return NextResponse.redirect(new URL("/login", req.url));
    }
  }

  // 2. User Protection (/user या /dashboard दोनों के लिए)
  if (pathname.startsWith("/user") || pathname.startsWith("/dashboard")) {
    if (!userToken) {
      return NextResponse.redirect(new URL("/login", req.url));
    }
  }

  // 3. Login Page Loop Protection
  // अगर लॉगिन है तो वापस लॉगिन पेज न खुले
  if (pathname === "/login") {
    if (adminToken) return NextResponse.redirect(new URL("/admin", req.url));
    if (userToken) return NextResponse.redirect(new URL("/user", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/user/:path*", "/dashboard/:path*", "/login"],
};