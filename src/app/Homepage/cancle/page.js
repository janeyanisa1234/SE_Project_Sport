"use client";

import "./home.css";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import Tabbar from "../../Tab/tab";
import axios from "axios";
import { useSearchParams, useRouter } from "next/navigation";

export default function Page() {
  const [isPopupOpen, setIsPopupOpen] = useState(null);
  const [selectedReasons, setSelectedReasons] = useState([]);
  const [showWarning, setShowWarning] = useState(false);
  const [bookings, setBookings] = useState([]);
  const userId = localStorage.getItem("userId");
  const token = localStorage.getItem("token");
  const searchParams = useSearchParams();
  const bookingId = searchParams.get("bookingId");
  const router = useRouter();

  const handleCheckboxChange = (event) => {
    const { value, checked } = event.target;
    setSelectedReasons((prev) =>
      checked ? [...prev, value] : prev.filter((reason) => reason !== value)
    );
    setShowWarning(false);
  };

  const togglePopup = (index) => {
    setIsPopupOpen(isPopupOpen === index ? null : index);
    setSelectedReasons([]);
    setShowWarning(false);
  };

  const handleCancelBooking = async (bookingIdToCancel) => {
    if (selectedReasons.length === 0) {
      setShowWarning(true);
      return;
    }

    try {
      const response = await axios.post(
        "http://localhost:5000/api/cancle/cancel",
        { booking_id: bookingIdToCancel, reasons: selectedReasons },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setBookings(bookings.filter((b) => b.id_booking !== bookingIdToCancel));
      console.log("Sending to chanel_contact:", { bookingIdToCancel, selectedReasons }); // เพิ่ม log เพื่อตรวจสอบ
      alert("ส่งคำขอยกเลิก!");
      router.push(`/Homepage/cancle/chanel_contact?bookingId=${bookingIdToCancel}&reasons=${encodeURIComponent(selectedReasons.join(", "))}`);

    } catch (error) {
      console.error("เกิดข้อผิดพลาดในการยกเลิก:", error);
      alert("ไม่สามารถยกเลิกการจองได้: " + (error.response?.data?.error || error.message));
    }
  };

  useEffect(() => {
    const fetchBookings = async () => {
      if (!userId || !token) {
        alert("กรุณาเข้าสู่ระบบก่อน");
        return;
      }
      try {
        const response = await axios.get(`http://localhost:5000/history?user_id=${userId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        console.log("ข้อมูลดิบจาก /history:", response.data);
  
        let data = response.data;
        if (!Array.isArray(data)) {
          console.error("ข้อมูลไม่ใช่ array:", data);
          setBookings([]);
          return;
        }
  
        // กรองการจองตามสถานะและวันที่
        const today = new Date();
        today.setHours(0, 0, 0, 0); // รีเซ็ตเวลาเป็นเที่ยงคืนเพื่อเปรียบเทียบวันที่อย่างเดียว
  
        data = data.filter((booking) => {
          const bookingDate = new Date(booking.date_play || booking.date);
          const isConfirmed = booking.status_booking === "ยืนยัน";
          const isNotPast = bookingDate >= today; // ไม่เลยวันเข้าใช้งาน
          const isNotTomorrowOrToday = (bookingDate - today) / (1000 * 60 * 60 * 24) > 2; // มากกว่า 1 วันจากวันนี้
          return isConfirmed && isNotPast && isNotTomorrowOrToday;
        });
        console.log("ข้อมูลที่กรองแล้ว:", data);
  
        // เรียงลำดับตามวันที่จากล่าสุดไปเก่าสุด
        data = data.sort((a, b) => new Date(b.date || b.date_play) - new Date(a.date || a.date_play));
  
        if (bookingId && data.length > 0) {
          const latestBooking = data.find((b) => b.id_booking === bookingId);
          if (latestBooking) {
            setBookings([latestBooking, ...data.filter((b) => b.id_booking !== bookingId)]);
          } else {
            setBookings(data);
          }
        } else {
          setBookings(data);
        }
      } catch (error) {
        console.error("เกิดข้อผิดพลาดในการดึงข้อมูล:", error);
        alert("ไม่สามารถดึงข้อมูลการจองได้: " + (error.response?.data?.error || error.message));
      }
    };
  
    fetchBookings();
    const interval = setInterval(fetchBookings, 5000);
    return () => clearInterval(interval);
  }, [userId, bookingId, token]);

  return (
    <div className="page-wrapper">
      <Tabbar />
      <header className="page-header">
        <div className="header-content">
          <h1>ยกเลิกการจอง</h1>
        </div>
      </header>

      <main className="bookings-container">
        
        {bookings.length > 0 ? (
          <div className="table-card">
            <div className="table-header-wrapper">
              <div className="table-header">
                <div className="header-cell">สนามกีฬา</div>
                <div className="header-cell">ชนิดของกีฬา</div>
                <div className="header-cell">วันที่เข้าใช้</div>
                <div className="header-cell">ยอดชำระ</div>
                <div className="header-cell">ดำเนินการ</div>
              </div>
            </div>
            <div className="table-body">
              {bookings.map((booking, index) => (
                <div key={index} className="table-row">
                  <div className="cell">{booking.Stadium_name || "ไม่ระบุ"}</div>
                  <div className="cell">{booking.Sports_type || "ไม่ระบุ"}</div>
                  <div className="cell">{booking.date_play || booking.date || "ไม่ระบุ"}</div>
                  <div className="cell">{booking.totalPrice || booking.Price || "ไม่ระบุ"} บาท</div>
                  <div className="cell">
                    <button onClick={() => togglePopup(index)} className="cancel-btn">
                      ยกเลิก
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <p className="no-bookings">ไม่มีข้อมูลการจองที่สามารถยกเลิกได้</p>
        )}
        {isPopupOpen !== null && (
          <div className="modal-overlay">
            <div className="modal-box">
              <h2 className="modal-title">เหตุผลในการยกเลิก</h2>
              <div className="reasons-list">
                {["ต้องการเปลี่ยนสนาม", "ไม่สะดวกเข้าใช้งาน", "ต้องการแก้ไขการจอง", "อื่นๆ"].map((reason) => (
                  <label key={reason} className="reason-item">
                    <input
                      type="checkbox"
                      value={reason}
                      onChange={handleCheckboxChange}
                      className="reason-checkbox"
                    />
                    <span>{reason}</span>
                  </label>
                ))}
              </div>
              {showWarning && <p className="warning-msg">*กรุณาเลือกเหตุผลอย่างน้อยหนึ่งข้อ</p>}
              <div className="modal-actions">
                <button onClick={() => setIsPopupOpen(null)} className="close-btn">
                  ปิด
                </button>

                
                  <button
                    onClick={() => handleCancelBooking(bookings[isPopupOpen].id_booking)}
                    className="confirm-btn"
                  >
                    ยืนยันการยกเลิก
                  </button>
                
               
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}