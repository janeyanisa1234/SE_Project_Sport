"use client";
import "./Refund.css";
import "../Dashboard/slidebar.css";
import React, { useState, useEffect } from "react";
import Sidebar from "../Dashboard/slidebar.js";
import Link from 'next/link';
import Tab from "../Tabbar/page.js";
import Image from "next/image";
import axios from 'axios';  // Import Axios

export default function Manage_Cash() {
  const [statusFilter, setStatusFilter] = useState('all');
  const [month, setMonth] = useState('');
  const [year, setYear] = useState('');
  const [owners, setOwners] = useState([]);  // State to store fetched owners data

  // Fetch data from the backend
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/cancleAdmin/bookings');
        setOwners(response.data);
      } catch (error) {
        console.error("Error fetching bookings:", error.response || error.message);
      }
    };
    

    fetchData();
  }, []); // Empty dependency array ensures this runs once on mount

  const handleStatusChange = (e) => {
    setStatusFilter(e.target.value);
  };

  const handleMonthChange = (e) => {
    setMonth(e.target.value);
  };

  const handleYearChange = (e) => {
    setYear(e.target.value);
  };

  const handleApprove = (id) => {
    console.log(`อนุมัติคำขอสำหรับ ID: ${id}`);
    // Call backend API to approve the request
  };

  // ฟิลเตอร์ข้อมูลตามสถานะ, เดือน, และปี
  const filteredOwners = owners.filter((owner) => {
    const matchesStatus = statusFilter === 'all' || owner.status_booking === statusFilter;
    const matchesMonth = !month || owner.name.includes(month);
    const matchesYear = !year || owner.name.includes(year);

    return matchesStatus && matchesMonth && matchesYear;
  });

  return (
    <>
      <Sidebar />
      <Tab />
      <br />
      <p className="summary">
        <img src="/pictureAdmin/Cash.svg" className="iconG" alt="group icon" />
        รายการคำขอ
      </p>
      <br />
      <div className="filter-container">
        <select className="sport" value={statusFilter} onChange={handleStatusChange}>
          <option value="all">ทั้งหมด</option>
          <option value="โอนแล้ว">โอนแล้ว</option>
          <option value="รอคืนเงิน">รอคืนเงิน</option>
          <option value="ไม่อนุมัติคำขอ">ไม่อนุมัติคำขอ</option>
        </select>
        <select className="sport" value={month} onChange={handleMonthChange}>
          <option value="">ทั้งหมด</option>
          <option value="02">กุมภาพันธ์</option>
          <option value="03">มีนาคม</option>
          <option value="04">เมษายน</option>
        </select>
        <select className="sport" value={year} onChange={handleYearChange}>
          <option value="">ทั้งหมด</option>
          <option value="2568">2568</option>
          <option value="2569">2569</option>
          <option value="2570">2570</option>
        </select>
      </div>
      <div className="table-container">
        <table className="custom-table">
          <thead>
            <tr>
              <th>ลำดับ</th>
              <th>รายละเอียดการจอง</th>
              <th>ยอดคืน</th>
              <th>ข้อมูลบัญชีธนาคาร</th>
              <th>สถานะ</th>
            </tr>
          </thead>
          <tbody>
            {filteredOwners.map((owner) => (
              <tr key={owner.id}>
                <td>{owner.id}</td>
                <td style={{ whiteSpace: "pre-line" }}>{owner.name}</td>
                <td>{owner.Price}</td>
                <td>{owner.bankAccount}</td>
                <td className="status-cell">
                  {owner.status_booking === 'รออนุมัติ' ? (
                    <div className="status-container">
                      <div className="status pending" onClick={() => handleApprove(owner.id)}>
                        <Image src="/pictureAdmin/Check.svg" width={20} height={20} alt="อนุมัติ" />
                        <span>อนุมัติคำขอ</span>
                      </div>
                      <div className="status pending">
                        <Image src="/pictureAdmin/Notcheck.svg" width={20} height={20} alt="ไม่อนุมัติ" />
                        <span>ไม่อนุมัติคำขอ</span>
                      </div>
                    </div>
                  ) : (
                    <span>{owner.status_booking}</span>  // Display the current status if not 'รออนุมัติ'
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
