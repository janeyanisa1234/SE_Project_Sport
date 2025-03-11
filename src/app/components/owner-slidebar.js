import { useState, useEffect } from "react";
import "./slidebarsoc.css";
import Link from "next/link";
import { AuthService } from "../utils/auth";

export default function Sidebar({ isOpen, setIsOpen }) {
  // ฟังก์ชันเพื่อปิด sidebar
  const closeSidebar = () => setIsOpen(false);

  // Get user data from localStorage
  const [userName, setUserName] = useState("ผู้ใช้งาน"); // Default name
  const [userRole, setUserRole] = useState("owner"); // Default role

  // Load user data when component mounts
  useEffect(() => {
    const user = AuthService.getCurrentUser();
    if (user && user.name) {
      setUserName(user.name);
      setUserRole(AuthService.getUserRole());
    }
  }, []);

  const handleLogout = () => {
    AuthService.logout();
  };

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
            <div>
              <Link
                href="/ownerProfile"
                style={{ textDecoration: "none", color: "inherit" }}
              >
                {userName || "ผู้ใช้งาน"}
              </Link>
              <br />

              
              <small style={{ color: "white" }}>เจ้าของสนาม</small>

            </div>
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

          {/* Rest of the menu items remain unchanged */}
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
          <button className="logout" onClick={handleLogout}>
            <img src="/pictureowner/logout.svg" alt="logout" /> ออกจากระบบ
          </button>
    </div>
    </>
  );
}
