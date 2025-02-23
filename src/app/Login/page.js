"use client";

import { useState } from "react";
import Image from "next/image"; // ✅ Import Image จาก Next.js
import "./Login.css";
import Tabbar from "../Tab/tab"; 


import Link from "next/link"; 

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);

  return (
    <>
      <Tabbar />
    
      <div className="login-container">
        <div className="overlay">
          <div className="login-box">
            <div className="profile-icon">
              <Image src="/pictureice/logo (1).png" alt="Admin Icon" width={70} height={70} />
            </div>
            <h2 className="title">เข้าสู่ระบบ</h2>
            <form className="login-form">
              <div className="input-group">
                <label>อีเมล</label>
                <input
                  type="email"
                  className="input-field"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div className="input-group">
                <label>รหัสผ่าน</label>
                <input
                  type="password"
                  className="input-field"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
              <div className="remember-me">
                <input
                  type="checkbox"
                  id="rememberMe"
                  checked={rememberMe}
                  onChange={() => setRememberMe(!rememberMe)}
                />
                <label htmlFor="rememberMe">ฉันไม่ใช่ระบบอัตโนมัติ</label>
                <a href="#" className="forgot-password">ลืมรหัสผ่าน</a>
              </div>
              <div className="button-group">
                
                <Link href={"/Login/Registration"}>
                  <button className="btn">ลงทะเบียน</button>
                </Link>

                <Link href={"/Homepage"}>
                  <button className="btn">เข้าสู่ระบบ</button>
                </Link>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}
