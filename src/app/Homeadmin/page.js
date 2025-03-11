"use client";
import "./home.css";
import "./Dashboard/slidebar.css";
import React, { useState, useEffect } from "react"; 
import Sidebar from "./Dashboard/slidebar.js"; 
import Tab from "./Tabbar/page";
import { Bar } from "react-chartjs-2";  
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from "chart.js";
import axios from "axios";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

export default function Dashboard() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [newUsers, setNewUsers] = useState({ total: 0, regular: 0, owners: 0 });

  const closeSidebar = () => setIsSidebarOpen(false);

  // ดึงข้อมูลผู้ใช้ใหม่วันนี้จาก API ด้วย axios
  useEffect(() => {
    const fetchNewUsers = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/users/new-users-today"); // เปลี่ยนเป็น /new-users-today
        setNewUsers(response.data); // ปรับตามโครงสร้างจาก routesJane/users.js
      } catch (error) {
        console.error("Error fetching new users with axios:", error);
      }
    };
    fetchNewUsers();
  }, []);

  const chartData = {
    labels: ["ผู้ใช้ทั้งหมด", "ผู้ใช้ทั่วไป", "ผู้ประกอบการ"],
    datasets: [
      {
        label: "จำนวนผู้ใช้ใหม่วันนี้",
        data: [newUsers.total, newUsers.regular, newUsers.owners],
        backgroundColor: ["#4BC0C0", "#36A2EB", "#FF6384"],
        borderColor: ["#4BC0C0", "#36A2EB", "#FF6384"],
        borderWidth: 1,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: "top" },
      title: { display: true, text: "จำนวนผู้ใช้ใหม่วันนี้" },
    },
    scales: {
      y: { beginAtZero: true },
    },
  };

  // ไม่จำเป็นต้องยิง event resize ซ้ำ เพราะ Chart.js responsive อยู่แล้ว
  // ถ้าต้องการควบคุมเพิ่มเติม สามารถใช้ state หรือ ref ได้
  useEffect(() => {
    // ไม่ต้องทำอะไรเพิ่มเติม เพราะ responsive: true จัดการให้แล้ว
  }, []);

  return (
    <>
      <Tab />
      <Sidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />
      <br/>
      <p className="summary">
        <img src="/pictureAdmin/mapeo.svg" className="iconG" alt="group icon" />
        ผู้ใช้ใหม่วันนี้
      </p>
      <br/>
      <div className="dashboard-container">
        <div className="stats-container">
          <div className="stat-box">
            <h3>{newUsers.total}</h3>
            <p>ผู้ใช้ใหม่ทั้งหมด</p>
            <span className="percentage positive">+{((newUsers.total / (newUsers.total || 1)) * 100).toFixed(1)}%</span>
          </div>
          <div className="stat-box">
            <h3>{newUsers.regular}</h3>
            <p>ผู้ใช้ทั่วไปใหม่</p>
            <span className="percentage positive">+{((newUsers.regular / (newUsers.total || 1)) * 100).toFixed(1)}%</span>
          </div>
          <div className="stat-box">
            <h3>{newUsers.owners}</h3>
            <p>ผู้ประกอบการใหม่</p>
            <span className="percentage positive">+{((newUsers.owners / (newUsers.total || 1)) * 100).toFixed(1)}%</span>
          </div>
        </div>

        {/* กราฟ */}
        <div className="chart-container">
          <Bar data={chartData} options={chartOptions} />
        </div>
      </div>
    </>
  );
}