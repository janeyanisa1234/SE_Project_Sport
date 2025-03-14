"use client";

import { useState, useEffect } from "react";
import "./Select-nologin.css";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import Tabbar from "../../tabbar-nologin/tab";
import Headfunction from "../../Headfunction/page";
import Link from "next/link";
import axios from "axios";
import { useSearchParams } from "next/navigation";
import ReactDOM from "react-dom"; // เพิ่มการ import ReactDOM สำหรับ React Portal

const SelectPlacenologin = () => {
  const searchParams = useSearchParams();
  const stadiumName = searchParams.get("stadium_name") || "";
  const stadiumAddress = searchParams.get("stadium_address") || "";
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
  const [bookedSlots, setBookedSlots] = useState({});
  const [showModal, setShowModal] = useState(false);

  const [bookingData, setBookingData] = useState({
    sportType: "",
    courtNumber: "",
    date: "",
    timeSlots: [],
    price: 0,
  });

  // ตั้งค่าวันที่ปัจจุบันเมื่อเข้าหน้า
  useEffect(() => {
    const today = new Date().toISOString().split("T")[0];
    setSelectedDate(today);
    setBookingData((prev) => ({ ...prev, date: today }));
  }, []);

  // Fetch stadium data
  useEffect(() => {
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
  }, [stadiumName]);

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
        setBookedSlots({});
      }
    }

    fetchBookedSlots();
  }, [selectedDate, stadiumName]);

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

  const handleDateChange = (date) => {
    const formattedDate = date.toISOString().split("T")[0];
    setSelectedDate(formattedDate);
    setBookingData((prev) => ({ ...prev, date: formattedDate }));
    setSelectedCourt(null);
    setSelectedSlot(null);
    setSelectedTimes([]);
    setBookedSlots({});
  };

  const handleCourtSelection = (court) => {
    if (selectedCourt?.court_id === court.court_id) {
      setSelectedCourt(null);
      setSelectedSlot(null);
      setSelectedTimes([]);
      setBookingData({
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

    const isLoggedIn = false; // จำลองสถานะไม่ล็อกอิน
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

    if (!isLoggedIn) {
      setShowModal(true);
      return;
    }
  };

  const handleBookingConfirmation = () => {
    const isLoggedIn = false; // จำลองสถานะไม่ล็อกอิน
    if (!isLoggedIn && selectedCourt && selectedSlot && selectedDate && selectedTimes.length > 0) {
      setShowModal(true);
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  // Modal Content
  const ModalContent = () => (
    <div className="modal-content">
      <button className="close-btn" onClick={handleCloseModal}>×</button>
      <h2>กรุณาเข้าสู่ระบบก่อนทำการจอง</h2>
      <p>คุณต้องเข้าสู่ระบบเพื่อดำเนินการจองสนาม</p>
      <Link href="/Login">
        <button className="login-btn">เข้าสู่ระบบ</button>
      </Link>
      <button className="cancel-btn" onClick={handleCloseModal}>ยกเลิก</button>
    </div>
  );

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
                <img src={court.court_image || "/picturemild/default.svg"} alt={court.court_type} className="venue-image" />
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
                              const isSelected = selectedSlot === slotNumber && selectedTimes.includes(timeString);

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
                          const isSelected = selectedSlot === slotNumber && selectedTimes.includes(timeString);

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
            <h2 className="venue-name">{stadiumName || "AVOCADO"}</h2>
            <p className="venue-address">{stadiumAddress || "55/5 หมู่ 10 ซอย12 บ้านสวน จ.ชลบุรี"}</p>
            <div className="date-picker-container">
              <label htmlFor="booking-date"></label>
              <DatePicker
                selected={selectedDate ? new Date(selectedDate) : null}
                onChange={handleDateChange}
                dateFormat="yyyy-MM-dd"
                className="date-picker"
                placeholderText="เลือกวันที่"
                minDate={new Date()}
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

        {/* เพิ่ม Legend สำหรับปุ่มสี */}
        <div className="legend-container">
          <div className="legend-item">
            <span className="legend-color available"></span>
            <span>ว่าง</span>
            <span className="legend-color booked"></span>
            <span>ไม่ว่าง</span>
            <span className="legend-color past"></span>
            <span>หมดเวลาในการจอง</span>
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

      {showModal && ReactDOM.createPortal(
        <div className="modal">
          <ModalContent />
        </div>,
        document.body
      )}
    </>
  );
};

export default SelectPlacenologin;