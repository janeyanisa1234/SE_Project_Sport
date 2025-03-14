"use client";
 
 
import { useState, useEffect } from "react";
import Headfunction from "../Headfunction/page";
import Tabbar from "../components/tab.js";
import Link from "next/link";
import "./Homepage.css";
import axios from "axios";
 
 
export default function Home() {
  const [promotedStadiums, setPromotedStadiums] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentSlide, setCurrentSlide] = useState(0);
  const slides = [
    "/picturemild/GuideToBooking.png"
  ];
 
  useEffect(() => {
    async function fetchPromotedStadiums() {
      try {
        const response = await axios.get("http://localhost:5000/bookings/promoted-stadiums", {
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
      } catch (error) {
        console.error("Error fetching promoted stadiums:", error);
        if (error.response) {
          console.log("Response Data:", error.response.data);
          console.log("Response Status:", error.response.status);
          setError(`เกิดข้อผิดพลาด: ${error.response.data.error || error.message}`);
        } else {
          setError("ไม่สามารถเชื่อมต่อกับเซิร์ฟเวอร์ได้");
        }
        setPromotedStadiums([]);
      } finally {
        setLoading(false);
      }
    }
    fetchPromotedStadiums();
 
    // Auto-slide carousel
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000); // เปลี่ยนรูปทุก 5 วินาที
    return () => clearInterval(interval);
  }, []);
 
  return (
    <>
      <Tabbar />
      <Headfunction />
 
      <main className="content">
        {/* Carousel */}
        <div className="carousel">
          <div className="carousel-inner" style={{ transform: `translateX(-${currentSlide * 100}%)` }}>
            {slides.map((slide, index) => (
              <Link key={index} href="/HowtoBooking">
                <img src={slide} alt={`Slide ${index + 1}`} className="Howto" />
              </Link>
            ))}
          </div>
          <div className="carousel-controls">
            <button className="carousel-btn" onClick={() => setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length)}>❮</button>
            <button className="carousel-btn" onClick={() => setCurrentSlide((prev) => (prev + 1) % slides.length)}>❯</button>
          </div>
        </div>
 
        {/* Promotion Section */}
        <section className="promotion-section">
          <h3>สนามที่เข้าร่วมโปรโมชัน</h3>
          <div className="grid-container">
            {loading ? (
              <p className="loading-text">กำลังโหลด...</p>
            ) : error ? (
              <p className="error-text">{error}</p>
            ) : promotedStadiums.length > 0 ? (
              promotedStadiums.map((item, index) => (
                <Link
                  key={item.id || index}
                  href={`/Homepage/Search/Select?stadium_name=${encodeURIComponent(item.stadium_name)}&stadium_address=${encodeURIComponent(item.stadium_address)}`}
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
              <p className="no-data-text">ไม่มีสนามที่เข้าร่วมโปรโมชัน</p>
            )}
          </div>
          <Link href="/Homepage/PromotionPlace">
            <button className="view-more-button">ดูเพิ่มเติม</button>
          </Link>
        </section>
      </main>
    </>
  );
}
 