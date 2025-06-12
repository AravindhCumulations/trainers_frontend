import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
    // Get the pathname of the request
    const path = request.nextUrl.pathname

    // Handle file requests with URL encoding
    if (path.startsWith('/files/')) {
        const filePath = path.replace('/files/', '')
        const encodedPath = encodeURIComponent(filePath)

        // Create a new URL with the encoded path
        const url = new URL(request.url)
        url.pathname = `/files/${encodedPath}`

        // Return a rewritten response
        return NextResponse.rewrite(url)
    }

    console.log('🔍 Middleware - Processing request:', {
        path,
        url: request.url,
        method: request.method,
        timestamp: new Date().toISOString(),
        allCookies: request.cookies.getAll().map(c => c.name)
    });

    // Check for root path and login/signup paths
    if (path === '/' || path === '/login' || path === '/signup') {
        // Get user details from cookies
        const userDetails = request.cookies.get('user_details')?.value
        const authCookie = request.cookies.get('auth')?.value

        console.log('👤 Auth State:', {
            hasUserDetails: !!userDetails,
            hasAuthCookie: !!authCookie,
            cookieNames: request.cookies.getAll().map(c => c.name)
        });

        // If we have both user details and auth cookie, user is logged in
        if (userDetails && authCookie) {
            try {
                const parsedUserDetails = JSON.parse(userDetails)
                console.log('🔑 Parsed User Details:', {
                    role: parsedUserDetails.role_user,
                    userId: parsedUserDetails.id,
                    email: parsedUserDetails.email,
                    name: parsedUserDetails.name
                });

                // If trying to access login/signup pages while logged in, redirect to home
                if (path === '/login' || path === '/signup') {
                    return NextResponse.redirect(new URL('/', request.url));
                }
            } catch (error) {
                console.error('❌ Error parsing user details:', error);
                // If there's an error parsing user details, clear cookies and allow access
                const response = NextResponse.next();
                response.cookies.delete('user_details');
                response.cookies.delete('auth');
                return response;
            }
        }
    }

    console.log('✅ Allowing request to continue');
    return NextResponse.next()
}

// Configure which paths the middleware should run on
export const config = {
    matcher: ['/', '/login', '/signup', '/files/:path*']
} 