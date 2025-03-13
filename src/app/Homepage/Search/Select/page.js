"use client";
 
import React, { useEffect, useState } from "react";
import "./Select.css";
import Tabbar from "../../../Tab/tab";
import Headfunction from "@/app/Headfunction/page";
import axios from "axios";
import { useSearchParams, useRouter } from "next/navigation";
 
const SelectPlace = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const stadiumName = searchParams.get("stadium_name");
  const stadiumAddress = searchParams.get("stadium_address");
 
  const [activeCategory, setActiveCategory] = useState("ทั้งหมด");
  const [stadiumData, setStadiumData] = useState({ name: "", address: "", imageUrl: "" });
  const [totalVenues, setTotalVenues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState([]);
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedCourt, setSelectedCourt] = useState(null);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [selectedTimes, setSelectedTimes] = useState([]);
  const [showPopup, setShowPopup] = useState(false);
  const [userId, setUserId] = useState(null);
  const [bookingData, setBookingData] = useState({
    sportType: "",
    courtNumber: "",
    date: "",
    timeSlots: [],
    price: 0,
  });
 
  useEffect(() => {
    const storedUserId = localStorage.getItem("userId"); // ใช้ userId จาก localStorage แทน AuthService
    if (!storedUserId) {
      router.push("/Login");
    } else {
      setUserId(storedUserId);
    }
 
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
        }
      } catch (error) {
        console.error("Error fetching data:", error.response?.data || error.message);
      } finally {
        setLoading(false);
      }
    }
    fetchTotalVenues();
  }, [stadiumName, router]);
 
  const handleCategoryClick = (category) => {
    setActiveCategory(category);
    setSelectedCourt(null);
    setSelectedSlot(null);
    setSelectedTimes([]);
  };
 
  const handleDateChange = (event) => {
    setSelectedDate(event.target.value);
    setBookingData((prev) => ({ ...prev, date: event.target.value }));
  };
 
  const handleCourtSelection = (court) => {
    if (selectedCourt && selectedCourt.court_id === court.court_id) {
      setSelectedCourt(null);
      setSelectedSlot(null);
      setSelectedTimes([]);
      setBookingData({
        stadiumName: "",
        sportType: "",
        courtNumber: "",
        date: selectedDate,
        timeSlots: [],
        price: 0,
      });
    } else {
      setSelectedCourt(court);
      setSelectedSlot(null);
      setSelectedTimes([]);
      setBookingData({
        stadiumName: stadiumName,
        sportType: court.court_type,
        courtNumber: "",
        date: selectedDate,
        timeSlots: [],
        price: parseFloat(court.final_price) || 0,
      });
      setActiveCategory(court.court_type);
    }
  };
 
  const handleSlotSelection = (slotNumber) => {
    if (selectedSlot === slotNumber) {
      setSelectedSlot(null);
      setSelectedTimes([]);
      setBookingData((prev) => ({ ...prev, courtNumber: "", timeSlots: [] }));
    } else {
      setSelectedSlot(slotNumber);
      setSelectedTimes([]);
      setBookingData((prev) => ({ ...prev, courtNumber: slotNumber.toString(), timeSlots: [] }));
    }
  };
 
  const handleTimeSelection = (time) => {
    if (!selectedCourt || !selectedSlot) return;
 
    setSelectedTimes((prevTimes) => {
      const timeString = `${time.start}-${time.end}`;
      const newTimes = prevTimes.includes(timeString)
        ? prevTimes.filter((t) => t !== timeString)
        : [...prevTimes, timeString];
      setBookingData((prev) => ({ ...prev, timeSlots: newTimes }));
      return newTimes;
    });
  };
 
  const handleBookingConfirmation = () => {
    if (selectedCourt && selectedSlot && selectedDate && selectedTimes.length > 0) {
      setShowPopup(true);
    }
  };
 
  const handleEditBooking = () => {
    setShowPopup(false);
  };
 
  const handleFinalConfirmation = async () => {
    setShowPopup(false);
 
    const totalPrice = bookingData.price * bookingData.timeSlots.length;
    const bookingPayload = {
      userId,
      stadiumId: totalVenues.find((v) => v.stadium_name === stadiumName)?.id || "",
      courtId: selectedCourt?.court_id || "",
      stadiumName: stadiumName,
      sportType: selectedCourt?.court_type || "",
      courtNumber: parseInt(bookingData.courtNumber),
      date: bookingData.date,
      timeSlots: bookingData.timeSlots,
      price: totalPrice,
    };
 
    try {
      const response = await axios.post
      ("http://localhost:5000/api/booking/stadiums", bookingPayload, {
        headers: { "Content-Type": "application/json" },
      });
      router.push(
        `/Homepage/Search/Select/payment-qr?bookingId=${response.data.bookingId}&price=${totalPrice}&userId=${userId}&stadiumName=${encodeURIComponent(response.data.stadiumName)}&sportType=${encodeURIComponent(response.data.sportType)}&courtNumber=${bookingPayload.courtNumber}&date=${bookingPayload.date}&timeSlots=${encodeURIComponent(JSON.stringify(bookingPayload.timeSlots))}&id_stadium=${bookingPayload.stadiumId}&id_court=${bookingPayload.courtId}`
      );
    } catch (error) {
      console.error("Error submitting booking:", error.response?.data || error.message);
      alert("เกิดข้อผิดพลาดในการจอง: " + (error.response?.data?.error || error.message));
    }
  };
 
  const renderPopup = () => {
    if (!showPopup) return null;
 
    const totalPrice = bookingData.price * bookingData.timeSlots.length;
    return (
      <div className="popup-overlay">
        <div className="popup-content">
          <h3 className="popup-title">สรุปการจอง</h3>
          <div className="popup-details">
            <p>สนาม: {bookingData.stadiumName}</p>
            <p>กีฬาที่จอง: {bookingData.sportType}</p>
            <p>คอร์ด: {bookingData.courtNumber}</p>
            <p>วันที่: {bookingData.date}</p>
            <p>เวลา: {bookingData.timeSlots.join(", ")}</p>
            <p>ราคา: {totalPrice} บาท</p>
          </div>
          <div className="popup-buttons">
            <button className="edit-button" onClick={handleEditBooking}>
              แก้ไขการจอง
            </button>
            <button className="confirm-button" onClick={handleFinalConfirmation}>
              ยืนยัน
            </button>
          </div>
        </div>
      </div>
    );
  };
 
  const renderVenueList = () => {
    const stadium = totalVenues.find((venue) => venue.stadium_name === stadiumName);
    if (!stadium) return <p>ไม่พบข้อมูลสนาม</p>;
 
    if (activeCategory === "ทั้งหมด") {
      return (
        <div className="category-list">
          {stadium.courts.map((court) => (
            <div
              key={`court-${court.court_id}`}
              className={`venue-card ${selectedCourt?.court_id === court.court_id ? "selected" : ""}`}
            >
              <div className="court-header" onClick={() => handleCourtSelection(court)}>
                <img src={court.court_image} alt={court.court_type} className="venue-image" />
                <div className="court-info">
                  <h3>สนาม {court.court_type}</h3>
                  {court.discount_percentage > 0 && <p>โปรโมชั่นลด {court.discount_percentage}%</p>}
                  <p>ราคา: {court.final_price || "ไม่ระบุ"} บาท</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      );
    }
 
    const filteredCourts = stadium.courts.filter((court) => court.court_type === activeCategory);
 
    return (
      <div className="category-list">
        {filteredCourts.map((court) => {
          const courtSlots = Array.from({ length: court.court_quantity }, (_, idx) => idx + 1);
          const times = court.times || [];
 
          return (
            <div
              key={`court-${court.court_id}`}
              className={`venue-card ${selectedCourt?.court_id === court.court_id ? "selected" : ""}`}
            >
              <div className="court-header" onClick={() => handleCourtSelection(court)}>
                <h3>สนาม {court.court_type}</h3>
              </div>
 
              {selectedCourt?.court_id === court.court_id && selectedDate && (
                <div className="timeslot-container">
                  {courtSlots.map((slotNumber) => (
                    <div
                      key={`slot-${slotNumber}`}
                      className={`slot-container ${selectedSlot === slotNumber ? "selected-slot" : ""}`}
                    >
                      <h5 onClick={() => handleSlotSelection(slotNumber)} style={{ cursor: "pointer" }}>
                        คอร์ด {slotNumber}
                      </h5>
                      <div className="time-rows">
                        <div className="time-row">
                          {times.length > 0 ? (
                            times.map((time) => (
                              <div
                                key={`time-${time.start}-${time.end}`}
                                className={`slot ${
                                  time.status === "available"
                                    ? selectedSlot === slotNumber && selectedTimes.includes(`${time.start}-${time.end}`)
                                      ? "selected"
                                      : "available"
                                    : "unavailable"
                                }`}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  if (time.status === "available" && selectedSlot === slotNumber) {
                                    handleTimeSelection(time);
                                  }
                                }}
                                style={time.status === "unavailable" ? { pointerEvents: "none" } : {}}
                              >
                                {time.start} - {time.end}
                              </div>
                            ))
                          ) : (
                            <p>ไม่มีช่วงเวลาสำหรับคอร์ดนี้</p>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    );
  };
 
  return (
    <>
      <Tabbar />
      <Headfunction />
      <div className="select-place-container">
        <div className="banner" style={{ backgroundImage: `url('${stadiumData.imageUrl}')` }}>
          <div className="Headdetail">
            <h2 className="venue-name">{stadiumName}</h2>
            <p className="venue-address">{stadiumAddress}</p>
            <div className="date-picker-container">
              <label htmlFor="booking-date"></label>
              <input
                type="date"
                id="booking-date"
                value={selectedDate}
                onChange={handleDateChange}
                min={new Date().toISOString().split("T")[0]}
              />
            </div>
          </div>
        </div>
 
        <nav className="category-nav">
          {categories.length > 0 ? (
            categories.map((category) => (
              <button
                key={category}
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
 
        <div className="venue-list">{loading ? <p>กำลังโหลดข้อมูล...</p> : renderVenueList()}</div>
 
        {selectedCourt && selectedSlot && selectedDate && selectedTimes.length > 0 && (
          <div className="booking-footer">
            <button className="confirm-button" onClick={handleBookingConfirmation}>
              ยืนยันการจอง
            </button>
          </div>
        )}
      </div>
      {renderPopup()}
    </>
  );
};
 
export default SelectPlace;