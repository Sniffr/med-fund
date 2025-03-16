import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';

// JWT secret key
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

// Simple token verification that doesn't use MongoDB (edge compatible)
function verifyToken(token) {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (error) {
    console.error('Token verification error:', error);
    return null;
  }
}

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
    
    try {
      const decoded = verifyToken(token);
      console.log('Token decoded:', decoded);
      
      if (!decoded) {
        console.log('Invalid token, redirecting to login');
        const loginUrl = new URL('/login', request.url);
        loginUrl.searchParams.set('redirect', request.nextUrl.pathname);
        return NextResponse.redirect(loginUrl);
      }
      
      if (decoded.role !== 'admin' && decoded.role !== 'moderator') {
        console.log('User not admin/moderator, redirecting to homepage');
        return NextResponse.redirect(new URL('/', request.url));
      }
      
      // Admin access granted - continue
      console.log('Admin access granted');
      return NextResponse.next();
    } catch (error) {
      console.error('Middleware error:', error);
      // Invalid token - redirect to login
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
