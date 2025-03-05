"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Tabbar from "../components/tab";
import axios from "axios";
import "./add.css";

export default function Add() {
  const [sports, setSports] = useState([]);
  const [selectedCount, setSelectedCount] = useState(0);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const discount = parseFloat(searchParams.get("discount")) || 0; // รับส่วนลดจาก query

  useEffect(() => {
    fetchSports();
  }, []);

  const fetchSports = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/sports");
      setSports(response.data);
      console.log("Fetched sports:", response.data);
    } catch (error) {
      console.error("Error fetching sports:", error.response || error);
      alert("เกิดข้อผิดพลาดในการดึงข้อมูลกีฬา: " + (error.response?.data?.error || error.message));
    }
  };

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
        price: sport.price, // เก็บราคาเดิมไว้สำหรับการคำนวณในอนาคต
        discountPrice: calculateDiscountPrice(sport.price), // ราคาหลังหักส่วนลด
        stadiumName: sport.stadiumName,
      }));
    const query = `?promotionName=${encodeURIComponent(searchParams.get("promotionName") || "")}&startDate=${encodeURIComponent(searchParams.get("startDate") || "")}&startTime=${encodeURIComponent(searchParams.get("startTime") || "")}&endDate=${encodeURIComponent(searchParams.get("endDate") || "")}&endTime=${encodeURIComponent(searchParams.get("endTime") || "")}&discount=${encodeURIComponent(searchParams.get("discount") || "")}&discountLimit=${encodeURIComponent(searchParams.get("discountLimit") || "")}&location=${encodeURIComponent(searchParams.get("location") || "")}&sports=${encodeURIComponent(JSON.stringify(checkedSports))}`;
    router.push(`/create-promotion${query}`);
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  // คำนวณราคาหลังหักส่วนลดตาม discount จาก CreatePromotion
  const calculateDiscountPrice = (price) => {
    const discountPercentage = discount / 100;
    return Math.round(price * (1 - discountPercentage));
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
                <th>สนาม</th>
                <th>ราคา</th>
                <th>ราคา (หลังหักส่วนลด)</th>
              </tr>
            </thead>
            <tbody>
              {sports.map((sport, index) => (
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
                    <img src={sport.image} alt={sport.name} className="sport-icon" />
                    <span>{sport.name}</span>
                  </td>
                  <td>{sport.stadiumName}</td>
                  <td>฿{sport.price}</td>
                  <td>฿{calculateDiscountPrice(sport.price)}</td>
                </tr>
              ))}
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