"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Tabbar from "../components/tab";
import axios from "axios";
import "./addedit.css";

export default function AddEdit() {
  const [selectedCount, setSelectedCount] = useState(0);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const [sports, setSports] = useState([]);
  const [discount, setDiscount] = useState(0); // รับส่วนลดจาก query

  useEffect(() => {
    // ดึงข้อมูลกีฬาจาก API (สมมติว่ามี endpoint /api/sports)
    const fetchSports = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/sports");
        setSports(response.data);
      } catch (error) {
        console.error("Error fetching sports:", error);
        alert("เกิดข้อผิดพลาดในการดึงข้อมูลกีฬา");
      }
    };

    // รับ discount จาก query
    const discountParam = parseFloat(searchParams.get("discount")) || 0;
    setDiscount(discountParam);

    fetchSports();
  }, [searchParams]);

  const handleCheckboxChange = (event, index) => {
    setSelectedCount((prevCount) =>
      event.target.checked ? prevCount + 1 : prevCount - 1
    );
  };

  const handleConfirm = () => {
    const checkedSports = sports
      .filter((_, index) => document.getElementById(`checkbox-${index}`).checked)
      .map((sport) => ({
        name: sport.name,
        price: sport.price,
        discountPrice: Math.round(sport.price * (1 - discount / 100)),
        stadiumName: sport.stadiumName,
        image: `/pictureowner/${sport.name.toLowerCase().replace(" ", "")}.png`, // ตรวจสอบ path
      }));
  
    const query = `?promotionName=${encodeURIComponent(searchParams.get("promotionName") || "")}&startDate=${encodeURIComponent(searchParams.get("startDate") || "")}&startTime=${encodeURIComponent(searchParams.get("startTime") || "")}&endDate=${encodeURIComponent(searchParams.get("endDate") || "")}&endTime=${encodeURIComponent(searchParams.get("endTime") || "")}&discount=${encodeURIComponent(discount)}&discountLimit=${encodeURIComponent(searchParams.get("discountLimit") || "")}&location=${encodeURIComponent(searchParams.get("location") || "")}&sports=${encodeURIComponent(JSON.stringify(checkedSports))}`;
    router.push(`/edit${query}`);
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div>
      <Tabbar />
      <div className="header-title">
        <h1>เพิ่มกีฬา</h1>
      </div>
      <div className="container">
        <div className="table-wrapper">
          <table>
            <thead>
              <tr>
                <th>เลือก</th>
                <th>ประเภทกีฬา</th>
                <th>ราคา</th>
                <th>ราคา (หลังหักส่วนลด)</th>
              </tr>
            </thead>
            <tbody>
              {sports.length > 0 ? (
                sports.map((sport, index) => (
                  <tr key={index}>
                    <td>
                      <input
                        type="checkbox"
                        id={`checkbox-${index}`}
                        name={`checkbox-${index}`}
                        onChange={(e) => handleCheckboxChange(e, index)}
                      />
                    </td>
                    <td className="sport-cell">
                      <img
                        src={sport.image || "/pictureowner/default.png"}
                        alt={sport.name}
                        className="sport-icon"
                      />
                      <span>{sport.name}</span>
                    </td>
                    <td>฿{sport.price}</td>
                    <td>฿{Math.round(sport.price * (1 - discount / 100))}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4">กำลังโหลดข้อมูลกีฬา...</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        <div className="bottom-bar">
          <p>{selectedCount} เลือกแล้ว</p>
          <button className="confirm-button" onClick={handleConfirm}>
            ยืนยัน
          </button>
        </div>
      </div>
    </div>
  );
}