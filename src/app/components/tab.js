"use client";

import "./tab.css";
import React, { useState } from "react";
import "../components/slidebarsoc.css";
import Slidebar from "../components/slidebar";
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
      <Slidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />

      {/* Tabbar (แท็บด้านบน) */}
      <div>
        <h1 className="tabbar">
          {/* ปุ่มแฮมเบอร์เกอร์ (เปิด-ปิด Sidebar) */}
          <img
            src="/pictureowner/hambur.jpg"
            alt="Hamburger"
            className="hamburgur"
            onClick={toggleSidebar} // ใช้ toggleSidebar แทน setIsSidebarOpen
          />

          {/* ปุ่มกลับหน้าแรก */}
          <Link href="/Homepage">
            <img src="/pictureowner/home.jpg" alt="Home" className="home" />
          </Link>

          SPORTFLOW
        </h1>
      </div>
    </>
  );
}
