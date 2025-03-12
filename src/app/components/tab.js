"use client";

import "./tab.css";
import React, { useState, useEffect } from "react";
import "../components/slidebarsoc.css";
import OwnerSlidebar from "./owner-slidebar";
import UserSlidebar from "../hamburgur/user-slidebar";
import AdminSlidebar from "../Homeadmin/Dashboard/slidebar";
import Link from "next/link";
import { AuthService } from "../utils/auth";

export default function Tab() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [userRole, setUserRole] = useState(null);

  useEffect(() => {
    // Get user role from AuthService when component mounts
    // Only set the role if the user is authenticated
    if (AuthService.isAuthenticated()) {
      const role = AuthService.getUserRole();
      setUserRole(role);
    }
  }, []);

  // Function to toggle sidebar open/close
  const toggleSidebar = () => {
    setIsSidebarOpen((prev) => !prev);
  };
  
  // Render the appropriate sidebar based on user role
  const renderSidebar = () => {
    // If user is not authenticated, don't render any sidebar
    if (!userRole) {
      return null;
    }
    
    switch(userRole) {
      case 'admin':
        return <AdminSlidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />;
      case 'owner':
        return <OwnerSlidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />;
      case 'user':
      default:
        return <UserSlidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />;
    }
  };
  
  return (
    <>
      {/* Render the appropriate sidebar based on user role */}
      {renderSidebar()}

      {/* Tabbar (แท็บด้านบน) */}
      <div>
        <h1 className="tabbar">
          {/* ปุ่มแฮมเบอร์เกอร์ (เปิด-ปิด Sidebar) */}
          <img
            src="/pictureowner/hambur.jpg"
            alt="Hamburger"
            className="hamburgur"
            onClick={toggleSidebar}
          />

          {/* ปุ่มกลับหน้าแรก */}
          <Link href="/my-stadium">
            <img src="/pictureowner/home.jpg" alt="Home" className="home" />
          </Link>

          SPORTFLOW
        </h1>
      </div>
    </>
  );
}
