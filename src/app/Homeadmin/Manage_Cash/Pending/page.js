"use client";
import axios from "axios";
import { Eye, EyeOff } from "lucide-react";
import Image from "next/image";
import "./pending.css";
import Tab from "../../Tabbar/page.js";
import "../../Dashboard/slidebar.css";
import React, { useState } from "react";
import Sidebar from "../../Dashboard/slidebar.js";


function fetchData(){
 axios.get('http://localhost:5000/api/jane')
 .then(response => {
  console.log('Response data:', response.data);
})
.catch(error => {
  console.error('Error:', error);
});
}

export default function TransferForm() {
  const [file, setFile] = useState(null);
  const [fileName, setFileName] = useState(''); // เพิ่ม state เพื่อเก็บชื่อไฟล์
  const [isFileUploaded, setIsFileUploaded] = useState(false); // เพิ่ม state เพื่อตรวจสอบว่าอัปโหลดไฟล์แล้ว

  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];
    setFile(selectedFile);
    setFileName(selectedFile ? selectedFile.name : ''); // เก็บชื่อไฟล์ที่เลือก
    setIsFileUploaded(true); // เมื่อเลือกไฟล์ให้ตั้งค่าว่าอัปโหลดไฟล์แล้ว
  };

  return (
    <>
      <Tab />
      <Sidebar/>
      <div className="Container">
        <div className="Box">
          <h2 className="title">ดำเนินการโอนเงิน</h2>
          <p className="section-title">ข้อมูลผู้รับ</p>
          
          <div className="receiver-info">
            <b>ชื่อผู้รับ :</b>
            <span>ภูรินินทร์ สิงห์เดชา</span>
            <b>ชื่อธนาคาร :</b>
            <span>ธนาคารกรุงไทย</span>
            <b>เลขบัญชี :</b>
            <span>123-456-7890</span>
          </div>

          <h3 className="evidence-title">แบบหลักฐาน</h3>
          
          <div className="form-section">
            <div className="form-group">
              <label>เลือกวันที่:</label>
              <input 
                type="date" 
                className="input-field"
                placeholder="วว/ดด/ปปปป"
              />
            </div>

            <div className="form-group">
              <label>เลือกเวลา:</label>
              <input 
                type="time" 
                className="input-field"
                placeholder="--:--"
              />
            </div>

            <div className="form-group">
              <label>ชื่อผู้ดำเนินการ:</label>
              <input 
                type="text" 
                className="input-field"
                placeholder="ระบุชื่อผู้ดำเนินการ"
              />
            </div>

            <div className="form-group">
              <label className="upload-label">เพิ่มรูปภาพสลิปการโอน:</label>
              <div 
                className="upload-box"
                onClick={() => document.getElementById("fileInput").click()}
              >
                <input
                  id="fileInput"
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  style={{ display: 'none' }}
                />
                <span className="upload-icon">+</span>
                <p className="upload-text">{fileName || 'เพิ่มไฟล์'}</p> {/* แสดงชื่อไฟล์ที่เลือก */}
              </div>
              {isFileUploaded && (
                <p className="upload-success-text" style={{ color: 'green', fontSize: '14px', marginTop: '8px' }}>
                  อัปโหลดรูปสำเร็จ: {fileName}
                </p>
              )}
            </div>
          </div>

          <button className="submit-btn">ดำเนินการ</button>
        </div>
      </div>
    </>
  );
}
