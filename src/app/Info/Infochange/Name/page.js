"use client";

import React, { useState, useEffect } from 'react';
import "./Name.css"; 
import Tab from "../../../Tab/tab"; 
import { useRouter } from 'next/navigation';
import { AuthService } from "../../../utils/auth";

export default function Name() {
  const [currentName, setCurrentName] = useState('');
  const [newName, setNewName] = useState('');
  const router = useRouter();
  const API_URL = "http://localhost:5000/api/ice";

// Inside your component:
useEffect(() => {
  // Fetch current name when component loads
  const user = AuthService.getCurrentUser();
  if (user && user.name) {
    setCurrentName(user.name);
  }
}, []);

const handleSave = async () => {
  try {
    const token = localStorage.getItem("token");
    const response = await fetch(`${API_URL}/update-name`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      },
      body: JSON.stringify({ newName })
    });

    const data = await response.json();
    if (response.ok) {
      // Update the user data in localStorage after successful API call
      AuthService.updateUserName(newName);
      
      alert("อัปเดตชื่อสำเร็จ!");
      router.push("/Info");
    } else {
      alert("เกิดข้อผิดพลาด: " + data.error);
    }
  } catch (error) {
    console.error("Error updating name:", error);
    alert("เกิดข้อผิดพลาด");
  }
};
  
  return (
        <>
          <Tab />
          <div className="name-container">
            <div className="overlay">
              <div className="name-box">
                <h2 className="title">เปลี่ยนชื่อผู้ใช้</h2>

                <div className="input-group">
                  <label>ชื่อเดิม</label>
                  <input
                    type="text"
                    className="input-field"
                    value={currentName}
                    onChange={(e) => setCurrentName(e.target.value)}
                    required
                  />
                </div>

                <div className="input-group">
                  <label>ชื่อใหม่</label>
                  <input
                    type="text"
                    className="input-field"
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    required
                  />
                </div>

                <button onClick={handleSave} className="save-btn">บันทึกการเปลี่ยนแปลง</button>
              </div>
            </div>
          </div>
        </>
  );
}
