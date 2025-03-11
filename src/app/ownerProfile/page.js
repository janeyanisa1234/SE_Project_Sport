"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { Eye, EyeOff } from "lucide-react";
import Image from "next/image";
import "./ownerProfile.css";
import Tabbar from "../components/tab";
import Link from "next/link";

export default function Profile() {
  const [showPassword, setShowPassword] = useState(false);
  const [user, setUser] = useState(null);
  const API_URL = "http://localhost:5000/api/ice";
  useEffect(() => {
    // ดึงข้อมูลเจ้าของ
    const fetchOwner = async () => {
      try {
        const token = localStorage.getItem("token"); // ดึง Token
        const response = await axios.get(`${API_URL}/owner`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        setUser(response.data);
      } catch (error) {
        console.error("Error fetching owner:", error.response?.data?.message || error.message);
      }
    };

    fetchOwner();
  }, [])

  return (
    <>
      <Tabbar />
      <div className="profile-container">
        <div className="profile-overlay">
          <div className="profile-box">
            <div className="admin-user-icon">
              <Image src="/pictureice/logo (1).png" alt="Admin Icon" width={70} height={50} />
            </div>

            <h2 className="text-2xl font-semibold mb-4">ผู้ประกอบการ</h2>
            
            <p className="profile-text"><strong>ชื่อ : </strong>{user?.name || "-"}</p>
            <p className="profile-text"><strong>อีเมล : </strong>{user?.email || "-"}</p>
            <p className="profile-text"><strong>เบอร์โทร : </strong>{user?.phone || "-"}</p>
            <p className="profile-text"><strong>ชื่อธนาคาร : </strong>{user?.bank_name || "-"}</p>
            <p className="profile-text"><strong>เลขบัญชีธนาคาร : </strong>{user?.bank_account || "-"}</p>
            <Link href={"/ownerProfile/Email"}>
            <button className="profile-button">เปลี่ยนรหัสผ่าน</button>
            </Link>
           
          </div>
        </div>
      </div>
    </>
  );
}
