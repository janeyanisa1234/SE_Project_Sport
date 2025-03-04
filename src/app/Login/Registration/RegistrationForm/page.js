"use client"; 
import Link from "next/link";
import React, { useState } from "react";
import Image from "next/image";
import "./RegistrationForm.css";
import Tabbar from "../../../tabbar-nologin/tab.js";
import "../../../ice/Admin/slidebar";
import Sidebar from "../../../ice/Admin/slidebar.js";
import axios from "axios";
import { useRouter } from "next/navigation";


const RegistrationForm = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    isNotRobot: false
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  // Base URL for your API
  const API_URL = "http://localhost:5000/api/kony";

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const validateForm = () => {
    // Check if all fields are filled
    if (!formData.name || !formData.email || !formData.phone || !formData.password || !formData.confirmPassword) {
      setError("กรุณากรอกข้อมูลให้ครบทุกช่อง");
      return false;
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setError("รูปแบบอีเมลไม่ถูกต้อง");
      return false;
    }

    // Validate phone number (Thai format)
    const phoneRegex = /^0\d{9}$/;
    if (!phoneRegex.test(formData.phone)) {
      setError("รูปแบบเบอร์โทรศัพท์ไม่ถูกต้อง (ต้องเป็นเบอร์โทรศัพท์ไทย 10 หลัก)");
      return false;
    }

    // Check if passwords match
    if (formData.password !== formData.confirmPassword) {
      setError("รหัสผ่านและการยืนยันรหัสผ่านไม่ตรงกัน");
      return false;
    }

    // Password strength check
    if (formData.password.length < 8) {
      setError("รหัสผ่านต้องมีความยาวอย่างน้อย 8 ตัวอักษร");
      return false;
    }

    // Check robot verification
    if (!formData.isNotRobot) {
      setError("กรุณายืนยันว่าคุณไม่ใช่ระบบอัตโนมัติ");
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Reset error
    setError("");
    
    // Validate form
    if (!validateForm()) {
      return;
    }
    
    try {
      setLoading(true);
      
      // Make API request to registration endpoint
      const response = await axios.post(`${API_URL}/register`, {
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        password: formData.password
      });
      
      // Handle successful registration
      if (response.data && response.data.token) {
        // Store token in localStorage
        localStorage.setItem("token", response.data.token);
        localStorage.setItem("user", JSON.stringify(response.data.user));
        
        // Show success message or redirect
        alert("ลงทะเบียนสำเร็จ");
        router.push("/Login");
      }
    } catch (err) {
      // Handle registration error
      if (err.response && err.response.data) {
        setError(err.response.data.error || "การลงทะเบียนล้มเหลว กรุณาลองอีกครั้ง");
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

      <div className="registration-container">
        <div className="registration-overlay">
          <div className="registration-box">
            <div className="icon-container">
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
            
            {error && <div className="error-message">{error}</div>}
            
            <form onSubmit={handleSubmit}>
              <div className="input-group">
                <label htmlFor="name">ชื่อ-นามสกุล</label>
                <input 
                  type="text" 
                  name="name"
                  placeholder="ชื่อ-นามสกุล" 
                  value={formData.name}
                  onChange={handleChange}
                />
              </div>

              <div className="input-group">
                <label htmlFor="email">อีเมล</label>
                <input 
                  type="email" 
                  name="email"
                  placeholder="อีเมล" 
                  value={formData.email}
                  onChange={handleChange}
                />
              </div>

              <div className="input-group">
                <label htmlFor="phone">เบอร์โทรศัพท์</label>
                <input 
                  type="tel" 
                  name="phone"
                  placeholder="เบอร์โทรศัพท์" 
                  value={formData.phone}
                  onChange={handleChange}
                />
              </div>

              <div className="input-group">
                <label htmlFor="password">ตั้งรหัสผ่าน</label>
                <input 
                  type="password" 
                  name="password"
                  placeholder="ตั้งรหัสผ่าน" 
                  value={formData.password}
                  onChange={handleChange}
                />
              </div>

              <div className="input-group">
                <label htmlFor="confirmPassword">ยืนยันรหัสผ่าน</label>
                <input 
                  type="password" 
                  name="confirmPassword"
                  placeholder="ยืนยันรหัสผ่าน" 
                  value={formData.confirmPassword}
                  onChange={handleChange}
                />
              </div>

              <div className="checkbox-group">
                <input 
                  type="checkbox" 
                  id="isNotRobot" 
                  name="isNotRobot"
                  checked={formData.isNotRobot} 
                  onChange={handleChange}
                />
                <label htmlFor="isNotRobot">ฉันไม่ใช่ระบบอัตโนมัติ</label>
              </div>

              <button 
                type="submit" 
                className="submit-button"
                disabled={loading}
              >
                {loading ? "กำลังดำเนินการ..." : "ยืนยันข้อมูล"}
              </button>
              
              <div className="login-link">
                มีบัญชีอยู่แล้ว? <Link href="/Login">เข้าสู่ระบบ</Link>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default RegistrationForm;