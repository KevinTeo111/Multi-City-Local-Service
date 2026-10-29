import { type NextRequest, NextResponse } from "next/server";
import { defaultLocale, locales } from "./i18n/config";

// Spanish (the default) is served without a prefix: /houston/plomeros is
// rewritten internally to /es/houston/plomeros. English keeps its /en prefix.
// A typed /es/... URL redirects to the canonical prefix-free one.
export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const first = pathname.split("/")[1];

  if (first === defaultLocale) {
    const url = request.nextUrl.clone();
    url.pathname = pathname.slice(defaultLocale.length + 1) || "/";
    return NextResponse.redirect(url, 308);
  }

  if ((locales as readonly string[]).includes(first)) return;

  const url = request.nextUrl.clone();
  url.pathname = `/${defaultLocale}${pathname === "/" ? "" : pathname}`;
  return NextResponse.rewrite(url);
}

export const config = {
  // Skip API routes, Next internals and files with an extension (sitemap.xml, favicon.ico…).
  matcher: ["/((?!api|_next|.*\\..*).*)"],
};
