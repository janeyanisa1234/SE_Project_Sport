"use client";
import "./dash.css";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import Tabbar from "../../../../../../components/tab";
import axios from "axios";

const Page = () => {
  const [bookings, setBookings] = useState([]);
  const [openDetails, setOpenDetails] = useState(null);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/history");
        setBookings(response.data);
      } catch (error) {
        console.error("Error fetching booking data:", error);
      }
    };
    fetchBookings();
  }, []);

  const toggleDetails = (index) => {
    setOpenDetails(openDetails === index ? null : index);
  };

  return (
    <div
      className="min-h-screen flex flex-col items-center px-4 md:px-8"
      style={{
        backgroundImage: "url('/pictureping/bg.jpg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <Tabbar />

      <div className="mt-6 text-xl font-bold text-black w-full max-w-6xl text-center relative">
        <div className="flex justify-center items-center gap-2 mt-20">
          <Image src="/pictureping/clock.png" alt="Clock" width={24} height={24} />
          ประวัติการจอง
        </div>
        <div className="absolute bottom-[-5px] left-0 w-full border-b-2 border-gray-500"></div>
      </div>

      <div className="mt-4 w-full max-w-6xl space-y-5">
        {bookings.length > 0 ? (
          bookings.map((booking, index) => (
            <div key={index} className="bg-white rounded-xl shadow-lg p-4 w-full">
              <div
                className={`border-2 rounded-lg p-3 flex items-center justify-between cursor-pointer ${openDetails === index ? 'border-gray-600' : 'border-gray-300'}`}
                onClick={() => toggleDetails(index)}
              >
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 w-full text-center font-semibold text-black">
                  <div>
                    <p className="text-black">สนามกีฬา</p>
                    <p className="font-normal text-[#797777]">{booking.Stadium_name}</p>
                  </div>
                  <div>
                    <p className="text-black">ชนิดของกีฬา</p>
                    <p className="font-normal text-[#797777]">{booking.Sports_type}</p>
                  </div>
                  <div>
                    <p className="text-black">วันที่ทำการจอง</p>
                    <p className="font-normal text-[#797777]">{booking.date}</p>
                  </div>
                  <div>
                    <p className="text-black">ยอดชำระ</p>
                    <p className="font-normal text-[#797777]">{booking.Price} บาท</p>
                  </div>
                </div>
                <Image
                  src="/pictureping/eye.png"
                  alt="View"
                  width={24}
                  height={24}
                  className="cursor-pointer ml-3"
                />
              </div>

              {openDetails === index && (
                <div className="mt-2 p-4 bg-gray-300 rounded-lg w-full">
                  <div className="grid grid-cols-2 gap-4 text-black">
                    <p className="font-bold">สนามที่</p>
                    <p className="text-right ">{booking.Court}</p>
                    <p className="font-bold">วันที่เข้าใช้สนาม</p>
                    <p className="text-right">{booking.date}</p>
                    <p className="font-bold">เวลาเข้าใช้สนาม</p>
                    <p className="text-right ">{booking.Time}</p>
                  </div>
                </div>
              )}
            </div>
          ))
        ) : (
          <p className="text-black text-center mt-4">ไม่มีข้อมูลการจอง</p>
        )}
      </div>
    </div>
  );
};

export default Page;