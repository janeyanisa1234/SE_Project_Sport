"use client";

import React, { useState } from "react";
import "./pass.css"; 
import Link from "next/link";
import Sidebar from "../../Dashboard/slidebar.js";
import Tab from "../../Tabbar/page.js";

export default function ChangePassword() {
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (newPassword !== confirmNewPassword) {
      alert("รหัสผ่านใหม่ไม่ตรงกัน");
      return;
    }
    alert("บันทึกการเปลี่ยนแปลงเรียบร้อยแล้ว");
  };

  return (
    <>
      <Tab />
      <Sidebar/>
      
      <div className="change-password-container">
        <div className="overlay">
          <div className="form-container">
            <h2 className="title">เปลี่ยนรหัสผ่าน</h2>
            <form onSubmit={handleSubmit}>
              <div className="input-group">
                <label>รหัสผ่านใหม่</label>
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                />
              </div>
              <div className="input-group">
                <label>ยืนยันรหัสผ่านใหม่</label>
                <input
                  type="password"
                  value={confirmNewPassword}
                  onChange={(e) => setConfirmNewPassword(e.target.value)}
                  required
                />
              </div>
              <div className="mt-7">
              </div>
              
              <button type="submit" className="submit-btn">
              <Link href="/Homeadmin/Profile/changpass/changSuccess">
                บันทึกการเปลี่ยนแปลง
                </Link>
              </button>
           
            </form>
          </div>
        </div>
      </div> 
    </>
  );
}
