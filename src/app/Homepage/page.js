"use client";


import { useState, useEffect } from "react";
import Headfunction from "../Headfunction/page";
import Tabbar from "../Tab/tab.js";
import Link from "next/link";
import "./Homepage.css";
import axios from "axios";
import { useRouter } from "next/navigation";

export default function Homepage() {
  const [promotedStadiums, setPromotedStadiums] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const router = useRouter();

  useEffect(() => {
    async function fetchPromotedStadiums() {
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
  }, []);

  const handleStadiumClick = (stadium) => {
    router.push(
      `/Homepage/Search/Select?stadium_name=${encodeURIComponent(stadium.stadium_name)}&stadium_address=${encodeURIComponent(stadium.stadium_address)}`
    );
  };


  return (
    <>
      <Tabbar />
      <Headfunction />

      <main className="content">
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
              <p className="error-text">{error}</p>
            ) : promotedStadiums.length > 0 ? (
              promotedStadiums.map((item, index) => (
                <div key={item.id || index} className="grid-item" onClick={() => handleStadiumClick(item)}>
                  <Link
                    href={`/Homepage/Search/Select?stadium_name=${encodeURIComponent(item.stadium_name)}&stadium_address=${encodeURIComponent(item.stadium_address)}`}
                  >
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
                  </Link>
                </div>
              ))
            ) : (
              <p className="no-data-text">ไม่มีสนามที่เข้าร่วมโปรโมชั่น</p>
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