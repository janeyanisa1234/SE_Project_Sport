"use client"; 
import Link from "next/link";
import "./RegistrationForm1.css";
import Image from "next/image"; 
import Tabbar from "../../../tabbar-nologin/tab.js";

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
  const [idCardImage, setIdCardImage] = useState(null);
  const [bankBookImage, setBankBookImage] = useState(null);
  const [idCardFileName, setIdCardFileName] = useState('');
  const [bankBookFileName, setBankBookFileName] = useState('');
  const [isIdCardUploaded, setIsIdCardUploaded] = useState(false);
  const [isBankBookUploaded, setIsBankBookUploaded] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const API_URL = "http://localhost:5000/api/kong";

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleFileChange = (e) => {
    const { name, files } = e.target;
    const selectedFile = files[0];
    
    if (name === "idCardImage" && selectedFile) {
      setIdCardImage(selectedFile);
      setIdCardFileName(selectedFile.name);
      setIsIdCardUploaded(true);
    } else if (name === "bankBookImage" && selectedFile) {
      setBankBookImage(selectedFile);
      setBankBookFileName(selectedFile.name);
      setIsBankBookUploaded(true);
    }
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

    if (!idCardImage) {
      setError("กรุณาแนบรูปบัตรประชาชน");
      return false;
    }

    if (!bankBookImage) {
      setError("กรุณาแนบรูปหน้าแรกของสมุดบัญชีธนาคาร");
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
      
      // Create FormData object to handle file uploads
      const submitData = new FormData();
      
      // Add all text fields
      Object.keys(formData).forEach(key => {
        if (key !== 'confirmPassword') { // Don't send confirmPassword to backend
          submitData.append(key, formData[key]);
        }
      });
      
      // Format and add image files with proper naming
      if (idCardImage) {
        // Create a unique filename with timestamp and user identifier for identity_card bucket
        const idCardFileName = `${formData.identity_card}_${Date.now()}.${idCardImage.name.split('.').pop()}`;
        
        // Create a new file object with the formatted name
        const formattedIdCard = new File([idCardImage], idCardFileName, {
          type: idCardImage.type,
        });
        
        submitData.append("idCardImage", formattedIdCard);
      }
      
      if (bankBookImage) {
        // Create a unique filename with timestamp and user identifier for bank_acc bucket
        const bankBookFileName = `${formData.bank_acc_id}_${Date.now()}.${bankBookImage.name.split('.').pop()}`;
        
        // Create a new file object with the formatted name
        const formattedBankBook = new File([bankBookImage], bankBookFileName, {
          type: bankBookImage.type,
        });
        
        submitData.append("bankBookImage", formattedBankBook);
      }
      
      // Debug: Log FormData contents
      console.log("--- Form Data Debug ---");
      for (let pair of submitData.entries()) {
        if (pair[0].includes('Image')) {
          console.log(pair[0], ':', pair[1].name, '(', pair[1].type, ')', pair[1].size, 'bytes');
        } else {
          console.log(pair[0], ':', pair[1]);
        }
      }
      
      const response = await axios.post(`${API_URL}/register-owner`, submitData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      
      // Debug: Log response
      console.log("--- Response Debug ---", response.data);
      
      alert("ลงทะเบียนผู้ประกอบการสำเร็จ!");
      router.push("/Login");
    } catch (err) {
      console.error("--- Error Debug ---", err.response?.data || err.message);
      setError(err.response?.data?.error || "การลงทะเบียนล้มเหลว กรุณาลองอีกครั้ง");
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
              {/* File upload for ID card */}
                <div className="input-container">
                  <label>แนบรูปบัตรประชาชน</label>
                  <input 
                    type="file" 
                    name="idCardImage" 
                    accept="image/*" 
                    onChange={handleFileChange}
                  />
                  {isIdCardUploaded && (
                    <p className="upload-success-text" style={{ color: 'green', fontSize: '14px', marginTop: '8px' }}>
                      อัปโหลดรูปสำเร็จ: {idCardFileName}
                    </p>
                  )}
                </div>
                
                {/* File upload for bank book */}
                <div className="input-container">
                  <label>แนบรูปหน้าแรกของสมุดบัญชีธนาคาร</label>
                  <input 
                    type="file" 
                    name="bankBookImage" 
                    accept="image/*" 
                    onChange={handleFileChange}
                  />
                  {isBankBookUploaded && (
                    <p className="upload-success-text" style={{ color: 'green', fontSize: '14px', marginTop: '8px' }}>
                      อัปโหลดรูปสำเร็จ: {bankBookFileName}
                    </p>
                  )}
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