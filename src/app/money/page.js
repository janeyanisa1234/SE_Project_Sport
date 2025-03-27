"use client";
import "./dash.css";
import React, { useState, useEffect } from "react";
import axios from "axios";
import Image from "next/image";
import Tabbar from "../components/tab";
import { useRouter } from "next/navigation";
 
const API_BASE_URL = "http://localhost:5000/api/ping";
 
const Page = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [summaryData, setSummaryData] = useState({
    totalAmount: 0,
    serviceFee: 0,
    netAmount: 0
  });
  const [paymentStatus, setPaymentStatus] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedMonth] = useState("02"); // Fixed to February
  const [selectedYear] = useState(() => {
    return new Date().getFullYear();
  });
 
  const router = useRouter();
 
  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
    document.body.classList.toggle("sidebar-open", !isSidebarOpen);
  };
 
  const fetchData = async (month, year) => {
    try {
      setLoading(true);
      const userId = localStorage.getItem("userId");
 
      if (!userId) {
        console.error("User ID not found");
        setError("ไม่พบข้อมูลผู้ใช้ กรุณาเข้าสู่ระบบใหม่");
        return;
      }
 
      // Fetch summary data
      const summaryResult = await axios.get(`${API_BASE_URL}/summary`, {
        params: { month, year, ownerId: userId }
      });
 
      setSummaryData(summaryResult.data);
 
      // Fetch payment status data
      const statusResult = await axios.get(`${API_BASE_URL}/payment-status`, {
        params: { month, year, ownerId: userId }
      });
 
      const filteredData = statusResult.data.filter(item => item.id_owner === userId);
      // Filter out the row where totalBeforeFee and totalAfterFee are both 0
      const filteredPaymentStatus = filteredData.filter(payment => {
        return !(payment.totalBeforeFee === 0 && payment.totalAfterFee === 0);
      });
      setPaymentStatus(filteredPaymentStatus);
    } catch (error) {
      console.error("Error fetching data:", error);
      setError("เกิดข้อผิดพลาดในการดึงข้อมูล: " + (error.response?.data?.error || error.message));
    } finally {
      setLoading(false);
    }
  };
 
  useEffect(() => {
    fetchData(selectedMonth, selectedYear);
  }, [selectedMonth, selectedYear]);
 
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("th-TH").format(amount);
  };
 
  const getMonthName = (month) => {
    const months = [
      "มกราคม", "กุมภาพันธ์", "เมษายน", "พฤษภาคม", "มิถุนายน",
      "กรกฎาคม", "สิงหาคม", "กันยายน", "ตุลาคม", "พฤศจิกายน", "ธันวาคม"
    ];
    return months[parseInt(month) - 1];
  };
 
  const displayDate = (dateValue) => {
    if (!dateValue || dateValue === "-" || dateValue === "null" || dateValue === "undefined") {
      return "-";
    }
    return dateValue;
  };
 
  return (
    <div className="min-h-screen bg-white text-gray-900 flex flex-col font-inter">
      <Tabbar />
 
      <main className="w-full mx-auto p-8 flex-grow">
        <br />
        <br />
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-bold">สรุปยอดประจำเดือน {getMonthName(selectedMonth)} {parseInt(selectedYear) + 543}</h1>
        </div>
 
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            <p>{error}</p>
          </div>
        )}
 
        {loading ? (
          <div className="flex justify-center items-center p-8">
            <p className="text-xl">กำลังโหลดข้อมูล...</p>
          </div>
        ) : (
          <>
            <h2 className="text-xl font-bold mt-6">ติดตามสถานะการโอนเงิน</h2>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse border border-gray-800 mt-4">
                <thead>
                  <tr className="bg-gray-200">
                    <th className="border border-gray-800 p-2">ลำดับที่</th>
                    <th className="border border-gray-800 p-2">ระยะเวลา</th>
                    <th className="border border-gray-800 p-2">ยอดเงินรวม</th>
                    <th className="border border-gray-800 p-2">อัพเดท</th>
                    <th className="border border-gray-800 p-2">สถานะ</th>
                  </tr>
                </thead>
                <tbody>
                  {paymentStatus && paymentStatus.length > 0 ? (
                    paymentStatus.map((payment, index) => (
                      <tr key={payment.id || index}>
                        <td className="border border-gray-800 p-2">{index + 1}</td>
                        <td className="border border-gray-800 p-2">{"1-15 ของทุกเดือน"}</td>
                        <td className="border border-gray-800 p-2">{formatCurrency(payment.totalBeforeFee || 0)}</td>
                        <td className="border border-gray-800 p-2">
                          {displayDate(payment.updatedAt)}
                        </td>
                        <td className={`border border-gray-800 p-2 font-bold ${
                          payment.status === "โอนแล้ว" ? "text-green-500" : "text-red-500"
                        }`}>
                          {payment.status || "ยังไม่จ่าย"}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td className="border border-gray-800 p-2">1</td>
                      <td className="border border-gray-800 p-2">1-15 ของทุกเดือน</td>
                      <td className="border border-gray-800 p-2">{formatCurrency(summaryData.totalAmount || 0)}</td>
                      <td className="border border-gray-800 p-2">-</td>
                      <td className="border border-gray-800 p-2 text-red-500 font-bold">ยังไม่จ่าย</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
 
            <table className="w-full border-collapse border border-gray-800 mt-6">
              <thead>
                <tr className="bg-gray-200">
                  <th className="border border-gray-800 p-2">รายการ</th>
                  <th className="border border-gray-800 p-2">จำนวน (บาท)</th>
                </tr>
              </thead>
              <tbody>
                {paymentStatus && paymentStatus.length > 0 ? (
                  (() => {
                    const totalSummary = paymentStatus.reduce(
                      (acc, payment) => {
                        acc.totalBeforeFee += payment.totalBeforeFee || 0;
                        acc.totalAfterFee += payment.totalAfterFee || 0;
                        return acc;
                      },
                      { totalBeforeFee: 0, totalAfterFee: 0 }
                    );
 
                    const calculatedServiceFee = totalSummary.totalBeforeFee * 0.1;
 
                    return (
                      <React.Fragment>
                        <tr>
                          <td className="border border-gray-800 p-2">ยอดจองสนามรวม</td>
                          <td className="border border-gray-800 p-2">{formatCurrency(totalSummary.totalBeforeFee)}</td>
                        </tr>
                        <tr>
                          <td className="border border-gray-800 p-2">หัก 10%</td>
                          <td className="border border-gray-800 p-2">-{formatCurrency(calculatedServiceFee)}</td>
                        </tr>
                        <tr className="font-bold">
                          <td className="border border-gray-800 p-2">รวมทั้งหมด</td>
                          <td className="border border-gray-800 p-2">{formatCurrency(totalSummary.totalBeforeFee - calculatedServiceFee)}</td>
                        </tr>
                      </React.Fragment>
                    );
                  })()
                ) : (
                  <tr>
                    <td className="border border-gray-800 p-2" colSpan="2">ไม่มีข้อมูลการชำระเงิน</td>
                  </tr>
                )}
              </tbody>
            </table>
 
            <p className="text-red-500 font-bold mt-2">
              หมายเหตุ: ระบบจะทำการโอนเงินหลังจากหักค่าบริการหลังการขาย ภายในวันที่ 1-15 ของทุกเดือน
              โดยระบบจะทำการโอนเงินเข้าบัญชีธนาคารของท่านที่ได้ลงทะเบียนไว้ในระบบเท่านั้น
            </p>
          </>
        )}
      </main>
    </div>
  );
};
 
export default Page;