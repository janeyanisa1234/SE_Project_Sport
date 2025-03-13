"use client";
 
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Tabbar from "../../components/tab";
import axios from "axios";
 
const AddSportsField = () => {
  const router = useRouter();
  const [sportsFieldName, setSportsFieldName] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [fileName, setFileName] = useState("");
  const [isFileUploaded, setIsFileUploaded] = useState(false);
  const [address, setAddress] = useState("");
  const [ownerId, setOwnerId] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
 
  useEffect(() => {
    const storedOwnerId = localStorage.getItem("userId");
    console.log("Retrieved Owner ID from localStorage:", storedOwnerId);
    if (storedOwnerId) {
      setOwnerId(storedOwnerId);
    } else {
      setErrorMessage("ไม่พบข้อมูลผู้ใช้ กรุณาเข้าสู่ระบบอีกครั้ง");
      router.push("/login");
    }
  }, [router]);
 
  useEffect(() => {
    return () => {
      if (imagePreview) {
        URL.revokeObjectURL(imagePreview);
      }
    };
  }, [imagePreview]);
 
  const handleImageUpload = (event) => {
    const file = event.target.files?.[0];
    if (file) {
      if (!file.type.startsWith("image/")) {
        setErrorMessage("กรุณาอัปโหลดไฟล์รูปภาพเท่านั้น");
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        setErrorMessage("ไฟล์รูปภาพต้องมีขนาดไม่เกิน 5MB");
        return;
      }
 
      setImageFile(file);
      setFileName(file.name);
      setIsFileUploaded(true);
      if (imagePreview) {
        URL.revokeObjectURL(imagePreview);
      }
      const previewUrl = URL.createObjectURL(file);
      setImagePreview(previewUrl);
      setErrorMessage("");
    }
  };
 
  const handleSubmit = async () => {
    if (!sportsFieldName || !address || !imageFile || !ownerId) {
      setErrorMessage("กรุณากรอกข้อมูลให้ครบถ้วน");
      return;
    }
 
    setIsSubmitting(true);
    setErrorMessage("");
 
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("No authentication token found");
      }
 
      const formData = new FormData();
      formData.append("owner_id", ownerId);
      formData.append("stadium_name", sportsFieldName);
      formData.append("stadium_address", address);
      formData.append("slipImage", imageFile);
 
      const response = await axios.post(
        "http://localhost:5000/api/sox/add_stadium",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        }
      );
 
      alert("เพิ่มสนามกีฬาสำเร็จ กรุณารอการตรวจสอบจากแอดมิน");
      router.push("/my-stadium");
    } catch (error) {
      console.error("Error adding stadium:", error);
      setErrorMessage(
        error.response?.data?.error || "เกิดข้อผิดพลาดในการเพิ่มสนามกีฬา กรุณาลองใหม่อีกครั้ง"
      );
    } finally {
      setIsSubmitting(false);
    }
  };
 
  return (
    <div
      className="relative w-full h-screen bg-gradient-to-br from-gray-900 via-black to-gray-800 flex flex-col"
      style={{ backgroundImage: "url('/pictureowner/bg.png'), linear-gradient(to bottom right,rgb(255, 255, 255),rgb(160, 159, 159),rgb(128, 128, 128))", backgroundSize: "cover", backgroundPosition: "center" }}
    >
      <Tabbar />
      <br></br><br></br>
      <div className="flex flex-col items-center justify-center flex-grow px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-2xl shadow-xl max-w-4xl w-full transform transition-all duration-300 hover:shadow-2xl">
          {/* Header */}
          <div className="bg-gradient-to-r from-black to-gray-900 text-white text-xl font-bold px-6 py-4 text-center rounded-t-2xl relative z-10">
            เพิ่มสนามกีฬา
          </div>
          <div className="p-6 sm:p-8">
            {/* Error Message */}
            {errorMessage && (
              <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 text-red-700 rounded-r-lg shadow-md animate-slide-in">
                <span className="font-medium">{errorMessage}</span>
              </div>
            )}
 
            {/* Sports Field Name */}
            <label className="block text-gray-800 font-semibold mb-2">ชื่อสนาม</label>
            <input
              type="text"
              value={sportsFieldName}
              onChange={(e) => setSportsFieldName(e.target.value)}
              placeholder="ใส่ชื่อสนามของคุณ"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition-all duration-200 bg-gray-50 shadow-sm"
              disabled={isSubmitting}
            />
 
            {/* Address */}
            <label className="block text-gray-800 font-semibold mt-6 mb-2">ที่ตั้ง</label>
            <textarea
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="รายละเอียดที่อยู่, ตำบล, อำเภอ, จังหวัด, รหัสไปรษณีย์"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition-all duration-200 bg-gray-50 shadow-sm resize-y h-32"
              disabled={isSubmitting}
            />
 
            {/* Image Upload */}
            <label className="block text-gray-800 font-semibold mt-6 mb-2">
              รูปสนามกีฬา
            </label>
            <div className="mb-6">
              <div
                className="relative bg-gray-100 w-48 h-48 flex items-center justify-center cursor-pointer rounded-xl border-2 border-dashed border-gray-400 hover:border-black transition-all duration-300 overflow-hidden shadow-md"
                onClick={() => !isSubmitting && document.getElementById("stadiumImageInput").click()}
              >
                {imagePreview ? (
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="w-full h-full object-cover rounded-xl transition-transform duration-300 hover:scale-105"
                  />
                ) : (
                  <span className="text-gray-500 font-medium flex flex-col items-center">
                    <svg
                      className="w-8 h-8 mb-2 text-black"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M12 4v16m8-8H4"
                      />
                    </svg>
                    + เพิ่มรูป
                  </span>
                )}
                <input
                  id="stadiumImageInput"
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  style={{ display: "none" }}
                  disabled={isSubmitting}
                />
              </div>
              {isFileUploaded && (
                <p className="mt-3 text-sm text-green-600 font-medium animate-fade-in">
                  อัปโหลดรูปสำเร็จ: {fileName}
                </p>
              )}
            </div>
 
            {/* Buttons */}
            <div className="flex justify-between mt-8 gap-4">
              <button
                className="bg-gray-200 px-6 py-2.5 rounded-lg text-gray-700 font-semibold hover:bg-gray-300 disabled:bg-gray-100 disabled:text-gray-400 transition-all duration-200 shadow-md"
                onClick={() => router.push("/my-stadium")}
                disabled={isSubmitting}
              >
                ยกเลิก
              </button>
              <button
                className={`${
                  isSubmitting
                    ? "bg-green-300"
                    : "bg-gradient-to-r from-green-500 to-teal-500 hover:from-green-600 hover:to-teal-600"
                } px-6 py-2.5 rounded-lg text-white font-semibold disabled:bg-green-300 transition-all duration-200 shadow-md`}
                onClick={handleSubmit}
                disabled={isSubmitting}
              >
                {isSubmitting ? "กำลังดำเนินการ..." : "ยืนยัน"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
 
export default AddSportsField;