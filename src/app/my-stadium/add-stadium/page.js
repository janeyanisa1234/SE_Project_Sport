"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Tabbar from "../../components/tab";

const AddSportsField = () => {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false); // ✅ ใช้ state ควบคุม Sidebar

  const [sportsFieldName, setSportsFieldName] = useState("");
  const [sportsTypes, setSportsTypes] = useState([]);
  const [otherSport, setOtherSport] = useState("");
  const [image, setImage] = useState(null);

  const handleCheckboxChange = (sport) => {
    setSportsTypes((prev) =>
      prev.includes(sport)
        ? prev.filter((item) => item !== sport)
        : [...prev, sport]
    );
  };

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      setImage(URL.createObjectURL(file));
    }
  };

  return (
    <div className="relative w-full h-screen bg-cover bg-center flex flex-col" 
    style={{ backgroundImage: "url('/pictureowner/bg.png')" }}
    >
      <Tabbar/>

      <div className="flex flex-col items-center justify-center flex-grow px-4">
        <div className="bg-white rounded-lg shadow-lg max-w-4xl w-full">
          <div className="bg-black text-white text-lg font-bold px-6 py-3 text-center rounded-t-lg">
            เพิ่มสนามกีฬา
          </div>

          <div className="p-6">
            <label className="block text-gray-700 font-semibold mb-2">ชื่อสนาม</label>
            <input
              type="text"
              value={sportsFieldName}
              onChange={(e) => setSportsFieldName(e.target.value)}
              placeholder="ใส่ชื่อสนามของคุณ"
              className="w-full px-4 py-2 border rounded mb-4"
            />

            <label className="block text-gray-700 font-semibold mb-2">ที่ตั้ง</label>
            <textarea placeholder="รายละเอียดที่อยู่, ตำบล, อำเภอ, จังหวัด, รหัสไปรษณีย์" className="w-full px-4 py-2 border rounded mb-4"></textarea>
            <button className="bg-gray-300 px-4 py-2 rounded w-full">+ เพิ่มตำแหน่งในแผนที่</button>

            <label className="block text-gray-700 font-semibold mt-6 mb-2">ประเภทกีฬา</label>
            <div className="grid grid-cols-3 gap-4 mb-4">
              {["แบดมินตัน", "ฟุตบอล", "ฟุตซอล", "บาสเกตบอล", "ปิงปอง", "วอลเลย์บอล", "กีฬาอื่น ๆ"]
                .map((sport) => (
                  <label key={sport} className="flex items-center">
                    <input type="checkbox" checked={sportsTypes.includes(sport)} onChange={() => handleCheckboxChange(sport)} className="mr-2" />
                    {sport}
                  </label>
                ))}
            </div>

            {sportsTypes.includes("กีฬาอื่น ๆ") && (
              <input
                type="text"
                value={otherSport}
                onChange={(e) => setOtherSport(e.target.value)}
                placeholder="โปรดระบุประเภทกีฬา"
                className="w-full px-4 py-2 border rounded mb-4"
              />
            )}

            <label className="block text-gray-700 font-semibold mt-6 mb-2">รูปสนามกีฬา</label>
            <label className="block bg-gray-300 w-40 h-40 flex items-center justify-center cursor-pointer rounded-lg border-dashed border-2 border-gray-500 mb-4">
              {image ? <img src={image} alt="รูปสนาม" className="w-full h-full object-cover rounded-lg" /> : <span>+ เพิ่มรูป</span>}
              <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
            </label>

            <div className="flex justify-between mt-4">
              <button className="bg-gray-400 px-6 py-2 rounded text-white" onClick={() => router.push("/my-stadium")}>ยกเลิก</button>
              <button className="bg-green-500 px-6 py-2 rounded text-white"onClick={() => router.push("/my-stadium")}>ยืนยัน</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddSportsField;
