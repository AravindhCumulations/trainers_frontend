import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
    // Get the pathname of the request
    const path = request.nextUrl.pathname

    console.log('🔍 Middleware - Processing request:', {
        path,
        url: request.url,
        method: request.method,
        timestamp: new Date().toISOString(),
        allCookies: request.cookies.getAll().map(c => c.name) // Log all cookie names
    });

    // Only check for root path
    if (path === '/') {
        // Get user details from localStorage (which is stored in cookies in middleware)
        const userDetails = request.cookies.get('user_details')?.value

        console.log('👤 User Details from Cookie:', {
            hasUserDetails: !!userDetails,
            rawUserDetails: userDetails,
            cookieNames: request.cookies.getAll().map(c => c.name)
        });

        if (userDetails) {
            try {
                const parsedUserDetails = JSON.parse(userDetails)
                console.log('🔑 Parsed User Details:', {
                    role: parsedUserDetails.role_user,
                    userId: parsedUserDetails.id,
                    email: parsedUserDetails.email,
                    name: parsedUserDetails.name,
                    fullDetails: parsedUserDetails // Log full details for debugging
                });

                // If user has role 'Trainer', redirect to trainer-details with their name
                if (parsedUserDetails.role_user === 'Trainer') {
                    const trainerName = parsedUserDetails.name || '';
                    const redirectUrl = new URL('/trainer-details', request.url);
                    redirectUrl.searchParams.set('trainer', trainerName);

                    console.log('🔄 Redirecting Trainer to trainer-details:', {
                        trainerName,
                        redirectUrl: redirectUrl.toString(),
                        role: parsedUserDetails.role_user
                    });

                    return NextResponse.redirect(redirectUrl);
                } else {
                    console.log('ℹ️ User is not a Trainer:', {
                        role: parsedUserDetails.role_user
                    });
                }
            } catch (error) {
                console.error('❌ Error parsing user details:', error, {
                    rawUserDetails: userDetails
                });
            }
        } else {
            console.log('ℹ️ No user details found in cookies');
        }
    }

    console.log('✅ Allowing request to continue');
    // Allow the request to continue for all other cases
    return NextResponse.next()
}

// Configure which paths the middleware should run on
export const config = {
    matcher: '/'
} 