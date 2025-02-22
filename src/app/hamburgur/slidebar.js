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
    

      <Link href="/Info" className="sidebar-link">
        <li>
          <img src="/picturepalm/profile.svg" alt="iconprofile" />
          <div>
            <span style={{ color: "white" }}>ณัฐฐา นามเมือง</span>
            <br />
            <small style={{ color: "white" }}>UID : xxxxxxxx</small>
          </div>
        </li>
      </Link>

        
      <Link href="/Login/Homepage/Search/Select/payment-qr/payment-confirm/history" className="sidebar-link">
        <li>
        <img src="/picturepalm/history.svg" alt="iconhistory" />
        ประวัติการจอง
        </li>
      </Link>
        

      <Link href="/cancle" className="sidebar-link">
        <li>
          <img src="/picturepalm/cancle.svg" alt="iconbin" />
           ยกเลิกการจองสนาม
        </li>
      </Link>
        

        <Link href={"/about"}>
          <li>
            <img src="/picturepalm/aboutme.svg" alt="iconabout" />
            เกี่ยวกับเรา
          </li>
        </Link>
        
      </ul>

      {/* ปุ่มออกจากระบบ */}
      <button className="logout">
        <img src="/picturepalm/logout.svg" alt="logout" /> ออกจากระบบ
      </button>
    </div>
  );
}
