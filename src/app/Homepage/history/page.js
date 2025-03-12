"use client";

import "./dash.css";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import Tabbar from "../../Tab/tab";
import axios from "axios";
import { useSearchParams } from "next/navigation";

const Page = () => {
  const [bookings, setBookings] = useState([]);
  const [openDetails, setOpenDetails] = useState(null);
  const userId = localStorage.getItem("userId");
  const token = localStorage.getItem("token");
  const searchParams = useSearchParams();
  const bookingId = searchParams.get("bookingId");

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
        let data = response.data;
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
        console.error("Error fetching booking data:", error);
        alert("ไม่สามารถดึงข้อมูลการจองได้: " + (error.response?.data?.error || error.message));
      }
    };

    fetchBookings();
    const interval = setInterval(fetchBookings, 5000);
    return () => clearInterval(interval);
  }, [userId, bookingId, token]);

  const toggleDetails = (index) => {
    setOpenDetails(openDetails === index ? null : index);
  };

  return (
    <div className="page-container">
      <Tabbar />
      <header className="page-header">
        <div className="header-content">
          
          <h1>ประวัติการจอง</h1>
        </div>
       
      </header>
      <div className="bookings-container">
        {bookings.length > 0 ? (
          <div className="table-card">
            <div className="table-header">
              <div className="header-cell">สนามกีฬา</div>
              <div className="header-cell">ชนิดของกีฬา</div>
              <div className="header-cell">วันที่เข้าใช้</div>
              <div className="header-cell">ยอดชำระ</div>
              <div className="header-cell">ดำเนินการ</div>
            </div>
            <div className="table-body">
              {bookings.map((booking, index) => (
                <React.Fragment key={index}>
                  <div className="table-row">
                    <div className="cell">{booking.Stadium_name || "ไม่ระบุ"}</div>
                    <div className="cell">{booking.Sports_type || "ไม่ระบุ"}</div>
                    <div className="cell">{booking.date_play || booking.date || "ไม่ระบุ"}</div>
                    <div className="cell">{booking.totalPrice || booking.Price || "ไม่ระบุ"} บาท</div>
                    <div className="cell">
                      <button onClick={() => toggleDetails(index)} className="view-btn">
                        {openDetails === index ? "ซ่อนรายละเอียด" : "ดูรายละเอียด"}
                      </button>
                    </div>
                  </div>
                  {openDetails === index && (
                    <div className="details-container">
                      <div className="details-grid">
                        <p className="details-label">สนามที่</p>
                        <p className="details-value">{booking.court || booking.Court || "ไม่ระบุ"}</p>
                        <p className="details-label">วันที่ทำการจอง</p>
                        <p className="details-value">{booking.date || "ไม่ระบุ"}</p>
                        <p className="details-label">เวลาเข้าใช้สนาม</p>
                        <p className="details-value">{booking.time_slot || booking.Time || "ไม่ระบุ"}</p>
                      </div>
                    </div>
                  )}
                </React.Fragment>
              ))}
            </div>
          </div>
        ) : (
          <p className="no-data">ไม่มีข้อมูลการจอง</p>
        )}
      </div>
    </div>
  );
};

export default Page;