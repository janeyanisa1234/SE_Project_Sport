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
  // Add this missing state variable at the top with your other state variables
    const [isPopupVisible, setIsPopupVisible] = useState(false);
  const handleLogin = async (e) => {
    e.preventDefault();
    
    // Reset error and success states
    setError("");
    setSuccess("");
    
    // Enhanced validation to include robot check
    if (!email || !password) {
      setError("กรุณากรอกอีเมลและรหัสผ่าน");
      return;
    }
    
    if (!rememberMe) {
      setError("กรุณายืนยันว่าคุณไม่ใช่ระบบอัตโนมัติ");
      return;
    }
    
    try {
      setLoading(true);
      
      // Add debugging logs
      console.log("Attempting login with:", { email, password });
      console.log("API URL:", `${API_URL}/login`);
      
      // Add headers explicitly to match Postman
      const response = await axios.post(`${API_URL}/login`, 
        { email, password },
        { 
          headers: { 
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          },
          // Add timeout to prevent hanging requests
          timeout: 5000
        }
      );
      
      console.log("Login response:", response.data);
      
      // Handle successful login
      if (response.data && response.data.token) {
        // Store token in localStorage or a more secure method like HttpOnly cookies
        localStorage.setItem("token", response.data.token);
        localStorage.setItem("user", JSON.stringify(response.data.user));
        
        // Store user role in localStorage
        let userRole = "user";
        if (response.data.user.isOwner) {
          userRole = "owner";
        } else if (response.data.user.isAdmin) {
          userRole = "admin";
        }
        localStorage.setItem("userRole", userRole);
        // แสดง Popup "เข้าสู่ระบบแล้ว" ก่อน
        setIsPopupVisible(true);
        
        // เพิ่ม alert ก่อนเปลี่ยนหน้า
        alert("คุณได้เข้าสู่ระบบแล้ว");
        
        // ใช้ setTimeout เพื่อให้ Popup แสดงก่อนจะไปหน้าใหม่
        setTimeout(() => {
          // Redirect based on user role
          if (response.data.user.isAdmin) {
            router.push("/Homeadmin"); // Redirect admins to admin dashboard
          } else if (response.data.user.isOwner) {
            router.push("/my-stadium"); // Redirect owners to owner dashboard
          } else {
            router.push("/Homepage"); // Redirect regular users to homepage
          }
        }, 2000); // 2 วินาทีหลังจากแสดง Popup
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