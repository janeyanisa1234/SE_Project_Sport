"use client";
import "./Cash.css";
import "../Dashboard/slidebar.css";
import React, { useState, useEffect } from "react";
import Sidebar from "../Dashboard/slidebar.js";
import Link from 'next/link';
import Tab from "../Tabbar/page.js";
import axios from 'axios';

export default function Manage_Cash() {
  const [statusFilter, setStatusFilter] = useState('all');
  const [month, setMonth] = useState('');
  const [year, setYear] = useState('');
  const [owners, setOwners] = useState([]);
  const [selectedImage, setSelectedImage] = useState(null);

  useEffect(() => {
    async function fetchCashData() {
      try {
        const response = await axios.get('http://localhost:5000/api/cashUpdate/update-cash');
        setOwners(response.data);
      } catch (error) {
        console.error('Error fetching cash data:', error);
      }
    }

    fetchCashData();
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
    const matchesStatus = statusFilter === 'all' || owner.status === statusFilter;
    const matchesMonth = !month || owner.date.includes(month);
    const matchesYear = !year || owner.date.includes(year);

    return matchesStatus && matchesMonth && matchesYear;
  });

  const handleImageClick = (imageUrl) => {
    setSelectedImage(imageUrl);
  };

  const closeModal = () => {
    setSelectedImage(null);
  };

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
            {filteredOwners.map((owner, index) => (
              <tr key={owner.id_owner}>
                <td>{index + 1}</td> 
                <td>{owner.user_name}</td>
                <td>
                  <div>
                    <strong>รวม:</strong>{owner.totalIncome}
                  </div>
                  <div style={{ color: 'red' }}>
                    <strong>จ่าย:</strong>{owner.incomeAfter}
                  </div>
                </td>
                <td>{owner.date}</td>
                <td>
                  <div className="account-info">
                    <strong>ชื่อบัญชี:</strong> {owner.user_name} <br />
                    <strong>ชื่อธนาคาร:</strong> {owner.bank_name} <br />
                    <strong>เลขที่บัญชี:</strong> {owner.bank_account} <br />
                    {owner.status === "โอนแล้ว" ? (
                      <>
                        <button onClick={() => handleImageClick(owner.identity_card_url)} className="view-image-btn">
                          ดูรูปบัญชี
                        </button>
                      </>
                    ) : (
                      <button onClick={() => handleImageClick(owner.identity_card_url)} className="view-image-btn">
                        ดูรูปบัญชี
                      </button>
                    )}
                  </div>
                </td>
                <td className="status-cell">
                  {owner.status === "โอนแล้ว" ? (
                    <div className="status approved">
                      <span>โอนแล้ว</span>
                    </div>
                  ) : (
                    <div className="status-container">
                      <div className="status pending">
                        <Link 
                          href={{
                            pathname: "/Homeadmin/Manage_Cash/Pending",
                            query: { 
                              id_owner: owner.id_owner,
                              user_name: owner.user_name,
                              bank_name: owner.bank_name,
                              bank_account: owner.bank_account,
                              date: owner.date
                            }
                          }}
                          passHref
                        >
                          <span>รอดำเนินการ</span>
                        </Link>
                      </div>
                    </div>
                  )}
                  {owner.status === "โอนแล้ว" && (
                    <>
                      <button onClick={() => handleImageClick(owner.slip_url)} className="view-image-btn">
                        ดูสลิปโอนเงิน
                      </button>
                    </>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {selectedImage && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="close-btn" onClick={closeModal}>X</button>
            <img src={selectedImage} alt="รูปภาพ" className="modal-image" />
          </div>
        </div>
      )}
    </>
  );
}
