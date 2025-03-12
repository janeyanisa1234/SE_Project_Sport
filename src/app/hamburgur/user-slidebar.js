"use client";

import { useState, useEffect } from "react";
import "./slidebar.css";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { AuthService } from "../utils/auth"; // Adjust the path as needed

export default function Sidebar({ isOpen, setIsOpen }) {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [userRole, setUserRole] = useState("user");
  
  useEffect(() => {
    // Load user data when component mounts
    const currentUser = AuthService.getCurrentUser();
    if (currentUser) {
      setUser(currentUser);
      setUserRole(AuthService.getUserRole());
    } else {
      // If no user is found, redirect to login
      router.push("/Login");
    }
  }, [router]);

  const closeSidebar = () => {
    if (setIsOpen) setIsOpen(false);
  };

  const handleLogout = () => {
    // Call the logout method from AuthService
    AuthService.logout();
    // Router redirect will be handled inside the AuthService.logout() method
  };

  // Function to get role display name in Thai
  const getRoleDisplayName = (role) => {
    switch(role) {
      case 'admin':
        return 'ผู้ดูแลระบบ';
      case 'owner':
        return 'ผู้ประกอบการ';
      case 'user':
      default:
        return 'ผู้ใช้งาน';
    }
  };

  return (
    <div className={`sidebar ${isOpen ? "open" : ""}`}>
      {/* โลโก้ */}
      <h1 className="logo" onClick={closeSidebar}>
        SPORTFLOW
      </h1>

      <hr />

      {/* เมนู */}
      <ul>
      <Link href="/Info" className="sidebar-link">
        <li>
          <img src="/picturepalm/profile.svg" alt="iconprofile" />
          <div>
            <span style={{ color: "white" }}>{user?.name || "Loading..."}</span>
            <br />
            <small style={{ color: "white" }}>{getRoleDisplayName(userRole)}</small>
          </div>
        </li>
      </Link>

      <Link href="/Homepage/history" className="sidebar-link">
        <li>
        <img src="/picturepalm/history.svg" alt="iconhistory" />
        ประวัติการจอง
        </li>
      </Link>
        
      <Link href="/Homepage/cancle" className="sidebar-link" >
        <li>
          <img src="/picturepalm/cancle.svg" alt="iconbin" />
           ยกเลิกการจองสนาม
        </li>
      </Link>

      <Link href="/about" className="sidebar-link" >
        <li>
          <img src="/picturepalm/aboutme.svg" alt="iconabout" />
          เกี่ยวกับเรา
        </li>
      </Link>
      </ul>

      {/* ปุ่มออกจากระบบ */}
      <button className="logout" onClick={handleLogout}>
        <img src="/pictureAdmin/logout.svg" alt="logout" /> ออกจากระบบ
      </button>
    </div>
  );
}