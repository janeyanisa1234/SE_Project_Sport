"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Tabbar from "../components/tab";
import axios from "axios";
import "./add.css";

export default function Add() {
  const [sports, setSports] = useState([]);
  const [selectedCount, setSelectedCount] = useState(0);
  const [stadiumName, setStadiumName] = useState("ไม่ระบุ");
  const router = useRouter();
  const searchParams = useSearchParams();
  const stadiumId = searchParams.get("location");
  const discount = parseFloat(searchParams.get("discount")) || 0;
  const initialSelectedSports = JSON.parse(decodeURIComponent(searchParams.get("sports") || "[]")); // ดึงกีฬาที่เคยเลือก

  useEffect(() => {
    if (stadiumId) {
      fetchSports();
    } else {
      console.error("No stadiumId provided in query");
      alert("ไม่พบข้อมูลสนาม กรุณาเลือกสนามจากหน้า Create Promotion ก่อน");
      router.push("/create-promotion");
    }
  }, [stadiumId, router]);

  const fetchSports = async () => {
    try {
      console.log("Fetching sports for stadiumId:", stadiumId);
      const response = await axios.get(`http://localhost:5000/api/sports?stadiumId=${stadiumId}`);
      console.log("Sports response:", response.data);
      if (Array.isArray(response.data) && response.data.length > 0) {
        // ผสานข้อมูลกีฬากับสถานะที่เคยเลือก
        const updatedSports = response.data.map((sport) => {
          const isSelected = initialSelectedSports.some(
            (selected) => selected.name === sport.name && selected.stadiumId === sport.stadiumId
          );
          return {
            ...sport,
            checked: isSelected, // เพิ่ม property เพื่อระบุว่าเลือกแล้ว
          };
        });
        setSports(updatedSports);
        setSelectedCount(initialSelectedSports.length); // ตั้งค่าเริ่มต้นตามจำนวนที่เคยเลือก
        setStadiumName(response.data[0].stadiumName || "ไม่ระบุ");
      } else {
        setSports([]);
        console.warn("No sports found for stadiumId:", stadiumId);
        alert("ไม่พบกีฬาสำหรับสนามนี้ กรุณาตรวจสอบข้อมูลในฐานข้อมูล");
      }
    } catch (error) {
      console.error("Detailed error fetching sports:", {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
      });
      alert("เกิดข้อผิดพลาดในการดึงข้อมูลกีฬา: " + (error.response?.data?.error || error.message));
    }
  };

  const handleCheckboxChange = (event, index) => {
    const updatedSports = sports.map((sport, i) =>
      i === index ? { ...sport, checked: event.target.checked } : sport
    );
    setSports(updatedSports);
    setSelectedCount((prevCount) =>
      event.target.checked ? prevCount + 1 : prevCount - 1
    );
  };

  const handleConfirm = () => {
    const checkedSports = sports
      .filter((sport) => sport.checked)
      .map((sport) => ({
        name: sport.name,
        price: sport.price,
        discountPrice: calculateDiscountPrice(sport.price),
        stadiumId: sport.stadiumId,
      }));

    if (checkedSports.length === 0) {
      alert("กรุณาเลือกกีฬาอย่างน้อย 1 รายการ");
      return;
    }

    const query = `?promotionName=${encodeURIComponent(searchParams.get("promotionName") || "")}&startDate=${encodeURIComponent(searchParams.get("startDate") || "")}&startTime=${encodeURIComponent(searchParams.get("startTime") || "")}&endDate=${encodeURIComponent(searchParams.get("endDate") || "")}&endTime=${encodeURIComponent(searchParams.get("endTime") || "")}&discount=${encodeURIComponent(searchParams.get("discount") || "")}&location=${encodeURIComponent(stadiumId || "")}&sports=${encodeURIComponent(JSON.stringify(checkedSports))}`;
    router.push(`/create-promotion${query}`);
  };

  const calculateDiscountPrice = (price) => {
    const discountPercentage = discount / 100;
    return Math.round(price * (1 - discountPercentage));
  };

  return (
    <div className="background">
      <Tabbar />
      <div className="header-title">
        <h1>เพิ่มกีฬา</h1>
      </div>
      <div className="container">
        <div className="debug-info">
          <p><span className="label">ชื่อสนาม</span> <span className="value">{stadiumName}</span></p>
          <p><span className="label">ส่วนลด</span> <span className="value">{discount}%</span></p>
        </div>
        <div className="table-wrapper">
          <table>
            <thead>
              <tr>
                <th>เลือก</th>
                <th>ประเภทกีฬา</th>
                <th>ราคา</th>
                <th>ราคาหลังลด</th>
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
                        checked={sport.checked || false} // ตั้งค่า checked จาก state
                        onChange={(e) => handleCheckboxChange(e, index)}
                      />
                    </td>
                    <td className="sport-cell">
                      <span>{sport.name}</span>
                    </td>
                    <td>฿{sport.price}</td>
                    <td>฿{calculateDiscountPrice(sport.price)}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4">ไม่พบกีฬาสำหรับสนามนี้</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        <div className="bottom-bar">
          <p>{selectedCount} รายการที่เลือก</p>
          <button className="confirm-button" onClick={handleConfirm}>
            ยืนยัน
          </button>
        </div>
      </div>
    </div>
  );
}