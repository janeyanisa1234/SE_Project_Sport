"use client";
import "./Refund.css";
import "../Dashboard/slidebar.css";
import React, { useState, useEffect } from "react";
import Sidebar from "../Dashboard/slidebar.js";
import Tab from "../Tabbar/page.js";
import Link from "next/link";
import axios from "axios";

export default function Manage_Refunds() {
  const [statusFilter, setStatusFilter] = useState('all');
  const [month, setMonth] = useState('');
  const [year, setYear] = useState('');
  const [owners, setOwners] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState('');

  const fetchData = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/cancle/cancle-booking');
      if (response.data && response.data.data) {
        setOwners(response.data.data);
      } else {
        console.error("Data not found:", response.data);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleStatusChange = (e) => {
    setStatusFilter(e.target.value);
  };

  const handleMonthChange = (e) => {
    setMonth(e.target.value);
  };

  const handleYearChange = (e) => {
    setYear(e.target.value);
  };

  const filteredOwners = owners.filter((owner) => {
    const matchesStatus = statusFilter === 'all' || owner.status_booking === statusFilter;
    const matchesMonth = !month || owner.date_play.includes(month);
    const matchesYear = !year || owner.date_play.includes(year);
    return matchesStatus && matchesMonth && matchesYear;
  });

  const openModal = (imageUrl) => {
    setSelectedImage(imageUrl);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedImage('');
  };

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
          <option value="ยกเลิกแล้ว">ยกเลิกแล้ว</option>
          <option value="รอดำเนินการยกเลิก">รอดำเนินการยกเลิก</option>
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
            {filteredOwners.length > 0 && filteredOwners.map((owner, index) => (
              <tr key={owner.id_booking}>
                <td>{index + 1}</td>
                <td className="booking-details">
                  <p>ชื่อผู้จอง: {owner.user_name}</p>
                  <p>ชื่อสนาม: {owner.stadium_name}</p>
                  <p>ชนิดกีฬา: {owner.court_type}</p>
                  <p>วันที่เล่น: {owner.date_play}</p>
                  <p>เวลาที่เล่น: {owner.time_slot}</p>
                </td>
                <td>{owner.totalPrice}</td>
                <td className="account-info">
                  <p>ธนาคาร: {owner.bank}</p>
                  <p>หมายเลขบัญชี: {owner.bank_number}</p>
                  <p>เหตุผลการยกเลิก: {owner.reasoncancle}</p>
                  <button
                    onClick={() => openModal(owner.bankimages)}
                    className="view-image-btn"
                  >
                    ดูรูปสมุดบัญชี
                  </button>
                </td>
                <td className="status-cell">
                  {owner.status_booking === "รอดำเนินการยกเลิก" ? (
                    <Link href={`/Homeadmin/Manage_Refunds/Pending?id=${owner.id_booking}`}>
                      <span className="status-link">{owner.status_booking}</span>
                    </Link>
                  ) : (
                    <div>
                      <span
                        className="status-cancelled"
                        onClick={owner.slipcancle ? () => openModal(owner.slipcancle) : null}
                        style={{ cursor: owner.slipcancle ? 'pointer' : 'default' }}
                      >
                        {owner.status_booking}
                      </span>
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {isModalOpen && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="close-btn" onClick={closeModal}>X</button>
            <img src={selectedImage} alt="Evidence" className="modal-image" />
          </div>
        </div>
      )}
    </>
  );
}