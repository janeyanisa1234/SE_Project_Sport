"use client";
import { Eye, EyeOff } from "lucide-react";
import Image from "next/image";
import "./profile.css";
import Tab from "../Tabbar/page.js";
import "../Dashboard/slidebar.css";
import React, { useState } from "react";
import Sidebar from "../Dashboard/slidebar.js";
import Link from 'next/link';
import axios from "axios";

export default function Admin() {
  const [adminData, setAdminData] = useState(null);
  const API_URL = "http://localhost:5000/api/ice";
  useEffect(() => {
    const fetchAdminData = async () => {
      try {
        const token = localStorage.getItem("token"); // ดึง JWT Token จาก localStorage
        const response = await axios.get(`${API_URL}/admin`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setAdminData(response.data);
      } catch (error) {
        console.error("Error fetching admin data:", error);
      }
    };

    fetchAdminData();
  }, []);
  
  
  return (
    <>
      <Tab />
      <Sidebar/>
      <div className="admin-container" >
        <div className="admin-overlay">
          <div className="admin-card">
            <div className="admin-user-icon">
              <Image src="/pictureice/Admin.svg" alt="Admin Icon" width={70} height={50} />
            </div>

            <h2 className="admin-title">ผู้ดูแลระบบ</h2>
            <p className="admin-text"><strong>ชื่อ : </strong></p>
            <p className="admin-text"><strong>อีเมล : </strong></p>
            <p className="admin-text"><strong>เบอร์โทร : </strong></p>
          </div>
        </div>
      </div>
    </>
  );
}
