"use client";
import "./Refund.css";
import "../Dashboard/slidebar.css";
import React, { useState } from "react";
import Sidebar from "../Dashboard/slidebar.js";
import Link from 'next/link';
import Tab from "../Tabbar/page.js";
import Image from "next/image";

export default function Manage_Cash() {
  const [statusFilter, setStatusFilter] = useState('all');
  const [month, setMonth] = useState('');
  const [year, setYear] = useState('');

  // ข้อมูลตัวอย่าง 3 ชุด
  const Owners = [
    {
      id: 1,
      name: "สนาม AVOCADO\nฟุตบอล\n12 ก.พ. 2568 10:00",
      Price: "2,000",
      bankAccount: "ธนาคารไทยพาณิชย์ - 123-456-7890 - นาย กิตติพงศ์ ใจดี",
      status: "รอดำเนินการ",
    },
    {
      id: 2,
      name: "สนาม AVOCADO\nแบดมินตัน\n5 มี.ค. 2568 15:30",
      Price: "200",
      bankAccount: "ธนาคารกรุงไทย - 987-654-3210 - นางสาว พรทิพย์ สายทอง",
      status: "รอดำเนินการ",
    },
    {
      id: 3,
      name: "สนาม AVOCADO\nเทนนิส\n20 เม.ย. 2568 18:45",
      Price: "250",
      bankAccount: "ธนาคารกสิกรไทย - 456-789-1234 - นาย สมชาย ทองดี",
      status: "รอดำเนินการ",
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

  const handleApprove = (id) => {
    console.log(`อนุมัติคำขอสำหรับ ID: ${id}`);
  };

  // ฟิลเตอร์ข้อมูลตามสถานะ, เดือน, และปี
  const filteredOwners = Owners.filter((owner) => {
    const matchesStatus = statusFilter === 'all' || owner.status === statusFilter;
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
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
