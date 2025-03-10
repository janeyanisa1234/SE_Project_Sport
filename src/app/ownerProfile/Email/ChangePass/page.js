"use client";

import Link from "next/link";
import React, { useState, useEffect } from "react";
import "./ChangePass.css"; 
import Tabbar from "../../../components/tab"; 
import axios from "axios";
import { useRouter, useSearchParams } from "next/navigation";

export default function ChangePassword() {
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [token, setToken] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const API_URL = "http://localhost:5000/api/kong";

  useEffect(() => {
    // Get token from URL
    const urlToken = searchParams.get("token");
    if (urlToken) {
      setToken(urlToken);
    }
  }, [searchParams]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Reset error state
    setError("");
    
    // Validate passwords
    if (newPassword !== confirmNewPassword) {
      setError("รหัสผ่านใหม่ไม่ตรงกัน");
      return;
    }
    
    // Validate password length
    if (newPassword.length < 6) {
      setError("รหัสผ่านต้องมีความยาวอย่างน้อย 6 ตัวอักษร");
      return;
    }
    
    // Validate token
    if (!token) {
      setError("ไม่พบโทเคนสำหรับรีเซ็ตรหัสผ่าน กรุณาลองใหม่อีกครั้ง");
      return;
    }
    
    try {
      setLoading(true);
      
      // Make API request to reset-password endpoint instead
      const response = await axios.post(
        `${API_URL}/reset-password`, 
        {
          token,
          newPassword
        }
      );
      
      // Show success message
      alert("บันทึกการเปลี่ยนแปลงเรียบร้อยแล้ว");
      
      // Redirect to login page after successful password reset
      router.push("/Login");
    } catch (err) {
      // Handle error
      if (err.response) {
        if (err.response.status === 401) {
          setError("โทเคนไม่ถูกต้องหรือหมดอายุ กรุณาขอรีเซ็ตรหัสผ่านใหม่");
        } else if (err.response.data && err.response.data.error) {
          setError(err.response.data.error);
        } else {
          setError("เกิดข้อผิดพลาด กรุณาลองอีกครั้ง");
        }
      } else {
        setError("เกิดข้อผิดพลาดในการเชื่อมต่อกับเซิร์ฟเวอร์");
      }
      console.error("Change password error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Tabbar />
    
      <div className="change-password-container">
        <div className="overlay">
          <div className="form-container">
            <h2 className="title">เปลี่ยนรหัสผ่าน</h2>
            
            {error && <div className="error-message">{error}</div>}
            
            <form onSubmit={handleSubmit}>
              <div className="input-group">
                <label>รหัสผ่านใหม่</label>
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                />
              </div>
              <div className="input-group">
                <label>ยืนยันรหัสผ่านใหม่</label>
                <input
                  type="password"
                  value={confirmNewPassword}
                  onChange={(e) => setConfirmNewPassword(e.target.value)}
                  required
                />
              </div>
              <div className="mt-7">
              </div>

              <button 
                type="submit" 
                className="submit-btn"
                disabled={loading}
              >
                {loading ? "กำลังดำเนินการ..." : "บันทึกการเปลี่ยนแปลง"}
              </button>
              
            </form>
          </div>
        </div>
      </div> 
    </>
  );
}
