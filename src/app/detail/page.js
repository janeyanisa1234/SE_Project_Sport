"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Tabbar from "../components/tab";
import axios from "axios";
import "./detail.css";

// Component หลักสำหรับแสดงรายละเอียดโปรโมชัน
export default function Detail() {
  // State การจัดการข้อมูล
  const [promotion, setPromotion] = useState(null); // เก็บข้อมูลโปรโมชัน
  const router = useRouter(); 
  const searchParams = useSearchParams(); 
  const id = searchParams.get("id"); // ดึง ID จาก URL

  // โหลดข้อมูลเมื่อเริ่ม
  useEffect(() => {
    const token = localStorage.getItem("token"); // ดึง token
    if (!token) {
      alert("กรุณาเข้าสู่ระบบก่อนดูรายละเอียดโปรโมชั่น"); // แจ้งเตือนถ้าไม่มี token
      router.push("/Login"); // ไปหน้า login
      return;
    }

    if (!id || isNaN(parseInt(id))) { // ตรวจสอบ ID
      console.error("Invalid or missing ID:", id); // log ถ้า ID ไม่ถูกต้อง
      alert("ไม่มีข้อมูลโปรโมชั่นที่เลือก"); // แจ้งเตือน
      router.push("/promotion"); // ไปหน้าโปรโมชัน
      return;
    }

    fetchPromotionDetails(token); // ดึงข้อมูลโปรโมชัน
  }, [id, router]);

  // ฟังก์ชันจัดรูปแบบวันที่เป็น YYYY-MM-DD HH:mm
  const formatDate = (dateString) => {
    if (!dateString || isNaN(new Date(dateString).getTime())) return "ไม่ระบุ"; // ถ้าวันที่ไม่ถูกต้อง
    const date = new Date(dateString); // สร้าง object วันที่
    const year = date.getFullYear(); // ดึงปี
    const month = String(date.getMonth() + 1).padStart(2, "0"); // แปลงเดือนเป็น 2 หลัก
    const day = String(date.getDate()).padStart(2, "0"); // แปลงวันเป็น 2 หลัก
    const hours = String(date.getHours()).padStart(2, "0"); // แปลงชั่วโมงเป็น 2 หลัก
    const minutes = String(date.getMinutes()).padStart(2, "0"); // แปลงนาทีเป็น 2 หลัก
    return `${year}-${month}-${day} ${hours}:${minutes}`; // คืนค่าในรูปแบบที่ต้องการ
  };

  // ฟังก์ชันดึงข้อมูลโปรโมชันจาก API
  const fetchPromotionDetails = async (token) => {
    try {
      const response = await axios.get(`http://localhost:5000/api/promotions/${id}`, {
        headers: { Authorization: `Bearer ${token}` }, // header สำหรับ API
      });

      const promo = Array.isArray(response.data) ? response.data[0] : response.data; // จัดการข้อมูลที่อาจเป็น array
      if (!promo) throw new Error("Promotion not found"); // ถ้าไม่มีข้อมูล โยน error

      let sportsData = [{ name: "ไม่ระบุ", price: 150, discountPrice: 135, discount: "0%" }]; // ค่าเริ่มต้นกีฬา
      const discountPercentage = promo.discount_percentage || 0; // ค่าเริ่มต้นส่วนลด

      if (promo.sports && Array.isArray(promo.sports) && promo.sports.length > 0) { // ถ้ามีกีฬา
        sportsData = promo.sports.map((s) => {
          const price = s.price || 150; // ราคาเริ่มต้น
          const discountPrice = s.discountPrice || Math.round(price * (1 - discountPercentage / 100)); // ราคาหลังลด
          const calculatedDiscount = s.discountPrice 
            ? `${Math.round(((price - s.discountPrice) / price) * 100)}%` 
            : `${discountPercentage}%`; // คำนวณส่วนลด

          return {
            name: s.name || "ไม่ระบุ", // ชื่อกีฬา
            price, // ราคา
            discountPrice, // ราคาหลังลด
            discount: calculatedDiscount, // ส่วนลด
          };
        });
      }

      setPromotion({ // อัปเดต state
        id: promo.id, // ID โปรโมชัน
        name: promo.promotion_name || "ไม่ระบุ", // ชื่อโปรโมชัน
        duration: `${formatDate(promo.start_datetime)} - ${formatDate(promo.end_datetime)}`, // ระยะเวลา
        stadiumName: promo.stadium_name || "ไม่ระบุ", // ชื่อสนาม
        sports: sportsData, // รายการกีฬา
        status: promo.promotion_status || "ไม่ระบุ", // สถานะ
      });

      console.log("Fetched details:", promotion); // log ข้อมูลที่ได้
    } catch (error) {
      console.error("Fetch error:", error.response?.data || error); // log ข้อผิดพลาด
      if (error.response?.status === 401) { // ถ้า token หมดอายุ
        alert("เซสชันหมดอายุ"); // แจ้งเตือน
        router.push("/Login"); // ไปหน้า login
      } else {
        alert("เกิดข้อผิดพลาด: " + (error.response?.data?.error || error.message)); // แจ้งเตือนข้อผิดพลาดอื่น
        router.push("/promotion"); // ไปหน้าโปรโมชัน
      }
    }
  };

  // ฟังก์ชันจัดการการนำทาง
  const handleBackClick = () => { // กลับไปหน้าโปรโมชัน
    router.push("/promotion"); // นำทางไปหน้าโปรโมชัน
  };

  // แสดงผล UI
  if (!promotion) return <div>กำลังโหลดข้อมูล...</div>; 
  
  return (
    <div className="background">
      <Tabbar />
      <div className="detail-header-title">
        <h1>รายละเอียดโปรโมชั่น</h1>
      </div>

      <div className="detail-container">
        <div className="detail-section-title">
          <h2>รายละเอียดโปรโมชั่น</h2>
        </div>

        {promotion ? (
          <div className="promo-info">
            <div className="info-row">
              <h3>ชื่อโปรโมชั่น :</h3>
              <h3 className="highlight-text">{promotion.name}</h3>
            </div>
            <div className="info-row">
              <h3>สนาม :</h3>
              <h3 className="highlight-text">{promotion.stadiumName}</h3>
            </div>
            <div className="info-row">
              <h3>ระยะเวลาโปรโมชั่น :</h3>
              <h3 className="highlight-text">{promotion.duration}</h3>
            </div>
            <div className="info-row">
              <h3>สถานะ :</h3>
              <h3 className={`highlight-text ${promotion.status.toLowerCase().replace(" ", "-")}`}>
                {promotion.status}
              </h3>
            </div>
          </div>
        ) : (
          <p>กำลังโหลดข้อมูล...</p>
        )}

        <table className="promo-table">
          <thead>
            <tr>
              <th>ประเภทกีฬา</th>
              <th>ราคาเดิม</th>
              <th>ราคาโปรโมชั่น</th>
              <th>ส่วนลด</th>
            </tr>
          </thead>
          <tbody>
            {promotion ? (
              promotion.sports.map((sport, index) => (
                <tr key={index}>
                  <td className="table-center" style={{ wordBreak: "break-word", whiteSpace: "normal" }}>{sport.name}</td>
                  <td className="table-center" style={{ wordBreak: "break-word", whiteSpace: "normal" }}>{`฿${sport.price}`}</td>
                  <td className="table-center" style={{ wordBreak: "break-word", whiteSpace: "normal" }}>{`฿${sport.discountPrice}`}</td>
                  <td className="table-center" style={{ wordBreak: "break-word", whiteSpace: "normal" }}>{sport.discount}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4">กำลังโหลดข้อมูล...</td>
              </tr>
            )}
          </tbody>
        </table>

        <div className="button-container">
          <button className="back-button" onClick={handleBackClick}>
            กลับไปยังรายการโปรโมชั่น
          </button>
        </div>
      </div>
    </div>
  );
}