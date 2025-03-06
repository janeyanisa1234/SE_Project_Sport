"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Tabbar from "../../components/tab";
import axios from "axios"; // Import axios

const AddSportsField = () => {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);

  // Form states
  const [sportsFieldName, setSportsFieldName] = useState("");
  const [sportsFieldAddress, setSportsFieldAddress] = useState(""); 
  const [sportsTypes, setSportsTypes] = useState([]);
  const [otherSport, setOtherSport] = useState("");
  const [image, setImage] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

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
      const imageUrl = URL.createObjectURL(file);
      setImage(imageUrl);
    }
  };

  const handleImageClick = () => {
    document.getElementById("imageUpload").click();
  };

  // Function to submit data to backend
  const handleSubmit = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Validate form
      if (!sportsFieldName.trim()) {
        setError("กรุณากรอกชื่อสนาม");
        setLoading(false);
        return;
      }
      
      if (!sportsFieldAddress.trim()) {
        setError("กรุณากรอกที่ตั้ง");
        setLoading(false);
        return;
      }
      
      if (sportsTypes.length === 0) {
        setError("กรุณาเลือกประเภทกีฬาอย่างน้อย 1 ประเภท");
        setLoading(false);
        return;
      }

      // Prepare stadium type string
      let stadiumType = sportsTypes
        .filter(type => type !== "กีฬาอื่น ๆ")
        .join(", ");
        
      if (sportsTypes.includes("กีฬาอื่น ๆ") && otherSport.trim()) {
        stadiumType += stadiumType ? `, ${otherSport}` : otherSport;
      }

      // Get image URL or placeholder
      const imageUrl = imageFile ? "image_url_placeholder" : null;
      
      // Create request data to match your backend
      const requestData = {
        stadium_name: sportsFieldName,
        stadium_address: sportsFieldAddress,
        stadium_type: stadiumType,
        stadium_image: imageUrl,
      };

      // Send data to backend - using the correct endpoint from your backend
      const response = await axios.post("http://localhost:5000/api/sox/add_stadium", requestData);

      console.log("Stadium added successfully:", response.data);
      router.push("/my-stadium");
    } catch (err) {
      console.error("Error adding stadium:", err);
      setError(err.response?.data?.error || "เกิดข้อผิดพลาดในการบันทึกข้อมูล");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative w-full h-screen bg-cover bg-center flex flex-col" 
    style={{ backgroundImage: "url('/pictureowner/bg.png')" }}
    >
      <Tabbar/>

      <div className="flex flex-col items-center justify-center flex-grow px-4 overflow-auto">
        <div className="bg-white rounded-lg shadow-lg max-w-4xl w-full my-8">
          <div className="bg-black text-white text-lg font-bold px-6 py-3 text-center rounded-t-lg">
            เพิ่มสนามกีฬา
          </div>

          <div className="p-6">
            {error && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                {error}
              </div>
            )}

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
              value={sportsFieldAddress}
              onChange={(e) => setSportsFieldAddress(e.target.value)}
              placeholder="รายละเอียดที่อยู่, ตำบล, อำเภอ, จังหวัด, รหัสไปรษณีย์" 
              className="w-full px-4 py-2 border rounded mb-4"
            ></textarea>
            <button className="bg-gray-300 px-4 py-2 rounded w-full">+ เพิ่มตำแหน่งในแผนที่</button>

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
              <button 
                className="bg-gray-400 px-6 py-2 rounded text-white" 
                onClick={() => router.push("/my-stadium")}
                disabled={loading}
              >
                ยกเลิก
              </button>
              <button 
                className={`${loading ? 'bg-green-300' : 'bg-green-500'} px-6 py-2 rounded text-white`}
                onClick={handleSubmit}
                disabled={loading}
              >
                {loading ? 'กำลังบันทึก...' : 'ยืนยัน'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddSportsField;