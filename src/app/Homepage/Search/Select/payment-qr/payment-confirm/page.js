"use client";

import "../globals.css";
import React, { useState, useEffect } from "react";
import Tabbar from "../../../../../Tab/tab";
import axios from "axios";

const PaymentForm = () => {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [userName, setUserName] = useState("");
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState("");
  const userId = "1234"; // เปลี่ยนเป็นค่าจริงจากระบบล็อกอิน

  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];
    if (!selectedFile) return;
    if (!selectedFile.type.startsWith("image/")) {
      alert("กรุณาอัปโหลดไฟล์รูปภาพเท่านั้น");
      return;
    }
    if (selectedFile.size > 5 * 1024 * 1024) {
      alert("ขนาดไฟล์ต้องไม่เกิน 5MB");
      return;
    }
    if (preview) URL.revokeObjectURL(preview);
    setFile(selectedFile);
    setPreview(URL.createObjectURL(selectedFile));
  };

  useEffect(() => {
    return () => {
      if (preview) URL.revokeObjectURL(preview);
    };
  }, [preview]);

  const handleUpload = async () => {
    if (!file || !date || !time || !userName) {
      alert("กรุณากรอกข้อมูลให้ครบถ้วน");
      return;
    }

    setUploading(true);
    setMessage("");

    const formData = new FormData();
    formData.append("slip", file);
    formData.append("userName", userName);
    formData.append("date", date);
    formData.append("time", time);
    formData.append("userId", userId);

    try {
      const response = await axios.post("http://localhost:5000/uploadSlip", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setMessage(response.data.message);
      alert("อัปโหลดสำเร็จ! " + response.data.message);
    } catch (error) {
      console.error("Error:", error);
      alert("เกิดข้อผิดพลาดในการอัปโหลดไฟล์");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="relative w-full min-h-screen bg-cover bg-center flex flex-col items-center" style={{ backgroundImage: "url('/picturesoc/bg_0.png')" }}>
      <Tabbar />
      <div className="flex flex-col sm:flex-row items-center justify-center flex-grow px-4 w-full">
        <div className="bg-white bg-opacity-80 p-10 rounded-lg shadow-lg max-w-2xl w-full text-lg">
          
          <h2 className="text-xl font-semibold text-gray-800 mt-4">วันและเวลาที่ทำการชำระเงิน</h2>
          <input type="date" className="bg-gray-300 px-4 py-3 rounded mt-4 w-full text-lg" value={date} onChange={(e) => setDate(e.target.value)} />
          <input type="time" className="bg-gray-300 px-4 py-3 rounded mt-4 w-full text-lg" value={time} onChange={(e) => setTime(e.target.value)} />
          
          <h2 className="text-xl font-semibold text-gray-800 mt-8">ใบเสร็จการชำระเงิน</h2>
          <div className="bg-gray-300 w-full h-40 flex items-center justify-center border-black border-2 mt-4 relative overflow-hidden">
            <input type="file" accept="image/*" onChange={handleFileChange} className="absolute inset-0 opacity-0 w-full h-full cursor-pointer" />
            {preview ? (
              <img src={preview} alt="Receipt Preview" className="w-full h-full object-contain" />
            ) : (
              <button className="flex items-center bg-black text-white px-8 py-3 rounded text-lg">📷 อัปโหลดหลักฐาน</button>
            )}
          </div>

          <div className="mt-6 flex justify-center">
            <button onClick={handleUpload} className="bg-green-500 text-white px-12 py-3 rounded-lg text-lg" disabled={uploading}>
              {uploading ? "กำลังอัปโหลด..." : "ยืนยัน"}
            </button>
          </div>

          {message && <p className="mt-4 text-center text-lg">{message}</p>}
        </div>
      </div>
    </div>
  );
};

export default PaymentForm;
