"use client";

import "../globals.css";
import React, { useState, useEffect } from "react";
import Tabbar from "../../../../../Tab/tab";
import axios from "axios";
import { useSearchParams, useRouter } from "next/navigation";

const PaymentForm = () => {
  const searchParams = useSearchParams();
  const router = useRouter();

  const userId = searchParams.get("userId") || localStorage.getItem("userId");
  const bookingId = searchParams.get("bookingId");
  const price = parseInt(searchParams.get("price"));
  const stadiumName = searchParams.get("stadiumName");
  const sportType = searchParams.get("sportType");
  const courtNumber = parseInt(searchParams.get("courtNumber"));
  const datePlay = searchParams.get("date");
  const id_stadium = searchParams.get("id_stadium");
  const id_court = searchParams.get("id_court");


  let timeSlots;
  try {
    const encodedTimeSlots = searchParams.get("timeSlots");
    timeSlots = encodedTimeSlots ? JSON.parse(decodeURIComponent(encodedTimeSlots)) : [];
  } catch (error) {
    console.error("Error parsing timeSlots:", error);
    timeSlots = [];
  }

  const today = new Date().toISOString().split("T")[0];
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [transferDate, setTransferDate] = useState(today);
  const [transferTime, setTransferTime] = useState("");
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState("");
  const [bookingData, setBookingData] = useState({
    userId,
    bookingId,
    id_stadium,
    id_court,
    courtNumber,
    datePlay,
    timeSlots,
    price,
    stadiumName,
    sportType,
  });
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);

  useEffect(() => {
    if (!userId) {
      alert("กรุณาเข้าสู่ระบบก่อน");
      router.push("/login");
    }
  }, [userId, router]);

  if (!userId) return null;

  const checkImageQuality = (file) => {
    return new Promise((resolve) => {
      const img = new Image();
      img.src = URL.createObjectURL(file);
      img.onload = () => {
        if (img.width < 300 || img.height < 300) {
          alert("กรุณาอัปโหลดภาพที่มีความละเอียดสูงกว่านี้ (ขั้นต่ำ 300x300 พิกเซล)");
          resolve(false);
        } else {
          resolve(true);
        }
      };
    });
  };

  const handleFileChange = async (event) => {
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

    const isValid = await checkImageQuality(selectedFile);
    if (!isValid) return;

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
    if (!file || !transferDate || !transferTime ) {
      alert("กรุณากรอกข้อมูลให้ครบถ้วน (วันที่โอน, เวลาที่โอน, สลิป)");
      return;
    }

    if (transferDate !== today) {
      alert("วันที่โอนต้องเป็นวันนี้เท่านั้น");
      return;
    }

    setUploading(true);
    setMessage("");

    const formData = new FormData();
    formData.append("slipImage", file);
    formData.append("user_id", bookingData.userId);
    formData.append("bookingId", bookingData.bookingId);
    formData.append("date", transferDate);
    formData.append("time", transferTime);
    formData.append("id_stadium", bookingData.id_stadium);
    formData.append("id_court", bookingData.id_court);
    formData.append("court_number", String(bookingData.courtNumber));
    formData.append("date_play", bookingData.datePlay);
    formData.append("time_slot", bookingData.timeSlots.join(","));
    formData.append("totalPrice", String(bookingData.price));
  
    console.log("FormData being sent:", [...formData.entries()]);

    try {
      const response = await axios.post(
        "http://localhost:5000/booking/confirm",
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
          timeout: 30000, // เพิ่ม timeout เป็น 30 วินาทีเพื่อรองรับ OCR
        }
      );
      setMessage(response.data.message);
      setShowSuccessPopup(true);
    } catch (error) {
      console.error("Full upload error:", error);
    const errorMsg =
      error.response?.data?.error ||
      error.message ||
      "เกิดข้อผิดพลาดที่ไม่ทราบสาเหตุ";
    const errorDetails = error.response?.data?.details || error.code || "";
    alert(`เกิดข้อผิดพลาด: ${errorMsg}${errorDetails ? ` - ${errorDetails}` : ""}`);
    setMessage(`ข้อผิดพลาด: ${errorMsg}`);
  } finally {
    setUploading(false);
  }
};

  const handleConfirmPopup = () => {
    setShowSuccessPopup(false);
    router.push(`/Homepage?bookingId=${bookingId}`);
  };

  const renderSuccessPopup = () => {
    if (!showSuccessPopup) return null;
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white p-6 rounded-lg shadow-lg text-center">
          <h2 className="text-2xl font-bold mb-4">การจองสำเร็จ</h2>
          <p className="mb-6">การจองของคุณได้รับการยืนยันแล้ว</p>
          <button
            onClick={handleConfirmPopup}
            className="bg-green-500 text-white px-6 py-2 rounded-lg hover:bg-green-600"
          >
            ยืนยัน
          </button>
        </div>
      </div>
    );
  };

  return (
    <div
      className="relative w-full min-h-screen bg-cover bg-center flex flex-col items-center"
      style={{ backgroundImage: "url('/picturesoc/bg_0.png')" }}
    >
      <Tabbar />
      <div className="flex flex-col sm:flex-row items-center justify-center flex-grow px-4 w-full">
        <div className="bg-white bg-opacity-80 p-10 rounded-lg shadow-lg max-w-2xl w-full text-lg">
          <h2 className="text-xl font-semibold text-gray-800 mt-4">วันและเวลาที่ทำการโอน</h2>
          <input
            type="date"
            className="bg-gray-300 px-4 py-3 rounded mt-4 w-full text-lg"
            value={transferDate}
            min={today}
            max={today}
            readOnly
          />
          <input
            type="time"
            className="bg-gray-300 px-4 py-3 rounded mt-4 w-full text-lg"
            value={transferTime}
            onChange={(e) => setTransferTime(e.target.value)}
          />
          
          <h2 className="text-xl font-semibold text-gray-800 mt-8">สลิปการโอน</h2>
          <div className="bg-gray-300 w-full h-40 flex items-center justify-center border-black border-2 mt-4 relative overflow-hidden">
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="absolute inset-0 opacity-0 w-full h-full cursor-pointer"
            />
            {preview ? (
              <img src={preview} alt="Receipt Preview" className="w-full h-full object-contain" />
            ) : (
              <button className="flex items-center bg-black text-white px-8 py-3 rounded text-lg">
                📷 อัปโหลดสลิป
              </button>
            )}
          </div>
          <div className="mt-6 flex justify-center">
            <button
              onClick={handleUpload}
              className="bg-green-500 text-white px-12 py-3 rounded-lg text-lg"
              disabled={uploading}
            >
              {uploading ? "กำลังอัปโหลด..." : "ยืนยัน"}
            </button>
          </div>
          {message && <p className="mt-4 text-center text-lg">{message}</p>}
        </div>
      </div>
      {renderSuccessPopup()}
    </div>
  );
};

export default PaymentForm;