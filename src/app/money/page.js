"use client";
import "./dash.css";

import React, { useState } from "react";
import Image from "next/image";
import Tabbar from "../components/tab";
import { useRouter } from "next/navigation";

const Page = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const router = useRouter();
  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
    document.body.classList.toggle("sidebar-open", !isSidebarOpen);
  };

  return (
    <div className="min-h-screen bg-white text-gray-900 flex flex-col font-inter">
      <Tabbar/>

      {/* Content */}
      <main className="w-full mx-auto p-8 flex-grow">
      <br>
      </br>
      <br>
      </br>
        <h1 className="text-2xl font-bold mb-4">สรุปยอดประจำเดือนธันวาคม 2567</h1>
        <table className="w-full border-collapse border border-gray-800">
          <thead>
            <tr className="bg-gray-200">
              <th className="border border-gray-800 p-2">รายการ</th>
              <th className="border border-gray-800 p-2">จำนวน (บาท)</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="border border-gray-800 p-2">ยอดจองสนาม</td>
              <td className="border border-gray-800 p-2">400,000</td>
            </tr>
            <tr>
              <td className="border border-gray-800 p-2">หัก 10%</td>
              <td className="border border-gray-800 p-2">-40,000</td>
            </tr>
            <tr className="font-bold">
              <td className="border border-gray-800 p-2">รวม</td>
              <td className="border border-gray-800 p-2">360,000</td>
            </tr>
          </tbody>
        </table>

        {/* ✅ เพิ่มข้อความหมายเหตุสีแดง */}
        <p className="text-red-500 font-bold mt-2">
          หมายเหตุ: ระบบจะทำการโอนเงินหลังจากหักค่าบริการหลังการขาย ภายในวันที่ 1-15 ของทุกเดือน 
          โดยระบบจะทำการโอนเงินเข้าบัญชีธนาคารของท่านที่ได้ลงทะเบียนไว้ในระบบเท่านั้น
        </p>

        <h2 className="text-xl font-bold mt-6">ติดตามสถานะการโอนเงิน</h2>
        <table className="w-full border-collapse border border-gray-800 mt-4">
          <thead>
            <tr className="bg-gray-200">
              <th className="border border-gray-800 p-2">ลำดับที่</th>
              <th className="border border-gray-800 p-2">ระยะเวลา</th>
              <th className="border border-gray-800 p-2">ยอดก่อนหัก %</th>
              <th className="border border-gray-800 p-2">ยอดหลังหัก %</th>
              <th className="border border-gray-800 p-2">อัพเดท</th>
              <th className="border border-gray-800 p-2">สถานะ</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="border border-gray-800 p-2">1</td>
              <td className="border border-gray-800 p-2">1-15 ของทุกเดือน</td>
              <td className="border border-gray-800 p-2">400,000</td>
              <td className="border border-gray-800 p-2">360,000</td>
              <td className="border border-gray-800 p-2">-</td>
              <td className="border border-gray-800 p-2 text-red-500 font-bold">ยังไม่จ่าย</td>
            </tr>
          </tbody>
        </table>
      </main>
    </div>
  );
};

export default Page;
