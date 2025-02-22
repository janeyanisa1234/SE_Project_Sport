"use client";
import "./Cash.css";
import "../Dashboard/slidebar.css";
import React, { useState } from "react";
import Sidebar from "../Dashboard/slidebar.js";
import Link from 'next/link';
import Tab from "../Tabbar/page.js";

export default function Manage_Cash() {
  const [statusFilter, setStatusFilter] = useState('all');
  const [month, setMonth] = useState('');
  const [year, setYear] = useState('');

  const Owners = [
    {
      id: 1,
      name: 'ภูรินันทร์ สิงห์เขา',
      incomeBefore: 400000,
      incomeAfter: 360000,
      bankAccount: '123-456-7890',
      status: 'โอนแล้ว',
      date: '28 กุมภาพันธ์ 2568',
    },
    {
      id: 2,
      name: 'วิชัย ทองห่อ',
      incomeBefore: 50000,
      incomeAfter: 45000,
      bankAccount: '234-567-8901',
      status: 'โอนแล้ว',
      date: '28 กุมภาพันธ์ 2568',
    },
    {
      id: 3,
      name: 'นพดล ป้องกัน',
      incomeBefore: 75000,
      incomeAfter: 67500,
      bankAccount: '345-678-9012',
      status: 'รอดำเนินการ',
      date: '28 กุมภาพันธ์ 2568',
    },
    {
      id: 4,
      name: 'ธนากร วัฒนา',
      incomeBefore: 120000,
      incomeAfter: 108000,
      bankAccount: '456-789-0123',
      status: 'รอดำเนินการ',
      date: '28 กุมภาพันธ์ 2568',
    },
  ];

  const handleStatusChange = (e) => {
    setStatusFilter(e.target.value);
  };

  const handleMonthChange = (e) => {
    setMonth(e.target.value);
  };

  const handleYearChange = (e) => {
    setYear(e.target.value);
  };

  // ฟิลเตอร์ข้อมูลตามสถานะ, เดือน, และปี
  const filteredOwners = Owners.filter((owner) => {
    const matchesStatus = statusFilter === 'all' || owner.status === statusFilter;
    const matchesMonth = !month || owner.date.includes(month);
    const matchesYear = !year || owner.date.includes(year);

    return matchesStatus && matchesMonth && matchesYear;
  });

  return (
    <>
      <Sidebar />
      <Tab />
      <br />
      <p className="summary">
        <img src="/pictureAdmin/Cash.svg" className="iconG" alt="group icon" />
        รายการโอนเงิน
      </p>
      <br />
      <div className="filter-container">
        <select className="sport" value={statusFilter} onChange={handleStatusChange}>
          <option value="all">ทั้งหมด</option>
          <option value="โอนแล้ว">โอนแล้ว</option>
          <option value="รอดำเนินการ">รอดำเนินการ</option>
        </select>
        <select className="sport" value={month} onChange={handleMonthChange}>
          <option value="">ทั้งหมด</option>
          <option value="01">มกราคม</option>
          <option value="02">กุมภาพันธ์</option>
          <option value="03">มีนาคม</option>
          <option value="04">เมษายน</option>
          <option value="05">พฤษภาคม</option>
          <option value="06">มิถุนายน</option>
          <option value="07">กรกฎาคม</option>
          <option value="08">สิงหาคม</option>
          <option value="09">กันยายน</option>
          <option value="10">ตุลาคม</option>
          <option value="11">พฤศจิกายน</option>
          <option value="12">ธันวาคม</option>
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
              <th>ชื่อผู้ประกอบการ</th>
              <th>รายได้</th>
              <th>วันที่สรุปยอด</th>
              <th>ข้อมูลบัญชีธนาคาร</th>
              <th>สถานะ</th>
            </tr>
          </thead>
          <tbody>
            {filteredOwners.map((owner) => (
              <tr key={owner.id}>
                <td>{owner.id}</td>
                <td>{owner.name}</td>
                <td>
                  <div>
                    <strong>รวม:</strong>{owner.incomeBefore} 
                  </div>
                  <div style={{ color: 'red' }}>
                  <strong>จ่าย:</strong>{owner.incomeAfter} 
                  </div>
                </td>
                <td>{owner.date}</td>
                <td>{owner.bankAccount}</td>
                <td className="status-cell">
                  {/* แสดงสถานะ */}
                  {owner.status === "โอนแล้ว" ? (
                    <div className="status approved">
                      <span>โอนแล้ว</span>
                    </div>
                  ) : (
                    <div className="status-container">
                      <div className="status pending">

                      <Link href="/Homeadmin/Manage_Cash/Pending" passHref>
                      <span>รอดำเนินการ</span>
                      </Link>
                      </div>
                    </div>
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
