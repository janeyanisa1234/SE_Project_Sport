"use client";

import { useState, useEffect } from "react";
import { FaChevronDown, FaEdit, FaTrash, FaCalendarAlt } from "react-icons/fa";
import { useRouter } from "next/navigation";
import Tabbar from "../components/tab";
import axios from "axios";

export default function Promotion() {
  const [promotions, setPromotions] = useState([]);
  const [isStatusDropdownOpen, setIsStatusDropdownOpen] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState("ทั้งหมด");
  const [isDateDropdownOpen, setIsDateDropdownOpen] = useState(false);
  const [selectedDateOption, setSelectedDateOption] = useState("ทั้งหมด");
  const [customDateRange, setCustomDateRange] = useState({ start: "", end: "" });
  const [showCustomInputs, setShowCustomInputs] = useState(false);
  const [searchQuery, setSearchQuery] = useState(""); // เพิ่ม state สำหรับช่องค้นหา
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [promoToDelete, setPromoToDelete] = useState(null);
  const [promoIdToDelete, setPromoIdToDelete] = useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const router = useRouter();

  const fetchPromotions = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/promotions");
      const currentDate = new Date("2025-03-06"); // วันที่ปัจจุบัน (ตามการตั้งค่า)
      const promotionsData = response.data.map((promo) => {
        let sport = "Unknown";
        let stadiumName = "ไม่ระบุ";
        let sportIcon = "/pictureowner/93.png";
        let price = "฿150";
        let discountPrice = "฿135";

        if (promo.sports) {
          const sportsArray = JSON.parse(promo.sports);
          if (sportsArray.length > 0) {
            sport = sportsArray[0].name || "Unknown";
            stadiumName = sportsArray[0].stadiumName || "ไม่ระบุ";
            price = `฿${sportsArray[0].price || 150}`;
            discountPrice = `฿${Math.round((sportsArray[0].price || 150) * (1 - (promo.discount_percentage || 0) / 100))}`;
          }
        }

        // คำนวณสถานะจาก end_datetime และเปลี่ยน "active" เป็น "กำลังดำเนินการ"
        const endDate = new Date(promo.end_datetime);
        const status = endDate < currentDate ? "หมดอายุแล้ว" : promo.promotion_status === "active" ? "กำลังดำเนินการ" : promo.promotion_status || "กำลังดำเนินการ";

        return {
          id: promo.id,
          name: promo.promotion_name,
          status: status,
          sport,
          stadiumName,
          sportIcon,
          duration: `${promo.start_datetime} - ${promo.end_datetime}`,
          price,
          discountPrice,
          startDate: new Date(promo.start_datetime),
          endDate: endDate,
        };
      });
      setPromotions(promotionsData);
      console.log("Fetched promotions:", promotionsData);
    } catch (error) {
      console.error("Error fetching promotions:", error);
    }
  };

  useEffect(() => {
    fetchPromotions();
    window.scrollTo(0, 0);
  }, []);

  // ฟังก์ชันกรองโปรโมชั่นตาม selectedStatus, selectedDateOption, และ searchQuery
  const filterPromotions = () => {
    let filtered = [...promotions];

    // กรองตามสถานะ
    if (selectedStatus !== "ทั้งหมด") {
      filtered = filtered.filter((promo) => promo.status === selectedStatus);
    }

    // กรองตามช่วงวันที่
    if (selectedDateOption === "วันนี้") {
      const today = new Date("2025-03-06");
      filtered = filtered.filter((promo) => {
        const promoStart = promo.startDate;
        const promoEnd = promo.endDate;
        return promoStart <= today && promoEnd >= today;
      });
    } else if (selectedDateOption === "สัปดาห์นี้") {
      const today = new Date("2025-03-06");
      const startOfWeek = new Date(today.setDate(today.getDate() - today.getDay()));
      const endOfWeek = new Date(today.setDate(today.getDate() - today.getDay() + 6));
      filtered = filtered.filter((promo) => {
        const promoStart = promo.startDate;
        const promoEnd = promo.endDate;
        return promoStart <= endOfWeek && promoEnd >= startOfWeek;
      });
    } else if (selectedDateOption === "กำหนดเอง" && customDateRange.start && customDateRange.end) {
      const startDate = new Date(customDateRange.start);
      const endDate = new Date(customDateRange.end);
      filtered = filtered.filter((promo) => {
        const promoStart = promo.startDate;
        const promoEnd = promo.endDate;
        return promoStart >= startDate && promoEnd <= endDate;
      });
    }

    // กรองตามชื่อโปรโมชั่น
    if (searchQuery.trim()) {
      filtered = filtered.filter((promo) =>
        promo.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    return filtered;
  };

  const handleStatusDropdownToggle = () => {
    setIsStatusDropdownOpen(!isStatusDropdownOpen);
  };

  const handleStatusOptionSelect = (option) => {
    setSelectedStatus(option);
    setIsStatusDropdownOpen(false);
  };

  const handleDateDropdownToggle = () => {
    setIsDateDropdownOpen(!isDateDropdownOpen);
  };

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

const handleEditClick = (id, status) => {
  if (!id) {
    console.error("ID is undefined, cannot navigate to edit");
    alert("ไม่พบข้อมูลโปรโมชั่นที่เลือก");
    return;
  }
  if (status === "หมดอายุแล้ว") {
    alert("ไม่สามารถแก้ไขโปรโมชั่นที่หมดอายุแล้ว");
    return;
  }
  router.push(`/edit?id=${id}`);
};

// ฟังก์ชันรีเฟรชข้อมูลหลังจากอัปเดต
const refreshPromotions = () => {
  fetchPromotions();
};

  const handleCloseModal = () => {
    setShowConfirmModal(false);
    setShowSuccessModal(false);
    if (showSuccessModal) router.push("/promotion");
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

  const handleCloseSuccessModal = () => {
    setShowSuccessModal(false);
    router.push("/promotion");
    window.scrollTo(0, 0);
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  // สไตล์ปุ่มมาตรฐาน
  const buttonStyle = {
    backgroundColor: "#1B9FEC",
    color: "white",
    border: "none",
    padding: "8px 15px",
    borderRadius: "5px",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    gap: "8px",
    fontSize: "14px",
    width: "100px",
    justifyContent: "center",
    textAlign: "center",
  };

  const deleteButtonStyle = {
    ...buttonStyle,
    backgroundColor: "#ff4d4d",
    width: "100px",
  };

  const filteredPromotions = filterPromotions();

  return (
    <div
      style={{
        color: "var(--foreground)",
        backgroundImage: `url('/pictureowner/bg.png')`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        fontFamily: "Arial, Helvetica, sans-serif",
        height: "100vh",
        margin: "0",
      }}
    >
      <Tabbar />
      <div
        style={{
          position: "relative",
          top: "75px",
          marginBottom: "20px",
          height: "60px",
          width: "100%",
          backgroundColor: "black",
          color: "white",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <h1 style={{ textAlign: "center", color: "white", fontSize: "20px" }}>
          รายการโปรโมชั่นส่วนลด
        </h1>
      </div>
      <div
        className="Container"
        style={{
          position: "relative",
          top: "75px",
          margin: "40px",
          padding: "20px",
          backgroundColor: "white",
          minHeight: "400px",
          borderRadius: "10px",
          boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
        }}
      >
        <div>
          <select
            id="promotion-select"
            name="promotionSelect"
            className="nav-button"
            style={{
              backgroundColor: "#D9D9D9",
              color: "black",
              padding: "10px",
              height: "35px",
              borderRadius: "5px",
              cursor: "pointer",
              border: "none",
              outline: "none",
            }}
            value={selectedStatus}
            onChange={(e) => handleStatusOptionSelect(e.target.value)}
          >
            <option value="ทั้งหมด">ทั้งหมด</option>
            <option value="กำลังดำเนินการ">กำลังดำเนินการ</option>
            <option value="หมดอายุแล้ว">หมดอายุแล้ว</option>
          </select>
        </div>
        <div style={{ display: "flex", justifyContent: "center", padding: "20px", alignItems: "center" }}>
          <a href="/create-promotion" style={{ textDecoration: "none" }}>
            <h4 style={{ color: "#1B9FEC" }}>สร้างโปรโมชั่นส่วนลด</h4>
          </a>
          <h4 style={{ marginLeft: "20px" }}>ชื่อโปรโมชั่น :</h4>
          <input
            type="text"
            id="search-input"
            name="search"
            className="search-input"
            placeholder="ค้นหาโปรโมชั่น..."
            value={searchQuery} // ผูกค่า input กับ state
            onChange={(e) => setSearchQuery(e.target.value)} // อัปเดต state เมื่อพิมพ์
            onKeyPress={(e) => {
              if (e.key === "Enter") {
                fetchPromotions(); // เรียก fetch ใหม่เมื่อกด Enter
              }
            }}
            style={{
              marginLeft: "20px",
              backgroundColor: "#D9D9D9",
              marginTop: "auto",
              height: "35px",
              marginBottom: "auto",
              padding: "0 10px",
              border: "none",
              borderRadius: "5px",
              outline: "none",
            }}
          />
          <h4 style={{ marginLeft: "20px" }}>ระยะเวลาโปรโมชั่น :</h4>
          <button
            className="nav-button"
            style={{
              backgroundColor: "#D9D9D9",
              color: "black",
              marginLeft: "20px",
              marginTop: "auto",
              height: "35px",
              marginBottom: "auto",
              width: "150px",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              padding: "0 10px",
              borderRadius: "5px",
              border: "none",
              cursor: "pointer",
            }}
            onClick={handleDateDropdownToggle}
          >
            <span>{selectedDateOption === "กำหนดเอง" ? "กำหนดเอง" : selectedDateOption}</span>
            <FaChevronDown className={`arrow ${isDateDropdownOpen ? "rotate" : ""}`} />
          </button>
          {isDateDropdownOpen && (
            <div
              style={{
                position: "absolute",
                backgroundColor: "#fff",
                boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
                borderRadius: "5px",
                marginTop: "40px",
                padding: "10px",
                zIndex: 1,
                width: "150px",
              }}
            >
              <div
                style={{ padding: "5px", cursor: "pointer" }}
                onClick={() => handleDateOptionSelect("ทั้งหมด")}
              >
                ทั้งหมด
              </div>
              <div
                style={{ padding: "5px", cursor: "pointer" }}
                onClick={() => handleDateOptionSelect("วันนี้")}
              >
                วันนี้
              </div>
              <div
                style={{ padding: "5px", cursor: "pointer" }}
                onClick={() => handleDateOptionSelect("สัปดาห์นี้")}
              >
                สัปดาห์นี้
              </div>
              <div
                style={{ padding: "5px", cursor: "pointer" }}
                onClick={() => handleDateOptionSelect("กำหนดเอง")}
              >
                กำหนดเอง
              </div>
            </div>
          )}
          {showCustomInputs && (
            <div style={{ display: "flex", gap: "10px", marginLeft: "20px" }}>
              <input
                type="date"
                value={customDateRange.start}
                onChange={(e) => setCustomDateRange({ ...customDateRange, start: e.target.value })}
                style={{
                  height: "35px",
                  padding: "0 10px",
                  borderRadius: "5px",
                  border: "1px solid #ccc",
                }}
              />
              <input
                type="date"
                value={customDateRange.end}
                onChange={(e) => setCustomDateRange({ ...customDateRange, end: e.target.value })}
                style={{
                  height: "35px",
                  padding: "0 10px",
                  borderRadius: "5px",
                  border: "1px solid #ccc",
                }}
              />
            </div>
          )}
        </div>
        <div>
          <table
            style={{
              width: "100%",
              borderCollapse: "collapse",
              boxShadow: "0 0 20px rgba(0, 0, 0, 0.1)",
            }}
          >
            <thead>
              <tr
                style={{
                  borderBottom: "2px solid #B4B1B1",
                  fontSize: "18px",
                  fontWeight: "bold",
                  backgroundColor: "#f8f9fa",
                }}
              >
                <th style={{ padding: "12px", width: "25%", textAlign: "left" }}>
                  ชื่อโปรโมชั่น
                </th>
                <th style={{ padding: "12px", width: "20%", textAlign: "center" }}>
                  สนาม
                </th>
                <th style={{ padding: "12px", width: "20%", textAlign: "center" }}>
                  ประเภทกีฬา
                </th>
                <th style={{ padding: "12px", width: "20%", textAlign: "center" }}>
                  ระยะเวลา
                </th>
                <th style={{ padding: "12px", width: "15%", textAlign: "center" }}>
                  ดำเนินการ
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredPromotions.map((promo, index) => (
                <tr
                  key={index}
                  style={{
                    borderBottom: "1px solid #B4B1B1",
                    fontSize: "16px",
                    backgroundColor: index % 2 === 0 ? "#ffffff" : "#f8f9fa",
                    transition: "background-color 0.3s ease",
                  }}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.backgroundColor = "#e9ecef")
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.backgroundColor =
                      index % 2 === 0 ? "#ffffff" : "#f8f9fa")
                  }
                >
                  <td style={{ padding: "12px" }}>
                    <h4>{promo.name}</h4>
                    <div
                      style={{
                        backgroundColor:
                          promo.status === "หมดอายุแล้ว"
                            ? "#ffcccc"
                            : "#ccffcc",
                        color:
                          promo.status === "หมดอายุแล้ว"
                            ? "#ff0000"
                            : "#00cc00",
                        padding: "4px 8px",
                        borderRadius: "12px",
                        display: "inline-block",
                        fontSize: "14px",
                      }}
                    >
                      {promo.status}
                    </div>
                  </td>
                  <td style={{ padding: "12px", textAlign: "center" }}>
                    <h4>{promo.stadiumName}</h4>
                  </td>
                  <td style={{ padding: "12px", textAlign: "center" }}>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      <img
                        src={promo.sportIcon}
                        alt="sport icon"
                        style={{ width: "40px", marginRight: "8px" }}
                      />
                      <h4>{promo.sport}</h4>
                    </div>
                  </td>
                  <td style={{ padding: "12px", textAlign: "center" }}>
                    {promo.duration}
                  </td>
                  <td
                    style={{
                      padding: "12px",
                      textAlign: "center",
                      display: "flex",
                      justifyContent: "center",
                      gap: "10px",
                    }}
                  >
                    <button
                      style={buttonStyle}
                      onClick={() => handleDetailClick(promo.id)}
                    >
                      ดูรายละเอียด
                    </button>

                    {promo.status !== "หมดอายุแล้ว" && (
                      <button
                        style={buttonStyle}
                        onClick={() => handleEditClick(promo.id, promo.status)}
                      >
                        <FaEdit /> แก้ไข
                      </button>
                    )}

                    <button
                      style={deleteButtonStyle}
                      onClick={() => handleDeleteClick(promo.name, promo.id)}
                    >
                      <FaTrash /> ลบ
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {(showConfirmModal || showSuccessModal) && (
            <div
              style={{
                position: "fixed",
                top: "0",
                left: "0",
                right: "0",
                bottom: "0",
                backgroundColor: "rgba(0, 0, 0, 0.5)",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                zIndex: "9999",
              }}
            >
              <div
                style={{
                  backgroundColor: "white",
                  padding: "40px 60px",
                  borderRadius: "12px",
                  textAlign: "center",
                  boxShadow: "0 15px 30px rgba(0, 0, 0, 0.2)",
                  maxWidth: "600px",
                  width: "95%",
                  transition: "transform 0.3s ease, opacity 0.3s ease",
                }}
              >
                {showConfirmModal && (
                  <>
                    <h2 style={{ fontSize: "24px", color: "#333", fontWeight: "600" }}>
                      ยืนยันการลบ
                    </h2>
                    <p style={{ fontSize: "16px", color: "#555", marginBottom: "20px" }}>
                      คุณต้องการลบโปรโมชั่น "{promoToDelete}" หรือไม่?
                    </p>
                    <div style={{ display: "flex", justifyContent: "center", gap: "20px" }}>
                      <button
                        onClick={handleConfirmDelete}
                        style={{
                          backgroundColor: "#4CAF50",
                          color: "white",
                          padding: "12px 25px",
                          borderRadius: "8px",
                          border: "none",
                          cursor: "pointer",
                          fontSize: "16px",
                          transition: "background-color 0.3s",
                        }}
                      >
                        ยืนยัน
                      </button>
                      <button
                        onClick={() => setShowConfirmModal(false)}
                        style={{
                          backgroundColor: "#ccc",
                          color: "black",
                          padding: "12px 25px",
                          borderRadius: "8px",
                          border: "none",
                          cursor: "pointer",
                          fontSize: "16px",
                          transition: "background-color 0.3s",
                        }}
                      >
                        ยกเลิก
                      </button>
                    </div>
                  </>
                )}

                {showSuccessModal && (
                  <>
                    <img
                      src="/pictureowner/correct.png"
                      alt="Success Icon"
                      style={{ width: "60px", height: "60px", marginBottom: "20px", display: "block", margin: "0 auto" }}
                    />
                    <h2 style={{ fontSize: "24px", color: "#333", fontWeight: "600" }}>
                      ลบสำเร็จ
                    </h2>
                    <p style={{ fontSize: "16px", color: "#555", marginBottom: "20px" }}>
                      โปรโมชั่น "{promoToDelete}" ถูกลบแล้ว
                    </p>
                    <div>
                      <button
                        onClick={handleCloseSuccessModal}
                        style={{
                          backgroundColor: "#4CAF50",
                          color: "white",
                          padding: "12px 25px",
                          borderRadius: "8px",
                          border: "none",
                          cursor: "pointer",
                          fontSize: "16px",
                          transition: "background-color 0.3s",
                        }}
                      >
                        ตกลง
                      </button>
                    </div>
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