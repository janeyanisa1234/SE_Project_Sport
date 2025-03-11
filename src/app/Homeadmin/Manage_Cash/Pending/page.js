"use client";
import axios from "axios";
import { useSearchParams, useRouter } from "next/navigation";
import Image from "next/image";
import "./pending.css";
import Tab from "../../Tabbar/page.js";
import "../../Dashboard/slidebar.css";
import React, { useState, useEffect } from "react";
import Sidebar from "../../Dashboard/slidebar.js";

export default function TransferForm() {
  const searchParams = useSearchParams();
  const router = useRouter();
  
  // ดึงข้อมูลที่ส่งมาจากหน้า Manage_Cash
  const id_owner = searchParams.get('id_owner');
  const user_name = searchParams.get('user_name');
  const bank_name = searchParams.get('bank_name');
  const bank_account = searchParams.get('bank_account');
  const date = searchParams.get('date');
  
  const [transferDate, setTransferDate] = useState('');
  const [transferTime, setTransferTime] = useState('');
  const [adminName, setAdminName] = useState('');
  const [file, setFile] = useState(null);
  const [fileName, setFileName] = useState('');
  const [isFileUploaded, setIsFileUploaded] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      setFileName(selectedFile.name);
      setIsFileUploaded(true);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // ตรวจสอบข้อมูลที่จำเป็น
    if (!transferDate || !transferTime || !adminName || !file) {
      alert('กรุณากรอกข้อมูลให้ครบถ้วน');
      return;
    }
    
    try {
      setIsSubmitting(true);
      
      // สร้าง FormData สำหรับส่งไฟล์
      const formData = new FormData();
      formData.append('slipImage', file);
      formData.append('id_owner', id_owner);
      formData.append('date', date);
      
      // สร้าง timestamp จากข้อมูลวันที่และเวลา
      const payDateTime = `${transferDate}T${transferTime}:00`;
      formData.append('paydate', payDateTime);
      formData.append('nameadmin', adminName);
      
      // ส่งข้อมูลไปยัง API
      const response = await axios.post('http://localhost:5000/api/cashUpdate/complete-transfer', 
        formData, 
        {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        }
      );
      
      // ถ้าสำเร็จให้ redirect กลับไปยังหน้าหลัก
      if (response.status === 200) {
        alert('ดำเนินการสำเร็จ');
        router.push('/Homeadmin/Manage_Cash');
      }
    } catch (error) {
      console.error('Error submitting transfer:', error);
      alert('เกิดข้อผิดพลาดในการดำเนินการ กรุณาลองใหม่อีกครั้ง');
    } finally {
      setIsSubmitting(false);
    }
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
            <span>{user_name || 'ไม่พบข้อมูล'}</span>
            <b>ชื่อธนาคาร :</b>
            <span>{bank_name || 'ไม่พบข้อมูล'}</span>
            <b>เลขบัญชี :</b>
            <span>{bank_account || 'ไม่พบข้อมูล'}</span>
            <b>วันที่ตัดยอด :</b>
            <span>{date || 'ไม่พบข้อมูล'}</span>
          </div>

          <h3 className="evidence-title">แบบหลักฐาน</h3>
          
          <form onSubmit={handleSubmit}>
            <div className="form-section">
              <div className="form-group">
                <label>เลือกวันที่:</label>
                <input 
                  type="date" 
                  className="input-field"
                  placeholder="วว/ดด/ปปปป"
                  value={transferDate}
                  onChange={(e) => setTransferDate(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label>เลือกเวลา:</label>
                <input 
                  type="time" 
                  className="input-field"
                  placeholder="--:--"
                  value={transferTime}
                  onChange={(e) => setTransferTime(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label>ชื่อผู้ดำเนินการ:</label>
                <input 
                  type="text" 
                  className="input-field"
                  placeholder="ระบุชื่อผู้ดำเนินการ"
                  value={adminName}
                  onChange={(e) => setAdminName(e.target.value)}
                  required
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
                  <p className="upload-text">{fileName || 'เพิ่มไฟล์'}</p>
                </div>
                {isFileUploaded && (
                  <p className="upload-success-text" style={{ color: 'green', fontSize: '14px', marginTop: '8px' }}>
                    อัปโหลดรูปสำเร็จ: {fileName}
                  </p>
                )}
              </div>
            </div>

            <button 
              type="submit" 
              className="submit-btn" 
              disabled={isSubmitting}
            >
              {isSubmitting ? 'กำลังดำเนินการ...' : 'ดำเนินการ'}
            </button>
          </form>
        </div>
      </div>
    </>
  );
}