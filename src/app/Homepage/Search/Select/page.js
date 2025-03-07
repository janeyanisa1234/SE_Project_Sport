"use client";

import Link from "next/link";
import React, { useEffect, useState } from "react";
import "./Select.css";
import Tabbar from "../../../Tab/tab";
import Headfunction from "@/app/Headfunction/page";
import axios from "axios";
import { useSearchParams } from "next/navigation";

const SelectPlace = () => {
  const searchParams = useSearchParams();
  const stadiumName = searchParams.get("stadium_name");
  const stadiumAddress = searchParams.get("stadium_address");

  const [activeCategory, setActiveCategory] = useState("ทั้งหมด");
  const [stadiumData, setStadiumData] = useState({ name: "", address: "", imageUrl: "" });
  const [totalVenues, setTotalVenues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState([]);
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedCourt, setSelectedCourt] = useState(null); // State to store selected court
  const [selectedTimes, setSelectedTimes] = useState([]); // State to store selected times

  useEffect(() => {
    async function fetchTotalVenues() {
      try {
        const response = await axios.get("http://localhost:5000/api/booking/stadiums");
        if (response.data && response.data.length > 0) {
          setTotalVenues(response.data);

          const stadium = response.data.find((venue) => venue.stadium_name === stadiumName);
          if (stadium) {
            setStadiumData({
              name: stadium.stadium_name,
              address: stadium.stadium_address,
              imageUrl: stadium.stadium_image,
            });

            const categoriesInVenue = new Set();
            stadium.courts.forEach((court) => {
              categoriesInVenue.add(court.court_type);
            });
            setCategories(["ทั้งหมด", ...Array.from(categoriesInVenue)]);
          }
        } else {
          console.error("No place data received");
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchTotalVenues();
  }, [stadiumName]);

  const handleCategoryClick = (category) => {
    setActiveCategory(category);
    setSelectedCourt(null); // Reset selected court when category changes
    setSelectedTimes([]); // Reset selected times when category changes
  };

  const handleDateChange = (event) => {
    setSelectedDate(event.target.value);
  };

  const handleCourtSelection = (court) => {
    setSelectedCourt(court);
    setSelectedTimes([]); // Reset selected times when court is selected
  };

  const handleTimeSelection = (time) => {
    setSelectedTimes((prevTimes) =>
      prevTimes.includes(time) ? prevTimes.filter((t) => t !== time) : [...prevTimes, time]
    );
  };

  const handleBookingConfirmation = () => {
    alert(
      `คุณเลือกคอร์ด ${selectedCourt.court_type} \nวันที่: ${selectedDate}\nเวลา: ${selectedTimes.join(", ")}`
    );
  };

  const renderVenueList = () => {
    const stadium = totalVenues.find((venue) => venue.stadium_name === stadiumName);
    if (!stadium) return <p>ไม่พบข้อมูลสนาม</p>;

    // กรณีเลือก "ทั้งหมด" จะแสดงเฉพาะประเภทกีฬา, ราคา, และส่วนลด
    if (activeCategory === "ทั้งหมด") {
      return (
        <div className="category-list">
          {stadium.courts.map((court) => (
            <div
              key={court.court_id} // เพิ่ม key ที่ไม่ซ้ำกัน
              className={`venue-card ${selectedCourt?.court_id === court.court_id ? "selected" : ""}`}
              onClick={() => handleCourtSelection(court)}
              style={{
                pointerEvents: selectedCourt && selectedCourt.court_id !== court.court_id ? "none" : "auto",
              }} // Block click on already selected courts
            >
              <img src={court.court_image} alt={court.court_type} className="venue-image" />
              <h3>สนาม {court.court_type}</h3>
              {court.discount_percentage > 0 && (
                <p>โปรโมชั่นลด {court.discount_percentage}%</p>
              )}
              <p>ราคา: {court.final_price} บาท</p>
            </div>
          ))}
        </div>
      );
    }

    // ถ้า activeCategory ไม่ใช่ "ทั้งหมด" ให้กรองคอร์ดที่ตรงกับประเภทกีฬา
    const filteredCourts = activeCategory !== "ทั้งหมด"
      ? stadium.courts.filter((court) => court.court_type === activeCategory)
      : stadium.courts;

    return (
      <>
        {filteredCourts.map((court) => {
          // สร้างช่องเวลาแยกตามจำนวนสนาม
          const courtSlots = Array.from({ length: court.court_quantity }, (_, idx) => idx + 1);

          return (
            <div
              key={court.court_id} // เพิ่ม key ที่ไม่ซ้ำกัน
              className={`venue-card ${selectedCourt?.court_id === court.court_id ? "selected" : ""}`}
              onClick={() => handleCourtSelection(court)}
              style={{
                pointerEvents: selectedCourt && selectedCourt.court_id !== court.court_id ? "none" : "auto",
              }} // Block click on already selected courts
            >
              <div className="venue-info">
                {selectedCourt?.court_id === court.court_id && selectedDate && (
                  <div className="timeslot-container">
                    {courtSlots.map((slotNumber) => (
                      <div key={slotNumber} className="slot-container">
                        <h5>คอร์ด {slotNumber}</h5>
                        {court.times.map((time) => (
                          <div
                            key={time.start + time.end} // เพิ่ม key ให้กับแต่ละเวลา
                            className={`slot ${time.status === "available" ? "available" : "unavailable"}`}
                            onClick={() => time.status === "available" && handleTimeSelection(time.start + time.end)}
                          >
                            {time.start} - {time.end}
                          </div>
                        ))}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </>
    );
  };

  return (
    <>
      <Tabbar />
      <Headfunction />
      <div className="select-place-container">
        <div className="banner" style={{ backgroundImage: `url('${stadiumData.imageUrl}')` }}>
          <h2 className="venue-name">{stadiumName}</h2>
          <p className="venue-address">{stadiumAddress}</p>

          {/* ช่องเลือกวันที่อยู่ใต้ที่อยู่ของสนาม */}
          <div className="date-picker-container">
            <label htmlFor="booking-date"></label>
            <input
              type="date"
              id="booking-date"
              value={selectedDate}
              onChange={handleDateChange}
              min={new Date().toISOString().split("T")[0]} // Prevent selecting past dates
            />
          </div>
        </div>

        <nav className="category-nav">
          {categories.length > 0 ? (
            categories.map((category, index) => (
              <button
                key={category + index} // Added index to make sure the key is unique
                className={activeCategory === category ? "active" : ""}
                onClick={() => handleCategoryClick(category)}
              >
                {category}
              </button>
            ))
          ) : (
            <p>กำลังโหลดข้อมูล...</p>
          )}
        </nav>

        <div className="venue-list">
          {loading ? <p>กำลังโหลดข้อมูล...</p> : renderVenueList()}
        </div>

        {/* เมื่อเลือกคอร์ดและเวลาครบแล้ว */}
        {selectedCourt && selectedDate && selectedTimes.length > 0 && (
          <div className="booking-footer">
            <button className="confirm-button" onClick={handleBookingConfirmation}>
              ยืนยันการจอง
            </button>
          </div>
        )}
      </div>
    </>
  );
};

export default SelectPlace;
