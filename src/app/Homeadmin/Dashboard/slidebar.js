"use client";

import { useState, useEffect } from "react";
import "./slidebar.css";
import Link from "next/link";
import { AuthService } from "../../utils/auth";
import { useRouter } from "next/navigation";

export default function Sidebar({ isOpen, setIsOpen }) {
  const [userName, setUserName] = useState("ผู้ดูแลระบบ");
  const router = useRouter();
  
  useEffect(() => {
    // Load user data when component mounts
    const currentUser = AuthService.getCurrentUser();
    if (currentUser && currentUser.name) {
      setUserName(currentUser.name);
    }
  }, []);
  
  const closeSidebar = () => setIsOpen(false);
  
  const handleLogout = () => {
    // Remove user data from localStorage
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('userRole');
    
    // Redirect to login page
    router.push('/Login');
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
        <Link href="/Homeadmin" className="sidebar-link">
          <li>
            <img src="/pictureAdmin/user.svg" alt="iconprofile" />
            <div>
              <span style={{ color: "white" }}>{userName}</span>
              <br />
              <small style={{ color: "white" }}>ผู้ดูแลระบบ</small>
            </div>
          </li>
        </Link>

        {/* Existing menu items remain unchanged */}
        <Link href="/Homeadmin/Approved" className="sidebar-link">
          <li>
            <img src="/pictureAdmin/approve.svg" alt="iconhistory" />
            อนุมัติสนาม
          </li>
        </Link>

        <Link href="/Homeadmin/People" className="sidebar-link">
          <li>
            <img src="/pictureAdmin/people.svg" alt="iconbin" />
            จัดการบุคคล
          </li>
        </Link>

        <Link href="/Homeadmin/Manage_Cash" className="sidebar-link">
          <li>
            <img src="/pictureAdmin/stadium.svg" alt="iconbin" />
            จัดการเงิน
          </li>
        </Link>

        <Link href="/Homeadmin/Manage_Refunds" className="sidebar-link">
          <li>
            <img src="/pictureAdmin/finance.svg" alt="iconbin" />
            จัดการคำขอยกเลิก
          </li>
        </Link>

        <Link href="/Homeadmin/Dashboard" className="sidebar-link">
          <li>
            <img src="/pictureAdmin/dashboard.svg" alt="iconbin" />
            แดชบอร์ด
          </li>
        </Link>

        <Link href="/Homeadmin/Communication" className="sidebar-link">
          <li>
            <img src="/pictureAdmin/message.svg" alt="iconbin" />
            การสื่อสาร
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
