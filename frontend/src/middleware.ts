import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

import { CONFIGS } from "@/configs";

export function middleware(request: NextRequest) {
    const publicRoutes = ["/signup", "/signin"];

    const pathname = request.nextUrl.pathname;
    const token = request.cookies.get(CONFIGS.AUTH.REFRESH_TOKEN_NAME);

    const originalUrl = CONFIGS.URL.PLATFORM_BASE_URL + request.nextUrl.pathname;

    if (!token && !publicRoutes.includes(pathname)) {
        const redirectUrl = new URL(CONFIGS.AUTH.UNAUTHORIZED_REDIRECT, request.nextUrl);

        return NextResponse.redirect(redirectUrl);
    }

    if (token && pathname === "/") {
        const redirectUrl = new URL(CONFIGS.AUTH.AUTHORIZED_REDIRECT, request.nextUrl);

        return NextResponse.redirect(redirectUrl);
    }

    return NextResponse.next();
}

export const config = {
    matcher: ["/((?!.*\\..*|_next).*)", "/", "/(api|trpc)(.*)"] // All routes except static files and /api
};
