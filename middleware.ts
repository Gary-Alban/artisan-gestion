import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { updateSession } from "@/lib/supabase/middleware";

const protectedPrefixes = ["/dashboard", "/account", "/audit"];

export async function middleware(request: NextRequest) {
  const response = await updateSession(request);
  const isProtected = protectedPrefixes.some((path) =>
    request.nextUrl.pathname.startsWith(path),
  );

  if (!isProtected) return response;

  const token =
    request.cookies.get("sb-access-token") ??
    request.cookies.getAll().find((cookie) => cookie.name.includes("-auth-token"));

  if (!token) {
    const url = request.nextUrl.clone();
    url.pathname = "/login";
    url.searchParams.set("redirect", request.nextUrl.pathname);
    return NextResponse.redirect(url);
  }

  return response;
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)"],
};
