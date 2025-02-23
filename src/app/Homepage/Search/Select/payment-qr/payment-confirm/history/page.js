"use client";
import "./dash.css";
import React, { useState } from "react";
import Image from "next/image";
import Tabbar from "../../../../../../Tab/tab";

const Page = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false); // คุม Sidebar

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
    document.body.classList.toggle("sidebar-open", !isSidebarOpen);
  };

  const bookings = [
    { field: "AVOCADO", type: "แบดมินตัน", date: "20 มกราคม 2568", price: "150 บาท" },
    { field: "AVOCADO", type: "แบดมินตัน", date: "15 มกราคม 2568", price: "150 บาท" },
    { field: "MAREENONT", type: "แบดมินตัน", date: "14 มกราคม 2568", price: "150 บาท" },
    { field: "AVOCADO", type: "แบดมินตัน", date: "13 มกราคม 2568", price: "150 บาท" },
    { field: "AVOCADO", type: "แบดมินตัน", date: "12 มกราคม 2568", price: "150 บาท" },
    { field: "MAREENONT", type: "แบดมินตัน", date: "11 มกราคม 2568", price: "150 บาท" },
    { field: "AVOCADO", type: "แบดมินตัน", date: "8 มกราคม 2568", price: "150 บาท" },
    { field: "AVOCADO", type: "แบดมินตัน", date: "4 มกราคม 2568", price: "150 บาท" },
  ];

  return (
    <div className="min-h-screen bg-light flex flex-col items-center"
      style={{ backgroundImage: "url('/pictureping/bg.jpg')", backgroundSize: "cover", backgroundPosition: "center" }}>

      <Tabbar/>

      {/*  Title (สีดำ) */}
      <div className="mt-6 text-xl font-bold text-black w-[90%] max-w-4xl text-center relative">
        <div className="flex justify-center items-center gap-2 mt-20">
          <Image src="/pictureping/clock.png" alt="Clock" width={24} height={24} />
          ประวัติการจอง
        </div>
        <div className="absolute bottom-[-5px] left-0 w-full border-b-2 border-gray-500"></div>
      </div>

      {/*  รายการจอง (Responsive) */}
      <div className="mt-4 w-[90%] max-w-4xl space-y-4">
        {bookings.map((booking, index) => (
          <div key={index} className="border border-black rounded-lg p-3 bg-white shadow-md flex items-center justify-between">
            
            {/* ข้อมูลรายการจอง (Grid Responsive) */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 w-full text-center font-semibold text-black">
              <div>
                <p className="text-black">สนามกีฬา</p>
                <p className="font-normal text-[#797777]">{booking.field}</p>
              </div>
              <div>
                <p className="text-black">ชนิดของกีฬา</p>
                <p className="font-normal text-[#797777]">{booking.type}</p>
              </div>
              <div>
                <p className="text-black">วันที่ทำการจอง</p>
                <p className="font-normal text-[#797777]">{booking.date}</p>
              </div>
              <div>
                <p className="text-black">ยอดชำระ</p>
                <p className="font-normal text-[#797777]">{booking.price}</p>
              </div>
            </div>

            {/* รูปตา (eye.png) อยู่ขวาสุด */}
            <Image src="/pictureping/eye.png" alt="View" width={24} height={24} className="cursor-pointer ml-3" />
          </div>
        ))}
      </div>

    </div>
  );
};

export default Page;
