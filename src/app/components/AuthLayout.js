// components/AuthLayout.js
"use client";

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { AuthService } from '../utils/auth';

// Paths that require authentication
const protectedPaths = ['/Homepage', '/Profile', '/Info', '/cancle', '/about'];

// Paths that are only for non-authenticated users
const authPaths = ['/Login', '/Login/Registration'];

// Paths that require admin role
const adminPaths = ['/Homeadmin', '/Admin'];

// Paths that require owner role
const ownerPaths = ['/my-stadium', '/promotion', '/owner-stats', '/owner-reportbooking', '/money'];

export default function AuthLayout({ children }) {
  const router = useRouter();
  const pathname = usePathname();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check authentication status
    const isAuthenticated = AuthService.isAuthenticated();
    const userRole = AuthService.getUserRole();
    
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

    if (isProtectedPath && !isAuthenticated) {
      // Redirect to login if trying to access protected path without auth
      router.push('/Login');
    } else if (isAuthPath && isAuthenticated) {
      // Redirect to homepage if trying to access auth path while authenticated
      router.push('/Homepage');
    } else if (isAdminPath && (!isAuthenticated || userRole !== 'admin')) {
      // Redirect non-admin users trying to access admin paths
      router.push('/Login');
    } else if (isOwnerPath && (!isAuthenticated || userRole !== 'owner')) {
      // Redirect non-owner users trying to access owner paths
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