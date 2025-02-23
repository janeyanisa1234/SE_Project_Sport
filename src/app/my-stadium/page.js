"use client";

import React, { useState } from "react";
import { FaPlus } from "react-icons/fa";
import { useRouter } from "next/navigation";
import Tabbar from "../components/tab";// ✅ Import Sidebar

const SportField = () => {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false); // ✅ สร้าง state สำหรับ sidebar

  return (
    <div className="w-full min-h-screen flex flex-col items-center"
      style={{ 
        backgroundImage: "url('/pictureowner/bg.png')", 
        backgroundSize: "cover", 
        backgroundPosition: "center" 
      }}
    >
      <Tabbar/>
      <br></br><br></br>
      {/* Content */}
      <div className="w-full max-w-4xl py-6 px-4">
        <h2 className="text-2xl font-semibold text-black flex items-center mb-4">
          <img src="/pictureowner/icon-stadium.png" alt="สนามกีฬา" className="w-12 h-12 mr-2" />
          สนามกีฬาของฉัน
        </h2>

        {/* สนามกีฬา Card */}
        <div className="bg-white shadow-lg rounded-lg overflow-hidden flex flex-col md:flex-row p-4 relative mt-6">
          <img src="/pictureowner/stadium-image.png" alt="สนามกีฬา" className="w-full md:w-1/3 h-40 object-cover rounded-lg" />
          <div className="w-full md:w-2/3 px-4 mt-4 md:mt-0">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
              <h3 className="text-xl text-black font-bold">สนาม : AVOCADO</h3>
              <span className="text-green-500 font-semibold mt-2 md:mt-0">สถานะ : อนุมัติแล้ว</span>
            </div>
            <p className="text-gray-600 mt-1">ที่ตั้ง : 55/5 หมู่ 10 ซอย12 บ้านสวน จ.ชลบุรี 20000</p>
            <div className="mt-2 text-gray-700 text-sm">
              <p>แบดมินตัน  -  3 สนาม</p>
              <p>ปิงปอง  -  5 สนาม</p>
              <p>บาสเกตบอล  -  2 สนาม</p>
              <p>ฟุตบอล  -  2 สนาม</p>
              <p>วอลเลย์บอล  -  2 สนาม</p>
              <p>ฟุตซอล  -  2 สนาม</p>
            </div>
          </div>
          <div className="absolute right-4 bottom-4">
            <button className="flex items-center bg-black text-white px-4 py-2 rounded-lg"
              onClick={() => router.push("/my-stadium/add-field")}>
              <FaPlus className="mr-2" /> เพิ่มจำนวนสนาม
            </button>
          </div>
        </div>

        {/* ปุ่มเพิ่มสนามกีฬา */}
        <div className="mt-6 flex justify-center">
          <button className="w-full max-w-4xl bg-white border-2 border-gray-300 shadow-lg rounded-lg flex items-center justify-center h-40"
            onClick={() => router.push("/my-stadium/add-stadium")}>
            <div className="flex flex-col items-center">
              <FaPlus className="text-3xl text-black mb-2" />
              <span className="text-lg">เพิ่มสนามกีฬา</span>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
};

export default SportField;
