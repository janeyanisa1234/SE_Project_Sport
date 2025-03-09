"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Tabbar from "../components/tab";
import axios from "axios";
import "./detail.css";

export default function Detail() {
  const [promotion, setPromotion] = useState(null);
  const router = useRouter();
  const searchParams = useSearchParams();
  const id = searchParams.get("id");

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("กรุณาเข้าสู่ระบบก่อนดูรายละเอียดโปรโมชั่น");
      router.push("/Login");
      return;
    }

    if (!id || isNaN(parseInt(id))) {
      console.error("Invalid or missing ID for fetching promotion details:", id);
      alert("ไม่มีข้อมูลโปรโมชั่นที่เลือก กรุณาเลือกโปรโมชั่นจากรายการ");
      router.push("/promotion");
      return;
    }
    fetchPromotionDetails(token);
  }, [id, router]);

  // ฟังก์ชันสำหรับจัดรูปแบบวันที่เป็น YYYY-MM-DD HH:mm
  const formatDate = (dateString) => {
    if (!dateString || isNaN(new Date(dateString).getTime())) {
      return "ไม่ระบุ";
    }
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");
    return `${year}-${month}-${day} ${hours}:${minutes}`;
  };

  const fetchPromotionDetails = async (token) => {
    try {
      const response = await axios.get(`http://localhost:5000/api/promotions/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const promo = Array.isArray(response.data) ? response.data[0] : response.data;
      if (!promo) throw new Error("Promotion not found");

      let sportsData = [{ name: "ไม่ระบุ", price: 150, discountPrice: 135, discount: "0%" }];
      let discountPercentage = promo.discount_percentage || 0;

      if (promo.sports && Array.isArray(promo.sports) && promo.sports.length > 0) {
        sportsData = promo.sports.map((s) => {
          const price = s.price || 150;
          const discountPrice = s.discountPrice || Math.round(price * (1 - discountPercentage / 100));
          const calculatedDiscount = s.discountPrice
            ? `${Math.round(((price - s.discountPrice) / price) * 100)}%`
            : `${discountPercentage}%`;

          return {
            name: s.name || "ไม่ระบุ",
            price,
            discountPrice,
            discount: calculatedDiscount,
          };
        });
      }

      setPromotion({
        id: promo.id,
        name: promo.promotion_name || "ไม่ระบุ",
        duration: `${formatDate(promo.start_datetime)} - ${formatDate(promo.end_datetime)}`,
        stadiumName: promo.stadium_name || "ไม่ระบุ",
        sports: sportsData,
        status: promo.promotion_status || "ไม่ระบุ",
      });
      console.log("Fetched promotion details:", promotion);
    } catch (error) {
      console.error("Error fetching promotion details:", error.response?.data || error);
      if (error.response?.status === 401) {
        alert("เซสชันหมดอายุ กรุณาเข้าสู่ระบบใหม่");
        router.push("/Login");
      } else {
        alert("เกิดข้อผิดพลาดในการดึงข้อมูลโปรโมชั่น: " + (error.response?.data?.error || error.message));
        router.push("/promotion");
      }
    }
  };

  const handleBackClick = () => {
    router.push("/promotion");
  };

  return (
    <div className="background">
      <Tabbar />
      <div className="header-title">
        <h1>รายละเอียดโปรโมชั่น</h1>
      </div>

      <div className="container">
        <div className="section-title">
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