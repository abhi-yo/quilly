import { withAuth } from "next-auth/middleware";
import { NextResponse, NextRequest } from "next/server";

const RATE_LIMIT_WINDOW = 15 * 60 * 1000;
const MAX_REQUESTS_PER_WINDOW = 100;
const requestCounts = new Map<string, { count: number; timestamp: number }>();

function getClientIP(request: NextRequest): string {
  const forwarded = request.headers.get("x-forwarded-for");
  const realIP = request.headers.get("x-real-ip");
  const cfConnectingIP = request.headers.get("cf-connecting-ip");

  if (forwarded) {
    return forwarded.split(",")[0].trim();
  }
  if (realIP) {
    return realIP;
  }
  if (cfConnectingIP) {
    return cfConnectingIP;
  }
  return "unknown";
}

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const userRequests = requestCounts.get(ip);

  if (!userRequests || now - userRequests.timestamp > RATE_LIMIT_WINDOW) {
    requestCounts.set(ip, { count: 1, timestamp: now });
    return true;
  }

  if (userRequests.count >= MAX_REQUESTS_PER_WINDOW) {
    return false;
  }

  userRequests.count++;
  return true;
}

function addSecurityHeaders(response: NextResponse): NextResponse {
  response.headers.set("X-Content-Type-Options", "nosniff");
  response.headers.set("X-Frame-Options", "DENY");
  response.headers.set("X-XSS-Protection", "1; mode=block");
  response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
  response.headers.set(
    "Permissions-Policy",
    "camera=(), microphone=(), geolocation=()"
  );

  if (process.env.NODE_ENV === "production") {
    response.headers.set(
      "Strict-Transport-Security",
      "max-age=31536000; includeSubDomains"
    );
    response.headers.set(
      "Content-Security-Policy",
      "default-src 'self'; " +
        "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://accounts.google.com https://apis.google.com; " +
        "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; " +
        "font-src 'self' https://fonts.gstatic.com; " +
        "img-src 'self' data: https:; " +
        "connect-src 'self' https://api.github.com; " +
        "frame-src 'self' https://accounts.google.com;"
    );
  }

  return response;
}

export default withAuth(
  function middleware(req) {
    const ip = getClientIP(req);

    if (!checkRateLimit(ip)) {
      return new NextResponse("Too Many Requests", {
        status: 429,
        headers: {
          "Retry-After": "900",
        },
      });
    }

    if (
      req.nextauth.token &&
      req.nextauth.token.needsRoleSelection &&
      req.nextUrl.pathname !== "/auth/complete-profile"
    ) {
      return NextResponse.redirect(
        new URL("/auth/complete-profile?provider=google", req.url)
      );
    }

    const response = NextResponse.next();
    return addSecurityHeaders(response);
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        const { pathname } = req.nextUrl;

        // Always allow API auth routes
        if (pathname.startsWith("/api/auth")) {
          return true;
        }

        // Always allow auth pages
        if (pathname.startsWith("/auth")) {
          return true;
        }

        // Always allow public pages
        const publicPaths = [
          "/about",
          "/privacy",
          "/terms",
          "/contact",
          "/help",
          "/",
        ];

        const isPublicPath = publicPaths.some(
          (path) =>
            pathname === path || (path !== "/" && pathname.startsWith(path))
        );

        if (isPublicPath) {
          return true;
        }

        // Protected paths that require authentication
        const protectedPaths = [
          "/dashboard",
          "/write",
          "/articles",
          "/explore",
          "/profile",
          "/settings",
          "/blockchain",
          "/resources",
        ];

        const isProtectedPath = protectedPaths.some((path) =>
          pathname.startsWith(path)
        );

        if (isProtectedPath) {
          return !!token;
        }

        // Default to allowing access for other routes
        return true;
      },
    },
    pages: {
      signIn: "/auth/signin",
    },
  }
);

export const config = {
  matcher: [
    "/((?!api/auth|_next/static|_next/image|favicon.ico|public).*)",
    "/api/:path*",
  ],
};
