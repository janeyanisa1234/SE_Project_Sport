"use client";
 
import Tabbar from "../tabbar-nologin/tab.js";
import "./Howto.css";
 
export default function Howto() {
  return (
    <>
      <Tabbar />
 
      <main className="howto-container">
        <h2 className="howto-header">คู่มือการจองสนามกีฬา</h2>
 
        <section className="step">
          <h3>เข้าสู่ระบบ</h3>
          <p>เข้าสู่ระบบเพื่อบันทึกข้อมูลการจองของคุณ</p>
          <p>หากยังไม่มีบัญชี คลิก "ลงทะเบียน" เพื่อสมัครสมาชิกก่อน</p>
          <img src="/picturemild/Howto2.png" alt="หน้าเข้าสู่ระบบ" className="step-image" />
          <img src="/picturemild/Howto3.png" alt="หน้าลงทะเบียน" className="step-image" />
        </section>
 
        <section className="step">
          <h3>ค้นหาสถานที่</h3>
          <p>ใช้แถบค้นหาเพื่อหาสนามกีฬาที่ต้องการ</p>
          <p>หรือเลือกประเภทกีฬาที่สนใจจากแถบประเภทกีฬา</p>
          <img src="/picturemild/Howto4.png" alt="หน้าค้นหาสถานที่" className="step-image" />
        </section>
 
        <section className="step">
          <h3>เลือกสนามที่ต้องการ</h3>
          <p>ดูรายละเอียดสถานที่และคลิกเลือกสนามที่ต้องการจอง</p>
          <img src="/picturemild/Howto5.png" alt="หน้าเลือกสนาม" className="step-image" />
        </section>
 
        <section className="step">
          <h3>เลือกวันที่และเวลา</h3>
          <p>เลือกวันที่และประเภทกีฬาที่ต้องการ</p>
          <p>จากนั้นเลือกคอร์ทและช่วงเวลาที่สะดวก</p>
          <img src="/picturemild/Howto6.png" alt="หน้าเลือกวันที่" className="step-image" />
          <img src="/picturemild/Howto7.png" alt="หน้าเลือกเวลา" className="step-image" />
        </section>
 
        <section className="step">
          <h3>ยืนยันการจอง</h3>
          <p>ตรวจสอบรายละเอียดการจอง แล้วกด <strong>ยืนยัน</strong></p>
          <p>ตรวจสอบข้อมูลสรุปอีกครั้ง หากถูกต้องให้กด <strong>ยืนยัน</strong> อีกครั้ง</p>
          <img src="/picturemild/Howto8.png" alt="หน้ายืนยันการจอง" className="step-image" />
        </section>
 
        <section className="step">
          <h3>ชำระเงินและยืนยัน</h3>
          <p>ตรวจสอบ QR Code และยอดชำระให้ถูกต้องก่อนโอนเงิน</p>
          <p>เมื่อโอนแล้ว กด <strong>ยืนยัน</strong> แล้วกรอกวันที่และเวลาที่ชำระ</p>
          <p>แนบหลักฐานการโอน จากนั้นกด <strong>ยืนยัน</strong> เพื่อจองสำเร็จ!</p>
          <img src="/picturemild/Howto9.png" alt="หน้าชำระเงิน" className="step-image" />
          <img src="/picturemild/Howto10.png" alt="หน้ายืนยันการชำระ" className="step-image" />
        </section>
      </main>
    </>
  );
}