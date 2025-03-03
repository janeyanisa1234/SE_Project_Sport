"use client";

import React, { useState } from 'react';
import "./Name.css"; 
import Tabbar from "../../../Tab/tab"; 
 
import { Link } from 'lucide-react';

export default function Name() {
  const [currentName, setCurrentName] = useState('');
  const [newName, setNewName] = useState('');

  return (
        <>
          <Tabbar />
    <div className="name-container">
      <div className="overlay">
        <div className="name-box">
          <h2 className="title">เปลี่ยนชื่อ-นามสกุล</h2>

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

          <Link href="/Info">
            <button type="submit" className="save-btn">
              บันทึกการเปลี่ยนแปลง
            </button>
          </Link>
          

        </div>
      </div>
    </div>
    </>
  );
}
