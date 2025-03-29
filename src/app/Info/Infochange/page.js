"use client";
import Link from 'next/link';
import React from 'react';
import Image from 'next/image'; // ✅ ใช้ next/image
import "./Infochange.css"; 
import Tabbar from "../../Tab/tab";


const Infochange = () => {
  return (
    <>
      <Tabbar />

      <div className="infochange-container">
        <div className="overlay">
          <div className="content-box">
            <div className="profile-icon">
              {/* ✅ ใช้ Next.js Image Component */}
              <Image src="/pictureice/logo (1).png" alt="Admin Icon" width={70} height={70} />
            </div>
            <h1 className="title">แก้ไขข้อมูลส่วนตัว</h1>
            <p className="subtitle">กรุณาเลือก</p>
            <div className="button-group">

              <Link href={"/Info/Infochange/Name"}>
                <button className="change-btn">เปลี่ยนชื่อผู้ใช้</button>
              </Link>
             

              <Link href = {"/Info/Infochange/EmailInput"}>
                <button className="change-btn">เปลี่ยนรหัสผ่าน</button>
              </Link>
              
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Infochange;

