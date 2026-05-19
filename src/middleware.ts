import { NextRequest, NextResponse } from "next/server";

export function middleware(req: NextRequest) {
  // Auth is handled client-side via Firebase onAuthStateChanged
  // Dashboard layout redirects to /login if not authenticated
  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};