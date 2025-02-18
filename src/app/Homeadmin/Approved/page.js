"use client";
import "./Approved.css";
import "../Dashboard/slidebar.css";
import React, { useState } from "react";
import Sidebar from "../Dashboard/slidebar.js";
import Tab from "../Tabbar/page.js";
import Image from "next/image";

export default function Dashboard() {
  
  const [filter, setFilter] = useState("all");

  // Change fields to a state variable
  const [fields, setFields] = useState([
    {
      id: 1,
      owner: "ไกรวิชญ์ ไพศาร",
      fieldName: "BOWIN AREANA",
      image: "/pictureAdmin/Bowin.svg",
      location: "196 หมู่ 6 ต.ทุ่งสุขลา อ.ศรีราชา จ.ชลบุรี 20230",
      status: "pending",
    },
    {
      id: 2,
      owner: "ปุณรินทร์ เคหพฤกษ์",
      fieldName: "LABUBOO",
      image: "/pictureAdmin/Labuboo.svg",
      location: "112 หมู่ 1 ต.ทุ่งสุขลา อ.ศรีราชา จ.ชลบุรี 20230",
      status: "approved",
    },
  ]);

  const filteredFields = fields.filter(
    (field) => filter === "all" || field.status === filter
  );

  // Correct the handleApprove function
  const handleApprove = (id) => {
    setFields(fields.map((field) =>
      field.id === id ? { ...field, status: "approved" } : field
    ));
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
          <option value="approved">อนุมัติแล้ว</option>
          <option value="pending">รออนุมัติ</option>
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
              <tr key={field.id}>
                <td>{index + 1}</td> 
                <td>{field.owner}</td>
                <td className="image-cell">
                  <Image src={field.image} width={100} height={40} alt={field.fieldName} className="field-image" />
                  <p className="field-name">ชื่อ : {field.fieldName}</p>
                </td>
                <td>{field.location}</td>
                <td className="status-cell">
                  {field.status === "approved" ? (
                    <div className="status approved">
                      <span>อนุมัติแล้ว</span>
                    </div>
                  ) : (
                    <div className="status-container">
                      <div className="status pending" onClick={() => handleApprove(field.id)}>
                        <Image src="/pictureAdmin/Check.svg" width={20} height={20} alt="อนุมัติ" />
                        <span>อนุมัติ</span>
                      </div>
                      <div className="status pending">
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
