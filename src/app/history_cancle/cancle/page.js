"use client";
 
import "./home.css";
import React, { useState } from "react";
import Link from "next/link";
import Tabbar from "../Tab/tab.js";
 
export default function Page() {
 
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [selectedReasons, setSelectedReasons] = useState([]);
 
  const handleCheckboxChange = (event) => {
    const { value, checked } = event.target;
    setSelectedReasons((prev) =>
      checked ? [...prev, value] : prev.filter((reason) => reason !== value)
    );
  };
 
  const Popup = () => {
    setIsPopupOpen(!isPopupOpen);
  };
 
  return (
    <>
      <Tabbar />
      <br />
 
      <h1 className="Header">
        <img src="/Bin.svg" alt="iconbin" className="iconbin" />
        ยกเลิกการจอง
      </h1>
 
      <br />
      <div className="line">
        <hr style={{ border: "1px solid gray" }} />
      </div>
 
      <br />
      <div className="de">
        <Link href="/history_cancle/detail" passHref>
          รายละเอียดการเงิน
        </Link>
      </div>
 
      <div className="section">
        <span>สนามกีฬา</span>
        <span>ชนิดของกีฬา</span>
        <span>วันที่ทำการจอง</span>
        <span>ยอดชำระ</span>
        <img src="/remove.svg" alt="iconremove" className="iconRemove" onClick={Popup} />
      </div>
 
      {isPopupOpen && (
        <div className="popup">
          <div className="popupContainer">
            <h2>กรุณาเลือกเหตุผลในการยกเลิก</h2>
            <div className="checkboxGroup">
              <label>
                <input
                  type="checkbox"
                  value="ต้องการเปลี่ยนสนาม"
                  onChange={handleCheckboxChange}
                />
                ต้องการเปลี่ยนสนาม
              </label>
              <br/>
 
              <label>
                <input
                  type="checkbox"
                  value="ไม่สะดวกเข้าใช้งาน"
                  onChange={handleCheckboxChange}
                />
                ไม่สะดวกเข้าใช้งาน
              </label>
              <br/>
 
              <label>
                <input
                  type="checkbox"
                  value="ต้องการแก้ไขการจอง"
                  onChange={handleCheckboxChange}
                />
                ต้องการแก้ไขการจอง
              </label>
              <br/>
             
              <label>
                <input
                  type="checkbox"
                  value="อื่นๆ"
                  onChange={handleCheckboxChange}
                />
                อื่นๆ
              </label>
            </div>

            <Link href="/history_cancle/cancle/chanel_contact" passHref>
              <button>ยกเลิกการจอง</button>
            </Link>
            
          </div>
        </div>
      )}
    </>
  );
}
 