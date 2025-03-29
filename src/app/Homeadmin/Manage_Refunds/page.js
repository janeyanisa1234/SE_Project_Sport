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
  const [selectedRefund, setSelectedRefund] = useState(null);

  const fetchData = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/cancleAdmin/cancle-booking');
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

  const handleStatusChange = (e) => setStatusFilter(e.target.value);
  const handleMonthChange = (e) => setMonth(e.target.value);
  const handleYearChange = (e) => setYear(e.target.value);

  const filteredOwners = owners.filter((owner) => {
    const matchesStatus = statusFilter === 'all' || owner.status_booking === statusFilter;
    const matchesMonth = !month || owner.date_play.includes(month);
    const matchesYear = !year || owner.date_play.includes(year);
    return matchesStatus && matchesMonth && matchesYear;
  });

  const handleRefundClick = async (owner) => {
    try {
      setSelectedRefund({
        slipUrl: owner.slipcancle,
        payDate: owner.refund_date,
        adminName: owner.admin_name
      });
    } catch (error) {
      console.error("Error preparing refund details:", error);
      setSelectedRefund({
        slipUrl: owner.slipcancle,
        payDate: null,
        adminName: null
      });
    }
  };

  const handleImageClick = (imageUrl) => {
    setSelectedRefund({
      slipUrl: imageUrl,
      payDate: null,
      adminName: null
    });
  };

  const closeModal = () => setSelectedRefund(null);

  return (
    <>
      <Sidebar />
      <Tab />
      <div className="header-titlerefund">
        <h1>รายการคำขอยกเลิก</h1>
      </div>
      <div className="filter-container">
        <select className="sport" value={statusFilter} onChange={handleStatusChange}>
          <option value="all">ทั้งหมด</option>
          <option value="ยกเลิกแล้ว">ยกเลิกแล้ว</option>
          <option value="รอดำเนินการยกเลิก">รอดำเนินการยกเลิก</option>
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
                  <p><span className="font-bold">ชื่อผู้จอง:</span> {owner.user_name}</p>
                  <p><span className="font-bold">ชื่อสนาม:</span> {owner.stadium_name}</p>
                  <p><span className="font-bold">ชนิดกีฬา:</span> {owner.court_type}</p>
                  <p><span className="font-bold">วันที่เล่น:</span> {owner.date_play}</p>
                  <p><span className="font-bold">เวลาที่เล่น:</span> {owner.time_slot}</p>
                </td>
                <td style={{ fontWeight: 'bold' }}>{owner.totalPrice}</td>
                <td className="account-info">
                  <p><span className="font-bold">ชื่อบัญชี:</span> {owner.user_name}</p>
                  <p><span className="font-bold">ชื่อธนาคาร:</span> {owner.bank}</p>
                  <p><span className="font-bold">เลขที่บัญชี:</span> {owner.bank_number}</p>
                  <p><span className="font-bold">เหตุผลการยกเลิก:</span> {owner.reasoncancle}</p>
                  <button
                    onClick={() => handleImageClick(owner.bankimages)}
                    className="view-image-btn"
                  >
                    ดูรูปสมุดบัญชี
                  </button>
                </td>
                <td className="status-cell">
  {owner.status_booking === "รอดำเนินการยกเลิก" ? (
    <div className="status-pending">
      <Link href={`/Homeadmin/Manage_Refunds/Pending?id=${owner.id_booking}`}>
        <span style={{ color: 'black', textDecoration: 'underline' }}>{owner.status_booking}</span>
      </Link>
    </div>
  ) : (
    <div className="status-cancelled">
      <span
        onClick={owner.slipcancle ? () => handleRefundClick(owner) : null}
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

      {selectedRefund && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="close-btn" onClick={closeModal}>X</button>
            <img src={selectedRefund.slipUrl} alt="Evidence" className="modal-image" />
            {selectedRefund.payDate && selectedRefund.adminName && (
              <div className="refund-details" style={{ padding: '15px', textAlign: 'center' }}>
                <p><strong>วันที่โอน:</strong> {new Date(selectedRefund.payDate).toLocaleDateString('th-TH')}</p>
                <p><strong>เวลา:</strong> {new Date(selectedRefund.payDate).toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit' })}</p>
                <p><strong>ผู้ดำเนินการ:</strong> {selectedRefund.adminName}</p>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}