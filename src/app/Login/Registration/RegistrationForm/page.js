"use client"; 
import Link from "next/link";
import React from "react";
import Image from "next/image"; // ✅ นำเข้า Image จาก Next.js
import "./RegistrationForm.css";
import Tab from "../../../ice/Tabbar/Tabbar";
import "../../../ice/Admin/slidebar";
import Sidebar from "../../../ice/Admin/slidebar.js";

const RegistrationForm = () => {
  return (
    <>
      <Tab />
      <Sidebar />
      <div className="registration-container">
        <div className="registration-overlay">
          <div className="registration-box">
            <div className="icon-container">
              {/* ✅ ใช้ Next.js Image */}
              <Image
                src="/pictureice/logo (4).png"
                alt="Admin Icon"
                width={70}
                height={50}
                className="user-icon"
                priority
              />
              <h1 className="title">ลงทะเบียน</h1>
            </div>
            <form>
              <div className="input-group">
                <label htmlFor="name">ชื่อ-นามสกุล</label>
                <input type="text" placeholder="ชื่อ-นามสกุล" />
              </div>

              <div className="input-group">
                <label htmlFor="email">อีเมล</label>
                <input type="email" placeholder="อีเมล" />
              </div>

              <div className="input-group">
                <label htmlFor="phone">เบอร์โทรศัพท์</label>
                <input type="tel" placeholder="เบอร์โทรศัพท์" />
              </div>

              <div className="input-group">
                <label htmlFor="password">ตั้งรหัสผ่าน</label>
                <input type="password" placeholder="ตั้งรหัสผ่าน" />
              </div>

              <div className="input-group">
                <label htmlFor="confirmPassword">ยืนยันรหัสผ่าน</label>
                <input type="password" placeholder="ยืนยันรหัสผ่าน" />
              </div>

              <div className="checkbox-group">
                <input type="checkbox" id="terms" />
                <label htmlFor="terms">ฉันไม่ใช่ระบบอัตโนมัติ</label>
              </div>

              <Link href={"/Login"}>
                <button type="submit" className="submit-button">
                  ยืนยันข้อมูล
                </button>
              </Link>
              
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default RegistrationForm;
