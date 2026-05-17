import { NextRequest, NextResponse } from "next/server";

const protectedRoutes = ["/generate", "/credits", "/history", "/settings"];
const authRoutes = ["/login", "/signup"];

export function middleware(req: NextRequest) {
  const token = req.cookies.get("session")?.value;
  const { pathname } = req.nextUrl;

  const isProtected = protectedRoutes.some((route) =>
    pathname.startsWith(route)
  );
  const isAuthRoute = authRoutes.some((route) => pathname.startsWith(route));

  if (isProtected && !token) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  if (isAuthRoute && token) {
    return NextResponse.redirect(new URL("/generate", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};