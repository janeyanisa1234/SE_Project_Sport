"use client";

import "./globals.css";
import React from "react";
import Tabbar from "../../../../Tab/tab";
import Link from "next/link";

const QR = ({ width = "950px", height = "600px" }) => {
  return (
    <>
      <Tabbar/>
    <div
      className="relative w-full h-screen bg-cover bg-center flex flex-col"
      style={{ backgroundImage: "url('/picturesoc/bg_0.png')" }}
    >
      {/* QR Code Box */}
      <div className="flex flex-1 items-center justify-center px-4">
        <div
          className="bg-white border border-gray-300 rounded-xl p-8 shadow-2xl text-center relative"
          style={{ width, height }}
        >
          {/* Close Button */}
          <button className="absolute top-6 right-6 text-gray-500 text-3xl hover:text-red-500 transition">
            ✖
          </button>

          {/* QR Code Image */}
          <img src="/picturesoc/image-QR.svg" alt="QR Code" className="w-60 h-60 mx-auto my-8" />

          {/* Payment Timer Text */}
          <p className="text-2xl text-gray-700 font-semibold">
            กรุณาชำระเงินภายใน <span className="text-red-500 font-bold">15:00</span> นาที
          </p>

          {/* Confirm Button */}

          <Link href={"/Homepage/Search/Select/payment-qr/payment-confirm"}>
            <button className="mt-10 bg-green-500 hover:bg-green-600 text-white text-2xl px-8 py-4 rounded-xl transition">
              ยืนยัน
            </button>
          </Link>
          
        </div>
      </div>
    </div>
    </>
    
  );
};

export default QR;