import createMiddleware from "next-intl/middleware";
import { NextRequest, NextResponse } from "next/server";
import { routing } from "./src/i18n/routing";

const intlMiddleware = createMiddleware(routing);

const PROTECTED_PATTERNS = [
  /^\/(ar|en)\/admin(\/|$)/,
  /^\/(ar|en)\/dashboard(\/|$)/,       // Maalem (craftsman) dashboard
  /^\/(ar|en)\/firm(\/|$)/,            // Engineering firm portal
  /^\/(ar|en)\/supplier\/dashboard(\/|$)/,
  /^\/(ar|en)\/supplier\/ads(\/|$)/,
  /^\/(ar|en)\/supplier\/billing(\/|$)/,
  /^\/(ar|en)\/supplier\/channels(\/|$)/,
  /^\/(ar|en)\/contractor\/dashboard(\/|$)/,  // Contractor portal (new)
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

  // Persist B2C/B2B user context cookie if set via query param.
  // e.g. /?ctx=homeowner or /?ctx=b2b&b2b_type=maalem
  // This is set once on first visit and never prompted again.
  const ctxParam = request.nextUrl.searchParams.get("ctx");
  if (ctxParam === "homeowner" || ctxParam === "b2b") {
    response.cookies.set("user_context", ctxParam, {
      maxAge: 60 * 60 * 24 * 365 * 2, // 2 years — effectively permanent
      sameSite: "lax",
      path: "/",
    });
    const b2bType = request.nextUrl.searchParams.get("b2b_type");
    if (ctxParam === "b2b" && b2bType) {
      response.cookies.set("b2b_type", b2bType, {
        maxAge: 60 * 60 * 24 * 365 * 2,
        sameSite: "lax",
        path: "/",
      });
    }
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
