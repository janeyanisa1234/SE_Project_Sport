"use client"; 
import Link from "next/link";
import "./RegistrationForm1.css";
import Image from "next/image"; 
import Tabbar from "../../../tabbar-nologin/tab.js";

const RegistrationForm1 = () => {
  return (
       <>
          <Tabbar />

    <div className="registration-container">
      <div className="registration-overlay">
        <div className="registration-box">
            <div className="icon-container">
              <Image
                src="/pictureice/logo (4).png"
                alt="Admin Icon"
                width={70}
                height={50}
                className="user-icon"
                priority
              />
            <h1 className="text-white text-2xl font-bold">ลงทะเบียน</h1>
          </div>
          <div className="input-container">
            <label>ชื่อ-นามสกุล</label>
            <input type="text" placeholder="ชื่อ-นามสกุล" />
          </div>
          <div className="input-container">
            <label>อีเมล</label>
            <input type="text" placeholder="อีเมล" />
          </div>
          <div className="input-container">
            <label>เบอร์โทรศัพท์</label>
            <input type="tel" placeholder="เบอร์โทรศัพท์" />
          </div>
          <div className="input-container">
            <label>เลขบัตรประชาชน</label>
            <input type="text" placeholder="เลขบัตรประชาชน" />
          </div>
          <div className="input-container">
            <label>ชื่อธนาคาร</label>
            <input type="text" placeholder="ชื่อธนาคาร" />
          </div>
          <div className="input-container">
            <label>เลขบัญชีธนาคาร</label>
            <input type="text" placeholder="เลขบัญชีธนาคาร" />
          </div>
          <div className="input-container">
            <label>รหัสผ่าน</label>
            <input type="password" placeholder="รหัสผ่าน" />
          </div>
          <div className="input-container">
            <label>ยืนยันรหัสผ่าน</label>
            <input type="password" placeholder="ยืนยันรหัสผ่าน" />
          </div>
          <div className="checkbox-container">
            <input type="checkbox" id="agree" />
            <label htmlFor="agree">ฉันยอมรับเงื่อนไขการให้บริการ</label>
          </div>

          <Link href={"/Login"}>
            <button type="submit" className="submit-button">
              ยืนยันข้อมูล
            </button>
          </Link>
          
        </div>
      </div>
    </div>
    </>
  );
};

export default RegistrationForm1;
