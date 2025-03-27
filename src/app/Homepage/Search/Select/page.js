"use client";

import React, { useEffect, useState } from "react";
import "./Select.css";
import Tabbar from "../../../components/tab";
import Headfunction from "@/app/Headfunction/page";
import axios from "axios";
import { useSearchParams, useRouter } from "next/navigation";

const SelectPlace = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const stadiumName = searchParams.get("stadium_name");
  const stadiumAddress = searchParams.get("stadium_address");
  const bookedSlotsFromParams = searchParams.get("bookedSlots");

  const [activeCategory, setActiveCategory] = useState("ทั้งหมด");
  const [stadiumData, setStadiumData] = useState({ name: "", address: "", imageUrl: "" });
  const [totalVenues, setTotalVenues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [categories, setCategories] = useState([]);
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedCourt, setSelectedCourt] = useState(null);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [selectedTimes, setSelectedTimes] = useState([]);
  const [userId, setUserId] = useState(null);
  const [bookedSlots, setBookedSlots] = useState({});

  const [bookingData, setBookingData] = useState({
    sportType: "",
    courtNumber: "",
    date: "",
    timeSlots: [],
    price: 0,
  });

  // ตั้งค่าวันที่ปัจจุบันเมื่อเข้าหน้า
  useEffect(() => {
    const today = new Date().toISOString().split("T")[0]; // ได้วันที่ในรูปแบบ "YYYY-MM-DD"
    setSelectedDate(today);
    setBookingData((prev) => ({ ...prev, date: today }));
  }, []);

  // Fetch stadium data
  useEffect(() => {
    const storedUserId = localStorage.getItem("userId");
    if (!storedUserId) {
      router.push("/Login");
    } else {
      setUserId(storedUserId);
    }

    async function fetchTotalVenues() {
      try {
        setLoading(true);
        setError(null);
        const response = await axios.get("http://localhost:5000/booking/stadiums", { timeout: 10000 });
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
          } else {
            setError("ไม่พบสนามที่เลือก");
          }
        } else {
          setError("ไม่มีข้อมูลสนามจากเซิร์ฟเวอร์");
        }
      } catch (error) {
        console.error("Error fetching data:", error.message);
        setError(`เกิดข้อผิดพลาด: ${error.message}`);
      } finally {
        setLoading(false);
      }
    }

    fetchTotalVenues();
  }, [stadiumName, router]);

  // Fetch booked slots
  useEffect(() => {
    async function fetchBookedSlots() {
      try {
        if (!selectedDate || !stadiumName) {
          console.log("Missing selectedDate or stadiumName, skipping fetch");
          return;
        }
        console.log("Fetching booked slots with:", { stadiumName, selectedDate });
        const response = await axios.get(`http://localhost:5000/api/booking/confirm/booked-slots`, {
          params: { stadiumName, date: selectedDate },
          timeout: 10000,
        });
        console.log("Response from /booked-slots:", response.data);
        const slotsByCourt = {};
        response.data.forEach((booking) => {
          const courtNum = booking.court || "1";
          if (!slotsByCourt[courtNum]) slotsByCourt[courtNum] = [];
          if (booking.status_booking === "ยืนยัน" && booking.status_timebooking === true) {
            booking.time_slot.split(",").forEach((slot) => slotsByCourt[courtNum].push(slot.trim()));
          }
        });
        console.log("Processed bookedSlots:", slotsByCourt);
        setBookedSlots(slotsByCourt);
      } catch (error) {
        console.error("Detailed error fetching booked slots:", {
          message: error.message || "No error message",
          status: error.response ? error.response.status : "No status",
          data: error.response ? error.response.data : "No response data",
          request: error.request ? "Request made but no response" : "No request info",
          config: error.config || "No config",
        });
        setBookedSlots({}); // Reset bookedSlots ถ้ามี error
      }
    }

    if (userId && selectedDate) fetchBookedSlots();
  }, [selectedDate, stadiumName, userId]);

  // Handle bookedSlotsFromParams
  useEffect(() => {
    if (bookedSlotsFromParams) {
      try {
        const slots = JSON.parse(decodeURIComponent(bookedSlotsFromParams));
        const updatedBookedSlots = {};
        slots.forEach((slot) => {
          const [courtNum] = slot.match(/\d+/) || ["1"];
          if (!updatedBookedSlots[courtNum]) updatedBookedSlots[courtNum] = [];
          updatedBookedSlots[courtNum].push(slot.trim());
        });
        setBookedSlots((prev) => ({ ...prev, ...updatedBookedSlots }));
      } catch (error) {
        console.error("Error parsing bookedSlotsFromParams:", error);
      }
    }
  }, [bookedSlotsFromParams]);

  const isPastTime = (timeStart) => {
    const now = new Date();
    const [hours, minutes] = timeStart.split(":");
    const slotDateTime = new Date(selectedDate);
    slotDateTime.setHours(parseInt(hours), parseInt(minutes), 0, 0);
    return slotDateTime < now;
  };

  const handleCategoryClick = (category) => {
    setActiveCategory(category);
    setSelectedCourt(null);
    setSelectedSlot(null);
    setSelectedTimes([]);
  };

  const handleDateChange = (event) => {
    setSelectedDate(event.target.value);
    setBookingData((prev) => ({ ...prev, date: event.target.value }));
    setSelectedCourt(null);
    setSelectedSlot(null);
    setSelectedTimes([]);
    setBookedSlots({}); // Reset bookedSlots when date changes
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

    const timeString = `${time.start}-${time.end}`.trim();
    const courtSlots = bookedSlots[selectedSlot] || [];
    const isBooked = courtSlots.includes(timeString);
    const isPast = isPastTime(time.start);

    if (isBooked || isPast) return;

    setSelectedTimes((prevTimes) => {
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
      const response = await axios.post("http://localhost:5000/booking/stadiums", bookingPayload, {
        headers: { "Content-Type": "application/json" },
      });
      router.push(
        `/Homepage/Search/Select/payment-qr?bookingId=${response.data.bookingId}&price=${totalPrice}&userId=${userId}&stadiumName=${encodeURIComponent(response.data.stadiumName)}&sportType=${encodeURIComponent(response.data.sportType)}&courtNumber=${bookingPayload.courtNumber}&date=${bookingPayload.date}&timeSlots=${encodeURIComponent(JSON.stringify(bookingPayload.timeSlots))}&id_stadium=${bookingPayload.stadiumId}&id_court=${bookingPayload.courtId}&stadiumAddress=${encodeURIComponent(stadiumAddress)}`
      );
    } catch (error) {
      console.error("Error submitting booking:", error.response?.data || error.message);
      alert("เกิดข้อผิดพลาดในการจอง: " + (error.response?.data?.error || error.message));
    }
  };

  const [showPopup, setShowPopup] = useState(false);

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
    if (error) return <p className="error-message">{error}</p>;
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
              {selectedCourt?.court_id === court.court_id && (
                <div className="timeslot-container">
                  {Array.from({ length: court.court_quantity }, (_, idx) => idx + 1).map((slotNumber) => (
                    <div
                      key={`slot-${slotNumber}`}
                      className={`slot-container ${selectedSlot === slotNumber ? "selected-slot" : ""}`}
                    >
                      <h5 onClick={() => handleSlotSelection(slotNumber)} style={{ cursor: "pointer" }}>
                        คอร์ด {slotNumber}
                      </h5>
                      <div className="time-rows">
                        <div className="time-row">
                          {court.times && court.times.length > 0 ? (
                            court.times.map((time) => {
                              const timeString = `${time.start}-${time.end}`.trim();
                              const courtSlots = bookedSlots[slotNumber] || [];
                              const isBooked = courtSlots.includes(timeString);
                              const isPast = isPastTime(time.start);
                              const isSelected =
                                selectedSlot === slotNumber && selectedTimes.includes(timeString);

                              console.log(`Court ${slotNumber} bookedSlots:`, courtSlots);
                              console.log(`Checking time: ${timeString}, isBooked: ${isBooked}`);

                              return (
                                <div
                                  key={`time-${time.start}-${time.end}`}
                                  className={`slot ${
                                    isBooked
                                      ? "booked"
                                      : isPast
                                      ? "past"
                                      : isSelected
                                      ? "selected"
                                      : "available"
                                  }`}
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    if (!isBooked && !isPast && selectedSlot === slotNumber) {
                                      handleTimeSelection(time);
                                    }
                                  }}
                                  style={isBooked || isPast ? { pointerEvents: "none" } : {}}
                                >
                                  {time.start} - {time.end}
                                </div>
                              );
                            })
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
          ))}
        </div>
      );
    }

    const filteredCourts = stadium.courts.filter((court) => court.court_type === activeCategory);

    return (
      <div className="category-list">
        {filteredCourts.map((court) => (
          <div
            key={`court-${court.court_id}`}
            className={`venue-card ${selectedCourt?.court_id === court.court_id ? "selected" : ""}`}
          >
            <div className="court-header" onClick={() => handleCourtSelection(court)}>
              <h3>สนาม {court.court_type}</h3>
            </div>
            <div className="timeslot-container">
              {Array.from({ length: court.court_quantity }, (_, idx) => idx + 1).map((slotNumber) => (
                <div
                  key={`slot-${slotNumber}`}
                  className={`slot-container ${selectedSlot === slotNumber ? "selected-slot" : ""}`}
                >
                  <h5 onClick={() => handleSlotSelection(slotNumber)} style={{ cursor: "pointer" }}>
                    คอร์ด {slotNumber}
                  </h5>
                  <div className="time-rows">
                    <div className="time-row">
                      {court.times && court.times.length > 0 ? (
                        court.times.map((time) => {
                          const timeString = `${time.start}-${time.end}`.trim();
                          const courtSlots = bookedSlots[slotNumber] || [];
                          const isBooked = courtSlots.includes(timeString);
                          const isPast = isPastTime(time.start);
                          const isSelected =
                            selectedSlot === slotNumber && selectedTimes.includes(timeString);

                          console.log(`Court ${slotNumber} bookedSlots:`, courtSlots);
                          console.log(`Checking time: ${timeString}, isBooked: ${isBooked}`);

                          return (
                            <div
                              key={`time-${time.start}-${time.end}`}
                              className={`slot ${
                                isBooked
                                  ? "booked"
                                  : isPast
                                  ? "past"
                                  : isSelected
                                  ? "selected"
                                  : "available"
                              }`}
                              onClick={(e) => {
                                e.stopPropagation();
                                if (!isBooked && !isPast && selectedSlot === slotNumber) {
                                  handleTimeSelection(time);
                                }
                              }}
                              style={isBooked || isPast ? { pointerEvents: "none" } : {}}
                            >
                              {time.start} - {time.end}
                            </div>
                          );
                        })
                      ) : (
                        <p>ไม่มีช่วงเวลาสำหรับคอร์ดนี้</p>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
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

        {/* ย้าย Legend ไปชิดขวา */}
        <div className="legend-container" style={{ textAlign: "right" }}>
          <div className="legend-item">
            <span className="legend-color available"></span>
            <span>ว่าง</span>
            <span className="legend-color booked"></span>
            <span>ไม่ว่าง</span>
            <span className="legend-color past"></span>
            <span>หมดเวลาจอง</span>
          </div>
        </div>

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