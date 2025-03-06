"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Tabbar from "../../components/tab";
import axios from "axios";

const AddSportsField = () => {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);

  const [sportsFieldName, setSportsFieldName] = useState("");
  const [image, setImage] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [address, setAddress] = useState("");
  const [ownerId, setOwnerId] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Fetch owner ID from session/local storage when component mounts
  useEffect(() => {
    const storedOwnerId = localStorage.getItem('userId');
    console.log("Retrieved Owner ID from localStorage:", storedOwnerId);
    if (storedOwnerId) {
      setOwnerId(storedOwnerId);
    }
  }, []);

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      setImageFile(file);
      setImage(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async () => {
    console.log("Stadium Name:", sportsFieldName);
    console.log("Address:", address);
    console.log("Image File:", imageFile);
    
    if (!sportsFieldName || !address || !imageFile) {
      alert("กรุณากรอกข้อมูลให้ครบถ้วน");
      return;
    }

    setIsSubmitting(true);

    try {
      const token = localStorage.getItem('token');
      
      // Create FormData with correct field names
      const formData = new FormData();
      formData.append('owner_id', ownerId);
      formData.append('stadium_name', sportsFieldName);
      formData.append('stadium_address', address);
      
      // Append the image file with the correct field name - only once
      if (imageFile) {
        formData.append('stadium_image', imageFile, imageFile.name);
      }

      // Log the FormData contents for debugging
      for (let pair of formData.entries()) {
        console.log(pair[0] + ':', pair[1]);
      }

      const response = await axios.post('http://localhost:5000/api/sox/add_stadium', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${token}`
        }
      });

      alert("เพิ่มสนามกีฬาสำเร็จ กรุณารอการตรวจสอบจากแอดมิน");
      router.push("/my-stadium");
    } catch (error) {
      console.error("Error adding stadium:", error);
      alert("เกิดข้อผิดพลาดในการเพิ่มสนามกีฬา กรุณาลองใหม่อีกครั้ง");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="relative w-full h-screen bg-cover bg-center flex flex-col pb-20" 
    style={{ backgroundImage: "url('/pictureowner/bg.png')" }}
    >
      <Tabbar/>
      <br></br><br></br><br></br>
      <div className="flex flex-col items-center justify-center flex-grow px-4">
        <div className="bg-white rounded-lg shadow-lg max-w-4xl w-full">
          <div className="bg-black text-white text-lg font-bold px-6 py-3 text-center rounded-t-lg relative z-10">
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
            <textarea 
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="รายละเอียดที่อยู่, ตำบล, อำเภอ, จังหวัด, รหัสไปรษณีย์" 
              className="w-full px-4 py-2 border rounded mb-4"
            ></textarea>

            <label className="block text-gray-700 font-semibold mt-6 mb-2">รูปสนามกีฬา</label>
            <label className="block bg-gray-300 w-40 h-40 flex items-center justify-center cursor-pointer rounded-lg border-dashed border-2 border-gray-500 mb-4">
              {image ? <img src={image} alt="รูปสนาม" className="w-full h-full object-cover rounded-lg" /> : <span>+ เพิ่มรูป</span>}
              <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
            </label>

            <div className="flex justify-between mt-4">
              <button 
                className="bg-gray-400 px-6 py-2 rounded text-white" 
                onClick={() => router.push("/my-stadium")}
                disabled={isSubmitting}
              >
                ยกเลิก
              </button>
              <button 
                className={`${isSubmitting ? 'bg-green-300' : 'bg-green-500'} px-6 py-2 rounded text-white`}
                onClick={handleSubmit}
                disabled={isSubmitting}
              >
                {isSubmitting ? 'กำลังดำเนินการ...' : 'ยืนยัน'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddSportsField;