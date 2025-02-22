"use client";
import Link from 'next/link';
import React, { useState } from 'react';
import { Lock } from 'lucide-react';
import "./OTPnum.css"; 
import Tabbar from "../../../../Tab/tab"; 
 

const OTPnum = () => {
  const [otp, setOtp] = useState(['', '', '', '', '', '']);

  const handleChange = (element, index) => {
    if (isNaN(element.value)) return;
    const newOtp = [...otp];
    newOtp[index] = element.value;
    setOtp(newOtp);

    if (element.nextSibling && element.value) {
      element.nextSibling.focus();
    }
  };

  return (
           <>
              <Tabbar />
             
    <div className="otp-container">
      <div className="overlay">
        <div className="otp-box">
          <div className="icon-wrapper">
            <Lock size={60} className="icon" />
          </div>
          <h2 className="title">กรุณาใส่ OTP ของคุณ</h2>

          <div className="otp-input-group">
            {otp.map((value, index) => (
              <input
                key={index}
                type="text"
                maxLength="1"
                className="otp-input"
                value={value}
                onChange={(e) => handleChange(e.target, index)}
              />
            ))}
          </div>

            <Link href={"/Info/Infochange/EmailInput/OTPnum/ChangePassword"}>
              <button className="otp-button" onClick={() => alert(`OTP ที่กรอกคือ: ${otp.join('')}`)}>
              ยืนยัน
              </button>
            </Link>
          
        </div>
      </div>
    </div>
    </>
  );
};

export default OTPnum;
