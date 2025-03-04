// middleware.js
import { NextResponse } from 'next/server';

// Define paths that should be protected (require authentication)
const protectedPaths = ['/Homepage', '/Profile', '/Admin', '/Info', '/cancle', '/about'];

// Define paths that should be accessible only to non-authenticated users
const authPaths = ['/Login', '/Login/Registration'];

export function middleware(request) {
  const { pathname } = request.nextUrl;
  
  // Get token from cookies (more secure) or authorization header
  const token = request.cookies.get('token')?.value || 
                request.headers.get('authorization')?.split(' ')[1];
  
  // Check if user is trying to access a protected path without being authenticated
  if (isProtectedPath(pathname) && !token) {
    // Redirect unauthenticated users to login
    return NextResponse.redirect(new URL('/Login', request.url));
  }
  
  // Check if authenticated users are trying to access auth pages (login/register)
  if (isAuthPath(pathname) && token) {
    // Redirect authenticated users to homepage
    return NextResponse.redirect(new URL('/Homepage', request.url));
  }
  
  return NextResponse.next();
}

// Helper function to check if a path is protected
function isProtectedPath(pathname) {
  return protectedPaths.some(path => pathname === path || pathname.startsWith(`${path}/`));
}

// Helper function to check if a path is an auth path
function isAuthPath(pathname) {
  return authPaths.some(path => pathname === path || pathname.startsWith(`${path}/`));
}

// Configure the middleware to run only on specific paths
export const config = {
  matcher: [
    /*
     * Match all paths except for:
     * 1. /api routes
     * 2. /_next (Next.js internals)
     * 3. /static (Inside /public)
     * 4. /_vercel (Vercel internals)
     * 5. all files in the /public (favicon, images, etc.)
     */
    '/((?!api|_next|static|_vercel|favicon.ico|.*\\.(?:jpg|jpeg|png|gif|svg)).*)',
  ],
};