"use client"; 
import Link from "next/link";
import "./RegistrationForm1.css";
import Image from "next/image"; 
import Tabbar from "../../../tabbar-nologin/tab.js";
import "../../../ice/Admin/slidebar";
import Sidebar from "../../../ice/Admin/slidebar.js";
import React, { useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";

const RegistrationForm1 = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    identity_card: "",
    bank_name: "",
    bank_acc_id: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const API_URL = "http://localhost:5000/api/kony";

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const validateForm = () => {
    if (!formData.name || !formData.email || !formData.phone || !formData.password || !formData.confirmPassword || !formData.identity_card || !formData.bank_name || !formData.bank_acc_id) {
      setError("กรุณากรอกข้อมูลให้ครบทุกช่อง");
      return false;
    }

    if (formData.password !== formData.confirmPassword) {
      setError("รหัสผ่านและการยืนยันรหัสผ่านไม่ตรงกัน");
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!validateForm()) return;

    try {
      setLoading(true);
      const response = await axios.post(`${API_URL}/register-owner`, formData);
      alert("ลงทะเบียนผู้ประกอบการสำเร็จ!");
      router.push("/Login");
    } catch (err) {
      setError(err.response?.data?.error || "การลงทะเบียนล้มเหลว กรุณาลองอีกครั้ง");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Tabbar />
      <Sidebar />
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
              <h1 className="text-white text-2xl font-bold">ลงทะเบียน</h1>
            </div>
            {error && <div className="error-message">{error}</div>}
            <form onSubmit={handleSubmit}>
              <div className="input-container">
                <label>ชื่อ-นามสกุล</label>
                <input 
                type="text" 
                name="name" 
                placeholder="ชื่อ-นามสกุล" 
                value={formData.name} 
                onChange={handleChange}
                />
              </div>
              <div className="input-container">
                <label>อีเมล</label>
                <input 
                type="text" 
                name="email"
                placeholder="อีเมล" 
                value={formData.email} 
                onChange={handleChange} 
                />
              </div>
              <div className="input-container">
                <label>เบอร์โทรศัพท์</label>
                <input 
                type="tel" 
                name="phone" 
                placeholder="เบอร์โทรศัพท์" 
                value={formData.phone}
                onChange={handleChange}
                />
              </div>
              <div className="input-container">
                <label>เลขบัตรประชาชน</label>
                <input 
                type="text" 
                name="identity_card" 
                placeholder="เลขบัตรประชาชน" 
                value={formData.identity_card} 
                onChange={handleChange}
                />
              </div>
              <div className="input-container">
                <label>ชื่อธนาคาร</label>
                <input 
                type="text" 
                name="bank_name" 
                placeholder="ชื่อธนาคาร" 
                value={formData.bank_name} 
                onChange={handleChange} 
                />
              </div>
              <div className="input-container">
                <label>เลขบัญชีธนาคาร</label>
                <input 
                type="text" 
                name="bank_acc_id" 
                placeholder="เลขบัญชีธนาคาร" 
                value={formData.bank_acc_id} 
                onChange={handleChange} 
                />
              </div>
              <div className="input-container">
                <label>รหัสผ่าน</label>
                <input 
                type="password" 
                name="password" 
                placeholder="รหัสผ่าน" 
                value={formData.password} 
                onChange={handleChange} 
                />
              </div>
              <div className="input-container">
                <label>ยืนยันรหัสผ่าน</label>
                <input 
                type="password" 
                name="confirmPassword" 
                placeholder="ยืนยันรหัสผ่าน" 
                value={formData.confirmPassword} 
                onChange={handleChange}
                />
              </div>
              <div className="checkbox-container">
                <input type="checkbox" id="agree" />
                <label htmlFor="agree">ฉันยอมรับเงื่อนไขการให้บริการ</label>
              </div>
              <button type="submit" className="submit-button" disabled={loading}>
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

export default RegistrationForm1;