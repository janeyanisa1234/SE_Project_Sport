"use client";


import { Eye, EyeOff } from "lucide-react";
import Image from "next/image"; // เพิ่มการ import นี้
import "./profile.css"; 
import Tab from "../Tabbar/page.js";
import "../Dashboard/slidebar.css";
import React, { useState } from "react";
import Sidebar from "../Dashboard/slidebar.js";


export default function Admin() {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <>
      <Tab />
      <Sidebar/>
      <div className="admin-container" style={{ backgroundImage: "url('/pictureAdmin/stadium-bg.jpg')" }}>
        <div className="admin-overlay">
          <div className="admin-card">
            <div className="admin-user-icon">
              <Image src="/pictureAdmin/Admin.svg" alt="Admin Icon" width={50} height={50} />
            </div>

            <h2 className="text-2xl font-semibold mb-4 text-center">ผู้ดูแลระบบ</h2>
            <p className="admin-text"><strong>ชื่อ : </strong></p>
            <p className="admin-text"><strong>อีเมล : </strong></p>
            <p className="admin-text"><strong>เบอร์โทร : </strong></p>

            <div className="admin-password-container">
              <p><strong>รหัสผ่าน : </strong> {showPassword ? "" : "********"}</p>
              <button onClick={() => setShowPassword(!showPassword)}>
                {/* เพิ่มคลาส text-black เพื่อเปลี่ยนสีไอคอนเป็นสีดำ */}
                {showPassword ? (
                  <EyeOff size={24} className="text-black" />
                ) : (
                  <Eye size={24} className="text-black" />
                )}
              </button>
            </div>

            <button className="admin-button">เปลี่ยนรหัสผ่าน</button>
          </div>
        </div>
      </div>
    </>
  );
}
