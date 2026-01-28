import { NextFetchEvent, NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { cookies } from "next/headers";

// This function can be marked `async` if using `await` inside
export async function proxy(request: NextRequest) {
    //console.log("request.nextUrl.basePath", request.nextUrl.pathname);
    /*const response = NextResponse.next();
    // Or, for middleware to proceed:
    // const response = NextResponse.next();

    // 2. Set the cookie
    response.cookies.set({
        name: 'sessionToken',
        value: 'abc123xyz',
        httpOnly: true,
        maxAge: 60 * 60 * 24, // 1 day
        sameSite: 'strict',
        secure: process.env.NODE_ENV !== 'development', // Use secure in production
    });

    // 3. Return the modified response
    return response;*/
}

// Alternatively, you can use a default export:
// export default function proxy(request: NextRequest) { ... }

export const config = {
    matcher: '/account/:path*',
}