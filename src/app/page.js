"use client";

import { useState, useEffect } from "react";
import Headfunction from "./Headfunction/page.js";
import Tabbar from "./tabbar-nologin/tab.js";
import Link from "next/link";
import "./globals.css";
import axios from "axios";

export default function Home() {
  const [promotedStadiums, setPromotedStadiums] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchPromotedStadiums() {
      for (let attempt = 1; attempt <= 3; attempt++) {
        try {
          const response = await axios.get("http://localhost:5000/booking/promoted-stadiums", {
            timeout: 10000,
          });
          console.log("Promoted stadiums data:", response.data);
          if (response.data && Array.isArray(response.data)) {
            setPromotedStadiums(response.data);
          } else {
            console.warn("Data is not an array:", response.data);
            setPromotedStadiums([]);
            setError("ข้อมูลที่ได้รับไม่ถูกต้อง");
          }
          break; // ออกจาก loop ถ้าสำเร็จ
        } catch (error) {
          console.error(`Attempt ${attempt}/3 - Error fetching promoted stadiums:`, error);
          if (error.response) {
            console.log("Response Data:", error.response.data);
            console.log("Response Status:", error.response.status);
            setError(`เกิดข้อผิดพลาด: ${error.response.data.error || error.message}`);
          } else {
            setError("ไม่สามารถเชื่อมต่อกับเซิร์ฟเวอร์ได้");
          }
          setPromotedStadiums([]);
          if (attempt === 3) {
            setError("ไม่สามารถดึงข้อมูลได้หลังจากลอง 3 ครั้ง");
            break;
          }
          await new Promise((resolve) => setTimeout(resolve, 2000 * attempt)); // รอ 2, 4, 6 วินาที
        }
      }
      setLoading(false);
    }
    fetchPromotedStadiums();
  }, []);

  return (
    <>
      <Tabbar />
      <Headfunction />

      <main className="content">
        {/* Carousel */}
        <div className="carousel">
          <Link href="/HowtoBooking">
            <img src="/picturemild/GuideToBooking.png" alt="Howto" className="carousel-image" />
          </Link>
        </div>

        {/* สนามที่เข้าร่วมโปรโมชั่น */}
        <section className="promotion-section">
  <h3 className="section-title">สนามที่เข้าร่วมโปรโมชั่น</h3>
  <div className="grid-container">
    {loading ? (
      <p className="loading-text">กำลังโหลด...</p>
    ) : error ? (
      <div className="error-container">
        <p className="error-text">{error}</p>
        <button onClick={() => window.location.reload()} className="retry-button">
          ลองใหม่
        </button>
      </div>
    ) : promotedStadiums.length > 0 ? (
      promotedStadiums.map((item, index) => (
        <Link
          key={item.id || index}
          href={`/Search-nologin/Select-nologin?stadium_name=${encodeURIComponent(item.stadium_name)}&stadium_address=${encodeURIComponent(item.stadium_address)}`}
        >
          <div className="grid-item">
            <img
              src={item.stadium_image || "/picturemild/default.svg"}
              alt={item.stadium_name}
              className="grid-image"
            />
            <p className="grid-title">{item.stadium_name}</p>
            {item.promotion && (
              <p className="grid-promo">
                ส่วนลด: {item.promotion.discount_percentage}%
              </p>
            )}
          </div>
        </Link>
      ))
    ) : (
      <p className="no-data-text">ไม่มีสนามที่เข้าร่วมโปรโมชั่น</p>
    )}
  </div>
  <Link href="/PromotionPlace-no-login">
    <button className="view-more-button">ดูเพิ่มเติม</button>
  </Link>
</section>
      </main>
    </>
  );
}