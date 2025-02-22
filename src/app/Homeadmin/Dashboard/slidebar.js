"use client";

import { useState } from "react";
import "./slidebar.css";
import Link from "next/link";

export default function Sidebar({ isOpen, setIsOpen }) {
  const closeSidebar = () => setIsOpen(false);

  return (
    <div className={`sidebar ${isOpen ? "open" : ""}`}>
      {/* โลโก้ */}
      <h1 className="logo" onClick={closeSidebar}>
        SPORTFLOW
      </h1>

      <hr />

      {/* เมนู */}
      <ul>
        <Link href="/Homeadmin/Profile" className="sidebar-link">
          <li>
            <img src="/pictureAdmin/user.svg" alt="iconprofile" />
            <div>
              <span style={{ color: "white" }}>ญาณิศา คงหาญ</span>
              <br />
              <small style={{ color: "white" }}>ผู้ดูแลระบบ</small>
            </div>
          </li>
        </Link>

        <Link href="/Homeadmin/Approved" className="sidebar-link">
          <li>
            <img src="/pictureAdmin/approve.svg" alt="iconhistory" />
            อนุมัติสนาม
          </li>
        </Link>

        <Link href="/Homeadmin/People" className="sidebar-link">
          <li>
            <img src="/pictureAdmin/people.svg" alt="iconbin" />
            จัดการบุคคล
          </li>
        </Link>

        <Link href="/Homeadmin/Manage_Cash" className="sidebar-link">
          <li>
            <img src="/pictureAdmin/stadium.svg" alt="iconbin" />
            จัดการเงิน
          </li>
        </Link>

        <Link href="/Homeadmin/Manage_Refunds" className="sidebar-link">
          <li>
            <img src="/pictureAdmin/finance.svg" alt="iconbin" />
            จัดการคำขอยกเลิก
          </li>
        </Link>

        <Link href="/Homeadmin/Dashboard" className="sidebar-link">
          <li>
            <img src="/pictureAdmin/dashboard.svg" alt="iconbin" />
            แดชบอร์ด
          </li>
        </Link>

        <Link href="/Homeadmin/Communication" className="sidebar-link">
          <li>
            <img src="/pictureAdmin/message.svg" alt="iconbin" />
            การสื่อสาร
          </li>
        </Link>
      </ul>

      {/* ปุ่มออกจากระบบ */}
      <Link href="/" passHref> {/* Add passHref to make it work well with buttons */}
        <button className="logout">
          <img src="/pictureAdmin/logout.svg" alt="logout" /> ออกจากระบบ
        </button>
      </Link>
    </div>
  );
}
