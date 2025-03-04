"use client";

import React, { useState } from "react";
import { FaPlus } from "react-icons/fa";
import { useRouter } from "next/navigation";
import Tabbar from "../components/tab";// ✅ Import Sidebar

const SportField = () => {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false); // ✅ สร้าง state สำหรับ sidebar

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

    {/* สนามกีฬา Card */}
    <div className="bg-gray-200 border-4 border-gray-300 shadow-2xl rounded-2xl overflow-hidden flex flex-col md:flex-row p-6 relative mt-8 gap-6">
      {/* รูปภาพ */}
      <div className="flex items-center justify-center w-full md:w-1/2">
        <img src="/pictureowner/stadium-image.png" alt="สนามกีฬา" 
         className="object-cover rounded-xl h-80 w-full" />
      </div>

      {/* ส่วนข้อมูล */}
      <div className="flex flex-col justify-between w-full md:w-1/2 bg-white rounded-xl p-6 relative">
        {/* ชื่อสนาม & สถานะ */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
          <h3 className="text-3xl text-black font-extrabold">สนาม : AVOCADO</h3>
          <span className="text-green-500 text-xl font-bold mt-3 md:mt-0">สถานะ : อนุมัติแล้ว</span>
        </div>

        {/* ที่ตั้ง */}
        <p className="text-gray-700 text-xl mt-2">ที่ตั้ง : 55/5 หมู่ 10 ซอย12 บ้านสวน จ.ชลบุรี 20000</p>

        {/* ประเภทกีฬา */}
        <div className="mt-4 text-gray-800 text-lg">
          <p> แบดมินตัน - 3 สนาม</p>
          <p> ปิงปอง - 5 สนาม</p>
          <p> บาสเกตบอล - 2 สนาม</p>
          <p> ฟุตบอล - 2 สนาม</p>
          <p> วอลเลย์บอล - 2 สนาม</p>
          <p> ฟุตซอล - 2 สนาม</p>
        </div>

        {/* ปุ่มเพิ่มจำนวนสนาม */}
        <div className="flex justify-center md:justify-end mt-6 md:mt-0">
          <button className="flex items-center bg-black text-white text-xl px-6 py-2 rounded-xl w-full md:w-auto"
            onClick={() => router.push("/my-stadium/add-field")}>
            <FaPlus className="mr-3 text-2xl" /> เพิ่มจำนวนสนาม
          </button>
        </div>
      </div>
    </div>

    {/* ปุ่มเพิ่มสนามกีฬา */}
    <div className="mt-10 flex justify-center">
      <button className="w-full max-w-6xl bg-gray-200 border-4 border-gray-300 shadow-2xl rounded-2xl flex items-center justify-center h-56"
        onClick={() => router.push("/my-stadium/add-stadium")}>
        <div className="flex flex-col items-center">
          <FaPlus className="text-5xl text-black mb-3" />
          <span className="text-2xl font-semibold">เพิ่มสนามกีฬา</span>
        </div>
      </button>
    </div>
  </div>
</div>


  );
};

export default SportField;
