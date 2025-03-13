"use client";

import { useState, useEffect } from "react";
import { FaPlus } from "react-icons/fa";
import { useRouter, useSearchParams } from "next/navigation";
import Tabbar from "../components/tab";
import axios from "axios";
import "./createpromotion.css";

export default function CreatePromotion() {

  const router = useRouter(); // อินสแตนซ์ของ router
  const searchParams = useSearchParams(); // ดึง query parameters

  // ค่าพารามิเตอร์เริ่มต้นจาก URL
  const initialSports = JSON.parse(decodeURIComponent(searchParams.get("sports") || "[]")); // รายการกีฬาเริ่มต้น
  const initialDiscount = searchParams.get("discount") || ""; // ส่วนลดเริ่มต้น

  // State การจัดการข้อมูลและ UI
  const [promotionName, setPromotionName] = useState(searchParams.get("promotionName") || ""); // ชื่อโปรโมชัน
  const [startDate, setStartDate] = useState(searchParams.get("startDate") || ""); // วันที่เริ่ม
  const [startTime, setStartTime] = useState(searchParams.get("startTime") || ""); // เวลาเริ่ม
  const [endDate, setEndDate] = useState(searchParams.get("endDate") || ""); // วันที่สิ้นสุด
  const [endTime, setEndTime] = useState(searchParams.get("endTime") || ""); // เวลาสิ้นสุด
  const [discount, setDiscount] = useState(initialDiscount); // ส่วนลด
  const [selectedStadium, setSelectedStadium] = useState(searchParams.get("location") || ""); // สนามที่เลือก
  const [stadiums, setStadiums] = useState([]); // รายการสนาม
  const [selectedSports, setSelectedSports] = useState(initialSports); // รายการกีฬาที่เลือก
  const [loadingStadiums, setLoadingStadiums] = useState(true); // สถานะการโหลดสนาม
  const [showModal, setShowModal] = useState(false); // ควบคุมการแสดง modal
  const [promotionId, setPromotionId] = useState(null); // ID โปรโมชันที่สร้าง

  // โหลดข้อมูลสนามเมื่อเริ่มต้น
  useEffect(() => {
    const token = localStorage.getItem("token"); // ดึง token
    if (!token) {
      alert("กรุณาเข้าสู่ระบบก่อนสร้างโปรโมชั่น"); // แจ้งเตือนถ้าไม่มี token
      router.push("/Login"); // ไปหน้า login
      return;
    }

    setLoadingStadiums(true); // เริ่มโหลดสนาม
    axios
      .get("http://localhost:5000/api/stadiums", {
        headers: { Authorization: `Bearer ${token}` }, // header สำหรับ API
      })
      .then((response) => {
        setStadiums(Array.isArray(response.data) ? response.data : []); // อัปเดตรายการสนาม
        setLoadingStadiums(false); // หยุดโหลด
      })
      .catch((error) => {
        console.error("Error fetching stadiums:", error.response?.data || error.message); // log ข้อผิดพลาด
        setLoadingStadiums(false); // หยุดโหลด
        if (error.response?.status === 401) { // ถ้า token หมดอายุ
          alert("เซสชันหมดอายุ"); // แจ้งเตือน
          router.push("/Login"); // ไปหน้า login
        }
      });
  }, [router]);

  // อัปเดตราคากีฬาเมื่อส่วนลดเปลี่ยน
  useEffect(() => {
    const updatedSports = selectedSports.map((sport) => ({
      ...sport,
      discountPrice: calculateDiscountPrice(sport.price, discount), // อัปเดตราคาหลังลด
    }));
    setSelectedSports(updatedSports); // อัปเดต state
  }, [discount]);

  // คำนวณราคาหลังลด
  const calculateDiscountPrice = (price, discount) => {
    const discountNum = parseFloat(discount) || 0; // แปลงส่วนลดเป็นตัวเลข
    const discountPercentage = discountNum / 100; // คำนวณเปอร์เซ็นต์
    return Math.round(price * (1 - discountPercentage)); // คืนค่าราคาหลังลด
  };

  // เปลี่ยนแปลงข้อมูล
  const handleDiscountChange = (e) => {
    setDiscount(e.target.value); // อัปเดตส่วนลด
  };

  const handleStadiumChange = (e) => {
    setSelectedStadium(e.target.value); // อัปเดตสนามที่เลือก
  };

  // เพิ่มกีฬา
  const handleAddSports = () => { 
    const query = `?promotionName=${encodeURIComponent(promotionName)}&startDate=${encodeURIComponent(startDate)}&startTime=${encodeURIComponent(startTime)}&endDate=${encodeURIComponent(endDate)}&endTime=${encodeURIComponent(endTime)}&discount=${encodeURIComponent(discount)}&location=${encodeURIComponent(selectedStadium)}&sports=${encodeURIComponent(JSON.stringify(selectedSports))}`; // สร้าง query string
    router.push(`/add${query}`); // ไปหน้าเพิ่มกีฬา
  };

  // บันทึกโปรโมชัน
  const handleSubmit = async () => { 
    const token = localStorage.getItem("token"); // ดึง token
    if (!token) {
      alert("กรุณาเข้าสู่ระบบก่อนสร้างโปรโมชั่น"); // แจ้งเตือนถ้าไม่มี token
      router.push("/Login"); // ไปหน้า login
      return;
    }

    const discountNum = parseFloat(discount) || 0; // แปลงส่วนลดเป็นตัวเลข
    if (!promotionName || !startDate || !startTime || !endDate || !endTime || !discount || !selectedStadium || selectedSports.length === 0) { // ตรวจสอบข้อมูล
      alert("กรุณากรอกข้อมูลให้ครบถ้วน"); // แจ้งเตือนถ้าขาดข้อมูล
      return;
    }

    const promotionData = { // ข้อมูลโปรโมชัน
      promotion_name: promotionName,
      start_date: startDate,
      start_time: startTime,
      end_date: endDate,
      end_time: endTime || "23:59",
      discount: discountNum,
      location: selectedStadium,
      sports: selectedSports,
    };

    console.log("Sending data:", promotionData); // log ข้อมูลที่ส่ง
    try {
      const response = await axios.post("http://localhost:5000/api/promotions", promotionData, {
        headers: { Authorization: `Bearer ${token}` }, // header สำหรับ API
      });
      console.log("Response:", response.data); // log ข้อมูลที่ได้
      setPromotionId(response.data[0]?.id || null); // ตั้ง ID โปรโมชัน
      setShowModal(true); // แสดง modal
    } catch (error) {
      console.error("Submit error:", error.message, error.response?.data); // log ข้อผิดพลาด
      alert("เกิดข้อผิดพลาด: " + (error.response?.data?.error || error.message)); // แจ้งเตือน
    }
  };

  // แสดงผล UI
  if (loadingStadiums) return <div>กำลังโหลดข้อมูลสนาม...</div>; // แสดงขณะโหลด

  return (
    <div className="background">
      <Tabbar />
      <div className="create-header-title">
        <h1>สร้างโปรโมชั่นส่วนลด</h1>
      </div>
      <div className="create-container">
        <div className="form-row">
          <h2 className="form-title">ชื่อโปรโมชั่น</h2>
          <input
            type="text"
            value={promotionName}
            onChange={(e) => setPromotionName(e.target.value)}
            className="input-field"
            placeholder="ใส่ชื่อโปรโมชั่น"
          />
        </div>
        <div className="form-row">
          <h2 className="form-title">วันที่เริ่มโปรโมชั่น</h2>
          <div className="date-time-group">
            <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} className="input-field" />
            <input type="time" value={startTime} onChange={(e) => setStartTime(e.target.value)} className="input-field" />
          </div>
        </div>
        <div className="form-row">
          <h2 className="form-title">วันที่สิ้นสุดโปรโมชั่น</h2>
          <div className="date-time-group">
            <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} className="input-field" />
            <input type="time" value={endTime} onChange={(e) => setEndTime(e.target.value)} className="input-field" />
          </div>
        </div>
        <div className="form-row">
          <h2 className="form-title">ส่วนลด (%)</h2>
          <input
            type="text"
            value={discount}
            onChange={handleDiscountChange}
            className="input-field"
            placeholder="เช่น 10"
          />
        </div>
        <div className="form-row">
          <h2 className="form-title">สนามที่เข้าร่วม</h2>
          <select value={selectedStadium} onChange={handleStadiumChange} className="input-field" disabled={loadingStadiums}>
            <option value="">เลือกสนาม</option>
            {stadiums.map((stadium) => (
              <option key={stadium.id} value={stadium.id}>{stadium.name}</option>
            ))}
          </select>
        </div>
        <div className="form-row sports-section">
          <h2 className="form-title">กีฬาที่เข้าร่วม</h2>
          {selectedSports.length > 0 && (
            <div className="sports-table-wrapper">
              <table className="sports-table">
                <thead>
                  <tr>
                    <th>ประเภทกีฬา</th>
                    <th>ราคา</th>
                    <th>ราคาหลังลด</th>
                  </tr>
                </thead>
                <tbody>
                  {selectedSports.map((sport, index) => (
                    <tr key={index}>
                      <td>{sport.name}</td>
                      <td>฿{sport.price}</td>
                      <td className="discount-price">฿{sport.discountPrice}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
          <button onClick={handleAddSports} className="add-sports-button">
            <FaPlus className="plus-icon" /> เพิ่มกีฬา
          </button>
        </div>
        <div className="button-group">
          <button className="cancel-button" onClick={() => router.push("/promotion")}>ยกเลิก</button>
          <button className="confirm-button" onClick={handleSubmit}>บันทึก</button>
        </div>
      </div>
      {showModal && (
        <div className="modal-overlay">
          <div className="modal-box">
            <img
              src="/pictureowner/correct.png"
              alt="Success Icon"
              className="modal-icon"
            />
            <h2>สร้างโปรโมชั่นสำเร็จ</h2>
            <p>
              โปรโมชั่นส่วนลดนี้จะเริ่มเวลา {startDate} {startTime} และสิ้นสุดเวลา {endDate} {endTime}
            </p>
            <div className="modal-button-group">
              <button onClick={() => router.push("/promotion")} className="modal-button">
                กลับไปยังรายการโปรโมชั่น
              </button>
              <button onClick={() => router.push(`/detail?id=${promotionId}`)} className="modal-button-alt">
                ดูรายละเอียด
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}