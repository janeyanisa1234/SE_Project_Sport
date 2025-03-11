"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Tabbar from "../components/tab";
import axios from "axios";
import "./add.css";

// Component หลักสำหรับเพิ่มกีฬาในโปรโมชัน
export default function Add() {
  // Hooks การนำทางและพารามิเตอร์
  const router = useRouter(); // อินสแตนซ์ของ router
  const searchParams = useSearchParams(); // ดึง query parameters

  // ค่าพารามิเตอร์เริ่มต้นจาก URL
  const stadiumId = searchParams.get("location"); // ดึง ID สนาม
  const discount = parseFloat(searchParams.get("discount")) || 0; // ดึงส่วนลด
  const initialSelectedSports = JSON.parse(decodeURIComponent(searchParams.get("sports") || "[]")); // ดึงกีฬาที่เคยเลือก

  // State การจัดการข้อมูลและ UI
  const [sports, setSports] = useState([]); // เก็บรายการกีฬา
  const [selectedCount, setSelectedCount] = useState(0); // จำนวนกีฬาที่เลือก
  const [stadiumName, setStadiumName] = useState("ไม่ระบุ"); // ชื่อสนาม

  // Effect hook สำหรับโหลดข้อมูลกีฬาเมื่อเริ่มต้น
  useEffect(() => {
    const token = localStorage.getItem("token"); // ดึง token
    if (!token) {
      alert("กรุณาเข้าสู่ระบบก่อนเพิ่มกีฬา"); // แจ้งเตือนถ้าไม่มี token
      router.push("/Login"); // ไปหน้า login
      return;
    }

    if (!stadiumId) { // ตรวจสอบ stadiumId
      console.error("No stadiumId provided"); // log ถ้าไม่มี ID
      alert("ไม่พบข้อมูลสนาม"); // แจ้งเตือน
      router.push("/create-promotion"); // ไปหน้าสร้างโปรโมชัน
      return;
    }

    fetchSports(token); // ดึงข้อมูลกีฬา
  }, [stadiumId, router]);

  // ฟังก์ชันดึงข้อมูลกีฬาจาก API
  const fetchSports = async (token) => {
    try {
      console.log("Fetching sports for stadiumId:", stadiumId); // log การดึงข้อมูล
      const response = await axios.get(`http://localhost:5000/api/sports?stadiumId=${stadiumId}`, {
        headers: { Authorization: `Bearer ${token}` }, // header สำหรับ API
      });

      console.log("Sports response:", response.data); // log ข้อมูลที่ได้
      if (Array.isArray(response.data) && response.data.length > 0) {
        const updatedSports = response.data.map((sport) => { // ผสานข้อมูลกีฬากับสถานะที่เลือก
          const isSelected = initialSelectedSports.some(
            (selected) => selected.name === sport.name && selected.stadiumId === sport.stadiumId
          );
          return { ...sport, checked: isSelected }; // เพิ่ม property checked
        });
        setSports(updatedSports); // อัปเดต state
        setSelectedCount(initialSelectedSports.length); // ตั้งจำนวนที่เลือกเริ่มต้น
        setStadiumName(response.data[0].stadiumName || "ไม่ระบุ"); // ตั้งชื่อสนาม
      } else {
        setSports([]); // รีเซ็ตถ้าไม่มีข้อมูล
        console.warn("No sports found for stadiumId:", stadiumId); // log คำเตือน
        alert("ไม่พบกีฬาสำหรับสนามนี้"); // แจ้งเตือน
      }
    } catch (error) {
      console.error("Fetch error:", error.message, error.response?.data); // log ข้อผิดพลาด
      if (error.response?.status === 401) { // ถ้า token หมดอายุ
        alert("เซสชันหมดอายุ"); // แจ้งเตือน
        router.push("/Login"); // ไปหน้า login
      } else {
        alert("เกิดข้อผิดพลาด: " + (error.response?.data?.error || error.message)); // แจ้งเตือนข้อผิดพลาดอื่น
      }
    }
  };

  // ฟังก์ชันคำนวณราคาหลังลด
  const calculateDiscountPrice = (price) => {
    const discountPercentage = discount / 100; // คำนวณเปอร์เซ็นต์ส่วนลด
    return Math.round(price * (1 - discountPercentage)); // คืนค่าราคาหลังลด
  };

  // ฟังก์ชันจัดการการเปลี่ยนแปลงและการนำทาง
  const handleCheckboxChange = (event, index) => { // อัปเดต checkbox
    const updatedSports = sports.map((sport, i) =>
      i === index ? { ...sport, checked: event.target.checked } : sport // อัปเดตเฉพาะกีฬาที่เลือก
    );
    setSports(updatedSports); // อัปเดต state
    setSelectedCount((prevCount) => (event.target.checked ? prevCount + 1 : prevCount - 1)); // อัปเดตจำนวน
  };

  const handleConfirm = () => { // ยืนยันการเลือก
    const checkedSports = sports
      .filter((sport) => sport.checked) // กรองกีฬาที่เลือก
      .map((sport) => ({
        name: sport.name, // ชื่อกีฬา
        price: sport.price, // ราคา
        discountPrice: calculateDiscountPrice(sport.price), // ราคาหลังลด
        stadiumId: sport.stadiumId, // ID สนาม
      }));

    if (checkedSports.length === 0) { // ตรวจสอบการเลือก
      alert("กรุณาเลือกกีฬาอย่างน้อย 1 รายการ"); // แจ้งเตือนถ้าไม่เลือก
      return;
    }

    const query = `?promotionName=${encodeURIComponent(searchParams.get("promotionName") || "")}&startDate=${encodeURIComponent(searchParams.get("startDate") || "")}&startTime=${encodeURIComponent(searchParams.get("startTime") || "")}&endDate=${encodeURIComponent(searchParams.get("endDate") || "")}&endTime=${encodeURIComponent(searchParams.get("endTime") || "")}&discount=${encodeURIComponent(searchParams.get("discount") || "")}&location=${encodeURIComponent(stadiumId || "")}&sports=${encodeURIComponent(JSON.stringify(checkedSports))}`; // สร้าง query string
    router.push(`/create-promotion${query}`); // ไปหน้าสร้างโปรโมชันพร้อมข้อมูล
  };

  // ส่วนแสดงผล UI
  return (
    <div className="background">
      <Tabbar />
      <div className="add-header-title">
        <h1>เพิ่มกีฬา</h1>
      </div>
      <div className="add-container">
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