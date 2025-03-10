"use client";

import React, { useState, useEffect } from "react";
import { FaPlus, FaTrash } from "react-icons/fa";
import { useRouter } from "next/navigation";
import Tabbar from "../components/tab";
import axios from "axios";

const SportField = () => {
  const router = useRouter();
  const [stadiums, setStadiums] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userId, setUserId] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedStadium, setSelectedStadium] = useState(null);
  const [confirmName, setConfirmName] = useState("");

  const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

  const AddStadiumButton = () => (
    <div className="mt-10 flex justify-center">
      <button
        className="w-full max-w-6xl bg-gradient-to-r from-gray-100 to-gray-200 border-4 border-gray-200 shadow-lg rounded-3xl flex items-center justify-center h-56 transform hover:scale-105 transition-all duration-300 ease-in-out"
        onClick={() => router.push("/my-stadium/add-stadium")}
      >
        <div className="flex flex-col items-center">
          <FaPlus className="text-5xl text-gray-800 mb-3" />
          <span className="text-2xl font-bold text-gray-800 tracking-wide">เพิ่มสนามกีฬา</span>
        </div>
      </button>
    </div>
  );

  const getUserId = () => {
    const storedUserId = localStorage.getItem('userId');
    if (storedUserId) {
      try {
        if (typeof storedUserId === 'string' && (storedUserId.startsWith('{') || storedUserId.startsWith('['))) {
          const parsedUser = JSON.parse(storedUserId);
          return parsedUser.id || parsedUser.userId || parsedUser.user_id || storedUserId;
        }
      } catch (e) {
        console.error("Error parsing stored userId:", e);
      }
      return storedUserId;
    }
    return null;
  };

  useEffect(() => {
    const fetchStadiums = async () => {
      try {
        setLoading(true);
        const extractedUserId = getUserId();
        setUserId(extractedUserId);

        if (!extractedUserId) {
          setError("ไม่พบข้อมูลผู้ใช้ กรุณาเข้าสู่ระบบใหม่");
          setLoading(false);
          return;
        }

        const token = localStorage.getItem('token') || sessionStorage.getItem('token');
        if (!token) {
          setError("ไม่พบข้อมูลการเข้าสู่ระบบ กรุณาเข้าสู่ระบบใหม่");
          setLoading(false);
          return;
        }

        const response = await axios.get(`${API_BASE_URL}/api/sox/stadiums/${extractedUserId}`, {
          headers: { 'Authorization': `Bearer ${token}` },
          timeout: 10000
        });

        setStadiums(response.data.data || []);
      } catch (err) {
        console.error("Error fetching stadiums:", err);
        if (err.response?.status === 401) {
          setError("เซสชันหมดอายุ กรุณาเข้าสู่ระบบใหม่");
        } else if (err.response?.status === 404) {
          setStadiums([]);
        } else {
          setError("เกิดข้อผิดพลาดในการโหลดข้อมูลสนามกีฬา");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchStadiums();
  }, [API_BASE_URL]);

  const handleReLogin = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
    sessionStorage.removeItem('token');
    sessionStorage.removeItem('userId');
    router.push("/login");
  };

  const renderStatus = (status) => {
    const statusStyles = {
      'อนุมัติแล้ว': 'text-green-600 bg-green-100',
      'รออนุมัติ': 'text-yellow-600 bg-yellow-100',
      'ไม่อนุมัติ': 'text-red-600 bg-red-100'
    };
    return (
      <span className={`${statusStyles[status] || 'text-gray-600 bg-gray-100'} text-lg font-semibold px-3 py-1 rounded-full`}>
        สถานะ: {status}
      </span>
    );
  };

  const handleDeleteClick = (stadium) => {
    setSelectedStadium(stadium);
    setShowDeleteModal(true);
    setConfirmName("");
  };

  const handleConfirmDelete = async () => {
    if (confirmName !== selectedStadium.stadium_name) {
      alert("ชื่อสนามที่ป้อนไม่ตรงกับชื่อสนามที่ต้องการลบ");
      return;
    }

    try {
      const token = localStorage.getItem('token') || sessionStorage.getItem('token');
      await axios.delete(`${API_BASE_URL}/api/sox/stadiums/${selectedStadium.id}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      setStadiums(stadiums.filter(stadium => stadium.id !== selectedStadium.id));
      setShowDeleteModal(false);
      setSelectedStadium(null);
      setConfirmName("");
      alert("ลบสนามสำเร็จ");
    } catch (err) {
      console.error("Error deleting stadium:", err);
      if (err.response?.status === 404) {
        alert("ไม่พบสนามที่ต้องการลบ");
        setShowDeleteModal(false);
        setSelectedStadium(null);
        setConfirmName("");
        setStadiums(stadiums.filter(stadium => stadium.id !== selectedStadium.id));
      } else {
        alert("เกิดข้อผิดพลาดในการลบสนาม");
      }
    }
  };

  const handleCancelDelete = () => {
    setShowDeleteModal(false);
    setSelectedStadium(null);
    setConfirmName("");
  };

  return (
    <div className="w-full min-h-screen flex flex-col items-center bg-gradient-to-b from-gray-50 to-gray-100">
      <Tabbar />
      <div className="w-full max-w-6xl py-16 px-6">
        <h2 className="text-4xl font-extrabold text-gray-900 flex items-center mb-8 mt-12 animate-fade-in">
          <div className="bg-black rounded-lg p-2 shadow-md">
            <img src="/picturesoc/stadium.svg" alt="สนามกีฬา" className="w-24 h-24" />
          </div>
          <span className="ml-6 tracking-tight">สนามกีฬาของฉัน</span>
        </h2>

        {loading && (
          <div className="text-center py-12 bg-white rounded-2xl shadow-md">
            <p className="text-xl text-gray-700 animate-pulse">กำลังโหลดข้อมูล...</p>
          </div>
        )}

        {error && !loading && (
          <div className="text-center py-12 bg-red-50 rounded-2xl shadow-md p-6">
            <p className="text-lg text-red-700 mb-4">{error}</p>
            <div className="flex justify-center space-x-4">
              <button onClick={() => window.location.reload()} className="bg-blue-600 text-white px-5 py-2 rounded-full shadow-md hover:bg-blue-700 transition-all duration-200">
                ลองใหม่
              </button>
              <button onClick={handleReLogin} className="bg-green-600 text-white px-5 py-2 rounded-full shadow-md hover:bg-green-700 transition-all duration-200">
                เข้าสู่ระบบใหม่
              </button>
            </div>
          </div>
        )}

        {!loading && !error && stadiums.length === 0 && (
          <div>
          <AddStadiumButton />
          </div>
        )}

        {!loading && !error && stadiums.length > 0 && (
          <>
            {stadiums.map((stadium) => (
              <div
                key={stadium.id}
                className="bg-gray-200 border border-gray-300 shadow-xl rounded-3xl overflow-hidden flex flex-col md:flex-row p-6 mt-8 gap-6 transform hover:shadow-2xl transition-all duration-300"
              >
                <div className="flex items-center justify-center w-full md:w-1/2">
                  <img
                    src={stadium.stadium_image || "/pictureowner/stadium-image.png"}
                    alt={stadium.stadium_name}
                    className="object-cover rounded-xl h-80 w-full transform hover:scale-105 transition-transform duration-300"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = "/pictureowner/stadium-image.png";
                    }}
                  />
                </div>
                <div className="flex flex-col justify-between w-full md:w-1/2 bg-white rounded-xl p-6">
                  <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <h3 className="text-3xl text-gray-900 font-extrabold tracking-tight">สนาม: {stadium.stadium_name}</h3>
                    {renderStatus(stadium.stadium_status)}
                  </div>
                  <p className="text-gray-700 text-lg mt-3">ที่ตั้ง: {stadium.stadium_address}</p>
                  <div className="mt-4 text-gray-800 text-lg">
                    <p className="text-xl font-semibold text-gray-900 mb-2">ประเภทกีฬา</p>
                    {stadium.sports_types && stadium.sports_types.length > 0 ? (
                      stadium.sports_types.map((sport, idx) => (
                        <p key={idx} className="text-gray-700">{sport.name} - {sport.count} สนาม</p>
                      ))
                    ) : (
                      <p className="text-gray-500 italic">ยังไม่ได้เพิ่มประเภทกีฬา</p>
                    )}
                  </div>
                  {(stadium.stadium_status === 'อนุมัติแล้ว' || stadium.stadium_status === 'รออนุมัติ') && (
                    <div className="flex flex-col md:flex-row justify-between items-center border-t border-gray-200 mt-4 pt-4 gap-4">
                      <button
                        className="flex items-center bg-red-600 text-white text-lg px-6 py-2 rounded-full shadow-md w-full md:w-auto hover:bg-red-700 transition-all duration-200"
                        onClick={() => handleDeleteClick(stadium)}
                      >
                        <FaTrash className="mr-2 text-xl" /> ลบสนาม
                      </button>
                      <button
                        className="flex items-center bg-gray-900 text-white text-lg px-6 py-2 rounded-full shadow-md w-full md:w-auto hover:bg-gray-800 transition-all duration-200"
                        onClick={() => {
                          localStorage.setItem('stadium_id', stadium.id);
                          router.push(`/my-stadium/add-field`);
                        }}
                      >
                        <FaPlus className="mr-2 text-xl" /> เพิ่มจำนวนสนาม
                      </button>
                    </div>
                  )}
                  {stadium.stadium_status === 'ไม่อนุมัติ' && (
                    <div className="border-t border-gray-200 mt-4 pt-4">
                      <button
                        className="flex items-center bg-red-600 text-white text-lg px-6 py-2 rounded-full shadow-md w-full md:w-auto hover:bg-red-700 transition-all duration-200"
                        onClick={() => handleDeleteClick(stadium)}
                      >
                        <FaTrash className="mr-2 text-xl" /> ลบสนาม
                      </button>
                      {stadium.rejection_reason && (
                        <p className="text-gray-600 mt-4 text-sm">เหตุผล: {stadium.rejection_reason}</p>
                      )}
                    </div>
                  )}
                </div>
              </div>
            ))}
            <AddStadiumButton />
          </>
        )}
      </div>

      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 animate-fade-in">
          <div className="bg-white p-6 rounded-2xl shadow-2xl w-full max-w-md transform scale-95 animate-modal-in">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">ยืนยันการลบสนาม</h3>
            <p className="mb-4 text-gray-700">กรุณาป้อนชื่อสนาม "<span className="font-semibold text-gray-900">{selectedStadium?.stadium_name}</span>" เพื่อยืนยันการลบ</p>
            <input
              type="text"
              value={confirmName}
              onChange={(e) => setConfirmName(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-red-500 transition-all duration-200"
              placeholder="ป้อนชื่อสนาม"
            />
            <div className="flex justify-end gap-4">
              <button
                onClick={handleCancelDelete}
                className="bg-gray-600 text-white px-5 py-2 rounded-full shadow-md hover:bg-gray-700 transition-all duration-200"
              >
                ยกเลิก
              </button>
              <button
                onClick={handleConfirmDelete}
                className="bg-red-600 text-white px-5 py-2 rounded-full shadow-md hover:bg-red-700 transition-all duration-200"
              >
                ยืนยัน
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SportField;