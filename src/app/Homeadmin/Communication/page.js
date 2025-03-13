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
  const [itemsPerPage, setItemsPerPage] = useState(-1); // ค่าเริ่มต้นเป็น "แสดงทั้งหมด"

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

  // กรองและเรียงข้อมูลตาม created_at จากล่าสุดไปเก่าสุด
  const filteredMembers = members
    .filter((member) =>
      member.name.toLowerCase().includes(search.toLowerCase())
    )
    .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
    .slice(0, itemsPerPage === -1 ? undefined : itemsPerPage); // ถ้าเป็น -1 แสดงทั้งหมด

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
        <select
          value={itemsPerPage}
          onChange={(e) => setItemsPerPage(Number(e.target.value))}
        >
          <option value={-1}>ทั้งหมด</option>
          <option value={10}> 10 รายการ</option>
          <option value={20}> 20 รายการ</option>
          <option value={50}> 50 รายการ</option>
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
                  <a
                    href={`mailto:${member.email}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="email-link"
                  >
                    {member.email}
                    <img
                      src="/pictureAdmin/email.svg"
                      className="email-icon"
                      alt="Email Icon"
                    />
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