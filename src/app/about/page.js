"use client";
import "./dash.css";
import React, { useState } from "react";
import Image from "next/image";
import Tabbar from "../components/tab.js";

const Page = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
    document.body.classList.toggle("sidebar-open", !isSidebarOpen);
  };

  return (
    <div className="min-h-screen bg-white text-gray-900 flex flex-col font-inter">
      

      <Tabbar/>

      {/*  Main Content */}
      <main className="max-w-4xl mx-auto p-6 flex-grow mt-20 ">
        <h1 className="text-3xl font-bold mb-4 text-black mt-30">เกี่ยวกับเรา</h1>
        <hr className="border-b-4 border-gray-800 mb-4 w-full" />
        <p className="mb-4 leading-relaxed">
        SportFlow  เราเข้าใจว่ากีฬาเป็นมากกว่ากิจกรรมเพื่อสุขภาพ แต่ยังเป็นช่วงเวลาแห่งความสุขที่ทำให้เราได้เชื่อมโยงและเพลิดเพลินไปกับบุคคล
ที่ชื่นชอบกิจกรรมคล้ายๆกัน เราจึงสร้างแพลตฟอร์มครบวงจรสำหรับผู้ที่รักกีฬา เพื่อให้ค้นหา จอง และเพลิดเพลินไปกับกิจกรรมที่ชื่นชอบรวม
ถึงเอื้อประโยชน์แก่ผู้ประกอบการที่เปิดให้บริการสนามกีฬา เราได้สร้างฟังก์ชันมากมายเพื่อเอื้ออำนวยความสะดวกให้แก่ผู้ที่มาจองสนามกีฬาและ
ผู้ประกอบการของสนามกีฬาที่เข้ามาใช้งานแพลตฟอร์มของเรา SportFlow จะดูแลให้คุณทุกขั้นตอนเราเชื่อว่าทุกคนควรได้รับการเข้าถึงสนาม
กีฬาและผู้ประกอบการควรได้รับการดูแลอย่างดีโดยแพลตฟอร์มของเรา เราหวังว่าทุกคนที่เข้ามาใช้แพลตฟอร์มของเราจะมีประสบการณ์ที่ดีที่สุด
        </p>
        <p className="mb-4 leading-relaxed">
        จุดเด่นของเราคือความสัมพันธ์และคอนเนคชั่นที่แน่นแฟ้นกับสนามกีฬา เราทำงานร่วมกับสนามกีฬา เพื่อให้การเชื่อมต่อและบริการต่างๆ ผ่าน
ระบบออนไลน์เป็นไปอย่างง่ายดาย ผู้เล่นสามารถค้นหาและจองสนามหรือยกเลิกและทำการโอนผ่านระบบดิจิทัลที่ง่ายดาย นอกจากนี้ในมุมของ
ผู้ประกอบการเรายังทำฟังก์ชันในการดูยอดประกอบการของสนามตามที่ผู้ประกอบการสนใจ และยังมีการอำนวยสะดวกในเรื่องโปรโมชันต่างๆ
        </p>
        <p className="mb-4 leading-relaxed">
        เป้าหมายของเรา : SportFlow จะทำให้ทุกวินาทีในการใช้งานบนแพลตฟอร์มของเราเป็นประสบการณ์ที่ดีที่สุดให้กับคุณผ่านแพลตฟอร์มที่
        ใช้งานง่าย เชื่อถือได้และครบถ้วน
        </p>
      </main>

      {/*  Footer */}
      <footer className="bg-black text-white py-6 px-6 flex justify-center items-center text-sm font-inter relative">
        {/*  LOGO SPORTFLOW อยู่ซ้ายล่าง */}
        <Image
          src="/pictureping/sportflow.png"
          alt="SPORTFLOW Logo"
          width={250}
          height={80}
          className="absolute bottom-2 left-6"
        />

        {/*  CONTACT อยู่ตรงกลาง */}
        <div className="text-center space-y-3">
          <p className="font-semibold text-lg">CONTACT</p>

          {/*  Email และ LINE ID */}
          <div className="flex items-center justify-start gap-4">
            {/*  mail.png และ Email */}
            <div className="flex items-center gap-2">
              <Image src="/pictureping/mail.png" alt="Email" width={20} height={20} />
              <p>info.sportflow@gmail.com</p>
            </div>

            {/*  LINE ID อยู่ต่อท้าย Email */}
            <p> LINE ID: sportflow</p>
          </div>

          {/*  เบอร์โทร */}
          <div className="flex items-center justify-start gap-2">
            <Image src="/pictureping/tell.png" alt="Phone" width={20} height={20} />
            <p>020-3138888</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Page;
