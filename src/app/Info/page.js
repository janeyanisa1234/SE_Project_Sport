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
  const API_URL = "http://localhost:5000/api/ice";
  useEffect(() => {
    async function fetchUserData() {
      try {
        const token = localStorage.getItem("token"); // ดึง Token จาก localStorage
        if (!token) {
          console.error("No token found, user may not be logged in.");
          return;
        }
  
        const response = await axios.get(`${API_URL}/user`, {
          headers: {
            Authorization: `Bearer ${token}`, // ส่ง Token ไปกับ request
          },
        });
  
        if (response.data) {
          setUserData(response.data); // ตั้งค่า userData จาก API response
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

            <Link href={"/Info/Infochange"}>
              <button className="edit-btn">แก้ไขข้อมูลส่วนตัว</button>
            </Link>
            
          </div>
        </div>
      </div>
    </>
  );
}
