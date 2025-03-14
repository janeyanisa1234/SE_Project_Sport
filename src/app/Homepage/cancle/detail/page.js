"use client";

import React, { useState } from "react";
import "./De.css";
import Tabbar from "../../components/tab";
import Link from "next/link";

export default function Detail() {
  const refundStatus = "pending"; // เปลี่ยนเป็น "pending", "approved" หรือ "success" ได้

  return (
    <>
      <Tabbar />

      <h1 className="detail">
        <Link href="../cancle">
          <img src="/picturepalm/Arrow.png" alt="arrow" className="Arrow" />
        </Link>
        รายละเอียดการคืนเงิน
      </h1>

      {/* แถบแสดงสถานะ */}
      <div className="process-bar">
        {/* ยื่นคำขอยกเลิกการจอง */}
        <div className={`process-step ${refundStatus === "pending" ? "active" : ""}`}></div>

        {/* คำขอได้รับการอนุมัติ */}
        <div className={`process-step ${refundStatus === "approved" ? "active" : ""}`}></div>

        {/* คืนเงินสำเร็จ */}
        <div className={`process-step ${refundStatus === "success" ? "active" : ""}`}></div>
      </div>


      {/* ข้อความสถานะ */}
      <div className="process-text">
        <span>ยื่นคำขอยกเลิกการจอง</span>
        <span>คำขอได้รับการอนุมัติ</span>
        <span>คืนเงินสำเร็จ</span>
      </div>
    
        
    

      <div className="container">
        <div className="name-container">
          <h2 className="name">AVOCADO</h2>
          <span className="sport-type">แบดมินตัน</span>
        </div>

        <div className="refund-details">
          <p>จำนวนเงินคืน</p>
          <p>คืนเงินไปยัง</p>
          <p>ผู้ยื่นคำขอ</p>
          <p>ยื่นคำขอเมื่อ</p>
          <p>เหตุผล</p>
        </div>
      </div>
    </>
  );
}
