"use client";

import React from "react";
import "./changSuccess.css"; 

import Link from "next/link";
import Sidebar from "../../../Dashboard/slidebar.js";
import Tab from "../../../Tabbar/page.js";

export default function changSuccess() {
  return (
    <>
      <Tab />
      <Sidebar/>
      <div className="success-container">
        <div className="overlay">
          <div className="content-box">
            <div className="icon-container">
              <div className="check-icon">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="icon"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              </div>
            </div>
            <h2 className="title">เปลี่ยนรหัสผ่านสำเร็จ</h2>
            <p className="message">คุณได้เปลี่ยนรหัสผ่านสำเร็จเรียบร้อยแล้ว</p>
            <Link
              href="/Homeadmin/Profile"
            >
            <button className="confirm-btn">
              ยืนยัน
            </button>
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
