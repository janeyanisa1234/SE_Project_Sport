"use client";

import { useState } from "react";
import Image from "next/image";
import "./Login.css";
import Tabbar from "../tabbar-nologin/tab";
import Link from "next/link";
import axios from "axios";
import { useRouter } from "next/navigation";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const [isForgotPassword, setIsForgotPassword] = useState(false);
  const router = useRouter();

  // Base URL for your API
  const API_URL = "http://localhost:5000/api/kong";

  const handleLogin = async (e) => {
    e.preventDefault();
    
    // Reset error and success states
    setError("");
    setSuccess("");
    
    // Basic validation
    if (!email || !password) {
      setError("กรุณากรอกอีเมลและรหัสผ่าน");
      return;
    }
    
    try {
      setLoading(true);
      
      // Make API request to login endpoint
      const response = await axios.post(`${API_URL}/login`, {
        email,
        password
      });
      
      // Handle successful login
      if (response.data && response.data.token) {
        // Store token in localStorage or a more secure method like HttpOnly cookies
        localStorage.setItem("token", response.data.token);
        localStorage.setItem("user", JSON.stringify(response.data.user));
        
        // Check if user is an owner and redirect accordingly
        if (response.data.user.isOwner) {
          router.push("/my-stadium"); // Redirect owners to owner dashboard
        } else {
          router.push("/Homepage"); // Redirect regular users to homepage
        }
      }
    } catch (err) {
      // Handle login error
      if (err.response && err.response.data) {
        setError(err.response.data.error || "เข้าสู่ระบบล้มเหลว กรุณาลองอีกครั้ง");
      } else {
        setError("เกิดข้อผิดพลาดในการเชื่อมต่อกับเซิร์ฟเวอร์");
      }
    } finally {
      setLoading(false);
    }
  };

  const toggleForgotPassword = () => {
    setIsForgotPassword(!isForgotPassword);
    setError("");
    setSuccess("");
  };

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    
    // Reset error and success states
    setError("");
    setSuccess("");
    
    // Basic validation
    if (!email) {
      setError("กรุณากรอกอีเมล");
      return;
    }
    
    try {
      setLoading(true);
      
      // Make API request to forgot-password endpoint
      const response = await axios.post(`${API_URL}/forgot-password`, {
        email
      });
      
      // Display success message
      setSuccess("หากอีเมลของคุณลงทะเบียนในระบบ คุณจะได้รับลิงก์สำหรับรีเซ็ตรหัสผ่านทางอีเมล");
    } catch (err) {
      // Handle error
      if (err.response && err.response.data) {
        setError(err.response.data.error || "เกิดข้อผิดพลาด กรุณาลองอีกครั้ง");
      } else {
        setError("เกิดข้อผิดพลาดในการเชื่อมต่อกับเซิร์ฟเวอร์");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Tabbar />
    
      <div className="login-container">
        <div className="overlay">
          <div className="login-box">
            <div className="profile-icon">
              <Image src="/pictureice/logo (1).png" alt="Admin Icon" width={70} height={70} />
            </div>
            <h2 className="title">
              {isForgotPassword ? "รีเซ็ตรหัสผ่าน" : "เข้าสู่ระบบ"}
            </h2>
            
            {error && <div className="error-message">{error}</div>}
            {success && <div className="success-message">{success}</div>}
            
            {isForgotPassword ? (
              <form className="login-form" onSubmit={handleForgotPassword}>
                <div className="input-group">
                  <label>อีเมล</label>
                  <input
                    type="email"
                    className="input-field"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="กรอกอีเมลของคุณ"
                  />
                </div>
                <div className="button-group">
                  <button 
                    type="button" 
                    className="btn"
                    onClick={toggleForgotPassword}
                  >
                    กลับไปหน้าเข้าสู่ระบบ
                  </button>
                  <button 
                    type="submit" 
                    className="btn"
                    disabled={loading}
                  >
                    {loading ? "กำลังส่งอีเมล..." : "ส่งลิงก์รีเซ็ตรหัสผ่าน"}
                  </button>
                </div>
              </form>
            ) : (
              <form className="login-form" onSubmit={handleLogin}>
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
                  <button 
                    type="button"
                    className="forgot-password"
                    onClick={toggleForgotPassword}
                  >
                    ลืมรหัสผ่าน
                  </button>
                </div>
                <div className="button-group">
                  <Link href={"/Login/Registration"}>
                    <button type="button" className="btn">ลงทะเบียน</button>
                  </Link>

                  <button 
                    type="submit" 
                    className="btn"
                    disabled={loading}
                  >
                    {loading ? "กำลังเข้าสู่ระบบ..." : "เข้าสู่ระบบ"}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </>
  );
}