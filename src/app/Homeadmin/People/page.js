"use client";
import "./people.css";
import "../Dashboard/slidebar.css";
import React, { useState, useEffect } from "react";
import Sidebar from "../Dashboard/slidebar.js";
import Tab from "../Tabbar/page.js";
import axios from "axios";

export default function Dashboard() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [category, setCategory] = useState("");
  const [amount, setAmount] = useState("");
  const [search, setSearch] = useState("");
  const [selectedUser, setSelectedUser] = useState(null);
  const [showDeletePopup, setShowDeletePopup] = useState(false);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // ฟังก์ชันดึงข้อมูลผู้ใช้ทั้งหมด
  const fetchAllUsers = async () => {
    setLoading(true);
    try {
      const response = await axios.get('http://localhost:5000/api/users');
      setUsers(response.data);
      setError(null);
    } catch (err) {
      console.error('Error fetching users:', err);
      setError('ไม่สามารถโหลดข้อมูลผู้ใช้ได้');
    } finally {
      setLoading(false);
    }
  };

  // ฟังก์ชันดึงข้อมูลตามประเภทผู้ใช้
  const fetchUsersByCategory = async (category) => {
    setLoading(true);
    try {
      let endpoint = 'http://localhost:5000/api/users';
      
      if (category === 'ผู้ใช้งาน') {
        endpoint = 'http://localhost:5000/api/users/regular';
      } else if (category === 'ผู้ประกอบการ') {
        endpoint = 'http://localhost:5000/api/users/owners';
      }
      
      const response = await axios.get(endpoint);
      setUsers(response.data);
      setError(null);
    } catch (err) {
      console.error('Error fetching users by category:', err);
      setError('ไม่สามารถโหลดข้อมูลผู้ใช้ได้');
    } finally {
      setLoading(false);
    }
  };

  // ดึงข้อมูลเมื่อคอมโพเนนท์ถูกโหลด
  useEffect(() => {
    fetchAllUsers();
  }, []);

  // ดึงข้อมูลใหม่เมื่อมีการเปลี่ยนแปลงหมวดหมู่
  useEffect(() => {
    if (category) {
      fetchUsersByCategory(category);
    } else {
      fetchAllUsers();
    }
  }, [category]);

  const handleDelete = async () => {
    if (!selectedUser) return;
    
    setIsDeleting(true);
    try {
      await axios.delete(`http://localhost:5000/api/users/${selectedUser.id}`);
      setUsers(users.filter(user => user.id !== selectedUser.id));
      setShowDeletePopup(false);
      setSelectedUser(null);
    } catch (err) {
      console.error('Error deleting user:', err);
      setError('ไม่สามารถลบผู้ใช้ได้: ' + (err.response?.data?.message || err.message));
    } finally {
      setIsDeleting(false);
    }
  };

  // กรองข้อมูลตามคำค้นหา
  const filteredUsers = users.filter(user => 
    (user.name || '').toLowerCase().includes(search.toLowerCase())
  );

  // จำกัดจำนวนรายการที่แสดง
  const limitedUsers = amount ? filteredUsers.slice(0, parseInt(amount)) : filteredUsers;

  return (
    <>
      <Sidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />
      <Tab />
      
      <div className="header-titlepeople">
        <h1>รายการข้อมูลสมาชิก</h1>
      </div>
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

      {error && <p className="error-message">{error}</p>}

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
            {!loading && limitedUsers.length === 0 && (
              <tr>
                <td colSpan="6" style={{ textAlign: "center" }}>ไม่พบข้อมูลผู้ใช้</td>
              </tr>
            )}
            {limitedUsers.length > 0 && !loading && (
              limitedUsers.map((user, index) => (
                <tr key={user.id}>
                  <td>{index + 1}</td>
                  <td>{user.role}</td>
                  <td>{user.name || 'ไม่ระบุ'}</td>
                  <td>{user.phone || 'ไม่ระบุ'}</td>
                  <td>{user.email || 'ไม่ระบุ'}</td>
                  <td>
                    {user.status === "blocked" ? (
                      <span className="blocked-status">ถูกระงับการใช้งาน</span>
                    ) : (
                      <button className="delete-btn">
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
              ))
            )}
          </tbody>
        </table>
      </div>

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
                disabled={isDeleting}
              >
                ยกเลิก
              </button>
              <button 
                className="confirm-btn"
                onClick={handleDelete}
                disabled={isDeleting}
              >
                {isDeleting ? 'กำลังลบ...' : 'ยืนยัน'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}