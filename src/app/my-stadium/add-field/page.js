"use client";

// นำเข้าโมดูลและคอมโพเนนต์ที่จำเป็น
import React, { useState, useEffect } from "react";
import { FaBars, FaPlus, FaTrash } from "react-icons/fa";
import { useRouter } from "next/navigation";
import Tabbar from "../../components/tab";
import axios from "axios";

const AddSportField = () => {
  // สร้างตัวแปร state สำหรับจัดการข้อมูลฟอร์ม
  const router = useRouter();
  const [imageFile, setImageFile] = useState(null);
  const [image, setImage] = useState(null);
  const [fileName, setFileName] = useState('');
  const [isFileUploaded, setIsFileUploaded] = useState(false);
  const [sports, setSports] = useState(["ฟุตบอล", "ฟุตซอล", "บาสเกตบอล", "แบดมินตัน", "วอลเลย์บอล", "ปิงปอง", "อื่นๆ"]);
  const [selectedSport, setSelectedSport] = useState("");
  const [customSport, setCustomSport] = useState("");
  const [price, setPrice] = useState("");
  const [fieldCount, setFieldCount] = useState("");
  const [timeSlots, setTimeSlots] = useState([]);
  const [stadiumId, setStadiumId] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const hours = Array.from({ length: 24 }, (_, i) => i.toString().padStart(2, "0"));
  const minutes = ["00", "15", "30", "45"];

  // ดึง stadiumId จาก localStorage หรือ URL เมื่อคอมโพเนนต์โหลด
  useEffect(() => {
    const storedStadiumId = localStorage.getItem('stadium_id');
    console.log("Retrieved Stadium ID from localStorage:", storedStadiumId);
    if (storedStadiumId) {
      setStadiumId(storedStadiumId);
    } else {
      const pathParts = window.location.pathname.split('/');
      const idFromUrl = pathParts[pathParts.length - 1];
      if (idFromUrl && !isNaN(idFromUrl)) {
        setStadiumId(idFromUrl);
        localStorage.setItem('stadium_id', idFromUrl);
        console.log("Retrieved Stadium ID from URL:", idFromUrl);
      }
    }
  }, []);

  // ฟังก์ชันเพิ่มช่วงเวลา
  const addTimeSlot = () => {
    setTimeSlots([...timeSlots, { startHour: "00", startMinute: "00", endHour: "00", endMinute: "00" }]);
  };

  // ฟังก์ชันลบช่วงเวลา
  const removeTimeSlot = (index) => {
    setTimeSlots(timeSlots.filter((_, i) => i !== index));
  };

  // ฟังก์ชันจัดการการอัปโหลดรูปภาพ
  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setImage(imageUrl);
      setImageFile(file);
      setFileName(file.name);
      setIsFileUploaded(true);
    }
  };

  const handleImageClick = () => {
    document.getElementById("imageUpload").click();
  };

  // ฟังก์ชันจัดการการส่งฟอร์ม
  const handleSubmit = async () => {
    const sportType = selectedSport === "อื่นๆ" ? customSport : selectedSport;

    // ตรวจสอบว่ากรอกข้อมูลครบหรือไม่
    if (!sportType || !fieldCount || !price || timeSlots.length === 0 || !imageFile) {
      setErrorMessage("กรุณากรอกข้อมูลให้ครบถ้วน");
      return;
    }

    if (!stadiumId) {
      setErrorMessage("ไม่พบรหัสสนาม กรุณาเข้าสู่ระบบใหม่");
      return;
    }

    setIsSubmitting(true);
    setErrorMessage('');

    try {
      const token = localStorage.getItem('token');
      const formattedTimeSlots = timeSlots.map(slot => ({
        start: `${slot.startHour}:${slot.startMinute}`,
        end: `${slot.endHour}:${slot.endMinute}`
      }));
      const formData = new FormData();
      formData.append('stadium_id', stadiumId);
      formData.append('court_type', sportType);
      formData.append('court_quantity', fieldCount);
      formData.append('court_price', price);
      formData.append('time_slots', JSON.stringify(formattedTimeSlots));
      if (imageFile) {
        formData.append('fieldImage', imageFile);
      }

      // แสดงข้อมูล FormData เพื่อดีบั๊ก
      for (let pair of formData.entries()) {
        console.log(pair[0] + ':', pair[1]);
      }

      console.log('Sending request to: http://localhost:5000/api/field/add_field');
      const response = await axios.post('http://localhost:5000/api/field/add_field', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${token}`
        }
      });

      console.log('Response received:', response.data);
      alert("เพิ่มสนามกีฬาสำเร็จ");
      router.push("/my-stadium");
    } catch (error) {
      console.error("Error adding sport field:", error);
      setErrorMessage(error.response?.data.error || "เกิดข้อผิดพลาดในการเพิ่มสนามกีฬา");
    } finally {
      setIsSubmitting(false);
    }
  };

  // ส่วนการแสดงผล UI
  return (
    <div
      className="w-full min-h-screen flex flex-col items-center"
      style={{ backgroundImage: "url('/pictureowner/bg.png')", backgroundSize: "cover", backgroundPosition: "center" }}
    >
      <Tabbar />
      <br /><br />
      <div className="w-full max-w-lg bg-white mt-8 rounded-lg shadow-lg overflow-hidden">
        <div className="bg-black text-white text-center py-4 text-lg font-semibold">
          เพิ่มจำนวนสนาม
        </div>
        <div className="p-6 space-y-6">
          {/* ประเภทกีฬา */}
          <div className="grid grid-cols-2 gap-4 items-center">
            <label className="text-md font-medium">ประเภทกีฬา :</label>
            <select
              className="border rounded-md px-3 py-2 w-full text-sm bg-gray-50"
              value={selectedSport}
              onChange={(e) => setSelectedSport(e.target.value)}
            >
              <option value="">เลือกประเภทกีฬา</option>
              {sports.map((sport, index) => (
                <option key={index} value={sport}>{sport}</option>
              ))}
            </select>
          </div>

          {/* เพิ่มกีฬาที่กำหนดเอง */}
          {selectedSport === "อื่นๆ" && (
            <div className="grid grid-cols-2 gap-4 items-center">
              <label className="text-md font-medium">เพิ่มกีฬา :</label>
              <input
                type="text"
                value={customSport}
                onChange={(e) => setCustomSport(e.target.value)}
                placeholder="พิมพ์ชื่อกีฬา..."
                className="border rounded-md px-3 py-2 w-full text-sm bg-gray-50"
              />
            </div>
          )}

          {/* จำนวนสนาม */}
          <div className="grid grid-cols-2 gap-4 items-center">
            <label className="text-md font-medium">จำนวนสนาม :</label>
            <input
              type="number"
              value={fieldCount}
              onChange={(e) => setFieldCount(e.target.value)}
              placeholder="ใส่จำนวนสนาม"
              className="border rounded-md px-3 py-2 w-full text-sm bg-gray-50"
            />
          </div>

          {/* ราคา */}
          <div className="grid grid-cols-2 gap-4 items-center">
            <label className="text-md font-medium">ราคา :</label>
            <input
              type="number"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              placeholder="ใส่ราคา"
              className="border rounded-md px-3 py-2 w-full text-sm bg-gray-50"
            />
          </div>

          {/* เพิ่มช่วงเวลา */}
          <div className="grid grid-cols-2 gap-4 items-center">
            <label className="text-md font-medium">เพิ่มช่วงเวลา :</label>
            <button
              onClick={addTimeSlot}
              className="border rounded-md px-4 py-2 bg-gray-200 flex items-center text-sm hover:bg-gray-300 transition"
            >
              เพิ่ม <FaPlus className="ml-2 text-xs" />
            </button>
          </div>

          {/* แสดงช่วงเวลา */}
          {timeSlots.map((slot, index) => (
            <div key={index} className="flex items-center space-x-2">
              <select
                className="border rounded-md px-2 py-1 text-sm bg-gray-50"
                value={slot.startHour}
                onChange={(e) => {
                  const updatedSlots = [...timeSlots];
                  updatedSlots[index].startHour = e.target.value;
                  setTimeSlots(updatedSlots);
                }}
              >
                {hours.map(hour => <option key={hour} value={hour}>{hour}</option>)}
              </select>
              <span className="text-lg font-semibold">:</span>
              <select
                className="border rounded-md px-2 py-1 text-sm bg-gray-50"
                value={slot.startMinute}
                onChange={(e) => {
                  const updatedSlots = [...timeSlots];
                  updatedSlots[index].startMinute = e.target.value;
                  setTimeSlots(updatedSlots);
                }}
              >
                {minutes.map(min => <option key={min} value={min}>{min}</option>)}
              </select>
              <span className="mx-2">ถึง</span>
              <select
                className="border rounded-md px-2 py-1 text-sm bg-gray-50"
                value={slot.endHour}
                onChange={(e) => {
                  const updatedSlots = [...timeSlots];
                  updatedSlots[index].endHour = e.target.value;
                  setTimeSlots(updatedSlots);
                }}
              >
                {hours.map(hour => <option key={hour} value={hour}>{hour}</option>)}
              </select>
              <span className="text-lg font-semibold">:</span>
              <select
                className="border rounded-md px-2 py-1 text-sm bg-gray-50"
                value={slot.endMinute}
                onChange={(e) => {
                  const updatedSlots = [...timeSlots];
                  updatedSlots[index].endMinute = e.target.value;
                  setTimeSlots(updatedSlots);
                }}
              >
                {minutes.map(min => <option key={min} value={min}>{min}</option>)}
              </select>
              <button onClick={() => removeTimeSlot(index)} className="text-red-500">
                <FaTrash />
              </button>
            </div>
          ))}

          {/* อัปโหลดรูปภาพ */}
          <div className="text-center">
            <label className="block text-md font-medium mb-3 text-left">เพิ่มรูปสนาม :</label>
            <div
              className="w-40 h-40 border-2 border-gray-300 flex items-center justify-center bg-gray-100 rounded-lg cursor-pointer"
              onClick={handleImageClick}
            >
              {image ? (
                <img src={image} alt="สนามกีฬา" className="w-full h-full object-cover rounded-lg" />
              ) : (
                <FaPlus className="text-gray-500 text-4xl" />
              )}
            </div>
            <input
              type="file"
              id="imageUpload"
              accept="image/*"
              onChange={handleImageUpload}
              className="hidden"
            />
            {isFileUploaded && (
              <p className="upload-success-text mt-2" style={{ color: 'green', fontSize: '14px' }}>
                อัปโหลดรูปสำเร็จ: {fileName}
              </p>
            )}
          </div>

          {/* ข้อความแจ้งข้อผิดพลาด */}
          {errorMessage && (
            <div style={{ color: 'red', textAlign: 'center' }}>
              {errorMessage}
            </div>
          )}

          {/* ปุ่มควบคุม */}
          <div className="flex justify-end space-x-2">
            <button
              className="px-4 py-2 text-sm bg-gray-300 text-black rounded-md shadow-md hover:bg-gray-400 transition"
              onClick={() => router.push("/my-stadium")}
              disabled={isSubmitting}
            >
              ยกเลิก
            </button>
            <button
              className={`px-4 py-2 text-sm ${isSubmitting ? 'bg-green-300' : 'bg-green-500'} text-white rounded-md shadow-md hover:bg-green-600 transition`}
              onClick={handleSubmit}
              disabled={isSubmitting}
            >
              {isSubmitting ? 'กำลังดำเนินการ...' : 'ตกลง'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddSportField;