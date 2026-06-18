import { NextResponse, type NextRequest } from "next/server";

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const role = request.cookies.get("pawonsync-role")?.value;

  if ((pathname.startsWith("/seller") || pathname.startsWith("/buyer")) && role !== "seller" && role !== "buyer") {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  if (pathname.startsWith("/seller") && role === "buyer") {
    return NextResponse.redirect(new URL("/buyer/dashboard", request.url));
  }

  if (pathname.startsWith("/buyer") && role === "seller") {
    return NextResponse.redirect(new URL("/seller/dashboard", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/seller/:path*", "/buyer/:path*"],
};
