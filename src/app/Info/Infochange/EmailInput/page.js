"use client";
import Link from "next/link";
import { useState } from "react";
import "./EmailInput.css"; 
import Tabbar from "../../../Tab/tab"; 
import axios from "axios";
import { useRouter } from "next/navigation";

export default function EmailInput() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  
  const API_URL = "http://localhost:5000/api/ice";

  const handleResetPassword = async (e) => {
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
      
      // Get auth token if available
      const token = localStorage.getItem("token");
      
      // Make API request to send-reset-password-email endpoint with auth header
      const response = await axios.post(
        `${API_URL}/send-reset-password-email`, 
        { email },
        { 
          headers: { 
            'Content-Type': 'application/json',
            'Authorization': token ? `Bearer ${token}` : ''
          },
          // Add timeout to prevent hanging requests
          timeout: 10000
        }
      );
      
      console.log("API Response:", response.data); // Log the response for debugging
      
      // Check if the response indicates success - handle different response formats
      if (response.data && (response.data.success || response.status === 200)) {
        // Display success message
        setSuccess("ระบบได้ส่งลิงก์รีเซ็ตรหัสผ่านไปยังอีเมลของคุณแล้ว กรุณาตรวจสอบอีเมลของคุณ");
        
        // Redirect to same page after 3 seconds
        setTimeout(() => {
          router.push("/Info/Infochange/EmailInput");
        }, 3000);
      } else {
        // If we got a response but it doesn't indicate success
        const errorMessage = response.data && response.data.message 
          ? response.data.message 
          : "ไม่สามารถส่งอีเมลได้ กรุณาลองอีกครั้ง";
        setError(errorMessage);
      }
    } catch (err) {
      // Handle specific error codes
      if (err.response) {
        if (err.response.status === 401) {
          setError("ไม่มีสิทธิ์ในการเข้าถึง กรุณาเข้าสู่ระบบก่อน");
        } else if (err.response.status === 403) {
          setError("ไม่มีสิทธิ์ในการส่งอีเมล (Access denied)");
        } else if (err.response.data && err.response.data.error) {
          setError(err.response.data.error);
        } else {
          setError("เกิดข้อผิดพลาด กรุณาลองอีกครั้ง");
        }
      } else if (err.code === 'ECONNABORTED') {
        setError("การเชื่อมต่อกับเซิร์ฟเวอร์ใช้เวลานานเกินไป กรุณาลองอีกครั้ง");
      } else {
        setError("เกิดข้อผิดพลาดในการเชื่อมต่อกับเซิร์ฟเวอร์");
      }
      console.error("Reset password error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Tabbar />
      
      <div className="email-container">
        <div className="email-overlay">
          <div className="email-box">
            <h2 className="text-lg font-semibold mb-4">กรุณาใส่อีเมลของคุณ</h2>

            {error && <div className="error-message">{error}</div>}
            {success && <div className="success-message">{success}</div>}

            <input
              type="text"
              className="email-input"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="กรอกอีเมลของคุณ"
            />

            <p className="email-warning">
              ⚠ ระบบจะทำการส่งลิงก์รีเซ็ตรหัสผ่านไปยังอีเมลที่คุณกรอกด้านบน
            </p>

            <button 
              className="email-button" 
              onClick={handleResetPassword}
              disabled={loading}
            >
              {loading ? "กำลังส่งอีเมล..." : "ยืนยัน"}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}