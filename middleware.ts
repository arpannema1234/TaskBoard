import { NextRequest, NextResponse } from "next/server";
import { verifyToken } from "@/lib/auth";

export async function middleware(request: NextRequest) {
  const token = request.cookies.get("token")?.value;
  const { pathname } = request.nextUrl;

  // Public routes that don't require authentication
  const publicRoutes = ["/login", "/register", "/"];
  const isPublicRoute = publicRoutes.includes(pathname);

  // API routes that don't require authentication
  const publicApiRoutes = ["/api/auth/login", "/api/auth/register"];
  const isPublicApiRoute = publicApiRoutes.includes(pathname);

  // If it's a public route or public API route, allow access
  if (isPublicRoute || isPublicApiRoute) {
    return NextResponse.next();
  }

  // Check if user is authenticated
  if (!token) {
    if (pathname.startsWith("/api/")) {
      return NextResponse.json(
        { success: false, error: "Authentication required" },
        { status: 401 }
      );
    }
    return NextResponse.redirect(new URL("/login", request.url));
  }

  try {
    // Verify the token
    const payload = await verifyToken(token);

    // Add user info to request headers for API routes
    if (pathname.startsWith("/api/")) {
      const requestHeaders = new Headers(request.headers);
      requestHeaders.set("x-user-id", payload.userId as string);
      requestHeaders.set("x-user-email", payload.email as string);

      return NextResponse.next({
        request: {
          headers: requestHeaders,
        },
      });
    }

    return NextResponse.next();
  } catch (error) {
    console.error(error);
    // Token verification failed
    if (pathname.startsWith("/api/")) {
      return NextResponse.json(
        { success: false, error: "Invalid token" },
        { status: 401 }
      );
    }
    // Clear invalid token and redirect to login
    const response = NextResponse.redirect(new URL("/login", request.url));
    response.cookies.delete("token");
    return response;
  }
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
