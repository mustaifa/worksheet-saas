import { NextResponse, type NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

/**
 * - Signed-in users opening the home page go straight to their dashboard
 *   (add ?home=1 to see the public home page anyway). Visitors and search
 *   engines aren't signed in, so they still get the public home page.
 * - Dashboard and admin pages need an account: visitors are sent to log in
 *   and brought back to the page they wanted afterwards.
 */
export async function middleware(req: NextRequest) {
  const { pathname, searchParams } = req.nextUrl;
  const token = await getToken({ req });

  if (pathname === "/") {
    if (token && !searchParams.has("home")) return NextResponse.redirect(new URL("/dashboard", req.url));
    return NextResponse.next();
  }

  if (!token) {
    const login = new URL("/login", req.url);
    login.searchParams.set("callbackUrl", pathname + req.nextUrl.search);
    return NextResponse.redirect(login);
  }
  return NextResponse.next();
}

export const config = {
  matcher: ["/", "/dashboard/:path*", "/admin/:path*"],
};
