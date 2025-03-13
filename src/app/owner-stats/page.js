'use client';

import React, { useState, useEffect } from 'react';
import { 
  PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, 
  CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line 
} from 'recharts';
import { DollarSign, Activity, AlertCircle, CheckCircle } from 'lucide-react';
import Tabbar from "../components/tab";
import axios from "axios";
import "./dash.css";

const Dashboard = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [stats, setStats] = useState({
    totalRevenue: 0,
    bookingRate: 0,
    successfulBookings: 0,
    cancellations: 0,
    mostBookedCourt: { name: 'N/A', count: 0 },
    leastBookedCourt: { name: 'N/A', count: 0 },
    mostBookedSport: { name: 'N/A', count: 0 },
    highestRevenueSport: { name: 'N/A', revenue: 0 },
    monthlyTrends: [], // Empty array as default
    yoyGrowth: 0,
  });
  const [filter, setFilter] = useState({ timeRange: '', month: '', year: '' });

  useEffect(() => {
    fetchDashboardData();
  }, [filter]);

  const fetchDashboardData = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const token = localStorage.getItem("token") || "your-test-token-here";
      let userId = localStorage.getItem("userId") || null;

      if (!userId) {
        const possibleKeys = ["user_id", "owner_id", "ownerId"];
        for (const key of possibleKeys) {
          userId = localStorage.getItem(key);
          if (userId) break;
        }
      }

      if (!userId) {
        throw new Error("กรุณาล็อกอินเพื่อดูข้อมูลแดชบอร์ด: ไม่พบ userId ใน localStorage");
      }

      const response = await axios.get("http://localhost:5000/api/owner-stats", {
        params: { 
          userId,
          timeRange: filter.timeRange || undefined,
          month: filter.month || undefined,
          year: filter.year || undefined,
        },
        headers: { Authorization: `Bearer ${token}` },
      });

      setStats({
        totalRevenue: response.data.totalRevenue || 0,
        bookingRate: response.data.bookingRate || 0,
        successfulBookings: response.data.successfulBookings || 0,
        cancellations: response.data.cancellations || 0,
        mostBookedCourt: response.data.mostBookedCourt || { name: 'N/A', count: 0 },
        leastBookedCourt: response.data.leastBookedCourt || { name: 'N/A', count: 0 },
        mostBookedSport: response.data.mostBookedSport || { name: 'N/A', count: 0 },
        highestRevenueSport: response.data.highestRevenueSport || { name: 'N/A', revenue: 0 },
        monthlyTrends: response.data.monthlyTrends || [],
        yoyGrowth: response.data.yoyGrowth || 0,
      });
    } catch (error) {
      console.error('Error fetching data:', error);
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const colors = ['#FF6B8A', '#6BA5FF', '#2563EB', '#48BB78', '#8B5CF6'];

  // Skeleton placeholder for charts when data is empty
  const renderChartPlaceholder = () => (
    <div className="chart-placeholder" style={{ height: 300, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#999' }}>
      ไม่มีข้อมูลสำหรับแสดง
    </div>
  );

  return (
    <div className="dashboard-wrapper">
      <Tabbar />
      <div className="dashboard-container">
        <h1 className="dashboard-title">ติดตามการใช้งานสนาม อัตราการจอง และแนวโน้มทางธุรกิจของคุณ</h1>

        {isLoading && (
          <div className="loading">
            <svg className="spinner" viewBox="0 0 24 24">
              <circle className="spinner-path" cx="12" cy="12" r="10" />
            </svg>
            กำลังโหลดข้อมูล...
          </div>
        )}
        {error && (
          <div className="error-message">
            เกิดข้อผิดพลาด: {error}
          </div>
        )}

        {/* Filters */}
        <div className="filter-container">
          <select
            value={filter.timeRange}
            onChange={(e) => setFilter({ ...filter, timeRange: e.target.value, month: '', year: '' })}
            className="filter-select"
          >
            <option value="">เลือกช่วงเวลา</option>
            <option value="today">วันนี้</option>
            <option value="last7days">7 วันล่าสุด</option>
            <option value="lastmonth">1 เดือนล่าสุด</option>
          </select>
          <select
            value={filter.month}
            onChange={(e) => setFilter({ ...filter, month: e.target.value, timeRange: '' })}
            disabled={filter.timeRange}
            className="filter-select"
          >
            <option value="">ทุกเดือน</option>
            {['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12'].map((month) => (
              <option key={month} value={month}>
                {new Date(0, month - 1).toLocaleString('th-TH', { month: 'long' })}
              </option>
            ))}
          </select>
          <select
            value={filter.year}
            onChange={(e) => setFilter({ ...filter, year: e.target.value, timeRange: '' })}
            disabled={filter.timeRange}
            className="filter-select"
          >
            <option value="">ทุกปี</option>
            {[2567, 2568, 2569].map((year) => (
              <option key={year} value={year}>{year}</option>
            ))}
          </select>
        </div>

        {/* Main Stats */}
        <div className="stats-grid">
          <div className="stats-card revenue">
            <div className="stats-content">
              <p className="stats-label">รายได้รวม</p>
              <div className="stats-value">
                <DollarSign className="stats-icon" />
                <span>฿{stats.totalRevenue.toLocaleString()}</span>
              </div>
            </div>
          </div>
          <div className="stats-card rate">
            <div className="stats-content">
              <p className="stats-label">อัตราการจอง</p>
              <div className="stats-value">
                <Activity className="stats-icon" />
                <span>{stats.bookingRate.toFixed(1)}%</span>
              </div>
            </div>
          </div>
          <div className="stats-card success">
            <div className="stats-content">
              <p className="stats-label">การจองสำเร็จ</p>
              <div className="stats-value">
                <CheckCircle className="stats-icon" />
                <span>{stats.successfulBookings}</span>
              </div>
            </div>
          </div>
          <div className="stats-card cancel">
            <div className="stats-content">
              <p className="stats-label">การยกเลิก</p>
              <div className="stats-value">
                <AlertCircle className="stats-icon" />
                <span>{stats.cancellations}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Court Analysis */}
        <div className="analysis-grid">
          <div className="stats-card">
            <p className="analysis-label">สนามที่ถูกใช้เยอะที่สุด</p>
            <p className="analysis-value">{stats.mostBookedCourt.name} ({stats.mostBookedCourt.count} ครั้ง)</p>
          </div>
          <div className="stats-card">
            <p className="analysis-label">สนามที่ถูกใช้น้อยที่สุด</p>
            <p className="analysis-value">{stats.leastBookedCourt.name} ({stats.leastBookedCourt.count} ครั้ง)</p>
          </div>
        </div>

        {/* Sport Analysis */}
        <div className="analysis-grid">
          <div className="stats-card">
            <p className="analysis-label">กีฬายอดนิยม</p>
            <p className="analysis-value">{stats.mostBookedSport.name} ({stats.mostBookedSport.count} ครั้ง)</p>
          </div>
          <div className="stats-card">
            <p className="analysis-label">กีฬาที่สร้างรายได้สูงสุด</p>
            <p className="analysis-value">{stats.highestRevenueSport.name} (฿{stats.highestRevenueSport.revenue.toLocaleString()})</p>
          </div>
        </div>

        {/* Monthly Bookings Chart */}
        <div className="chart-container">
          <p className="chart-label">การจองรายเดือน</p>
          <div className="chart-wrapper">
            {stats.monthlyTrends.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={stats.monthlyTrends}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="bookings" fill="#2563EB" />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              renderChartPlaceholder()
            )}
          </div>
        </div>

        {/* Year-over-Year Comparison */}
        <div className="chart-container">
          <p className="chart-label">เปรียบเทียบปีต่อปี</p>
          <p className="chart-value">การเติบโต: {stats.yoyGrowth}%</p>
          <div className="chart-wrapper">
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={[{ year: '2567', bookings: 5 }, { year: '2568', bookings: 5 + stats.yoyGrowth / 100 * 5 }]}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="year" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="bookings" stroke="#48BB78" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;