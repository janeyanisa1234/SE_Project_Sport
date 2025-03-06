"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import Image from "next/image"; // ✅ Import Image ให้ถูกต้อง
import "./Info.css";
import Tabbar from "../Tab/tab";
import axios from "axios";

export default function Info() {
  const [showPassword, setShowPassword] = useState(false); // ✅ ต้องมี state มิฉะนั้นจะแตก
  const [userData, setUserData] = useState(null); //ดึง backend

  useEffect(() => {
    async function fetchUserData() {
      try {
        const response = await axios.get("http://localhost:5000/api/edit");
        
        if (response.data.length > 0) {
          setUserData(response.data[0]); // ✅ ดึงแค่ object ตัวแรก
        } else {
          console.error("No user data received");
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    }
  
    fetchUserData();
  }, []);
  

  return (
    <>
      <Tabbar />
    
      <div className="info-container">
        <div className="overlay">
          <div className="content-box">
            <div className="profile-pic">
              <div className="admin-user-icon">
                <Image src="/pictureice/logo (1).png" alt="Admin Icon" width={70} height={50} />
              </div>
            </div>

            <h2 className="title">ข้อมูลส่วนตัว</h2>
            <p className="text"><strong>ชื่อ : </strong> {userData?.name || "N/A"} </p>
            <p className="text"><strong>อีเมล : </strong> {userData?.email || "N/A"} </p>
            <p className="text"><strong>เบอร์โทร : </strong> {userData?.phone || "N/A"}</p>

            <div className="password-section">
              <p className="text">
                <strong>รหัสผ่าน : </strong> {showPassword ? userData?.password || "N/A" : "********"}
              </p>
              <button onClick={() => setShowPassword(!showPassword)} className="toggle-btn">
                {showPassword ? <EyeOff size={24} className="icon" /> : <Eye size={24} className="icon" />}
              </button>
            </div>

            <Link href={"/Info/Infochange"}>
              <button className="edit-btn">แก้ไขข้อมูลส่วนตัว</button>
            </Link>
            
          </div>
        </div>
      </div>
    </>
  );
}
