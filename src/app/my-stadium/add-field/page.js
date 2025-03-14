"use client";

import React, { useState, useEffect } from "react";
import { FaBars, FaPlus, FaTrash } from "react-icons/fa";
import { useRouter } from "next/navigation";
import Tabbar from "../../components/tab";
import axios from "axios";

const AddSportField = () => {
  const router = useRouter();
  const [imageFile, setImageFile] = useState(null);
  const [image, setImage] = useState(null);
  const [fileName, setFileName] = useState("");
  const [isFileUploaded, setIsFileUploaded] = useState(false);
  const [sports, setSports] = useState(["ฟุตบอล", "ฟุตซอล", "บาสเกตบอล", "แบดมินตัน", "วอลเลย์บอล", "ปิงปอง", "อื่นๆ"]);
  const [selectedSport, setSelectedSport] = useState("");
  const [customSport, setCustomSport] = useState("");
  const [price, setPrice] = useState("");
  const [fieldCount, setFieldCount] = useState("");
  const [timeSlots, setTimeSlots] = useState([]);
  const [stadiumId, setStadiumId] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const hours = Array.from({ length: 24 }, (_, i) => i.toString().padStart(2, "0"));
  const minutes = ["00", "15", "30", "45"];

  useEffect(() => {
    const storedStadiumId = localStorage.getItem("stadium_id");
    console.log("Retrieved Stadium ID from localStorage:", storedStadiumId);
    if (storedStadiumId) {
      setStadiumId(storedStadiumId);
    } else {
      const pathParts = window.location.pathname.split("/");
      const idFromUrl = pathParts[pathParts.length - 1];
      if (idFromUrl && !isNaN(idFromUrl)) {
        setStadiumId(idFromUrl);
        localStorage.setItem("stadium_id", idFromUrl);
        console.log("Retrieved Stadium ID from URL:", idFromUrl);
      }
    }
  }, []);

  const addTimeSlot = () => {
    setTimeSlots([...timeSlots, { startHour: "00", startMinute: "00", endHour: "00", endMinute: "00" }]);
  };

  const removeTimeSlot = (index) => {
    setTimeSlots(timeSlots.filter((_, i) => i !== index));
  };

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      // Check if the file is an image
      if (!file.type.startsWith("image/")) {
        setErrorMessage("กรุณาอัปโหลดไฟล์รูปภาพเท่านั้น (เช่น JPG, PNG, GIF)");
        return;
      }

      // Check if file name is in English (ASCII characters only)
      const englishFileNameRegex = /^[a-zA-Z0-9._-]+$/;
      if (!englishFileNameRegex.test(file.name.split('.').slice(0, -1).join('.'))) {
        setErrorMessage("ชื่อไฟล์ต้องเป็นภาษาอังกฤษเท่านั้น (a-z, A-Z, 0-9, ._-)");
        return;
      }

      const imageUrl = URL.createObjectURL(file);
      setImage(imageUrl);
      setImageFile(file);
      setFileName(file.name);
      setIsFileUploaded(true);
      setErrorMessage("");
    }
  };

  const handleImageClick = () => {
    document.getElementById("imageUpload").click();
  };

  const handleSubmit = async () => {
    const sportType = selectedSport === "อื่นๆ" ? customSport : selectedSport;
    if (!sportType || !fieldCount || !price || timeSlots.length === 0 || !imageFile) {
      setErrorMessage("กรุณากรอกข้อมูลให้ครบถ้วน");
      return;
    }
    if (!stadiumId) {
      setErrorMessage("ไม่พบรหัสสนาม กรุณาเข้าสู่ระบบใหม่");
      return;
    }

    for (const slot of timeSlots) {
      const startTime = `${slot.startHour}:${slot.startMinute}`;
      const endTime = `${slot.endHour}:${slot.endMinute}`;
      if (startTime === endTime) {
        setErrorMessage("เวลาเริ่มต้นและสิ้นสุดของช่วงเวลาต้องไม่เท่ากัน");
        return;
      }
    }

    setIsSubmitting(true);
    setErrorMessage("");

    try {
      const token = localStorage.getItem("token");
      const formattedTimeSlots = timeSlots.map((slot) => ({
        start: `${slot.startHour}:${slot.startMinute}`,
        end: `${slot.endHour}:${slot.endMinute}`,
      }));
      const formData = new FormData();
      formData.append("stadium_id", stadiumId);
      formData.append("court_type", sportType);
      formData.append("court_quantity", fieldCount);
      formData.append("court_price", price);
      formData.append("time_slots", JSON.stringify(formattedTimeSlots));
      if (imageFile) {
        formData.append("fieldImage", imageFile);
      }

      for (let pair of formData.entries()) {
        console.log(pair[0] + ":", pair[1]);
      }

      console.log("Sending request to: http://localhost:5000/api/field/add_field");
      const response = await axios.post("http://localhost:5000/api/field/add_field", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      });

      console.log("Response received:", response.data);
      alert("เพิ่มสนามกีฬาสำเร็จ");
      router.push("/my-stadium");
    } catch (error) {
      console.error("Error adding sport field:", error);
      setErrorMessage(error.response?.data.error || "เกิดข้อผิดพลาดในการเพิ่มสนามกีฬา");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      className="relative w-full min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-800 flex flex-col"
      style={{
        backgroundImage: "url('/pictureowner/bg.png'), linear-gradient(to bottom right,rgb(255, 255, 255),rgb(160, 159, 159),rgb(128, 128, 128))",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        backgroundAttachment: "fixed",
      }}
    >
      <Tabbar />
      <br></br><br></br>
      <div className="flex flex-col items-center justify-center flex-grow px-4 sm:px-6 lg:px-8 py-12">
        <div className="w-full max-w-lg bg-white rounded-2xl shadow-xl overflow-hidden transform transition-all duration-300 hover:shadow-2xl">
          <div className="bg-gradient-to-r from-black to-gray-900 text-white text-center py-4 text-lg font-semibold rounded-t-2xl">
            เพิ่มจำนวนสนาม
          </div>
          <div className="p-6 space-y-6">
            {errorMessage && (
              <div className="p-4 bg-red-50 border-l-4 border-red-500 text-red-700 rounded-r-lg shadow-md animate-slide-in">
                <span className="font-medium">{errorMessage}</span>
              </div>
            )}

            <div className="space-y-2">
              <label className="block text-gray-800 font-semibold">ประเภทกีฬา</label>
              <select
                className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition-all duration-200 shadow-sm text-black disabled:text-black"
                value={selectedSport}
                onChange={(e) => setSelectedSport(e.target.value)}
                disabled={isSubmitting}
              >
                <option value="">เลือกประเภทกีฬา</option>
                {sports.map((sport, index) => (
                  <option key={index} value={sport}>{sport}</option>
                ))}
              </select>
            </div>

            {selectedSport === "อื่นๆ" && (
              <div className="space-y-2">
                <label className="block text-gray-800 font-semibold">เพิ่มกีฬา</label>
                <input
                  type="text"
                  value={customSport}
                  onChange={(e) => setCustomSport(e.target.value)}
                  placeholder="พิมพ์ชื่อกีฬา..."
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition-all duration-200 shadow-sm text-black disabled:text-black"
                  disabled={isSubmitting}
                />
              </div>
            )}

            <div className="space-y-2">
              <label className="block text-gray-800 font-semibold">จำนวนสนาม</label>
              <input
                type="number"
                value={fieldCount}
                onChange={(e) => setFieldCount(e.target.value)}
                placeholder="ใส่จำนวนสนาม"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition-all duration-200 shadow-sm text-black disabled:text-black"
                disabled={isSubmitting}
              />
            </div>

            <div className="space-y-2">
              <label className="block text-gray-800 font-semibold">ราคา</label>
              <input
                type="number"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                placeholder="ใส่ราคา"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition-all duration-200 shadow-sm text-black disabled:text-black"
                disabled={isSubmitting}
              />
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <label className="block text-gray-800 font-semibold">ช่วงเวลา</label>
                <button
                  onClick={addTimeSlot}
                  className="bg-gray-200 px-4 py-2 rounded-lg text-gray-700 font-semibold hover:bg-gray-300 disabled:bg-gray-100 disabled:text-gray-400 flex items-center transition-all duration-200 shadow-md"
                  disabled={isSubmitting}
                >
                  เพิ่ม <FaPlus className="ml-2" />
                </button>
              </div>
              {timeSlots.map((slot, index) => (
                <div key={index} className="flex items-center space-x-2 animate-fade-in">
                  <select
                    className="w-20 px-2 py-1 border border-gray-300 rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-black shadow-sm text-black disabled:text-black"
                    value={slot.startHour}
                    onChange={(e) => {
                      const updatedSlots = [...timeSlots];
                      updatedSlots[index].startHour = e.target.value;
                      setTimeSlots(updatedSlots);
                    }}
                    disabled={isSubmitting}
                  >
                    {hours.map((hour) => (
                      <option key={hour} value={hour}>{hour}</option>
                    ))}
                  </select>
                  <span className="text-lg font-semibold">:</span>
                  <select
                    className="w-20 px-2 py-1 border border-gray-300 rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-black shadow-sm text-black disabled:text-black"
                    value={slot.startMinute}
                    onChange={(e) => {
                      const updatedSlots = [...timeSlots];
                      updatedSlots[index].startMinute = e.target.value;
                      setTimeSlots(updatedSlots);
                    }}
                    disabled={isSubmitting}
                  >
                    {minutes.map((min) => (
                      <option key={min} value={min}>{min}</option>
                    ))}
                  </select>
                  <span className="mx-2 text-gray-500">ถึง</span>
                  <select
                    className="w-20 px-2 py-1 border border-gray-300 rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-black shadow-sm text-black disabled:text-black"
                    value={slot.endHour}
                    onChange={(e) => {
                      const updatedSlots = [...timeSlots];
                      updatedSlots[index].endHour = e.target.value;
                      setTimeSlots(updatedSlots);
                    }}
                    disabled={isSubmitting}
                  >
                    {hours.map((hour) => (
                      <option key={hour} value={hour}>{hour}</option>
                    ))}
                  </select>
                  <span className="text-lg font-semibold">:</span>
                  <select
                    className="w-20 px-2 py-1 border border-gray-300 rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-black shadow-sm text-black disabled:text-black"
                    value={slot.endMinute}
                    onChange={(e) => {
                      const updatedSlots = [...timeSlots];
                      updatedSlots[index].endMinute = e.target.value;
                      setTimeSlots(updatedSlots);
                    }}
                    disabled={isSubmitting}
                  >
                    {minutes.map((min) => (
                      <option key={min} value={min}>{min}</option>
                    ))}
                  </select>
                  <button
                    onClick={() => removeTimeSlot(index)}
                    className="text-red-500 hover:text-red-700 transition-all duration-200"
                    disabled={isSubmitting}
                  >
                    <FaTrash />
                  </button>
                </div>
              ))}
            </div>

            <div className="space-y-2">
              <label className="block text-gray-800 font-semibold">รูปสนาม</label>
              <div
                className="relative w-48 h-48 bg-gray-100 rounded-xl border-2 border-dashed border-gray-400 hover:border-black transition-all duration-300 cursor-pointer shadow-md mx-auto"
                onClick={handleImageClick}
              >
                {image ? (
                  <img
                    src={image}
                    alt="สนามกีฬา"
                    className="w-full h-full object-cover rounded-xl transition-transform duration-300 hover:scale-105"
                  />
                ) : (
                  <span className="flex flex-col items-center justify-center h-full text-gray-500 font-medium">
                    <FaPlus className="text-2xl mb-2 text-black" />
                    เพิ่มรูป
                  </span>
                )}
                <input
                  type="file"
                  id="imageUpload"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                  disabled={isSubmitting}
                />
              </div>
              {isFileUploaded && (
                <p className="text-center text-sm text-green-600 font-medium animate-fade-in">
                  อัปโหลดรูปสำเร็จ: {fileName}
                </p>
              )}
            </div>

            <div className="flex justify-end space-x-4 mt-8">
              <button
                className="bg-gray-200 px-6 py-2 rounded-lg text-gray-700 font-semibold hover:bg-gray-300 disabled:bg-gray-100 disabled:text-gray-400 transition-all duration-200 shadow-md"
                onClick={() => router.push("/my-stadium")}
                disabled={isSubmitting}
              >
                ยกเลิก
              </button>
              <button
                className={`${isSubmitting
                  ? "bg-green-300"
                  : "bg-gradient-to-r from-green-500 to-teal-500 hover:from-green-600 hover:to-teal-600"
                  } px-6 py-2 rounded-lg text-white font-semibold disabled:bg-green-300 transition-all duration-200 shadow-md`}
                onClick={handleSubmit}
                disabled={isSubmitting}
              >
                {isSubmitting ? "กำลังดำเนินการ..." : "ตกลง"}
              </button>
            </div>
          </div>
        </div>
      </div>
      <div className="h-16"></div>
    </div>
  );
};

export default AddSportField;