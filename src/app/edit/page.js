"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Tabbar from "../components/tab";
import axios from "axios";
import "./edit.css";


export default function EditPromotion() {
  // State การจัดการข้อมูลและ UI
  const [showModal, setShowModal] = useState(false); // ควบคุมการแสดง modal
  const [promotionName, setPromotionName] = useState(""); // ชื่อโปรโมชัน
  const [startDate, setStartDate] = useState(""); // วันที่เริ่ม
  const [startTime, setStartTime] = useState(""); // เวลาเริ่ม
  const [endDate, setEndDate] = useState(""); // วันที่สิ้นสุด
  const [endTime, setEndTime] = useState(""); // เวลาสิ้นสุด
  const [discount, setDiscount] = useState(""); // ส่วนลด
  const [stadiumName, setStadiumName] = useState(""); // สถานที่
  const [sports, setSports] = useState([]); // รายการกีฬา
  const [loading, setLoading] = useState(true); // สถานะการโหลด
  const [error, setError] = useState(null); // ข้อผิดพลาด

  
  const router = useRouter(); // อินสแตนซ์ของ router
  const searchParams = useSearchParams(); // ดึง query parameters
  const id = searchParams.get("id"); // ดึง ID จาก URL

  // โหลดข้อมูลโปรโมชันตอนเริ่ม
  useEffect(() => {
    const token = localStorage.getItem("token"); // ดึง token
    if (!token) {
      alert("กรุณาเข้าสู่ระบบก่อนแก้ไขโปรโมชัน"); // แจ้งเตือนถ้าไม่มี token
      router.push("/Login"); // ไปหน้า login
      return;
    }

    if (!id) { // ตรวจสอบ ID
      console.error("No ID provided"); // log ถ้าไม่มี ID
      alert("ไม่พบ ID โปรโมชันใน URL"); // แจ้งเตือน
      router.push("/promotion"); // ไปหน้าโปรโมชัน
      return;
    }

    console.log("ID:", id, "URL:", window.location.href); // log ข้อมูล URL
    fetchPromotionDetails(token); // ดึงข้อมูลโปรโมชัน
  }, [id, router]);

  // ฟังก์ชันดึงข้อมูลโปรโมชันจาก API
  const fetchPromotionDetails = async (token) => {
    try {
      setLoading(true); // เริ่มโหลด
      const response = await axios.get(`http://localhost:5000/api/promotions/${id}`, {
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` }, // header สำหรับ API
        timeout: 10000, // timeout 10 วินาที
      });

      console.log("API Response:", response.data); // log ข้อมูลที่ได้
      const promo = Array.isArray(response.data) ? response.data[0] : response.data; // จัดการข้อมูลที่อาจเป็น array
      if (!promo) throw new Error("Promotion not found"); // ถ้าไม่มีข้อมูล โยน error

      const start = new Date(promo.start_datetime); // วันที่เริ่ม
      const end = new Date(promo.end_datetime); // วันที่สิ้นสุด
      if (isNaN(start.getTime()) || isNaN(end.getTime())) throw new Error("Invalid date format"); // ตรวจสอบวันที่

      setPromotionName(promo.promotion_name || ""); // ตั้งชื่อ
      setStartDate(start.toISOString().split("T")[0] || ""); // ตั้งวันที่เริ่ม
      setStartTime(start.toTimeString().slice(0, 5) || ""); // ตั้งเวลาเริ่ม
      setEndDate(end.toISOString().split("T")[0] || ""); // ตั้งวันที่สิ้นสุด
      setEndTime(end.toTimeString().slice(0, 5) || ""); // ตั้งเวลาสิ้นสุด
      setDiscount(promo.discount_percentage?.toString() || ""); // ตั้งส่วนลด
      setStadiumName(promo.stadium_name || "ไม่ระบุ"); // ตั้งชื่อสนามจากข้อมูล API
      setSports(promo.sports || []); // ตั้งรายการกีฬา
    } catch (error) {
      console.error("Fetch error:", error.message, error.response?.data); // log ข้อผิดพลาด
      if (error.response?.status === 401) { // ถ้า token หมดอายุ
        alert("เซสชันหมดอายุ"); // แจ้งเตือน
        router.push("/Login"); // ไปหน้า login
      } else {
        setError("ไม่สามารถโหลดข้อมูลได้: " + (error.response?.data?.error || error.message)); // ตั้ง error
        alert("เกิดข้อผิดพลาด: " + (error.response?.data?.error || error.message)); // แจ้งเตือน
        router.push("/promotion"); // ไปหน้าโปรโมชัน
      }
    } finally {
      setLoading(false); // หยุดโหลด
    }
  };

  // ฟังก์ชันบันทึกการแก้ไข
  const handleSave = async () => {
    const token = localStorage.getItem("token"); // ดึง token
    if (!token) {
      alert("กรุณาเข้าสู่ระบบก่อน"); // แจ้งเตือนถ้าไม่มี token
      router.push("/Login"); // ไปหน้า login
      return;
    }

    if (!startDate || !startTime || !endDate || !endTime) { // ตรวจสอบข้อมูล
      alert("กรุณากรอกวันที่และเวลาให้ครบ"); // แจ้งเตือนถ้าขาดข้อมูล
      return;
    }

    if (new Date(`${startDate} ${startTime}`) >= new Date(`${endDate} ${endTime}`)) { // ตรวจสอบวันที่
      alert("วันที่เริ่มต้องมาก่อนวันที่สิ้นสุด"); // แจ้งเตือนถ้าผิดลำดับ
      return;
    }

    const updatedPromotion = { // ข้อมูลที่อัปเดต
      start_datetime: `${startDate} ${startTime}:00`,
      end_datetime: `${endDate} ${endTime}:00`,
    };

    try {
      const response = await axios.put(`http://localhost:5000/api/promotions/${id}`, updatedPromotion, {
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` }, // header สำหรับ API
        timeout: 10000, // timeout 10 วินาที
      });

      console.log("Updated:", response.data); // log ข้อมูลที่อัปเดต
      setShowModal(true); // แสดง modal
    } catch (error) {
      console.error("Update error:", error.message, error.response?.data); // log ข้อผิดพลาด
      if (error.response?.status === 401) { // ถ้า token หมดอายุ
        alert("เซสชันหมดอายุ"); // แจ้งเตือน
        router.push("/Login"); // ไปหน้า login
      } else {
        alert("เกิดข้อผิดพลาด: " + (error.response?.data?.error || error.message)); // แจ้งเตือนข้อผิดพลาดอื่น
      }
    }
  };

  // ปิด modal
  const handleCloseModal = () => { 
    setShowModal(false); // ซ่อน modal
    router.push("/promotion"); // ไปหน้าโปรโมชัน
  };

  // ดูรายละเอียด
  const handleViewDetail = () => { 
    if (!id) {
      console.error("No promotion ID"); // log ถ้าไม่มี ID
      alert("ไม่พบข้อมูลโปรโมชัน"); // แจ้งเตือน
      return;
    }
    setShowModal(false); // ซ่อน modal
    router.push(`/detail?id=${id}`); // ไปหน้ารายละเอียด
  };

  // UI
  if (loading) return <div>กำลังโหลดข้อมูล...</div>; 
  if (error) return <div>{error}</div>; // แสดงข้อผิดพลาด

  return (
    <div className="background">
      <Tabbar />
      <div className="edit-header-title">
        <h1>แก้ไขโปรโมชันส่วนลด</h1>
      </div>

      <div className="edit-container"> {/* แก้ไขจาก .edit-container เป็น edit-container (ลบจุดหน้า) */}
        {/* หัวข้อรายละเอียดโปรโมชัน */}
        <h2 className="form-title promo-details-title">รายละเอียดโปรโมชัน</h2>
        {/* ตารางรายละเอียดโปรโมชัน */}
        <div className="promo-details-table">
          <table>
            <tbody>
              <tr>
                <th>ชื่อโปรโมชัน</th>
                <td>{promotionName}</td>
              </tr>
              <tr>
                <th>ส่วนลด</th>
                <td>{discount}%</td>
              </tr>
              <tr>
                <th>สนามที่เข้าร่วม</th>
                <td>{stadiumName}</td>
              </tr>
              <tr>
                <th>กีฬาที่เข้าร่วม</th>
                <td>
                  {sports.length > 0 ? (
                    <ul className="sports-list">
                      {sports.map((sport, index) => (
                        <li key={index}>
                          {sport.name} (ราคา ฿{sport.price} ลดเหลือ ฿{sport.discountPrice || Math.round(sport.price * (1 - discount / 100))})
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
          <h2 className="form-title">วันที่เริ่มโปรโมชัน</h2>
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
          <h2 className="form-title">วันที่สิ้นสุดโปรโมชัน</h2>
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
            <h2>แก้ไขโปรโมชันสำเร็จ</h2>
            <p>
              โปรโมชันส่วนลดนี้จะเริ่มเวลา {startDate} {startTime}{" "}
              และสิ้นสุดเวลา {endDate} {endTime}
            </p>
            <div className="modal-button-group">
              <button onClick={handleCloseModal} className="modal-button">
                กลับไปยังรายการโปรโมชัน
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