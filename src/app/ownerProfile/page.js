"use client"; 

import { useState } from "react";
import { Eye, EyeOff } from "lucide-react"; 
import Image from "next/image"; // ✅ Import Image จาก Next.js
import "./ownerProfile.css"; 
import Tabbar from "../components/tab";

export default function Profile() {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <>
      <Tabbar />

      
      <div className="profile-container">
        <div className="profile-overlay">
          <div className="profile-box">
            
            <div className="admin-user-icon">
              <Image src="/pictureice/logo (1).png" alt="Admin Icon" width={70} height={50} />
            </div>

            <h2 className="text-2xl font-semibold mb-4">ผู้ประกอบการ</h2>
            
            <p className="profile-text"><strong>ชื่อ : </strong></p>
            <p className="profile-text"><strong>อีเมล : </strong></p>
            <p className="profile-text"><strong>เบอร์โทร : </strong></p>

            <div className="profile-password">
              <p className="mr-2"><strong>รหัสผ่าน : </strong> {showPassword ? "" : "********"}</p>
              <button onClick={() => setShowPassword(!showPassword)} className="toggle-btn">
                {showPassword ? <EyeOff size={24} className="icon" /> : <Eye size={24} className="icon" />}
              </button>
            </div>

            <p className="profile-text"><strong>ชื่อธนาคาร : </strong></p>
            <p className="profile-text"><strong>เลขบัญชีธนาคาร : </strong></p>

            <button className="profile-button">เปลี่ยนรหัสผ่าน</button>

          </div>
        </div>
      </div>
    </>
  );
}
