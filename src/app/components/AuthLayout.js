"use client";

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { AuthService } from '../utils/auth';

// Paths that require authentication (any logged-in user)
const protectedPaths = ['/Homepage'];

// Paths that are only for non-authenticated users
const authPaths = ['/Login', '/Login/Registration'];

// Paths that require admin role
const adminPaths = ['/Homeadmin'];

// Paths that require owner role
const ownerPaths = ['/my-stadium', '/ownerProfile', '/owner-reportbooking', '/owner-stats', '/promotion', '/create-promotion', '/detail', '/add', '/edit', '/money'];

// Paths that require normal user role
const userPaths = ['/Info', '/cancle'];

// Paths that are accessible to everyone (public paths)
const publicPaths = ['/about', '/HitPlace-no-login', '/PromotionPlace-no-login', '/Search-nologin', '/reset-password'];

export default function AuthLayout({ children }) {
  const router = useRouter();
  const pathname = usePathname();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check authentication status
    const isAuthenticated = AuthService.isAuthenticated();
    const userRole = AuthService.getUserRole();
    
    // Check if current path matches any of our defined path categories
    const isProtectedPath = protectedPaths.some(path => 
      pathname === path || pathname.startsWith(`${path}/`)
    );
    
    const isAuthPath = authPaths.some(path => 
      pathname === path || pathname.startsWith(`${path}/`)
    );
    
    const isAdminPath = adminPaths.some(path => 
      pathname === path || pathname.startsWith(`${path}/`)
    );
    
    const isOwnerPath = ownerPaths.some(path => 
      pathname === path || pathname.startsWith(`${path}/`)
    );
    
    const isUserPath = userPaths.some(path => 
      pathname === path || pathname.startsWith(`${path}/`)
    );
    
    const isPublicPath = publicPaths.some(path => 
      pathname === path || pathname.startsWith(`${path}/`)
    );

    // Skip authentication checks for public paths
    if (isPublicPath) {
      setIsLoading(false);
      return;
    }

    // Handle redirects based on authentication status and user role
    if (isProtectedPath && !isAuthenticated) {
      // Redirect to login if trying to access protected path without auth
      router.push('/Login');
    } else if (isAuthPath && isAuthenticated) {
      // Redirect to appropriate homepage based on user role when logged in
      if (userRole === 'admin') {
        router.push('/Homeadmin');
      } else if (userRole === 'owner') {
        router.push('/my-stadium');
      } else {
        router.push('/Homepage');
      }
    } else if (isAdminPath && (!isAuthenticated || userRole !== 'admin')) {
      // Redirect non-admin users trying to access admin paths
      router.push('/Login');
    } else if (isOwnerPath && (!isAuthenticated || userRole !== 'owner')) {
      // Redirect non-owner users trying to access owner paths
      router.push('/Login');
    } else if (isUserPath && (!isAuthenticated || userRole !== 'user')) {
      // Redirect non-regular users trying to access user-specific paths
      router.push('/Login');
    }

    setIsLoading(false);
  }, [pathname, router]);

  if (isLoading) {
    // You can replace this with a loading spinner component
    return <div>Loading...</div>;
  }

  return <>{children}</>;
}