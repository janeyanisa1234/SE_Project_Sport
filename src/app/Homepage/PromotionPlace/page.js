"use client";

import { useState, useEffect } from "react";
import { FaChevronDown, FaEdit, FaTrash, FaCalendarAlt } from "react-icons/fa";
import { useRouter , usePathname} from "next/navigation";
import Tabbar from "../components/tab";
import axios from "axios";
import "./promotion.css";


// แปลงวันที่เป็น DD/MM/YYYY HH:MM
const formatDateTime = (dateTimeStr) => {
  const date = new Date(dateTimeStr); // สร้าง object วันที่
  const day = String(date.getDate()).padStart(2, "0"); // แปลงวันเป็น 2 หลัก
  const month = String(date.getMonth() + 1).padStart(2, "0"); // แปลงเดือนเป็น 2 หลัก
  const year = date.getFullYear(); // ดึงปีเต็ม
  const hours = String(date.getHours()).padStart(2, "0"); // แปลงชั่วโมงเป็น 2 หลัก
  const minutes = String(date.getMinutes()).padStart(2, "0"); // แปลงนาทีเป็น 2 หลัก
  return `${day}/${month}/${year} ${hours}:${minutes}`; // คืนค่าในรูปแบบที่ต้องการ
};

// Component หลัก
export default function Promotion() {
  // State การจัดการข้อมูลและ UI
  const [promotions, setPromotions] = useState([]); // เก็บรายการโปรโมชัน
  const [isStatusDropdownOpen, setIsStatusDropdownOpen] = useState(false); // ควบคุม dropdown สถานะ
  const [selectedStatus, setSelectedStatus] = useState("ทั้งหมด"); // สถานะที่เลือก
  const [isDateDropdownOpen, setIsDateDropdownOpen] = useState(false); // ควบคุม dropdown วันที่
  const [selectedDateOption, setSelectedDateOption] = useState("ทั้งหมด"); // ตัวเลือกวันที่
  const [customDateRange, setCustomDateRange] = useState({ start: "", end: "" }); // ช่วงวันที่กำหนดเอง
  const [showCustomInputs, setShowCustomInputs] = useState(false); // แสดง input วันที่กำหนดเอง
  const [searchQuery, setSearchQuery] = useState(""); // ข้อความค้นหา
  const [showConfirmModal, setShowConfirmModal] = useState(false); // แสดง modal ยืนยันลบ
  const [showSuccessModal, setShowSuccessModal] = useState(false); // แสดง modal ลบสำเร็จ
  const [promoToDelete, setPromoToDelete] = useState(null); // ชื่อโปรโมชันที่ถูกลบ
  const [promoIdToDelete, setPromoIdToDelete] = useState(null); // ID โปรโมชันที่ถูกลบ
  const [shouldRefresh, setShouldRefresh] = useState(false); // ควบคุมการรีเฟรช

  const router = useRouter(); // อินสแตนซ์ของ router
  const pathname = usePathname();

  // ดึงข้อมูลโปรโมชันจาก API
  const fetchPromotions = async () => {
    const token = localStorage.getItem("token"); // ดึง token จาก localStorage
    if (!token) {
      alert("กรุณาเข้าสู่ระบบก่อนดูโปรโมชั่น"); // แจ้งเตือนถ้าไม่มี token
      router.push("/Login"); // ไปหน้า login
      return;
    }

    try {
      const response = await axios.get("http://localhost:5000/api/promotions", {
        headers: { Authorization: `Bearer ${token}` }, // ส่ง token ใน header
      });

      if (!Array.isArray(response.data)) { // ตรวจสอบว่า data เป็น array
        console.error("Invalid response:", response.data); // log ข้อผิดพลาด
        setPromotions([]); // รีเซ็ตโปรโมชันเป็นว่าง
        return;
      }

      const promotionsData = response.data.map((promo) => { // แปลงข้อมูลจาก API
        let sportsArray = Array.isArray(promo.sports) ? promo.sports : []; // ตรวจสอบว่า sports เป็น array
        if (typeof promo.sports === "string") { // ถ้า sports เป็น string
          try {
            sportsArray = JSON.parse(promo.sports); // แปลง JSON
          } catch (e) {
            console.warn(`Invalid JSON in sports for promo ${promo.id}`); // log ถ้า JSON ผิด
          }
        }

        const sportsList = sportsArray.length > 0 ? sportsArray.map(s => s.name).join(", ") : ""; // รายการกีฬา
        const price = sportsArray[0]?.price ? `฿${sportsArray[0].price}` : "฿150"; // ราคาเริ่มต้น
        const discountPrice = sportsArray[0]?.discountPrice 
          ? `฿${sportsArray[0].discountPrice}` 
          : `฿${Math.round((sportsArray[0]?.price || 150) * (1 - (promo.discount_percentage || 0) / 100))}`; // ราคาหลังลด

        const startDate = new Date(promo.start_datetime); // วันที่เริ่ม
        const endDate = new Date(promo.end_datetime); // วันที่สิ้นสุด
        const startDateOnly = new Date(startDate.getFullYear(), startDate.getMonth(), startDate.getDate()); // เฉพาะวันเริ่ม
        const endDateOnly = new Date(endDate.getFullYear(), endDate.getMonth(), endDate.getDate()); // เฉพาะวันสิ้นสุด

        return {
          id: promo.id, // ID โปรโมชัน
          name: promo.promotion_name, // ชื่อโปรโมชัน
          status: promo.promotion_status, // สถานะ
          sportsList, // รายการกีฬา
          stadiumName: promo.stadium_name || "ไม่ระบุ", // ชื่อสนาม
          duration: `${formatDateTime(promo.start_datetime)} - ${formatDateTime(promo.end_datetime)}`, // ระยะเวลา
          price, // ราคา
          discountPrice, // ราคาหลังลด
          startDate: startDateOnly, // วันที่เริ่ม (เฉพาะวัน)
          endDate: endDateOnly, // วันที่สิ้นสุด (เฉพาะวัน)
        };
      });

      setPromotions(promotionsData); // อัปเดต state
      console.log("Fetched promotions:", promotionsData); // log ข้อมูลที่ได้
    } catch (error) {
      console.error("Error:", error.response?.data || error.message); // log ข้อผิดพลาด
      if (error.code === "ERR_NETWORK") alert("ไม่สามารถเชื่อมต่อเซิร์ฟเวอร์ได้"); // แจ้งเตือนถ้าเน็ตเวิร์คขัดข้อง
      if (error.response?.status === 401) {
        alert("เซสชันหมดอายุ กรุณาเข้าสู่ระบบใหม่"); // แจ้งเตือนถ้า token หมดอายุ
        router.push("/Login"); // ไปหน้า login
      }
      setPromotions([]); // รีเซ็ตโปรโมชัน
    }
  };

  // กรองโปรโมชันตามสถานะและวันที่
  const filterPromotions = () => {
    let filtered = [...promotions]; // คัดลอกโปรโมชัน

    if (selectedStatus !== "ทั้งหมด") { // กรองตามสถานะ
      filtered = filtered.filter(promo => promo.status === selectedStatus);
    }

    if (selectedDateOption === "วันนี้") { // กรองเฉพาะวันนี้
      const today = new Date();
      const todayOnly = new Date(today.getFullYear(), today.getMonth(), today.getDate());
      filtered = filtered.filter(promo => 
        promo.startDate.getTime() <= todayOnly.getTime() && 
        promo.endDate.getTime() >= todayOnly.getTime()
      );
    } else if (selectedDateOption === "สัปดาห์นี้") { // กรองสัปดาห์นี้
      const today = new Date();
      const startOfWeek = new Date(today.getFullYear(), today.getMonth(), today.getDate() - today.getDay());
      const endOfWeek = new Date(today.getFullYear(), today.getMonth(), today.getDate() - today.getDay() + 6);
      filtered = filtered.filter(promo => 
        promo.startDate.getTime() <= endOfWeek.getTime() && 
        promo.endDate.getTime() >= startOfWeek.getTime()
      );
    } else if (selectedDateOption === "กำหนดเอง" && customDateRange.start && customDateRange.end) { // กรองวันที่กำหนดเอง
      const startDate = new Date(customDateRange.start);
      const endDate = new Date(customDateRange.end);
      const startDateOnly = new Date(startDate.getFullYear(), startDate.getMonth(), startDate.getDate());
      const endDateOnly = new Date(endDate.getFullYear(), endDate.getMonth(), endDate.getDate());
      filtered = filtered.filter(promo => 
        promo.startDate.getTime() >= startDateOnly.getTime() && 
        promo.endDate.getTime() <= endDateOnly.getTime()
      );
    }

    if (searchQuery.trim()) { // กรองตามคำค้นหา
      filtered = filtered.filter(promo => promo.name.toLowerCase().includes(searchQuery.toLowerCase()));
    }

    console.log("Filtered:", filtered); // log ข้อมูลที่กรองแล้ว
    return filtered;
  };

  // ฟังก์ชันจัดการ UI และการนำทาง
  const handleStatusDropdownToggle = () => setIsStatusDropdownOpen(!isStatusDropdownOpen); // สลับ dropdown สถานะ
  const handleStatusOptionSelect = (option) => { // เลือกสถานะ
    setSelectedStatus(option);
    setIsStatusDropdownOpen(false);
  };

  const handleDateDropdownToggle = () => setIsDateDropdownOpen(!isDateDropdownOpen); // สลับ dropdown วันที่
  const handleDateOptionSelect = (option) => { // เลือกวันที่
    setSelectedDateOption(option);
    setShowCustomInputs(option === "กำหนดเอง");
    setIsDateDropdownOpen(false);
  };

  const handleDetailClick = (id) => { // ไปหน้ารายละเอียด
    if (!id) {
      alert("ไม่พบข้อมูลโปรโมชัน");
      return;
    }
    router.push(`/detail?id=${id}`);
  };

  const handleEditClick = (id) => { // ไปหน้าแก้ไข
    if (!id) {
      alert("ไม่พบข้อมูลโปรโมชัน");
      return;
    }
    router.push(`/edit?id=${id}`);
  };

  const handleDeleteClick = (promoName, promoId) => { // แสดง modal ลบ
    setPromoToDelete(promoName);
    setPromoIdToDelete(promoId);
    setShowConfirmModal(true);
  };

  const handleConfirmDelete = async () => { // ลบโปรโมชัน
    const token = localStorage.getItem("token"); // ดึง token
    if (!token) {
      alert("กรุณาเข้าสู่ระบบก่อน");
      router.push("/Login");
      return;
    }

    if (!promoIdToDelete) {
      alert("ไม่พบ ID โปรโมชัน");
      return;
    }

    try {
      await axios.delete(`http://localhost:5000/api/promotions/${promoIdToDelete}`, {
        headers: { Authorization: `Bearer ${token}` }, // ส่งคำขอลบ
      });
      setPromotions(promotions.filter(p => p.id !== promoIdToDelete)); // อัปเดต state
      setShowConfirmModal(false); // ปิด modal ยืนยัน
      setShowSuccessModal(true); // แสดง modal สำเร็จ
      console.log("Deleted promo:", promoIdToDelete); // log การลบ
    } catch (error) {
      console.error("Delete error:", error.response?.data || error); // log ข้อผิดพลาด
      if (error.response?.status === 401) {
        alert("เซสชันหมดอายุ");
        router.push("/Login");
      } else {
        alert("เกิดข้อผิดพลาด: " + (error.response?.data?.error || error.message));
      }
    }
  };

  // ปิด modal
  const handleCloseModal = () => { 
    setShowConfirmModal(false);
    setShowSuccessModal(false);
    if (showSuccessModal) fetchPromotions(); // รีเฟรชข้อมูลหลังลบสำเร็จ
  };
 
    // โหลดข้อมูลตอนเริ่ม จัดการการเปลี่ยนหน้า
  useEffect(() => {
    fetchPromotions();
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    const handleRouteChange = () => {
      if (pathname === "/promotion" && shouldRefresh) {
        fetchPromotions();
        setShouldRefresh(false);
        const container = document.querySelector(".container");
        if (container) {
          // รีเซ็ตสไตล์ของ .container ให้กลับสู่ค่าเริ่มต้นของหน้า Promotion
          container.style.width = "1300px"; // คงความกว้างตามที่กำหนด
          container.style.minHeight = "600px"; // คงความสูงขั้นต่ำ
          container.style.height = "auto"; // ขยายตามเนื้อหา
          container.style.overflowY = "auto"; // รีเซ็ตการเลื่อนแนวตั้ง
          container.style.overflowX = "hidden"; // รีเซ็ตการเลื่อนแนวนอน
          container.style.position = "relative"; // รีเซ็ต position
          container.style.top = "0"; // รีเซ็ต top
          container.style.margin = "110px auto 20px"; // รีเซ็ต margin
          container.scrollTop = 0; // เลื่อนไปด้านบน
        }
      }
    };
  
      handleRouteChange();
    }, [pathname, shouldRefresh]);

  const filteredPromotions = filterPromotions(); // กรองโปรโมชัน
  

  // ส่วนแสดงผล UI
  return (
    <div className="background">
      <Tabbar />
      <div className="promo-header-title">
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
              <button onClick={() => setIsDateDropdownOpen(!isDateDropdownOpen)} className="date-button">
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

        <div className="promo-container">
          {filteredPromotions.length > 0 && (
            <div className="promo-header-row">
              <span>ชื่อโปรโมชั่น</span>
              <span>สนาม</span>
              <span>ประเภทกีฬา</span>
              <span>ระยะเวลา</span>
              <span>ดำเนินการ</span>
            </div>
          )}
          {filteredPromotions.length === 0 ? (
            <p className="no-data">ไม่มีโปรโมชั่นที่ตรงกับเงื่อนไข</p>
          ) : (
            filteredPromotions.map((promo) => (
              <div key={promo.id} className="promo-card">
                <div className="promo-content">
                  <div className="promo-header">
                    <h3>{promo.name}</h3>
                    <span className={`status-label status-${promo.status.toLowerCase().replace(" ", "-")}`}>
                      {promo.status}
                    </span>
                  </div>
                  <div className="promo-field">{promo.stadiumName}</div>
                  <div className="promo-field">{promo.sportsList || "ไม่ระบุ"}</div>
                  <div className="promo-field">{promo.duration}</div>
                  <div className="action-buttons">
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
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

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
                  <img src="/pictureowner/correct.png" alt="Success" className="success-icon" />
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
  );
}