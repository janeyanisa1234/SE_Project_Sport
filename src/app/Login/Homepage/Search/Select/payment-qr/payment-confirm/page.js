"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import "../../../../../../Login/Homepage/Search/Select/payment-qr/page"

const PaymentForm = () => {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);

  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];

    if (!selectedFile) return;

    // ตรวจสอบว่าเป็นไฟล์รูปภาพ
    if (!selectedFile.type.startsWith("image/")) {
      alert("กรุณาอัปโหลดไฟล์รูปภาพเท่านั้น");
      return;
    }

    // ตรวจสอบขนาดไฟล์ (ไม่เกิน 5MB)
    if (selectedFile.size > 5 * 1024 * 1024) {
      alert("ขนาดไฟล์ต้องไม่เกิน 5MB");
      return;
    }

    // ล้าง URL เดิมก่อนสร้างใหม่
    if (preview) {
      URL.revokeObjectURL(preview);
    }

    setFile(selectedFile);
    setPreview(URL.createObjectURL(selectedFile));
  };

  // Cleanup URL object เมื่อ component ถูก unmount
  useEffect(() => {
    return () => {
      if (preview) {
        URL.revokeObjectURL(preview);
      }
    };
  }, [preview]);

  return (
    <div
      className="relative w-full min-h-screen bg-cover bg-center flex flex-col items-center"
      style={{ backgroundImage: "url('/bg.png')" }}
    >
      {/* Header */}
      <div className="bg-black text-white px-6 py-4 flex items-center w-full">
        <button className="text-2xl mr-4">☰</button>
        <span className="text-xl font-bold">SPORTFLOW</span>
      </div>

      {/* Content */}
      <div className="flex flex-col sm:flex-row items-center justify-center flex-grow px-4 w-full">
        <div className="bg-white bg-opacity-80 p-10 rounded-lg shadow-lg max-w-2xl w-full text-lg">
          <h2 className="text-xl font-semibold text-gray-800">วันและเวลาที่ทำการชำระเงิน</h2>

          {/* เลือกวันที่ */}
          <input
            type="date"
            className="bg-gray-300 px-4 py-3 rounded mt-4 w-full text-lg"
          />

          {/* กรอกเวลา */}
          <input
            type="time"
            className="bg-gray-300 px-4 py-3 rounded mt-4 w-full text-lg"
          />

          {/* ใบเสร็จการชำระเงิน */}
          <h2 className="text-xl font-semibold text-gray-800 mt-8">ใบเสร็จการชำระเงิน</h2>
          <div className="bg-gray-300 w-full h-40 flex items-center justify-center border-black border-2 mt-4 relative overflow-hidden">
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="absolute inset-0 opacity-0 w-full h-full cursor-pointer"
            />
            {preview ? (
              <div className="relative w-full h-full">
                <img src={preview} alt="Receipt Preview" className="w-full h-full object-contain" />
                <button
                  onClick={() => {
                    setFile(null);
                    setPreview(null);
                  }}
                  className="absolute top-2 right-2 bg-red-500 text-white px-3 py-1 rounded text-sm"
                >
                  ลบรูป
                </button>
              </div>
            ) : (
              <button className="flex items-center bg-black text-white px-8 py-3 rounded text-lg">
                📷 {file ? file.name : "แบบหลักฐานการชำระเงิน"}
              </button>
            )}
          </div>

          {/* ข้อความแจ้งเตือน */}
          <p className="text-red-500 text-lg mt-6 text-center">
            ❗ หากไม่แนบหลักฐานการชำระเงินภายใน <span className="font-bold">30:00</span> นาที ระบบจะทำการยกเลิกการจองโดยอัตโนมัติ
          </p>

          {/* ปุ่มยืนยัน */}
          <div className="mt-6 flex justify-center">

            <Link href={"/Login/Homepage/Search/Select/payment-qr/payment-confirm/history"}>
              <button className="bg-green-500 text-white px-12 py-3 rounded-lg text-lg">
                ยืนยัน
              </button>
            </Link>
            
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentForm;
