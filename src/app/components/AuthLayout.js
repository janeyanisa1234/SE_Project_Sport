// components/AuthLayout.js
"use client";

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { AuthService } from '../utils/auth';

// Paths that require authentication
const protectedPaths = ['/Homepage', '/Profile', '/Admin', '/Info', '/cancle', '/about'];

// Paths that are only for non-authenticated users
const authPaths = ['/Login', '/Login/Registration'];

export default function AuthLayout({ children }) {
  const router = useRouter();
  const pathname = usePathname();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check authentication status
    const isAuthenticated = AuthService.isAuthenticated();
    const isProtectedPath = protectedPaths.some(path => 
      pathname === path || pathname.startsWith(`${path}/`)
    );
    const isAuthPath = authPaths.some(path => 
      pathname === path || pathname.startsWith(`${path}/`)
    );

    if (isProtectedPath && !isAuthenticated) {
      // Redirect to login if trying to access protected path without auth
      router.push('/Login');
    } else if (isAuthPath && isAuthenticated) {
      // Redirect to homepage if trying to access auth path while authenticated
      router.push('/Homepage');
    }

    setIsLoading(false);
  }, [pathname, router]);

  if (isLoading) {
    // You can replace this with a loading spinner component
    return <div>Loading...</div>;
  }

  return <>{children}</>;
}