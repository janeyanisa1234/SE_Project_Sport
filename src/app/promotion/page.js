"use client";

import { useState, useEffect } from "react";
import { FaChevronDown, FaEdit, FaTrash } from "react-icons/fa";
import { useRouter } from "next/navigation"; // เพิ่มการ import useRouter
import Tabbar from "../components/tab";

export default function Promotion() {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState("ทั้งหมด");
  const [showModal, setShowModal] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [promoToDelete, setPromoToDelete] = useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0); // เมื่อหน้าโหลดใหม่จะไปที่ด้านบนสุด
  }, []);
  // กำหนดค่า promotions ให้เป็นข้อมูลเริ่มต้น
  const [promotions, setPromotions] = useState([
    {
      name: "ลด 11% ตีสนุก ทุกแมตช์ 11.11",
      status: "หมดอายุแล้ว",
      sport: "แบดมินตัน",
      sportIcon: "/pictureowner/93.png",
      duration: "11-11-2024 00:00 - 12-11-2024 23:59",
    },
    {
      name: "ส่วนลดพิเศษ ฟุตบอล",
      status: "กำลังดำเนินการ",
      sport: "ฟุตบอล",
      sportIcon: "/pictureowner/93.png",
      duration: "20-12-2024 00:00 - 25-12-2024 23:59",
    },
  ]);
  const router = useRouter();
  const handleDropdownToggle = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };
  const handleOptionSelect = (option) => {
    setSelectedOption(option);
    setIsDropdownOpen(false);
  };
  const handleDetailClick = () => {
    router.push("/detail");
  };
  const handleEditClick = () => {
    router.push("/edit");
  };
  const handleCloseModal = () => {
    setShowModal(false);
    if (deleteSuccess) {
      router.push("/promotion");
    }
  };
  const handleDeleteClick = (promoName) => {
    setPromoToDelete(promoName);
    setShowConfirmModal(true);
  };
  const handleConfirmDelete = () => {
    setPromotions(promotions.filter((promo) => promo.name !== promoToDelete));
    setShowConfirmModal(false);
    setShowSuccessModal(true);
  };
  const handleCloseSuccessModal = () => {
    setShowSuccessModal(false);
    router.push("/promotion");
    window.scrollTo(0, 0); // ย้ายหน้าไปที่ตำแหน่งด้านบนสุดหลังจากกลับไปที่หน้า /promotion
  };
  // Toggle sidebar
  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  useEffect(() => {
    window.scrollTo(0, 0); // ทุกครั้งที่หน้า Promotion โหลดใหม่
  }, []);
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
        <h1 style={{ textAlign: "center", color: "white", fontSize: "20px", }}>
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
            value={selectedOption}
            onChange={(e) => setSelectedOption(e.target.value)}
          >
            <option value="หมดอายุแล้ว">หมดอายุแล้ว</option>
            <option value="ทั้งหมด">ทั้งหมด</option>
            <option value="กำลังดำเนินการ">กำลังดำเนินการ</option>
          </select>
        </div>
        <div
          style={{ display: "flex", justifyContent: "center", padding: "20px" }}
        >
          <a href="/create-promotion" style={{ textDecoration: "none" }}>
            <h4 style={{ color: "#1B9FEC" }}>สร้างโปรโมชั่นส่วนลด</h4>
          </a>
          <h4 style={{ marginLeft: "20px" }}>ชื่อโปรโมชั่น :</h4>
          <input
            type="text"
            className="search-input"
            placeholder="ค้นหาโปรโมชั่น..."
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
              width: "300px",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              padding: "0 10px",
              borderRadius: "5px",
              border: "none",
              cursor: "pointer",
            }}
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          >
            <span>เลือกวันที่</span>
            <FaChevronDown
              className={`arrow ${isDropdownOpen ? "rotate" : ""}`}
            />
          </button>
          {isDropdownOpen && (
            <div
              style={{
                position: "absolute",
                backgroundColor: "#fff",
                boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
                borderRadius: "5px",
                marginTop: "40px",
                padding: "10px",
                zIndex: 1,
              }}
            >
              <div>วันที่เริ่มต้น</div>
              <div>วันที่สิ้นสุด</div>
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
                <th
                  style={{ padding: "12px", width: "30%", textAlign: "left" }}
                >
                  ชื่อโปรโมชั่น
                </th>
                <th
                  style={{ padding: "12px", width: "20%", textAlign: "center" }}
                >
                  ประเภทกีฬา
                </th>
                <th
                  style={{ padding: "12px", width: "30%", textAlign: "center" }}
                >
                  ระยะเวลา
                </th>
                <th
                  style={{ padding: "12px", width: "20%", textAlign: "center" }}
                >
                  ดำเนินการ
                </th>
              </tr>
            </thead>
            <tbody>
              {promotions.map((promo, index) => (
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
                      style={{
                        backgroundColor: "#1B9FEC",
                        color: "white",
                        border: "none",
                        padding: "8px 12px",
                        borderRadius: "5px",
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
                        gap: "5px",
                      }}
                      onClick={() => handleDetailClick(promo.name)} // ดูรายละเอียด
                    >
                      ดูรายละเอียด
                    </button>

                    <button
                      style={{
                        backgroundColor: "#1B9FEC",
                        color: "white",
                        border: "none",
                        padding: "8px 12px",
                        borderRadius: "5px",
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
                        gap: "5px",
                      }}
                      onClick={() => handleEditClick(promo.name)} // แก้ไข
                    >
                      <FaEdit /> แก้ไข
                    </button>

                    <button
                      style={{
                        backgroundColor: "#ff4d4d",
                        color: "white",
                        border: "none",
                        padding: "8px 12px",
                        borderRadius: "5px",
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
                        gap: "5px",
                      }}
                      onClick={() => handleDeleteClick(promo.name)} // ลบ
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
                zIndex: 9999,
              }}
            >
              <div
                style={{
                  backgroundColor: "white",
                  padding: "40px 60px",
                  borderRadius: "12px",
                  textAlign: "center",
                  boxShadow: "0 15px 30px rgba(0, 0, 0, 0.2)",
                  maxWidth: "500px",
                  width: "90%",
                  transition: "transform 0.3s ease, opacity 0.3s ease",
                }}
              >
                {showConfirmModal && (
                  <>
                    <h2
                      style={{
                        fontSize: "24px",
                        color: "#333",
                        fontWeight: "600",
                      }}
                    >
                      ยืนยันการลบ
                    </h2>
                    <p
                      style={{
                        fontSize: "16px",
                        color: "#555",
                        marginBottom: "20px",
                      }}
                    >
                      คุณต้องการลบโปรโมชั่น "{promoToDelete}" หรือไม่?
                    </p>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "center",
                        gap: "20px",
                      }}
                    >
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
                      src="/pictureadmin/correct.png"
                      alt="Success Icon"
                      style={{
                        width: "60px",
                        height: "60px",
                        marginBottom: "10px",
                      }}
                    />
                    <h2
                      style={{
                        fontSize: "24px",
                        color: "#333",
                        fontWeight: "600",
                      }}
                    >
                      ลบสำเร็จ
                    </h2>
                    <p
                      style={{
                        fontSize: "16px",
                        color: "#555",
                        marginBottom: "20px",
                      }}
                    >
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
