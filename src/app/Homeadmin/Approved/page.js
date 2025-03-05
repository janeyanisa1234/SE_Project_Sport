"use client";
import "./Approved.css";
import "../Dashboard/slidebar.css";
import React, { useState, useEffect } from "react";
import Sidebar from "../Dashboard/slidebar.js";
import Tab from "../Tabbar/page.js";
import Image from "next/image";
import axios from 'axios';

export default function Dashboard() {
  const [filter, setFilter] = useState("all");
  const [fields, setFields] = useState([]);

  const filteredFields = fields.filter(
    (field) => filter === "all" || field.stadium_status === filter
  );

  useEffect(() => {
    fetchStadiums();
  }, []);

  const fetchStadiums = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/stadium/requests');
      const stadiums = response.data.map(stadium => ({
        id: stadium.id,
        owner: stadium.owner_name,
        fieldName: stadium.stadium_name,
        image: stadium.stadium_image || "/pictureAdmin/default.svg",
        location: stadium.stadium_address,
        status: stadium.stadium_status
      }));
      setFields(stadiums);
    } catch (error) {
      console.error('Error fetching stadiums:', error);
    }
  };

  const handleApprove = async (id) => {
    if (!id) {
      console.error('Invalid stadium ID');
      return;
    }
    try {
      await axios.put(`http://localhost:5000/api/stadium/status/${id}`, {
        status: 'อนุมัติแล้ว'
      });
      fetchStadiums();
    } catch (error) {
      console.error('Error approving stadium:', error.response ? error.response.data : error);
      alert(`เกิดข้อผิดพลาด: ${error.response ? error.response.data.error : 'ไม่สามารถอนุมัติสนามได้'}`);
    }
  };

  const handleReject = async (id) => {
    if (!id) {
      console.error('Invalid stadium ID');
      return;
    }
    try {
      await axios.put(`http://localhost:5000/api/stadium/status/${id}`, {
        status: 'ไม่อนุมัติ'
      });
      fetchStadiums();
    } catch (error) {
      console.error('Error rejecting stadium:', error.response ? error.response.data : error);
      alert(`เกิดข้อผิดพลาด: ${error.response ? error.response.data.error : 'ไม่สามารถปฏิเสธสนามได้'}`);
    }
  };

  return (
    <>
      <Sidebar />
      <Tab />
      <br />
      <p className="summary">
        <img src="/pictureAdmin/Frame.svg" className="iconG" alt="group icon" />
        รายการอนุมัติ
      </p>
      <br />
      <div className="filter-container">
        <select className="sport" value={filter} onChange={(e) => setFilter(e.target.value)}>
          <option value="all">ทั้งหมด</option>
          <option value="อนุมัติแล้ว">อนุมัติแล้ว</option>
          <option value="รออนุมัติ">รออนุมัติ</option>
          <option value="ไม่อนุมัติ">ไม่อนุมัติ</option>
        </select>
      </div>
      <div className="table-container">
        <table className="custom-table">
          <thead>
            <tr>
              <th>ลำดับ</th>
              <th>ชื่อผู้ประกอบการ</th>
              <th>สนาม</th>
              <th>ตำแหน่งที่ตั้ง</th>
              <th>สถานะ</th>
            </tr>
          </thead>
          <tbody>
            {filteredFields.map((field, index) => (
              <tr key={field.id || index}>
                <td>{index + 1}</td>
                <td>{field.owner}</td>
                <td className="image-cell">
                  <Image src={field.image} width={100} height={40} alt={field.fieldName} className="field-image" />
                  <p className="field-name">ชื่อ : {field.fieldName}</p>
                </td>
                <td>{field.location}</td>
                <td className="status-cell">
                  {field.status === "อนุมัติแล้ว" ? (
                    <div className="status approved">
                      <span>อนุมัติแล้ว</span>
                    </div>
                  ) : field.status === "ไม่อนุมัติ" ? (
                    <div className="status rejected">
                      <span>ไม่อนุมัติ</span>
                    </div>
                  ) : (
                    <div className="status-container">
                      <div className="status pending" onClick={() => handleApprove(field.id)}>
                        <Image src="/pictureAdmin/Check.svg" width={20} height={20} alt="อนุมัติ" />
                        <span>อนุมัติ</span>
                      </div>
                      <div className="status pending" onClick={() => handleReject(field.id)}>
                        <Image src="/pictureAdmin/Notcheck.svg" width={20} height={20} alt="ไม่อนุมัติ" />
                        <span>ไม่อนุมัติ</span>
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