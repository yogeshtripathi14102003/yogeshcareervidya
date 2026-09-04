// import { NextResponse } from "next/server";

// // Section -> roles allowed to enter it, and where to send them if they can't.
// //
// // NOTE: this file must live at src/middleware.js (or project-root
// // middleware.js if there's no src/ dir) for Next.js to actually run it.
// // A previous copy of this logic lived at src/app/middleware.js, which
// // Next.js does not recognize — it silently never executed, so /admin,
// // /user and /counselordashbord had zero edge-level protection.
// const PROTECTED_SECTIONS = [
//   { prefix: "/admin", roles: ["admin", "subadmin"], loginPath: "/login" },
//   { prefix: "/counselordashbord", roles: ["counselor"], loginPath: "/Counslerlogin" },
//   { prefix: "/user", roles: ["user"], loginPath: "/login" },
// ];

// export function middleware(request) {
//   const { pathname } = request.nextUrl;

//   // refreshToken is httpOnly — can't be read/forged by client JS, so its
//   // presence is a real (if coarse) signal of an active session. userRole
//   // is a plain, client-readable cookie set at login purely to pick a
//   // section; the backend is the actual authority on every API call.
//   const hasSession = !!request.cookies.get("refreshToken")?.value;
//   const role = request.cookies.get("userRole")?.value;

//   // Bounce already-logged-in users away from the login pages.
//   if ((pathname === "/login" || pathname === "/Counslerlogin") && hasSession && role) {
//     const dest =
//       role === "admin" || role === "subadmin"
//         ? "/admin"
//         : role === "counselor"
//         ? "/counselordashbord"
//         : "/user";
//     return NextResponse.redirect(new URL(dest, request.url));
//   }

//   const section = PROTECTED_SECTIONS.find((s) => pathname.startsWith(s.prefix));
//   if (!section) return NextResponse.next();

//   if (!hasSession || !role) {
//     const loginUrl = new URL(section.loginPath, request.url);
//     loginUrl.searchParams.set("redirect", pathname);
//     return NextResponse.redirect(loginUrl);
//   }

//   if (!section.roles.includes(role)) {
//     // Logged in, but the wrong role for this section — send them home rather
//     // than exposing that the section exists.
//     return NextResponse.redirect(new URL("/", request.url));
//   }

//   return NextResponse.next();
// }

// export const config = {
//   matcher: [
//     "/admin/:path*",
//     "/counselordashbord/:path*",
//     "/user/:path*",
//     "/login",
//     "/Counslerlogin",
//   ],
// };


import { NextResponse } from "next/server";
// Section -> roles allowed to enter it, and where to send them if they can't.
//
// NOTE: this file must live at src/middleware.js (or project-root
// middleware.js if there's no src/ dir) for Next.js to actually run it.
// A previous copy of this logic lived at src/app/middleware.js, which
// Next.js does not recognize — it silently never executed, so /admin,
// /user and /counselordashbord had zero edge-level protection.
const PROTECTED_SECTIONS = [
  { prefix: "/admin", roles: ["admin", "subadmin"], loginPath: "/login" },
  { prefix: "/counselordashbord", roles: ["counselor"], loginPath: "/Counslerlogin" },
  { prefix: "/user", roles: ["user"], loginPath: "/login" },
];

export function middleware(request) {
  const { pathname, searchParams } = request.nextUrl;

  // SEO fix: /teamexpand?id=xxx (old query-param route) → /teamexpand/xxx
  // (new dynamic route). Prevents duplicate/non-self canonical URLs.
  if (pathname === "/teamexpand" && searchParams.has("id")) {
    const id = searchParams.get("id");
    const url = request.nextUrl.clone();
    url.pathname = `/teamexpand/${id}`;
    url.search = "";
    return NextResponse.redirect(url, 301);
  }

  // refreshToken is httpOnly — can't be read/forged by client JS, so its
  // presence is a real (if coarse) signal of an active session. userRole
  // is a plain, client-readable cookie set at login purely to pick a
  // section; the backend is the actual authority on every API call.
  const hasSession = !!request.cookies.get("refreshToken")?.value;
  const role = request.cookies.get("userRole")?.value;

  // Bounce already-logged-in users away from the login pages.
  if ((pathname === "/login" || pathname === "/Counslerlogin") && hasSession && role) {
    const dest =
      role === "admin" || role === "subadmin"
        ? "/admin"
        : role === "counselor"
        ? "/counselordashbord"
        : "/user";
    return NextResponse.redirect(new URL(dest, request.url));
  }

  const section = PROTECTED_SECTIONS.find((s) => pathname.startsWith(s.prefix));
  if (!section) return NextResponse.next();

  if (!hasSession || !role) {
    const loginUrl = new URL(section.loginPath, request.url);
    loginUrl.searchParams.set("redirect", pathname);
    return NextResponse.redirect(loginUrl);
  }

  if (!section.roles.includes(role)) {
    // Logged in, but the wrong role for this section — send them home rather
    // than exposing that the section exists.
    return NextResponse.redirect(new URL("/", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/admin/:path*",
    "/counselordashbord/:path*",
    "/user/:path*",
    "/login",
    "/Counslerlogin",
    "/teamexpand",
  ],
};