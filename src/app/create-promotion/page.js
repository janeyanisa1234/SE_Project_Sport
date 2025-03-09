"use client";

import { useState, useEffect } from "react";
import { FaPlus } from "react-icons/fa";
import { useRouter, useSearchParams } from "next/navigation";
import Tabbar from "../components/tab";
import axios from "axios";
import "./createpromotion.css";

export default function CreatePromotion() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const initialSports = JSON.parse(decodeURIComponent(searchParams.get("sports") || "[]"));
  const initialDiscount = searchParams.get("discount") || "";

  const [promotionName, setPromotionName] = useState(searchParams.get("promotionName") || "");
  const [startDate, setStartDate] = useState(searchParams.get("startDate") || "");
  const [startTime, setStartTime] = useState(searchParams.get("startTime") || "");
  const [endDate, setEndDate] = useState(searchParams.get("endDate") || "");
  const [endTime, setEndTime] = useState(searchParams.get("endTime") || "");
  const [discount, setDiscount] = useState(initialDiscount);
  const [selectedStadium, setSelectedStadium] = useState(searchParams.get("location") || "");
  const [stadiums, setStadiums] = useState([]);
  const [selectedSports, setSelectedSports] = useState(initialSports);
  const [loadingStadiums, setLoadingStadiums] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [promotionId, setPromotionId] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("กรุณาเข้าสู่ระบบก่อนสร้างโปรโมชั่น");
      router.push("/Login");
      return;
    }
  
    setLoadingStadiums(true);
    axios
      .get("http://localhost:5000/api/stadiums", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((response) => {
        setStadiums(Array.isArray(response.data) ? response.data : []);
        setLoadingStadiums(false);
      })
      .catch((error) => {
        console.error("Error fetching stadiums:", error.response?.data || error.message);
        setLoadingStadiums(false);
        if (error.response?.status === 401) {
          alert("เซสชันหมดอายุ กรุณาเข้าสู่ระบบใหม่");
          router.push("/Login");
        }
      });
  }, [router]);
  
  useEffect(() => {
    const updatedSports = selectedSports.map((sport) => ({
      ...sport,
      discountPrice: calculateDiscountPrice(sport.price, discount),
    }));
    setSelectedSports(updatedSports);
  }, [discount]);

  const calculateDiscountPrice = (price, discount) => {
    const discountNum = parseFloat(discount) || 0;
    const discountPercentage = discountNum / 100;
    return Math.round(price * (1 - discountPercentage));
  };

  const handleDiscountChange = (e) => {
    setDiscount(e.target.value);
  };

  const handleStadiumChange = (e) => {
    setSelectedStadium(e.target.value);
  };

  const handleAddSports = () => {
    const query = `?promotionName=${encodeURIComponent(promotionName)}&startDate=${encodeURIComponent(startDate)}&startTime=${encodeURIComponent(startTime)}&endDate=${encodeURIComponent(endDate)}&endTime=${encodeURIComponent(endTime)}&discount=${encodeURIComponent(discount)}&location=${encodeURIComponent(selectedStadium)}&sports=${encodeURIComponent(JSON.stringify(selectedSports))}`;
    router.push(`/add${query}`);
  };

  const handleSubmit = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("กรุณาเข้าสู่ระบบก่อนสร้างโปรโมชั่น");
      router.push("/Login");
      return;
    }

    const discountNum = parseFloat(discount) || 0;
    if (!promotionName || !startDate || !startTime || !endDate || !endTime || !discount || !selectedStadium || selectedSports.length === 0) {
      alert("กรุณากรอกข้อมูลให้ครบถ้วน");
      return;
    }

    const promotionData = {
      promotion_name: promotionName,
      start_date: startDate,
      start_time: startTime,
      end_date: endDate,
      end_time: endTime || "23:59",
      discount: discountNum,
      location: selectedStadium,
      sports: selectedSports,
    };

    console.log("Sending promotion data:", promotionData);

    try {
      const response = await axios.post("http://localhost:5000/api/promotions", promotionData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      console.log("Response from server:", response.data);
      setPromotionId(response.data[0]?.id || null);
      setShowModal(true);
    } catch (error) {
      console.error("Error submitting promotion:", {
        message: error.message,
        response: error.response?.data,
      });
      alert("เกิดข้อผิดพลาดในการบันทึก: " + (error.response?.data?.error || error.message));
    }
  };

  return (
    <div className="background">
      <Tabbar />
      <div className="header-title">
        <h1>สร้างโปรโมชั่นส่วนลด</h1>
      </div>
      <div className="container">
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