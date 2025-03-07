"use client";

import React, { useState, useEffect } from "react";
import { FaPlus } from "react-icons/fa";
import { useRouter } from "next/navigation";
import Tabbar from "../components/tab";
import axios from "axios";

const SportField = () => {
  const router = useRouter();
  const [stadiums, setStadiums] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userId, setUserId] = useState(null);
  
  // Define API base URL
  const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

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

  // Debug component to help with troubleshooting
  const DebugInfo = () => (
    <div className="mt-4 p-4 bg-gray-100 rounded-lg text-xs">
      <h4 className="font-bold mb-2">Debug Info (จะถูกลบในเวอร์ชันจริง)</h4>
      <p>User ID: {userId || 'ไม่พบ'}</p>
      <p>Token: {localStorage.getItem('token') ? 'มี' : 'ไม่พบ'}</p>
      <p>API URL: {API_BASE_URL}</p>
      <div className="mt-2">
        <button 
          onClick={() => {
            console.log("Stored User ID:", userId);
            console.log("Token:", localStorage.getItem('token'));
            console.log("All localStorage:", { ...localStorage });
            console.log("Stadiums:", stadiums);
          }} 
          className="bg-gray-200 px-2 py-1 rounded mr-2"
        >
          Log Data
        </button>
        <button 
          onClick={() => window.location.reload()} 
          className="bg-gray-200 px-2 py-1 rounded"
        >
          Refresh
        </button>
      </div>
    </div>
  );

  // FIXED getUserId function with better parsing of JSON strings
  const getUserId = () => {
    // Try localStorage first
    const storedUserId = localStorage.getItem('userId');
    
    if (storedUserId) {
      console.log("Found userId in localStorage:", storedUserId);
      // Check if it's a JSON string and extract the ID if needed
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
    
    // Try sessionStorage as fallback
    const sessionUserId = sessionStorage.getItem('userId');
    if (sessionUserId) {
      console.log("Found userId in sessionStorage:", sessionUserId);
      // Check if it's a JSON string and extract the ID if needed
      try {
        if (typeof sessionUserId === 'string' && (sessionUserId.startsWith('{') || sessionUserId.startsWith('['))) {
          const parsedUser = JSON.parse(sessionUserId);
          return parsedUser.id || parsedUser.userId || parsedUser.user_id || sessionUserId;
        }
      } catch (e) {
        console.error("Error parsing stored userId:", e);
      }
      return sessionUserId;
    }
    
    // Try other possible storage keys
    const possibleKeys = ['user_id', 'id', 'user'];
    for (const key of possibleKeys) {
      const value = localStorage.getItem(key) || sessionStorage.getItem(key);
      if (value) {
        console.log(`Found userId using alternative key '${key}':`, value);
        // Check if it's a JSON string and extract the ID if needed
        try {
          if (typeof value === 'string' && (value.startsWith('{') || value.startsWith('['))) {
            const parsedUser = JSON.parse(value);
            return parsedUser.id || parsedUser.userId || parsedUser.user_id || value;
          }
        } catch (e) {
          console.error(`Error parsing userId from key ${key}:`, e);
        }
        return value;
      }
    }
    
    // Try to parse JWT token for user ID
    try {
      const token = localStorage.getItem('token') || sessionStorage.getItem('token');
      if (token) {
        // Extract payload from JWT (without verification)
        const base64Url = token.split('.')[1];
        if (base64Url) {
          const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
          const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
            return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
          }).join(''));
          
          const payload = JSON.parse(jsonPayload);
          const extractedId = payload.userId || payload.id || payload.user_id || payload.sub;
          
          if (extractedId) {
            console.log("Extracted userId from JWT token:", extractedId);
            // Save it for future use
            localStorage.setItem('userId', extractedId);
            return extractedId;
          }
        }
      }
    } catch (e) {
      console.error("Error parsing JWT token:", e);
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
          console.error("No user ID found in any storage location");
          setError("ไม่พบข้อมูลผู้ใช้ กรุณาเข้าสู่ระบบใหม่");
          setLoading(false);
          return;
        }
        
        const token = localStorage.getItem('token') || sessionStorage.getItem('token');
        if (!token) {
          console.error("No token found");
          setError("ไม่พบข้อมูลการเข้าสู่ระบบ กรุณาเข้าสู่ระบบใหม่");
          setLoading(false);
          return;
        }
        
        console.log("Fetching stadiums for user ID:", extractedUserId);
        console.log("Using API URL:", `${API_BASE_URL}/api/sox/stadiums/${extractedUserId}`);
        
        // FIXED API call with proper error handling
        const response = await axios.get(`${API_BASE_URL}/api/sox/stadiums/${extractedUserId}`, {
          headers: {
            'Authorization': `Bearer ${token}`
          },
          // Add timeout to prevent hanging requests
          timeout: 10000
        });
        
        console.log("API Response:", response.data);
        
        if (response.data && response.data.data) {
          setStadiums(response.data.data);
        } else {
          console.warn("API returned empty or unexpected data structure:", response.data);
          setStadiums([]);
        }
      } catch (err) {
        console.error("Error fetching stadiums:", err);
        
        // Provide more detailed error messages based on error type
        if (err.response) {
          // Server responded with error
          console.error("Server error data:", err.response.data);
          if (err.response.status === 401) {
            setError("เซสชันหมดอายุ กรุณาเข้าสู่ระบบใหม่");
          } else if (err.response.status === 404) {
            // Changed from error to empty stadiums with a message
            setStadiums([]);
            console.log("No stadiums found or user is not registered as an owner");
          } else {
            setError(`เกิดข้อผิดพลาดจากเซิร์ฟเวอร์: ${err.response.data.error || err.response.status}`);
          }
        } else if (err.request) {
          // Request made but no response received
          setError("ไม่สามารถเชื่อมต่อกับเซิร์ฟเวอร์ได้ กรุณาตรวจสอบการเชื่อมต่ออินเทอร์เน็ต");
        } else {
          // Error setting up the request
          setError(err.message || "เกิดข้อผิดพลาดในการโหลดข้อมูลสนามกีฬา");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchStadiums();
  }, [API_BASE_URL]);

  // Function to re-login
  const handleReLogin = () => {
    // Clear any stored credentials
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
    sessionStorage.removeItem('token');
    sessionStorage.removeItem('userId');
    
    // Redirect to login page
    router.push("/login");
  };

  // Function to render stadium status with appropriate color
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

  return (
    <div className="w-full min-h-screen flex flex-col items-center bg-white">
      <Tabbar />
      <br /><br />

      {/* Content */}
      <div className="w-full max-w-6xl py-10 px-6">
        <h2 className="text-4xl font-bold text-black flex items-center mb-6">
          <div className="bg-black rounded-md px-2 scale-y-90 inline-block">
            <img src="/picturesoc/stadium.svg" alt="สนามกีฬา" className="w-24 h-24" />
          </div>
          <span className="ml-4">สนามกีฬาของฉัน</span>
        </h2>

        {/* Debug Info - for development only */}
        {process.env.NODE_ENV !== 'production'}

        {/* Loading state */}
        {loading && (
          <div className="text-center py-10">
            <p className="text-xl text-gray-600">กำลังโหลดข้อมูล...</p>
          </div>
        )}

        {/* Error state */}
        {error && !loading && (
          <>
            <div className="text-center py-10 bg-red-100 rounded-lg p-6">
              <p className="text-lg text-red-600 mb-4">{error}</p>
              <div className="flex justify-center space-x-4">
                <button 
                  onClick={() => window.location.reload()} 
                  className="bg-blue-500 text-white px-4 py-2 rounded-lg"
                >
                  ลองใหม่
                </button>
                <button 
                  onClick={handleReLogin} 
                  className="bg-green-500 text-white px-4 py-2 rounded-lg"
                >
                  เข้าสู่ระบบใหม่
                </button>
              </div>
            </div>
            {/* Add Stadium button in error state */}
            <AddStadiumButton />
          </>
        )}

        {/* No stadiums state */}
        {!loading && !error && stadiums.length === 0 && (
          <>
            <div className="text-center py-10 bg-gray-200 rounded-lg p-4 border-4 border-gray-300 shadow-2xl rounded-2xl">
              <p className="text-xl text-gray-600 mb-4">คุณยังไม่มีสนามกีฬา</p>
              <p className="text-gray-500 mb-6">คลิกปุ่มด้านล่างเพื่อเพิ่มสนามกีฬาของคุณ</p>
            </div>
            {/* Add Stadium button already included in this state */}
            <AddStadiumButton />
          </>
        )}

        {/* Stadium cards */}
        {!loading && !error && stadiums.length > 0 && (
          <>
            {stadiums.map((stadium) => (
              <div 
                key={stadium.id} 
                className="bg-gray-200 border-4 border-gray-300 shadow-2xl rounded-2xl overflow-hidden flex flex-col md:flex-row p-6 relative mt-8 gap-6"
              >
                {/* รูปภาพ */}
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

                {/* ส่วนข้อมูล */}
                <div className="flex flex-col justify-between w-full md:w-1/2 bg-white rounded-xl p-6 relative">
                  {/* ชื่อสนาม & สถานะ */}
                  <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
                    <h3 className="text-3xl text-black font-extrabold">สนาม : {stadium.stadium_name}</h3>
                    {renderStatus(stadium.stadium_status)}
                  </div>

                  {/* ที่ตั้ง */}
                  <p className="text-gray-700 text-xl mt-2">ที่ตั้ง : {stadium.stadium_address}</p>

                  {/* ประเภทกีฬา - จะต้องเพิ่มหลังจากมีการเชื่อมต่อตารางประเภทกีฬา */}
                  <div className="mt-4 text-gray-800 text-lg">
                    {stadium.sports_types ? (
                      stadium.sports_types.map((sport, idx) => (
                        <p key={idx}>{sport.name} - {sport.count} สนาม</p>
                      ))
                    ) : (
                      <p className="text-gray-500 italic">ยังไม่ได้เพิ่มประเภทกีฬา</p>
                    )}
                  </div>

                  {/* ปุ่มเพิ่มจำนวนสนาม - เฉพาะสนามที่อนุมัติแล้ว */}
                  {stadium.stadium_status === 'อนุมัติแล้ว' && (
                    <div className="flex justify-center md:justify-end mt-6 md:mt-0">
                      <button 
                        className="flex items-center bg-black text-white text-xl px-6 py-2 rounded-xl w-full md:w-auto"
                        onClick={() => router.push(`/my-stadium/add-field`)}
                      >
                        <FaPlus className="mr-3 text-2xl" /> เพิ่มจำนวนสนาม
                      </button>
                    </div>
                  )}
                  
                  {/* สำหรับสนามที่รออนุมัติ */}
                  {stadium.stadium_status === 'รออนุมัติ' && (
                    <div className="border-t border-gray-300 mt-4 pt-4">
                      <p className="text-yellow-600 font-medium">
                        สนามของคุณอยู่ระหว่างการพิจารณา
                      </p>
                      <div className="flex justify-center md:justify-end mt-6 md:mt-0">
                        <button className="flex items-center bg-black text-white text-xl px-6 py-2 rounded-xl w-full md:w-auto"
                          onClick={() => router.push("/my-stadium/add-field")}>
                          <FaPlus className="mr-3 text-2xl" /> เพิ่มจำนวนสนาม
                      </button>
                    </div>
                    </div>
                  )}
                  
                  {/* สำหรับสนามที่ไม่อนุมัติ */}
                  {stadium.stadium_status === 'ไม่อนุมัติ' && (
                    <div className="border-t border-gray-300 mt-4 pt-4">
                      <p className="text-red-600 font-medium">
                        สนามของคุณไม่ผ่านการอนุมัติ
                      </p>
                      {stadium.rejection_reason && (
                        <p className="text-gray-600 mt-1">
                          เหตุผล: {stadium.rejection_reason}
                        </p>
                      )}
                    </div>
                  )}
                </div>
              </div>
            ))}
            
            {/* Add Stadium button after displaying stadiums */}
            <AddStadiumButton />
          </>
        )}
      </div>
    </div>
  );
};

export default SportField;