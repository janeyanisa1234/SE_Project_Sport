"use client";

import { useState, useEffect } from "react";
import { FaPlus } from "react-icons/fa";
import { useRouter, useSearchParams } from "next/navigation";
import Tabbar from "../components/tab";
import axios from "axios";
import "./edit.css";

export default function EditPromotion() {
  const [showModal, setShowModal] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const id = searchParams.get("id");

  const [promotionName, setPromotionName] = useState("");
  const [startDate, setStartDate] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endDate, setEndDate] = useState("");
  const [endTime, setEndTime] = useState("");
  const [discount, setDiscount] = useState("");
  const [discountLimit, setDiscountLimit] = useState("");
  const [location, setLocation] = useState("");
  const [selectedSports, setSelectedSports] = useState([]);
  const [stadiums, setStadiums] = useState([]);
  const [loadingStadiums, setLoadingStadiums] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    console.log("ID from query:", id, "URL:", window.location.href);
    if (!id) {
      console.error("No ID provided for editing, redirecting to /promotion");
      alert("ไม่พบ ID โปรโมชั่นใน URL กรุณาตรวจสอบ");
      router.push("/promotion");
      return;
    }

    const fetchPromotionDetails = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/promotions/${id}`, {
          headers: { "Content-Type": "application/json" },
          timeout: 10000,
        });
        console.log("API Response:", response.data, "Status:", response.status);
        const promo = Array.isArray(response.data) ? response.data[0] : response.data;
        if (!promo) throw new Error("Promotion not found");

        const start = promo.start_datetime ? new Date(promo.start_datetime) : null;
        const end = promo.end_datetime ? new Date(promo.end_datetime) : null;

        if (!start || !end || isNaN(start.getTime()) || isNaN(end.getTime())) {
          throw new Error("Invalid date format in promotion data");
        }

        setPromotionName(promo.promotion_name || "");
        setStartDate(start.toISOString().split("T")[0] || "");
        setStartTime(start.toTimeString().slice(0, 5) || "");
        setEndDate(end.toISOString().split("T")[0] || "");
        setEndTime(end.toTimeString().slice(0, 5) || "");
        setDiscount(promo.discount_percentage?.toString() || "");
        setDiscountLimit(promo.discount_limit?.toString() || "");
        setLocation(promo.location || "");
        setSelectedSports(promo.sports ? JSON.parse(promo.sports) : []);

        const stadiumResponse = await axios.get("http://localhost:5000/api/stadiums", {
          headers: { "Content-Type": "application/json" },
        });
        if (Array.isArray(stadiumResponse.data)) {
          setStadiums(stadiumResponse.data);
        } else {
          setStadiums([]);
          setError("ข้อมูลสนามไม่ใช่รูปแบบ array");
        }
        setLoadingStadiums(false);
      } catch (error) {
        console.error("Error fetching promotion details:", {
          message: error.message,
          response: error.response?.data || error.response,
          status: error.response?.status,
          config: error.config,
          code: error.code,
        });
        setError("ไม่สามารถโหลดข้อมูลโปรโมชั่นได้: " + (error.response?.data?.error || error.message || "Network error: " + error.code));
        alert("เกิดข้อผิดพลาดในการโหลดข้อมูลโปรโมชั่น: " + (error.response?.data?.error || error.message || "Network error: " + error.code));
      }
    };

    fetchPromotionDetails();
  }, [id]);

  const handleSave = async () => {
    if (!promotionName || !startDate || !startTime || !endDate || !endTime || !discount || !location || selectedSports.length === 0) {
      alert("กรุณากรอกข้อมูลให้ครบถ้วนรวมถึงเลือกสนามและกีฬา");
      return;
    }
    if (parseFloat(discount) < 0 || parseFloat(discount) > 100) {
      alert("ส่วนลดต้องอยู่ระหว่าง 0-100%");
      return;
    }
    if (new Date(`${startDate} ${startTime}`) >= new Date(`${endDate} ${endTime}`)) {
      alert("วันที่เริ่มต้นต้องมาก่อนวันที่สิ้นสุด");
      return;
    }

    const updatedPromotion = {
      promotion_name: promotionName,
      start_datetime: `${startDate} ${startTime}:00`,
      end_datetime: `${endDate} ${endTime}:00`,
      discount_percentage: parseFloat(discount),
      discount_limit: discountLimit ? parseInt(discountLimit) : null,
      location,
      sports: JSON.stringify(selectedSports),
    };

    try {
      const response = await axios.put(`http://localhost:5000/api/promotions/${id}`, updatedPromotion, {
        headers: { "Content-Type": "application/json" },
        timeout: 10000,
      });
      console.log("Updated promotion:", response.data, "Status:", response.status);
      setShowModal(true);
    } catch (error) {
      console.error("Error updating promotion:", {
        message: error.message,
        response: error.response?.data || error.response,
        status: error.response?.status,
        config: error.config,
        code: error.code,
      });
      alert("เกิดข้อผิดพลาดในการอัปเดตโปรโมชั่น: " + (error.response?.data?.error || error.message || "Network error: " + error.code));
    }
  };

  const handleConfirm = () => {
    handleSave();
  };

  const handleCloseModal = () => {
    setShowModal(false);
    axios.get("http://localhost:5000/api/promotions").then(() => {
      router.push("/promotion");
    });
  };

  const handleViewDetail = () => {
    if (!id) {
      console.error("No promotion ID available");
      alert("ไม่พบข้อมูลโปรโมชั่นที่เลือก กรุณาลองใหม่อีกครั้ง");
      return;
    }
    setShowModal(false);
    router.push(`/detail?id=${id}`);
  };

  const handleAddSports = () => {
    const query = `?promotionName=${encodeURIComponent(promotionName)}&startDate=${encodeURIComponent(startDate)}&startTime=${encodeURIComponent(startTime)}&endDate=${encodeURIComponent(endDate)}&endTime=${encodeURIComponent(endTime)}&discount=${encodeURIComponent(discount)}&discountLimit=${encodeURIComponent(discountLimit || "")}&location=${encodeURIComponent(location)}&sports=${encodeURIComponent(JSON.stringify(selectedSports))}`;
    router.push(`/addedit${query}`);
  };

  return (
    <div className="background">
      <Tabbar />

      <div className="header-title">
        <h1>แก้ไขโปรโมชั่นส่วนลด</h1>
      </div>

      <div className="container">
        <div className="form-row">
          <h2 className="form-title">ชื่อโปรโมชั่น</h2>
          <input
            type="text"
            name="promotion_name"
            placeholder="ใส่ชื่อโปรโมชั่น"
            className="input-field"
            value={promotionName}
            onChange={(e) => setPromotionName(e.target.value)}
          />
        </div>

        <div className="form-row">
          <h2 className="form-title">วันที่เริ่มโปรโมชั่น</h2>
          <div className="date-time-group">
            <input
              type="date"
              name="start_date"
              className="input-field"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
            />
            <input
              type="time"
              name="start_time"
              className="input-field"
              value={startTime}
              onChange={(e) => setStartTime(e.target.value)}
            />
          </div>
        </div>

        <div className="form-row">
          <h2 className="form-title">วันที่สิ้นสุดโปรโมชั่น</h2>
          <div className="date-time-group">
            <input
              type="date"
              name="end_date"
              className="input-field"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
            />
            <input
              type="time"
              name="end_time"
              className="input-field"
              value={endTime}
              onChange={(e) => setEndTime(e.target.value)}
            />
          </div>
        </div>

        <div className="form-row">
          <h2 className="form-title">ส่วนลด</h2>
          <input
            type="number"
            name="discount"
            placeholder="% ลด"
            className="input-field"
            value={discount}
            onChange={(e) => setDiscount(e.target.value)}
          />
        </div>

        <div className="form-row">
          <h2 className="form-title">จำกัดการใช้ส่วนลดต่อผู้ใช้</h2>
          <input
            type="number"
            name="discount_limit"
            placeholder="จำนวนครั้งที่ใช้ได้ (ไม่บังคับ)"
            className="input-field"
            value={discountLimit}
            onChange={(e) => setDiscountLimit(e.target.value)}
          />
        </div>

        <div className="form-row">
          <h2 className="form-title">สนามที่เข้าร่วม</h2>
          <select
            className="input-field"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            disabled={loadingStadiums}
          >
            <option value="">เลือกสนาม</option>
            {stadiums.length > 0 ? (
              stadiums.map((stadium) => (
                <option key={stadium.id} value={stadium.name}>
                  {stadium.name}
                </option>
              ))
            ) : (
              <option disabled>ไม่มีสนาม</option>
            )}
          </select>
          {error && <p style={{ color: "red" }}>{error}</p>}
        </div>

        <div className="form-row">
          <h2 className="form-title">กีฬาที่เข้าร่วม</h2>
          <button onClick={handleAddSports} className="add-button">
            <FaPlus /> เพิ่มกีฬา
          </button>
          <div>
            {selectedSports.length > 0 && (
              <ul>
                {selectedSports.map((sport, index) => (
                  <li key={index}>{sport.name} (฿{sport.discountPrice})</li>
                ))}
              </ul>
            )}
          </div>
        </div>

        <div className="button-group">
          <button className="cancel-button" onClick={() => router.push("/promotion")}>
            ยกเลิก
          </button>
          <button className="confirm-button" onClick={handleConfirm}>
            บันทึก
          </button>
        </div>
      </div>

      {showModal && (
        <div className="modal-overlay">
          <div className="modal-box">
            <img src="/pictureowner/correct.png" alt="Success Icon" className="modal-icon" />
            <h2>แก้ไขโปรโมชั่นสำเร็จ</h2>
            <p>
              โปรโมชั่นส่วนลดนี้จะเริ่มเวลา {startDate} {startTime}{" "}
              และสิ้นสุดเวลา {endDate} {endTime}
            </p>
            <div className="modal-button-group">
              <button onClick={handleCloseModal} className="modal-button">
                กลับไปยังรายการโปรโมชั่น
              </button>
              <button onClick={handleViewDetail} className="modal-button-alt">
                ดูรายละเอียด
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}