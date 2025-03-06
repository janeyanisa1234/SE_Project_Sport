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
  const [selectedStadium, setSelectedStadium] = useState("");
  const [stadiums, setStadiums] = useState([]);
  const [sports, setSports] = useState([]);
  const [selectedSports, setSelectedSports] = useState([]);
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

    setLoadingStadiums(true);
    axios
      .get("http://localhost:5000/api/stadiums")
      .then((response) => {
        console.log("Stadiums response:", response.data);
        if (Array.isArray(response.data)) {
          setStadiums(response.data);
        } else {
          setStadiums([]);
          setError("ข้อมูลสนามไม่ใช่รูปแบบ array");
        }
        setLoadingStadiums(false);
      })
      .catch((error) => {
        console.error("Error fetching stadiums:", error);
        setError("ไม่สามารถโหลดรายการสนามได้: " + (error.response?.data?.error || error.message));
        setLoadingStadiums(false);
      });
  }, [sportsQuery, searchParams]);

  const handleStadiumChange = (e) => {
    const stadiumId = e.target.value;
    setSelectedStadium(stadiumId);
    if (stadiumId) {
      axios
        .get(`http://localhost:5000/api/sports?stadiumId=${stadiumId}`)
        .then((response) => {
          console.log("Sports response:", response.data);
          setSports(response.data);
          setSelectedSports([]); // รีเซ็ตกีฬาเมื่อเปลี่ยนสนาม
        })
        .catch((error) => {
          console.error("Error fetching sports:", error);
          setError("ไม่สามารถโหลดข้อมูลกีฬาได้: " + error.message);
        });
    } else {
      setSports([]);
      setSelectedSports([]);
    }
  };

  const handleSubmit = async () => {
    if (!promotionName || !startDate || !startTime || !endDate || !endTime || !discount || !selectedStadium || selectedSports.length === 0) {
      alert("กรุณากรอกข้อมูลให้ครบถ้วนรวมถึงเลือกสนามและกีฬา");
      return;
    }

    const selectedStadiumData = stadiums.find((s) => s.id === selectedStadium);
    const ownerId = selectedStadiumData?.owner_id || null;

    if (!ownerId) {
      alert("ไม่พบ owner_id สำหรับสนามที่เลือก");
      return;
    }

    const effectiveEndTime = endTime || "23:59";

    const promotionData = {
      promotion_name: promotionName,
      start_date: startDate,
      start_time: startTime,
      end_date: endDate,
      end_time: effectiveEndTime,
      discount,
      discount_limit: discountLimit || null,
      location: selectedStadiumData?.name || "ไม่ระบุ",
      sports: selectedSports,
      owner_id: ownerId,
    };

    console.log("Sending promotion data:", promotionData);

    try {
      const response = await axios.post("http://localhost:5000/api/promotions", promotionData);
      const newPromotionId = response.data[0].id;
      setPromotionId(newPromotionId);
      setShowModal(true); // แสดง Modal
    } catch (error) {
      console.error("Detailed error submitting promotion:", {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
      });
      alert("เกิดข้อผิดพลาดในการบันทึกโปรโมชั่น: " + (error.response?.data?.error || error.message));
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
      alert("ไม่พบข้อมูลโปรโมชั่นที่เลือก");
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
            onChange={handleStadiumChange}
            disabled={loadingStadiums}
          >
            <option value="">เลือกสนาม</option>
            {stadiums.map((stadium) => (
              <option key={stadium.id} value={stadium.id}>
                {stadium.name}
              </option>
            ))}
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
            <img
              src="/pictureowner/correct.png"
              alt="Success Icon"
              className="modal-icon"
            />
            <h2>สร้างโปรโมชั่นสำเร็จ</h2>
            <p>
              โปรโมชั่นส่วนลดนี้จะเริ่มเวลา {startDate} {startTime} และสิ้นสุดเวลา {endDate}{" "}
              {endTime}
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