"use client";

import { useState, useEffect } from "react";
import Headfunction from "../Headfunction/page";
import Tabbar from "../tabbar-nologin/tab.js";
import "./PromotionPlace.css";
import axios from "axios";

export default function PromotionPlacenologin() {
  const [displayCount, setDisplayCount] = useState("");
  const [duration, setDuration] = useState("");
  const [promotedStadiums, setPromotedStadiums] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchPromotedStadiums() {
      try {
        const response = await axios.get("http://localhost:5000/api/bookings/promoted-stadiums", {
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

  const generateGoogleMapsLink = (address) => {
    return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`;
  };

  return (
    <>
      <Tabbar />
      <Headfunction />
      <main className="places-list">
        <h3 className="section-title">สนามที่เข้าร่วมโปรโมชั่น</h3>

        {/* Dropdown เลือกจำนวนที่จะแสดง และระยะเวลา */}
        <div className="dropdown-container">
          <select
            id="display-count"
            className="dropdown"
            value={displayCount}
            onChange={(e) => setDisplayCount(e.target.value)}
          >
            <option value="" disabled hidden>
              จำนวนในการแสดง
            </option>
            <option value="5">5</option>
            <option value="10">10</option>
            <option value="15">15</option>
            <option value="20">20</option>
          </select>

          <select
            id="duration"
            className="dropdown"
            value={duration}
            onChange={(e) => setDuration(e.target.value)}
          >
            <option value="" disabled hidden>
              ระยะเวลา
            </option>
            <option value="1">1 เดือน</option>
            <option value="3">3 เดือน</option>
            <option value="6">6 เดือน</option>
            <option value="12">12 เดือน</option>
          </select>
        </div>

        {/* แสดงรายการสนามจาก API */}
        {loading ? (
          <p className="loading-text">กำลังโหลด...</p>
        ) : error ? (
          <p className="error-text">{error}</p>
        ) : promotedStadiums.length > 0 ? (
          promotedStadiums
            .slice(0, parseInt(displayCount) || promotedStadiums.length)
            .map((place, index) => (
              <div key={place.id || index} className="place-card">
                <img
                  src={place.stadium_image || "/picturemild/default.svg"}
                  alt={place.stadium_name}
                  className="place-image"
                />
                <div className="place-info">
                  <h3 className="place-name">{place.stadium_name}</h3>
                  <p className="place-address">
                    <a
                      href={generateGoogleMapsLink(place.stadium_address)}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{ color: "black" }}
                    >
                      {place.stadium_address}
                    </a>
                  </p>
                  {place.promotion && (
                    <p className="grid-promo">ส่วนลด: {place.promotion.discount_percentage}%</p>
                  )}
                </div>
              </div>
            ))
        ) : (
          <p className="no-data-text">ไม่มีสนามที่เข้าร่วมโปรโมชั่น</p>
        )}
      </main>
    </>
  );
}