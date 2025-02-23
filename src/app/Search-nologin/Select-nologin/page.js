"use client";

import React, { useState } from "react";
import "./Select-nologin.css";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import Tabbar from "../../tabbar-nologin/tab";
import Headfunction from "../../Headfunction/page";
import Link from "next/link";  // ใช้ Link จาก next/link

const SelectPlacenologin = () => {
  const [selectedDate, setSelectedDate] = useState(null);
  const [activeCategory, setActiveCategory] = useState("ยอดนิยม");
  const [selectedSlot, setSelectedSlot] = useState({});
  const [selectedVenue, setSelectedVenue] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [bookingConfirmed, setBookingConfirmed] = useState(false);

  const categories = ["ยอดนิยม", "แบดมินตัน", "ฟุตซอล", "ฟุตบอล", "ปิงปอง"];

  const popularVenues = [
    {
      img: "/picturemild/Badminton.svg",
      alt: "สนามแบดมินตัน",
      title: "แบดมินตัน",
      totalCourts: 2,
      pricePerHour: 150,
      promotion: "ส่วนลด 10%",
    },
    {
      img: "/picturemild/Footbal.svg",
      alt: "สนามฟุตบอล",
      title: "ฟุตบอล",
      totalCourts: 1,
      pricePerHour: 700,
      promotion: "ส่วนลด 10%",
    },
    {
      img: "/picturemild/Footsal.svg",
      alt: "สนามฟุตซอล",
      title: "ฟุตซอล",
      totalCourts: 1,
      pricePerHour: 400,
      promotion: "ส่วนลด 10%",
    },
  ];

  const venues = {
    "แบดมินตัน": [
      {
        img: "/picturemild/Bad_Court1.svg",
        alt: "คอร์ดแบดมินตัน 1",
        title: "คอร์ด 1",
        availableTimeslots: ["09:00 - 10:00", "10:00 - 11:00", "11:00 - 12:00", "12:00 - 13:00", "13:00 - 14:00", "14:00 - 15:00"],
        unavailableTimeslots: ["15:00 - 16:00", "16:00 - 17:00", "17:00 - 18:00", "18:00 - 19:00"],
        totalCourts: 3,
        pricePerHour: 300,
      },
      {
        img: "/picturemild/Bad_Court2.svg",
        alt: "คอร์ดแบดมินตัน 2",
        title: "คอร์ด 2",
        availableTimeslots: ["09:00 - 10:00", "10:00 - 11:00", "11:00 - 12:00", "12:00 - 13:00", "13:00 - 14:00", "14:00 - 15:00"],
        unavailableTimeslots: ["15:00 - 16:00", "16:00 - 17:00", "17:00 - 18:00", "18:00 - 19:00"],
        totalCourts: 2,
        pricePerHour: 300,
      },
      {
        img: "/picturemild/Bad_Court3.svg",
        alt: "คอร์ดแบดมินตัน 3",
        title: "คอร์ด 3",
        availableTimeslots: ["09:00 - 10:00", "10:00 - 11:00", "11:00 - 12:00", "12:00 - 13:00", "13:00 - 14:00", "14:00 - 15:00"],
        unavailableTimeslots: ["15:00 - 16:00", "16:00 - 17:00", "17:00 - 18:00", "18:00 - 19:00"],
        totalCourts: 1,
        pricePerHour: 300,
      }
    ],
    "ฟุตซอล": [
      {
        img: "/picturemild/Futsal_court1.png",
        alt: "สนามฟุตซอล 1",
        title: "สนามฟุตซอล 1",
        availableTimeslots: ["09:00 - 10:00", "10:00 - 11:00", "11:00 - 12:00", "12:00 - 13:00", "13:00 - 14:00"],
        unavailableTimeslots: ["15:00 - 16:00", "16:00 - 17:00"],
        totalCourts: 5,
        pricePerHour: 500,
      }
    ],
    "ฟุตบอล": [
      {
        img: "/picturemild/Football_court1.png",
        alt: "สนามฟุตบอล 1",
        title: "สนามฟุตบอล 1",
        availableTimeslots: ["09:00 - 10:00", "10:00 - 11:00", "11:00 - 12:00", "12:00 - 13:00"],
        unavailableTimeslots: ["15:00 - 16:00"],
        totalCourts: 4,
        pricePerHour: 700,
      }
    ],
    "ปิงปอง": [
      {
        img: "/Pingpong_court1.png",
        alt: "สนามปิงปอง 1",
        title: "สนามปิงปอง 1",
        availableTimeslots: ["09:00 - 10:00", "10:00 - 11:00", "11:00 - 12:00"],
        unavailableTimeslots: ["15:00 - 16:00"],
        totalCourts: 2,
        pricePerHour: 150,
      }
    ],
  };


  const isLoggedIn = false;

  const handleVenueSelect = (venue) => {
    if (!isLoggedIn) {
      setShowModal(true);
      return;
    }
    if (selectedVenue?.title === venue.title) {
      return;
    }
    setSelectedVenue(venue);
    setSelectedSlot({});
  };

  const handleCloseModal = () => {
    setShowModal(false);
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

        {activeCategory === "ยอดนิยม" && (
          <div className="popular-venues">
            {popularVenues.map((venue, index) => (
              <div
                className={`venue-card ${selectedVenue?.title === venue.title ? "selected" : ""}`}
                key={index}
                onClick={() => handleVenueSelect(venue)}
              >
                <img src={venue.img} alt={venue.alt} className="venue-image" />
                <div className="venue-info">
                  <h3>{venue.title}</h3>
                  <p>{venue.promotion}</p>
                  <p>฿{venue.pricePerHour} / ชั่วโมง</p>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeCategory !== "ยอดนิยม" && venues[activeCategory]?.map((venue, index) => (
          <div
            className={`venue-card ${selectedVenue?.title === venue.title ? "selected" : ""}`}
            key={index}
            onClick={() => handleVenueSelect(venue)}
          >
            <img src={venue.img} alt={venue.alt} className="venue-image" />
            <div className="venue-info">
              <h3>{venue.title}</h3>
              <div className="timeslot-container">
                {venue.availableTimeslots.map((slot, i) => (
                  <button
                    key={i}
                    className={`timeslot-btn ${selectedSlot[venue.title]?.includes(slot) ? "selected" : "available"}`}
                    onClick={() => handleTimeslotSelect(venue, slot)}
                  >
                    {slot}
                  </button>
                ))}
                {venue.unavailableTimeslots.map((slot, i) => (
                  <button key={i} className="timeslot-btn unavailable" disabled>
                    {slot}
                  </button>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>

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
    </>
  );
};

export default SelectPlacenologin;
