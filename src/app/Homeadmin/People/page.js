"use client";
import "./people.css";
import "../Dashboard/slidebar.css";
import React, { useState } from "react";
import Sidebar from "../Dashboard/slidebar.js";
import Tab from "../Tabbar/page.js";

export default function Dashboard() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [category, setCategory] = useState("");
  const [amount, setAmount] = useState("");
  const [search, setSearch] = useState("");
  const [selectedUser, setSelectedUser] = useState(null);
  const [showBlockPopup, setShowBlockPopup] = useState(false);
  const [showDeletePopup, setShowDeletePopup] = useState(false);

  const [users, setUsers] = useState([
    { id: 1, name: "ภูรินันทร์ สิงห์เขา", phone: "0812345678", email: "phurinan@gmail.com", role: "ผู้ประกอบการ", status: "active" },
    { id: 2, name: "สมชาย รุ่งเจริญ", phone: "0823456789", email: "somchai@gmail.com", role: "ผู้ใช้งาน", status: "active" },
    { id: 3, name: "สมหญิง ขุนเดช", phone: "0834567890", email: "somying@gmail.com", role: "ผู้ประกอบการ", status: "active" },
    { id: 4, name: "สมหมาย เมืองพล", phone: "0845678901", email: "sommai@gmail.com", role: "ผู้ใช้งาน", status: "active" },
    { id: 5, name: "สมบอน ปิงมา", phone: "0856789012", email: "sombon@gmail.com", role: "ผู้ประกอบการ", status: "active" },
    { id: 6, name: "สมศรี สิงขนุกร", phone: "0867890123", email: "somsri@gmail.com", role: "ผู้ประกอบการ", status: "active" },
  ]);

  const handleBlock = () => {
    setUsers(users.map(user => 
      user.id === selectedUser?.id 
        ? { ...user, status: "blocked" }
        : user
    ));
    setShowBlockPopup(false);
    setSelectedUser(null);
  };

  const handleDelete = () => {
    setUsers(users.filter(user => user.id !== selectedUser?.id));
    setShowDeletePopup(false);
    setSelectedUser(null);
  };

  const filteredUsers = users.filter(user => 
    user.name.toLowerCase().includes(search.toLowerCase()) &&
    (category === "" || user.role === category)
  );

  return (
    <>
      <Sidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />
      <Tab />
      <br/>
      <p className="summary">
        <img src="/pictureAdmin/mapeo.svg" className="iconG" alt="group icon" />
        รายการข้อมูลสมาชิก
      </p>
      <br/>
      <div className="filter-container">
        <select value={category} onChange={(e) => setCategory(e.target.value)}>
          <option value="">ทั้งหมด</option>
          <option value="ผู้ใช้งาน">ผู้ใช้งาน</option>
          <option value="ผู้ประกอบการ">ผู้ประกอบการ</option>
        </select>

        <select value={amount} onChange={(e) => setAmount(e.target.value)}>
          <option value="">ทั้งหมด</option>
          <option value="10">10 รายการ</option>
          <option value="20">20 รายการ</option>
          <option value="50">50 รายการ</option>
        </select>

        <input
          type="text"
          placeholder="ค้นหาด้วยชื่อ"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>ลำดับ</th>
              <th>สถานะ</th>
              <th>ชื่อ-นามสกุล</th>
              <th>เบอร์โทร</th>
              <th>อีเมล</th>
              <th>จัดการ</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.map((user, index) => (
              <tr key={user.id}>
                <td>{index + 1}</td>
                <td>{user.role}</td>
                <td>{user.name}</td>
                <td>{user.phone}</td>
                <td>{user.email}</td>
                <td>
                  {user.status === "blocked" ? (
                    <span className="blocked-status">ถูกระงับการใช้งาน</span>
                  ) : (
                    <button className="delete-btn">
                      <img 
                        src="/pictureAdmin/Block.svg" 
                        alt="Block User" 
                        className="icon"
                        onClick={() => {
                          setSelectedUser(user);
                          setShowBlockPopup(true);
                        }}
                      />
                      <img 
                        src="/pictureAdmin/Delete.svg" 
                        alt="Delete" 
                        className="icon"
                        onClick={() => {
                          setSelectedUser(user);
                          setShowDeletePopup(true);
                        }}
                      />
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Block Popup */}
      {showBlockPopup && (
        <div className="popup-overlay">
          <div className="popup-content">
          <img src="/pictureAdmin/Block.svg"/>
            <h2>ระงับบัญชี</h2>
            <p>คุณต้องการระงับบัญชีของ {selectedUser?.name} หรือไม่?</p>
            <p>หากยืนยันบัญชีนี้จะถูกระงับการใช้งาน 7 วัน</p>
            <div className="popup-buttons">
              <button 
                className="cancel-btn"
                onClick={() => {
                  setShowBlockPopup(false);
                  setSelectedUser(null);
                }}
              >
                ยกเลิก
              </button>
              <button 
                className="confirm-btn"
                onClick={handleBlock}
              >
                ยืนยัน
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Popup */}
      {showDeletePopup && (
        <div className="popup-overlay">
          <div className="popup-content">
            <img src="/pictureAdmin/delete.svg"/>
            <h2>ลบบัญชี</h2>
            <p>คุณต้องการลบบัญชีของ {selectedUser?.name} หรือไม่?</p>
            <p>หากกดยืนยันแล้วจะไม่สามารถยกเลิกได้</p>
            <div className="popup-buttons">
              <button 
                className="cancel-btn"
                onClick={() => {
                  setShowDeletePopup(false);
                  setSelectedUser(null);
                }}
              >
                ยกเลิก
              </button>
              <button 
                className="confirm-btn"
                onClick={handleDelete}
              >
                ยืนยัน
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
} 