"use client";

import React, { useState, useEffect } from "react";
import axios from "axios";
import Tabbar from "../../../../Tab/tab";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

export default function QRPaymentPage({ width = "950px", height = "600px" }) {
  const searchParams = useSearchParams();
  const bookingId = searchParams.get("bookingId");
  const amount = searchParams.get("price");
  const userId = searchParams.get("userId");

  const [qrCodeUrl, setQrCodeUrl] = useState(null);
  const [totalAmount, setTotalAmount] = useState(null);
  const [error, setError] = useState(null);
  const [timeLeft, setTimeLeft] = useState(300);

  useEffect(() => {
    const storedUserId = localStorage.getItem("userId");
    if (!storedUserId || storedUserId !== userId) {
      console.error("User ID mismatch or not logged in");
      setError("User ID ไม่ตรงหรือยังไม่ได้ล็อกอิน");
      return;
    }

    const fetchQRCode = async () => {
      try {
        const requestAmount = parseFloat(amount);
        if (!requestAmount) throw new Error("Invalid amount");
        const response = await axios.post(
          "http://localhost:5000/generateQR",
          { amount: requestAmount, mobileNumber: "0853186887" },
          { headers: { "Content-Type": "application/json" } }
        );
        setQrCodeUrl(response.data.qr);
        setTotalAmount(response.data.amount);
      } catch (error) {
        console.error("Error fetching QR Code:", error);
        setError(`ไม่สามารถสร้าง QR Code ได้: ${error.response?.data?.message || error.message}`);
      }
    };

    fetchQRCode();
  }, [amount, userId]);

  useEffect(() => {
    if (timeLeft <= 0) return;
    const timer = setInterval(() => setTimeLeft((prev) => prev - 1), 1000);
    return () => clearInterval(timer);
  }, [timeLeft]);

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, "0")}:${remainingSeconds.toString().padStart(2, "0")}`;
  };

  const handleTransactionIdChange = (e) => {
    setTransactionId(e.target.value);
  };

  return (
    <>
      <Tabbar />
      <div
        className="relative w-full h-screen bg-cover bg-center flex flex-col"
        style={{ backgroundImage: "url('/picturesoc/bg_0.png')" }}
      >
        <div className="flex flex-1 items-center justify-center px-4">
          <div
            className="bg-white border border-gray-300 rounded-xl p-8 shadow-2xl text-center relative"
            style={{ width, height }}
          >
            <button className="absolute top-6 right-6 text-gray-500 text-3xl hover:text-red-500 transition">
              ✖
            </button>

            {error ? (
              <p className="text-red-500 my-8">{error}</p>
            ) : qrCodeUrl ? (
              <>
                <img src={qrCodeUrl} alt="QR Code" className="w-60 h-60 mx-auto my-8" />
                <p className="text-xl text-gray-700 font-semibold">
                  ยอดชำระเงิน: <span className="text-green-500 font-bold">{totalAmount} บาท</span>
                </p>
              </>
            ) : (
              <p className="text-gray-500 my-8">กำลังสร้าง QR Code...</p>
            )}

            <p className="text-2xl text-gray-700 font-semibold">
              กรุณาชำระเงินภายใน{" "}
              <span className="text-red-500 font-bold">
                {timeLeft > 0 ? formatTime(timeLeft) : "หมดเวลา"}
              </span>
            </p>

            {timeLeft > 0 && qrCodeUrl && (  
              <Link
                href={{
                  pathname: "/Homepage/Search/Select/payment-qr/payment-confirm",
                  query: {
                    bookingId,
                    price: totalAmount,
                    userId,
                    stadiumName: searchParams.get("stadiumName"),
                    sportType: searchParams.get("sportType"),
                    courtNumber: searchParams.get("courtNumber"),
                    date: searchParams.get("date"),
                    timeSlots: searchParams.get("timeSlots"),
                    id_stadium: searchParams.get("id_stadium"),
                    id_court: searchParams.get("id_court"),
                  },
                }}
              >
                <button className="mt-10 bg-green-500 hover:bg-green-600 text-white text-2xl px-8 py-4 rounded-xl transition">
                  ยืนยัน
                </button>
              </Link>
            )}
          </div>
        </div>
      </div>
    </>
  );
}