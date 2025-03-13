"use client";

import Tabbar from "../tabbar-nologin/tab.js";

import "./Howto.css";

export default function Howto() {
  return (
    <>
      <Tabbar />

      <main className="howto-container">
        <h2 className="howto-header">คู่มือแนะนำการจองสนามกีฬา</h2>

        <section className="step">
          <h3>1. เข้าสู่ระบบ</h3>
          <p>เข้าสู่ระบบก่อนทำการจอง เพื่อจัดเก็บข้อมูลการใช้งาน</p>
          <p>หากยังไม่มีบัญชีผู้ใช้ ให้คลิกเลือกปุ่มลงทะเบียน เพื่อทำการลงทะเบียนก่อนเข้าสู่ระบบ</p>
          <img src="/picturemild/Howto2.png" alt="เข้าสู่ระบบ" className="step-image" />
          <img src="/picturemild/Howto3.png" alt="เข้าสู่ระบบ" className="step-image" />
        </section>

        <section className="step">
          <h3>2. ค้นหาสถานที่</h3>
          <p> หลังจากเข้าสู่ระบบแล้ว ใช้แถบค้นหาเพื่อค้นหาสถานที่หรือสนามกีฬาที่ต้องการ </p>
          <p> และสามารถใช้แถบประเภทกีฬาเพื่อเลือกประเภทกีฬาที่สนใจเข้าจองได้ </p>
          <img src="/picturemild/Howto4.png" alt="ค้นหาสถานที่" className="step-image" />
        </section>

        <section className="step">
          <h3>3. เลือกสนามที่ต้องการ</h3>
          <p>ดูรายละเอียดสถานที่สนามกีฬาที่ค้นหา และคลิกเลือกสถานที่ของสนามที่ต้องการเข้าจอง</p>
          <img src="/picturemild/Howto5.png" alt="เลือกสนาม" className="step-image" />
        </section>

        <section className="step">
          <h3>4. เลือกวันที่และเวลา</h3>
          <p>เมื่อเลือกสถานที่แล้ว ให้เลือกวันที่ต้องการเข้าใช้งานสนามและเลือกประเภทกีฬาที่ต้องการ</p>
          <p>จากนั้นเลือกคอร์ดและช่วงเวลาที่ต้องการเข้าใช้สนาม</p>
          <img src="/picturemild/Howto6.png" alt="เลือกวัน" className="step-image" />
          <img src="/picturemild/Howto7.png" alt="เลือกเวลา" className="step-image" />
        </section>

        <section className="step">
          <h3>5. ยืนยันการจอง</h3>
          <p>ตรวจสอบรายละเอียดการจองและกดปุ่มยืนยัน</p>
          <p>ตรวจสอบรายละเอียดข้อมูลสรุปการจองอีกครั้ง เมื่อมั่นใจแล้วให้กดปุ่ม <strong>ยืนยัน</strong> อีกครั้ง </p>
          <img src="/picturemild/Howto8.png" alt="ยืนยันการจอง" className="step-image" />
        </section>

        <section className="step">
          <h3>6. ยืนยันการโอน</h3>
          <p>ตรวจสอบรายละเอียดคิวอาร์โค้ดที่แสดงว่าราคาแสดงถูกต้องหรือไม่ จึงค่อยทำการโอน</p>
          <p>เมื่อโอนสำเร็จแล้วให้กดปุ่ม <strong>ยืนยัน</strong> จากนั้นให้กรอกข้อมูลวันที่และเวลาที่ชำระเงิน</p>
          <p>ต่อมาให้ทำการแนบหลักฐานการโอน เมื่อกรอกทุกอย่างเสร็จสิ้นให้กดปุ่ม <strong>ยืนยัน</strong> นั่นคือการทำการ <strong>จองสำเร็จ!</strong></p>
          <img src="/picturemild/Howto9.png" alt="ยืนยันการจอง" className="step-image" />
          <img src="/picturemild/Howto10.png" alt="ยืนยันการจอง" className="step-image" />
        </section>

      </main>
    </>
  );
}
