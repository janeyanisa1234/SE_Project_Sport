"use client";
import "./Cash.css";
import "../Dashboard/slidebar.css";
import React, { useState, useEffect } from "react";
import Sidebar from "../Dashboard/slidebar.js";
import Link from "next/link";
import Tab from "../Tabbar/page.js";
import axios from "axios";

// ฟังก์ชันแปลงวันที่ภาษาไทยเป็น Date object
const monthNames = {
  "มกราคม": 0, "กุมภาพันธ์": 1, "มีนาคม": 2, "เมษายน": 3, "พฤษภาคม": 4, "มิถุนายน": 5,
  "กรกฎาคม": 6, "สิงหาคม": 7, "กันยายน": 8, "ตุลาคม": 9, "พฤศจิกายน": 10, "ธันวาคม": 11
};

const parseThaiDate = (dateString) => {
  const [day, month, year] = dateString.split(" ");
  const dayNum = parseInt(day, 10);
  const monthNum = monthNames[month];
  const yearBE = parseInt(year, 10);
  const yearAD = yearBE - 543;
  return new Date(yearAD, monthNum, dayNum);
};

export default function Manage_Cash() {
  const [statusFilter, setStatusFilter] = useState("all");
  const [month, setMonth] = useState("");
  const [year, setYear] = useState("");
  const [owners, setOwners] = useState([]);
  const [selectedTransfer, setSelectedTransfer] = useState(null);

  useEffect(() => {
    async function fetchCashData() {
      try {
        const response = await axios.get("http://localhost:5000/api/cashUpdate/update-cash");
        const sortedData = response.data.sort((a, b) => parseThaiDate(b.date) - parseThaiDate(a.date));
        setOwners(sortedData);
      } catch (error) {
        console.error("Error fetching cash data:", error);
      }
    }
    fetchCashData();
  }, []);

  const handleStatusChange = (e) => setStatusFilter(e.target.value);
  const handleMonthChange = (e) => setMonth(e.target.value);
  const handleYearChange = (e) => setYear(e.target.value);

  const filteredOwners = owners.filter((owner) => {
    const date = parseThaiDate(owner.date);
    const ownerMonth = (date.getMonth() + 1).toString().padStart(2, "0");
    const ownerYear = (date.getFullYear() + 543).toString();

    const matchesStatus = statusFilter === "all" || owner.status === statusFilter;
    const matchesMonth = !month || ownerMonth === month;
    const matchesYear = !year || ownerYear === year;

    return matchesStatus && matchesMonth && matchesYear;
  });

  const handleTransferClick = async (owner) => {
    try {
      // ดึงข้อมูลเพิ่มเติมจาก API
      const response = await axios.get(`http://localhost:5000/api/cashUpdate/transfer-details/${owner.id_owner}`, {
        params: { date: owner.date }
      });
      setSelectedTransfer({
        slipUrl: owner.slip_url,
        payDate: response.data.paydate,
        adminName: response.data.nameadmin
      });
    } catch (error) {
      console.error("Error fetching transfer details:", error);
      setSelectedTransfer({
        slipUrl: owner.slip_url,
        payDate: null,
        adminName: null
      });
    }
  };

  const closeModal = () => setSelectedTransfer(null);

  return (
    <>
      <Sidebar />
      <Tab />
      <div className="header-titlecash">
        <h1>รายการโอนเงิน</h1>
      </div>
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
            {filteredOwners.map((owner, index) => (
              <tr key={owner.id_owner}>
                <td>{index + 1}</td>
                <td>{owner.user_name}</td>
                <td>
                  <div><strong>รวม:</strong> {owner.totalIncome}</div>
                  <div style={{ color: "red" }}><strong>จ่าย:</strong> {owner.incomeAfter}</div>
                </td>
                <td>{owner.date}</td>
                <td>
                  <div className="account-info">
                    <strong>ชื่อบัญชี:</strong> {owner.user_name} <br />
                    <strong>ชื่อธนาคาร:</strong> {owner.bank_name} <br />
                    <strong>เลขที่บัญชี:</strong> {owner.bank_account} <br />
                    <button onClick={() => setSelectedTransfer({ slipUrl: owner.identity_card_url })} className="view-image-btn">
                      ดูรูปบัญชี
                    </button>
                  </div>
                </td>
                <td className="status-cell">
                  {owner.status === "โอนแล้ว" ? (
                    <div className="status-approved">
                      <span onClick={() => handleTransferClick(owner)} style={{ cursor: "pointer" }}>
                        โอนแล้ว
                      </span>
                    </div>
                  ) : (
                    <div className="status-container">
                      <div className="status-pending">
                        <Link href={{ pathname: "/Homeadmin/Manage_Cash/Pending", query: { id_owner: owner.id_owner, user_name: owner.user_name, bank_name: owner.bank_name, bank_account: owner.bank_account, date: owner.date } }} passHref>
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
      {selectedTransfer && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="close-btn" onClick={closeModal}>X</button>
            <img src={selectedTransfer.slipUrl} alt="รูปภาพ" className="modal-image" />
            {selectedTransfer.payDate && selectedTransfer.adminName && (
              <div className="transfer-details" style={{ padding: '15px', textAlign: 'center' }}>
                <p><strong>วันที่โอน:</strong> {new Date(selectedTransfer.payDate).toLocaleDateString('th-TH')}</p>
                <p><strong>เวลา:</strong> {new Date(selectedTransfer.payDate).toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit' })}</p>
                <p><strong>ผู้ดำเนินการ:</strong> {selectedTransfer.adminName}</p>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}