"use client";
 
import { useState, useEffect } from "react";
import "./Search.css"; // ใช้ CSS เดิม และจะปรับเพิ่มเติมตามที่ต้องการ
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import Tabbar from "../../Tab/tab";
import Headfunction from "../../Headfunction/page";
import Link from "next/link";
import axios from "axios";
import { useSearchParams } from "next/navigation";
 
export default function SearchPlace() {
  const [placeData, setPlaceData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const searchParams = useSearchParams();
  const stadiumName = searchParams.get("stadium_name") || "";
  const stadiumAddress = searchParams.get("stadium_address") || "";
  const [selectedDate, setSelectedDate] = useState(null);
  const [activeCategory, setActiveCategory] = useState("ยอดนิยม");
  const [selectedSlot, setSelectedSlot] = useState({});
  const [selectedVenue, setSelectedVenue] = useState(null);
  const [showModal, setShowModal] = useState(false);
 
  // กำหนดหมวดหมู่จากข้อมูล API
  const categories = ["ยอดนิยม", ...new Set(placeData.map(item => item.court_type || "อื่นๆ"))].filter(Boolean);
 
  useEffect(() => {
    async function fetchPlaceData() {
      try {
        const url = `http://localhost:5000/booking/stadiums?stadium_name=${encodeURIComponent(stadiumName)}`;
        const response = await axios.get(url, { timeout: 10000 });
        console.log("📌 Data from API:", response.data);
 
        if (response.data && Array.isArray(response.data)) {
          setPlaceData(response.data);
        } else {
          console.warn("No place data received or empty array");
          setPlaceData([]);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        if (error.response) {
          console.log("Response Data:", error.response.data);
          console.log("Response Status:", error.response.status);
          setError(`เกิดข้อผิดพลาด: ${error.response.data.error || error.message}`);
        } else {
          setError("ไม่สามารถเชื่อมต่อกับเซิร์ฟเวอร์ได้");
        }
        setPlaceData([]);
      } finally {
        setLoading(false);
      }
    }
    fetchPlaceData();
  }, [stadiumName]);
 
  const handleVenueSelect = (venue) => {
    const isLoggedIn = false; // จำลองสถานะไม่ล็อกอิน
    if (!isLoggedIn) {
      setShowModal(true);
      return;
    }
    if (selectedVenue?.stadium_name === venue.stadium_name) {
      setSelectedVenue(null);
      setSelectedSlot({});
    } else {
      setSelectedVenue(venue);
      setSelectedSlot({});
    }
  };
 
  const handleTimeslotSelect = (venue, slot) => {
    setSelectedSlot(prev => ({
      ...prev,
      [venue.stadium_name]: prev[venue.stadium_name]?.includes(slot)
        ? prev[venue.stadium_name].filter(s => s !== slot)
        : [...(prev[venue.stadium_name] || []), slot]
    }));
  };
 
  const handleCloseModal = () => {
    setShowModal(false);
  };
 
  // จำลองข้อมูลตารางเวลา (สามารถดึงจาก API เพิ่มเติมได้)
  const getTimeslots = (venue) => {
    // สมมติว่า venue มีข้อมูล timeslots จาก API (เช่น venue.courts[0].times)
    const times = venue.courts?.[0]?.times || [
      "09:00 - 10:00", "10:00 - 11:00", "11:00 - 12:00",
      "12:00 - 13:00", "13:00 - 14:00", "14:00 - 15:00",
      "15:00 - 16:00", "16:00 - 17:00", "17:00 - 18:00"
    ];
    const unavailableSlots = ["15:00 - 16:00", "16:00 - 17:00"]; // จำลอง slot ที่จองแล้ว
    return { available: times.filter(t => !unavailableSlots.includes(t)), unavailable: unavailableSlots };
  };
 
  return (
    <>
      <Tabbar />
      <Headfunction />
      <main className="places-list">
        <div className="select-place-container">
          <div className="banner">
            <h2 className="venue-name">{stadiumName || "AVOCADO"}</h2>
            <p className="venue-address">{stadiumAddress || "55/5 หมู่ 10 ซอย12 บ้านสวน จ.ชลบุรี"}</p>
            <div className="Calender">
              <DatePicker
                selected={selectedDate}
                onChange={(date) => setSelectedDate(date)}
                dateFormat="dd/MM/yyyy"
                className="date-picker"
                placeholderText="กรุณาเลือกวันที่"
                minDate={new Date()}
              />
            </div>
          </div>
 
          <nav className="category-nav">
            {categories.map((category) => (
              <button
                key={category}
                className={activeCategory === category ? "active" : ""}
                onClick={() => setActiveCategory(category)}
              >
                {category}
              </button>
            ))}
          </nav>
 
          {activeCategory !== "ยอดนิยม" && (
            <div className="legend-container">
              <div className="legend-item">
                <span className="legend-color available"></span>
                <span>ว่าง</span>
                <span className="legend-color unavailable"></span>
                <span>ไม่ว่าง</span>
              </div>
            </div>
          )}
 
          {activeCategory === "ยอดนิยม" && placeData.length > 0 && (
            <div className="popular-venues">
              {placeData.map((venue, index) => (
                <div
                  key={index}
                  className={`venue-card ${selectedVenue?.stadium_name === venue.stadium_name ? "selected" : ""}`}
                  onClick={() => handleVenueSelect(venue)}
                >
                  <img
                    src={venue.stadium_image || "/picturemild/default.svg"}
                    alt={venue.stadium_name}
                    className="venue-image"
                  />
                  <div className="venue-info">
                    <h3>{venue.stadium_name}</h3>
                    {venue.promotion && (
                      <p>{venue.promotion.discount_percentage}%</p>
                    )}
                    <p>฿{venue.final_price || 0} / ชั่วโมง</p>
                  </div>
                </div>
              ))}
            </div>
          )}
 
          {activeCategory !== "ยอดนิยม" && placeData.length > 0 && (
            <div className="venue-list">
              {placeData
                .filter(venue => venue.court_type === activeCategory || !venue.court_type)
                .map((venue, index) => (
                  <div
                    key={index}
                    className={`venue-card ${selectedVenue?.stadium_name === venue.stadium_name ? "selected" : ""}`}
                    onClick={() => handleVenueSelect(venue)}
                  >
                    <img
                      src={venue.stadium_image || "/picturemild/default.svg"}
                      alt={venue.stadium_name}
                      className="venue-image"
                    />
                    <div className="venue-info">
                      <h3>{venue.stadium_name}</h3>
                      <div className="timeslot-container">
                        {getTimeslots(venue).available.map((slot, i) => (
                          <button
                            key={i}
                            className={`timeslot-btn ${selectedSlot[venue.stadium_name]?.includes(slot) ? "selected" : "available"}`}
                            onClick={(e) => {
                              e.stopPropagation();
                              handleTimeslotSelect(venue, slot);
                            }}
                          >
                            {slot}
                          </button>
                        ))}
                        {getTimeslots(venue).unavailable.map((slot, i) => (
                          <button key={i} className="timeslot-btn unavailable" disabled>
                            {slot}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          )}
 
          {showModal && (
            <div className="modal">
              <div className="modal-content">
                <button className="close-btn" onClick={handleCloseModal}>×</button>
                <h2>กรุณาเข้าสู่ระบบก่อนทำการจอง</h2>
                <Link href="/Login">
                  <button className="login-btn">เข้าสู่ระบบ</button>
                </Link>
              </div>
            </div>
          )}
        </div>
      </main>
    </>
  );
}