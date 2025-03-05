"use client";

import { useState, useEffect } from "react";
import { FaPlus } from "react-icons/fa";
import { useRouter, useSearchParams } from "next/navigation";
import Tabbar from "../components/tab";
import axios from "axios";
import "./createpromotion.css";

export default function CreatePromotion() {
  const [showModal, setShowModal] = useState(false);
  const [promotionId, setPromotionId] = useState(null);
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
  const [selectedStadium, setSelectedStadium] = useState("");
  const [loadingStadiums, setLoadingStadiums] = useState(true);
  const [error, setError] = useState(null);

  const router = useRouter();
  const searchParams = useSearchParams();
  const sportsQuery = searchParams.get("sports");

  useEffect(() => {
    if (sportsQuery) {
      try {
        const sportsArray = JSON.parse(decodeURIComponent(sportsQuery));
        setSelectedSports(sportsArray);
      } catch (error) {
        console.error("Error parsing sports query:", error);
        alert("เกิดข้อผิดพลาดในการโหลดข้อมูลกีฬาที่เลือก");
      }
    }
    const params = Object.fromEntries(searchParams.entries());
    if (params.promotionName) setPromotionName(params.promotionName);
    if (params.startDate) setStartDate(params.startDate);
    if (params.startTime) setStartTime(params.startTime);
    if (params.endDate) setEndDate(params.endDate);
    if (params.endTime) setEndTime(params.endTime);
    if (params.discount) setDiscount(params.discount);
    if (params.discountLimit) setDiscountLimit(params.discountLimit);
    if (params.location) setSelectedStadium(params.location);
    if (params.selectedStadium) setSelectedStadium(params.selectedStadium);

    // ดึงข้อมูลสนาม
    setLoadingStadiums(true);
    axios
      .get("http://localhost:5000/api/stadiums")
      .then((response) => {
        if (Array.isArray(response.data)) {
          setStadiums(response.data);
        } else {
          setStadiums([]);
          setError("ข้อมูลสนามไม่ใช่รูปแบบ array");
        }
        setLoadingStadiums(false);
      })
      .catch((error) => {
        console.error("Error fetching stadiums:", error.response?.data || error.message || error);
        setError("ไม่สามารถโหลดรายการสนามได้: " + (error.response?.data?.error || error.message || "ไม่ทราบสาเหตุ"));
        setLoadingStadiums(false);
        alert("เกิดข้อผิดพลาดในการโหลดรายการสนาม: " + (error.response?.data?.error || error.message || "ไม่ทราบสาเหตุ"));
      });
  }, [sportsQuery, searchParams]);

  const handleSubmit = async () => {
    if (!promotionName || !startDate || !startTime || !endDate || !endTime || !discount || !selectedStadium || selectedSports.length === 0) {
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

    const promotionData = {
      promotion_name: promotionName,
      start_date: startDate,
      start_time: startTime,
      end_date: endDate,
      end_time: endTime,
      discount: discount,
      discount_limit: discountLimit || null,
      location: selectedStadium,
      sports: selectedSports,
    };

    try {
      const response = await axios.post(
        "http://localhost:5000/api/promotions",
        promotionData
      );
      console.log("Response from backend:", response.data);
      const newPromotionId = Array.isArray(response.data) ? response.data[0].id : response.data.id || null;
      if (!newPromotionId) {
        throw new Error("No promotion ID returned from server");
      }
      setPromotionId(newPromotionId);
      setShowModal(true);
    } catch (error) {
      console.error("Error submitting promotion:", error.response?.data || error.message);
      alert("เกิดข้อผิดพลาดในการบันทึกโปรโมชั่น: " + (error.response?.data?.error || error.message || "ไม่ทราบสาเหตุ"));
    }
  };

  const handleConfirm = () => {
    handleSubmit();
  };

  const handleCloseModal = () => {
    setShowModal(false);
    router.push("/promotion");
  };

  const handleViewDetail = () => {
    if (!promotionId) {
      console.error("No promotion ID available");
      alert("ไม่พบข้อมูลโปรโมชั่นที่เลือก กรุณาลองใหม่อีกครั้ง");
      return;
    }
    setShowModal(false);
    router.push(`/detail?id=${promotionId}`);
  };

  const handleAddSports = () => {
    const query = `?promotionName=${encodeURIComponent(promotionName)}&startDate=${encodeURIComponent(startDate)}&startTime=${encodeURIComponent(startTime)}&endDate=${encodeURIComponent(endDate)}&endTime=${encodeURIComponent(endTime)}&discount=${encodeURIComponent(discount)}&discountLimit=${encodeURIComponent(discountLimit || "")}&location=${encodeURIComponent(selectedStadium)}&sports=${encodeURIComponent(JSON.stringify(selectedSports))}`;
    router.push(`/add${query}`);
  };

  return (
    <div>
      <Tabbar />
      <div className="header-title">
        <h1>สร้างโปรโมชั่นส่วนลด</h1>
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
            value={selectedStadium}
            onChange={(e) => setSelectedStadium(e.target.value)}
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
          <button
            className="cancel-button"
            onClick={() => router.push("/promotion")}
          >
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
            <img
              src="/pictureowner/correct.png"
              alt="Success Icon"
              className="modal-icon"
            />
            <h2>สร้างโปรโมชั่นสำเร็จ</h2>
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