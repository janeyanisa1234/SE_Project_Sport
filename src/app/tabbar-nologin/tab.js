"use client";

import "./tab.css";
import React, { useState } from "react";
import "../ham/slidebar";
import Sidebar from "../ham/slidebar";
import Link from "next/link";


export default function Tab() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // ฟังก์ชัน toggle เปิด-ปิด Sidebar
  const toggleSidebar = () => {
    setIsSidebarOpen((prev) => !prev);
  };

  return (
    <>
      {/* Sidebar */}
      <Sidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />

      {/* Tabbar (แท็บด้านบน) */}
      <div>
        <h1 className="tabbar">
          {/* ปุ่มแฮมเบอร์เกอร์ (เปิด-ปิด Sidebar) */}
          <img
            src="/picturepalm/hambur.jpg"
            alt="Hamburger"
            className="ham"
            onClick={toggleSidebar} // ใช้ toggleSidebar แทน setIsSidebarOpen
          />

          {/* ปุ่มกลับหน้าแรก */}
          <Link href="/">
            <img src="/picturepalm/home.jpg" alt="Home" className="home" />
          </Link>

          SPORTFLOW
        </h1>
      </div>
    </>
  );
}
