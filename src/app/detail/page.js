"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Tabbar from "../components/tab";
import "./detail.css";
import next from "next";

export default function Home() {
  const router = useRouter();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const handleDetailClick = () => {
    router.push("/promotion");
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="background">
      <Tabbar/>

      <div className="header-title">
        <h1>รายละเอียดโปรโมชั่น</h1>
      </div>

      <div className="container">
        <div className="section-title">
          <h2>รายละเอียดเบื้องต้น</h2>
        </div>

        <div className="promo-info">
          <div className="info-row">
            <h3>ชื่อโปรโมชั่น :</h3>
            <h3 className="highlight-text">ตีเต็มแมทช์ ลดเต็มแม็กซ์</h3>
          </div>
          <div className="info-row">
            <h3>ระยะเวลาโปรโมชั่น :</h3>
            <h3 className="highlight-text">
              23-01-2025 14:00 - 30-01-2025 15:00
            </h3>
          </div>
        </div>

        <table className="promo-table">
          <thead>
            <tr>
              <th>ประเภทกีฬา</th>
              <th>ราคาเดิม</th>
              <th>ราคาโปรโมชั่น</th>
              <th>ส่วนลด</th>
              <th>จำกัดการจอง</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="table-center">
                <div className="sport-info">
                  <img src="/pictureowner/93.png" alt="sport-icon" className="sport-icon" />
                  <h4>แบดมินตัน</h4>
                </div>
              </td>
              <td className="table-center">฿150</td>
              <td className="table-center">฿135</td>
              <td className="table-center">10% ลด</td>
              <td className="table-center">ไม่จำกัดการจอง</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div className="button-container">
        <button className="back-button" onClick={handleDetailClick}>
          กลับไปยังรายการโปรโมชั่น
        </button>
      </div>
    </div>
  );
}
