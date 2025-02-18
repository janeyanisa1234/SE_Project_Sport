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
        <li>
          <img src="/profile.svg" alt="iconprofile" />
          <div>
            <span>ณัฐฐา นามเมือง</span>
            <br />
            <small>UID : xxxxxxxx</small>
          </div>
        </li>

        <li>
          <img src="/history.svg" alt="iconhistory" />
          ประวัติการจอง
        </li>

        <li>
          <img src="/cancle.svg" alt="iconbin" />
          ยกเลิกการจองสนาม
        </li>

        <li>
          <img src="/aboutme.svg" alt="iconabout" />
          เกี่ยวกับเรา
        </li>
      </ul>

      {/* ปุ่มออกจากระบบ */}
      <button className="logout">
        <img src="/logout.svg" alt="logout" /> ออกจากระบบ
      </button>
    </div>
  );
}
