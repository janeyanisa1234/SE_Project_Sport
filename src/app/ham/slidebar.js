"use client";

import { useState } from "react";
import "./ham.css";
import Link from "next/link";

export default function Sidebar({ isOpen, setIsOpen }) {
  const closeSidebar = () => setIsOpen(false);

  return (
    <div className={`sidebar ${isOpen ? "open" : ""}`}>
      {/* โลโก้ */}
      <h1 className="logo" onClick={closeSidebar}>
        SPORTFLOW
      </h1>

      <hr />

      {/* เมนู */}
      <ul>
    

    

        
      <Link href="/Login" className="sidebar-link">
        <li>
            <img src="/picturepalm/history.svg" alt="iconhistory" />
            เข้าสู่ระบบ
        </li>
      </Link>
        

      

        <Link href="/about" className="sidebar-link">
          <li>
            <img src="/picturepalm/aboutme.svg" alt="iconabout" />
            เกี่ยวกับเรา
          </li>
        </Link>
        
      </ul>

      
    </div>
  );
}
