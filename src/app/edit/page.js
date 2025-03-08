"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Tabbar from "../components/tab";
import axios from "axios";
import "./edit.css";

export default function EditPromotion() {
  const [showModal, setShowModal] = useState(false);
  const [promotionName, setPromotionName] = useState("");
  const [startDate, setStartDate] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endDate, setEndDate] = useState("");
  const [endTime, setEndTime] = useState("");
  const [discount, setDiscount] = useState("");
  const [location, setLocation] = useState("");
  const [sports, setSports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const router = useRouter();
  const searchParams = useSearchParams();
  const id = searchParams.get("id");

  useEffect(() => {
    console.log("ID from query:", id, "URL:", window.location.href);
    if (!id) {
      console.error("No ID provided for editing, redirecting to /promotion");
      alert("ไม่พบ ID โปรโมชั่นใน URL กรุณาตรวจสอบ");
      router.push("/promotion");
      return;
    }

    const fetchPromotionDetails = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`http://localhost:5000/api/promotions/${id}`, {
          headers: { "Content-Type": "application/json" },
          timeout: 10000,
        });
        console.log("API Response:", response.data, "Status:", response.status);
        const promo = Array.isArray(response.data) ? response.data[0] : response.data;
        if (!promo) throw new Error("Promotion not found");

        const start = new Date(promo.start_datetime);
        const end = new Date(promo.end_datetime);

        if (isNaN(start.getTime()) || isNaN(end.getTime())) {
          throw new Error("Invalid date format in promotion data");
        }

        setPromotionName(promo.promotion_name || "");
        setStartDate(start.toISOString().split("T")[0] || "");
        setStartTime(start.toTimeString().slice(0, 5) || "");
        setEndDate(end.toISOString().split("T")[0] || "");
        setEndTime(end.toTimeString().slice(0, 5) || "");
        setDiscount(promo.discount_percentage?.toString() || "");
        setLocation(promo.location || "ไม่ระบุ");
        setSports(promo.sports || []);
      } catch (error) {
        console.error("Error fetching promotion details:", {
          message: error.message,
          response: error.response?.data,
        });
        setError("ไม่สามารถโหลดข้อมูลโปรโมชั่นได้: " + (error.response?.data?.error || error.message));
        alert("เกิดข้อผิดพลาดในการโหลดข้อมูลโปรโมชั่น: " + (error.response?.data?.error || error.message));
        router.push("/promotion");
      } finally {
        setLoading(false);
      }
    };

    fetchPromotionDetails();
  }, [id, router]);

  const handleSave = async () => {
    if (!startDate || !startTime || !endDate || !endTime) {
      alert("กรุณากรอกวันที่และเวลาให้ครบถ้วน");
      return;
    }
    if (new Date(`${startDate} ${startTime}`) >= new Date(`${endDate} ${endTime}`)) {
      alert("วันที่เริ่มต้นต้องมาก่อนวันที่สิ้นสุด");
      return;
    }

    const updatedPromotion = {
      start_datetime: `${startDate} ${startTime}:00`,
      end_datetime: `${endDate} ${endTime}:00`,
    };

    try {
      const response = await axios.put(`http://localhost:5000/api/promotions/${id}`, updatedPromotion, {
        headers: { "Content-Type": "application/json" },
        timeout: 10000,
      });
      console.log("Updated promotion:", response.data, "Status:", response.status);
      setShowModal(true);
    } catch (error) {
      console.error("Error updating promotion:", {
        message: error.message,
        response: error.response?.data,
      });
      alert("เกิดข้อผิดพลาดในการอัปเดตโปรโมชั่น: " + (error.response?.data?.error || error.message));
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
    router.push("/promotion");
  };

  const handleViewDetail = () => {
    if (!id) {
      console.error("No promotion ID available");
      alert("ไม่พบข้อมูลโปรโมชั่นที่เลือก กรุณาลองใหม่อีกครั้ง");
      return;
    }
    setShowModal(false);
    router.push(`/detail?id=${id}`);
  };

  if (loading) return <div>กำลังโหลดข้อมูล...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="background">
      <Tabbar />
      <div className="header-title">
        <h1>แก้ไขโปรโมชั่นส่วนลด</h1>
      </div>

      <div className="container">
        {/* หัวข้อรายละเอียดโปรโมชั่น */}
        <h2 className="form-title promo-details-title">รายละเอียดโปรโมชั่น</h2>
        {/* ตารางรายละเอียดโปรโมชั่น */}
        <div className="promo-details-table">
          <table>
            <tbody>
              <tr>
                <th>ชื่อโปรโมชั่น</th>
                <td>{promotionName}</td>
              </tr>
              <tr>
                <th>ส่วนลด</th>
                <td>{discount}%</td>
              </tr>
              <tr>
                <th>สนามที่เข้าร่วม</th>
                <td>{location}</td>
              </tr>
              <tr>
                <th>กีฬาที่เข้าร่วม</th>
                <td>
                  {sports.length > 0 ? (
                    <ul className="sports-list">
                      {sports.map((sport, index) => (
                        <li key={index}>
                          {sport.name} (ราคา: ฿{sport.price}, ลดเหลือ: ฿{sport.discountPrice || Math.round(sport.price * (1 - discount / 100))})
                        </li>
                      ))}
                    </ul>
                  ) : (
                    "ไม่มีกีฬาที่เข้าร่วม"
                  )}
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* ฟอร์มสำหรับแก้ไขระยะเวลา */}
        <div className="form-row">
          <h2 className="form-title">วันที่เริ่มโปรโมชั่น</h2>
          <div className="date-time-group">
            <input
              type="date"
              name="start_date"
              className="input-field"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
            />
            <input
              type="time"
              name="start_time"
              className="input-field"
              value={startTime}
              onChange={(e) => setStartTime(e.target.value)}
            />
          </div>
        </div>

        <div className="form-row">
          <h2 className="form-title">วันที่สิ้นสุดโปรโมชั่น</h2>
          <div className="date-time-group">
            <input
              type="date"
              name="end_date"
              className="input-field"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
            />
            <input
              type="time"
              name="end_time"
              className="input-field"
              value={endTime}
              onChange={(e) => setEndTime(e.target.value)}
            />
          </div>
        </div>

        <div className="button-group">
          <button className="cancel-button" onClick={() => router.push("/promotion")}>
            ยกเลิก
          </button>
          <button className="confirm-button" onClick={handleSave}>
            บันทึก
          </button>
        </div>
      </div>

      {showModal && (
        <div className="modal-overlay">
          <div className="modal-box">
            <img src="/pictureowner/correct.png" alt="Success Icon" className="modal-icon" />
            <h2>แก้ไขโปรโมชั่นสำเร็จ</h2>
            <p>
              โปรโมชั่นส่วนลดนี้จะเริ่มเวลา {startDate} {startTime}{" "}
              และสิ้นสุดเวลา {endDate} {endTime}
            </p>
            <div className="modal-button-group">
              <button onClick={handleCloseModal} className="modal-button">
                กลับไปยังรายการโปรโมชั่น
              </button>
              <button onClick={handleViewDetail} className="modal-button-alt">
                ดูรายละเอียด
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}