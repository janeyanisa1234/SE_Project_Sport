"use client";

import Link from "next/link";
import React, { useState, useEffect } from "react";
import "./Select.css";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import Tabbar from "../../../Tab/tab";
import Headfunction from "@/app/Headfunction/page";
import axios from "axios";

const SelectPlace = () => {
  const [selectedDate, setSelectedDate] = useState(null);
  const [activeCategory, setActiveCategory] = useState("ยอดนิยม");
  const [selectedSlot, setSelectedSlot] = useState({});
  const [selectedVenue, setSelectedVenue] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [bookingConfirmed, setBookingConfirmed] = useState(false);
  const [placeData, setPlaceData] = useState([]);
  const [loading, setLoading] = useState(true);

  const categories = ["ทั้งหมด", "แบดมินตัน", "ฟุตซอล", "ฟุตบอล", "ปิงปอง"];

  useEffect(() => {
    async function fetchtypesData() {
      try {
        const response = await axios.get("http://localhost:5000/api/Booking/court");
        console.log("📌 Data from API:", response.data);

        if (response.data && response.data.length > 0) {
          setPlaceData(response.data); // Set data for courts
        } else {
          console.error("No place data received");
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false); // Set loading false after fetching data
      }
    }
    fetchtypesData();
  }, []);

  const handleVenueSelect = (venue) => {
    if (selectedVenue?.title === venue.title) {
      return;
    }
    setSelectedVenue(venue);
    setSelectedSlot({});
  };

  const handleTimeslotSelect = (venue, slot) => {
    if (!selectedVenue) {
      alert("กรุณาเลือกคอร์ดก่อนเลือกเวลา");
      return;
    }

    setSelectedSlot((prev) => {
      const updatedTimeslots = prev[venue.title] ? [...prev[venue.title]] : [];
      if (updatedTimeslots.includes(slot)) {
        return { ...prev, [venue.title]: updatedTimeslots.filter((time) => time !== slot) };
      } else {
        return { ...prev, [venue.title]: [...updatedTimeslots, slot] };
      }
    });
  };

  const handleConfirm = () => {
    if (selectedSlot[selectedVenue?.title]?.length > 0 && selectedDate && selectedVenue) {
      setShowModal(true);
    } else {
      alert("กรุณาเลือกข้อมูลทั้งหมด");
    }
  };

  const handleCloseModal = () => {
    setBookingConfirmed(true);
    setShowModal(false);
  };

  const calculatePrice = () => {
    const selectedTimes = selectedSlot[selectedVenue?.title] || [];
    return selectedTimes.length * selectedVenue?.pricePerHour || 0;
  };

  return (
    <>
      <Tabbar />
      <Headfunction />
      <div className="select-place-container">
        <div className="banner">
          <h2 className="venue-name">AVOCADO</h2>
          <p className="venue-address">55/5 หมู่ 10 ซอย12 บ้านสวน จ.ชลบุรี</p>
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

        {/* Categories Navigation */}
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

        {/* Legend for available/unavailable times */}
        <div className="legend-container">
          <div className="legend-item">
            <span className="legend-color available"></span>
            <span>ว่าง</span>
            <span className="legend-color unavailable"></span>
            <span>ไม่ว่าง</span>
          </div>
        </div>

        {/* All Sports Categories */}
        {(activeCategory === "ทั้งหมด" || placeData.some(venue => venue.type === activeCategory)) && (
          <div className="sports-categories">

            {placeData.map((venue, index) => {
              if (activeCategory === "ทั้งหมด" || venue.type === activeCategory) {
                return (
                  <div
                    className={`venue-card ${selectedVenue?.title === venue.title ? "selected" : ""}`}
                    key={index}
                    onClick={() => handleVenueSelect(venue)}
                  >
                    <img src={venue.court_image} alt={venue.alt} className="venue-image" />
                    <div className="venue-info">
                      
                      <p>{venue.court_type}</p> {/* แสดงประเภทของสนาม */}
                      <p>{venue.promotion}</p>
                      <p>฿{venue.court_price} / ชั่วโมง</p>
                    </div>
                  </div>
                );
              }
            })}
          </div>
        )}

        {selectedSlot[selectedVenue?.title]?.length > 0 && selectedDate && selectedVenue && (
          <div className="confirmation">
            <button onClick={handleConfirm}>ยืนยัน</button>
          </div>
        )}

        {showModal && (
          <div className="modal-overlay">
            <div className="modal">
              <h3>สรุปการจอง</h3>
              <div className="modal-content">
                <p><strong>ประเภทกีฬา : </strong> {activeCategory}</p>
                <p><strong>คอร์ดที่เลือก : </strong> {selectedVenue?.title}</p>
                <p><strong>วันที่เลือก : </strong> {selectedDate?.toLocaleDateString("th-TH")}</p>
                <p><strong>เวลาที่เลือก : </strong> {selectedSlot[selectedVenue?.title]?.join(", ")}</p>
                <p><strong>ราคา : </strong> ฿{calculatePrice()}</p>
              </div>
              <div className="modal-actions">
                <button className="cancel-button" onClick={() => setShowModal(false)}>
                  แก้ไขการจอง
                </button>

                <Link href={"/Homepage/Search/Select/payment-qr"}>
                  <button className="confirm-button" onClick={handleCloseModal}>
                    ยืนยัน
                  </button>
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default SelectPlace;
