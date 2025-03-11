"use client";
import Sidebar from "../Dashboard/slidebar.js";
import Tab from "../Tabbar/page.js";
import "./Commu.css";
import React, { useState, useEffect } from "react";
import axios from "axios";

export default function Communication() {
  const [search, setSearch] = useState("");
  const [memberType, setMemberType] = useState("all");
  const [members, setMembers] = useState([]);

  // ดึงข้อมูลจาก Backend
  useEffect(() => {
    const fetchUsers = async () => {
      let url = "http://localhost:5000/api/users";

      // กรองข้อมูลตามประเภทผู้ใช้
      if (memberType === "user") {
        url = "http://localhost:5000/api/users/regular"; // API สำหรับผู้ใช้ทั่วไป
      } else if (memberType === "business") {
        url = "http://localhost:5000/api/users/owners"; // API สำหรับผู้ประกอบการ
      }

      try {
        const response = await axios.get(url);
        setMembers(response.data);
      } catch (error) {
        console.error("เกิดข้อผิดพลาดในการดึงข้อมูล:", error);
      }
    };

    fetchUsers();
  }, [memberType]); // โหลดใหม่เมื่อเปลี่ยนประเภทผู้ใช้

  // กรองข้อมูลตามคำค้นหา (ชื่อ)
  const filteredMembers = members.filter((member) =>
    member.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <>
      <Sidebar />
      <Tab />
      <div className="header-titlecommu">
        <h1>การสื่อสาร</h1>
      </div>
      <div className="filter-container">
        <select value={memberType} onChange={(e) => setMemberType(e.target.value)}>
          <option value="all">ทั้งหมด</option>
          <option value="user">ผู้ใช้</option>
          <option value="business">ผู้ประกอบการ</option>
        </select>
        <input
          type="text"
          placeholder="ค้นหาด้วยชื่อ"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* แสดงตารางข้อมูล */}
      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>ลำดับ</th>
              <th>สถานะ</th>
              <th>ข้อมูลสมาชิก</th>
              <th>เบอร์โทร</th>
              <th>อีเมล(email)</th>
            </tr>
          </thead>
          <tbody>
            {filteredMembers.map((member, index) => (
              <tr key={index}>
                <td>{index + 1}</td>
                <td>{member.role}</td>
                <td>{member.name}</td>
                <td>{member.phone || "N/A"}</td>
                <td className="icon">
                  <a href={`mailto:${member.email}`} target="_blank" rel="noopener noreferrer" className="email-link">
                    {member.email}
                    <img src="/pictureAdmin/email.svg" className="email-icon" alt="Email Icon" />
                  </a>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
