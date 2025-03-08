"use client";
import { Eye, EyeOff } from "lucide-react";
import Image from "next/image";
import "./profile.css";
import Tab from "../Tabbar/page.js";
import "../Dashboard/slidebar.css";
import React, { useState } from "react";
import Sidebar from "../Dashboard/slidebar.js";
import Link from 'next/link';

export default function Admin() {
  const [showPassword, setShowPassword] = useState(false);
  const password = "jane1234";

  return (
    <>
      <Tab />
      <Sidebar/>
      <div className="admin-container" >
        <div className="admin-overlay">
          <div className="admin-card">
            <div className="admin-user-icon">
              <Image src="/pictureice/Admin.svg" alt="Admin Icon" width={70} height={50} />
            </div>

            <h2 className="admin-title">ผู้ดูแลระบบ</h2>
            <p className="admin-text"><strong>ชื่อ : </strong></p>
            <p className="admin-text"><strong>อีเมล : </strong></p>
            <p className="admin-text"><strong>เบอร์โทร : </strong></p>

            <div className="admin-password-container">
            <p className="admin-text">
            <strong>รหัสผ่าน : </strong> {showPassword ? "" : "********"}</p>
            <button onClick={() => setShowPassword(!showPassword)} className="toggle-btn">
            
                {showPassword ? (
                  <EyeOff size={24} className="text-black" />
                ) : (
                  <Eye size={24} className="text-black" />
                )}
              </button>
            </div>
            <Link href="/Homeadmin/Profile/changpass" passHref>
            <button className="admin-button">
              เปลี่ยนรหัสผ่าน
            </button>
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
