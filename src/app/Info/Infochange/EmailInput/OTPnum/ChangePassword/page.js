"use client";
import Link from "next/link";
import React, { useState } from "react";
import "./ChangePassword.css"; 
import Tabbar from "../../../../../Tab/tab"; 


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
      <Tabbar />
    
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

              <Link href={"/Info/Infochange/EmailInput/OTPnum/ChangePassword/ChangeSuccess"}>
                <button type="submit" className="submit-btn">
                  บันทึกการเปลี่ยนแปลง
                </button>
              </Link>
              
            </form>
          </div>
        </div>
      </div> 
    </>
  );
}
