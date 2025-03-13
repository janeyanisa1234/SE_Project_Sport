"use client";
import React, { useState, useEffect } from "react";
import Tab from "../../Tabbar/page.js";
import "../../Dashboard/slidebar.css";
import Sidebar from "../../Dashboard/slidebar.js";
import "./pending.css";
import axios from "axios";
import { useRouter, useSearchParams } from "next/navigation";

export default function TransferForm() {
  const [transferDate, setTransferDate] = useState('');
  const [transferTime, setTransferTime] = useState('');
  const [adminName, setAdminName] = useState('');
  const [file, setFile] = useState(null);
  const [fileName, setFileName] = useState('');
  const [isFileUploaded, setIsFileUploaded] = useState(false);
  const [bookingData, setBookingData] = useState(null);
  
  const router = useRouter();
  const searchParams = useSearchParams();
  const id_booking = searchParams.get('id');

  useEffect(() => {
    const fetchBookingData = async () => {
      if (id_booking) {
        try {
          const response = await axios.get(`http://localhost:5000/api/cancleAdmin/cancle-booking`);
          const booking = response.data.data.find(item => item.id_booking === id_booking);
          setBookingData(booking);
          console.log('Fetched booking data:', booking);
        } catch (error) {
          console.error("Error fetching booking data:", error);
        }
      } else {
        console.error('No id_booking found in URL');
      }
    };
    fetchBookingData();
  }, [id_booking]);

  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];
    
    if (selectedFile) {
      // 1. ตรวจสอบว่าเป็นไฟล์รูปภาพเท่านั้น (JPEG, PNG, SVG)
      const validImageTypes = ['image/jpeg', 'image/png', 'image/svg+xml'];
      if (!validImageTypes.includes(selectedFile.type)) {
        alert('กรุณาอัปโหลดไฟล์รูปภาพเท่านั้น (JPEG, PNG, SVG)');
        return;
      }

      // 2. ตรวจสอบว่าชื่อไฟล์ไม่มีภาษาไทย
      const thaiCharRegex = /[ก-๙]/;
      if (thaiCharRegex.test(selectedFile.name)) {
        alert('ชื่อไฟล์ต้องไม่มีภาษาไทย');
        return;
      }

      // 3. ตรวจสอบขนาดไฟล์ (5MB = 5 * 1024 * 1024 bytes)
      const maxSizeInBytes = 5 * 1024 * 1024;
      if (selectedFile.size > maxSizeInBytes) {
        alert('ขนาดไฟล์ต้องไม่เกิน 5MB');
        return;
      }

      // ถ้าผ่านทุกเงื่อนไขแล้วจึง set state
      setFile(selectedFile);
      setFileName(selectedFile.name);
      setIsFileUploaded(true);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!transferDate || !transferTime || !adminName || !file) {
      alert('กรุณากรอกข้อมูลให้ครบถ้วน');
      return;
    }

    if (!id_booking) {
      alert('ไม่พบ ID การจอง');
      return;
    }

    try {
      const formData = new FormData();
      formData.append('id_booking', id_booking);
      formData.append('date', `${transferDate} ${transferTime}`);
      formData.append('name', adminName);
      formData.append('slipImage', file);

      console.log('Submitting refund with data:', {
        id_booking,
        date: `${transferDate} ${transferTime}`,
        name: adminName,
        fileName: file.name
      });

      const response = await axios.post('http://localhost:5000/api/cancleAdmin/process-refund', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      if (response.status === 200) {
        alert("ดำเนินการสำเร็จ");
        router.push('/Homeadmin/Manage_Refunds');
      }
    } catch (error) {
      alert('เกิดข้อผิดพลาดในการดำเนินการ: ' + error.message);
      console.error('Error submitting refund:', error);
    }
  };

  return (
    <>
      <Tab />
      <Sidebar />
      <div className="Container">
        <div className="Box">
          <h2 className="title">ดำเนินการโอนเงิน</h2>
          
          {bookingData && (
            <div className="booking-info">
              <h3>ข้อมูลคืนเงิน</h3>
              <p>ชื่อผู้จอง: {bookingData.user_name}</p>
              <p>ธนาคาร: {bookingData.bank}</p>
              <p>หมายเลขบัญชี: {bookingData.bank_number}</p>
              <p>ยอดคืน: {bookingData.totalPrice}</p>
            </div>
          )}

          <h3 className="evidence-title">แบบหลักฐาน</h3>
          
          <form onSubmit={handleSubmit}>
            <div className="form-section">
              <div className="form-group">
                <label>เลือกวันที่:</label>
                <input 
                  type="date" 
                  className="input-field"
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
                    accept=".jpg,.jpeg,.png,.svg"
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

            <button type="submit" className="submit-btn">
              ดำเนินการ
            </button>
          </form>
        </div>
      </div>
    </>
  );
}