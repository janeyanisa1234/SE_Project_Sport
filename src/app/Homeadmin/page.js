"use client";
import "./home.css";
import "./Dashboard/slidebar.css";
import React, { useState, useEffect } from "react"; 
import Sidebar from "./Dashboard/slidebar.js"; 
import Tab from "./Tabbar/page";
import { Bar } from "react-chartjs-2";  
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from "chart.js";


ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

export default function Dashboard() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false); 

  const closeSidebar = () => {
    setIsSidebarOpen(false);
  };

  // ข้อมูลที่ใช้สำหรับกราฟแท่ง
  const data = {
    labels: ['ฟุตบอล', 'บาสเกตบอล', 'วอลเลย์บอล', 'เทนนิส', 'แบดมินตัน','ปิงปอง','ฟิตเนต'],  // ตัวอย่างหมวดหมู่ของประเภทสนามกีฬา
    datasets: [
      {
        label: 'จำนวนการจอง',
        data: [120, 90, 80, 70, 60,30,40],  // จำนวนสนามกีฬาที่แต่ละประเภท
        backgroundColor: 'rgba(75, 192, 192, 0.2)', // สีของกราฟ
        borderColor: 'rgba(75, 192, 192, 1)',  // สีขอบกราฟ
        borderWidth: 1, 
      },
    ],
  };

  const options = {
    responsive: true,  
    maintainAspectRatio: false,  // กำหนดให้สามารถขยาย/ย่อได้ตามขนาดหน้าจอ
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'กราฟแสดงจำนวนการจองแต่ละประเภท',
      },
    },
  };

  // Hook เพื่อจัดการกับการ resize ของหน้าจอ
  useEffect(() => {
    const handleResize = () => {
      // เมื่อขนาดหน้าจอเปลี่ยนแปลงจะบังคับให้ chart.js รีเฟรชกราฟ
      window.dispatchEvent(new Event("resize"));
    };
    
    window.addEventListener("resize", handleResize);
    
    // Cleanup event listener เมื่อ component ถูกลบออกจาก DOM
    return () => window.removeEventListener("resize", handleResize);
  }, []);
  
  return (
    <>
    <Tab/>
      <Sidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />
      
      <br />
      <p className="summary">
        <img src="/pictureAdmin/iconG.svg" className="iconG" alt="icon" />
        สรุปผลวันนี้
      </p>

      <div className="container3">
        <div className="box">
          <p style={{ color: "blue", fontWeight: "bold" }}>XXXX</p>
          <p style={{ color: "red" }}>XX%</p>
          จำนวน
        </div>
        <div className="box">
          <p style={{ color: "#1B9FEC", fontWeight: "bold" }}>XXXX</p>
          <p style={{ color: "red" }}>XX%</p>
          จำนวน
        </div>
        <div className="box">
          <p style={{ color: "#1B9FEC", fontWeight: "bold" }}>XXXX</p>
          <p style={{ color: "red" }}>XX%</p>
          จำนวน
        </div>
      </div>

      <div className="container2">
        <div className="box2">
          {/* แสดงกราฟแท่ง */}
          <Bar data={data} options={options} />
        </div>
      </div>

    </>
  );
}
