"use client"; 

import Link from "next/link";
import React from "react";
import Image from "next/image";
import "./Registration.css";  
import Sidebar from "../../ice/Admin/slidebar.js"; 
import Tabbar from "@/app/Homeadmin/Tabbar/page";


const Registration = () => {
  return (
    <>
      <Tabbar />
      <Sidebar />
      <div className="registration-container">
        <div className="registration-overlay">
          <div className="registration-box">
          <div className="icon-container">
  
  <Image src="/pictureice/logo (4).png" alt="Admin Icon" width={70} height={50} className="user-icon" priority />
</div>
            <h1 className="title">ลงทะเบียน</h1>
            <p className="subtitle">กรุณาเลือก</p>
            <div className="button-group">

              <Link href="/Login/Registration/RegistrationForm"> 
                <button className="registration-button">ฉันต้องการจองสนาม</button>
              </Link>
              
              <Link href={"/Login/Registration/RegistrationForm1"}>
                <button className="registration-button">ฉันต้องการเพิ่มสนาม</button>
              </Link>
              
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Registration;

