"use client";

import { useState, useEffect } from "react";
import { FaChevronDown, FaEdit, FaTrash, FaCalendarAlt } from "react-icons/fa";
import { useRouter } from "next/navigation";
import Tabbar from "../components/tab";
import axios from "axios";
import "./promotion.css"; // เพิ่มไฟล์ CSS

// ฟังก์ชันแปลงวันที่ให้อยู่ในรูปแบบ DD/MM/YYYY HH:mm
const formatDateTime = (dateTimeStr) => {
  const date = new Date(dateTimeStr);
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");
  return `${day}/${month}/${year} ${hours}:${minutes}`;
};

export default function Promotion() {
  const [promotions, setPromotions] = useState([]);
  const [isStatusDropdownOpen, setIsStatusDropdownOpen] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState("ทั้งหมด");
  const [isDateDropdownOpen, setIsDateDropdownOpen] = useState(false);
  const [selectedDateOption, setSelectedDateOption] = useState("ทั้งหมด");
  const [customDateRange, setCustomDateRange] = useState({ start: "", end: "" });
  const [showCustomInputs, setShowCustomInputs] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [promoToDelete, setPromoToDelete] = useState(null);
  const [promoIdToDelete, setPromoIdToDelete] = useState(null);
  const [shouldRefresh, setShouldRefresh] = useState(false);

  const router = useRouter();

  const fetchPromotions = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/promotions");
      if (!response.data || !Array.isArray(response.data)) {
        console.error("Invalid response data:", response.data);
        setPromotions([]);
        return;
      }

      const promotionsData = response.data.map((promo) => {
        console.log("Processing promotion raw:", promo);
        let sportsList = [];
        let price = "฿150";
        let discountPrice = "฿135";

        let sportsArray = Array.isArray(promo.sports) ? promo.sports : [];
        if (typeof promo.sports === "string") {
          try {
            sportsArray = JSON.parse(promo.sports);
          } catch (e) {
            console.warn(`Invalid JSON in sports for promotion ${promo.id}:`, promo.sports);
          }
        }

        if (sportsArray.length > 0) {
          sportsList = sportsArray.map((sport) => sport.name).join(", ");
          price = `฿${sportsArray[0].price || 150}`;
          discountPrice = `฿${sportsArray[0].discountPrice || Math.round(
            (sportsArray[0].price || 150) * (1 - (promo.discount_percentage || 0) / 100)
          )}`;
        }

        const startDate = new Date(promo.start_datetime);
        const endDate = new Date(promo.end_datetime);
        const startDateOnly = new Date(startDate.getFullYear(), startDate.getMonth(), startDate.getDate());
        const endDateOnly = new Date(endDate.getFullYear(), endDate.getMonth(), endDate.getDate());

        console.log(`Converted dates - start: ${startDateOnly.toISOString().split('T')[0]}, end: ${endDateOnly.toISOString().split('T')[0]}`);

        return {
          id: promo.id,
          name: promo.promotion_name,
          status: promo.promotion_status,
          sportsList,
          stadiumName: promo.stadium_name || "ไม่ระบุ",
          duration: `${formatDateTime(promo.start_datetime)} - ${formatDateTime(promo.end_datetime)}`,
          price,
          discountPrice,
          startDate: startDateOnly,
          endDate: endDateOnly,
        };
      });
      setPromotions(promotionsData);
      console.log("Fetched promotions:", promotionsData);
    } catch (error) {
      console.error("Error fetching promotions:", error.response?.data || error.message);
      setPromotions([]);
    }
  };

  useEffect(() => {
    fetchPromotions();
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    const handleRouteChange = () => {
      if (window.location.pathname === "/promotion" && shouldRefresh) {
        fetchPromotions();
        setShouldRefresh(false);
      }
    };

    handleRouteChange();

    const interval = setInterval(() => {
      console.log("Auto-refreshing promotions...");
      fetchPromotions();
    }, 30000);

    return () => clearInterval(interval);
  }, [router, shouldRefresh]);

  const filterPromotions = () => {
    let filtered = [...promotions];
    if (selectedStatus !== "ทั้งหมด") {
      filtered = filtered.filter((promo) => promo.status === selectedStatus);
    }
    if (selectedDateOption === "วันนี้") {
      const today = new Date();
      const todayOnly = new Date(today.getFullYear(), today.getMonth(), today.getDate());
      console.log("Filtering for today:", todayOnly.toISOString().split('T')[0]);
      filtered = filtered.filter((promo) => {
        console.log(`Promo start: ${promo.startDate.toISOString().split('T')[0]}, end: ${promo.endDate.toISOString().split('T')[0]}`);
        return promo.startDate.getTime() <= todayOnly.getTime() && promo.endDate.getTime() >= todayOnly.getTime();
      });
    } else if (selectedDateOption === "สัปดาห์นี้") {
      const today = new Date();
      const startOfWeek = new Date(today.getFullYear(), today.getMonth(), today.getDate() - today.getDay());
      const endOfWeek = new Date(today.getFullYear(), today.getMonth(), today.getDate() - today.getDay() + 6);
      console.log("Filtering for week - start:", startOfWeek.toISOString().split('T')[0], "end:", endOfWeek.toISOString().split('T')[0]);
      filtered = filtered.filter((promo) => {
        console.log(`Promo start: ${promo.startDate.toISOString().split('T')[0]}, end: ${promo.endDate.toISOString().split('T')[0]}`);
        return promo.startDate <= endOfWeek && promo.endDate >= startOfWeek;
      });
    } else if (selectedDateOption === "กำหนดเอง" && customDateRange.start && customDateRange.end) {
      const startDate = new Date(customDateRange.start);
      const endDate = new Date(customDateRange.end);
      const startDateOnly = new Date(startDate.getFullYear(), startDate.getMonth(), startDate.getDate());
      const endDateOnly = new Date(endDate.getFullYear(), endDate.getMonth(), endDate.getDate());
      console.log("Filtering for custom - start:", startDateOnly.toISOString().split('T')[0], "end:", endDateOnly.toISOString().split('T')[0]);
      filtered = filtered.filter((promo) => {
        console.log(`Promo start: ${promo.startDate.toISOString().split('T')[0]}, end: ${promo.endDate.toISOString().split('T')[0]}`);
        return promo.startDate >= startDateOnly && promo.endDate <= endDateOnly;
      });
    }
    if (searchQuery.trim()) {
      filtered = filtered.filter((promo) =>
        promo.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    console.log("Filtered promotions:", filtered);
    return filtered;
  };

  const handleStatusDropdownToggle = () => setIsStatusDropdownOpen(!isStatusDropdownOpen);
  const handleStatusOptionSelect = (option) => {
    setSelectedStatus(option);
    setIsStatusDropdownOpen(false);
  };
  const handleDateDropdownToggle = () => setIsDateDropdownOpen(!isDateDropdownOpen);
  const handleDateOptionSelect = (option) => {
    setSelectedDateOption(option);
    setShowCustomInputs(option === "กำหนดเอง");
    setIsDateDropdownOpen(false);
  };

  const handleDetailClick = (id) => {
    console.log("Navigating to detail with id:", id);
    if (!id) {
      console.error("ID is undefined, cannot navigate to detail");
      alert("ไม่พบข้อมูลโปรโมชั่นที่เลือก");
      return;
    }
    router.push(`/detail?id=${id}`);
  };

  const handleEditClick = (id) => {
    if (!id) {
      console.error("ID is undefined, cannot navigate to edit");
      alert("ไม่พบข้อมูลโปรโมชั่นที่เลือก");
      return;
    }
    router.push(`/edit?id=${id}`);
  };

  const handleDeleteClick = (promoName, promoId) => {
    setPromoToDelete(promoName);
    setPromoIdToDelete(promoId);
    setShowConfirmModal(true);
  };

  const handleConfirmDelete = async () => {
    if (!promoIdToDelete) {
      console.error("No promo ID to delete");
      alert("ไม่พบ ID ของโปรโมชั่นที่เลือก");
      return;
    }
    try {
      await axios.delete(`http://localhost:5000/api/promotions/${promoIdToDelete}`);
      setPromotions(promotions.filter((promo) => promo.id !== promoIdToDelete));
      setShowConfirmModal(false);
      setShowSuccessModal(true);
      console.log(`Deleted promotion with id: ${promoIdToDelete}`);
    } catch (error) {
      console.error("Error deleting promotion:", error);
      alert("เกิดข้อผิดพลาดในการลบโปรโมชั่น: " + (error.response?.data?.error || error.message));
    }
  };

  const handleCloseModal = () => {
    setShowConfirmModal(false);
    setShowSuccessModal(false);
    if (showSuccessModal) {
      fetchPromotions();
      router.push("/promotion");
    }
  };

  const filteredPromotions = filterPromotions();

  return (
    <div className="background">
      <Tabbar />
      <div className="header-title">
        <h1>รายการโปรโมชั่นส่วนลด</h1>
      </div>
      <div className="container">
        <div className="filter-section">
          <select
            value={selectedStatus}
            onChange={(e) => handleStatusOptionSelect(e.target.value)}
            className="status-dropdown"
          >
            <option value="ทั้งหมด">ทั้งหมด</option>
            <option value="กำลังดำเนินการ">กำลังดำเนินการ</option>
            <option value="หมดอายุแล้ว">หมดอายุแล้ว</option>
          </select>

          <div className="search-section">
            <a href="/create-promotion" className="create-link">สร้างโปรโมชั่นส่วนลด</a>
            <h4>ชื่อโปรโมชั่น :</h4>
            <input
              type="text"
              placeholder="ค้นหาโปรโมชั่น..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="search-input"
            />
            <h4>ระยะเวลาโปรโมชั่น :</h4>
            <div className="date-dropdown">
              <button onClick={handleDateDropdownToggle} className="date-button">
                <span>{selectedDateOption === "กำหนดเอง" ? "กำหนดเอง" : selectedDateOption}</span>
                <FaChevronDown className={`arrow ${isDateDropdownOpen ? "rotate" : ""}`} />
              </button>
              {isDateDropdownOpen && (
                <div className="dropdown-menu">
                  <div onClick={() => handleDateOptionSelect("ทั้งหมด")}>ทั้งหมด</div>
                  <div onClick={() => handleDateOptionSelect("วันนี้")}>วันนี้</div>
                  <div onClick={() => handleDateOptionSelect("สัปดาห์นี้")}>สัปดาห์นี้</div>
                  <div onClick={() => handleDateOptionSelect("กำหนดเอง")}>กำหนดเอง</div>
                </div>
              )}
            </div>
            {showCustomInputs && (
              <div className="custom-date-range">
                <input
                  type="date"
                  value={customDateRange.start}
                  onChange={(e) => setCustomDateRange({ ...customDateRange, start: e.target.value })}
                  className="date-input"
                />
                <input
                  type="date"
                  value={customDateRange.end}
                  onChange={(e) => setCustomDateRange({ ...customDateRange, end: e.target.value })}
                  className="date-input"
                />
              </div>
            )}
          </div>
        </div>

        <div className="table-container">
          <table className="promo-table">
            <thead>
              <tr>
                <th>ชื่อโปรโมชั่น</th>
                <th>สนาม</th>
                <th>ประเภทกีฬา</th>
                <th>ระยะเวลา</th>
                <th>ดำเนินการ</th>
              </tr>
            </thead>
            <tbody>
              {filteredPromotions.map((promo, index) => (
                <tr key={index}>
                  <td>
                    <h4>{promo.name}</h4>
                    <span className={`status-label status-${promo.status.toLowerCase().replace(" ", "-")}`}>
                      {promo.status}
                    </span>
                  </td>
                  <td className="table-center"><h4>{promo.stadiumName}</h4></td>
                  <td className="table-center"><h4>{promo.sportsList || "ไม่ระบุ"}</h4></td>
                  <td className="table-center">{promo.duration}</td>
                  <td className="table-center action-buttons">
                    <button className="action-button detail-button" onClick={() => handleDetailClick(promo.id)}>
                      ดูรายละเอียด
                    </button>
                    {promo.status !== "หมดอายุแล้ว" && (
                      <button className="action-button edit-button" onClick={() => handleEditClick(promo.id)}>
                        <FaEdit /> แก้ไข
                      </button>
                    )}
                    <button className="action-button delete-button" onClick={() => handleDeleteClick(promo.name, promo.id)}>
                      <FaTrash /> ลบ
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {(showConfirmModal || showSuccessModal) && (
            <div className="modal-overlay">
              <div className="modal-content">
                {showConfirmModal && (
                  <>
                    <h2>ยืนยันการลบ</h2>
                    <p>คุณต้องการลบโปรโมชั่น "{promoToDelete}" หรือไม่?</p>
                    <div className="modal-buttons">
                      <button onClick={handleConfirmDelete} className="confirm-button">ยืนยัน</button>
                      <button onClick={() => setShowConfirmModal(false)} className="cancel-button">ยกเลิก</button>
                    </div>
                  </>
                )}
                {showSuccessModal && (
                  <>
                    <img src="/pictureowner/correct.png" alt="Success Icon" className="success-icon" />
                    <h2>ลบสำเร็จ</h2>
                    <p>โปรโมชั่น "{promoToDelete}" ถูกลบแล้ว</p>
                    <button onClick={handleCloseModal} className="confirm-button">ตกลง</button>
                  </>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}