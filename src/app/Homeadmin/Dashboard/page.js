"use client";
import "./dash.css";
import "./slidebar.css";
import React, { useState, useEffect, useRef } from "react";
import Sidebar from "./slidebar.js";
import Tab from "../Tabbar/page.js";
import axios from "axios";
import { Bar, Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(CategoryScale, LinearScale, BarElement, LineElement, PointElement, Title, Tooltip, Legend);

export default function Dashboard() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [statistics, setStatistics] = useState({
    totalCount: 0,
    ownerCount: 0,
    regularCount: 0,
    ownerPercentage: 0,
    regularPercentage: 0,
    totalPercentage: 0,
  });
  const [revenue, setRevenue] = useState({
    totalRevenue: 0,
    platformFee: 0,
    netRevenue: 0,
    revenueByOwner: {},
  });
  const [newUsersToday, setNewUsersToday] = useState({ total: 0, regular: 0, owners: 0 });
  const [filterMonth, setFilterMonth] = useState("");
  const [filterYear, setFilterYear] = useState("");
  const [newUsersTrend, setNewUsersTrend] = useState([]);
  const [revenueTrend, setRevenueTrend] = useState([]);
  const barChartRef = useRef(null);
  const lineChartRef = useRef(null);

  const fetchStatistics = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/users/statistics", {
        params: { month: filterMonth, year: filterYear },
      });
      setStatistics(response.data);
    } catch (error) {
      console.error("เกิดข้อผิดพลาดในการดึงข้อมูลสถิติ: ", error);
    }
  };

  const fetchRevenue = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/users/revenue", {
        params: { month: filterMonth, year: filterYear },
      });
      setRevenue(response.data);
    } catch (error) {
      console.error("เกิดข้อผิดพลาดในการดึงข้อมูลรายได้: ", error);
    }
  };

  const fetchNewUsersToday = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/users/new-today", {
        params: { month: filterMonth, year: filterYear },
      });
      setNewUsersToday(response.data.data);
    } catch (error) {
      console.error("เกิดข้อผิดพลาดในการดึงข้อมูลผู้ใช้ใหม่: ", error);
    }
  };

  const fetchNewUsersTrend = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/users/new-users-trend", {
        params: { month: filterMonth, year: filterYear },
      });
      setNewUsersTrend(response.data);
    } catch (error) {
      console.error("เกิดข้อผิดพลาดในการดึงข้อมูลแนวโน้มผู้ใช้: ", error);
    }
  };

  const fetchRevenueTrend = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/users/revenue-trend", {
        params: { month: filterMonth, year: filterYear },
      });
      setRevenueTrend(response.data);
    } catch (error) {
      console.error("เกิดข้อผิดพลาดในการดึงข้อมูลแนวโน้มรายได้: ", error);
    }
  };

  useEffect(() => {
    fetchStatistics();
    fetchRevenue();
    fetchNewUsersToday();
    fetchNewUsersTrend();
    fetchRevenueTrend();
  }, [filterMonth, filterYear]);

  // Resize handling for charts
  useEffect(() => {
    const handleResize = () => {
      if (barChartRef.current?.chartInstance) {
        barChartRef.current.chartInstance.resize();
      }
      if (lineChartRef.current?.chartInstance) {
        lineChartRef.current.chartInstance.resize();
      }
    };

    window.addEventListener("resize", handleResize);
    handleResize(); // Initial resize
    return () => window.removeEventListener("resize", handleResize);
  }, [newUsersTrend, revenueTrend]);

  const barData = {
    labels: newUsersTrend.map((item) => item.date),
    datasets: [
      {
        label: "ผู้ใช้ใหม่",
        data: newUsersTrend.map((item) => item.total),
        backgroundColor: "#2563eb",
        borderColor: "#1e40af",
        borderWidth: 1,
      },
    ],
  };

  const barOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: "top", labels: { color: "#1e293b" } },
      title: { display: true, text: "แนวโน้มผู้ใช้ใหม่", color: "#1e293b", font: { size: 18 } },
    },
    scales: {
      y: { beginAtZero: true, ticks: { color: "#64748b" } },
      x: { ticks: { color: "#64748b" } },
    },
  };

  const lineData = {
    labels: revenueTrend.map((item) => item.date),
    datasets: [
      {
        label: "รายได้สุทธิ",
        data: revenueTrend.map((item) => item.netRevenue),
        fill: false,
        borderColor: "#16a34a",
        tension: 0.4,
        pointBackgroundColor: "#16a34a",
      },
    ],
  };

  const lineOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: "top", labels: { color: "#1e293b" } },
      title: { display: true, text: "แนวโน้มรายได้", color: "#1e293b", font: { size: 18 } },
    },
    scales: {
      y: { beginAtZero: true, ticks: { color: "#64748b" } },
      x: { ticks: { color: "#64748b" } },
    },
  };

  return (
    <>
    <Sidebar />
    <Tab />
    <div className="header-titledash">
        <h1>แดชบอร์ด</h1>
      </div>
    <div className="dashboard">
      
        <div className="dashboard-container">
          <div className="filter-section">
            <div className="filter-item">
              <select
                value={filterMonth}
                onChange={(e) => setFilterMonth(e.target.value)}
                className="filter-select"
              >
                <option value="">ทุกเดือน</option>
                {Array.from({ length: 12 }, (_, i) => (
                  <option key={i + 1} value={i + 1}>
                    {new Date(0, i).toLocaleString("th-TH", { month: "long" })}
                  </option>
                ))}
              </select>
            </div>
            <div className="filter-item">
              <select
                value={filterYear}
                onChange={(e) => setFilterYear(e.target.value)}
                className="filter-select"
              >
                <option value="">ทุกปี</option>
                {Array.from({ length: 5 }, (_, i) => (
                  <option key={i} value={2025 + i}>
                    {2025 + i}
                  </option>
                ))}
              </select>
            </div>
            <button
              onClick={() => {
                setFilterMonth("");
                setFilterYear("");
              }}
              className="reset-button"
            >
              รีเซ็ต
            </button>
          </div>

          <section className="data-section users-section">
            <h2>ข้อมูลผู้ใช้งาน</h2>
            <div className="data-row">
              <div className="data-item">
                <span className="label">ทั้งหมด</span>
                <span className="value">{statistics.totalCount.toLocaleString()}</span>
                <span className="subtext">100%</span>
              </div>
              <div className="data-item">
                <span className="label">ผู้ประกอบการ</span>
                <span className="value">{statistics.ownerCount.toLocaleString()}</span>
                <span className="subtext">{statistics.ownerPercentage.toFixed(1)}%</span>
              </div>
              <div className="data-item">
                <span className="label">ผู้ใช้ทั่วไป</span>
                <span className="value">{statistics.regularCount.toLocaleString()}</span>
                <span className="subtext">{statistics.regularPercentage.toFixed(1)}%</span>
              </div>
            </div>
          </section>

          <section className="data-section revenue-section">
            <h2>ข้อมูลรายได้</h2>
            <div className="data-row">
              <div className="data-item">
                <span className="label">รายได้รวม</span>
                <span className="value">{revenue.totalRevenue.toLocaleString()} บาท</span>
              </div>
              <div className="data-item">
                <span className="label">ค่าบริการ (10%)</span>
                <span className="value">{revenue.platformFee.toLocaleString()} บาท</span>
              </div>
              <div className="data-item">
                <span className="label">รายได้สุทธิ</span>
                <span className="value">{revenue.netRevenue.toLocaleString()} บาท</span>
              </div>
            </div>
          </section>

          <section className="data-section new-users-section">
            <h2>ข้อมูลผู้ใช้ใหม่</h2>
            <div className="data-row">
              <div className="data-item">
                <span className="label">ทั้งหมด</span>
                <span className="value">{newUsersToday.total.toLocaleString()}</span>
              </div>
              <div className="data-item">
                <span className="label">ผู้ประกอบการ</span>
                <span className="value">{newUsersToday.owners.toLocaleString()}</span>
              </div>
              <div className="data-item">
                <span className="label">ผู้ใช้ทั่วไป</span>
                <span className="value">{newUsersToday.regular.toLocaleString()}</span>
              </div>
            </div>
            <div className="chart-container">
              <Bar ref={barChartRef} data={barData} options={barOptions} />
            </div>
          </section>

          <section className="data-section revenue-trend-section">
            <h2>แนวโน้มรายได้</h2>
            <div className="chart-container">
              <Line ref={lineChartRef} data={lineData} options={lineOptions} />
            </div>
          </section>
        </div>
      
    </div>
    </>
  );
}