import { useState } from "react";
import "./slidebarsoc.css";
import Link from "next/link";

export default function Sidebar({ isOpen, setIsOpen }) {
  // ฟังก์ชันเพื่อปิด sidebar
  const closeSidebar = () => setIsOpen(false);

  return (
    <>
      <div className={`sidebar ${isOpen ? "open" : ""}`}>
      {/* โลโก้ */}
      <h1 className="logo" onClick={closeSidebar}>
        SPORTFLOW
      </h1>

      <hr />

      {/* เมนู */}
      <ul>
          <li>
            <img src="/pictureowner/profile.png" alt="iconprofile" />
            <Link
              href="/Info"
              style={{ textDecoration: "none", color: "inherit" }}
            >
              ไกรวิชญ์ ไพรศาร
            </Link>
            <br />
          </li>

          <li>
            <img src="/pictureowner/add.png" alt="iconadd" />
            <Link
              href="/my-stadium"
              style={{ textDecoration: "none", color: "inherit" }}
            >
              เพิ่มสนาม
            </Link>
          </li>

          <li>
            <img src="/pictureowner/promotion.png" alt="iconpromotion" />
            <Link
              href="/promotion"
              style={{ textDecoration: "none", color: "inherit" }}>
              โปรโมชั่นส่วนลด
            </Link>
          </li>

          <li>
            <img src="/pictureowner/stat.png" alt="iconstat" />
            <Link
              href="/owner-stats"
              style={{ textDecoration: "none", color: "inherit" }}
            >
              สถิติ
            </Link>
          </li>

          <li>
            <img src="/pictureowner/report.png" alt="iconreport" />
            <Link
              href="/owner-reportbooking"
              style={{ textDecoration: "none", color: "inherit" }}
            >
              รายงานการขาย
            </Link>
          </li>

          <li>
            <img src="/pictureowner/market.png" alt="icomarket" />
            <Link
              href="/money"
              style={{ textDecoration: "none", color: "inherit" }}
            >
              การเงิน
            </Link>
          </li>

          <li>
            <img src="/pictureowner/passwd.png" alt="iconpasswd" />
            <Link
              href="/EmailInput"
              style={{ textDecoration: "none", color: "inherit" }}
            >
            เปลี่ยนรหัสผ่าน
            </Link>
          </li>

          <li>
            <img src="/pictureowner/about.png" alt="iconabout" />
            <Link
              href="/about"
              style={{ textDecoration: "none", color: "inherit" }}
            >
              เกี่ยวกับเรา
            </Link>
        </li>
          
        </ul>

      {/* ปุ่มออกจากระบบ */}
        <Link
          href="/"
          style={{ textDecoration: "none", color: "inherit" }}
        >
          <button className="logout">
            <img src="/pictureowner/logout.svg" alt="logout" /> ออกจากระบบ
          </button>
              
        </Link>
    </div>
    </>
  );
}
