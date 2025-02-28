"use client";
import "./dash.css";
import React from "react";
import Tabbar from "../components/tab";

const TransactionReceipt = () => {
  return (
    <div className="min-h-screen bg-gray-100 text-gray-900 flex flex-col font-inter">
      <Tabbar />
      <main className="w-full mx-auto p-8 flex-grow mt-20">
        <h1 className="text-2xl font-bold mb-24">หลักฐานการโอนเงิน</h1>
        
        <div className="bg-white p-6 rounded-lg shadow-md max-w-md mx-auto border border-gray-300 mt-16">
          <h2 className="text-xl font-semibold text-center mb-4">รายละเอียด</h2>
          <div className="text-center">
            <p className="text-lg font-bold">หลักฐานการโอนเงิน</p>
            <p className="text-gray-700">รับเงินจาก <span className="font-semibold">SPORTFLOW</span></p>
            <p className="text-gray-700">วันที่ <span className="font-semibold">12 กุมภาพันธ์ 2568</span> เวลา <span className="font-semibold">11:25</span></p>
            <p className="text-xl font-bold mt-4">จำนวน <span className="text-green-600">360,000</span> บาท</p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default TransactionReceipt;