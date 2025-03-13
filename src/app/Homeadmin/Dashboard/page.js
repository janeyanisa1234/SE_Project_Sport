"use client";
import "./dash.css";
import "./slidebar.css";
import React, { useState, useEffect, useRef } from "react";
import Sidebar from "./slidebar.js";
import Tab from "../Tabbar/page.js";
import axios from "axios";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(CategoryScale, LinearScale, BarElement, PointElement, Title, Tooltip, Legend);

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
  const [bookingSummary, setBookingSummary] = useState({
    confirmed: 0,
    cancelled: 0,
    pendingCancel: 0,
    confirmedPercentage: 0,
    cancelledPercentage: 0,
    pendingCancelPercentage: 0,
    totalBookings: 0,
  });
  const [filterMonth, setFilterMonth] = useState("");
  const [filterYear, setFilterYear] = useState("");
  const [newUsersTrend, setNewUsersTrend] = useState([]);
  const barChartRef = useRef(null);

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
      console.log("Sending revenue request with filters:", { month: filterMonth, year: filterYear });
      const response = await axios.get("http://localhost:5000/api/users/revenue", {
        params: { month: filterMonth, year: filterYear },
      });
      console.log("Revenue response:", response.data);
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

  const fetchBookingSummary = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/users/booking-summary", {
        params: { month: filterMonth, year: filterYear },
      });
      const { confirmed, cancelled, pendingCancel, totalBookings } = response.data;
      setBookingSummary({
        confirmed,
        cancelled,
        pendingCancel,
        confirmedPercentage: totalBookings > 0 ? (confirmed / totalBookings) * 100 : 0,
        cancelledPercentage: totalBookings > 0 ? (cancelled / totalBookings) * 100 : 0,
        pendingCancelPercentage: totalBookings > 0 ? (pendingCancel / totalBookings) * 100 : 0,
        totalBookings,
      });
    } catch (error) {
      console.error("เกิดข้อผิดพลาดในการดึงข้อมูลสรุปการจอง: ", error);
    }
  };

  useEffect(() => {
    fetchStatistics();
    fetchRevenue();
    fetchNewUsersToday();
    fetchNewUsersTrend();
    fetchBookingSummary();
  }, [filterMonth, filterYear]);

  useEffect(() => {
    const handleResize = () => {
      if (barChartRef.current?.chartInstance) {
        barChartRef.current.chartInstance.resize();
      }
    };
    window.addEventListener("resize", handleResize);
    handleResize();
    return () => window.removeEventListener("resize", handleResize);
  }, [newUsersTrend]);

  const barData = {
    labels: newUsersTrend.map((item) => item.date),
    datasets: [
      {
        label: "ผู้ใช้ใหม่",
        data: newUsersTrend.map((item) => item.total),
        backgroundColor: "rgba(59, 130, 246, 0.7)",
        borderColor: "#3b82f6",
        borderWidth: 1,
        borderRadius: 8,
      },
    ],
  };

  const barOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: "top", labels: { color: "#334155", font: { size: 14 } } },
      title: { display: true, text: "แนวโน้มผู้ใช้ใหม่", color: "#1e293b", font: { size: 20, weight: "600" } },
      tooltip: { backgroundColor: "#1e293b", titleFont: { size: 14 }, bodyFont: { size: 12 } },
    },
    scales: {
      y: { beginAtZero: true, ticks: { color: "#64748b", font: { size: 12 } }, grid: { color: "#e2e8f0" } },
      x: { ticks: { color: "#64748b", font: { size: 12 } }, grid: { display: false } },
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
              {/*เดือน */}
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
              {/*ปี */}
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

          <div className="data-grid">
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

            <section className="data-section booking-summary-section">
              <h2>สรุปยอดการจอง</h2>
              <div className="data-row">
                <div className="data-item">
                  <span className="label">ทั้งหมด</span>
                  <span className="value purple-text">{bookingSummary.totalBookings.toLocaleString()}</span>
                  <span className="subtext">100%</span>
                </div>
                <div className="data-item">
                  <span className="label">จองสำเร็จ</span>
                  <span className="value purple-text">{bookingSummary.confirmed.toLocaleString()}</span>
                  <span className="subtext">{bookingSummary.confirmedPercentage.toFixed(1)}%</span>
                </div>
                <div className="data-item">
                  <span className="label">ถูกยกเลิก</span>
                  <span className="value purple-text">{bookingSummary.cancelled.toLocaleString()}</span>
                  <span className="subtext">{bookingSummary.cancelledPercentage.toFixed(1)}%</span>
                </div>
                <div className="data-item">
                  <span className="label">รอดำเนินการยกเลิก</span>
                  <span className="value purple-text">{bookingSummary.pendingCancel.toLocaleString()}</span>
                  <span className="subtext">{bookingSummary.pendingCancelPercentage.toFixed(1)}%</span>
                </div>
              </div>
            </section>
          </div>
        </div>
      </div>
    </>
  );
}