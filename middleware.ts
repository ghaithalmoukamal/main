import createMiddleware from "next-intl/middleware";
import { NextRequest, NextResponse } from "next/server";
import { routing } from "./src/i18n/routing";

const intlMiddleware = createMiddleware(routing);

const PROTECTED_PATTERNS = [
  /^\/(ar|en)\/admin(\/|$)/,
  /^\/(ar|en)\/dashboard(\/|$)/,
  /^\/(ar|en)\/firm(\/|$)/,
  /^\/(ar|en)\/supplier\/dashboard(\/|$)/,
  /^\/(ar|en)\/supplier\/ads(\/|$)/,
  /^\/(ar|en)\/supplier\/billing(\/|$)/,
  /^\/(ar|en)\/supplier\/channels(\/|$)/,
];

export default function middleware(request: NextRequest) {
  const response = intlMiddleware(request);
  const pathname = request.nextUrl.pathname;

  // Persist Lite/Normal mode cookie if explicit query param is present.
  const modeParam = request.nextUrl.searchParams.get("mode");
  if (modeParam === "lite" || modeParam === "normal") {
    response.cookies.set("display-mode", modeParam, {
      maxAge: 60 * 60 * 24 * 365,
      sameSite: "lax",
      path: "/",
    });
  }

  // Auth check for protected routes happens at the page/layout level
  // (server components read cookies + Supabase session). Middleware only
  // attaches a header signal so layouts can short-circuit redirects fast.
  if (PROTECTED_PATTERNS.some((re) => re.test(pathname))) {
    response.headers.set("x-protected-route", "true");
  }

  return response;
}

export const config = {
  matcher: ["/((?!api|_next|_vercel|favicon.ico|manifest.json|sw.js|icons|.*\\..*).*)"],
};
