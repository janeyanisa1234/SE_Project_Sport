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
    <div className="relative min-h-screen">
      <Tab />
      <Sidebar />
      
      <div 
        className="admin-container" 
        style={{ backgroundImage: "url('/pictureAdmin/stadium-bg.jpg')" }}
      >
        <div className="admin-overlay">
          <div className="admin-card">
            <div className="admin-user-icon">
              <Image 
                src="/pictureAdmin/Admin.svg" 
                alt="Admin Icon" 
                width={50} 
                height={50}
                priority
              />
            </div>

            <h2 className="admin-heading">ผู้ดูแลระบบ</h2>

            <div className="admin-info">
              <p className="admin-text">
                <strong>ชื่อ : </strong>
                <span>-</span>
              </p>
              
              <p className="admin-text">
                <strong>อีเมล : </strong>
                <span>-</span>
              </p>
              
              <p className="admin-text">
                <strong>เบอร์โทร : </strong>
                <span>-</span>
              </p>

              <div className="profile-password">
                <p>
                  <strong>รหัสผ่าน : </strong>
                  <span>{showPassword ? password : "********"}</span>
                </p>
                <button 
                  onClick={() => setShowPassword(!showPassword)}
                  className="password-toggle"
                  aria-label={showPassword ? "ซ่อนรหัสผ่าน" : "แสดงรหัสผ่าน"}
                >
                  {showPassword ? (
                    <EyeOff size={20} />
                  ) : (
                    <Eye size={20} />
                  )}
                </button>
              </div>
            </div>

            <Link href="/Homeadmin/Profile/changpass" passHref>
            <button className="admin-button">
              เปลี่ยนรหัสผ่าน
            </button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}