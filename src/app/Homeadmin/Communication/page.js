"use client";
import Sidebar from "../Dashboard/slidebar.js";
import Tab from "../Tabbar/page.js";
import "./Commu.css";
import React, { useState } from "react";

const members = [
  { id: "U001", name: "ภูรินดินทร์ สิงเดชา", type: "user", role: "ผู้ประกอบการ", phone: "0824538934", email: "xxxxx@gmail.com" },
  { id: "B001", name: "ณัฐฐา นามเมือง", type: "business", role: "ผู้ใช้", phone: "0647891234", email:"n.nutta3010@gmail.com"},
  { id: "U002", name: "สมชาย รุ่งเจริญ", type: "user", role: "ผู้ใช้", phone: "0653748926", email: "xxxxx@gmail.com" },
  { id: "B002", name: "สมหมาย เมืองพล", type: "business", role: "ผู้ประกอบการ", phone: "0856473219", email: "xyz@gmail.com" },
  { id: "U003", name: "สมปอง ปักษา", type: "user", role: "ผู้ใช้", phone: "0942798908", email: "xxxxx@gmail.com" },
];


export default function Communication() {
  const [search, setSearch] = useState("");
  const [memberType, setMemberType] = useState("all");

  const filteredMembers = members.filter((member) =>
    (memberType === "all" || member.type === memberType) &&
    member.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <>
      <Sidebar />
      <Tab />
      <br />
      <p className="summary">
        <img src="/pictureAdmin/Commu.svg" className="iconG" alt="group icon" />
        การสื่อสาร
      </p>
      <br/>
      <div className="filter-container">
        <select value={memberType} onChange={(e) => setMemberType(e.target.value)}>
          <option value="all">ทั้งหมด</option>
          <option value="user">ผู้ใช้</option>
          <option value="business">ผู้ประกอบการ</option>
        </select>
        <input type="text" placeholder="ค้นหาด้วยชื่อ" value={search} onChange={(e) => setSearch(e.target.value)}/>
      </div>
      
      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>รหัส</th>
              <th>สถานะ</th>
              <th>ข้อมูลสมาชิก</th>
              <th>เบอร์โทร</th>
              <th>อีเมล(email)</th>
            </tr>
          </thead>
          <tbody>
            {filteredMembers.map((member) => (
              <tr key={member.id}>
                <td>{member.id}</td>
                <td>{member.role}</td> 
                <td>{member.name}</td>
                <td>{member.phone}</td>
                <td className="icon">
                {member.email}
                <a href={`mailto:${member.email}`} target="_blank" rel="noopener noreferrer">
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