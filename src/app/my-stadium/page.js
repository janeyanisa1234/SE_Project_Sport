"use client";

// นำเข้าโมดูลและคอมโพเนนต์ที่จำเป็น
import React, { useState, useEffect } from "react";
import { FaPlus } from "react-icons/fa";
import { useRouter } from "next/navigation";
import Tabbar from "../components/tab";
import axios from "axios";

const SportField = () => {
  // สร้างตัวแปร state สำหรับจัดการข้อมูล
  const router = useRouter();
  const [stadiums, setStadiums] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userId, setUserId] = useState(null);

  const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

  // คอมโพเนนต์ปุ่มเพิ่มสนาม
  const AddStadiumButton = () => (
    <div className="mt-10 flex justify-center">
      <button
        className="w-full max-w-6xl bg-gray-200 border-4 border-gray-300 shadow-2xl rounded-2xl flex items-center justify-center h-56"
        onClick={() => router.push("/my-stadium/add-stadium")}
      >
        <div className="flex flex-col items-center">
          <FaPlus className="text-5xl text-black mb-3" />
          <span className="text-2xl font-semibold">เพิ่มสนามกีฬา</span>
        </div>
      </button>
    </div>
  );

  // ฟังก์ชันดึง userId จากที่เก็บข้อมูลต่างๆ
  const getUserId = () => {
    const storedUserId = localStorage.getItem('userId');
    if (storedUserId) {
      console.log("Found userId in localStorage:", storedUserId);
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
    // ... (ตรรกะการดึง userId อื่นๆ คงไว้เหมือนเดิม)
    return null;
  };

  // ดึงข้อมูลสนามกีฬาเมื่อคอมโพเนนต์โหลด
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

        console.log("Fetching stadiums for user ID:", extractedUserId);
        const response = await axios.get(`${API_BASE_URL}/api/sox/stadiums/${extractedUserId}`, {
          headers: {
            'Authorization': `Bearer ${token}`
          },
          timeout: 10000
        });

        console.log("API Response:", response.data);
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

  // ฟังก์ชันจัดการการล็อกอินใหม่
  const handleReLogin = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
    sessionStorage.removeItem('token');
    sessionStorage.removeItem('userId');
    router.push("/login");
  };

  // ฟังก์ชันแสดงสถานะสนามด้วยสี
  const renderStatus = (status) => {
    const statusColors = {
      'อนุมัติแล้ว': 'text-green-500',
      'รออนุมัติ': 'text-yellow-500',
      'ไม่อนุมัติ': 'text-red-500'
    };
    return (
      <span className={`${statusColors[status] || 'text-gray-500'} text-xl font-bold`}>
        สถานะ : {status}
      </span>
    );
  };

  // ส่วนการแสดงผล UI
  return (
    <div className="w-full min-h-screen flex flex-col items-center bg-white">
      <Tabbar />
      <br /><br />
      <div className="w-full max-w-6xl py-10 px-6">
        <h2 className="text-4xl font-bold text-black flex items-center mb-6">
          <div className="bg-black rounded-md px-2 scale-y-90 inline-block">
            <img src="/picturesoc/stadium.svg" alt="สนามกีฬา" className="w-24 h-24" />
          </div>
          <span className="ml-4">สนามกีฬาของฉัน</span>
        </h2>

        {/* สถานะการโหลด */}
        {loading && (
          <div className="text-center py-10">
            <p className="text-xl text-gray-600">กำลังโหลดข้อมูล...</p>
          </div>
        )}

        {/* ข้อความแจ้งข้อผิดพลาด */}
        {error && !loading && (
          <>
            <div className="text-center py-10 bg-red-100 rounded-lg p-6">
              <p className="text-lg text-red-600 mb-4">{error}</p>
              <div className="flex justify-center space-x-4">
                <button onClick={() => window.location.reload()} className="bg-blue-500 text-white px-4 py-2 rounded-lg">
                  ลองใหม่
                </button>
                <button onClick={handleReLogin} className="bg-green-500 text-white px-4 py-2 rounded-lg">
                  เข้าสู่ระบบใหม่
                </button>
              </div>
            </div>
            <AddStadiumButton />
          </>
        )}

        {/* กรณีไม่มีสนาม */}
        {!loading && !error && stadiums.length === 0 && (
          <>
            <div className="text-center py-10 bg-gray-200 rounded-lg p-4 border-4 border-gray-300 shadow-2xl rounded-2xl">
              <p className="text-xl text-gray-600 mb-4">ยังไม่ได้เพิ่มประเภทกีฬา</p>
              <p className="text-gray-500 mb-6">คลิกปุ่มด้านล่างเพื่อเพิ่มสนามกีฬาของคุณ</p>
            </div>
            <AddStadiumButton />
          </>
        )}

        {/* แสดงรายการสนาม */}
        {!loading && !error && stadiums.length > 0 && (
          <>
            {stadiums.map((stadium) => (
              <div
                key={stadium.id}
                className="bg-gray-200 border-4 border-gray-300 shadow-2xl rounded-2xl overflow-hidden flex flex-col md:flex-row p-6 relative mt-8 gap-6"
              >
                <div className="flex items-center justify-center w-full md:w-1/2">
                  <img
                    src={stadium.stadium_image || "/pictureowner/stadium-image.png"}
                    alt={stadium.stadium_name}
                    className="object-cover rounded-xl h-80 w-full"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = "/pictureowner/stadium-image.png";
                    }}
                  />
                </div>
                <div className="flex flex-col justify-between w-full md:w-1/2 bg-white rounded-xl p-6 relative">
                  <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
                    <h3 className="text-3xl text-black font-extrabold">สนาม : {stadium.stadium_name}</h3>
                    {renderStatus(stadium.stadium_status)}
                  </div>
                  <p className="text-gray-700 text-xl mt-2">ที่ตั้ง : {stadium.stadium_address}</p>
                  <div className="mt-4 text-gray-800 text-lg">
                    <p className="text-xl font-semibold text-black mb-2">ประเภทกีฬา</p>
                    {stadium.sports_types && stadium.sports_types.length > 0 ? (
                      stadium.sports_types.map((sport, idx) => (
                        <p key={idx}>{sport.name} - {sport.count} สนาม</p>
                      ))
                    ) : (
                      <p className="text-gray-500 italic">ยังไม่ได้เพิ่มประเภทกีฬา</p>
                    )}
                  </div>
                  {(stadium.stadium_status === 'อนุมัติแล้ว' || stadium.stadium_status === 'รออนุมัติ') && (
                    <div className="border-t border-gray-300 mt-4 pt-4">
                      <div className="flex justify-center md:justify-end mt-6 md:mt-0">
                        <button
                          className="flex items-center bg-black text-white text-xl px-6 py-2 rounded-xl w-full md:w-auto"
                          onClick={() => {
                            localStorage.setItem('stadium_id', stadium.id);
                            router.push(`/my-stadium/add-field`);
                          }}
                        >
                          <FaPlus className="mr-3 text-2xl" /> เพิ่มจำนวนสนาม
                        </button>
                      </div>
                    </div>
                  )}
                  {stadium.stadium_status === 'ไม่อนุมัติ' && stadium.rejection_reason && (
                    <div className="">
                      <p className="text-gray-600 mt-1">เหตุผล: {stadium.rejection_reason}</p>
                    </div>
                  )}
                </div>
              </div>
            ))}
            <AddStadiumButton />
          </>
        )}
      </div>
    </div>
  );
};

export default SportField;