// components/SidebarSelector.js
"use client";

import { useState, useEffect } from "react";
import UserSidebar from "../hamburgur/user-slidebar";
import OwnerSidebar from "./owner-slidebar";
import { AuthService } from "../utils/auth";
import "../components/slidebarsoc.css";
import "./tab.css";

export default function SidebarSelector({ isOpen, setIsOpen }) {
  const [userRole, setUserRole] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Get current user and determine role
    const currentUser = AuthService.getCurrentUser();
    if (currentUser) {
      setUserRole(currentUser.isOwner ? "owner" : "user");
    }
    setLoading(false);
  }, []);

  // Show loading while determining user role
  if (loading) {
    return <div>Loading sidebar...</div>;
  }

  // Render the appropriate sidebar based on user role
  if (userRole === "owner") {
    return <OwnerSidebar isOpen={isOpen} setIsOpen={setIsOpen} />;
  } else {
    return <UserSidebar isOpen={isOpen} setIsOpen={setIsOpen} />;
  }
}