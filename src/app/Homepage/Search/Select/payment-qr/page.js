"use client";

import "./globals.css";
import React, { useState, useEffect } from "react";
import Tabbar from "../../../../Tab/tab";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

const QR = ({ width = "950px", height = "600px" }) => {
  const searchParams = useSearchParams();
  const amount = searchParams.get("amount"); // รับ amount จาก query string
  const [qrCodeUrl, setQrCodeUrl] = useState(null);
  const [totalAmount, setTotalAmount] = useState(null);
  const [error, setError] = useState(null);
  const [timeLeft, setTimeLeft] = useState(300); // 15 นาที = 900 วินาที

  // Fetch QR Code
  useEffect(() => {
    const fetchQRCode = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/generateQR', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            amount: parseFloat(amount) || 100.50,
            mobileNumber: '0853186887',
          }),
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        setQrCodeUrl(data.qr);
        setTotalAmount(data.amount);
      } catch (error) {
        console.error('Error fetching QR Code:', error);
        setError('ไม่สามารถสร้าง QR Code ได้ กรุณาลองใหม่');
      }
    };

    if (amount) fetchQRCode();
  }, [amount]);

  // Countdown Timer
  useEffect(() => {
    if (timeLeft <= 0) return; // หยุดเมื่อถึง 0

    const timer = setInterval(() => {
      setTimeLeft((prevTime) => prevTime - 1);
    }, 1000); // อัปเดตทุก 1 วินาที

    // Cleanup interval เมื่อ component unmount หรือ timeLeft เปลี่ยน
    return () => clearInterval(timer);
  }, [timeLeft]);

  // แปลงวินาทีเป็น MM:SS
  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, "0")}:${remainingSeconds.toString().padStart(2, "0")}`;
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

            {timeLeft > 0 ? (
              <Link href="/Homepage/Search/Select/payment-qr/payment-confirm">
                <button className="mt-10 bg-green-500 hover:bg-green-600 text-white text-2xl px-8 py-4 rounded-xl transition">
                  ยืนยัน
                </button>
              </Link>
            ) : (
              <p className="mt-10 text-red-500 font-semibold">หมดเวลาชำระเงิน กรุณาเริ่มใหม่</p>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default QR;