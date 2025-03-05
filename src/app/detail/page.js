"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Tabbar from "../components/tab";
import axios from "axios";
import "./detail.css";

export default function Detail() {
  const [promotion, setPromotion] = useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const id = searchParams.get("id");

  useEffect(() => {
    if (!id) {
      console.error("No ID provided for fetching promotion details");
      alert("ไม่มีข้อมูลโปรโมชั่นที่เลือก กรุณาเลือกโปรโมชั่นจากรายการ");
      router.push("/promotion");
      return;
    }
    fetchPromotionDetails();
  }, [id]);

  const fetchPromotionDetails = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/api/promotions/${id}`);
      console.log("Response data:", response.data); // เพิ่ม log เพื่อตรวจสอบข้อมูล
      const promo = Array.isArray(response.data) ? response.data[0] : response.data;
      if (!promo) {
        throw new Error("Promotion not found");
      }
      let sport = "Unknown";
      let stadiumName = "ไม่ระบุ";
      let originalPrice = "฿150";
      let promoPrice = "฿135";

      if (promo.sports) {
        const sportsArray = JSON.parse(promo.sports);
        if (sportsArray.length > 0) {
          sport = sportsArray[0].name || "Unknown";
          stadiumName = sportsArray[0].stadiumName || "ไม่ระบุ";
          originalPrice = `฿${sportsArray[0].price || 150}`;
          promoPrice = `฿${Math.round((sportsArray[0].price || 150) * (1 - (promo.discount_percentage || 0) / 100))}`;
        }
      }

      setPromotion({
        name: promo.promotion_name,
        duration: `${promo.start_datetime} - ${promo.end_datetime}`,
        sport,
        stadiumName,
        originalPrice,
        promoPrice,
        discount: `${promo.discount_percentage || 0}% ลด`,
        limit: promo.discount_limit ? `${promo.discount_limit} ครั้ง` : "ไม่จำกัดการจอง",
      });
      console.log("Fetched promotion details:", promo);
    } catch (error) {
      console.error("Error fetching promotion details:", error.response?.data || error.message);
      alert(error.response?.data?.error || "เกิดข้อผิดพลาดในการดึงข้อมูลโปรโมชั่น: " + error.message);
    }
  };

  const handleDetailClick = () => {
    router.push("/promotion");
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="background">
      <Tabbar />
      <div className="header-title">
        <h1>รายละเอียดโปรโมชั่น</h1>
      </div>

      <div className="container">
        <div className="section-title">
          <h2>รายละเอียดเบื้องต้น</h2>
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
          </div>
        ) : (
          <p>กำลังโหลดข้อมูล...</p>
        )}

        <table className="promo-table">
          <thead>
            <tr><th>ประเภทกีฬา</th><th>สนาม</th><th>ราคาเดิม</th><th>ราคาโปรโมชั่น</th><th>ส่วนลด</th><th>จำกัดการจอง</th></tr>
          </thead>
          <tbody>
            {promotion ? (
              <tr>
                <td className="table-center">
                  <div className="sport-info">
                    <img src={`/pictureowner/${promotion.sport.toLowerCase()}.png`} alt="sport-icon" className="sport-icon" />
                    <h4>{promotion.sport}</h4>
                  </div>
                </td>
                <td className="table-center">{promotion.stadiumName}</td>
                <td className="table-center">{promotion.originalPrice}</td>
                <td className="table-center">{promotion.promoPrice}</td>
                <td className="table-center">{promotion.discount}</td>
                <td className="table-center">{promotion.limit}</td>
              </tr>
            ) : (
              <tr><td colSpan="6">กำลังโหลดข้อมูล...</td></tr>
            )}
          </tbody>
        </table>

        <div className="button-container">
          <button className="back-button" onClick={handleDetailClick}>
            กลับไปยังรายการโปรโมชั่น
          </button>
        </div>
      </div>
    </div>
  );
}