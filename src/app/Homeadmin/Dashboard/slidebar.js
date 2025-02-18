import { useState } from "react";
import "./slidebar.css";
import "./dash.css";
import Link from 'next/link';

export default function Sidebar({ isOpen, setIsOpen }) {
    // ฟังก์ชันเพื่อปิด sidebar
    const closeSidebar = () => setIsOpen(false);
  
    return (
      <>
        
        <div className={`sidebar ${isOpen ? "open" : ""}`}>
          <h1 className="logo" onClick={closeSidebar}>
            SPORTFLOW
          </h1>  <hr/>
          <ul>
          <li>
            <img src="/pictureAdmin/user.svg" alt="profile" /> 
            <Link href="/Homeadmin/Profile" passHref>
            ญาณิศา คงหาญ
            </Link>
            <br />
          </li>
            <li>
            <img src="/pictureAdmin/approve.svg" alt="" /> 
            <Link href="/Homeadmin/Approved" passHref>
              อนุมัติสนาม
            </Link>
            </li>

            <li>
              <img src="/pictureAdmin/people.svg" alt="" /> 
              <Link href="/Homeadmin/People" passHref>
              จัดการบุคคล
              </Link>
            </li>
            <li>
              <img src="/pictureAdmin/stadium.svg" alt="" />
              <Link href="/Homeadmin/Manage_Cash" passHref>
              จัดการเงิน
              </Link>
             
              </li>
            <li>
              <img src="/pictureAdmin/finance.svg" alt="" />
               <Link href="/Homeadmin/Manage_Refunds" passHref>
               จัดการคำขอยกเลิก
              </Link>
            </li>
            <li>
            <img src="/pictureAdmin/dashboard.svg" alt="" />
              <Link href="/Homeadmin/Dashboard" passHref>
               แดชบอร์ด
              </Link>
            </li>
            <li>
              <img src="/pictureAdmin/message.svg" alt="" /> 
              <Link href="/Homeadmin/Communication" passHref>
              การสื่อสาร
              </Link>
              </li>
          </ul>
          <button className="logout">
            <img src="/pictureAdmin/logout.svg" alt="" />   ออกจากระบบ
          </button>
        </div>
      </>
    );
  }