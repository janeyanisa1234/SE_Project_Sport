"use client";

import { useState, useEffect } from "react";
import "./slidebar.css";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { AuthService } from "../utils/auth"; // Adjust the path as needed

export default function Sidebar({ isOpen, setIsOpen }) {
  const router = useRouter();
  const [user, setUser] = useState(null);
  
  useEffect(() => {
    // Load user data when component mounts
    const currentUser = AuthService.getCurrentUser();
    if (currentUser) {
      setUser(currentUser);
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
            <small style={{ color: "white" }}>UID : {user?.id?.substring(0, 8) || "xxxxxxxx"}</small>
          </div>
        </li>
      </Link>

      <Link href="/Homepage/Search/Select/payment-qr/payment-confirm/history" className="sidebar-link">
        <li>
        <img src="/picturepalm/history.svg" alt="iconhistory" />
        ประวัติการจอง
        </li>
      </Link>
        
      <Link href="/cancle" className="sidebar-link" >
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