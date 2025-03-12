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
      <Tabbar />

      {/* Main Content */}
      <main className="w-full max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 flex-grow mt-16 sm:mt-20">
        <h1 className="text-2xl sm:text-3xl font-bold mb-4 text-black">เกี่ยวกับเรา</h1>
        <hr className="border-b-4 border-gray-800 mb-4 w-full" />
        
        {/* Responsive paragraphs */}
        <div className="space-y-4 text-sm sm:text-base leading-relaxed">
          <p>
            SportFlow เราเข้าใจว่ากีฬาเป็นมากกว่ากิจกรรมเพื่อสุขภาพ แต่ยังเป็นช่วงเวลาแห่งความสุขที่ทำให้เราได้เชื่อมโยงและเพลิดเพลินไปกับบุคคลที่ชื่นชอบกิจกรรมคล้ายๆกัน เราจึงสร้างแพลตฟอร์มครบวงจรสำหรับผู้ที่รักกีฬา เพื่อให้ค้นหา จอง และเพลิดเพลินไปกับกิจกรรมที่ชื่นชอบรวมถึงเอื้อประโยชน์แก่ผู้ประกอบการที่เปิดให้บริการสนามกีฬา เราได้สร้างฟังก์ชันมากมายเพื่อเอื้ออำนวยความสะดวกให้แก่ผู้ที่มาจองสนามกีฬาและผู้ประกอบการของสนามกีฬาที่เข้ามาใช้งานแพลตฟอร์มของเรา SportFlow จะดูแลให้คุณทุกขั้นตอนเราเชื่อว่าทุกคนควรได้รับการเข้าถึงสนามกีฬาและผู้ประกอบการควรได้รับการดูแลอย่างดีโดยแพลตฟอร์มของเรา เราหวังว่าทุกคนที่เข้ามาใช้แพลตฟอร์มของเราจะมีประสบการณ์ที่ดีที่สุด
          </p>
          <p>
            จุดเด่นของเราคือความสัมพันธ์และคอนเนคชั่นที่แน่นแฟ้นกับสนามกีฬา เราทำงานร่วมกับสนามกีฬา เพื่อให้การเชื่อมต่อและบริการต่างๆ ผ่านระบบออนไลน์เป็นไปอย่างง่ายดาย ผู้เล่นสามารถค้นหาและจองสนามหรือยกเลิกและทำการโอนผ่านระบบดิจิทัลที่ง่ายดาย นอกจากนี้ในมุมของผู้ประกอบการเรายังทำฟังก์ชันในการดูยอดประกอบการของสนามตามที่ผู้ประกอบการสนใจ และยังมีการอำนวยสะดวกในเรื่องโปรโมชันต่างๆ
          </p>
          <p>
            เป้าหมายของเรา : SportFlow จะทำให้ทุกวินาทีในการใช้งานบนแพลตฟอร์มของเราเป็นประสบการณ์ที่ดีที่สุดให้กับคุณผ่านแพลตฟอร์มที่ใช้งานง่าย เชื่อถือได้และครบถ้วน
          </p>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-black text-white py-6 px-4 sm:px-6 w-full font-inter relative">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          {/* Logo */}
          <div className="relative w-40 sm:w-48 lg:w-60">
            <Image
              src="/pictureping/sportflow.png"
              alt="SPORTFLOW Logo"
              width={250}
              height={80}
              layout="responsive"
              className="object-contain"
            />
          </div>

          {/* Contact */}
          <div className="text-center space-y-3">
            <p className="font-semibold text-base sm:text-lg">CONTACT</p>
            
            {/* Contact info with responsive layout */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-4 text-xs sm:text-sm">
              <div className="flex items-center gap-2">
                <Image src="/pictureping/mail.png" alt="Email" width={20} height={20} />
                <p>info.sportflow@gmail.com</p>
              </div>
              <p className="hidden sm:block">|</p>
              <div className="flex items-center gap-2">
                <Image src="/pictureping/tell.png" alt="Phone" width={20} height={20} />
                <p>020-3138888</p>
              </div>
              <p className="hidden sm:block">|</p>
              <p>LINE ID: sportflow</p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Page;