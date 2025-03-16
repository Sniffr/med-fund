import { NextResponse } from 'next/server';

export function middleware(request) {
  // Check if the path starts with /admin
  if (request.nextUrl.pathname.startsWith('/admin') || 
      request.nextUrl.pathname.startsWith('/api/admin')) {
    
    // Skip middleware for login page
    if (request.nextUrl.pathname === '/login') {
      return NextResponse.next();
    }
    
    const token = request.cookies.get('auth_token')?.value;
    
    if (!token) {
      console.log('No token found, redirecting to login');
      // Redirect to login with return URL
      const loginUrl = new URL('/login', request.url);
      loginUrl.searchParams.set('redirect', request.nextUrl.pathname);
      return NextResponse.redirect(loginUrl);
    }
  }
  
  return NextResponse.next();
}

// Configure the middleware to run on specific paths
export const config = {
  matcher: ['/admin/:path*', '/api/admin/:path*'],
};
