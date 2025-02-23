"use client";
import { useState } from "react";
import "./EmailInput.css"; 
import "../components/tab";
import Tabbar from "../components/tab";
import Link from "next/link";


export default function EmailInput() {
  const [Email, setEmail] = useState("");

  return (
        <>
          <Tabbar />
    <div className="email-container">
      <div className="email-overlay">
        <div className="email-box">
          <h2 className="text-lg font-semibold mb-4">กรุณาใส่อีเมลของคุณ</h2>

          <input
            type="text"
            className="email-input"
            onChange={(e) => setEmail(e.target.value)}
          />

          <p className="email-warning">
            ⚠ ระบบจะทำการส่ง OTP ไปยังอีเมลที่คุณกรอกด้านบน
          </p>

          
            <Link
              href="/OTPnum"
              style={{ textDecoration: "none", color: "inherit" }}
            >
              <button className="email-button">ยืนยัน</button>
            </Link>
          
        </div>
      </div>
    </div>
    </>
  );
}
