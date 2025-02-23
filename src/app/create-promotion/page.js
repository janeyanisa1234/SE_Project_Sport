"use client";

import { useState } from "react";
import { FaPlus } from "react-icons/fa";
import { useRouter } from "next/navigation";
import Tabbar from "../components/tab";
import "./createpromotion.css"; 

export default function EditPromotion() {
  const [showModal, setShowModal] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);

  const handleConfirm = () => {
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    router.push("/promotion");
  };

  const handleAddField = () => {
    router.push("/add");
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div>
      <Tabbar/>

      <div className="header-title">
        <h1>สร้างโปรโมชั่นส่วนลด</h1>
      </div>

      <div className="container">
        <div className="form-row">
          <h2 className="form-title">ชื่อโปรโมชั่น</h2>
          <input type="text" name="promotion_name" placeholder="ใส่ชื่อโปรโมชั่น" className="input-field" />
        </div>

        <div className="form-row">
          <h2 className="form-title">วันที่เริ่มโปรโมชั่น</h2>
          <div className="date-time-group">
            <input type="date" name="start_date" className="input-field" />
            <input type="time" name="start_time" className="input-field" />
          </div>
        </div>

        <div className="form-row">
          <h2 className="form-title">วันที่สิ้นสุดโปรโมชั่น</h2>
          <div className="date-time-group">
            <input type="date" name="end_date" className="input-field" />
            <input type="time" name="end_time" className="input-field" />
          </div>
        </div>

        <div className="form-row">
          <h2 className="form-title">ส่วนลด</h2>
          <input type="text" name="discount" placeholder="% ลด" className="input-field" />
        </div>

        <div className="form-row">
          <h2 className="form-title">จำกัดการใช้ส่วนลดต่อผู้ใช้</h2>
          <input type="number" name="discount_limit" placeholder="จำนวนครั้งที่ใช้ได้" className="input-field" />
        </div>

        <div className="form-row">
          <h2 className="form-title">สนามที่เข้าร่วม</h2>
          <input type="text" name="promotion_name" placeholder="ใส่ชื่อสนาม" className="input-field" />
        </div>

        <div className="form-row">
          <h2 className="form-title">กีฬาที่เข้าร่วม</h2>
          <button onClick={handleAddField} className="add-button">
            <FaPlus /> เพิ่มกีฬา
          </button>
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
            <img src="/correct.png" alt="Success Icon" className="modal-icon" />
            <h2>สร้างโปรโมชั่นสำเร็จ</h2>
            <p>โปรโมชั่นส่วนลดนี้จะเริ่มเวลา 23-01-2025 14:00 และสิ้นสุดเวลา 30-01-2025 15:00</p>
            <div className="modal-button-group">
              <button onClick={handleCloseModal} className="modal-button">
                กลับไปยังรายการโปรโมชั่น
              </button>
              <button onClick={handleCloseModal} className="modal-button-alt">
                ดูรายละเอียด
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
