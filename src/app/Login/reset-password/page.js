"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import axios from "axios";
import "../Login.css";

export default function ResetPassword() {
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [token, setToken] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  
  // Base URL for your API
  const API_URL = "http://localhost:5000/api/kong";
  
  useEffect(() => {
    // Get token from URL
    const urlToken = searchParams.get("token");
    if (urlToken) {
      console.log("Token from URL:", urlToken); // Add this to debug
      setToken(urlToken);
    } else {
      setError("โทเคนรีเซ็ตรหัสผ่านไม่ถูกต้องหรือไม่พบในลิงก์");
    }
  }, [searchParams]);
  
  const handleResetPassword = async (e) => {
    e.preventDefault();
    
    // Reset error and success states
    setError("");
    setSuccess("");
    
    // Basic validation
    if (!newPassword || !confirmPassword) {
      setError("กรุณากรอกรหัสผ่านใหม่และยืนยันรหัสผ่าน");
      return;
    }
    
    if (newPassword !== confirmPassword) {
      setError("รหัสผ่านและการยืนยันรหัสผ่านไม่ตรงกัน");
      return;
    }
    
    if (newPassword.length < 6) {
      setError("รหัสผ่านต้องมีความยาวอย่างน้อย 6 ตัวอักษร");
      return;
    }
    
    if (!token) {
      setError("โทเคนรีเซ็ตรหัสผ่านไม่ถูกต้อง");
      return;
    }
    
    try {
      setLoading(true);
      
      // Make API request to reset-password endpoint
      const response = await axios.post(`${API_URL}/reset-password`, {
        token,
        newPassword
      });
      
      // Display success message
      setSuccess("รีเซ็ตรหัสผ่านสำเร็จ คุณสามารถเข้าสู่ระบบด้วยรหัสผ่านใหม่ได้แล้ว");
      
      // Clear form
      setNewPassword("");
      setConfirmPassword("");
      
      // Redirect to login page after 3 seconds
      setTimeout(() => {
        router.push("/Login");
      }, 3000);
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
    <div className="login-container">
      <div className="overlay">
        <div className="login-box">
          <div className="profile-icon">
            <Image src="/pictureice/logo (1).png" alt="Logo" width={70} height={70} />
          </div>
          <h2 className="title">รีเซ็ตรหัสผ่าน</h2>
          
          {error && <div className="error-message">{error}</div>}
          {success && <div className="success-message">{success}</div>}
          
          <form className="login-form" onSubmit={handleResetPassword}>
            <div className="input-group">
              <label>รหัสผ่านใหม่</label>
              <input
                type="password"
                className="input-field"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="กรอกรหัสผ่านใหม่"
              />
            </div>
            <div className="input-group">
              <label>ยืนยันรหัสผ่านใหม่</label>
              <input
                type="password"
                className="input-field"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="กรอกรหัสผ่านใหม่อีกครั้ง"
              />
            </div>
            <div className="button-group">
              <Link href="/Login">
                <button type="button" className="btn">
                  กลับไปหน้าเข้าสู่ระบบ
                </button>
              </Link>
              <button 
                type="submit" 
                className="btn"
                disabled={loading}
              >
                {loading ? "กำลังดำเนินการ..." : "รีเซ็ตรหัสผ่าน"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}