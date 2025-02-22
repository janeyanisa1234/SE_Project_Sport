import { useState } from "react";
import "./slidebar.css";
import Link from 'next/link';

export default function Sidebar({ isOpen, setIsOpen }) {
    // ฟังก์ชันเพื่อปิด sidebar
    const closeSidebar = () => setIsOpen(false);
  
    return (
      <>
        {/* Sidebar */}
        <div className={`sidebar ${isOpen ? "open" : ""}`}>
          <h1 className="logo" onClick={closeSidebar}>
            SPORTFLOW
          </h1>  <hr/>
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
          

          <li>
            <img src="/pictureice/history.svg" alt="iconhistory"/>
            ประวัติการจอง
          </li>

        <Link href="/cancle" className="sidebar-link">
          <li>
            <img src="/picturepalm/cancle.svg" alt="iconbin" />
            ยกเลิกการจองสนาม
          </li>
      </Link>

          <li>
            <img src="/pictureice/aboutme.svg" alt="iconabout"/>
            เกี่ยวกับเรา
          </li>
            
          </ul>
          <button className="logout">
            <img src="/logout.svg" alt="" />   ออกจากระบบ
          </button>
        </div>
      </>
    );
  }